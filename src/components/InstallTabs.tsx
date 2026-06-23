import { useState } from "react"
import { Select } from "@base-ui/react/select"
import { CopyCommand } from "./CopyCommand"
import type { DbKey } from "../lib/snippets"

function McpIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18 84.8528L85.8822 16.9706C95.2548 7.59798 110.451 7.59798 119.823 16.9706V16.9706C129.196 26.3431 129.196 41.5391 119.823 50.9117L68.5581 102.177"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M69.2652 101.47L119.823 50.9117C129.196 41.5391 144.392 41.5391 153.765 50.9117L154.118 51.2652C163.491 60.6378 163.491 75.8338 154.118 85.2063L92.7248 146.6C89.6006 149.724 89.6006 154.789 92.7248 157.913L105.331 170.52"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M102.853 33.9411L52.6482 84.1457C43.2756 93.5183 43.2756 108.714 52.6482 118.087V118.087C62.0208 127.459 77.2167 127.459 86.5893 118.087L136.794 67.8822"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
      />
    </svg>
  )
}

function TsIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#fff" height="512" rx="50" width="512" />
      <path
        clipRule="evenodd"
        d="m316.939 407.424v50.061c8.138 4.172 17.763 7.3 28.875 9.386s22.823 3.129 35.135 3.129c11.999 0 23.397-1.147 34.196-3.442 10.799-2.294 20.268-6.075 28.406-11.342 8.138-5.266 14.581-12.15 19.328-20.65s7.121-19.007 7.121-31.522c0-9.074-1.356-17.026-4.069-23.857s-6.625-12.906-11.738-18.225c-5.112-5.319-11.242-10.091-18.389-14.315s-15.207-8.213-24.18-11.967c-6.573-2.712-12.468-5.345-17.685-7.9-5.217-2.556-9.651-5.163-13.303-7.822-3.652-2.66-6.469-5.476-8.451-8.448-1.982-2.973-2.974-6.336-2.974-10.091 0-3.441.887-6.544 2.661-9.308s4.278-5.136 7.512-7.118c3.235-1.981 7.199-3.52 11.894-4.615 4.696-1.095 9.912-1.642 15.651-1.642 4.173 0 8.581.313 13.224.938 4.643.626 9.312 1.591 14.008 2.894 4.695 1.304 9.259 2.947 13.694 4.928 4.434 1.982 8.529 4.276 12.285 6.884v-46.776c-7.616-2.92-15.937-5.084-24.962-6.492s-19.381-2.112-31.066-2.112c-11.895 0-23.163 1.278-33.805 3.833s-20.006 6.544-28.093 11.967c-8.086 5.424-14.476 12.333-19.171 20.729-4.695 8.395-7.043 18.433-7.043 30.114 0 14.914 4.304 27.638 12.912 38.172 8.607 10.533 21.675 19.45 39.204 26.751 6.886 2.816 13.303 5.579 19.25 8.291s11.086 5.528 15.415 8.448c4.33 2.92 7.747 6.101 10.252 9.543 2.504 3.441 3.756 7.352 3.756 11.733 0 3.233-.783 6.231-2.348 8.995s-3.939 5.162-7.121 7.196-7.147 3.624-11.894 4.771c-4.748 1.148-10.303 1.721-16.668 1.721-10.851 0-21.597-1.903-32.24-5.71-10.642-3.806-20.502-9.516-29.579-17.13zm-84.159-123.342h64.22v-41.082h-179v41.082h63.906v182.918h50.874z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  )
}

const TABS = {
  mcp: { label: "MCP", Icon: McpIcon },
  ts: { label: "Typescript", Icon: TsIcon },
} as const

type TabKey = keyof typeof TABS

const DB_LABELS: Record<DbKey, string> = {
  prisma: "Prisma",
  clickhouse: "ClickHouse",
}

function command(tab: TabKey, db: DbKey): string {
  if (tab === "mcp") return "npx @valv/mcp@latest init"
  return `npm i @valv/core @valv/${db}`
}

interface InstallTabsProps {
  /** Shiki-highlighted TypeScript, keyed by database. Rendered at build time. */
  highlighted: Record<DbKey, string>
}

