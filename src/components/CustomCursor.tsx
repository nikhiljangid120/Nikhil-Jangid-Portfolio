import { useEffect, useState, useRef } from 'react';

const CustomCursor = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const cursorRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
      setIsMobile(mobile);
    };
    checkMobile();

    window.addEventListener('resize', checkMobile);
    if (isMobile) return () => window.removeEventListener('resize', checkMobile);

    const onMouseMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;

      if (!rafId.current) {
        rafId.current = requestAnimationFrame(() => {
          if (cursorRef.current) {
            cursorRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
          }
          if (tagRef.current) {
            tagRef.current.style.transform = `translate3d(${posRef.current.x + 18}px, ${posRef.current.y + 18}px, 0)`;
          }
          rafId.current = null;
        });
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, .interactive, input, textarea, [role="button"]');

      if (interactive) {
        setIsHovering(true);
        const text = interactive.getAttribute('data-cursor-text');
        setCursorText(text || '');
      } else {
        setIsHovering(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Main Cursor Dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 rounded-full bg-primary pointer-events-none z-[9999] opacity-80"
        style={{
          width: isHovering ? '44px' : '12px',
          height: isHovering ? '44px' : '12px',
          marginTop: isHovering ? '-22px' : '-6px',
          marginLeft: isHovering ? '-22px' : '-6px',
          boxShadow: isHovering ? '0 0 20px rgba(38,235,218,0.35)' : '0 0 10px rgba(38,235,218,0.4)',
          transition: 'width 0.18s cubic-bezier(0.16, 1, 0.3, 1), height 0.18s cubic-bezier(0.16, 1, 0.3, 1), margin 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform',
        }}
      />

      {/* Optional Tag Text */}
      {cursorText && (
        <div
          ref={tagRef}
          className="fixed top-0 left-0 pointer-events-none z-[9999] text-[11px] font-mono text-primary bg-[#0d121c]/90 px-2 py-0.5 rounded border border-primary/30 backdrop-blur-sm shadow-md"
          style={{ willChange: 'transform' }}
        >
          {cursorText}
        </div>
      )}
    </>
  );
};

export default CustomCursor;
