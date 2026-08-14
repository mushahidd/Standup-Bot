import { Reveal } from "./Reveal";

const items = [
  "FYP TEAMS", "HACKATHON SQUADS", "SOCIETY PROJECTS", "COURSE GROUPS",
  "RESEARCH POD", "CAPSTONE", "STARTUP CLUB", "BOOTCAMP COHORTS",
];

export function TrustStrip() {
  return (
    <section className="border-b border-[var(--line-strong)] bg-[var(--surface-2)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-6 grid md:grid-cols-[auto_1fr] gap-6 items-center">
        <Reveal className="font-mono text-xs uppercase tracking-widest text-[var(--ink-soft)] whitespace-nowrap">
          Trusted by teams running →
        </Reveal>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="ticker-track flex gap-12 w-max font-display text-lg tracking-tight text-[var(--ink)]">
            {[...items, ...items].map((t, i) => (
              <span key={i} className="flex items-center gap-12">
                {t}
                <span className="w-1.5 h-1.5 rotate-45 bg-[var(--persian)]" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
