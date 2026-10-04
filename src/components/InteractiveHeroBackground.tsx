import { useEffect, useRef } from 'react';

interface WaveConfig {
  baseYPercent: number;
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
  colorStart: string;
  colorEnd: string;
  strokeAlpha: number;
  lineWidth: number;
}

interface PulsePacket {
  waveIndex: number;
  progress: number;
  speed: number;
  size: number;
  color: string;
}

export const InteractiveHeroBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    active: false,
    radius: 180,
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

    // Fluid Aurora waves with multi-harmonic curves
    const waves: WaveConfig[] = [
      {
        baseYPercent: 0.35,
        amplitude: 45,
        frequency: 0.0018,
        speed: 0.009,
        phase: 0,
        colorStart: 'rgba(38, 235, 218, ',
        colorEnd: 'rgba(168, 85, 247, ',
        strokeAlpha: 0.45,
        lineWidth: 2.0,
      },
      {
        baseYPercent: 0.48,
        amplitude: 55,
        frequency: 0.0014,
        speed: 0.007,
        phase: 1.8,
        colorStart: 'rgba(56, 189, 248, ',
        colorEnd: 'rgba(38, 235, 218, ',
        strokeAlpha: 0.4,
        lineWidth: 1.8,
      },
      {
        baseYPercent: 0.62,
        amplitude: 50,
        frequency: 0.002,
        speed: 0.011,
        phase: 3.4,
        colorStart: 'rgba(168, 85, 247, ',
        colorEnd: 'rgba(56, 189, 248, ',
        strokeAlpha: 0.42,
        lineWidth: 2.2,
      },
      {
        baseYPercent: 0.74,
        amplitude: 40,
        frequency: 0.0024,
        speed: 0.008,
        phase: 4.8,
        colorStart: 'rgba(38, 235, 218, ',
        colorEnd: 'rgba(99, 102, 241, ',
        strokeAlpha: 0.35,
        lineWidth: 1.5,
      },
    ];

    // Luminous data pulses travelling along the fluid energy waves
    const pulses: PulsePacket[] = [
      { waveIndex: 0, progress: 0.1, speed: 0.0028, size: 3.5, color: '#26ebda' },
      { waveIndex: 1, progress: 0.45, speed: 0.0022, size: 4.0, color: '#38bdf8' },
      { waveIndex: 2, progress: 0.75, speed: 0.0031, size: 3.8, color: '#c084fc' },
      { waveIndex: 3, progress: 0.25, speed: 0.0025, size: 3.2, color: '#26ebda' },
    ];

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

    // Calculate Y for a wave at given X, applying harmonic oscillation and cursor magnetic displacement
    const getWaveY = (x: number, wave: WaveConfig, t: number): number => {
      const baseY = height * wave.baseYPercent;
      // Multi-harmonic natural undulating curve
      const harmonic1 = Math.sin(x * wave.frequency + t * wave.speed + wave.phase) * wave.amplitude;
      const harmonic2 = Math.cos(x * wave.frequency * 1.8 - t * wave.speed * 0.7) * (wave.amplitude * 0.38);
      const harmonic3 = Math.sin(x * 0.0006 + t * wave.speed * 0.4) * (wave.amplitude * 0.25);

      let y = baseY + harmonic1 + harmonic2 + harmonic3;

      // Cursor magnetic displacement: smoothly warp wave around the mouse
      if (mouseRef.current.active) {
        const dx = x - mouseRef.current.x;
        const dy = y - mouseRef.current.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouseRef.current.radius) {
          const factor = 1 - dist / mouseRef.current.radius;
          // Smooth bell-curve displacement
          const smoothFactor = factor * factor * (3 - 2 * factor);
          const pushDirection = dy >= 0 ? 1 : -1;
          y += pushDirection * smoothFactor * 38;
        }
      }

      return y;
    };

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 1;

      // Smooth mouse lerping for fluid kinetic response
      if (mouseRef.current.active) {
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Ambient chromatic cursor glow
      if (mouseRef.current.active && mouseRef.current.x > 0 && mouseRef.current.x < width) {
        const glowRadius = mouseRef.current.radius * 1.5;
        const radial = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          glowRadius
        );
        radial.addColorStop(0, 'rgba(38, 235, 218, 0.085)');
        radial.addColorStop(0.4, 'rgba(168, 85, 247, 0.035)');
        radial.addColorStop(0.7, 'rgba(56, 189, 248, 0.015)');
        radial.addColorStop(1, 'rgba(11, 15, 25, 0)');

        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, width, height);
      }

      // Step interval for smooth curve rendering
      const step = Math.max(12, Math.floor(width / 75));

      // 2. Render each flowing Aurora ribbon
      waves.forEach((wave, wIdx) => {
        ctx.beginPath();

        // Sample points across width
        const points: { x: number; y: number }[] = [];
        for (let x = -20; x <= width + 20; x += step) {
          const y = getWaveY(x, wave, time);
          points.push({ x, y });
        }

        // Draw smooth bezier ribbon
        if (points.length > 0) {
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length - 1; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
          }
          if (points.length > 1) {
            const last = points[points.length - 1];
            ctx.lineTo(last.x, last.y);
          }
        }

        // Ribbon gradient stroke
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, `${wave.colorStart}0)`);
        grad.addColorStop(0.2, `${wave.colorStart}${wave.strokeAlpha})`);
        grad.addColorStop(0.6, `${wave.colorEnd}${wave.strokeAlpha * 1.1})`);
        grad.addColorStop(0.85, `${wave.colorStart}${wave.strokeAlpha * 0.9})`);
        grad.addColorStop(1, `${wave.colorEnd}0)`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = wave.lineWidth;
        ctx.shadowColor = wIdx % 2 === 0 ? 'rgba(38, 235, 218, 0.45)' : 'rgba(168, 85, 247, 0.45)';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset blur for crisp performance
      });

      // 3. Render luminous energy pulses traveling along the wave ribbons
      pulses.forEach((pulse) => {
        pulse.progress += pulse.speed;
        if (pulse.progress > 1) pulse.progress = 0;

        const wave = waves[pulse.waveIndex];
        const px = pulse.progress * width;
        const py = getWaveY(px, wave, time);

        // Calculate opacity based on position (fade in at edges, bright in center)
        const edgeFade = Math.sin(pulse.progress * Math.PI);
        const alpha = edgeFade * 0.85;

        // Pulse head
        ctx.beginPath();
        ctx.arc(px, py, pulse.size, 0, Math.PI * 2);
        ctx.fillStyle = pulse.color;
        ctx.shadowColor = pulse.color;
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Subtle kinetic tail
        const tailLength = 28;
        const tailX = px - tailLength;
        const tailY = getWaveY(tailX, wave, time);

        const tailGrad = ctx.createLinearGradient(tailX, tailY, px, py);
        tailGrad.addColorStop(0, `${pulse.color}00`);
        tailGrad.addColorStop(1, `${pulse.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(px, py);
        ctx.strokeStyle = tailGrad;
        ctx.lineWidth = pulse.size * 0.75;
        ctx.stroke();
      });

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
      className="absolute inset-0 pointer-events-none z-0 opacity-80"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default InteractiveHeroBackground;
