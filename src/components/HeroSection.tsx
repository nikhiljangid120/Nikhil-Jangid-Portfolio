import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Github, Linkedin, Code, ExternalLink } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card';

interface MousePosition {
  x: number;
  y: number;
}

interface GlowOrb {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const [cursorSize, setCursorSize] = useState(14);
  const [isMounted, setIsMounted] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [glowOrbs, setGlowOrbs] = useState<GlowOrb[]>([]);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, 20]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  const springCursorSize = useSpring(cursorSize, { 
    stiffness: 600,
    damping: 25
  });

  const titleChars = "Hi, I'm".split('');
  const nameChars = "Nikhil Jangid".split('');

  // Intersection Observer for in-view detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2, rootMargin: '50px' }
    );
    
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  // Subtle Background Glow Orbs Effect
  useEffect(() => {
    if (isMobile || !canvasRef.current || !isInView) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * Math.min(window.devicePixelRatio, 1.5);
      canvas.height = window.innerHeight * Math.min(window.devicePixelRatio, 1.5);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resizeCanvas();

    const createOrb = (): GlowOrb => ({
      id: Math.random(),
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 25 + 15,
      opacity: 0,
    });

    let lastOrbTime = 0;
    const orbInterval = 4000 + Math.random() * 2000; // New orb every ~4-6 seconds

    const animate = (currentTime: number) => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Occasionally add a new orb
      if (currentTime - lastOrbTime > orbInterval && glowOrbs.length < 2) {
        setGlowOrbs((prev) => [...prev, createOrb()]);
        lastOrbTime = currentTime;
      }

      // Update and draw orbs
      setGlowOrbs((prevOrbs) =>
        prevOrbs
          .map((orb) => ({
            ...orb,
            opacity: orb.opacity + (orb.opacity < 0.4 ? 0.003 : -0.003),
          }))
          .filter((orb) => orb.opacity > 0)
      );

      glowOrbs.forEach((orb) => {
        if (!ctx) return;
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size);
        gradient.addColorStop(0, `rgba(204, 255, 0, ${orb.opacity})`);
        gradient.addColorStop(1, `rgba(204, 255, 0, 0)`);
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    if (isInView) animationFrameId = requestAnimationFrame(animate);

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 200);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [isMobile, isInView, glowOrbs]);

  // Mouse and Resize Handling
  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobile, 200);
    };
    
    window.addEventListener('resize', handleResize);

    let rafPending = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (rafPending || !containerRef.current || isMobile) return;
      
      rafPending = true;
      requestAnimationFrame(() => {
        const { left, top } = containerRef.current!.getBoundingClientRect();
        setMousePos({ x: e.clientX - left, y: e.clientY - top });
        
        const isHoveringInteractive = !!e.target && 'closest' in e.target && (e.target as HTMLElement).closest('.interactive');
        setCursorSize(isHoveringInteractive ? 24 : 14);
        
        rafPending = false;
      });
    };

    const element = containerRef.current;
    if (element && !isMobile) element.addEventListener('mousemove', handleMouseMove);

    const timer = setTimeout(() => setIsRevealed(true), 150);

    return () => {
      if (element && !isMobile) element.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
      clearTimeout(resizeTimer);
    };
  }, [isMobile]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900"
    >
      {/* Subtle Glow Orbs Background */}
      {isMounted && !isMobile && isInView && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1, opacity: 0.7 }}
        />
      )}

      {/* Animated Gradient Background */}
      {isMounted && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"
          animate={{
            background: [
              'linear-gradient(135deg, rgba(17, 24, 39, 1) 0%, rgba(0, 0, 0, 1) 50%, rgba(17, 24, 39, 1) 100%)',
              'linear-gradient(135deg, rgba(17, 24, 39, 1) 0%, rgba(20, 0, 60, 0.8) 50%, rgba(17, 24, 39, 1) 100%)',
              'linear-gradient(135deg, rgba(17, 24, 39, 1) 0%, rgba(0, 0, 0, 1) 50%, rgba(17, 24, 39, 1) 100%)',
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
          style={{ zIndex: 1 }}
        />
      )}

      {isMounted && isMobile && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple/10 via-teal/10 to-lime/10"
          animate={{ 
            opacity: [0.12, 0.22, 0.12],
            scale: [1, 1.008, 1]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            repeatType: 'reverse',
            ease: [0.6, -0.05, 0.01, 0.99]
          }}
          style={{ zIndex: 1 }}
        />
      )}

      {isMounted && !isMobile && (
        <motion.div
          className="absolute rounded-full bg-gradient-to-r from-lime/20 to-teal/20 blur-lg pointer-events-none"
          style={{
            width: springCursorSize,
            height: springCursorSize,
            x: mousePos.x - springCursorSize.get() / 2,
            y: mousePos.y - springCursorSize.get() / 2,
            zIndex: 1000,
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.6, 0.75, 0.6]
          }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: [0.6, -0.05, 0.01, 0.99]
          }}
        />
      )}

      <motion.div style={{ y, opacity, zIndex: 10 }} className="section-container relative">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <motion.div className="relative mb-5">
            <div className="flex justify-center md:justify-start mb-1.5">
              {titleChars.map((char, index) => (
                <motion.span
                  key={`title-${index}`}
                  className="text-3xl md:text-5xl lg:text-6xl font-bold text-white inline-block"
                  initial={{ y: 20, opacity: 0, scale: 0.85 }}
                  animate={isRevealed ? { y: 0, opacity: 1, scale: 1 } : { y: 20, opacity: 0, scale: 0.85 }}
                  transition={{
                    duration: 0.25,
                    delay: 0.05 + index * 0.01,
                    ease: [0.6, -0.05, 0.01, 0.99],
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
                  className="text-3xl md:text-5xl lg:text-6xl font-bold text-white inline-block relative"
                  style={{ textShadow: '0 0 6px rgba(204, 255, 0, 0.5)' }}
                  initial={{ y: 20, opacity: 0, scale: 0.85 }}
                  animate={isRevealed ? { y: 0, opacity: 1, scale: 1 } : { y: 20, opacity: 0, scale: 0.85 }}
                  transition={{
                    duration: 0.25,
                    delay: 0.1 + index * 0.015,
                    ease: [0.6, -0.05, 0.01, 0.99],
                  }}
                  whileHover={{
                    y: -3,
                    color: '#CCFF00',
                    scale: 1.06,
                    transition: { duration: 0.12 },
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
              <motion.div
                className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-teal to-lime rounded-full"
                initial={{ scaleX: 0 }}
                animate={isRevealed ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.35, delay: 0.4, ease: [0.6, -0.05, 0.01, 0.99] }}
                style={{ boxShadow: '0 0 12px rgba(204, 255, 0, 0.5)' }}
              />
            </div>
          </motion.div>

          <motion.h2
            className="text-lg md:text-xl mb-5 text-gray-200 max-w-xl bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10"
            initial={{ opacity: 0, y: 12 }}
            animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.25, delay: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
            whileHover={{ 
              scale: 1.01, 
              boxShadow: '0 0 18px rgba(204, 255, 0, 0.35)',
              rotate: 0.4
            }}
          >
            <motion.span
              animate={{
                scale: [1, 1.004, 1],
                opacity: [0.95, 1, 0.95]
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }}
            >
              <span className="text-lime font-medium">Full stack developer</span> and{' '}
              <span className="text-gold font-medium">problem solver</span> crafting digital experiences.
            </motion.span>
          </motion.h2>

          <motion.div
            className="flex flex-wrap gap-4 mb-7 justify-center md:justify-start"
            initial={{ opacity: 0, y: 12 }}
            animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.25, delay: 0.7 }}
          >
            <motion.a
              href="#contact"
              className="relative px-6 py-2.5 bg-gradient-to-r from-lime/80 to-teal/80 text-black font-semibold rounded-xl overflow-hidden group interactive border border-white/10 backdrop-blur-md"
              whileHover={{ 
                scale: 1.015,
                boxShadow: '0 0 22px rgba(204, 255, 0, 0.55)',
                rotate: 0.4
              }}
              whileTap={{ scale: 0.97 }}
              animate={{
                scale: [1, 1.008, 1],
                opacity: [0.95, 1, 0.95]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }}
            >
              <span className="relative z-10 text-base">Get in touch</span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.2 }}
              />
            </motion.a>
            <motion.a
              href="#projects"
              className="relative px-6 py-2.5 bg-white/5 text-white font-semibold rounded-xl border border-white/10 overflow-hidden group interactive backdrop-blur-md"
              whileHover={{ 
                scale: 1.015,
                boxShadow: '0 0 22px rgba(204, 255, 0, 0.55)',
                rotate: -0.4
              }}
              whileTap={{ scale: 0.97 }}
              animate={{
                scale: [1, 1.008, 1],
                opacity: [0.95, 1, 0.95]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }}
            >
              <span className="relative z-10 text-base">View projects</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-lime/20 to-teal/20 -z-10"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.2 }}
              />
            </motion.a>
          </motion.div>

          <motion.div
            className="flex space-x-6"
            initial={{ opacity: 0 }}
            animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.25, delay: 0.8 }}
          >
            {[
              { href: 'https://github.com/nikhiljangid120', icon: Github, text: 'GitHub' },
              { href: 'https://www.linkedin.com/in/nikhil-jangid-b84360264/', icon: Linkedin, text: 'LinkedIn' },
              { href: 'https://leetcode.com/u/nikhil_888/', icon: Code, text: 'LeetCode' },
              { href: 'https://www.geeksforgeeks.org/user/nikhiljals77/', icon: ExternalLink, text: 'GeeksForGeeks' },
            ].map(({ href, icon: Icon, text }) => (
              <HoverCard key={text}>
                <HoverCardTrigger asChild>
                  <motion.a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 hover:text-lime transition-colors duration-100 interactive bg-white/5 backdrop-blur-md p-3 rounded-full border border-white/10"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: [0, 6, -6, 0],
                      boxShadow: '0 0 18px rgba(204, 255, 0, 0.45)',
                      transition: { duration: 0.25 }
                    }}
                    animate={{
                      scale: [1, 1.03, 1],
                      opacity: [0.9, 1, 0.9]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut'
                    }}
                  >
                    <Icon size={24} />
                  </motion.a>
                </HoverCardTrigger>
                <HoverCardContent className="bg-white/5 border border-white/10 backdrop-blur-md">
                  <p className="text-sm text-gray-200">{text === 'GitHub' ? 'Follow me on GitHub' : `View my ${text} profile`}</p>
                </HoverCardContent>
              </HoverCard>
            ))}
          </motion.div>

          <motion.div
            className="mt-5 flex flex-wrap gap-3 justify-center md:justify-start"
            initial={{ opacity: 0, y: 12 }}
            animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.25, delay: 0.9 }}
          >
            {[
              { text: 'LeetCode 100 Days', color: 'lime', bgColor: 'bg-lime' },
              { text: 'CodeChef Badges', color: 'gold', bgColor: 'bg-gold' },
              { text: 'HackerEarth Achiever', color: 'cyan-400', bgColor: 'bg-cyan-500' },
            ].map(({ text, color, bgColor }) => (
              <motion.div
                key={text}
                className={`achievement-badge interactive bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10`}
                whileHover={{ 
                  scale: 1.06,
                  boxShadow: `0 0 18px rgba(204, 255, 0, 0.45)`,
                  rotate: 0.4
                }}
                animate={{
                  scale: [1, 1.015, 1],
                  opacity: [0.95, 1, 0.95]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut'
                }}
              >
                <span className={`h-2 w-2 rounded-full ${bgColor}`} />
                <span className={`text-sm font-medium text-${color}`}>{text}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start bg-white/5 backdrop-blur-md p-2.5 rounded-xl border border-white/10"
            initial={{ opacity: 0, y: 12 }}
            animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.25, delay: 1 }}
            whileHover={{ 
              scale: 1.01, 
              boxShadow: '0 0 18px rgba(204, 255, 0, 0.35)',
              rotate: -0.4
            }}
          >
            <motion.span
              animate={{
                scale: [1, 1.004, 1],
                opacity: [0.95, 1, 0.95]
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }}
            >
              <span className="text-sm text-gray-300">
                <span className="text-gray-100 font-medium">Jaipur, Rajasthan</span>
              </span>
            </motion.span>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <motion.div
          className="w-6 h-9 border border-white/20 rounded-full flex justify-center p-1.5"
          animate={{ 
            y: [0, 3, 0],
            scale: [1, 1.06, 1]
          }}
          transition={{ 
            duration: 1.3, 
            repeat: Infinity, 
            repeatType: 'reverse',
            ease: [0.6, -0.05, 0.01, 0.99]
          }}
        >
          <motion.div
            className="w-1.5 h-2.5 bg-lime/50 rounded-full"
            animate={{ 
              y: [0, 3, 0], 
              opacity: [0.5, 0.65, 0.5],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 1.3, 
              repeat: Infinity, 
              repeatType: 'reverse',
              ease: [0.6, -0.05, 0.01, 0.99]
            }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
