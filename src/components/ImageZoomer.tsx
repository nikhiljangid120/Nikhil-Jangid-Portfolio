
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageZoomerProps {
  src: string;
  alt: string;
}

const ImageZoomer = ({ src, alt }: ImageZoomerProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };
  
  return (
    <motion.div
      className="relative w-64 h-64 rounded-2xl overflow-hidden cursor-none interactive group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02 }}
      style={{
        '--mouse-x': `${mousePosition.x}%`,
        '--mouse-y': `${mousePosition.y}%`,
      } as React.CSSProperties}
      data-cursor-text="View"
    >
      {/* Glassmorphism overlay */}
      <motion.div
        className="absolute inset-0 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(
            circle 200px at ${mousePosition.x}% ${mousePosition.y}%,
            rgba(204, 255, 0, 0.1),
            transparent 100%
          )`,
        }}
      />
      
      {/* Mask overlay */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          WebkitMaskImage: isHovered
            ? `radial-gradient(circle 150px at ${mousePosition.x}% ${mousePosition.y}%, black 40%, transparent 70%)`
            : 'none',
          maskImage: isHovered
            ? `radial-gradient(circle 150px at ${mousePosition.x}% ${mousePosition.y}%, black 40%, transparent 70%)`
            : 'none',
        }}
      >
        <motion.img
          src={src}
          alt={alt}
          className="w-full h-full object-cover scale-110"
          style={{ filter: 'contrast(1.1) saturate(1.2)' }}
        />
      </motion.div>
      
      {/* Base image */}
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover blur-[1px]"
        animate={{
          scale: isHovered ? 1.1 : 1,
          filter: isHovered ? 'brightness(0.7) contrast(1.2)' : 'brightness(1) contrast(1)',
        }}
        transition={{ duration: 0.4 }}
      />
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="text-white text-xl font-bold relative z-10 px-6 py-3 rounded-full"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
            >
              Nikhil Jangid
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ImageZoomer;
