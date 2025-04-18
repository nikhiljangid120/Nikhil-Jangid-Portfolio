
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
  
  // Throttle cursor updates for better performance
  const throttleAmount = 5; // ms between updates
  
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
      
      // Store last known good position
      lastPositionRef.current = { x: clientX, y: clientY };
      setPosition({ x: clientX, y: clientY });
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateCursorPosition(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      setPosition({ x: -100, y: -100 }); // Move cursor offscreen when leaving window
    };

    const handleInteractiveElements = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if we're hovering any interactive element
      const interactiveElement = target.closest('.interactive');
      
      if (interactiveElement) {
        updateCursorPosition(e.clientX, e.clientY);
        setIsHovering(true);
        const text = interactiveElement.getAttribute('data-cursor-text') || '';
        setCursorText(text);
      } else {
        setIsHovering(false);
        setCursorText('');
      }
    };

    // Add event listeners with passive flag for better performance
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleInteractiveElements, { passive: true });
    
    // Clean up event listeners on unmount
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

  // Don't render cursor on mobile
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
          damping: 20,
          stiffness: 300,
          duration: 0.15,
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
          damping: 20,
          stiffness: 400,
          duration: 0.1,
        }}
        style={{
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      
      {/* Text that appears when hovering over interactive elements */}
      {cursorText && (
        <motion.div
          className="fixed text-xs font-medium pointer-events-none z-[100] text-lime"
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
            damping: 15,
            stiffness: 200,
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
