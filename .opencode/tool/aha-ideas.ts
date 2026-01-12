import { tool } from "@opencode-ai/plugin"

/**
 * Aha! Ideas Tools
 * 
 * Custom tools for accessing Aha! customer feedback and feature requests.
 * Requires AHA_SUBDOMAIN and AHA_API_TOKEN environment variables.
 */

interface AhaIdea {
  id: string
  reference_num: string
  name: string
  description: string
  created_at: string
  promoted: boolean
  score: number
  categories?: Array<{ name: string }>
  tags?: string[]
}

interface AhaOrganization {
  id: string
  reference_num: string
  name: string
  custom_fields?: Record<string, any>
}

async function fetchFromAha(endpoint: string): Promise<any> {
  const subdomain = process.env.AHA_SUBDOMAIN
  const apiToken = process.env.AHA_API_TOKEN

  if (!subdomain || !apiToken) {
    throw new Error("Aha! credentials not configured. AHA_SUBDOMAIN and AHA_API_TOKEN environment variables are required.")
  }

  const url = `https://${subdomain}.aha.io/api/v1/${endpoint}`
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Aha! API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export const list = tool({
  description: "List ideas (customer feature requests) from Aha! with optional filtering by product",
  args: {
    product_id: tool.schema.string().optional().describe("Optional product ID or reference number to filter ideas"),
    page: tool.schema.number().optional().default(1).describe("Page number for pagination"),
    per_page: tool.schema.number().optional().default(20).describe("Number of ideas per page (max 100)"),
  },
  async execute(args) {
    try {
      const params = new URLSearchParams({
        page: args.page.toString(),
        per_page: Math.min(args.per_page, 100).toString(),
      })

      const endpoint = args.product_id 
        ? `products/${args.product_id}/ideas?${params}`
        : `ideas?${params}`

      const data = await fetchFromAha(endpoint)
      const ideas = data.ideas || []

      if (ideas.length === 0) {
        return "No ideas found in Aha!."
      }

      const ideaSummaries = ideas.map((idea: AhaIdea) => {
        const tags = idea.tags ? idea.tags.join(', ') : 'none'
        const categories = idea.categories ? idea.categories.map(c => c.name).join(', ') : 'none'
        const promoted = idea.promoted ? '⭐ PROMOTED' : ''
        
        return `
**${idea.reference_num}: ${idea.name}** ${promoted}
Score: ${idea.score || 0} | Created: ${new Date(idea.created_at).toLocaleDateString()}
Categories: ${categories} | Tags: ${tags}
Description: ${idea.description ? idea.description.substring(0, 200) : 'No description'}...
---`
      }).join('\n')

      return `Found ${ideas.length} ideas:\n\n${ideaSummaries}\n\nTotal ideas in response: ${ideas.length}`
    } catch (error) {
      return `Error fetching ideas: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  },
})

export const search = tool({
  description: "Search for ideas in Aha! by keyword or text query",
  args: {
    query: tool.schema.string().describe("Search query to find in idea names and descriptions"),
    product_id: tool.schema.string().optional().describe("Optional product ID to limit search scope"),
    per_page: tool.schema.number().optional().default(20).describe("Number of results (max 100)"),
  },
  async execute(args) {
    try {
      const params = new URLSearchParams({
        q: args.query,
        per_page: Math.min(args.per_page, 100).toString(),
      })

      const endpoint = args.product_id
        ? `products/${args.product_id}/ideas?${params}`
        : `ideas?${params}`

      const data = await fetchFromAha(endpoint)
      const ideas = data.ideas || []

      if (ideas.length === 0) {
        return `No ideas found matching "${args.query}".`
      }

      const results = ideas.map((idea: AhaIdea) => 
        `${idea.reference_num}: ${idea.name} (Score: ${idea.score || 0})`
      ).join('\n')

      return `Found ${ideas.length} ideas matching "${args.query}":\n\n${results}`
    } catch (error) {
      return `Error searching ideas: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  },
})

export const get_details = tool({
  description: "Get detailed information about a specific idea by ID or reference number",
  args: {
    idea_id: tool.schema.string().describe("Idea ID or reference number (e.g., 'IDEA-123')"),
  },
  async execute(args) {
    try {
      const data = await fetchFromAha(`ideas/${args.idea_id}`)
      const idea = data.idea

      if (!idea) {
        return `Idea ${args.idea_id} not found.`
      }

      const tags = idea.tags ? idea.tags.join(', ') : 'none'
      const categories = idea.categories ? idea.categories.map((c: any) => c.name).join(', ') : 'none'
      
      return `
**${idea.reference_num}: ${idea.name}**
${idea.promoted ? '⭐ PROMOTED TO FEATURE' : ''}

**Description:**
${idea.description || 'No description'}

**Details:**
- Score: ${idea.score || 0}
- Created: ${new Date(idea.created_at).toLocaleDateString()}
- Categories: ${categories}
- Tags: ${tags}
- Status: ${idea.workflow_status?.name || 'Unknown'}
- Votes: ${idea.votes_count || 0}
- Comments: ${idea.comments_count || 0}

**Created by:** ${idea.created_by_user?.name || 'Unknown'}
`
    } catch (error) {
      return `Error fetching idea details: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  },
})

export const list_organizations = tool({
  description: "List organizations (customer accounts) from Aha! with their ARR and priority data",
  args: {
    page: tool.schema.number().optional().default(1).describe("Page number for pagination"),
    per_page: tool.schema.number().optional().default(20).describe("Number of organizations per page (max 100)"),
  },
  async execute(args) {
    try {
      const params = new URLSearchParams({
        page: args.page.toString(),
        per_page: Math.min(args.per_page, 100).toString(),
      })

      const data = await fetchFromAha(`idea_portal_users?${params}`)
      const organizations = data.idea_portal_users || []

      if (organizations.length === 0) {
        return "No organizations found in Aha!."
      }

      // Group by organization
      const orgMap = new Map<string, any>()
      for (const user of organizations) {
        if (user.organization) {
          const orgId = user.organization.id
          if (!orgMap.has(orgId)) {
            orgMap.set(orgId, {
              id: orgId,
              name: user.organization.name,
              reference_num: user.organization.reference_num,
              custom_fields: user.organization.custom_fields || {},
              user_count: 0
            })
          }
          orgMap.get(orgId).user_count++
        }
      }

      const orgSummaries = Array.from(orgMap.values()).map(org => {
        const arr = org.custom_fields.ARR || org.custom_fields.arr || 'N/A'
        const tier = org.custom_fields.Tier || org.custom_fields.tier || 'N/A'
        
        return `**${org.reference_num}: ${org.name}**
ARR: $${arr} | Tier: ${tier} | Users: ${org.user_count}
---`
      }).join('\n')

      return `Found ${orgMap.size} organizations:\n\n${orgSummaries}`
    } catch (error) {
      return `Error fetching organizations: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  },
})
