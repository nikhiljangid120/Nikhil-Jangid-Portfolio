import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, Linkedin, Code, ExternalLink, Terminal } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card';

const HeroSection = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, 20]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const titleChars = "Hello, I'm".split('');
  const nameChars = "Nikhil Jangid".split('');

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Tech Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-background/50 pointer-events-none" />

      <motion.div style={{ y, opacity, zIndex: 10 }} className="section-container relative">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">

          {/* Terminal Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 flex items-center space-x-2 px-4 py-2 bg-muted/30 rounded-full border border-border text-sm font-mono text-primary/80"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>System Online</span>
          </motion.div>

          <motion.div className="relative mb-5">
            <div className="flex justify-center md:justify-start mb-1.5 font-mono text-muted-foreground text-lg">
              &lt;Developer /&gt;
            </div>

            <div className="flex justify-center md:justify-start flex-wrap relative mb-2">
              {nameChars.map((char, index) => (
                <motion.span
                  key={`name-${index}`}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground inline-block tracking-tight"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.25,
                    delay: 0.1 + index * 0.03,
                  }}
                  whileHover={{
                    color: 'var(--primary)',
                    y: -5
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.h2
            className="text-lg md:text-xl mb-8 text-muted-foreground max-w-xl font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-primary">Full Stack Engineer</span> crafting robust digital architectures and scalable solutions.
          </motion.h2>

          <motion.div
            className="flex flex-wrap gap-4 mb-10 justify-center md:justify-start"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.7 }}
          >
            <motion.a
              href="#projects"
              className="relative px-8 py-3 bg-primary text-primary-foreground font-semibold rounded overflow-hidden group border border-primary hover:bg-primary/90 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10 font-mono">View Projects</span>
            </motion.a>

            <motion.a
              href="#contact"
              className="relative px-8 py-3 bg-transparent text-foreground font-semibold rounded overflow-hidden group border border-border hover:bg-muted transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10 font-mono">Contact Me</span>
            </motion.a>
          </motion.div>

          <motion.div
            className="flex space-x-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.8 }}
          >
            {[
              { href: 'https://github.com/nikhiljangid120', icon: Github, text: 'GitHub' },
              { href: 'https://www.linkedin.com/in/nikhil-jangid-b84360264/', icon: Linkedin, text: 'LinkedIn' },
              { href: 'https://leetcode.com/u/nikhil_888/', icon: Code, text: 'LeetCode' },
              { href: 'https://www.geeksforgeeks.org/user/nikhiljals77/', icon: ExternalLink, text: 'GeeksForGeeks' },
            ].map(({ href, icon: Icon, text }) => (
              <a
                key={text}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <Icon size={24} />
              </a>
            ))}
          </motion.div>

          <motion.div
            className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center space-x-2 text-xs font-mono text-muted-foreground border border-border rounded px-3 py-1 bg-muted/20">
              <Terminal size={12} />
              <span>Stacks: MERN, Next.js, AI</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono text-muted-foreground border border-border rounded px-3 py-1 bg-muted/20">
              <Code size={12} />
              <span>Problem Solver</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
