
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageZoomerProps {
  src: string;
  alt: string;
}

const ImageZoomer = ({ src, alt }: ImageZoomerProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="relative w-64 h-64 rounded-full overflow-hidden cursor-none interactive"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      data-cursor-text="Hello!"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-lime/20 via-purple/20 to-teal/20"
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
      
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        animate={{
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="text-white text-xl font-bold"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
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
