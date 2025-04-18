
import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');
  
  // Use spring physics for smooth cursor movement
  const springConfig = { damping: 20, stiffness: 300 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Don't setup cursor events on mobile
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Update cursor position with mouse coordinates
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleInteractiveElements = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveElement = target.closest('.interactive');
      
      if (interactiveElement) {
        setIsHovering(true);
        const text = interactiveElement.getAttribute('data-cursor-text') || '';
        setCursorText(text);
      } else {
        setIsHovering(false);
        setCursorText('');
      }
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleInteractiveElements);
    
    // Clean up event listeners on unmount
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleInteractiveElements);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile, cursorX, cursorY]);

  // Don't render cursor on mobile
  if (isMobile) return null;

  return (
    <>
      {/* Main cursor */}
      <motion.div 
        className="fixed pointer-events-none z-50 mix-blend-difference"
        style={{ 
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovering ? '50px' : '20px',
          height: isHovering ? '50px' : '20px',
          backgroundColor: isHovering ? 'rgba(255, 255, 255, 0.85)' : 'rgba(204, 255, 0, 0.7)',
          borderRadius: '9999px',
        }}
        transition={{
          duration: 0.15,
          ease: [0.23, 1, 0.32, 1]
        }}
      />
      
      {/* Text that appears when hovering over interactive elements */}
      {cursorText && (
        <motion.div
          className="fixed text-xs font-medium pointer-events-none z-50 text-black mix-blend-difference"
          style={{ 
            x: cursorX,
            y: cursorY,
            translateX: "-50%",
            translateY: "20px",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
        >
          {cursorText}
        </motion.div>
      )}
    </>
  );
};

export default CustomCursor;
