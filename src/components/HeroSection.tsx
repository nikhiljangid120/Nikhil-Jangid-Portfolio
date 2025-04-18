
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, Linkedin, Code, ExternalLink } from 'lucide-react';
import ParticleField from './ParticleField';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card';

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  
  // Parallax effect on scroll
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Text animation characters
  const titleChars = "Hi, I'm".split('');
  const nameChars = "Nikhil Jangid".split('');
  
  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Magnetic effect on hover (desktop only)
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || isMobile) return;

      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      const elements = containerRef.current.querySelectorAll('.magnetic-element');
      elements.forEach(element => {
        const el = element as HTMLElement;
        const strength = parseFloat(el.dataset.strength || '10');
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
    };

    const element = containerRef.current;
    if (element && !isMobile) {
      element.addEventListener('mousemove', handleMouseMove);
    }
    
    // Trigger text reveal animation
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 300);
    
    return () => {
      if (element && !isMobile) {
        element.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, [isMobile]);

  return (
    <section 
      id="home" 
      ref={containerRef} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Dynamic Background with Animated Elements */}
      <div className="absolute inset-0 bg-inkyblack overflow-hidden">
        {/* Animated gradient blobs */}
        <motion.div 
          className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-r from-purple/10 via-teal/10 to-lime/10 blur-3xl"
          style={{ top: '10%', left: '30%' }}
          animate={{ 
            x: [0, 50, 0], 
            y: [0, -30, 0],
            scale: [1, 1.05, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse' }}
        />
        
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-teal/10 via-lime/10 to-gold/10 blur-3xl"
          style={{ bottom: '10%', right: '20%' }}
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 18, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
        />
        
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-gold/10 via-orange/10 to-purple/10 blur-3xl"
          style={{ top: '40%', left: '10%' }}
          animate={{ 
            x: [0, 30, 0], 
            y: [0, 40, 0],
            scale: [1, 1.08, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', delay: 2 }}
        />
        
        {/* Particle field background */}
        <ParticleField 
          particleCount={80} 
          colors={['#005A66', '#D94F30', '#FFB100', '#2E1760', '#CCFF00']} 
          minSize={1}
          maxSize={3}
          speed={0.5}
          className="opacity-30"
        />
        
        {/* Subtle grid overlay with improved opacity */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        
        {/* Animated gradient lines */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 5 }).map((_, index) => (
            <motion.div
              key={`line-${index}`}
              className="absolute h-px bg-gradient-to-r from-teal/0 via-lime/30 to-purple/0"
              style={{ 
                left: 0,
                right: 0,
                top: `${15 + index * 20}%`,
                scaleX: 0.8,
                originX: index % 2 ? 0 : 1
              }}
              animate={{ 
                scaleX: [0.8, 1, 0.8], 
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{ 
                duration: 8 + index * 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: index * 0.5
              }}
            />
          ))}
        </div>
      </div>
      
      <motion.div 
        style={{ y, opacity }} 
        className="section-container relative z-10"
      >
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <motion.div className="relative mb-8 overflow-hidden">
            <div className="flex justify-center md:justify-start mb-2">
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
            
            <div className="flex justify-center md:justify-start flex-wrap relative">
              {nameChars.map((char, index) => (
                <motion.span
                  key={`name-${index}`}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold inline-block"
                  initial={{ y: 100, opacity: 0 }}
                  animate={isRevealed ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.5 + index * 0.05,
                    ease: [0.215, 0.61, 0.355, 1]
                  }}
                >
                  <span className="relative">
                    {char === ' ' ? '\u00A0' : char}
                    <motion.span 
                      className="absolute -inset-1 rounded bg-gradient-to-r from-lime/20 via-purple/20 to-teal/20 -z-10 blur-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 + index * 0.05, duration: 1 }}
                    />
                  </span>
                </motion.span>
              ))}
              
              <motion.div
                className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-teal via-lime to-orange origin-left rounded-full"
                initial={{ scaleX: 0 }}
                animate={isRevealed ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 1, delay: 1.5, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
          
          <motion.h2
            className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <span className="text-lime font-medium">Full stack developer</span> and <span className="text-gold font-medium">problem solver</span> creating immersive digital experiences.
          </motion.h2>
          
          <motion.div
            className="flex flex-wrap gap-4 mb-12 justify-center md:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 2 }}
          >
            <motion.a 
              href="#contact" 
              className="relative px-6 py-3 bg-gradient-to-r from-lime/90 to-teal/90 text-inkyblack font-semibold rounded-md overflow-hidden group interactive"
              data-cursor-text="Let's talk"
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(204, 255, 0, 0.4)" }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">Get in touch</span>
              <motion.span 
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                animate={{ 
                  x: ["-100%", "100%"],
                  opacity: [0, 0.5, 0],
                }}
                transition={{ 
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 1.5,
                  ease: "linear",
                  repeatDelay: 0.5
                }}
              />
            </motion.a>
            <motion.a
              href="#projects"
              className="relative px-6 py-3 bg-transparent text-white font-semibold rounded-md border border-lime/30 overflow-hidden group interactive"
              data-cursor-text="See work"
              whileHover={{ scale: 1.03, borderColor: "rgba(204, 255, 0, 0.5)" }}
              whileTap={{ scale: 0.98 }}
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
            <HoverCard>
              <HoverCardTrigger asChild>
                <motion.a 
                  href="https://github.com/nikhiljangid120" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-lime transition-colors duration-300 magnetic-element interactive"
                  data-cursor-text="GitHub"
                  data-strength="15"
                  whileHover={{ scale: 1.2 }}
                >
                  <Github size={24} />
                </motion.a>
              </HoverCardTrigger>
              <HoverCardContent className="bg-inkyblack/90 border border-lime/20">
                <p className="text-sm text-gray-300">Follow me on GitHub</p>
              </HoverCardContent>
            </HoverCard>
            
            <HoverCard>
              <HoverCardTrigger asChild>
                <motion.a 
                  href="https://www.linkedin.com/in/nikhil-jangid-b84360264/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-lime transition-colors duration-300 magnetic-element interactive"
                  data-cursor-text="LinkedIn"
                  data-strength="15"
                  whileHover={{ scale: 1.2 }}
                >
                  <Linkedin size={24} />
                </motion.a>
              </HoverCardTrigger>
              <HoverCardContent className="bg-inkyblack/90 border border-lime/20">
                <p className="text-sm text-gray-300">Connect on LinkedIn</p>
              </HoverCardContent>
            </HoverCard>
            
            <HoverCard>
              <HoverCardTrigger asChild>
                <motion.a 
                  href="https://leetcode.com/u/nikhil_888/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-lime transition-colors duration-300 magnetic-element interactive"
                  data-cursor-text="LeetCode"
                  data-strength="15"
                  whileHover={{ scale: 1.2 }}
                >
                  <Code size={24} />
                </motion.a>
              </HoverCardTrigger>
              <HoverCardContent className="bg-inkyblack/90 border border-lime/20">
                <p className="text-sm text-gray-300">View my LeetCode profile</p>
              </HoverCardContent>
            </HoverCard>
            
            <HoverCard>
              <HoverCardTrigger asChild>
                <motion.a 
                  href="https://www.geeksforgeeks.org/user/nikhiljals77/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-lime transition-colors duration-300 magnetic-element interactive"
                  data-cursor-text="GeeksForGeeks"
                  data-strength="15"
                  whileHover={{ scale: 1.2 }}
                >
                  <ExternalLink size={24} />
                </motion.a>
              </HoverCardTrigger>
              <HoverCardContent className="bg-inkyblack/90 border border-lime/20">
                <p className="text-sm text-gray-300">Check my GeeksForGeeks profile</p>
              </HoverCardContent>
            </HoverCard>
          </motion.div>
          
          {/* Achievement badges with enhanced hover effects */}
          <motion.div
            className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 2.4 }}
          >
            <motion.div 
              className="achievement-badge badge-leetcode interactive"
              data-cursor-text="LeetCode"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="h-2 w-2 rounded-full bg-lime"></span>
              <span className="text-xs font-medium text-lime">LeetCode 100 Days</span>
            </motion.div>
            
            <motion.div 
              className="achievement-badge badge-codechef interactive"
              data-cursor-text="CodeChef"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="h-2 w-2 rounded-full bg-gold"></span>
              <span className="text-xs font-medium text-gold">CodeChef Badges</span>
            </motion.div>
            
            <motion.div 
              className="achievement-badge badge-hackerearth interactive"
              data-cursor-text="HackerEarth"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="h-2 w-2 rounded-full bg-purple"></span>
              <span className="text-xs font-medium text-purple">HackerEarth Achiever</span>
            </motion.div>
          </motion.div>
          
          {/* Contact information badges */}
          <motion.div
            className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 2.6 }}
          >
            <span className="text-sm text-gray-500">
              <span className="text-gray-400 font-medium">Jaipur, Rajasthan</span>
            </span>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Animated scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <motion.div 
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        >
          <motion.div 
            className="w-1 h-2 bg-white/50 rounded-full"
            animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
