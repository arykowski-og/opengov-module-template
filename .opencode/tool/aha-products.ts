import { tool } from "@opencode-ai/plugin"

/**
 * Aha! Products Tools
 * 
 * Custom tools for accessing Aha! products and features.
 * Requires AHA_SUBDOMAIN and AHA_API_TOKEN environment variables.
 */

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
  description: "List all products from Aha!",
  args: {},
  async execute() {
    try {
      const data = await fetchFromAha('products')
      const products = data.products || []

      if (products.length === 0) {
        return "No products found in Aha!."
      }

      const productList = products.map((product: any) => 
        `**${product.reference_prefix}: ${product.name}**\n${product.description || 'No description'}\n---`
      ).join('\n')

      return `Found ${products.length} products:\n\n${productList}`
    } catch (error) {
      return `Error fetching products: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  },
})

export const get_details = tool({
  description: "Get detailed information about a specific product",
  args: {
    product_id: tool.schema.string().describe("Product ID or reference prefix (e.g., 'PROD')"),
  },
  async execute(args) {
    try {
      const data = await fetchFromAha(`products/${args.product_id}`)
      const product = data.product

      if (!product) {
        return `Product ${args.product_id} not found.`
      }

      return `
**${product.reference_prefix}: ${product.name}**

**Description:**
${product.description || 'No description'}

**Details:**
- Created: ${new Date(product.created_at).toLocaleDateString()}
- Product Line: ${product.product_line?.name || 'None'}
- Workflow Status: ${product.workflow_status?.name || 'Unknown'}

**Initiatives:** ${product.initiatives_count || 0}
**Features:** ${product.features_count || 0}  
**Ideas:** ${product.ideas_count || 0}
`
    } catch (error) {
      return `Error fetching product details: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  },
})

export const list_features = tool({
  description: "List features for a specific product",
  args: {
    product_id: tool.schema.string().describe("Product ID or reference prefix"),
    page: tool.schema.number().optional().default(1).describe("Page number"),
    per_page: tool.schema.number().optional().default(20).describe("Features per page (max 100)"),
  },
  async execute(args) {
    try {
      const params = new URLSearchParams({
        page: args.page.toString(),
        per_page: Math.min(args.per_page, 100).toString(),
      })

      const data = await fetchFromAha(`products/${args.product_id}/features?${params}`)
      const features = data.features || []

      if (features.length === 0) {
        return `No features found for product ${args.product_id}.`
      }

      const featureList = features.map((feature: any) => 
        `**${feature.reference_num}: ${feature.name}**\nStatus: ${feature.workflow_status?.name || 'Unknown'} | Release: ${feature.release?.name || 'Unscheduled'}\n---`
      ).join('\n')

      return `Found ${features.length} features for ${args.product_id}:\n\n${featureList}`
    } catch (error) {
      return `Error fetching features: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  },
})
