import { Reveal } from "./Reveal";

const steps = [
  { n: "01", t: "Create the project", b: "Name, deadline, standup-close time. 60 seconds. Add members by email or copy a role-tagged invite link into your WhatsApp." },
  { n: "02", t: "Everyone submits — privately", b: "Each member opens their personal link, answers 3 questions. Submissions are siloed: no one sees anyone else's blockers." },
  { n: "03", t: "Leader hits Generate Brief", b: "All submissions plus project context are sent in one prompt. Streaming output renders live on every active member's screen." },
  { n: "04", t: "Read one brief. Done.", b: "Color-coded sections call out blockers, new joiners, missing teammates, and the overall risk. No more scrolling 40 chat messages." },
];

export function HowItWorks() {
  return (
    <section id="how" className="border-b border-[var(--line-strong)]">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <Reveal className="section-label mb-4">The flow</Reveal>
        <Reveal variant="mask" as="h2" className="font-display font-bold text-5xl md:text-7xl text-[var(--ink)] max-w-3xl">
          Four steps. Zero meetings.
        </Reveal>

        <div className="mt-14 border border-[var(--line-strong)]">
          {steps.map((s, i) => (
            <Reveal key={s.n} className={`grid md:grid-cols-[200px_1fr_auto] items-start gap-6 p-8 md:p-10 ${i !== steps.length - 1 ? "border-b border-[var(--line-strong)]" : ""} group hover:bg-[var(--surface-2)] transition-colors`}>
              <div className="font-display text-7xl md:text-8xl text-[var(--persian)]/15 group-hover:text-[var(--persian)]/40 transition-colors leading-none">
                {s.n}
              </div>
              <div>
                <h3 className="font-display text-3xl md:text-4xl text-[var(--ink)]">{s.t}</h3>
                <p className="mt-3 text-[var(--ink-soft)] max-w-xl">{s.b}</p>
              </div>
              <div className="hidden md:block self-center">
                <span className="pill">step {s.n}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
