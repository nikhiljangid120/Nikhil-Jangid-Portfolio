
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Code, ExternalLink } from 'lucide-react';
import ParticleField from './ParticleField';

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  
  // Parallax effect on scroll
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Text animation characters
  const titleChars = "Hi, I'm".split('');
  const nameChars = "Nikhil Jangid".split('');
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const { clientX, clientY } = e;
      const { left, top, width, height } = containerRef.current?.getBoundingClientRect() || 
        { left: 0, top: 0, width: 0, height: 0 };
      
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;
      
      const elements = containerRef.current?.querySelectorAll('.magnetic-element');
      elements?.forEach(element => {
        const el = element as HTMLElement;
        const strength = parseFloat(el.dataset.strength || '10');
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
    };

    const element = containerRef.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
    }
    
    // Trigger text reveal animation
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 500);
    
    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
      }
      clearTimeout(timer);
    };
  }, []);

  return (
    <section 
      id="home" 
      ref={containerRef} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <ParticleField particleCount={200} speed={0.4} />
      
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-inkyblack opacity-70" />
      
      <motion.div 
        style={{ y, opacity }} 
        className="section-container relative z-10 mt-16"
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="overflow-hidden mb-6"
          >
            <div ref={textRef} className="relative">
              <div className="flex justify-center mb-2">
                {titleChars.map((char, index) => (
                  <motion.span
                    key={`title-${index}`}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold inline-block"
                    initial={{ y: 100, opacity: 0 }}
                    animate={isRevealed ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.1 + index * 0.05,
                      ease: [0.215, 0.61, 0.355, 1]
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </div>
              
              <div className="flex justify-center flex-wrap">
                {nameChars.map((char, index) => (
                  <motion.span
                    key={`name-${index}`}
                    className="gradient-text text-4xl md:text-6xl lg:text-7xl font-bold inline-block"
                    initial={{ y: 100, opacity: 0 }}
                    animate={isRevealed ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.5 + index * 0.05,
                      ease: [0.215, 0.61, 0.355, 1]
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </div>
              
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isRevealed ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 1, delay: 1.5, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal via-lime to-orange origin-left"
              />
            </div>
          </motion.div>
          
          <motion.h2
            className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <span className="text-lime">Full stack developer</span> and <span className="text-gold">problem solver</span> creating immersive digital experiences.
          </motion.h2>
          
          <motion.div
            className="flex space-x-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 2 }}
          >
            <motion.a 
              href="#contact" 
              className="btn-primary interactive"
              data-cursor-text="Let's talk"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get in touch
            </motion.a>
            <motion.a
              href="#projects"
              className="relative px-6 py-3 bg-transparent text-white font-medium rounded-md border border-white/20 overflow-hidden group interactive"
              data-cursor-text="See work"
              whileHover={{ scale: 1.05, borderColor: "rgba(204, 255, 0, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">View projects</span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-lime/20 to-teal/20 -z-10"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          </motion.div>
          
          <motion.div
            className="flex space-x-6"
            initial={{ opacity: 0 }}
            animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 2.2 }}
          >
            <motion.a 
              href="https://github.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-lime transition-colors duration-300 magnetic-element interactive"
              data-cursor-text="GitHub"
              data-strength="15"
              whileHover={{ scale: 1.2 }}
            >
              <Github size={24} />
            </motion.a>
            <motion.a 
              href="https://linkedin.com/in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-lime transition-colors duration-300 magnetic-element interactive"
              data-cursor-text="LinkedIn"
              data-strength="15"
              whileHover={{ scale: 1.2 }}
            >
              <Linkedin size={24} />
            </motion.a>
            <motion.a 
              href="https://leetcode.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-lime transition-colors duration-300 magnetic-element interactive"
              data-cursor-text="LeetCode"
              data-strength="15"
              whileHover={{ scale: 1.2 }}
            >
              <Code size={24} />
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: [0, 1, 0], y: [0, 10, 0] }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          repeatType: "loop", 
          delay: 3
        }}
      >
        <a href="#about" className="text-gray-400 hover:text-lime interactive" data-cursor-text="Scroll">
          <ArrowDown size={24} />
        </a>
      </motion.div>
      
      {/* Cinematic overlay elements */}
      <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-inkyblack to-transparent z-10" />
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-inkyblack to-transparent z-10" />
      <motion.div 
        className="absolute inset-0 border border-white/5 pointer-events-none z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.5 }}
      />
    </section>
  );
};

export default HeroSection;
