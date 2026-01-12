import { tool } from "@opencode-ai/plugin"

/**
 * Aha! Features Tools
 * 
 * Custom tools for accessing Aha! features and roadmap items.
 * Requires AHA_SUBDOMAIN and AHA_API_TOKEN environment variables.
 * 
 * These tools enable product managers and project managers to:
 * - Compare features across products
 * - Analyze roadmap alignment
 * - Track feature status and progress
 * - Identify gaps in planned features
 */

interface AhaFeature {
  id: string
  reference_num: string
  name: string
  description?: string
  created_at: string
  workflow_status?: {
    id: string
    name: string
    color?: string
  }
  release?: {
    id: string
    name: string
    reference_num: string
    released: boolean
    release_date?: string
  }
  assigned_to_user?: {
    id: string
    name: string
    email: string
  }
  tags?: string[]
  score?: number
  progress?: number
  created_by_user?: {
    name: string
    email: string
  }
  url?: string
}

interface AhaInitiative {
  id: string
  reference_num: string
  name: string
  description?: string
  workflow_status?: {
    name: string
  }
  features_count?: number
  created_at?: string
  goals?: Array<{ id: string; name: string }>
  releases?: Array<{ id: string; name: string }>
  assigned_to_user?: {
    id: string
    name: string
    email: string
  }
  tags?: string[]
  progress?: number
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
  description: "List features from Aha! with optional filtering by product, release, or status. Use this to understand what's currently on the roadmap.",
  args: {
    product_id: tool.schema.string().optional().describe("Optional product ID or reference prefix to filter features"),
    release_id: tool.schema.string().optional().describe("Optional release ID to filter features by release"),
    page: tool.schema.number().optional().default(1).describe("Page number for pagination"),
    per_page: tool.schema.number().optional().default(20).describe("Number of features per page (max 100)"),
  },
  async execute(args) {
    try {
      const params = new URLSearchParams({
        page: args.page.toString(),
        per_page: Math.min(args.per_page, 100).toString(),
      })

      let endpoint: string
      if (args.release_id) {
        endpoint = `releases/${args.release_id}/features?${params}`
      } else if (args.product_id) {
        endpoint = `products/${args.product_id}/features?${params}`
      } else {
        endpoint = `features?${params}`
      }

      const data = await fetchFromAha(endpoint)
      const features = data.features || []

      if (features.length === 0) {
        return "No features found in Aha!."
      }

      const featureSummaries = features.map((feature: AhaFeature) => {
        const status = feature.workflow_status?.name || 'No status'
        const release = feature.release?.name || 'Unscheduled'
        const assignee = feature.assigned_to_user?.name || 'Unassigned'
        const tags = feature.tags ? feature.tags.join(', ') : 'none'
        const progress = feature.progress !== undefined ? `${feature.progress}%` : 'N/A'
        
        return `
**${feature.reference_num}: ${feature.name}**
Status: ${status} | Release: ${release} | Progress: ${progress}
Assigned: ${assignee} | Tags: ${tags}
Created: ${new Date(feature.created_at).toLocaleDateString()}
---`
      }).join('\n')

      return `Found ${features.length} features:\n\n${featureSummaries}\n\nTotal features in response: ${features.length}`
    } catch (error) {
      return `Error fetching features: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  },
})

export const get_details = tool({
  description: "Get detailed information about a specific feature by ID or reference number. Includes description, requirements, status, assignments, and linked initiatives (launches).",
  args: {
    feature_id: tool.schema.string().describe("Feature ID or reference number (e.g., 'FEAT-123' or 'PROD-FEAT-1')"),
    include_initiatives: tool.schema.boolean().optional().default(true).describe("Include linked initiative (launch) details"),
  },
  async execute(args) {
    try {
      const data = await fetchFromAha(`features/${args.feature_id}`)
      const feature = data.feature

      if (!feature) {
        return `Feature ${args.feature_id} not found.`
      }

      const status = feature.workflow_status?.name || 'Unknown'
      const release = feature.release ? 
        `${feature.release.name} (${feature.release.released ? 'Released' : 'Planned'})` : 
        'Unscheduled'
      const assignee = feature.assigned_to_user?.name || 'Unassigned'
      const tags = feature.tags ? feature.tags.join(', ') : 'none'
      const progress = feature.progress !== undefined ? `${feature.progress}%` : 'N/A'
      const score = feature.score || 0
      
      let result = `
**${feature.reference_num}: ${feature.name}**

**Description:**
${feature.description || 'No description'}

**Status & Progress:**
- Workflow Status: ${status}
- Progress: ${progress}
- Score: ${score}

**Scheduling:**
- Release: ${release}
- Created: ${new Date(feature.created_at).toLocaleDateString()}
- Created By: ${feature.created_by_user?.name || 'Unknown'}

**Assignment:**
- Assigned To: ${assignee}
- Tags: ${tags}
`

      // Include linked initiatives (launches)
      if (args.include_initiatives && feature.initiative) {
        result += `\n**Linked Initiative (Launch):**\n`
        result += `- ${feature.initiative.reference_num}: ${feature.initiative.name}\n`
        result += `- Status: ${feature.initiative.workflow_status?.name || 'Unknown'}\n`
        
        // Optionally fetch full initiative details
        try {
          const initiativeData = await fetchFromAha(`initiatives/${feature.initiative.id}`)
          const initiative = initiativeData.initiative
          if (initiative) {
            result += `- Progress: ${initiative.progress || 0}%\n`
            result += `- Features: ${initiative.features_count || 0}\n`
            if (initiative.assigned_to_user) {
              result += `- Owner: ${initiative.assigned_to_user.name}\n`
            }
          }
        } catch (e) {
          // If we can't fetch initiative details, just show basic info
        }
      }

      result += `\n**URL:** ${feature.url || 'N/A'}\n`
      
      return result
    } catch (error) {
      return `Error fetching feature details: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  },
})

