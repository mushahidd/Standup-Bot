import { Reveal } from "./Reveal";
import { HandUnderline } from "./HandUnderline";

export function CTA() {
  return (
    <section id="cta" className="bg-[var(--persian)] text-[var(--ghost)] border-b border-[var(--line-strong)] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-dark opacity-70" />
      <div className="relative mx-auto max-w-5xl px-6 py-28 text-center">
        <Reveal className="pill !bg-transparent !text-[var(--ghost)] !border-[var(--ghost)]/40 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-2)] pulse-dot" />
          Free for teams up to 5
        </Reveal>

        <Reveal variant="mask" as="h2" className="font-display font-bold text-[clamp(3rem,9vw,8rem)] leading-[0.9]">
          Stop chasing.
        </Reveal>
        <div className="text-center">
          <h2 className="font-display font-bold text-[clamp(3rem,9vw,8rem)] leading-[0.9] inline-block relative">
            <span className="echo-text" data-text="Start shipping.">Start shipping.</span>
            <HandUnderline className="!h-5" />
          </h2>
        </div>

        <Reveal className="mt-8 max-w-xl mx-auto text-[var(--ghost)]/80 text-lg">
          Spin up your first standup in under a minute. No credit card. No Slack workspace required.
        </Reveal>

        <Reveal className="mt-10 max-w-lg mx-auto flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="you@university.edu"
            className="flex-1 bg-transparent border border-[var(--ghost)]/40 px-4 py-3.5 text-[var(--ghost)] placeholder:text-[var(--ghost)]/50 focus:outline-none focus:border-[var(--accent-2)]"
          />
          <button className="bg-[var(--accent-2)] text-[var(--ink)] font-semibold px-6 py-3.5 border border-[var(--accent-2)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,0.4)] transition-all">
            Sign in with Google →
          </button>
        </Reveal>

        <Reveal className="mt-6 text-xs font-mono text-[var(--ghost)]/60 uppercase tracking-widest">
          90 seconds a day · 0 meetings · 1 brief
        </Reveal>
      </div>
    </section>
  );
}
