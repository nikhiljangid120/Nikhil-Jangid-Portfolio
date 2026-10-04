import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  animate,
} from 'framer-motion';
import { Github, Linkedin, Download, Code2, ChevronDown, MapPin, Briefcase, FileCode2 } from 'lucide-react';
import InteractiveHeroBackground from './InteractiveHeroBackground';

const stats = [
  { to: 2, suffix: '', decimals: 0, label: 'Internships' },
  { to: 5, suffix: '+', decimals: 0, label: 'Projects' },
  { to: 400, suffix: '+', decimals: 0, label: 'DSA Solved' },
  { to: 8.48, suffix: '', decimals: 2, label: 'CGPA' },
  { to: 4500, suffix: '+', decimals: 0, label: 'Commits' },
];
const titles = [
  'Software Engineer',
  'Backend Developer',
  'Full-Stack Developer',
  'AI Systems Engineer',
];

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/#_';

const useScramble = (text: string) => {
  const [output, setOutput] = useState(text);

  useEffect(() => {
    let frame = 0;
    const timer = setInterval(() => {
      frame += 1;
      const revealed = Math.floor(frame / 2);
      setOutput(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (i < revealed) return char;
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join('')
      );
      if (revealed >= text.length) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [text]);

  return output;
};

const CountUp = ({ to, decimals = 0, suffix = '' }: { to: number; decimals?: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState((0).toFixed(decimals));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionVal, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
    const unsubscribe = motionVal.on('change', (v) => setDisplay(v.toFixed(decimals)));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [inView, to, decimals]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
};

const PROFILE_CODE = `const engineer = {
  name: 'Nikhil Jangid',
  focus: ['Backend', 'AI Systems'],
  stack: ['NestJS', 'PostgreSQL', 'Docker'],
  openToWork: true,
};`;

const HeroVisual = () => {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [9, -9]), { stiffness: 160, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 160, damping: 20 });
  const glowX = useTransform(mx, (v) => v * 100);
  const glowY = useTransform(my, (v) => v * 100);
  const glow = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(38,235,218,0.14), transparent 60%)`;

  const [typedCode, setTypedCode] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setTypedCode(PROFILE_CODE.slice(0, i));
      if (i >= PROFILE_CODE.length) clearInterval(timer);
    }, 26);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <div className="perspective flex justify-center lg:justify-end">
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-72 sm:w-80"
      >
        <div className="shine-border rounded-3xl">
          <div className="relative rounded-[calc(1.5rem-1.5px)] overflow-hidden bg-card">
            {/* Aurora + grid backdrop */}
            <div className="absolute -top-16 -left-16 w-56 h-56 bg-primary/15 rounded-full blur-3xl animate-aurora pointer-events-none" />
            <div className="absolute -bottom-20 -right-10 w-60 h-60 bg-secondary/15 rounded-full blur-3xl animate-aurora-slow pointer-events-none" />
            <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
            <motion.div className="absolute inset-0 pointer-events-none" style={{ background: glow }} />

            <div className="relative p-6 sm:p-7" style={{ transform: 'translateZ(30px)' }}>
              {/* Identity header */}
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_24px_rgba(38,235,218,0.25)]">
                  <span className="text-lg font-bold text-[#04121a] font-mono">NJ</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight">Nikhil Jangid</p>
                  <p className="text-[11px] text-muted-foreground font-mono">Full-Stack Developer</p>
                </div>
                <span className="ml-auto flex items-center gap-1.5 text-[10px] font-mono text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  online
                </span>
              </div>

              {/* Typed code card */}
              <div className="rounded-xl border border-border/70 bg-black/40 overflow-hidden">
                <div className="flex items-center gap-2 px-3.5 py-2 border-b border-white/5">
                  <FileCode2 size={11} className="text-primary/60" />
                  <span className="text-[10px] font-mono text-muted-foreground/70">profile.ts</span>
                </div>
                <pre className="p-4 min-h-[148px] text-[11px] leading-relaxed font-mono text-gray-300 whitespace-pre-wrap">
                  {typedCode}
                  <span className="inline-block w-1.5 h-3 bg-primary animate-pulse align-middle" />
                </pre>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-5">
                <span className="text-[10px] font-mono text-muted-foreground">Jaipur, India · UTC+5:30</span>
                <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 border border-primary/25 text-[10px] font-mono text-primary">
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  open to SWE roles
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating chips */}
        <motion.div
          className="absolute -left-4 sm:-left-8 bottom-8 flex items-center gap-2 px-3 py-2 rounded-xl bg-card/90 backdrop-blur border border-border shadow-lg"
          style={{ transform: 'translateZ(40px)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-foreground">Open to opportunities</span>
        </motion.div>

        <motion.div
          className="absolute -right-3 sm:-right-6 top-6 flex items-center gap-2 px-3 py-2 rounded-xl bg-card/90 backdrop-blur border border-border shadow-lg"
          style={{ transform: 'translateZ(30px)' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.5 }}
        >
          <MapPin size={12} className="text-primary" />
          <span className="text-xs font-medium text-foreground">Jaipur, India</span>
        </motion.div>

        <motion.div
          className="absolute -right-2 sm:-right-4 bottom-16 flex items-center gap-2 px-3 py-2 rounded-xl bg-card/90 backdrop-blur border border-border shadow-lg"
          style={{ transform: 'translateZ(50px)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <Briefcase size={12} className="text-secondary" />
          <span className="text-xs font-medium text-foreground">SDE Intern · Wisflux</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

const HeroSection = () => {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayTitle, setDisplayTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 250], [1, 0]);
  const eyebrow = useScramble('HELLO, WORLD');

  useEffect(() => {
    const currentTitle = titles[titleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayTitle.length < currentTitle.length) {
      timeout = setTimeout(() => setDisplayTitle(currentTitle.slice(0, displayTitle.length + 1)), 80);
    } else if (!isDeleting && displayTitle.length === currentTitle.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayTitle.length > 0) {
      timeout = setTimeout(() => setDisplayTitle(displayTitle.slice(0, -1)), 40);
    } else if (isDeleting && displayTitle.length === 0) {
      setIsDeleting(false);
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }
    return () => clearTimeout(timeout);
  }, [displayTitle, isDeleting, titleIndex]);

  const nameChars = 'Nikhil Jangid'.split('');

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Interactive Constellation Particle Mesh Background */}
      <InteractiveHeroBackground />

      {/* Tech Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-background/50 pointer-events-none" />
      {/* Ambient glows */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div style={{ opacity }} className="section-container relative w-full">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-14 lg:gap-10 items-center pt-14 lg:pt-0">
          {/* Left: intro */}
          <div className="flex flex-col items-start text-left">
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur mb-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-muted-foreground">{eyebrow}</span>
            </motion.div>

            {/* Name with per-character reveal + hover glow */}
            <div className="flex flex-wrap relative mb-4">
              {nameChars.map((char, index) => (
                <motion.span
                  key={`name-${index}`}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground inline-block tracking-tight"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.15 + index * 0.035 }}
                  whileHover={{
                    color: '#26ebda',
                    y: -2,
                    textShadow: '0 0 12px rgba(38,235,218,0.22)',
                    transition: { duration: 0.2 },
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </div>

            {/* Rotating typewriter title */}
            <motion.div
              className="h-10 mb-5 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span
                className="text-xl md:text-2xl font-mono font-semibold text-primary"
                style={{ textShadow: '0 0 14px rgba(38,235,218,0.18)' }}
              >
                {displayTitle}
                <span className="inline-block w-0.5 h-6 bg-primary ml-0.5 animate-pulse align-middle" />
              </span>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              className="text-sm md:text-base mb-3 text-muted-foreground max-w-2xl leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Building scalable backend systems, AI-powered applications, and production-ready web
              experiences using modern{' '}
              <span className="text-primary/90 font-semibold">JavaScript</span>,{' '}
              <span className="text-primary/90 font-semibold">TypeScript</span>, and{' '}
              <span className="text-primary/90 font-semibold">cloud-native technologies</span>.
            </motion.p>

            {/* Short bio */}
            <motion.p
              className="text-xs md:text-sm mb-8 text-muted-foreground/60 max-w-xl leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
            >
              B.Tech CSE Graduate · SDE Intern @ <span className="text-foreground/80">Wisflux Tech Labs</span>{' '}
              (Jun-Aug 2026) · Builds with{' '}
              <span className="text-foreground/80">NestJS · PostgreSQL · Docker · RAG</span>
            </motion.p>

            {/* Quick Stats with count-up */}
            <motion.div
              className="grid grid-cols-3 sm:grid-cols-5 gap-2 md:gap-3 mb-8 w-full max-w-xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              {stats.map(({ to, suffix, decimals, label }, i) => (
                <motion.div
                  key={label}
                  className="flex flex-col items-center justify-center py-3 px-1 bg-card/50 border border-border rounded-xl cursor-default"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.85 + i * 0.06 }}
                  whileHover={{
                    borderColor: 'rgba(38,235,218,0.28)',
                    backgroundColor: 'rgba(38,235,218,0.035)',
                    y: -2,
                  }}
                >
                  <span className="text-base md:text-xl font-bold text-primary font-mono leading-tight">
                    <CountUp to={to} suffix={suffix} decimals={decimals} />
                  </span>
                  <span className="text-[9px] md:text-[10px] text-muted-foreground text-center leading-tight mt-1 px-1">
                    {label}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-3 mb-7"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.9 }}
            >
              <motion.a
                href="#projects"
                className="relative px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg overflow-hidden border border-primary/80 text-sm font-mono group"
                whileHover={{
                  y: -2,
                  boxShadow: '0 10px 24px rgba(38,235,218,0.16)',
                }}
                whileTap={{ scale: 0.96 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Code2 size={14} />
                  View Projects
                </span>
                <motion.div
                  className="absolute inset-0 bg-primary/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              </motion.a>

              <motion.a
                href="/Nikhil-Jangid-Resume.pdf"
                download
                className="relative px-6 py-2.5 bg-transparent text-foreground font-semibold rounded-lg overflow-hidden border border-primary/40 text-sm font-mono group"
                whileHover={{
                  y: -2,
                  borderColor: 'rgba(38,235,218,0.5)',
                  boxShadow: '0 10px 22px rgba(0,0,0,0.22)',
                }}
                whileTap={{ scale: 0.96 }}
              >
                <span className="relative z-10 flex items-center gap-2 group-hover:text-primary transition-colors">
                  <Download size={14} />
                  Download Resume
                </span>
              </motion.a>

              <motion.a
                href="#contact"
                className="relative px-6 py-2.5 bg-transparent text-muted-foreground font-semibold rounded-lg overflow-hidden border border-border text-sm font-mono group"
                whileHover={{
                  y: -2,
                  borderColor: 'rgba(255,255,255,0.18)',
                  color: '#ffffff',
                }}
                whileTap={{ scale: 0.96 }}
              >
                <span className="relative z-10">Contact Me</span>
              </motion.a>
            </motion.div>

            {/* Social Icons */}
            <motion.div
              className="flex space-x-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              {[
                { href: 'https://github.com/nikhiljangid120', icon: Github, text: 'GitHub' },
                { href: 'https://www.linkedin.com/in/nikhil-jangid-b84360264/', icon: Linkedin, text: 'LinkedIn' },
                { href: 'https://leetcode.com/u/nikhil_888/', icon: Code2, text: 'LeetCode' },
                { href: 'https://www.geeksforgeeks.org/user/nikhiljals77/', icon: Code2, text: 'GFG' },
              ].map(({ href, icon: Icon, text }) => (
                <motion.a
                  key={text}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={text}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 relative"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={21} />
                  <motion.div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                  />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Right: interactive profile card */}
          <HeroVisual />
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-muted-foreground/40 select-none"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-xs font-mono mb-1">scroll</span>
        <ChevronDown size={15} />
      </motion.div>
    </section>
  );
};

export default HeroSection;
