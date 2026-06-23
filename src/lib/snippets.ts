export type DbKey = "prisma" | "clickhouse"

const tsCode = (adapter: DbKey) => `import { createValv } from "@valv/${adapter}"
import { generateText } from "ai"

// Introspect the live schema; deny every table until allowed.
const valv = await createValv(client, {
  schema: "introspect",
  defaultPolicy: "deny-all",
})

valv.policy("orders", (ctx) => ({
  read:   { tenant_id: ctx.tenant.id },  // rows scoped to the caller
  fields: { deny: ["internal_notes"] },  // column never reaches the model
}))

// The model emits a validated query — never SQL.
const { text } = await generateText({
  model,
  tools: await valv.tools.aisdk({ tenant: { id: "acme" } }),
  prompt: "Revenue per order status this month?",
})`

export const TS_CODE: Record<DbKey, string> = {
  prisma: tsCode("prisma"),
  clickhouse: tsCode("clickhouse"),
}
