
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isMobile, setIsMobile] = useState(false);

  // Use motion values for smoother cursor performance
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Apply spring physics for natural, smooth movement with less lag
  const springConfig = { damping: 28, stiffness: 800, mass: 0.4 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  // Throttle function to limit cursor updates
  const throttle = (callback: Function, delay = 5) => {
    let lastCallTime = 0;
    return (...args: any[]) => {
      const now = Date.now();
      if (now - lastCallTime >= delay) {
        lastCallTime = now;
        callback(...args);
      }
    };
  };

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Only set up cursor events if not on mobile
    if (isMobile) return;

    // Performance optimized cursor movement with throttling
    const updateMousePosition = throttle((e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    });

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Use event delegation for better performance
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if element or its parents have interactive class
      const isInteractive = 
        target.classList.contains('interactive') || 
        !!target.closest('.interactive') ||
        target.tagName.toLowerCase() === 'button' || 
        !!target.closest('button') ||
        target.tagName.toLowerCase() === 'a' || 
        !!target.closest('a');
      
      if (isInteractive) {
        setIsHovering(true);
        setCursorVariant('hover');
        // Set cursor text from data attribute
        const element = target.classList.contains('interactive') ? target : target.closest('.interactive');
        const textContent = element?.getAttribute('data-cursor-text') || '';
        setCursorText(textContent);
      } else {
        setIsHovering(false);
        setCursorVariant('default');
        setCursorText('');
      }
    };

    document.addEventListener('mousemove', updateMousePosition, { passive: true });
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile, cursorX, cursorY]);

  // Don't render cursor on mobile devices
  if (isMobile) {
    return null;
  }

  return (
    <>
      <motion.div 
        className="fixed w-6 h-6 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{ 
          x: springX, 
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          willChange: "transform" // Performance optimization
        }}
        animate={cursorVariant}
        variants={{
          default: {
            scale: isClicking ? 0.7 : 1,
            backgroundColor: 'rgba(204, 255, 0, 0.7)',
          },
          hover: {
            scale: 2.5,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          }
        }}
        transition={{
          type: 'tween',
          ease: 'backOut',
          duration: 0.15
        }}
      />
      {cursorText && (
        <motion.div
          className="fixed text-xs font-medium pointer-events-none z-50 text-white mix-blend-difference"
          style={{ 
            x: springX, 
            y: springY,
            translateX: "-50%",
            translateY: "20px",
            willChange: "transform" // Performance optimization
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          {cursorText}
        </motion.div>
      )}
    </>
  );
};

export default CustomCursor;
