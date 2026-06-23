import { Accordion } from "@base-ui/react";

const triggerCls =
  "group flex w-full items-center justify-between gap-4 bg-transparent px-3 py-4 text-left text-sm font-normal text-fg select-none";

const panelCls =
  "h-[var(--accordion-panel-height)] overflow-hidden text-sm text-fg-muted transition-[height] duration-150 ease-[ease-out] data-ending-style:h-0 data-starting-style:h-0";

const itemCls = "border-b border-border last:border-b-0";

const iconCls =
  "ph ph-caret-down transition-transform duration-150 group-data-[panel-open]:rotate-180";

export function Faq() {
  return (
    <Accordion.Root className="flex w-full flex-col">
      <Accordion.Item className={itemCls}>
        <Accordion.Header>
          <Accordion.Trigger className={triggerCls}>
            How does it work?
            <i className={iconCls}></i>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel className={panelCls}>
          <div className="px-3 pb-3 flex flex-col gap-3">
            <p>
              You connect valv to your database and write your access policies in
              code. Your agent gets a few tools instead of a SQL connection.
            </p>
            <p>
              The model composes a structured query. valv checks it against your
              schema, scopes it to the caller, compiles it to SQL, and runs it.
            </p>
          </div>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item className={itemCls}>
        <Accordion.Header>
          <Accordion.Trigger className={triggerCls}>
            What are common use cases?
            <i className={iconCls}></i>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel className={panelCls}>
          <div className="px-3 pb-3">
            Plain-language questions over your own data. Analytics agents, internal
            copilots, support bots that read live records. Anywhere you want an LLM
            to query a database without handing it the keys.
          </div>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item className={itemCls}>
        <Accordion.Header>
          <Accordion.Trigger className={triggerCls}>
            Is it secure?
            <i className={iconCls}></i>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel className={panelCls}>
          <div className="px-3 pb-3 flex flex-col gap-3">
            <p>
              Yes, by construction. The model's query is untrusted. valv rebuilds
              and re-checks it against your schema and policies before any SQL
              exists.
            </p>
            <p>
              It can't read a column you hid, see a row outside the caller's scope,
              or call a function you didn't allow, even under prompt injection.
            </p>
          </div>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item className={itemCls}>
        <Accordion.Header>
          <Accordion.Trigger className={triggerCls}>
            How does it compare to raw SQL?
            <i className={iconCls}></i>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel className={panelCls}>
          <div className="px-3 pb-3 flex flex-col gap-3">
            <p>
              Hand an agent a SQL tool and it can read any column, any tenant's
              rows, or drop a table. Prompt injection goes straight through.
            </p>
            <p>
              valv only accepts a structured query it can verify, scoped to the
              caller. You keep real analytics like filters and aggregates, without
              the blast radius.
            </p>
            <p>
              It also caps how much comes back, so a query can't dump thousands of
              rows into the model's context and burn your token budget.
            </p>
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
  );
}