export const search = tool({
  description: "Search for features in Aha! by keyword or text query. Useful for finding features related to specific functionality or requirements.",
  args: {
    query: tool.schema.string().describe("Search query to find in feature names and descriptions"),
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
        ? `products/${args.product_id}/features?${params}`
        : `features?${params}`

      const data = await fetchFromAha(endpoint)
      const features = data.features || []

      if (features.length === 0) {
        return `No features found matching "${args.query}".`
      }

      const results = features.map((feature: AhaFeature) => {
        const status = feature.workflow_status?.name || 'No status'
        const release = feature.release?.name || 'Unscheduled'
        return `${feature.reference_num}: ${feature.name}\n  Status: ${status} | Release: ${release}`
      }).join('\n\n')

      return `Found ${features.length} features matching "${args.query}":\n\n${results}`
    } catch (error) {
      return `Error searching features: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  },
})

export const compare_with_initiatives = tool({
  description: "Compare features across products or initiatives to identify gaps, overlaps, and alignment. Use this for roadmap review and strategic planning.",
  args: {
    product_id: tool.schema.string().describe("Product ID to analyze features for"),
    include_unscheduled: tool.schema.boolean().optional().default(true).describe("Include unscheduled features in analysis"),
  },
  async execute(args) {
    try {
      // Fetch features for the product
      const featuresData = await fetchFromAha(`products/${args.product_id}/features?per_page=100`)
      const features = featuresData.features || []

      // Fetch initiatives for the product
      const initiativesData = await fetchFromAha(`products/${args.product_id}/epics?per_page=100`)
      const initiatives = initiativesData.epics || []

      if (features.length === 0 && initiatives.length === 0) {
        return `No features or initiatives found for product ${args.product_id}.`
      }

      // Group features by status
      const statusGroups = new Map<string, AhaFeature[]>()
      const releaseGroups = new Map<string, AhaFeature[]>()
      
      features.forEach((feature: AhaFeature) => {
        const status = feature.workflow_status?.name || 'No status'
        if (!statusGroups.has(status)) {
          statusGroups.set(status, [])
        }
        statusGroups.get(status)!.push(feature)

        const release = feature.release?.name || 'Unscheduled'
        if (args.include_unscheduled || release !== 'Unscheduled') {
          if (!releaseGroups.has(release)) {
            releaseGroups.set(release, [])
          }
          releaseGroups.get(release)!.push(feature)
        }
      })

      let result = `
**Roadmap Analysis for Product ${args.product_id}**

**Summary:**
- Total Features: ${features.length}
- Total Initiatives: ${initiatives.length}
- Scheduled Features: ${features.filter((f: AhaFeature) => f.release).length}
- Unscheduled Features: ${features.filter((f: AhaFeature) => !f.release).length}

**Features by Status:**
`
      
      statusGroups.forEach((featureList, status) => {
        result += `\n**${status}:** ${featureList.length} features\n`
        featureList.slice(0, 5).forEach(f => {
          result += `  - ${f.reference_num}: ${f.name}\n`
        })
        if (featureList.length > 5) {
          result += `  ... and ${featureList.length - 5} more\n`
        }
      })

      result += `\n**Features by Release:**\n`
      releaseGroups.forEach((featureList, release) => {
        result += `\n**${release}:** ${featureList.length} features\n`
        featureList.slice(0, 3).forEach(f => {
          result += `  - ${f.reference_num}: ${f.name}\n`
        })
        if (featureList.length > 3) {
          result += `  ... and ${featureList.length - 3} more\n`
        }
      })

      if (initiatives.length > 0) {
        result += `\n**Active Initiatives:**\n`
        initiatives.slice(0, 10).forEach((initiative: AhaInitiative) => {
          result += `- ${initiative.reference_num}: ${initiative.name} (${initiative.features_count || 0} features)\n`
        })
      }

      return result
    } catch (error) {
      return `Error comparing features: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  },
})

