import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { ProblemSolution } from "@/components/landing/ProblemSolution";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "StandupBot — Async standups that actually think" },
      { name: "description", content: "Each teammate answers 3 questions in 90 seconds. AI reads everyone's updates together and writes one brief that flags blockers, dependencies, and missing members. Built for student teams." },
    ],
  }),
});

function Index() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Nav />
      <Hero />
      <TrustStrip />
      <ProblemSolution />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}
