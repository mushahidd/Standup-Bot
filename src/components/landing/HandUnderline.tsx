import { useInView } from "@/hooks/use-in-view";

export function HandUnderline({ className = "" }: { className?: string }) {
  const ref = useInView<SVGSVGElement>();
  return (
    <svg
      ref={ref}
      className={`underline-draw absolute left-0 -bottom-3 w-full h-4 ${className}`}
      viewBox="0 0 300 16"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M2 10 C 60 2, 120 14, 180 6 S 280 12, 298 4"
        stroke="var(--persian)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
