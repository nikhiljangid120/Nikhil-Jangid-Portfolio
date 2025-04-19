import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomCursor = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [showSpark, setShowSpark] = useState(false);
  const cursorRef = useRef(null);
  const sparkTimerRef = useRef(null);
  
  // Create random sparks
  useEffect(() => {
    if (isMobile) return;
    
    const createRandomSparks = () => {
      // Show spark briefly
      setShowSpark(true);
      
      // Hide spark after short duration
      setTimeout(() => {
        setShowSpark(false);
      }, 150);
      
      // Set next random interval for spark (between 2-6 seconds)
      const nextInterval = 2000 + Math.random() * 4000;
      sparkTimerRef.current = setTimeout(createRandomSparks, nextInterval);
    };
    
    // Initial spark timer
    sparkTimerRef.current = setTimeout(createRandomSparks, 2000);
    
    return () => {
      if (sparkTimerRef.current) {
        clearTimeout(sparkTimerRef.current);
      }
    };
  }, [isMobile]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    if (isMobile) return;

    // Smooth position tracking with minimal delay
    const handleMouseMove = (e) => {
      setPosition(prev => ({
        x: e.clientX,
        y: e.clientY
      }));
    };

    const handleMouseLeave = () => {
      setPosition({ x: -100, y: -100 });
    };

    const handleInteractiveElements = (e) => {
      const target = e.target;
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

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleInteractiveElements, { passive: true });
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleInteractiveElements);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <AnimatePresence>
      {/* Main cursor with subtle glow */}
      <motion.div 
        ref={cursorRef}
        className="fixed pointer-events-none z-[100] backdrop-blur-[2px]"
        animate={{
          x: position.x,
          y: position.y,
          width: '32px',
          height: '32px',
          opacity: isHovering ? 0.9 : 0.8,
          backgroundColor: 'transparent',
          borderColor: isHovering ? 'rgba(204, 255, 0, 0.7)' : 'rgba(204, 255, 0, 0.5)',
          borderWidth: isHovering ? '2px' : '1.5px',
          borderRadius: '50%',
        }}
        transition={{
          type: "spring",
          stiffness: 800,
          damping: 30,
          mass: 0.5
        }}
        style={{
          translateX: "-50%",
          translateY: "-50%",
          boxShadow: isHovering 
            ? '0 0 12px rgba(204, 255, 0, 0.25), 0 0 4px rgba(204, 255, 0, 0.5) inset' 
            : '0 0 8px rgba(204, 255, 0, 0.15)'
        }}
      />
      
      {/* Inner dot core - instant reaction */}
      <motion.div 
        className="fixed pointer-events-none z-[101]"
        animate={{
          x: position.x,
          y: position.y,
          scale: isHovering ? 1.2 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 1000,
          damping: 30,
          mass: 0.2
        }}
        style={{
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <div className="w-2 h-2 bg-lime rounded-full mix-blend-screen" />
      </motion.div>
      
      {/* Micro sparks that randomly appear */}
      <AnimatePresence>
        {showSpark && (
          <motion.div 
            className="fixed pointer-events-none z-[102]"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              x: position.x,
              y: position.y,
              translateX: "-50%",
              translateY: "-50%",
            }}
          >
            {/* Micro sparks effect */}
            <div className="relative">
              {[...Array(3)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="absolute bg-lime rounded-full"
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 0.9,
                    width: '2px',
                    height: '2px'
                  }}
                  animate={{ 
                    x: (Math.random() - 0.5) * 20, 
                    y: (Math.random() - 0.5) * 20,
                    opacity: 0,
                    width: '1px',
                    height: '1px'
                  }}
                  transition={{ duration: 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Subtle highlight ring on hover */}
      {isHovering && (
        <motion.div
          className="fixed pointer-events-none z-[99] rounded-full border border-lime/20"
          initial={{ width: '32px', height: '32px', opacity: 0 }}
          animate={{ width: '48px', height: '48px', opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            x: position.x,
            y: position.y,
            translateX: "-50%",
            translateY: "-50%",
            boxShadow: '0 0 20px rgba(204, 255, 0, 0.15)'
          }}
        />
      )}
      
      {/* Cursor text with stylish fade */}
      {cursorText && (
        <motion.div
          className="fixed text-xs tracking-wider uppercase font-medium pointer-events-none z-[100] text-lime"
          animate={{
            x: position.x,
            y: position.y + 38,
            opacity: 1,
          }}
          initial={{ opacity: 0, y: position.y + 30 }}
          exit={{ opacity: 0, y: position.y + 30 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30,
            duration: 0.2 
          }}
          style={{
            translateX: "-50%",
            textShadow: "0 0 3px rgba(204, 255, 0, 0.3)"
          }}
        >
          {cursorText}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomCursor;