import { useEffect, useRef } from "react";

export function useInView<T extends Element = HTMLDivElement>(
  options: IntersectionObserverInit = { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      options
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}