export const list_by_release = tool({
  description: "List all features grouped by release to understand delivery timelines and release scope",
  args: {
    product_id: tool.schema.string().describe("Product ID or reference prefix"),
    include_released: tool.schema.boolean().optional().default(false).describe("Include already released features"),
  },
  async execute(args) {
    try {
      const data = await fetchFromAha(`products/${args.product_id}/features?per_page=100`)
      const features = data.features || []

      if (features.length === 0) {
        return `No features found for product ${args.product_id}.`
      }

      // Filter and group by release
      const releaseGroups = new Map<string, AhaFeature[]>()
      
      features.forEach((feature: AhaFeature) => {
        // Skip released features if not included
        if (!args.include_released && feature.release?.released) {
          return
        }

        const releaseName = feature.release?.name || 'Unscheduled'
        if (!releaseGroups.has(releaseName)) {
          releaseGroups.set(releaseName, [])
        }
        releaseGroups.get(releaseName)!.push(feature)
      })

      let result = `**Features by Release for ${args.product_id}**\n\n`
      
      releaseGroups.forEach((featureList, release) => {
        result += `\n**${release}** (${featureList.length} features)\n`
        featureList.forEach(feature => {
          const status = feature.workflow_status?.name || 'No status'
          const progress = feature.progress !== undefined ? `${feature.progress}%` : 'N/A'
          result += `  ${feature.reference_num}: ${feature.name}\n    Status: ${status} | Progress: ${progress}\n`
        })
      })

      return result
    } catch (error) {
      return `Error listing features by release: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  },
})

export const get_initiative = tool({
  description: "Get detailed information about a specific initiative (launch) by ID or reference number. Includes features, goals, and progress.",
  args: {
    initiative_id: tool.schema.string().describe("Initiative ID or reference number (e.g., 'INIT-123' or 'PROD-I-1')"),
  },
  async execute(args) {
    try {
      const data = await fetchFromAha(`initiatives/${args.initiative_id}`)
      const initiative = data.initiative

      if (!initiative) {
        return `Initiative ${args.initiative_id} not found.`
      }

      const status = initiative.workflow_status?.name || 'Unknown'
      const assignee = initiative.assigned_to_user?.name || 'Unassigned'
      const tags = initiative.tags ? initiative.tags.join(', ') : 'none'
      const progress = initiative.progress !== undefined ? `${initiative.progress}%` : 'N/A'
      const goals = initiative.goals ? initiative.goals.map((g: any) => g.name).join(', ') : 'none'
      
      let result = `
**${initiative.reference_num}: ${initiative.name}**

**Description:**
${initiative.description || 'No description'}

**Status & Progress:**
- Workflow Status: ${status}
- Progress: ${progress}
- Features Count: ${initiative.features_count || 0}

**Alignment:**
- Goals: ${goals}
- Created: ${new Date(initiative.created_at).toLocaleDateString()}

**Assignment:**
- Assigned To: ${assignee}
- Tags: ${tags}
`

      // List associated releases if available
      if (initiative.releases && initiative.releases.length > 0) {
        result += `\n**Associated Releases:**\n`
        initiative.releases.forEach((release: any) => {
          result += `- ${release.name}\n`
        })
      }

      return result
    } catch (error) {
      return `Error fetching initiative details: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  },
})

export const list_features_by_initiative = tool({
  description: "List all features associated with a specific initiative (launch). Use when you have an initiative context and want to see all related features.",
  args: {
    initiative_id: tool.schema.string().describe("Initiative ID or reference number"),
    page: tool.schema.number().optional().default(1).describe("Page number for pagination"),
    per_page: tool.schema.number().optional().default(20).describe("Number of features per page (max 100)"),
  },
  async execute(args) {
    try {
      const params = new URLSearchParams({
        page: args.page.toString(),
        per_page: Math.min(args.per_page, 100).toString(),
      })

      const data = await fetchFromAha(`initiatives/${args.initiative_id}/features?${params}`)
      const features = data.features || []

      if (features.length === 0) {
        return `No features found for initiative ${args.initiative_id}.`
      }

      // Group features by status
      const statusGroups = new Map<string, AhaFeature[]>()
      
      features.forEach((feature: AhaFeature) => {
        const status = feature.workflow_status?.name || 'No status'
        if (!statusGroups.has(status)) {
          statusGroups.set(status, [])
        }
        statusGroups.get(status)!.push(feature)
      })

      let result = `**Features in Initiative ${args.initiative_id}** (${features.length} total)\n\n`
      
      // Show summary by status
      statusGroups.forEach((featureList, status) => {
        result += `\n**${status}** (${featureList.length} features)\n`
        featureList.forEach(feature => {
          const release = feature.release?.name || 'Unscheduled'
          const progress = feature.progress !== undefined ? `${feature.progress}%` : 'N/A'
          const assignee = feature.assigned_to_user?.name || 'Unassigned'
          
          result += `  ${feature.reference_num}: ${feature.name}\n`
          result += `    Release: ${release} | Progress: ${progress} | Assigned: ${assignee}\n`
        })
      })

      return result
    } catch (error) {
      return `Error listing features for initiative: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  },
})
