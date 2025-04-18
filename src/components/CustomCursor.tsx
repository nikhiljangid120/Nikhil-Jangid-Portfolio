import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [position, setPosition] = useState({ x: -100, y: -100 }); // Start offscreen
  const cursorRef = useRef<HTMLDivElement>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const requestRef = useRef<number>();
  
  // Store the last known good position to prevent jumps
  const lastPositionRef = useRef({ x: 0, y: 0 });
  
  // Reduce throttle time for more responsive cursor
  const throttleAmount = 3; // Reduced from 5ms to 3ms
  
  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Don't setup cursor events on mobile
    if (isMobile) return;

    const updateCursorPosition = (clientX: number, clientY: number) => {
      const now = performance.now();
      if (now - lastUpdateTimeRef.current < throttleAmount) return;
      
      lastUpdateTimeRef.current = now;
      lastPositionRef.current = { x: clientX, y: clientY };
      setPosition({ x: clientX, y: clientY });
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateCursorPosition(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      setPosition({ x: -100, y: -100 });
    };

    const handleInteractiveElements = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveElement = target.closest('.interactive');
      
      if (interactiveElement) {
        const rect = interactiveElement.getBoundingClientRect();
        // Center the cursor on the interactive element
        updateCursorPosition(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2
        );
        setIsHovering(true);
        const text = interactiveElement.getAttribute('data-cursor-text') || '';
        setCursorText(text);
      } else {
        setIsHovering(false);
        setCursorText('');
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleInteractiveElements, { passive: true });
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleInteractiveElements);
      window.removeEventListener('resize', checkMobile);
      
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Main cursor */}
      <motion.div 
        ref={cursorRef}
        className="fixed pointer-events-none z-[100]"
        animate={{
          x: position.x,
          y: position.y,
          width: isHovering ? '60px' : '24px',
          height: isHovering ? '60px' : '24px',
          backgroundColor: isHovering ? 'rgba(204, 255, 0, 0.2)' : 'rgba(204, 255, 0, 0.5)',
          boxShadow: isHovering ? '0 0 15px rgba(204, 255, 0, 0.5)' : '0 0 5px rgba(204, 255, 0, 0.3)',
          borderRadius: '50%',
        }}
        transition={{
          type: "spring",
          damping: 25, // Increased from 20 for faster response
          stiffness: 400, // Increased from 300 for faster response
          duration: 0.1, // Reduced from 0.15 for faster response
        }}
        style={{
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      
      {/* Inner dot cursor */}
      <motion.div 
        className="fixed pointer-events-none z-[100] bg-lime rounded-full"
        animate={{
          x: position.x,
          y: position.y,
          width: isHovering ? '8px' : '6px',
          height: isHovering ? '8px' : '6px',
          opacity: position.x < 0 ? 0 : 1,
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 500, // Increased for snappier response
          duration: 0.08, // Reduced for faster response
        }}
        style={{
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      
      {/* Cursor text */}
      {cursorText && (
        <motion.div
          className="fixed text-xs font-outfit font-medium pointer-events-none z-[100] text-lime"
          animate={{
            x: position.x,
            y: position.y + 40,
            opacity: 1,
            scale: 1,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300,
          }}
          style={{
            translateX: "-50%",
          }}
        >
          {cursorText}
        </motion.div>
      )}
    </>
  );
};

export default CustomCursor;
