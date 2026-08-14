export function BriefMockup() {
  return (
    <div className="box box-shadow-hard">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 h-10 border-b border-[var(--line-strong)] bg-[var(--surface-2)]">
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--persian)]/30" />
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--persian)]/30" />
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--persian)]/30" />
        <div className="ml-4 text-xs text-[var(--ink-soft)] font-mono truncate">
          standupbot.app/projects/abc123/brief
        </div>
        <div className="ml-auto flex items-center gap-1 text-[10px] text-[var(--ink-soft)] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" /> live
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_1.4fr]">
        {/* Sidebar: submission tracker */}
        <aside className="border-b md:border-b-0 md:border-r border-[var(--line-strong)] p-6">
          <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--ink-soft)] mb-3">Today · Mon 11 May</div>
          <h3 className="font-display text-2xl mb-5">FYP — E-commerce</h3>

          <ul className="space-y-3 text-sm">
            {[
              { n: "Ahmed", r: "Backend / Payments", s: "ok" },
              { n: "Sara", r: "Frontend (new)", s: "new" },
              { n: "Zain", r: "Database", s: "ok" },
              { n: "Fatima", r: "Research", s: "miss" },
            ].map((m) => (
              <li key={m.n} className="flex items-center justify-between border border-[var(--line)] px-3 py-2">
                <div>
                  <div className="font-semibold text-[var(--ink)]">{m.n}</div>
                  <div className="text-xs text-[var(--ink-soft)]">{m.r}</div>
                </div>
                {m.s === "ok" && <span className="text-xs font-mono text-emerald-700">✓ submitted</span>}
                {m.s === "new" && <span className="text-xs font-mono text-[var(--persian)]">★ first day</span>}
                {m.s === "miss" && <span className="text-xs font-mono text-amber-700">○ missing</span>}
              </li>
            ))}
          </ul>

          <div className="mt-5 text-xs text-[var(--ink-soft)] font-mono">3 of 4 · risk MEDIUM</div>
        </aside>

        {/* Brief */}
        <div className="p-6 md:p-8 space-y-5 text-sm leading-relaxed">
          <div className="flex items-center justify-between">
            <div className="font-display text-xl">Team Brief</div>
            <span className="pill !py-1 !text-[10px] bg-amber-100 border-amber-700 text-amber-800">RISK · MEDIUM</span>
          </div>

          <div className="border-l-2 border-blue-600 pl-3 bg-blue-50/60 py-2">
            <span className="font-semibold text-blue-800">Welcome Sara</span> — first standup today. Repo set up, navbar started.
          </div>

          <div className="border-l-2 border-[var(--destructive)] pl-3 bg-red-50/60 py-2">
            <span className="font-semibold text-[var(--destructive)]">Blocker:</span> Ahmed is waiting on DB credentials from <span className="font-semibold">Zain</span>. Zain has no blockers — should be his first task tomorrow.
          </div>

          <div className="border-l-2 border-emerald-600 pl-3 bg-emerald-50/60 py-2">
            <span className="font-semibold text-emerald-800">Shipped:</span> Stripe charge flow, DB schema, navbar scaffold.
          </div>

          <div className="border-l-2 border-amber-600 pl-3 bg-amber-50/60 py-2">
            <span className="font-semibold text-amber-800">Missing:</span> Fatima — research deliverable due in 4 days.
          </div>

          <div className="pt-2 font-mono text-xs text-[var(--ink-soft)]">
            generating<span className="blink">▍</span>
          </div>
        </div>
      </div>
    </div>
  );
}
