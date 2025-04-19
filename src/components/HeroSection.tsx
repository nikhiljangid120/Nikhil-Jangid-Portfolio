import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Github, Linkedin, Code, ExternalLink } from 'lucide-react';
import * as THREE from 'three';
import ParticleField from './ParticleField';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card';

// Define TypeScript interfaces
interface MousePosition {
  x: number;
  y: number;
}

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const [cursorSize, setCursorSize] = useState(20);
  const [isMounted, setIsMounted] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Parallax effect on scroll
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 70]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const bgParallax = useTransform(scrollY, [0, 500], [0, -30]);

  // Smooth cursor size with spring physics
  const springCursorSize = useSpring(cursorSize, { stiffness: 700, damping: 45 });

  // Text animation characters
  const titleChars = "Hi, I'm".split('');
  const nameChars = "Nikhil Jangid".split('');

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  // WebGL Nebula and 3D Masking Effect
  useEffect(() => {
    setIsMounted(true);
    if (isMobile || !canvasRef.current || !isInView) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(1); // Optimize for performance

    // Nebula particle system
    const particleCount = 300;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      const color = new THREE.Color(
        Math.random() > 0.5 ? '#CCFF00' : Math.random() > 0.5 ? '#00C4B4' : '#8B00FF'
      );
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.007,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Procedural circuit texture for masking
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#CCFF00';
    ctx.lineWidth = 2;
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 256, Math.random() * 256);
      ctx.lineTo(Math.random() * 256, Math.random() * 256);
      ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);

    // 3D masking planes for each character
    const planes: THREE.Mesh[] = [];
    textRefs.current.forEach((ref, index) => {
      if (!ref) return;
      const { left, top, width, height } = ref.getBoundingClientRect();
      const planeGeometry = new THREE.PlaneGeometry(width / 100, height / 100);
      const planeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        alphaTest: 0.5,
      });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.position.set(
        (left + width / 2 - window.innerWidth / 2) / 100,
        -(top + height / 2 - window.innerHeight / 2) / 100,
        0
      );
      planes[index] = plane;
      scene.add(plane);
    });

    camera.position.z = 2;

    // Optimized animation loop
    let lastFrame = 0;
    let rafId: number;
    const animate = (time: number) => {
      const delta = Math.min(time - lastFrame, 33);
      lastFrame = time;
      particles.rotation.y += 0.0006 * (delta / 16);
      particles.rotation.x += 0.00015 * (delta / 16);
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    if (isInView) rafId = requestAnimationFrame(animate);

    // Mouse interaction for 3D tilt
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top } = containerRef.current!.getBoundingClientRect();
      const x = (e.clientX - left) / window.innerWidth;
      const y = (e.clientY - top) / window.innerHeight;
      planes.forEach(plane => {
        plane.rotation.x = (y - 0.5) * 0.5;
        plane.rotation.y = (x - 0.5) * -0.5;
      });
    };
    if (!isMobile) window.addEventListener('mousemove', handleMouseMove);

    // Debounced resize
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        planes.forEach((plane, index) => {
          const ref = textRefs.current[index];
          if (!ref) return;
          const { left, top, width, height } = ref.getBoundingClientRect();
          plane.position.set(
            (left + width / 2 - window.innerWidth / 2) / 100,
            -(top + height / 2 - window.innerHeight / 2) / 100,
            0
          );
          plane.geometry = new THREE.PlaneGeometry(width / 100, height / 100);
        });
      }, 150);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
      renderer.dispose();
    };
  }, [isMobile, isInView]);

  // Mouse and interaction handling
  useEffect(() => {
    // Check mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Throttled mouse move handler
    let lastMove = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMove < 16) return; // Throttle to 60fps
      lastMove = now;

      if (!containerRef.current || isMobile) return;

      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      setMousePos({ x: e.clientX - left, y: e.clientY - top });

      const elements = containerRef.current.querySelectorAll('.magnetic-element');
      elements.forEach(element => {
        const el = element as HTMLElement;
        const strength = parseFloat(el.dataset.strength || '8');
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });

      // Adjust cursor size
      const isHoveringInteractive = containerRef.current.querySelector(':hover.interactive');
      setCursorSize(isHoveringInteractive ? 25 : 20);
    };

    const element = containerRef.current;
    if (element && !isMobile) {
      element.addEventListener('mousemove', handleMouseMove);
    }

    // Trigger text reveal
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 700);

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-inkyblack"
    >
      {/* WebGL Nebula Background */}
      {isMounted && !isMobile && isInView && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        />
      )}

      {/* Fallback CSS Background for Mobile */}
      {isMounted && isMobile && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple/10 via-teal/10 to-lime/10 opacity-45"
          animate={{ scale: [1, 1.005, 1], opacity: [0.45, 0.65, 0.45] }}
          transition={{ duration: 7, repeat: Infinity, repeatType: 'reverse' }}
          style={{ zIndex: 1 }}
        />
      )}

      {/* Dynamic Background Layers */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{ y: bgParallax, zIndex: 2 }}
      >
        {/* Mouse-Interactive Glow Pulse */}
        {isMounted && !isMobile && isInView && (
          <motion.div
            className="absolute w-[100px] h-[100px] rounded-full bg-gradient-to-r from-lime/20 to-teal/20 blur-lg pointer-events-auto"
            style={{ x: mousePos.x - 50, y: mousePos.y - 50 }}
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.2, 0.35, 0.2],
              rotate: [0, 6, -6, 0],
            }}
            transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          />
        )}

        {/* Ambient Light Pulses */}
        {isMounted && !isMobile && isInView && (
          <motion.div className="absolute inset-0">
            {Array.from({ length: 2 }).map((_, index) => (
              <motion.div
                key={`pulse-${index}`}
                className="absolute w-[70px] h-[70px] rounded-full bg-gradient-to-r from-lime/08 to-transparent blur-md"
                style={{ top: `${10 + index * 20}%`, left: `${5 + index * 15}%` }}
                animate={{
                  opacity: [0.08, 0.2, 0.08],
                  scale: [0.8, 1, 0.8],
                  x: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 5 + index * 1.5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: index * 0.3,
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Minimal Starfield */}
        {isMounted && !isMobile && isInView && (
          <motion.div className="absolute inset-0">
            {Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={`star-${index}`}
                className="absolute w-[1px] h-[1px] rounded-full bg-white/25"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{ opacity: [0.15, 0.5, 0.15], scale: [0.5, 0.8, 0.5] }}
                transition={{
                  duration: 1.2 + Math.random() * 0.3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: index * 0.1,
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Nano-Particle Trails */}
        {isMounted && !isMobile && isInView && (
          <motion.div className="absolute inset-0">
            {Array.from({ length: 10 }).map((_, index) => (
              <motion.div
                key={`nano-particle-${index}`}
                className="absolute w-[1.5px] h-[1.5px] rounded-full bg-gradient-to-r from-lime/35 to-teal/35"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [
                    0,
                    Math.random() * 10 - 5 + (mousePos.x - window.innerWidth / 2) * 0.01,
                    0,
                  ],
                  y: [
                    0,
                    Math.random() * 10 - 5 + (mousePos.y - window.innerHeight / 2) * 0.01,
                    0,
                  ],
                  scale: [0.5, 0.9, 0.5],
                  opacity: [0.25, 0.45, 0.25],
                }}
                transition={{
                  duration: 0.7 + Math.random() * 0.6,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: index * 0.07,
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Optimized Particle Field */}
        {isMounted && isInView && (
          <ParticleField
            particleCount={isMobile ? 15 : 60}
            colors={['#CCFF00', '#00C4B4', '#8B00FF', '#FFB100', '#D94F30']}
            minSize={0.1}
            maxSize={0.5}
            speed={0.3}
            swarmFactor={0.07}
            className="opacity-20"
            animate={{
              x: [0, 10, -10, 0],
              y: [0, -10, 10, 0],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
            style={{ zIndex: 3 }}
          />
        )}

        {/* Holographic Grid Overlay */}
        {isMounted && isInView && (
          <motion.div
            className="absolute inset-0 bg-grid-pattern opacity-15"
            animate={{ opacity: [0.15, 0.25, 0.15], scale: [1, 1.005, 1] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
            style={{ zIndex: 4 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-lime/08 to-transparent blur-sm"
              animate={{ x: ['-100%', '100%'], opacity: [0, 0.15, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'linear',
              }}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Custom Cursor */}
      {isMounted && !isMobile && (
        <motion.div
          className="absolute rounded-full bg-gradient-to-r from-lime/25 to-teal/25 blur-sm pointer-events-none"
          style={{
            width: springCursorSize,
            height: springCursorSize,
            x: mousePos.x - springCursorSize.get() / 2,
            y: mousePos.y - springCursorSize.get() / 2,
            zIndex: 1000,
          }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 0.7, repeat: Infinity, repeatType: 'reverse' }}
        />
      )}

      <motion.div style={{ y, opacity, zIndex: 10 }} className="section-container relative">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <motion.div className="relative mb-8 overflow-hidden">
            <div className="flex justify-center md:justify-start mb-2">
              {titleChars.map((char, index) => (
                <motion.span
                  key={`title-${index}`}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold text-white inline-block relative"
                  initial={{ y: 70, opacity: 0 }}
                  animate={isRevealed ? { y: 0, opacity: 1 } : { y: 70, opacity: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 + index * 0.03,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  whileHover={{
                    y: -3,
                    rotate: [0, 1.5, -1.5, 0],
                    scale: 1.02,
                    transition: { duration: 0.15 },
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                  <motion.span
                    className="absolute -inset-1 bg-gradient-to-r from-lime/10 to-teal/10 blur-sm rounded -z-10"
                    animate={{ opacity: [0, 0.15, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      delay: index * 0.07,
                    }}
                  />
                </motion.span>
              ))}
            </div>

            <div className="flex justify-center md:justify-start flex-wrap relative">
              {nameChars.map((char, index) => (
                <motion.span
                  key={`name-${index}`}
                  ref={el => (textRefs.current[index] = el)}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold text-white inline-block relative"
                  style={{ textShadow: '0 0 6px rgba(204, 255, 0, 0.5)' }}
                  initial={{ y: 70, opacity: 0, scale: 0.96 }}
                  animate={
                    isRevealed
                      ? { y: 0, opacity: 1, scale: 1 }
                      : { y: 70, opacity: 0, scale: 0.96 }
                  }
                  transition={{
                    duration: 0.7,
                    delay: 0.3 + index * 0.04,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  whileHover={{
                    y: -3,
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                >
                  <span className="relative">
                    {char === ' ' ? '\u00A0' : char}
                    {/* Neon Circuit Pulse */}
                    <motion.span
                      className="absolute -inset-1 bg-gradient-to-r from-lime/25 via-purple/25 to-teal/25 blur-md rounded -z-10"
                      animate={{ opacity: [0.15, 0.5, 0.15], scale: [1, 1.03, 1] }}
                      transition={{
                        duration: 0.9,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        delay: index * 0.07,
                      }}
                    />
                    {/* Holographic Shine */}
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-lime/15 via-white/15 to-teal/15 -z-10"
                      animate={{ x: ['-100%', '100%'], opacity: [0, 0.25, 0] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: 'loop',
                        ease: 'linear',
                        delay: index * 0.1,
                      }}
                    />
                    {/* Particle Burst on Hover */}
                    <motion.span
                      className="absolute w-1 h-1 bg-lime/30 rounded-full -z-10"
                      initial={{ x: 0, y: 0, opacity: 0 }}
                      whileHover={{
                        x: [0, 6, 12],
                        y: [0, -6, -12],
                        opacity: [0, 0.3, 0],
                      }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </span>
                </motion.span>
              ))}
              <motion.div
                className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-teal via-lime to-purple origin-left rounded-full"
                initial={{ scaleX: 0 }}
                animate={isRevealed ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.7, delay: 1, ease: 'easeInOut' }}
                animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.01, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
              >
                {/* Segmented Energy Flow */}
                {Array.from({ length: 4 }).map((_, index) => (
                  <motion.div
                    key={`segment-${index}`}
                    className="absolute w-[25%] h-full bg-white/25"
                    style={{ left: `${index * 25}%` }}
                    animate={{ opacity: [0.25, 0.7, 0.25], x: [0, 8, 0] }}
                    transition={{
                      duration: 0.7,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      delay: index * 0.08,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>

          <motion.h2
            className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl bg-inkyblack/30 backdrop-blur-sm p-4 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            animate={{ y: [0, -1, 0], opacity: [1, 0.9, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, repeatType: 'reverse' }}
          >
            <span className="text-lime font-medium">Full stack developer</span> and{' '}
            <span className="text-gold font-medium">problem solver</span> crafting immersive digital experiences.
          </motion.h2>

          <motion.div
            className="flex flex-wrap gap-4 mb-12 justify-center md:justify-start"
            initial={{ opacity: 0, y: 10 }}
            animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <motion.a
              href="#contact"
              className="relative px-6 py-3 bg-gradient-to-r from-lime/80 to-teal/80 text-inkyblack font-semibold rounded-md overflow-hidden group interactive backdrop-blur-sm"
              data-cursor-text="Let's talk"
              whileHover={{
                scale: 1.03,
                boxShadow: '0 6px 15px -5px rgba(204, 255, 0, 0.3)',
                rotate: [0, 0.3, -0.3, 0],
                y: -1,
              }}
              whileTap={{ scale: 0.97 }}
              animate={{ scale: [1, 1.01, 1], boxShadow: ['0 0 6px rgba(204, 255, 0, 0.15)', '0 0 10px rgba(204, 255, 0, 0.25)', '0 0 6px rgba(204, 255, 0, 0.15)'] }}
              transition={{
                rotate: { duration: 0.15 },
                scale: { duration: 2.5, repeat: Infinity, repeatType: 'reverse' },
                boxShadow: { duration: 1, repeat: Infinity, repeatType: 'reverse' },
              }}
            >
              <span className="relative z-10">Get in touch</span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-25 transition-opacity duration-150"
                animate={{ x: ['-100%', '100%'], opacity: [0, 0.3, 0] }}
                transition={{
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 0.7,
                  ease: 'linear',
                }}
              />
            </motion.a>
            <motion.a
              href="#projects"
              className="relative px-6 py-3 bg-transparent text-white font-semibold rounded-md border border-lime/25 overflow-hidden group interactive backdrop-blur-sm"
              data-cursor-text="See work"
              whileHover={{
                scale: 1.03,
                borderColor: 'rgba(204, 255, 0, 0.4)',
                rotate: [0, -0.3, 0.3, 0],
                y: -1,
              }}
              whileTap={{ scale: 0.97 }}
              animate={{ scale: [1, 1.01, 1], borderColor: ['rgba(204, 255, 0, 0.25)', 'rgba(204, 255, 0, 0.35)', 'rgba(204, 255, 0, 0.25)'] }}
              transition={{
                rotate: { duration: 0.15 },
                scale: { duration: 2.5, repeat: Infinity, repeatType: 'reverse' },
                borderColor: { duration: 1, repeat: Infinity, repeatType: 'reverse' },
              }}
            >
              <span className="relative z-10">View projects</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-lime/15 to-teal/15 -z-10"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.15 }}
              />
            </motion.a>
          </motion.div>

          <motion.div
            className="flex space-x-6"
            initial={{ opacity: 0 }}
            animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 1.7 }}
          >
            {[
              { href: 'https://github.com/nikhiljangid120', icon: Github, text: 'GitHub' },
              { href: 'https://www.linkedin.com/in/nikhil-jangid-b84360264/', icon: Linkedin, text: 'LinkedIn' },
              { href: 'https://leetcode.com/u/nikhil_888/', icon: Code, text: 'LeetCode' },
              { href: 'https://www.geeksforgeeks.org/user/nikhiljals77/', icon: ExternalLink, text: 'GeeksForGeeks' },
            ].map(({ href, icon: Icon, text }, index) => (
              <HoverCard key={text}>
                <HoverCardTrigger asChild>
                  <motion.a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-lime transition-colors duration-150 magnetic-element interactive relative"
                    data-cursor-text={text}
                    data-strength="10"
                    whileHover={{
                      scale: 1.15,
                      rotate: [0, 2, -2, 0],
                      y: -1,
                    }}
                    animate={{
                      rotate: [0, 0.5, -0.5, 0],
                      scale: [1, 1.03, 1],
                      boxShadow: ['0 0 6px rgba(204, 255, 0, 0)', '0 0 8px rgba(204, 255, 0, 0.15)', '0 0 6px rgba(204, 255, 0, 0)'],
                    }}
                    transition={{
                      rotate: { duration: 2 + index * 0.3, repeat: Infinity, repeatType: 'reverse' },
                      scale: { duration: 2 + index * 0.3, repeat: Infinity, repeatType: 'reverse' },
                      boxShadow: { duration: 0.8, repeat: Infinity, repeatType: 'reverse' },
                    }}
                  >
                    <Icon size={28} />
                    <motion.span
                      className="absolute -inset-1 bg-lime/10 blur-sm rounded-full -z-10"
                      animate={{ opacity: [0, 0.15, 0] }}
                      transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', delay: index * 0.1 }}
                    />
                  </motion.a>
                </HoverCardTrigger>
                <HoverCardContent className="bg-inkyblack/70 border border-lime/10 backdrop-blur-sm">
                  <p className="text-sm text-gray-200">{text === 'GitHub' ? 'Follow me on GitHub' : `View my ${text} profile`}</p>
                </HoverCardContent>
              </HoverCard>
            ))}
          </motion.div>

          {/* Achievement badges */}
          <motion.div
            className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start"
            initial={{ opacity: 0, y: 10 }}
            animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.6, delay: 1.9 }}
          >
            {[
              { text: 'LeetCode 100 Days', color: 'lime', bgColor: 'bg-lime' },
              { text: 'CodeChef Badges', color: 'gold', bgColor: 'bg-gold' },
              { text: 'HackerEarth Achiever', color: 'cyan-400', bgColor: 'bg-cyan-500' },
            ].map(({ text, color, bgColor }, index) => (
              <motion.div
                key={text}
                className={`achievement-badge interactive bg-inkyblack/30 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 border border-${color}/15`}
                data-cursor-text={text.split(' ')[0]}
                whileHover={{ scale: 1.05, rotate: [0, 1.5, -1.5, 0], y: -1 }}
                animate={{
                  y: [0, -1, 0],
                  scale: [1, 1.02, 1],
                  boxShadow: ['0 0 6px rgba(204, 255, 0, 0)', '0 0 8px rgba(204, 255, 0, 0.15)', '0 0 6px rgba(204, 255, 0, 0)'],
                }}
                transition={{
                  duration: 2 + index * 0.3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  rotate: { duration: 0.15 },
                  scale: { duration: 2 + index * 0.3, repeat: Infinity, repeatType: 'reverse' },
                  boxShadow: { duration: 0.8, repeat: Infinity, repeatType: 'reverse' },
                }}
              >
                <motion.span
                  className={`h-2 w-2 rounded-full ${bgColor}`}
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.9, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', delay: index * 0.1 }}
                />
                <span className={`text-xs font-medium text-${color}`}>{text}</span>
                <motion.span
                  className="absolute -inset-1 bg-lime/10 blur-sm rounded-full -z-10"
                  animate={{ opacity: [0, 0.1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', delay: index * 0.15 }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Contact information badges */}
          <motion.div
            className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start bg-inkyblack/30 backdrop-blur-sm p-3 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.6, delay: 2.1 }}
            animate={{ y: [0, -0.5, 0], opacity: [1, 0.9, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, repeatType: 'reverse' }}
          >
            <span className="text-sm text-gray-400">
              <span className="text-gray-200 font-medium">Jaipur, Rajasthan</span>
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <motion.div
          className="w-8 h-12 border-2 border-lime/15 rounded-full flex justify-center p-1 relative"
          animate={{ y: [0, 6, 0], scale: [1, 1.03, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        >
          <motion.div
            className="w-1.5 h-3 bg-lime/50 rounded-full"
            animate={{ y: [0, 6, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;