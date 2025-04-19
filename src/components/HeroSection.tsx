import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Code, ExternalLink } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card';

// Define TypeScript interfaces
interface MousePosition {
  x: number;
  y: number;
}

// Simple Particle component for Name Hover
const HoverParticle = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-br from-lime to-teal pointer-events-none"
    style={{ originX: 0.5, originY: 0.5, willChange: 'transform, opacity' }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1.2, 0],
      x: (Math.random() - 0.5) * 80,
      y: (Math.random() - 0.5) * 80,
    }}
    transition={{
      duration: 0.6,
      ease: 'easeOut',
      delay,
    }}
  />
);

// Background Sparkle component for Name Hover
const BackgroundSparkle = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full bg-gradient-to-br from-lime/80 to-purple/80 pointer-events-none"
    style={{ willChange: 'transform, opacity' }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 0.8, 0],
      scale: [0, 1.5, 0],
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
    }}
    transition={{
      duration: 0.8,
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

  // Parallax effect
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 80]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  // Smooth cursor
  const springCursorSize = useSpring(cursorVariant === 'interactive' ? 30 : 15, { stiffness: 800, damping: 40 });
  const springCursorOpacity = useSpring(cursorVariant === 'interactive' ? 0.4 : 0.3, { stiffness: 600, damping: 40 });

  // Text animation characters
  const titleChars = useMemo(() => "Hi, I'm".split(''), []);
  const nameChars = useMemo(() => "Nikhil Jangid".split(''), []);

  // Intersection Observer and Initial Setup
  useEffect(() => {
    setIsMounted(true);
    setIsMobile(window.innerWidth < 768);

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    const currentRef = containerRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  // Mouse Handling
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

  const handleMouseLeave = useCallback(() => {
    if (!containerRef.current || isMobile) return;
    setCursorVariant('default');
  }, [isMobile]);

  useEffect(() => {
    const element = containerRef.current;
    if (element && !isMobile) {
      element.addEventListener('mousemove', handleMouseMove, { passive: true });
      element.addEventListener('mouseleave', handleMouseLeave);
    }

    const timer = setTimeout(() => setIsRevealed(true), 200);

    return () => {
      if (element && !isMobile) {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
      clearTimeout(timer);
    };
  }, [isMobile, handleMouseMove, handleMouseLeave]);

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
      <AnimatePresence>
        {isMounted && isInView && (
          <>
            {/* Gradient Background */}
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-lime/25 via-purple/20 to-teal/20"
              style={{ zIndex: 1 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 1 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-lime/15 via-teal/15 to-purple/15"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            </motion.div>

            {/* Mouse-Interactive Glow */}
            {!isMobile && (
              <motion.div
                className="absolute w-[100px] h-[100px] rounded-full bg-gradient-radial from-lime/20 via-teal/15 to-transparent blur-2xl pointer-events-none"
                style={{ x: mousePos.x - 50, y: mousePos.y - 50, zIndex: 2 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
              />
            )}

            {/* Background Sparkles on Name Hover */}
            <AnimatePresence>
              {isHoveringName && !isMobile && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ zIndex: 3 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {Array.from({ length: 10 }).map((_, i) => (
                    <BackgroundSparkle key={`bg-sparkle-${i}`} delay={i * 0.05} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Grid Overlay */}
            <motion.div
              className="absolute inset-0"
              style={{
                zIndex: 4,
                backgroundImage: `
                  linear-gradient(to right, #CCFF00 1px, transparent 1px),
                  linear-gradient(to bottom, #00C4B4 1px, transparent 1px)
                `,
                backgroundSize: '25px 25px',
                opacity: 0.08,
                mixBlendMode: 'soft-light',
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Custom Cursor */}
      {!isMobile && isMounted && (
        <motion.div
          className="absolute top-0 left-0 rounded-full bg-gradient-to-br from-lime to-teal pointer-events-none"
          style={{
            width: springCursorSize,
            height: springCursorSize,
            x: mousePos.x,
            y: mousePos.y,
            translateX: '-50%',
            translateY: '-50%',
            opacity: springCursorOpacity,
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
                className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-300 inline-block mr-[1px] font-orbitron"
                initial={{ y: '100%', opacity: 0 }}
                animate={isRevealed ? { y: '0%', opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.03 }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          ref={nameWrapperRef}
          className="relative mb-6 group interactive"
          whileHover="hover"
          onMouseEnter={handleNameEnter}
          onMouseLeave={handleNameLeave}
          style={{ cursor: 'pointer' }}
        >
          <motion.div
            className="absolute -inset-x-3 -inset-y-1.5 bg-gradient-to-r from-lime/15 via-purple/15 to-teal/15 opacity-0 group-hover:opacity-100 blur-xl rounded-lg -z-10"
            variants={{ hover: { opacity: 1 } }}
            transition={{ duration: 0.3 }}
          />
          <AnimatePresence>
            {isHoveringName && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <HoverParticle key={`hover-particle-${i}`} delay={i * 0.02} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex justify-center md:justify-start flex-wrap">
            {nameChars.map((char, index) => (
              <motion.span
                key={`name-${index}`}
                className={`text-3xl md:text-5xl lg:text-6xl font-bold inline-block mr-[1px] transition-colors duration-200 font-orbitron ${
                  isHoveringName ? 'text-transparent' : 'text-white'
                }`}
                style={{
                  backgroundImage: isHoveringName
                    ? 'linear-gradient(90deg, #CCFF00, #00C4B4, #8B00FF, #CCFF00)'
                    : 'none',
                  backgroundSize: '200% auto',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  animation: isHoveringName ? 'gradient-shine 2s linear infinite' : 'none',
                }}
                initial={{ y: '100%', opacity: 0 }}
                animate={isRevealed ? { y: '0%', opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.04 }}
                variants={{
                  hover: {
                    y: (Math.random() - 0.5) * 4,
                    transition: { duration: 0.15, delay: index * 0.01 },
                  },
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>
          <motion.div
            className="absolute -bottom-2.5 left-0 w-full h-[3px] bg-gradient-to-r from-teal via-lime to-purple rounded-full"
            initial={{ scaleX: 0 }}
            animate={isRevealed ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 1 }}
          />
        </motion.div>

        <motion.h2
          className="text-lg md:text-xl mb-8 text-gray-300 max-w-xl bg-black/30 backdrop-blur-sm p-4 rounded-lg font-poppins"
          initial={{ opacity: 0, y: 20 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <span className="text-lime font-semibold">Full-stack developer</span> &{' '}
          <span className="text-teal font-semibold">problem solver</span> from{' '}
          <span className="font-medium text-gray-100">Jaipur</span>.
        </motion.h2>

        <motion.div
          className="flex flex-wrap gap-4 mb-10 justify-center md:justify-start"
          initial="hidden"
          animate={isRevealed ? 'visible' : 'hidden'}
          variants={{
            visible: { opacity: 1, transition: { duration: 0.5, delay: 1.4, staggerChildren: 0.1 } },
            hidden: { opacity: 0 },
          }}
        >
          <motion.a
            href="#contact"
            className="relative px-7 py-3.5 bg-gradient-to-r from-lime to-teal text-inkyblack font-bold rounded-lg overflow-hidden group interactive shadow-lg font-poppins"
            variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
          >
            <span className="relative z-10">Get in touch</span>
            <motion.span
              className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
          </motion.a>
          <motion.a
            href="#projects"
            className="relative px-7 py-3.5 bg-black/30 text-white font-semibold rounded-lg border border-lime/50 group interactive backdrop-blur-md font-poppins"
            variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
          >
            <span className="relative z-10">View projects</span>
            <motion.div
              className="absolute inset-0 bg-lime/20 opacity-0 group-hover:opacity-100 -z-10"
              transition={{ duration: 0.3 }}
            />
          </motion.a>
        </motion.div>

        <motion.div
          className="flex space-x-6 mb-8"
          initial="hidden"
          animate={isRevealed ? 'visible' : 'hidden'}
          variants={{
            visible: { opacity: 1, transition: { duration: 0.5, delay: 1.6, staggerChildren: 0.08 } },
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
              <HoverCard openDelay={100} closeDelay={50}>
                <HoverCardTrigger asChild>
                  <motion.a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-lime transition-colors duration-200 interactive relative group"
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <Icon size={28} />
                    <motion.span
                      className="absolute -inset-2 bg-lime/15 blur-lg rounded-full opacity-0 group-hover:opacity-100 -z-10"
                      transition={{ duration: 0.2 }}
                    />
                  </motion.a>
                </HoverCardTrigger>
                <HoverCardContent className="bg-inkyblack/85 border border-lime/20 backdrop-blur-lg text-sm text-gray-200 rounded-lg font-poppins">
                  {text === 'GitHub' ? 'Explore my code on GitHub' : `Visit my ${text} profile`}
                </HoverCardContent>
              </HoverCard>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-wrap gap-3 justify-center md:justify-start mb-6"
          initial="hidden"
          animate={isRevealed ? 'visible' : 'hidden'}
          variants={{
            visible: { opacity: 1, transition: { duration: 0.5, delay: 1.8, staggerChildren: 0.06 } },
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
                className={`interactive bg-black/40 backdrop-blur px-3.5 py-1.5 rounded-full flex items-center gap-2.5 ${classes.border} cursor-default group font-poppins`}
                variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
                whileHover={{ scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <motion.span
                  className={`h-2.5 w-2.5 rounded-full ${classes.bg}`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className={`text-xs font-medium ${classes.text}`}>{text}</span>
                <motion.span
                  className="absolute -inset-1.5 bg-lime/10 blur-md rounded-full opacity-0 group-hover:opacity-50 -z-10"
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <motion.div
            className="w-1 h-5 border-0 border-lime/40 rounded-full flex justify-center items-end pb-[3px]"
            initial={{ opacity: 0 }}
            animate={isRevealed ? { opacity: [0, 0.5, 0], y: [0, 8, 8] } : {}}
            transition={{ duration: 2, repeat: Infinity, delay: 3 }}
          >
            <motion.div className="w-1 h-1 bg-lime/80 rounded-full" />
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
          @keyframes gradient-shine {
            to { background-position: 200% center; }
          }
          .bg-gradient-radial {
            background-image: radial-gradient(circle, var(--tw-gradient-stops));
          }
        `}</style>
      </motion.div>
    </section>
  );
};

export default HeroSection;