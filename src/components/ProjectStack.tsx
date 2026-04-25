import { useEffect } from 'react';

export default function ProjectStack() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const cards = document.querySelectorAll<HTMLElement>('.project-card');
      const triggers: ScrollTrigger[] = [];

      cards.forEach((card) => {
        const bg = card.querySelector<HTMLElement>('.project-bg');
        if (bg) {
          const trig = gsap.fromTo(
            bg,
            { yPercent: 0, scale: 1.18 },
            {
              yPercent: -10,
              scale: 1.0,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            }
          );
          if (trig.scrollTrigger) triggers.push(trig.scrollTrigger);
        }
      });

      // Sync Lenis with ScrollTrigger
      const lenis = (window as unknown as { __lenis?: { on: (e: string, cb: () => void) => void } }).__lenis;
      if (lenis) {
        lenis.on('scroll', ScrollTrigger.update);
      }

      ScrollTrigger.refresh();

      cleanup = () => {
        triggers.forEach((t) => t.kill());
      };
    })();

    return () => {
      cleanup?.();
    };
  }, []);

  return null;
}
