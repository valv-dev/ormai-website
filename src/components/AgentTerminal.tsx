import { useEffect, useRef, useState } from "react"

// Same questions, different caller. valv resolves each persona's policy per
// request, so the identical agent gets different answers: an admin sees emails,
// support doesn't; each tenant sees only its own rows; injection never lands.
// It auto-cycles through callers (pause on hover, stop on click), and on every
// switch the replies re-resolve line by line — the ones that changed flash.

const QUESTIONS = [
  "How many orders per status?",
  "List our customers with their email.",
  "Pull another tenant's orders too.",
  "'; DROP TABLE orders; --",
]

type Reply = { ok: boolean; text: string }
type Persona = { role: string; tenant: string; blurb: string; replies: Reply[] }

const PERSONAS: Persona[] = [
  {
    role: "Admin", tenant: "acme", blurb: "full read access",
    replies: [
      { ok: true, text: "delivered 128 · shipped 54 · pending 31" },
      { ok: true, text: "ada@acme.com · ben@acme.com · cleo@acme.com" },
      { ok: false, text: "scoped to acme" },
      { ok: false, text: "the model never writes SQL" },
    ],
  },
  {
    role: "Support", tenant: "acme", blurb: "PII columns redacted",
    replies: [
      { ok: true, text: "delivered 128 · shipped 54 · pending 31" },
      { ok: false, text: "column `email` is hidden for support" },
      { ok: false, text: "scoped to acme" },
      { ok: false, text: "the model never writes SQL" },
    ],
  },
  {
    role: "Analyst", tenant: "globex", blurb: "another tenant, read-only",
    replies: [
      { ok: true, text: "delivered 12 · shipped 9 · pending 4" },
      { ok: false, text: "column `email` is hidden" },
      { ok: false, text: "scoped to globex" },
      { ok: false, text: "the model never writes SQL" },
    ],
  },
]

const CYCLE_MS = 4000

export function AgentTerminal() {
  const [active, setActive] = useState(0)
  const prevRef = useRef(0)
  const pausedRef = useRef(false)
  const manualRef = useRef(false)
  const elapsedRef = useRef(0)
  const barRef = useRef<HTMLDivElement>(null)

  // Auto-cycle through callers with a progress bar; pause on hover, stop on click.
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = now - last
      last = now
      if (!manualRef.current && !pausedRef.current) elapsedRef.current += dt
      const p = manualRef.current ? 0 : Math.min(1, elapsedRef.current / CYCLE_MS)
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
      if (!manualRef.current && elapsedRef.current >= CYCLE_MS) {
        elapsedRef.current = 0
        setActive((a) => (a + 1) % PERSONAS.length)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Track the previous persona AFTER paint so the current render can diff against it.
  const prev = prevRef.current
  useEffect(() => { prevRef.current = active })

  const persona = PERSONAS[active]
  const changed = (i: number) =>
    prev !== active &&
    (PERSONAS[prev].replies[i].ok !== persona.replies[i].ok || PERSONAS[prev].replies[i].text !== persona.replies[i].text)

  const select = (i: number) => { manualRef.current = true; setActive(i) }

  return (
    <div
      className="w-full max-w-xl mx-auto flex flex-col rounded-sm ring-[1px] ring-border bg-bg overflow-hidden"
      onPointerEnter={() => { pausedRef.current = true }}
      onPointerLeave={() => { pausedRef.current = false }}
    >
      {/* title bar — the persona tabs live here, like caller tabs */}
      <div className="flex items-stretch h-9 border-b border-border">
        <div className="hidden sm:flex items-center gap-2 pl-3 pr-2 border-r border-border">
          <span className="size-2 rounded-full bg-fg-faint/50" />
          <span className="size-2 rounded-full bg-fg-faint/50" />
          <span className="size-2 rounded-full bg-fg-faint/50" />
        </div>
        <span className="hidden sm:flex items-center pl-3 pr-1 font-mono text-[11px] text-fg-faint">valv</span>
        <div className="flex items-stretch ml-auto">
          {PERSONAS.map((pn, i) => (
            <button
              key={pn.role}
              type="button"
              onClick={() => select(i)}
              className={`relative px-3.5 sm:px-4 font-mono text-xs transition-colors cursor-pointer border-l border-border ${
                i === active ? "text-fg bg-bg-muted/60" : "text-fg-subtle hover:text-fg-muted"
              }`}
            >
              {pn.role}
              {i === active && (
                <span
                  ref={barRef}
                  className="absolute bottom-0 inset-x-0 h-[1.5px] bg-accent origin-left"
                  style={{ transform: "scaleX(0)" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[208px] px-4 py-3 font-mono text-[13px] leading-relaxed flex flex-col gap-1.5">
        <p key={`ctx-${active}`} className="text-fg-faint valv-line">
          # {persona.tenant} · {persona.blurb}
        </p>
          {QUESTIONS.map((q, i) => {
            const r = persona.replies[i]
            const flashCls = changed(i) ? (r.ok ? "valv-flash-ok" : "valv-flash-no") : "valv-line"
            return (
              <div key={i}>
                <p className="text-fg break-words">
                  <span className="text-fg-subtle">›&nbsp;</span>{q}
                </p>
                <p
                  key={`${active}-${i}`}
                  className={`pl-4 -mx-1 px-1 rounded-[3px] break-words ${r.ok ? "text-[#6cc58a]" : "text-[#e0654f]"} ${flashCls}`}
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <span className="mr-1.5">{r.ok ? "✓" : "✗"}</span>
                  {r.text}
                </p>
              </div>
            )
          })}
      </div>
    </div>
  )
}
