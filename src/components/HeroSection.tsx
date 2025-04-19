import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, Linkedin, Code, ExternalLink } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card';

// Define TypeScript interfaces
interface MousePosition {
  x: number;
  y: number;
}

// Simplified Particle component for Name Hover - reduced count and complexity
const HoverParticle = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full bg-gradient-to-br from-lime to-teal pointer-events-none"
    style={{ originX: 0.5, originY: 0.5 }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 0.8, 0],
      scale: [0, 1, 0],
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 60,
    }}
    transition={{
      duration: 0.5,
      ease: 'easeOut',
      delay,
    }}
  />
);

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameWrapperRef = useRef<HTMLDivElement>(null);

  const [isRevealed, setIsRevealed] = useState(false);
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState<'default' | 'interactive'>('default');
  const [isMounted, setIsMounted] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isHoveringName, setIsHoveringName] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Parallax effect - simplified
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 50]); // Reduced movement
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  // Text animation characters - memoized
  const titleChars = useMemo(() => "Hi, I'm".split(''), []);
  const nameChars = useMemo(() => "Nikhil Jangid".split(''), []);

  // Intersection Observer
  useEffect(() => {
    setIsMounted(true);
    setIsMobile(window.innerWidth < 768);

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    const currentRef = containerRef.current;
    if (currentRef) observer.observe(currentRef);
    
    // Reveal animation with a small delay
    const timer = setTimeout(() => setIsRevealed(true), 200);
    
    return () => {
      if (currentRef) observer.unobserve(currentRef);
      clearTimeout(timer);
    };
  }, []);

  // Mouse Handling - optimized with throttling
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current || isMobile) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePos({ x, y });

      const targetElement = e.target as Element;
      const isInteractive = targetElement?.closest('.interactive');
      setCursorVariant(isInteractive ? 'interactive' : 'default');
    },
    [isMobile]
  );

  // Throttled mouse move handler
  const throttledMouseMove = useCallback((e: MouseEvent) => {
    if (!window.requestAnimationFrame) {
      handleMouseMove(e); 
      return;
    }
    
    window.requestAnimationFrame(() => {
      handleMouseMove(e);
    });
  }, [handleMouseMove]);

  const handleMouseLeave = useCallback(() => {
    if (!containerRef.current || isMobile) return;
    setCursorVariant('default');
  }, [isMobile]);

  // Effect for mouse events
  useEffect(() => {
    const element = containerRef.current;
    if (element && !isMobile) {
      element.addEventListener('mousemove', throttledMouseMove, { passive: true });
      element.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (element && !isMobile) {
        element.removeEventListener('mousemove', throttledMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isMobile, throttledMouseMove, handleMouseLeave]);

  // Name hover handlers
  const handleNameEnter = useCallback(() => setIsHoveringName(true), []);
  const handleNameLeave = useCallback(() => setIsHoveringName(false), []);

  // Badge classes
  const getBadgeClasses = useCallback((color: string) => {
    switch (color) {
      case 'lime': return { border: 'border-lime/25', text: 'text-lime', bg: 'bg-lime' };
      case 'gold': return { border: 'border-yellow-400/25', text: 'text-yellow-400', bg: 'bg-yellow-400' };
      case 'cyan': return { border: 'border-cyan-400/25', text: 'text-cyan-400', bg: 'bg-cyan-400' };
      default: return { border: 'border-gray-500/25', text: 'text-gray-300', bg: 'bg-gray-500' };
    }
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen h-screen flex items-center justify-center overflow-hidden bg-inkyblack text-white isolate"
      style={{ cursor: isMobile ? 'auto' : 'none' }}
    >
      {/* Simplified Background Effects */}
      {isMounted && isInView && (
        <>
          {/* Lighter gradient background */}
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-lime/15 via-purple/10 to-teal/10"
            style={{ zIndex: 1 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.8 }}
          />

          {/* Simplified Grid Overlay */}
          <div
            className="absolute inset-0"
            style={{
              zIndex: 4,
              backgroundImage: `
                linear-gradient(to right, #CCFF00 1px, transparent 1px),
                linear-gradient(to bottom, #00C4B4 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px', // Larger grid for better performance
              opacity: 0.05,
              mixBlendMode: 'soft-light',
            }}
          />
        </>
      )}

      {/* Optimized Mouse Cursor - only render when needed */}
      {!isMobile && isMounted && cursorVariant && (
        <motion.div
          className="absolute top-0 left-0 rounded-full bg-gradient-to-br from-lime to-teal pointer-events-none"
          style={{
            width: cursorVariant === 'interactive' ? 30 : 15,
            height: cursorVariant === 'interactive' ? 30 : 15,
            x: mousePos.x,
            y: mousePos.y,
            translateX: '-50%',
            translateY: '-50%',
            opacity: cursorVariant === 'interactive' ? 0.4 : 0.3,
            zIndex: 1000,
          }}
        />
      )}

      {/* Main Content */}
      <motion.div
        style={{ y, opacity, zIndex: 10 }}
        className="section-container relative px-4 text-center md:text-left flex flex-col items-center md:items-start"
      >
        <motion.div className="mb-1 overflow-hidden">
          <div className="flex justify-center md:justify-start">
            {titleChars.map((char, index) => (
              <motion.span
                key={`title-${index}`}
                className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-300 inline-block mr-[1px] font-orbitron"
                initial={{ y: '100%', opacity: 0 }}
                animate={isRevealed ? { y: '0%', opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.03 }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          ref={nameWrapperRef}
          className="relative mb-5 group interactive"
          whileHover="hover"
          onMouseEnter={handleNameEnter}
          onMouseLeave={handleNameLeave}
          style={{ cursor: 'pointer' }}
        >
          {/* Optimized hover effect */}
          <motion.div
            className="absolute -inset-x-2 -inset-y-1 bg-gradient-to-r from-lime/10 via-purple/10 to-teal/10 opacity-0 group-hover:opacity-100 rounded-lg -z-10"
            variants={{ hover: { opacity: 1 } }}
            transition={{ duration: 0.2 }}
          />
          
          {/* Reduced particles for better performance */}
          {isHoveringName && !isMobile && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
              {Array.from({ length: 3 }).map((_, i) => (
                <HoverParticle key={`hover-particle-${i}`} delay={i * 0.03} />
              ))}
            </div>
          )}
          
          <div className="flex justify-center md:justify-start flex-wrap">
            {nameChars.map((char, index) => (
              <motion.span
                key={`name-${index}`}
                className={`text-2xl md:text-4xl lg:text-5xl font-bold inline-block mr-[1px] transition-colors duration-200 font-orbitron ${
                  isHoveringName ? 'text-transparent' : 'text-white'
                }`}
                style={{
                  backgroundImage: isHoveringName
                    ? 'linear-gradient(90deg, #CCFF00, #00C4B4, #8B00FF, #CCFF00)'
                    : 'none',
                  backgroundSize: '200% auto',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                }}
                initial={{ y: '100%', opacity: 0 }}
                animate={isRevealed ? { y: '0%', opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.03 }}
                variants={{
                  hover: {
                    y: (Math.random() - 0.5) * 2, // Reduced movement
                    transition: { duration: 0.1, delay: index * 0.01 },
                  },
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>
          <motion.div
            className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-teal via-lime to-purple rounded-full"
            initial={{ scaleX: 0 }}
            animate={isRevealed ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
          />
        </motion.div>

        <motion.h2
          className="text-base md:text-lg mb-6 text-gray-300 max-w-lg bg-black/20 backdrop-blur-sm p-3 rounded-lg font-poppins"
          initial={{ opacity: 0, y: 15 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 1 }}
        >
          <span className="text-lime font-semibold">Full-stack developer</span> &{' '}
          <span className="text-teal font-semibold">problem solver</span> from{' '}
          <span className="font-medium text-gray-100">Jaipur</span>.
        </motion.h2>

        <motion.div
          className="flex flex-wrap gap-3 mb-8 justify-center md:justify-start"
          initial="hidden"
          animate={isRevealed ? 'visible' : 'hidden'}
          variants={{
            visible: { opacity: 1, transition: { duration: 0.4, delay: 1.2, staggerChildren: 0.08 } },
            hidden: { opacity: 0 },
          }}
        >
          <motion.a
            href="#contact"
            className="relative px-6 py-2.5 bg-gradient-to-r from-lime to-teal text-inkyblack font-bold rounded-lg overflow-hidden group interactive shadow-md font-poppins"
            variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <span className="relative z-10">Get in touch</span>
            <motion.span
              className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.2 }}
            />
          </motion.a>
          <motion.a
            href="#projects"
            className="relative px-6 py-2.5 bg-black/20 text-white font-semibold rounded-lg border border-lime/40 group interactive backdrop-blur-sm font-poppins"
            variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <span className="relative z-10">View projects</span>
            <motion.div
              className="absolute inset-0 bg-lime/10 opacity-0 group-hover:opacity-100 -z-10"
              transition={{ duration: 0.2 }}
            />
          </motion.a>
        </motion.div>

        <motion.div
          className="flex space-x-5 mb-6"
          initial="hidden"
          animate={isRevealed ? 'visible' : 'hidden'}
          variants={{
            visible: { opacity: 1, transition: { duration: 0.4, delay: 1.4, staggerChildren: 0.06 } },
            hidden: { opacity: 0 },
          }}
        >
          {[
            { href: 'https://github.com/nikhiljangid120', icon: Github, text: 'GitHub' },
            { href: 'https://www.linkedin.com/in/nikhil-jangid-b84360264/', icon: Linkedin, text: 'LinkedIn' },
            { href: 'https://leetcode.com/u/nikhil_888/', icon: Code, text: 'LeetCode' },
            { href: 'https://www.geeksforgeeks.org/user/nikhiljals77/', icon: ExternalLink, text: 'GeeksForGeeks' },
          ].map(({ href, icon: Icon, text }) => (
            <motion.div key={text} variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}>
              <HoverCard openDelay={200} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <motion.a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-lime transition-colors duration-200 interactive relative group"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                  >
                    <Icon size={24} />
                    <span
                      className="absolute -inset-1.5 bg-lime/10 rounded-full opacity-0 group-hover:opacity-100 -z-10"
                    />
                  </motion.a>
                </HoverCardTrigger>
                <HoverCardContent className="bg-inkyblack/80 border border-lime/15 backdrop-blur-sm text-xs text-gray-200 rounded-lg font-poppins">
                  {text === 'GitHub' ? 'Explore my code on GitHub' : `Visit my ${text} profile`}
                </HoverCardContent>
              </HoverCard>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-wrap gap-2 justify-center md:justify-start mb-4"
          initial="hidden"
          animate={isRevealed ? 'visible' : 'hidden'}
          variants={{
            visible: { opacity: 1, transition: { duration: 0.4, delay: 1.6, staggerChildren: 0.04 } },
            hidden: { opacity: 0 },
          }}
        >
          {[
            { text: 'LeetCode 100 Days', color: 'lime' },
            { text: 'CodeChef Rated', color: 'gold' },
            { text: 'HackerEarth Achiever', color: 'cyan' },
          ].map(({ text, color }) => {
            const classes = getBadgeClasses(color);
            return (
              <motion.div
                key={text}
                className={`interactive bg-black/30 px-3 py-1 rounded-full flex items-center gap-2 ${classes.border} cursor-default group font-poppins`}
                variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300, damping: 12 }}
              >
                <span className={`h-2 w-2 rounded-full ${classes.bg}`} />
                <span className={`text-xs font-medium ${classes.text}`}>{text}</span>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <motion.div
            className="w-0.5 h-4 border-0 border-lime/30 rounded-full flex justify-center items-end"
            initial={{ opacity: 0 }}
            animate={isRevealed ? { opacity: [0, 0.4, 0], y: [0, 6, 6] } : {}}
            transition={{ duration: 1.5, repeat: Infinity, delay: 2.5 }}
          >
            <div className="w-0.5 h-0.5 bg-lime/70 rounded-full" />
          </motion.div>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Poppins:wght@400;600&display=swap');
          .font-orbitron {
            font-family: 'Orbitron', sans-serif;
          }
          .font-poppins {
            font-family: 'Poppins', sans-serif;
          }
          .bg-gradient-radial {
            background-image: radial-gradient(circle, var(--tw-gradient-stops));
          }
          @keyframes gradient-shine {
            to { background-position: 200% center; }
          }
          /* Add will-change properties for better hardware acceleration */
          .interactive {
            will-change: transform;
          }
        `}</style>
      </motion.div>
    </section>
  );
};

export default HeroSection;