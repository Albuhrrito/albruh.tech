import { useEffect } from 'react';

type Ripple = {
  x: number;
  y: number;
  born: number;
  life: number;
  maxR: number;
  alpha: number;
  hue: 'water' | 'click';
};

export default function Cursor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    document.body.classList.add('has-cursor');

    const ring = document.createElement('div');
    ring.className = 'cursor-ring';

    const canvas = document.createElement('canvas');
    canvas.className = 'cursor-trail';
    canvas.setAttribute('aria-hidden', 'true');
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    document.body.appendChild(canvas);
    document.body.appendChild(ring);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let lastEmitX = mouseX;
    let lastEmitY = mouseY;
    let lastEmitAt = 0;

    const TRAIL_LEN = 26;
    const trail: { x: number; y: number }[] = [];
    for (let i = 0; i < TRAIL_LEN; i++) trail.push({ x: mouseX, y: mouseY });

    const ripples: Ripple[] = [];
    let active = false;
    let t = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      active = true;

      const now = performance.now();
      const dx = mouseX - lastEmitX;
      const dy = mouseY - lastEmitY;
      const dist = Math.hypot(dx, dy);
      if (dist > 18 && now - lastEmitAt > 70) {
        ripples.push({
          x: mouseX,
          y: mouseY,
          born: now,
          life: 1100 + Math.random() * 300,
          maxR: 55 + Math.random() * 35,
          alpha: 0.22 + Math.random() * 0.08,
          hue: 'water',
        });
        lastEmitX = mouseX;
        lastEmitY = mouseY;
        lastEmitAt = now;
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        born: performance.now(),
        life: 900,
        maxR: 180,
        alpha: 0.65,
        hue: 'click',
      });
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        born: performance.now() + 60,
        life: 1100,
        maxR: 240,
        alpha: 0.35,
        hue: 'click',
      });
    };

    const onLeaveDoc = () => {
      active = false;
    };

    const easeOutCubic = (k: number) => 1 - Math.pow(1 - k, 3);

    const tick = () => {
      t += 0.05;
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

      const lead = trail[0];
      lead.x += (mouseX - lead.x) * 0.32;
      lead.y += (mouseY - lead.y) * 0.32;
      for (let i = 1; i < trail.length; i++) {
        const prev = trail[i - 1];
        const cur = trail[i];
        cur.x += (prev.x - cur.x) * 0.36;
        cur.y += (prev.y - cur.y) * 0.36;
      }

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const now = performance.now();
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          const age = now - r.born;
          if (age < 0) continue;
          const k = age / r.life;
          if (k >= 1) {
            ripples.splice(i, 1);
            continue;
          }
          const radius = r.maxR * easeOutCubic(k);
          const fade = 1 - k;
          const a = r.alpha * fade;

          if (r.hue === 'water') {
            const wobble = Math.sin(t * 2 + i) * 0.6;
            ctx.beginPath();
            ctx.arc(r.x, r.y, radius + wobble, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(170, 200, 230, ${a * 0.85})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            if (radius > 12) {
              ctx.beginPath();
              ctx.arc(r.x, r.y, radius * 0.55, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(140, 175, 215, ${a * 0.45})`;
              ctx.lineWidth = 0.7;
              ctx.stroke();
            }
          } else {
            ctx.beginPath();
            ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 125, 59, ${a})`;
            ctx.lineWidth = 1.6;
            ctx.stroke();

            if (radius > 14) {
              ctx.beginPath();
              ctx.arc(r.x, r.y, radius * 0.62, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(255, 165, 110, ${a * 0.55})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }

        if (active) {
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          for (let i = 1; i < trail.length; i++) {
            const a = trail[i - 1];
            const b = trail[i];
            const wobX = Math.sin(t + i * 0.55) * (i * 0.4);
            const wobY = Math.cos(t + i * 0.55) * (i * 0.4);
            const k = 1 - i / trail.length;
            ctx.strokeStyle = `rgba(255, 125, 59, ${k * 0.7})`;
            ctx.lineWidth = k * 6 + 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.quadraticCurveTo(
              (a.x + b.x) / 2 + wobX,
              (a.y + b.y) / 2 + wobY,
              b.x,
              b.y
            );
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(tick);
    };
    let raf = requestAnimationFrame(tick);

    const onEnter = () => ring.classList.add('active');
    const onLeave = () => ring.classList.remove('active');

    const interactive = document.querySelectorAll('a, button, .magnetic');
    interactive.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('resize', resize);
    document.addEventListener('mouseleave', onLeaveDoc);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('resize', resize);
      document.removeEventListener('mouseleave', onLeaveDoc);
      interactive.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
      ring.remove();
      canvas.remove();
      document.body.classList.remove('has-cursor');
    };
  }, []);

  return null;
}
