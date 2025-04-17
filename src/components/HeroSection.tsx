
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Code, ExternalLink } from 'lucide-react';
import ParticleField from './ParticleField';

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
      
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
    element.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section id="home" ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleField particleCount={150} speed={0.3} />
      
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-inkyblack opacity-70" />
      
      <div className="section-container relative z-10 mt-16">
        <motion.div 
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="block">Hi, I'm</span>
            <span className="gradient-text">Nikhil Jangid</span>
          </motion.h1>
          
          <motion.h2
            className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            A <span className="text-lime">full stack developer</span> and <span className="text-gold">problem solver</span> creating immersive digital experiences.
          </motion.h2>
          
          <motion.div
            className="flex space-x-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.a 
              href="#contact" 
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get in touch
            </motion.a>
            <motion.a
              href="#projects"
              className="relative px-6 py-3 bg-transparent text-white font-medium rounded-md border border-white/20 hover:border-lime/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View projects
            </motion.a>
          </motion.div>
          
          <motion.div
            className="flex space-x-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <motion.a 
              href="https://github.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-lime transition-colors duration-300 magnetic-element"
              data-strength="15"
              whileHover={{ scale: 1.2 }}
            >
              <Github size={24} />
            </motion.a>
            <motion.a 
              href="https://linkedin.com/in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-lime transition-colors duration-300 magnetic-element"
              data-strength="15"
              whileHover={{ scale: 1.2 }}
            >
              <Linkedin size={24} />
            </motion.a>
            <motion.a 
              href="https://leetcode.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-lime transition-colors duration-300 magnetic-element"
              data-strength="15"
              whileHover={{ scale: 1.2 }}
            >
              <Code size={24} />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        <a href="#about" className="text-gray-400 hover:text-lime">
          <ArrowDown size={24} />
        </a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
