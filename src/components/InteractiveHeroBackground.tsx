import { useEffect, useRef } from 'react';

export const InteractiveHeroBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    active: false,
    radius: 160,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let time = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.015;

      // Smooth mouse position damping (lerp)
      if (mouseRef.current.active) {
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Soft Breathing Ambient Aurora Blobs in negative space (luxurious depth)
      // Top-right ambient aura (drifting gently behind the code terminal)
      const blob1X = width * 0.78 + Math.cos(time * 0.6) * 35;
      const blob1Y = height * 0.32 + Math.sin(time * 0.7) * 25;
      const grad1 = ctx.createRadialGradient(blob1X, blob1Y, 0, blob1X, blob1Y, Math.min(width, height) * 0.45);
      grad1.addColorStop(0, 'rgba(38, 235, 218, 0.065)');
      grad1.addColorStop(0.5, 'rgba(168, 85, 247, 0.025)');
      grad1.addColorStop(1, 'rgba(11, 15, 25, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Bottom-left ambient aura (gentle warmth below stats)
      const blob2X = width * 0.22 + Math.sin(time * 0.5) * 30;
      const blob2Y = height * 0.75 + Math.cos(time * 0.6) * 20;
      const grad2 = ctx.createRadialGradient(blob2X, blob2Y, 0, blob2X, blob2Y, Math.min(width, height) * 0.4);
      grad2.addColorStop(0, 'rgba(56, 189, 248, 0.05)');
      grad2.addColorStop(0.5, 'rgba(99, 102, 241, 0.02)');
      grad2.addColorStop(1, 'rgba(11, 15, 25, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 2. Interactive Cursor Caustic Bloom (follows mouse seamlessly)
      if (mouseRef.current.active && mouseRef.current.x > 0 && mouseRef.current.x < width) {
        const glowRadius = mouseRef.current.radius * 1.6;
        const radial = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          glowRadius
        );
        radial.addColorStop(0, 'rgba(38, 235, 218, 0.09)');
        radial.addColorStop(0.35, 'rgba(168, 85, 247, 0.035)');
        radial.addColorStop(0.7, 'rgba(56, 189, 248, 0.012)');
        radial.addColorStop(1, 'rgba(11, 15, 25, 0)');

        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Minimalist Interactive Reactive Dot Grid (Linear/Vercel style)
      // Subtle micro-dots that smoothly illuminate only when cursor approaches
      const gridSpacing = 42;
      const startX = (width % gridSpacing) / 2;
      const startY = (height % gridSpacing) / 2;
      const mouseRadius = mouseRef.current.radius;

      for (let x = startX; x < width; x += gridSpacing) {
        for (let y = startY; y < height; y += gridSpacing) {
          let alpha = 0.06; // ultra-subtle resting state
          let radius = 0.85;

          if (mouseRef.current.active) {
            const dx = x - mouseRef.current.x;
            const dy = y - mouseRef.current.y;
            const dist = Math.hypot(dx, dy);

            if (dist < mouseRadius) {
              const proximity = 1 - dist / mouseRadius;
              // Smooth cubic falloff
              const intensity = proximity * proximity * (3 - 2 * proximity);
              alpha = 0.06 + intensity * 0.42;
              radius = 0.85 + intensity * 1.1;

              ctx.beginPath();
              ctx.arc(x, y, radius, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(38, 235, 218, ${alpha})`;
              ctx.fill();
              continue;
            }
          }

          // Ambient resting micro-dot
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();
        }
      }

      // 4. Single Ethereal Whisper-Thin Horizon Wave at bottom perimeter (anchors layout cleanly)
      const horizonY = height * 0.86;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      for (let x = 0; x <= width; x += 25) {
        const waveOffset =
          Math.sin(x * 0.0018 + time * 0.4) * 14 +
          Math.cos(x * 0.003 - time * 0.3) * 8;
        ctx.lineTo(x, horizonY + waveOffset);
      }

      const horizonGrad = ctx.createLinearGradient(0, 0, width, 0);
      horizonGrad.addColorStop(0, 'rgba(38, 235, 218, 0)');
      horizonGrad.addColorStop(0.3, 'rgba(38, 235, 218, 0.15)');
      horizonGrad.addColorStop(0.7, 'rgba(168, 85, 247, 0.15)');
      horizonGrad.addColorStop(1, 'rgba(38, 235, 218, 0)');

      ctx.strokeStyle = horizonGrad;
      ctx.lineWidth = 1;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    // Pause when scrolled out of view to preserve 100% CPU/GPU performance
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    resize();
    render();

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default InteractiveHeroBackground;
