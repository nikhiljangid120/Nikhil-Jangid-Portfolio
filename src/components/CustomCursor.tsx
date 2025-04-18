
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const CustomCursor = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const cursorRef = useRef<HTMLDivElement>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const requestRef = useRef<number>();
  const lastPositionRef = useRef({ x: 0, y: 0 });
  
  // Reduced throttle time for more responsive cursor
  const throttleAmount = 2; // Reduced from 3ms to 2ms for faster response
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
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
    <AnimatePresence>
      {/* Enhanced main cursor */}
      <motion.div 
        ref={cursorRef}
        className="fixed pointer-events-none z-[100]"
        animate={{
          x: position.x,
          y: position.y,
          width: isHovering ? '64px' : '28px',
          height: isHovering ? '64px' : '28px',
          backgroundColor: isHovering ? 'rgba(204, 255, 0, 0.15)' : 'rgba(204, 255, 0, 0.4)',
          boxShadow: isHovering 
            ? '0 0 20px rgba(204, 255, 0, 0.4), inset 0 0 10px rgba(204, 255, 0, 0.2)' 
            : '0 0 8px rgba(204, 255, 0, 0.2)',
          borderRadius: '50%',
          scale: isHovering ? 1.2 : 1,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 450,
          mass: 0.8,
          duration: 0.08,
        }}
        style={{
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        {isHovering && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Sparkles className="w-full h-full p-4 text-lime/50" />
          </motion.div>
        )}
      </motion.div>
      
      {/* Enhanced inner dot cursor */}
      <motion.div 
        className="fixed pointer-events-none z-[100] bg-lime rounded-full"
        animate={{
          x: position.x,
          y: position.y,
          width: isHovering ? '8px' : '6px',
          height: isHovering ? '8px' : '6px',
          opacity: position.x < 0 ? 0 : 1,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 450,
          mass: 0.8,
          duration: 0.08,
        }}
        style={{
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      
      {/* Enhanced cursor text */}
      {cursorText && (
        <motion.div
          className="fixed text-xs font-spaceGrotesk font-medium pointer-events-none z-[100] text-lime"
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
            damping: 25,
            stiffness: 350,
          }}
          style={{
            translateX: "-50%",
          }}
        >
          {cursorText}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomCursor;
