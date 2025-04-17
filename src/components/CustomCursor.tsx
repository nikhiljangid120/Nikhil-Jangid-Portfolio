
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Track interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isButton = target.tagName.toLowerCase() === 'button' || !!target.closest('button');
      const isLink = target.tagName.toLowerCase() === 'a' || !!target.closest('a');
      const isInteractive = isButton || isLink || target.classList.contains('interactive');
      
      if (isInteractive) {
        setIsHovering(true);
        setCursorVariant('hover');
        
        // Set cursor text based on element data attribute
        const textContent = target.getAttribute('data-cursor-text') || '';
        setCursorText(textContent);
      } else {
        setIsHovering(false);
        setCursorVariant('default');
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Hide on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  return (
    <>
      <motion.div 
        className="custom-cursor"
        animate={cursorVariant}
        variants={{
          default: {
            x: position.x,
            y: position.y,
            scale: isClicking ? 0.75 : 1,
            backgroundColor: 'rgba(204, 255, 0, 0.7)',
            mixBlendMode: 'lighten'
          },
          hover: {
            x: position.x,
            y: position.y,
            scale: 2.5,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            mixBlendMode: 'difference'
          }
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 200,
          mass: 0.4
        }}
      />
      {cursorText && (
        <motion.div
          className="absolute text-xs font-medium pointer-events-none z-50 text-white mix-blend-difference"
          style={{
            left: `${position.x}px`,
            top: `${position.y + 24}px`,
            transform: 'translate(-50%, 0)'
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
