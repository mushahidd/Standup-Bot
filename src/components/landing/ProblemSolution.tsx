import { Reveal } from "./Reveal";
import { HandUnderline } from "./HandUnderline";

const oldWay = [
  "40+ unread WhatsApp messages by lunchtime",
  "Blockers buried under memes and voice notes",
  "Two people doing the same task — neither knew",
  "Leader pings everyone manually. Every. Day.",
  "Crisis mode 48h before deadline",
];

const newWay = [
  "Each member: 3 questions, 90 seconds, private",
  "AI reads ALL submissions together — not in isolation",
  "Names who is blocked + who can unblock them",
  "Welcomes new joiners, flags missing members",
  "One brief. One scroll. Whole team aligned.",
];

export function ProblemSolution() {
  return (
    <section id="problem" className="border-b border-[var(--line-strong)]">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <Reveal className="section-label mb-4">The shift</Reveal>
        <Reveal variant="mask" as="h2" className="font-display font-bold text-5xl md:text-7xl max-w-3xl text-[var(--ink)]">
          From group chat chaos to one{" "}
          <span className="relative inline-block">
            smart brief
            <HandUnderline />
          </span>.
        </Reveal>

        <div className="mt-16 grid md:grid-cols-2 border border-[var(--line-strong)]">
          {/* Old way */}
          <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-[var(--line-strong)] bg-[var(--surface-2)]">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--ink-soft)]">01 / Old way</span>
              <span className="line-through font-display text-3xl text-[var(--ink-soft)]">WhatsApp</span>
            </div>
            <Reveal variant="stagger" as="ul" className="space-y-4">
              {oldWay.map((t) => (
                <li key={t} className="flex gap-3 text-[var(--ink-soft)]">
                  <span className="mt-2 w-3 h-3 border border-[var(--ink-soft)]" />
                  <span className="text-base leading-relaxed">{t}</span>
                </li>
              ))}
            </Reveal>
          </div>

          {/* New way */}
          <div className="p-8 md:p-10 bg-[var(--persian)] text-[var(--ghost)] relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-dark opacity-60" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-xs uppercase tracking-widest text-[var(--ghost)]/70">02 / New way</span>
                <span className="font-display text-3xl">StandupBot</span>
              </div>
              <Reveal variant="stagger" as="ul" className="space-y-4">
                {newWay.map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-2 w-3 h-3 bg-[var(--accent-2)]" />
                    <span className="text-base leading-relaxed">{t}</span>
                  </li>
                ))}
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
