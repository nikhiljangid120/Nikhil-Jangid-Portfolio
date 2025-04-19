
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [text, setText] = useState('');
  const [isGameElement, setIsGameElement] = useState(false);
  const [isMobile, setIsMobile] = useState(true); // Default to true to prevent flicker on load
  
  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Reset cursor on mobile
      if (mobile) {
        document.body.style.cursor = 'auto';
      } else {
        document.body.style.cursor = 'none';
      }
    };
    
    // Check initially and on resize
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Don't run cursor effects on mobile
    if (isMobile) return;
    
    // Add event listener for cursor movement
    const addEventListeners = () => {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mouseenter', onMouseEnter);
      document.addEventListener('mouseleave', onMouseLeave);
    };
    
    // Remove event listeners on cleanup
    const removeEventListeners = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
    
    // Custom cursor follow effect
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if cursor is over interactive element
      const hoveredEl = document.elementFromPoint(e.clientX, e.clientY);
      const cursorTextAttr = hoveredEl?.getAttribute('data-cursor-text');
      const isGameEl = hoveredEl?.closest('#about-mini-game, #about-mini-game *');
      
      setIsGameElement(!!isGameEl);
      
      // Check for interactive elements
      const isInteractive = hoveredEl?.closest('a, button, [role="button"], .interactive, .nav-link, .project-card, .achievement-badge');
      setLinkHovered(!!isInteractive);
      setText(cursorTextAttr || '');
    };
    
    // Mouse states
    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);
    const onMouseLeave = () => setHidden(true);
    const onMouseEnter = () => setHidden(false);
    
    addEventListeners();
    
    return () => {
      removeEventListeners();
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);
  
  // Don't render on mobile devices
  if (isMobile) {
    return null;
  }
  
  return (
    <AnimatePresence>
      {!hidden && (
        <>
          {/* Main cursor */}
          <motion.div
            key="cursor-main"
            className="cursor-trail mix-blend-difference bg-white fixed top-0 left-0 pointer-events-none z-[1000]"
            animate={{
              x: position.x,
              y: position.y,
              scale: clicked ? 0.5 : linkHovered ? 1.5 : isGameElement ? 0.7 : 1,
              opacity: hidden ? 0 : 1,
              width: linkHovered ? 64 : isGameElement ? 16 : 24,
              height: linkHovered ? 64 : isGameElement ? 16 : 24,
              borderRadius: linkHovered ? 12 : 24,
              mixBlendMode: isGameElement ? "normal" : "difference",
              backgroundColor: isGameElement ? "rgba(204, 255, 0, 0.5)" : "white"
            }}
            transition={{
              type: "spring",
              damping: 35,
              stiffness: 400,
              mass: 0.2
            }}
            style={{
              translateX: "-50%",
              translateY: "-50%"
            }}
          />
          
          {/* Cursor dot for precise pointing */}
          <motion.div
            key="cursor-dot"
            className="cursor-dot bg-white fixed top-0 left-0 pointer-events-none z-[1000]"
            animate={{
              x: position.x,
              y: position.y,
              opacity: linkHovered ? 0 : 1,
              scale: clicked ? 0.5 : 1,
              backgroundColor: isGameElement ? "rgba(204, 255, 0, 0.8)" : "white"
            }}
            transition={{
              type: "spring",
              damping: 50,
              stiffness: 600,
              mass: 0.1
            }}
          />
          
          {/* Text label for interactive elements */}
          {text && (
            <motion.div
              key="cursor-text"
              className="fixed top-0 left-0 text-black font-medium text-xs pointer-events-none z-[1000] flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: position.x,
                y: position.y
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: "spring",
                damping: 35,
                stiffness: 400,
                mass: 0.2
              }}
              style={{
                transform: 'translate(-50%, -50%)'
              }}
            >
              {text}
            </motion.div>
          )}
          
          {/* Game cursor indicator */}
          {isGameElement && (
            <motion.div
              key="cursor-game"
              className="fixed top-0 left-0 pointer-events-none z-[1000]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: position.x,
                y: position.y
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                transform: 'translate(-50%, -50%)'
              }}
            >
              <motion.div
                className="w-20 h-20 rounded-full border-2 border-lime opacity-20"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.1, 0.2]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomCursor;
