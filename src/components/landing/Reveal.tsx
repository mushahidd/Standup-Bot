import { ReactNode } from "react";
import { useInView } from "@/hooks/use-in-view";

type Props = {
  children: ReactNode;
  className?: string;
  variant?: "up" | "mask" | "stagger";
  as?: "div" | "section" | "h1" | "h2" | "h3" | "p" | "span" | "ul" | "ol";
};

export function Reveal({ children, className = "", variant = "up", as: Tag = "div" }: Props) {
  const ref = useInView<HTMLDivElement>();
  const cls =
    variant === "mask" ? "in-view-mask" : variant === "stagger" ? "stagger" : "in-view-reveal";
  // @ts-expect-error dynamic tag
  return <Tag ref={ref} className={`${cls} ${className}`}>{children}</Tag>;
}
