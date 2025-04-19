import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Code, ExternalLink } from 'lucide-react';
import * as THREE from 'three';
import ParticleField from './ParticleField'; // Assuming this component is optimized
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card'; // Assuming './ui/hover-card' exists

// Define TypeScript interfaces
interface MousePosition {
  x: number;
  y: number;
}

// Simple Particle component for Name Hover
const HoverParticle = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full bg-gradient-to-br from-lime to-teal pointer-events-none"
    style={{
      originX: 0.5,
      originY: 0.5,
      willChange: 'transform, opacity', // Optimization hint
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 0.8, 0],
      x: (Math.random() - 0.5) * 60, // Spread out
      y: (Math.random() - 0.5) * 60,
    }}
    transition={{
      duration: 0.6 + Math.random() * 0.4,
      ease: 'easeOut',
      delay: delay,
      opacity: { times: [0, 0.2, 0.8, 1], duration: 0.8 + Math.random() * 0.4 },
    }}
  />
);

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nameWrapperRef = useRef<HTMLDivElement>(null); // Ref for name wrapper

  const [isRevealed, setIsRevealed] = useState(false);
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const [webGLMousePos, setWebGLMousePos] = useState({ x: 0, y: 0 }); // For WebGL interaction
  const [cursorSize, setCursorSize] = useState(20);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'interactive'>('default');
  const [isMounted, setIsMounted] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isHoveringName, setIsHoveringName] = useState(false); // State for name hover

  // Parallax effect on scroll
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 100]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const bgParallax = useTransform(scrollY, [0, 600], [0, -40]);

  // Smooth cursor size/style with spring physics
  const springCursorSize = useSpring(cursorVariant === 'interactive' ? 35 : 20, { stiffness: 600, damping: 30 });
  const springCursorOpacity = useSpring(cursorVariant === 'interactive' ? 0.3 : 0.2, { stiffness: 400, damping: 30 });
  const springCursorScale = useSpring(1, { stiffness: 600, damping: 30 });

  // Text animation characters
  const titleChars = "Hi, I'm".split('');
  const nameChars = "Nikhil Jangid".split('');

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  // Intersection Observer for lazy loading + Initial Mount/Mobile Check
  useEffect(() => {
    setIsMounted(true);
    const checkMobileOnMount = () => setIsMobile(window.innerWidth < 768);
    checkMobileOnMount();

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    const currentRef = containerRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);


  // WebGL Nebula with Mouse Interaction
  useEffect(() => {
    if (isMobile || !canvasRef.current || !isInView) return;

    let rafId: number;
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Consider turning off antialias if performance is critical on some devices
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Cap pixel ratio for performance boost on high-res screens
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const particleCount = 120; // Keeping the reduced count
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const initialPositions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    const colorChoices = [new THREE.Color('#CCFF00'), new THREE.Color('#00C4B4'), new THREE.Color('#8B00FF')];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = initialPositions[i3] = (Math.random() - 0.5) * 6;
      positions[i3 + 1] = initialPositions[i3 + 1] = (Math.random() - 0.5) * 6;
      positions[i3 + 2] = initialPositions[i3 + 2] = (Math.random() - 0.5) * 6;

      const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      velocities[i3] = 0; velocities[i3 + 1] = 0; velocities[i3 + 2] = 0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.attributes.position.needsUpdate = true;

    const material = new THREE.PointsMaterial({
      size: 0.015,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    camera.position.z = 2.5;

    const mouseVector = new THREE.Vector3();
    const interactionRadius = 0.5;
    const pushForce = 0.03;
    const returnForce = 0.01;
    const damping = 0.92;

    let lastFrame = performance.now();
    const animate = (time: number) => {
      const delta = Math.min(time - lastFrame, 33) / 1000;
      lastFrame = time;

      particles.rotation.y += 0.0003 * (delta * 60);
      particles.rotation.x += 0.00008 * (delta * 60);

       mouseVector.set(
        (webGLMousePos.x / window.innerWidth) * 2 - 1,
        -(webGLMousePos.y / window.innerHeight) * 2 + 1,
         0.5
       );
       mouseVector.unproject(camera);
       const dir = mouseVector.sub(camera.position).normalize();
       const distance = -camera.position.z / dir.z;
       const mouseWorldPos = camera.position.clone().add(dir.multiplyScalar(distance));

      const currentPositions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const dx = currentPositions[i3] - mouseWorldPos.x;
        const dy = currentPositions[i3 + 1] - mouseWorldPos.y;
        const distSq = dx * dx + dy * dy;

        let forceX = 0;
        let forceY = 0;

        if (distSq < interactionRadius * interactionRadius) {
          const dist = Math.sqrt(distSq);
          const force = (pushForce * (interactionRadius - dist)) / interactionRadius;
          forceX = (dx / dist) * force;
          forceY = (dy / dist) * force;
        }

        forceX += (initialPositions[i3] - currentPositions[i3]) * returnForce;
        forceY += (initialPositions[i3 + 1] - currentPositions[i3 + 1]) * returnForce;

        velocities[i3] += forceX;
        velocities[i3 + 1] += forceY;
        velocities[i3] *= damping;
        velocities[i3 + 1] *= damping;
        currentPositions[i3] += velocities[i3];
        currentPositions[i3 + 1] += velocities[i3 + 1];
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    if (isInView) rafId = requestAnimationFrame(animate);

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }, 150);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
      // Attempt to dispose of resources safely
      geometry?.dispose();
      material?.dispose();
      renderer?.dispose();
      scene?.remove(particles);
    };
  }, [isMobile, isInView, webGLMousePos]);

  // Mouse and interaction handling (Throttled)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);

    let lastMove = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMove < 16) return; // Throttle ~60fps
      lastMove = now;

      if (!containerRef.current || isMobile) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const relX = x / rect.width - 0.5;
      const relY = y / rect.height - 0.5;

      setMousePos({ x: x, y: y });
      setWebGLMousePos({ x: e.clientX, y: e.clientY });

      const targetElement = e.target as Element;
      const isInteractive = targetElement?.closest('.interactive');
      setCursorVariant(isInteractive ? 'interactive' : 'default');
      springCursorScale.set(isInteractive ? 1.1 : 1);

      const elements = containerRef.current.querySelectorAll<HTMLElement>('.magnetic-element');
      elements.forEach(el => {
        const strength = parseFloat(el.dataset.strength || '10');
        el.style.transform = `translate3d(${relX * strength}px, ${relY * strength}px, 0)`;
        el.style.transition = 'transform 0.1s ease-out';
      });
    };

    const handleMouseLeave = () => {
        if (!containerRef.current || isMobile) return;
        const elements = containerRef.current.querySelectorAll<HTMLElement>('.magnetic-element');
        elements.forEach(el => {
             el.style.transform = `translate3d(0px, 0px, 0px)`;
             el.style.transition = 'transform 0.3s ease-out';
        });
        setCursorVariant('default');
        springCursorScale.set(1);
    };

    const element = containerRef.current;
    if (element && !isMobile) {
      element.addEventListener('mousemove', handleMouseMove, { passive: true });
      element.addEventListener('mouseleave', handleMouseLeave);
    }

    const timer = setTimeout(() => setIsRevealed(true), 300);

    return () => {
      if (element && !isMobile) {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, springCursorScale]);

  // Name hover handlers
  const handleNameEnter = useCallback(() => setIsHoveringName(true), []);
  const handleNameLeave = useCallback(() => setIsHoveringName(false), []);

  // Memoize badge class generation
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
      {/* Staged Background Fade-in */}
      <AnimatePresence>
       {isMounted && isInView && (
         <>
            {/* WebGL Nebula Background */}
            {!isMobile && (
                <motion.canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: 1, willChange: 'opacity' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 1.5, delay: 0.1, ease: 'easeOut' }}
                />
            )}

            {/* Fallback CSS Background for Mobile */}
            {isMobile && (
                <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple/15 via-teal/15 to-lime/15"
                style={{ zIndex: 1, willChange: 'opacity, transform' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6, scale: [1, 1.01, 1] }}
                transition={{
                    opacity: { duration: 1.5, delay: 0.1, ease: 'easeOut' },
                    scale: { duration: 8, repeat: Infinity, repeatType: 'reverse' }
                }}
                />
            )}

            {/* Dynamic Background Layers Wrapper */}
             <motion.div
                className="absolute inset-0 overflow-hidden"
                style={{ y: bgParallax, zIndex: 2, willChange: 'transform' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.0, delay: 0.3, ease: 'easeOut' }}
             >
                {/* Mouse-Interactive Glow Pulse */}
                {!isMobile && (
                <motion.div
                    className="absolute w-[150px] h-[150px] rounded-full bg-gradient-radial from-lime/10 via-teal/5 to-transparent blur-2xl pointer-events-none"
                    style={{
                    x: mousePos.x - 75,
                    y: mousePos.y - 75,
                    willChange: 'transform'
                    }}
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                />
                )}

                {/* Ambient Light Pulses */}
                {!isMobile && (
                <div className="absolute inset-0">
                    {Array.from({ length: 2 }).map((_, index) => (
                    <motion.div
                        key={`pulse-${index}`}
                        className="absolute w-[100px] h-[100px] rounded-full bg-gradient-to-br from-lime/5 to-purple/5 blur-xl"
                        style={{
                         top: `${15 + index * 40}%`,
                         left: `${10 + index * 60}%`,
                         willChange: 'opacity, transform'
                        }}
                        animate={{
                        opacity: [0.05, 0.15, 0.05],
                        scale: [0.9, 1.1, 0.9],
                        x: [0, 8, -8, 0],
                        }}
                        transition={{
                        duration: 7 + index * 3,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        delay: index * 0.7,
                        }}
                    />
                    ))}
                </div>
                )}

                {/* Minimal Starfield REMOVED FOR PERFORMANCE */}
                {/*
                {!isMobile && (
                    <div className="absolute inset-0 pointer-events-none">
                        {Array.from({ length: 35 }).map((_, index) => (
                        <motion.div
                            key={`star-${index}`}
                            className="absolute w-[1.5px] h-[1.5px] rounded-full bg-white/50"
                            style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            willChange: 'opacity, transform'
                            }}
                            animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.5, 1, 0.5] }}
                            transition={{
                            duration: 1.8 + Math.random() * 1.5,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            delay: Math.random() * 3,
                            }}
                        />
                        ))}
                    </div>
                )}
                 */}


                {/* Optimized Particle Field */}
                <ParticleField
                particleCount={isMobile ? 10 : 35} // Slightly increased count to compensate for stars
                colors={['#CCFF00', '#00C4B4', '#8B00FF']}
                minSize={0.15}
                maxSize={0.7}
                speed={0.15}
                swarmFactor={0.04}
                className="opacity-25 pointer-events-none" // Slightly increased opacity
                style={{ zIndex: 3, willChange: 'transform' }}
                />

                {/* Holographic Grid Overlay */}
                 <motion.div
                    className="absolute inset-0 bg-grid-pattern mix-blend-soft-light"
                    style={{
                         zIndex: 4,
                        '--grid-color-1': '#CCFF00',
                        '--grid-color-2': '#00C4B4',
                        willChange: 'opacity, background-position'
                    }}
                    animate={{
                         opacity: [0.08, 0.18, 0.08],
                         backgroundPosition: ['0% 0%', '100% 100%'],
                         '--grid-color-1': ['#CCFF00', '#8B00FF', '#CCFF00'],
                         '--grid-color-2': ['#00C4B4', '#CCFF00', '#00C4B4'],
                    } as any}
                    transition={{
                        opacity: { duration: 5, repeat: Infinity, repeatType: 'reverse' },
                        backgroundPosition: { duration: 20, repeat: Infinity, repeatType: 'loop', ease: 'linear' },
                         default: { duration: 10, repeat: Infinity, repeatType: 'reverse' }
                    }}
                >
                    {/* Add dynamic grid color via style */}
                     <style>{`
                        .bg-grid-pattern {
                         background-image: linear-gradient(to right, var(--grid-color-1, #CCFF00) 1px, transparent 1px),
                                           linear-gradient(to bottom, var(--grid-color-2, #00C4B4) 1px, transparent 1px);
                         background-size: 35px 35px;
                         opacity: 0.1; /* Base opacity set via class */
                         }
                    `}</style>
                </motion.div>
            </motion.div>
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
            scale: springCursorScale,
            zIndex: 1000,
            willChange: 'width, height, transform, opacity'
          }}
          transition={{ type: 'spring', stiffness: 600, damping: 30 }}
        >
           {/* Cursor Ring Effect */}
           <motion.div
            className="absolute inset-[-3px] rounded-full border-2 border-lime/50"
            style={{ willChange: 'transform, opacity' }}
            animate={{
                scale: cursorVariant === 'interactive' ? 1.3 : 0,
                opacity: cursorVariant === 'interactive' ? [0, 0.8, 0] : 0
            }}
            transition={{
                duration: 0.4,
                ease: 'circOut',
                opacity: { duration: 0.4, ease: 'linear'}
            }}
           />
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        style={{ y, opacity, zIndex: 10, willChange: 'transform, opacity' }}
        className="section-container relative px-4 text-center md:text-left flex flex-col items-center md:items-start"
      >
        {/* Title: "Hi, I'm" */}
        <motion.div className="mb-1 overflow-hidden">
          <div className="flex justify-center md:justify-start">
            {titleChars.map((char, index) => (
              <motion.span
                key={`title-${index}`}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-300 inline-block mr-[1px]"
                style={{ willChange: 'transform, opacity' }}
                initial={{ y: '100%', opacity: 0 }}
                animate={isRevealed ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.5 + index * 0.04, ease: [0.16, 1, 0.3, 1] }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Name: "Nikhil Jangid" with Enhanced Hover */}
        <motion.div
          ref={nameWrapperRef}
          className="relative mb-6 group interactive"
          whileHover="hover"
          onMouseEnter={handleNameEnter}
          onMouseLeave={handleNameLeave}
          style={{ cursor: 'pointer' }}
        >
          {/* Background Glow on Hover */}
          <motion.div
            className="absolute -inset-x-3 -inset-y-1.5 bg-gradient-to-r from-lime/10 via-purple/10 to-teal/10 opacity-0 group-hover:opacity-100 blur-xl rounded-lg transition-opacity duration-300 -z-10"
            variants={{ hover: { opacity: 1, scale: 1.08 } }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
          {/* Name Particle Emitter */}
          <AnimatePresence>
            {isHoveringName && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <HoverParticle key={i} delay={i * 0.02} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center md:justify-start flex-wrap">
            {nameChars.map((char, index) => (
              <motion.span
                key={`name-${index}`}
                className={`text-4xl md:text-6xl lg:text-7xl font-bold inline-block relative mr-[1px] transition-colors duration-300 ease-out ${
                  isHoveringName ? 'text-transparent' : 'text-white'
                }`}
                style={{
                  willChange: 'transform, opacity, color', // Added color to will-change
                  backgroundImage: isHoveringName
                    ? 'linear-gradient(90deg, #CCFF00, #00C4B4, #8B00FF, #CCFF00)'
                    : 'none',
                  backgroundSize: '250% auto',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  animation: isHoveringName ? 'gradient-shine 3s linear infinite' : 'none',
                }}
                initial={{ y: '100%', opacity: 0 }}
                animate={isRevealed ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.7 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                variants={{
                  hover: {
                    y: (Math.random() - 0.5) * 5,
                    rotate: (Math.random() - 0.5) * 4,
                    transition: { duration: 0.2, delay: index * 0.015, type: 'spring', stiffness: 300, damping: 8 }
                  }
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>
          {/* Animated Underline */}
          <motion.div
            className="absolute -bottom-2.5 left-0 w-full h-[3px] bg-gradient-to-r from-teal via-lime to-purple rounded-full origin-left"
            style={{ willChange: 'transform, opacity' }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isRevealed ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="absolute inset-0 bg-white/40"
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse', delay: 1.8 }}
            />
          </motion.div>
        </motion.div>

        {/* Subtitle */}
        <motion.h2
          className="text-xl md:text-2xl mb-8 text-gray-300 max-w-xl bg-black/30 backdrop-blur-sm p-4 rounded-lg shadow-md"
          style={{ willChange: 'transform, opacity' }}
          initial={{ opacity: 0, y: 20 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 1.5 }}
        >
          <span className="text-lime font-semibold">Full-stack developer</span> & <span className="text-teal font-semibold">problem solver</span> crafting immersive digital experiences from <span className="font-medium text-gray-100">Jaipur</span>. {/* Added location subtly */}
        </motion.h2>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-wrap gap-4 mb-10 justify-center md:justify-start"
          initial="hidden"
          animate={isRevealed ? "visible" : "hidden"}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 1.5, staggerChildren: 0.1 } },
            hidden: { opacity: 0, y: 20 }
          }}
        >
          <motion.a
            href="#contact"
            className="relative px-7 py-3.5 bg-gradient-to-r from-lime to-teal text-inkyblack font-bold rounded-lg overflow-hidden group interactive shadow-lg shadow-lime/25 hover:shadow-xl hover:shadow-lime/35"
             style={{ willChange: 'transform, box-shadow' }}
            variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}
            whileHover={{ scale: 1.06, y: -3 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
          >
            <span className="relative z-10">Get in touch</span>
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100"
              animate={{ x: ['-110%', '110%'] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
            />
          </motion.a>
          <motion.a
            href="#projects"
            className="relative px-7 py-3.5 bg-black/30 text-white font-semibold rounded-lg border border-lime/50 overflow-hidden group interactive backdrop-blur-md hover:border-lime/80 hover:bg-black/40"
             style={{ willChange: 'transform, border-color, background-color' }}
            variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}
            whileHover={{ scale: 1.06, y: -3 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
          >
            <span className="relative z-10">View projects</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-lime/20 to-teal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"
            />
          </motion.a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="flex space-x-6 mb-8"
           initial="hidden"
           animate={isRevealed ? "visible" : "hidden"}
           variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 1.7, staggerChildren: 0.08 } },
            hidden: { opacity: 0, y: 15 }
           }}
        >
          {[
            { href: 'https://github.com/nikhiljangid120', icon: Github, text: 'GitHub' },
            { href: 'https://www.linkedin.com/in/nikhil-jangid-b84360264/', icon: Linkedin, text: 'LinkedIn' },
            { href: 'https://leetcode.com/u/nikhil_888/', icon: Code, text: 'LeetCode' },
            { href: 'https://www.geeksforgeeks.org/user/nikhiljals77/', icon: ExternalLink, text: 'GeeksForGeeks' },
          ].map(({ href, icon: Icon, text }) => (
            <motion.div key={text} variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 15 } }}>
                <HoverCard openDelay={150} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <motion.a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-lime transition-colors duration-200 magnetic-element interactive relative group"
                    data-strength="15"
                    style={{ willChange: 'transform' }}
                    whileHover={{ scale: 1.25, y: -4, rotate: 8 }}
                    whileTap={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 8 }}
                  >
                    <Icon size={28} />
                    <motion.span
                      className="absolute -inset-2 bg-lime/15 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"
                    />
                  </motion.a>
                </HoverCardTrigger>
                <HoverCardContent className="bg-inkyblack/85 border border-lime/20 backdrop-blur-lg text-sm text-gray-200 shadow-xl rounded-lg">
                  {text === 'GitHub' ? 'Explore my code on GitHub' : `Visit my ${text} profile`}
                </HoverCardContent>
              </HoverCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievement badges */}
        <motion.div
          className="flex flex-wrap gap-3 justify-center md:justify-start mb-6"
           initial="hidden"
           animate={isRevealed ? "visible" : "hidden"}
           variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 1.9, staggerChildren: 0.06 } },
            hidden: { opacity: 0, y: 15 }
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
                className={`interactive bg-black/40 backdrop-blur px-3.5 py-1.5 rounded-full flex items-center gap-2.5 ${classes.border} shadow-md cursor-default group`}
                 style={{ willChange: 'transform, box-shadow' }}
                variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 15 } }}
                whileHover={{ scale: 1.1, y: -2, rotate: 1, boxShadow: `0 5px 12px -3px rgba(204, 255, 0, 0.2)` }}
                transition={{ type: 'spring', stiffness: 350, damping: 10 }}
              >
                <motion.span
                  className={`h-2.5 w-2.5 rounded-full ${classes.bg}`}
                  animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.3, repeat: Infinity, repeatType: 'reverse' }}
                />
                <span className={`text-xs font-medium ${classes.text}`}>{text}</span>
                <motion.span
                  className="absolute -inset-1.5 bg-lime/10 blur-md rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-200 -z-10"
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Contact information - Removed as location added to subtitle */}
        {/*
        <motion.div
          className="text-sm text-gray-400 bg-black/30 backdrop-blur px-4 py-1.5 rounded-lg shadow-sm"
           style={{ willChange: 'transform, opacity' }}
           initial={{ opacity: 0, y: 10 }}
           animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
           transition={{ duration: 0.6, delay: 2.1 }}
        >
          Based in <span className="text-gray-200 font-medium">Jaipur, Rajasthan</span> <span className="inline-block ml-1">🇮🇳</span>
        </motion.div>
        */}

      </motion.div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <motion.div
          className="w-1 h-5 border-0 border-lime/40 rounded-full flex justify-center items-end pb-[3px]"
           style={{ willChange: 'opacity' }}
           initial={{ opacity: 0 }}
           animate={isRevealed ? { opacity: [0, 0.6, 0.6, 0], y: [0, 5, 5, 10] } : { opacity: 0 }}
           transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: 4, repeatDelay: 2 }}
        >
            <motion.div
             className="w-1 h-1 bg-lime/80 rounded-full"
           />
        </motion.div>
      </div>

      {/* Add the gradient animation style globally */}
      <style>{`
        @keyframes gradient-shine {
          to { background-position: 250% center; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;