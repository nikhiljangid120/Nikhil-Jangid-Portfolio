import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomCursor = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [showSpark, setShowSpark] = useState(false);
  const cursorRef = useRef(null);
  const sparkTimerRef = useRef(null);
  const lastPositionRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);
  
  // Debounced position update using requestAnimationFrame
  const updatePosition = useMemo(() => {
    return (e) => {
      lastPositionRef.current = { x: e.clientX, y: e.clientY };
      
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          setPosition(lastPositionRef.current);
          rafRef.current = null;
        });
      }
    };
  }, []);
  
  // Spark effect with performance optimizations
  useEffect(() => {
    if (isMobile) return;
    
    const createRandomSparks = () => {
      // Only show spark when cursor is moving
      if (Math.abs(position.x - lastPositionRef.current.x) > 5 || 
          Math.abs(position.y - lastPositionRef.current.y) > 5) {
        setShowSpark(true);
        
        setTimeout(() => {
          setShowSpark(false);
        }, 120);
      }
      
      // Adaptive timing - more frequent sparks during movement
      const nextInterval = 2000 + Math.random() * 3000;
      sparkTimerRef.current = setTimeout(createRandomSparks, nextInterval);
    };
    
    sparkTimerRef.current = setTimeout(createRandomSparks, 2000);
    
    return () => {
      if (sparkTimerRef.current) {
        clearTimeout(sparkTimerRef.current);
      }
    };
  }, [isMobile, position]);

  useEffect(() => {
    // Use ResizeObserver instead of resize event for better performance
    const resizeObserver = new ResizeObserver(entries => {
      setIsMobile(window.innerWidth < 768);
    });
    
    resizeObserver.observe(document.body);
    setIsMobile(window.innerWidth < 768);
    
    if (isMobile) return () => resizeObserver.disconnect();

    // Optimized event handlers with passive flags
    const handleMouseMove = (e) => {
      updatePosition(e);
    };

    const handleMouseLeave = () => {
      setPosition({ x: -100, y: -100 });
      lastPositionRef.current = { x: -100, y: -100 };
    };

    // Throttled interaction detection
    let lastInteractionCheck = 0;
    const handleInteractiveElements = (e) => {
      const now = performance.now();
      if (now - lastInteractionCheck < 50) return; // Throttle to 20fps
      lastInteractionCheck = now;
      
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
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('mouseover', handleInteractiveElements, { passive: true });
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleInteractiveElements);
      resizeObserver.disconnect();
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isMobile, updatePosition]);

  // Graceful degradation for mobile
  if (isMobile) return null;

  // Memoized animation values for better performance
  const cursorAnimationProps = {
    x: position.x,
    y: position.y,
    width: '32px',
    height: '32px',
    opacity: isHovering ? 0.9 : 0.8,
    backgroundColor: 'transparent',
    borderColor: isHovering ? 'rgba(204, 255, 0, 0.7)' : 'rgba(204, 255, 0, 0.5)',
    borderWidth: isHovering ? '2px' : '1.5px',
    borderRadius: '50%',
  };

  return (
    <AnimatePresence mode="sync">
      {/* Main cursor with subtle glow */}
      <motion.div 
        ref={cursorRef}
        className="fixed pointer-events-none z-50 will-change-transform"
        animate={cursorAnimationProps}
        transition={{
          type: "spring",
          stiffness: 900,
          damping: 35,
          mass: 0.4
        }}
        style={{
          translateX: "-50%",
          translateY: "-50%",
          boxShadow: isHovering 
            ? '0 0 12px rgba(204, 255, 0, 0.25), 0 0 4px rgba(204, 255, 0, 0.5) inset' 
            : '0 0 8px rgba(204, 255, 0, 0.15)'
        }}
      />
      
      {/* Inner dot core - hardware accelerated for instant reaction */}
      <motion.div 
        className="fixed pointer-events-none z-51 will-change-transform"
        animate={{
          x: position.x,
          y: position.y,
          scale: isHovering ? 1.2 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 1200,
          damping: 35,
          mass: 0.15
        }}
        style={{
          translateX: "-50%",
          translateY: "-50%",
          transform: 'translate3d(0,0,0)', // Force GPU acceleration
        }}
      >
        <div className="w-2 h-2 bg-lime rounded-full mix-blend-screen" />
      </motion.div>
      
      {/* Optimized micro sparks that randomly appear */}
      <AnimatePresence>
        {showSpark && (
          <motion.div 
            className="fixed pointer-events-none z-52 will-change-transform"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.12 }}
            style={{
              x: position.x,
              y: position.y,
              translateX: "-50%",
              translateY: "-50%",
              transform: 'translate3d(0,0,0)', // Force GPU acceleration
            }}
          >
            {/* Pre-calculated spark positions for performance */}
            <div className="relative">
              {useMemo(() => {
                const sparkPositions = [
                  { x: -7, y: 8 }, 
                  { x: 10, y: -5 }, 
                  { x: -3, y: -10 }
                ];
                
                return sparkPositions.map((pos, i) => (
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
                      x: pos.x, 
                      y: pos.y,
                      opacity: 0,
                      width: '1px',
                      height: '1px'
                    }}
                    transition={{ duration: 0.12 }}
                  />
                ));
              }, [])}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Subtle highlight ring on hover - optimized rendering */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            className="fixed pointer-events-none z-49 rounded-full border border-lime/20 will-change-transform"
            initial={{ width: '32px', height: '32px', opacity: 0 }}
            animate={{ width: '48px', height: '48px', opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              x: position.x,
              y: position.y,
              translateX: "-50%",
              translateY: "-50%",
              boxShadow: '0 0 20px rgba(204, 255, 0, 0.15)',
              transform: 'translate3d(0,0,0)', // Force GPU acceleration
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Cursor text with performance optimizations */}
      <AnimatePresence>
        {cursorText && (
          <motion.div
            className="fixed text-xs tracking-wider uppercase font-medium pointer-events-none z-50 text-lime will-change-transform"
            animate={{
              x: position.x,
              y: position.y + 38,
              opacity: 1,
            }}
            initial={{ opacity: 0, y: position.y + 30 }}
            exit={{ opacity: 0, y: position.y + 30 }}
            transition={{ 
              type: "spring", 
              stiffness: 600, 
              damping: 35,
              duration: 0.15 
            }}
            style={{
              translateX: "-50%",
              textShadow: "0 0 3px rgba(204, 255, 0, 0.3)",
              transform: 'translate3d(0,0,0)', // Force GPU acceleration
            }}
          >
            {cursorText}
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default CustomCursor;