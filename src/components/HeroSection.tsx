import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, Linkedin, Download, ExternalLink, Terminal, ChevronDown, Server, Code2, Cpu } from 'lucide-react';

const stats = [
  { value: '3', label: 'Internships' },
  { value: '6+', label: 'Projects' },
  { value: '250+', label: 'DSA Solved' },
  { value: '8.48', label: 'CGPA' },
  { value: '4500+', label: 'Commits' },
];

const titles = [
  'Software Engineer',
  'Backend Developer',
  'Full-Stack Developer',
  'AI Systems Engineer',
];

const HeroSection = () => {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayTitle, setDisplayTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, 20]);
  const opacity = useTransform(scrollY, [0, 250], [1, 0]);

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
      {/* Tech Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-background/50 pointer-events-none" />
      {/* Ambient glows */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.06, 0.1, 0.06] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal/8 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div style={{ y, opacity, zIndex: 10 }} className="section-container relative w-full">
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-4xl">

          {/* Terminal prompt badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 flex items-center space-x-2 px-4 py-2 bg-muted/30 rounded-full border border-border text-sm font-mono text-primary/80 hover:border-primary/40 hover:bg-muted/50 transition-all duration-300 cursor-default"
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-green-500"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>~/whoami</span>
            <span className="text-muted-foreground">—</span>
            <span className="text-green-400">online</span>
          </motion.div>

          {/* Name with hover per-character glow */}
          <motion.div className="relative mb-4">
            <div className="flex justify-center md:justify-start mb-2 font-mono text-muted-foreground/60 text-sm items-center gap-2">
              <Terminal size={13} className="text-primary/50" />
              <span className="text-primary/40">$</span>
              <span>echo "Hello, World"</span>
            </div>

            <div className="flex justify-center md:justify-start flex-wrap relative mb-2">
              {nameChars.map((char, index) => (
                <motion.span
                  key={`name-${index}`}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground inline-block tracking-tight"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.15 + index * 0.035 }}
                  whileHover={{
                    color: 'var(--primary)',
                    y: -6,
                    textShadow: '0 0 20px rgba(204,255,0,0.5)',
                    transition: { duration: 0.15 }
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Rotating typewriter title */}
          <motion.div
            className="h-10 mb-5 flex items-center justify-center md:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="text-xl md:text-2xl font-mono font-bold text-primary" style={{ textShadow: '0 0 30px rgba(204,255,0,0.3)' }}>
              {displayTitle}
              <span className="inline-block w-0.5 h-6 bg-primary ml-0.5 animate-pulse align-middle" />
            </span>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="text-sm md:text-base mb-3 text-muted-foreground max-w-2xl font-mono leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Building scalable backend systems, AI-powered applications, and production-ready web experiences using modern{' '}
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
            B.Tech CSE Graduate · SDE Intern @{' '}
            <span className="text-foreground/80">Wisflux Tech Labs</span> · Builds with{' '}
            <span className="text-foreground/80">NestJS · PostgreSQL · Docker · RAG</span>
          </motion.p>

          {/* Quick Stats — responsive grid */}
          <motion.div
            className="grid grid-cols-5 gap-2 mb-8 w-full max-w-xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            {stats.map(({ value, label }, i) => (
              <motion.div
                key={label}
                className="flex flex-col items-center justify-center py-3 px-1 bg-muted/20 border border-border rounded-xl cursor-default group"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.85 + i * 0.06 }}
                whileHover={{
                  borderColor: 'rgba(204,255,0,0.5)',
                  backgroundColor: 'rgba(204,255,0,0.05)',
                  scale: 1.06,
                  boxShadow: '0 0 20px rgba(204,255,0,0.1)',
                }}
              >
                <span className="text-base md:text-xl font-bold text-primary font-mono leading-tight">{value}</span>
                <span className="text-[9px] md:text-[10px] text-muted-foreground text-center leading-tight mt-1 px-1">{label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap gap-3 mb-7 justify-center md:justify-start"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.9 }}
          >
            <motion.a
              href="#projects"
              className="relative px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg overflow-hidden border border-primary/80 text-sm font-mono group"
              whileHover={{
                scale: 1.04,
                boxShadow: '0 0 25px rgba(204,255,0,0.35)',
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
              href="/Nikhil Jangid_ATS Friendly Resume 2026.pdf"
              download
              className="relative px-6 py-2.5 bg-transparent text-foreground font-semibold rounded-lg overflow-hidden border border-primary/40 text-sm font-mono group"
              whileHover={{
                scale: 1.04,
                borderColor: 'rgba(204,255,0,0.8)',
                boxShadow: '0 0 20px rgba(204,255,0,0.15)',
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
                scale: 1.04,
                borderColor: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
              }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="relative z-10">Contact Me</span>
            </motion.a>
          </motion.div>

          {/* Social Icons */}
          <motion.div
            className="flex space-x-5 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            {[
              { href: 'https://github.com/nikhiljangid120', icon: Github, text: 'GitHub' },
              { href: 'https://www.linkedin.com/in/nikhil-jangid-b84360264/', icon: Linkedin, text: 'LinkedIn' },
              { href: 'https://leetcode.com/u/nikhil_888/', icon: Code2, text: 'LeetCode' },
              { href: 'https://www.geeksforgeeks.org/user/nikhiljals77/', icon: ExternalLink, text: 'GFG' },
            ].map(({ href, icon: Icon, text }) => (
              <motion.a
                key={text}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={text}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 relative"
                whileHover={{ scale: 1.2, y: -3 }}
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

          {/* Tech stack pills */}
          <motion.div
            className="flex flex-wrap gap-2 justify-center md:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            {[
              { label: 'NestJS', icon: Server },
              { label: 'PostgreSQL', icon: Cpu },
              { label: 'React/Next.js', icon: Code2 },
              { label: 'Docker', icon: Server },
              { label: 'TypeScript', icon: Code2 },
              { label: 'AI/RAG', icon: Cpu },
            ].map(({ label, icon: Icon }) => (
              <motion.div
                key={label}
                className="flex items-center space-x-1.5 text-xs font-mono text-muted-foreground/70 border border-border/60 rounded-md px-2.5 py-1.5 bg-muted/15 cursor-default"
                whileHover={{
                  borderColor: 'rgba(204,255,0,0.4)',
                  color: 'rgba(204,255,0,0.8)',
                  backgroundColor: 'rgba(204,255,0,0.04)',
                  scale: 1.04,
                }}
                transition={{ duration: 0.15 }}
              >
                <Icon size={10} />
                <span>{label}</span>
              </motion.div>
            ))}
          </motion.div>
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
