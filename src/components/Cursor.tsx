import { useEffect } from 'react';

export default function Cursor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    document.body.classList.add('has-cursor');

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
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
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const TRAIL_LEN = 26;
    const trail: { x: number; y: number }[] = [];
    for (let i = 0; i < TRAIL_LEN; i++) trail.push({ x: mouseX, y: mouseY });

    let active = false;
    let t = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      active = true;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    };
    const onLeaveDoc = () => { active = false; };

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
              b.x, b.y
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
    window.addEventListener('resize', resize);
    document.addEventListener('mouseleave', onLeaveDoc);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
      document.removeEventListener('mouseleave', onLeaveDoc);
      interactive.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
      dot.remove();
      ring.remove();
      canvas.remove();
      document.body.classList.remove('has-cursor');
    };
  }, []);

  return null;
}