export function InstallTabs({ highlighted }: InstallTabsProps) {
  const [active, setActive] = useState<TabKey>("mcp")
  const [db, setDb] = useState<DbKey>("prisma")

  return (
    <div className="w-full flex flex-col items-center gap-5">
      <div className="w-fit flex items-center gap-1 p-1 rounded-sm ring-[1px] ring-border bg-bg">
        {(Object.keys(TABS) as TabKey[]).map((key) => {
          const t = TABS[key]
          const isActive = active === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className={`h-7 px-3 rounded-[2px] text-sm flex items-center gap-2 cursor-pointer transition-colors ${
                isActive ? "bg-bg-muted text-fg" : "text-fg-muted hover:text-fg"
              }`}
            >
              <t.Icon />
              {t.label}
            </button>
          )
        })}
      </div>
      <div className="w-full flex flex-col">
        <div className="relative w-full h-[32px] rounded-t-sm ring-[1px] ring-border bg-bg">
          <CopyCommand
            key={`${active}-${db}`}
            command={command(active, db)}
            className="w-full h-[32px] text-white/60 hover:text-white/80 transition-all gap-3 cursor-pointer bg-transparent flex items-center justify-center"
          />
          {active === "ts" && (
            <div className="absolute inset-y-0 right-0 flex items-stretch">
              <div className="w-px self-stretch bg-border" />
              <DbSelect value={db} onChange={setDb} />
            </div>
          )}
        </div>
        <div className="w-full rounded-b-sm ring-[1px] ring-border bg-bg overflow-x-auto">
          {active === "ts" ? (
            <div
              className="install-code text-xs leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlighted[db] }}
            />
          ) : (
            <McpConversation />
          )}
        </div>
      </div>
    </div>
  )
}

function DbSelect({
  value,
  onChange,
}: {
  value: DbKey
  onChange: (db: DbKey) => void
}) {
  return (
    <Select.Root
      items={DB_LABELS}
      value={value}
      onValueChange={(v) => onChange(v as DbKey)}
    >
      <Select.Trigger className="h-[32px] px-3 flex items-center gap-2 text-xs text-fg-muted hover:text-fg transition-colors cursor-pointer select-none outline-none">
        <Select.Value />
        <Select.Icon>
          <i className="ph ph-caret-down text-[0.9em]"></i>
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={6} alignItemWithTrigger={false} align="end">
          <Select.Popup className="min-w-[var(--anchor-width)] rounded-sm ring-[1px] ring-border bg-bg-elevated p-1 text-xs text-fg-muted shadow-lg outline-none">
            {(Object.keys(DB_LABELS) as DbKey[]).map((key) => (
              <Select.Item
                key={key}
                value={key}
                className="flex items-center justify-between gap-4 px-2.5 py-1.5 rounded-[2px] cursor-pointer select-none outline-none data-[highlighted]:bg-bg-muted data-[highlighted]:text-fg"
              >
                <Select.ItemText>{DB_LABELS[key]}</Select.ItemText>
                <Select.ItemIndicator>
                  <i className="ph ph-check text-[0.9em]"></i>
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  )
}

const CHART = [
  { label: "Oak", value: 1240 },
  { label: "Walnut", value: 980 },
  { label: "Maple", value: 760 },
  { label: "Pine", value: 540 },
  { label: "Birch", value: 410 },
]
const CHART_MAX = 1240

/** A mock Claude Code transcript: the agent queries via the valv MCP, then
    charts the result with the /valv skill. */
function McpConversation() {
  return (
    <div className="p-5 flex flex-col gap-4 font-mono text-[13px] leading-relaxed text-left">
      <div className="flex gap-2.5">
        <span className="select-none text-fg-subtle">&gt;</span>
        <span className="text-fg">
          <span className="text-blue-400/90">/valv</span> Which materials get
          downloaded the most?
        </span>
      </div>

      <div className="flex gap-2.5">
        <span className="select-none text-blue-400/80">⏺</span>
        <span className="text-fg-muted">Let me query that and chart it.</span>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex gap-2.5">
          <span className="select-none text-blue-400/80">⏺</span>
          <span className="text-fg">
            query <span className="text-fg-subtle">(valv MCP)</span>
          </span>
        </div>
        <div className="flex gap-2.5 pl-[1.4em] text-fg-subtle">
          <span className="select-none text-fg-faint">⎿</span>
          <span>select material, count() · group by material → 6 rows</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex gap-2.5">
          <span className="select-none text-blue-400/80">⏺</span>
          <span className="text-fg">
            /valv <span className="text-fg-subtle">skill</span>
          </span>
        </div>
        <div className="flex gap-2.5 pl-[1.4em] text-fg-subtle">
          <span className="select-none text-fg-faint">⎿</span>
          <span>downloads-by-material.html</span>
        </div>
      </div>

      <div className="ml-[1.4em] rounded-sm ring-[1px] ring-border bg-bg-elevated p-4 flex flex-col gap-3 font-sans">
        <div className="text-xs text-fg-muted">Downloads by material · this month</div>
        <div className="flex flex-col gap-2">
          {CHART.map((row) => (
            <div key={row.label} className="flex items-center gap-3 text-xs">
              <span className="w-14 shrink-0 text-fg-muted">{row.label}</span>
              <div className="flex-1 h-4 rounded-[2px] bg-bg-muted overflow-hidden">
                <div
                  className="h-full rounded-[2px] bg-fg-muted"
                  style={{ width: `${(row.value / CHART_MAX) * 100}%` }}
                />
              </div>
              <span className="w-12 shrink-0 text-right tabular-nums text-fg-subtle">
                {row.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2.5">
        <span className="select-none text-blue-400/80">⏺</span>
        <span className="text-fg-muted">
          Oak leads at 1,240 downloads — well ahead of walnut and maple.
        </span>
      </div>
    </div>
  )
}
