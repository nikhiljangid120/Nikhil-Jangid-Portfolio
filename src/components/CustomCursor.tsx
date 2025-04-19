
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [text, setText] = useState('');
  
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) return; // Don't run cursor effects on mobile
    
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
      
      if (hoveredEl?.closest('a, button, [role="button"], .interactive')) {
        setLinkHovered(true);
        setText(cursorTextAttr || '');
      } else {
        setLinkHovered(false);
        setText('');
      }
    };
    
    // Mouse states
    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);
    const onMouseLeave = () => setHidden(true);
    const onMouseEnter = () => setHidden(false);
    
    addEventListeners();
    return () => removeEventListeners();
  }, []);
  
  // Don't render on mobile devices
  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    return null;
  }
  
  return (
    <AnimatePresence>
      {!hidden && (
        <>
          {/* Main cursor */}
          <motion.div
            key="cursor-main"
            className="cursor-trail mix-blend-difference bg-white fixed top-0 left-0 pointer-events-none z-50"
            animate={{
              x: position.x,
              y: position.y,
              scale: clicked ? 0.5 : linkHovered ? 1.5 : 1,
              opacity: hidden ? 0 : 1,
              width: linkHovered ? 64 : 24,
              height: linkHovered ? 64 : 24,
              borderRadius: linkHovered ? 12 : 24,
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
            className="cursor-dot bg-white fixed top-0 left-0 pointer-events-none z-50"
            animate={{
              x: position.x,
              y: position.y,
              opacity: linkHovered ? 0 : 1,
              scale: clicked ? 0.5 : 1
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
              className="fixed top-0 left-0 text-black font-medium text-xs pointer-events-none z-50 flex items-center justify-center"
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
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomCursor;
