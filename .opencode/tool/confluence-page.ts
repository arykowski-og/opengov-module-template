import { tool } from "@opencode-ai/plugin"

/**
 * Confluence Page Tools
 * 
 * Custom tools for accessing Confluence pages and documentation.
 * Requires CONFLUENCE_DOMAIN, CONFLUENCE_EMAIL, and CONFLUENCE_API_TOKEN environment variables.
 */

interface ConfluencePage {
  id: string
  status: string
  title: string
  spaceId: string
  parentId?: string
  parentType?: string
  position?: number
  authorId: string
  ownerId?: string
  lastOwnerId?: string
  createdAt: string
  version: {
    createdAt: string
    message: string
    number: number
    minorEdit: boolean
    authorId: string
  }
  body?: {
    storage?: {
      value: string
      representation: string
    }
    atlas_doc_format?: {
      value: string
      representation: string
    }
  }
  _links: {
    webui: string
    editui: string
    tinyui: string
  }
}

async function fetchFromConfluence(endpoint: string): Promise<any> {
  const domain = process.env.CONFLUENCE_DOMAIN
  const email = process.env.CONFLUENCE_EMAIL
  const apiToken = process.env.CONFLUENCE_API_TOKEN

  if (!domain || !email || !apiToken) {
    throw new Error("Confluence credentials not configured. CONFLUENCE_DOMAIN, CONFLUENCE_EMAIL, and CONFLUENCE_API_TOKEN environment variables are required.")
  }

  // Remove https:// or http:// if present
  const cleanDomain = domain.replace(/^https?:\/\//, '')
  
  const url = `https://${cleanDomain}/wiki/api/v2/${endpoint}`
  
  // Create basic auth header
  const auth = Buffer.from(`${email}:${apiToken}`).toString('base64')
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Confluence API error: ${response.status} ${response.statusText} - ${errorText}`)
  }

  return response.json()
}

export const get_page = tool({
  description: "Get a Confluence page by ID, including its title, content, and metadata",
  args: {
    page_id: tool.schema.string().describe("Page ID (numeric ID from Confluence)"),
    include_body: tool.schema.boolean().optional().default(true).describe("Include page body content"),
  },
  async execute(args) {
    try {
      const bodyFormat = args.include_body ? '?body-format=storage' : ''
      const data = await fetchFromConfluence(`pages/${args.page_id}${bodyFormat}`)
      const page = data as ConfluencePage

      if (!page) {
        return `Page ${args.page_id} not found.`
      }

      let result = `
**${page.title}**

**Page Details:**
- ID: ${page.id}
- Status: ${page.status}
- Space ID: ${page.spaceId}
- Created: ${new Date(page.createdAt).toLocaleDateString()}
- Last Modified: ${new Date(page.version.createdAt).toLocaleDateString()}
- Version: ${page.version.number}
- Web URL: https://${process.env.CONFLUENCE_DOMAIN}/wiki${page._links.webui}
`

      if (args.include_body && page.body) {
        const content = page.body.storage?.value || page.body.atlas_doc_format?.value || 'No content available'
        // Limit content preview to 2000 characters
        const preview = content.length > 2000 ? content.substring(0, 2000) + '...' : content
        result += `\n**Content:**\n${preview}\n`
      }

      return result
    } catch (error) {
      return `Error fetching page: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  },
})

export const search_pages = tool({
  description: "Search for Confluence pages by text query",
  args: {
    query: tool.schema.string().describe("Search query to find in page titles and content"),
    space_id: tool.schema.string().optional().describe("Optional space ID to limit search scope"),
    limit: tool.schema.number().optional().default(10).describe("Number of results to return (max 25)"),
  },
  async execute(args) {
    try {
      const params = new URLSearchParams({
        title: args.query,
        limit: Math.min(args.limit, 25).toString(),
      })

      if (args.space_id) {
        params.append('space-id', args.space_id)
      }

      const data = await fetchFromConfluence(`pages?${params}`)
      const pages = data.results || []

      if (pages.length === 0) {
        return `No pages found matching "${args.query}".`
      }

      const pageList = pages.map((page: ConfluencePage) => 
        `**${page.title}**\nID: ${page.id} | Space: ${page.spaceId} | Modified: ${new Date(page.version.createdAt).toLocaleDateString()}\nURL: https://${process.env.CONFLUENCE_DOMAIN}/wiki${page._links.webui}\n---`
      ).join('\n')

      return `Found ${pages.length} pages matching "${args.query}":\n\n${pageList}`
    } catch (error) {
      return `Error searching pages: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  },
})

export const list_pages_in_space = tool({
  description: "List pages in a specific Confluence space",
  args: {
    space_id: tool.schema.string().describe("Space ID to list pages from"),
    limit: tool.schema.number().optional().default(25).describe("Number of pages to return (max 250)"),
    cursor: tool.schema.string().optional().describe("Pagination cursor for next page of results"),
  },
  async execute(args) {
    try {
      const params = new URLSearchParams({
        'space-id': args.space_id,
        limit: Math.min(args.limit, 250).toString(),
      })

      if (args.cursor) {
        params.append('cursor', args.cursor)
      }

      const data = await fetchFromConfluence(`pages?${params}`)
      const pages = data.results || []

      if (pages.length === 0) {
        return `No pages found in space ${args.space_id}.`
      }

      const pageList = pages.map((page: ConfluencePage) => 
        `**${page.title}**\nID: ${page.id} | Version: ${page.version.number} | Modified: ${new Date(page.version.createdAt).toLocaleDateString()}\n---`
      ).join('\n')

      let result = `Found ${pages.length} pages in space ${args.space_id}:\n\n${pageList}`

      if (data._links?.next) {
        result += `\n\n*More results available - use cursor: ${data._links.next}*`
      }

      return result
    } catch (error) {
      return `Error listing pages: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  },
})

export const get_page_children = tool({
  description: "Get child pages of a specific Confluence page",
  args: {
    page_id: tool.schema.string().describe("Parent page ID"),
    limit: tool.schema.number().optional().default(25).describe("Number of child pages to return (max 250)"),
  },
  async execute(args) {
    try {
      const params = new URLSearchParams({
        limit: Math.min(args.limit, 250).toString(),
      })

      const data = await fetchFromConfluence(`pages/${args.page_id}/children?${params}`)
      const children = data.results || []

      if (children.length === 0) {
        return `Page ${args.page_id} has no child pages.`
      }

      const childList = children.map((page: ConfluencePage) => 
        `**${page.title}**\nID: ${page.id} | Version: ${page.version.number}\nURL: https://${process.env.CONFLUENCE_DOMAIN}/wiki${page._links.webui}\n---`
      ).join('\n')

      return `Found ${children.length} child pages:\n\n${childList}`
    } catch (error) {
      return `Error fetching child pages: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  },
})
