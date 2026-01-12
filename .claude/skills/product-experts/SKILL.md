---
name: product-experts
description: Ask product-specific expert assistants about OpenGov products. Use when asked about specific product features, capabilities, functionality, technical details, best practices, or product-specific questions for FIN, GAB, BP, PRO, EAM, or PLC.
---

# OpenGov Product Expert Assistants

## Overview

This skill provides access to product-specific AI assistants trained on OpenGov product documentation. Each assistant is an expert on their respective product and can answer detailed questions about features, capabilities, and best practices.

## Environment Requirements

- `OPENAI_API_KEY_MAIN` - For FIN, GAB, BP, PRO, EAM products
- `OPENAI_API_KEY_PLC` - For PLC product (separate project)

## Available Product Experts

| Code | Product | Description |
|------|---------|-------------|
| **FIN** | Financials | OpenGov Financials product expert |
| **GAB** | Government App Builder | Custom government application platform |
| **BP** | Budgeting & Performance | Budget management and performance tracking |
| **PRO** | Procurement & Contract Management | Procurement workflows and contracts |
| **EAM** | Enterprise Asset Management | Asset tracking and maintenance |
| **PLC** | Permitting & Licensing | Permits, licenses, and citizen services |

## Available Tools

### Ask Product Expert (`ask-product-gpt`)

| Tool | Description |
|------|-------------|
| `ask` | Ask a question to a specific product expert |

## Tool Parameters

```
ask(
  product: string,       // Product code: FIN, GAB, BP, PRO, EAM, PLC
  question: string,      // The question to ask
  context?: string,      // Optional context (customer, use case, scenario)
  thread_id?: string     // Optional: Continue previous conversation
)
```

## Common Patterns

### Ask a Product Question
```
ask-product-gpt.ask(
  product: "FIN",
  question: "How does the chart of accounts structure work?"
)
```

### Ask with Context
```
ask-product-gpt.ask(
  product: "BP",
  question: "What's the best approach for mid-year budget amendments?",
  context: "Large municipality with complex departmental structure"
)
```

### Continue a Conversation
```
// First question
response1 = ask-product-gpt.ask(
  product: "PLC",
  question: "How do permit workflows handle inspections?"
)

// Follow-up question using thread_id from response1
response2 = ask-product-gpt.ask(
  product: "PLC",
  question: "Can inspections be scheduled automatically?",
  thread_id: "thread_abc123..."  // From previous response
)
```

## Response Structure

Responses include:
- Product expert identification
- Conversation status (new/continuing)
- The question asked
- Detailed answer from the expert
- Thread ID for continuation
- Run ID for tracking

## When to Use

✅ **Good Use Cases:**
- "How does the budget amendment workflow work in B&P?"
- "What are the key features of the Financials module?"
- "Can EAM track maintenance schedules?"
- "What types of permits can PLC handle?"
- Technical details about product functionality
- Best practices and recommendations
- Product capability questions

❌ **Not Ideal For:**
- General questions not about specific products
- Questions requiring real-time data
- Cross-product comparisons (ask each separately)
- Administrative or account questions

## Tips

1. **Be specific** - Detailed questions get better answers
2. **Provide context** - Customer type, use case, or scenario helps
3. **Use thread_id** - For follow-up questions in the same context
4. **Choose the right expert** - Match product code to question domain
5. **Complex questions** - Break into smaller, focused questions
