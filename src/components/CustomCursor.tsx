import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomCursor = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check mobile initially
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    if (isMobile) return () => window.removeEventListener('resize', checkMobile);

    const updatePosition = (e: MouseEvent) => {
      // Direct DOM manipulation for maximum performance instead of state for every frame
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      // Keep state for text/hover logic which is less frequent
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check for interactive elements
      const interactive = target.closest('a, button, .interactive, input, textarea');

      if (interactive) {
        setIsHovering(true);
        // Optional: check for data-cursor-text
        const text = interactive.getAttribute('data-cursor-text');
        if (text) setCursorText(text);
      } else {
        setIsHovering(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', updatePosition, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Main Cursor Dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-4 h-4 rounded-full bg-primary mix-blend-difference pointer-events-none z-[9999]"
        style={{
          marginTop: '-8px',
          marginLeft: '-8px',
          willChange: 'transform',
          transition: 'width 0.2s, height 0.2s',
          width: isHovering ? '64px' : '16px',
          height: isHovering ? '64px' : '16px',
          opacity: 0.8
        }}
      />

      {/* Optional Tag Text */}
      <AnimatePresence>
        {cursorText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed pointer-events-none z-[9999] text-xs font-mono text-primary bg-background/80 px-2 py-1 rounded border border-primary/20 backdrop-blur-sm"
            style={{
              left: position.x + 24,
              top: position.y + 24
            }}
          >
            {cursorText}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomCursor;