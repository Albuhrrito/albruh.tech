import { useEffect, useRef } from 'react';

export default function HeroReveal() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const gsapMod = await import('gsap');
      const SplitTypeMod = await import('split-type');
      const gsap = gsapMod.gsap ?? gsapMod.default;
      const SplitType = SplitTypeMod.default;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(
          [subtitleRef.current, metaRef.current, scrollRef.current].filter(Boolean),
          { opacity: 1, y: 0 }
        );
        return;
      }

      if (!titleRef.current) return;

      const split = new SplitType(titleRef.current, { types: 'lines,chars' });

      gsap.set(split.chars ?? [], { yPercent: 110 });
      gsap.set([subtitleRef.current, metaRef.current, scrollRef.current].filter(Boolean), {
        opacity: 0,
        y: 20,
      });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to(split.chars ?? [], {
        yPercent: 0,
        duration: 1.2,
        stagger: 0.035,
        delay: 0.25,
      })
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.8 }, '-=0.7')
        .to(metaRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .to(scrollRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');

      const glow = glowRef.current;
      let mouseMove: ((e: MouseEvent) => void) | null = null;
      if (glow) {
        gsap.set(glow, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
        mouseMove = (e: MouseEvent) => {
          gsap.to(glow, {
            x: e.clientX,
            y: e.clientY,
            duration: 1.0,
            ease: 'power2.out',
          });
        };
        window.addEventListener('mousemove', mouseMove);
      }

      cleanup = () => {
        if (mouseMove) window.removeEventListener('mousemove', mouseMove);
        split.revert();
        tl.kill();
      };
    })();

    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <>
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,125,59,0.22) 0%, rgba(255,125,59,0.06) 35%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 mx-auto px-6 text-center" style={{ maxWidth: 'min(92vw, 1280px)' }}>
        <p
          ref={subtitleRef}
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg-muted mb-10 inline-flex items-center gap-3"
        >
          <span
            className="inline-block size-1.5 rounded-full bg-accent"
            style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}
          />
          Available for new work · April 2026
        </p>

        <h1
          ref={titleRef}
          className="reveal-mask font-display font-light leading-[0.88] tracking-[-0.04em] text-fg"
          style={{ fontSize: 'clamp(3.5rem, 13vw, 11rem)' }}
        >
          Albert<br />Youssef.
        </h1>

        <div
          ref={metaRef}
          className="mt-12 font-mono text-[11px] uppercase tracking-[0.25em] text-fg-muted flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
        >
          <span>Software & AI Engineer</span>
          <span className="size-1 rounded-full bg-fg-dim" />
          <span>California, US</span>
          <span className="size-1 rounded-full bg-fg-dim" />
          <span className="text-accent">UCI '25</span>
        </div>
      </div>

      <a
        ref={scrollRef}
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-12 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-fg-muted hover:text-accent transition-colors flex flex-col items-center gap-3 z-10"
      >
        <span>Scroll</span>
        <span aria-hidden="true" className="block h-12 w-px bg-gradient-to-b from-fg-muted to-transparent" />
      </a>
    </>
  );
}
