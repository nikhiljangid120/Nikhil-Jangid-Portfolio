
import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import { Code, ShieldCheck, Database, User, Lightbulb, Github, Linkedin, Mail, Coffee, Sparkles } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card';
import { Card, CardContent } from './ui/card';
import AboutMiniGame from './AboutMiniGame';

const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
      setTimeout(() => setShowBadge(true), 1500);
    }
  }, [inView, controls]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const socialLinks = [
    { icon: <Github className="w-6 h-6" />, href: "https://github.com/nikhiljangid120", label: "GitHub" },
    { icon: <Linkedin className="w-6 h-6" />, href: "https://www.linkedin.com/in/nikhil-jangid-b84360264/", label: "LinkedIn" },
    { icon: <Mail className="w-6 h-6" />, href: "mailto:nikhiljangid120@gmail.com", label: "Email" },
    { icon: <Coffee className="w-6 h-6" />, href: "https://www.buymeacoffee.com/nikhiljangid", label: "Buy me a coffee" }
  ];

  const philosophyPoints = [
    { 
      icon: <Code className="w-5 h-5" />, 
      title: "Clean Code", 
      description: "Writing maintainable and scalable solutions",
      color: "lime"
    },
    { 
      icon: <ShieldCheck className="w-5 h-5" />, 
      title: "Best Practices", 
      description: "Following industry standards and patterns",
      color: "teal"
    },
    { 
      icon: <Database className="w-5 h-5" />, 
      title: "Optimization", 
      description: "Building performant applications",
      color: "purple"
    },
    { 
      icon: <Lightbulb className="w-5 h-5" />, 
      title: "Innovation", 
      description: "Exploring cutting-edge technologies",
      color: "gold"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 0 30px rgba(204, 255, 0, 0.3)"
    }
  };

  const glowVariants = {
    init: { opacity: 0.3 },
    animate: { 
      opacity: [0.3, 0.6, 0.3], 
      scale: [1, 1.05, 1],
      transition: { repeat: Infinity, duration: 3, ease: "easeInOut" }
    }
  };
  
  // Generate sparkles
  const generateSparkles = (count: number) => {
    return Array.from({ length: count }).map((_, index) => ({
      id: index,
      size: Math.random() * 4 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2
    }));
  };

  const sparkles = generateSparkles(12);

  return (
    <section id="about" ref={ref} className="py-24 relative overflow-hidden bg-inkyblack">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/20 to-inkyblack/90" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      {/* Animated gradient blobs */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-teal/5 blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
          x: [0, 30, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple/5 blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.3, 0.2],
          x: [0, -20, 0],
          y: [0, 20, 0]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      
      <div className="section-container relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal via-lime to-orange bg-clip-text text-transparent animate-text-shimmer">
            About Me
          </h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Computer Science & Engineering student passionate about creating innovative digital solutions that combine technical excellence with intuitive user experiences.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Enhanced Profile Image with Advanced Effects */}
          <motion.div
            className="relative group perspective"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <motion.div 
              className="relative w-full aspect-square rounded-2xl overflow-hidden card-3d"
              animate={isHovered ? {
                rotateX: (mousePosition.y - 50) * 0.1,
                rotateY: (mousePosition.x - 50) * 0.1,
              } : {
                rotateX: 0,
                rotateY: 0,
              }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
              variants={imageVariants}
              whileHover="hover"
            >
              <img 
                src="/profile.jpg" 
                alt="Nikhil Jangid"
                className="w-full h-full object-cover"
              />
              
              {/* Dynamic outer glow effect */}
              <motion.div
                className="absolute -inset-4 rounded-3xl"
                style={{ 
                  background: `radial-gradient(circle at 50% 50%, rgba(204, 255, 0, 0.15), transparent 70%)`,
                  filter: "blur(20px)"
                }}
                initial="init"
                animate="animate"
                variants={glowVariants}
              />
              
              {/* Advanced Glassmorphism Overlay */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(
                    circle at ${mousePosition.x}% ${mousePosition.y}%,
                    rgba(204, 255, 0, 0.2),
                    transparent 70%
                  )`,
                  backdropFilter: "blur(4px)"
                }}
              />
              
              {/* Dynamic Parallax Effect on Hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                style={{
                  backgroundImage: "url('/profile.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "brightness(1.2) contrast(1.1) hue-rotate(5deg)",
                  mixBlendMode: "screen"
                }}
                animate={isHovered ? {
                  x: (mousePosition.x - 50) * -0.3,
                  y: (mousePosition.y - 50) * -0.3,
                  opacity: 0.4
                } : {
                  x: 0,
                  y: 0,
                  opacity: 0
                }}
              />
              
              {/* Animated Sparkle Effects */}
              {sparkles.map(sparkle => (
                <motion.div
                  key={`sparkle-${sparkle.id}`}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${sparkle.x}%`,
                    top: `${sparkle.y}%`,
                    width: `${sparkle.size}px`,
                    height: `${sparkle.size}px`
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: sparkle.duration,
                    delay: sparkle.delay,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 5,
                  }}
                />
              ))}

              {/* Floating Tech Icons with Parallel Motion */}
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + (i % 3) * 20}%`,
                    }}
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0],
                      x: isHovered ? (mousePosition.x - 50) * 0.2 : 0,
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.2,
                      repeat: Infinity,
                    }}
                  >
                    <div className="w-8 h-8 bg-charcoal/50 backdrop-blur-sm rounded-lg flex items-center justify-center text-lime border border-lime/20">
                      {i % 5 === 0 ? <Code className="w-4 h-4" /> :
                       i % 5 === 1 ? <Database className="w-4 h-4" /> :
                       i % 5 === 2 ? <ShieldCheck className="w-4 h-4" /> :
                       i % 5 === 3 ? <Lightbulb className="w-4 h-4" /> :
                       <User className="w-4 h-4" />}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Achievement badge that appears after a delay */}
              <AnimatePresence>
                {showBadge && (
                  <motion.div 
                    className="absolute top-4 right-4 bg-lime/20 backdrop-blur-md rounded-full px-3 py-1 text-sm border border-lime/40 flex items-center gap-2"
                    initial={{ scale: 0, rotate: -20, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Sparkles className="w-4 h-4 text-lime" />
                    <span className="text-white">Portfolio Pro</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Enhanced Social Links with Hover Cards */}
            <motion.div 
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
              {socialLinks.map((link, index) => (
                <HoverCard key={index}>
                  <HoverCardTrigger asChild>
                    <motion.a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-charcoal/50 backdrop-blur-sm rounded-full text-gray-400 hover:text-lime transition-colors duration-300 interactive"
                      whileHover={{ 
                        scale: 1.1,
                        boxShadow: "0 0 20px rgba(204, 255, 0, 0.3)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      data-cursor-text={link.label}
                    >
                      {link.icon}
                      
                      {/* Ripple effect on hover */}
                      <span className="absolute inset-0 rounded-full pointer-events-none">
                        <motion.span
                          className="absolute inset-0 rounded-full bg-lime/20"
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: 1.5, opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                      </span>
                    </motion.a>
                  </HoverCardTrigger>
                  <HoverCardContent className="glass-card bg-inkyblack/90 border border-lime/20">
                    <div className="flex flex-col items-center">
                      <div className="mb-2">{link.icon}</div>
                      <p className="text-sm font-medium text-white mb-1">Connect on {link.label}</p>
                      <p className="text-xs text-gray-400">Click to visit</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </motion.div>
          </motion.div>

          {/* Philosophy Cards with Enhanced Animations */}
          <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {philosophyPoints.map((point, index) => (
              <motion.div
                key={index}
                className="bg-charcoal/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-lime/20 transition-all duration-300 relative overflow-hidden"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 0 30px rgba(204, 255, 0, 0.1)"
                }}
                onHoverStart={() => setActiveCard(index)}
                onHoverEnd={() => setActiveCard(null)}
              >
                <div className="flex items-start gap-4 relative z-10">
                  <motion.div 
                    className={`p-3 rounded-lg bg-gradient-to-r from-${point.color}/20 to-charcoal/30 border border-${point.color}/20`}
                    animate={{ rotate: activeCard === index ? [0, 5, -5, 0] : 0 }}
                    transition={{ repeat: activeCard === index ? Infinity : 0, duration: 2 }}
                  >
                    {point.icon}
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{point.title}</h3>
                    <p className="text-gray-400">{point.description}</p>
                  </div>
                </div>
                
                {/* Background gradient that moves on hover */}
                <motion.div 
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
                  style={{ 
                    background: `radial-gradient(circle at 50% 50%, rgba(204, 255, 0, 0.1), transparent 70%)`,
                    opacity: activeCard === index ? 0.5 : 0
                  }}
                  animate={activeCard === index ? {
                    background: [
                      `radial-gradient(circle at 30% 30%, rgba(204, 255, 0, 0.1), transparent 70%)`,
                      `radial-gradient(circle at 70% 70%, rgba(204, 255, 0, 0.1), transparent 70%)`,
                      `radial-gradient(circle at 30% 70%, rgba(204, 255, 0, 0.1), transparent 70%)`,
                      `radial-gradient(circle at 70% 30%, rgba(204, 255, 0, 0.1), transparent 70%)`,
                      `radial-gradient(circle at 50% 50%, rgba(204, 255, 0, 0.1), transparent 70%)`
                    ]
                  } : {}}
                  transition={{ duration: 5, repeat: Infinity }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Mini-game section */}
        <AboutMiniGame />
      </div>
    </section>
  );
};

export default AboutSection;
