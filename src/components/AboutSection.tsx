
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code, ShieldCheck, Database, User, Lightbulb, Github, Linkedin, Mail, Coffee } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card';

const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
    { icon: <Code className="w-5 h-5" />, title: "Clean Code", description: "Writing maintainable and scalable solutions" },
    { icon: <ShieldCheck className="w-5 h-5" />, title: "Best Practices", description: "Following industry standards and patterns" },
    { icon: <Database className="w-5 h-5" />, title: "Optimization", description: "Building performant applications" },
    { icon: <Lightbulb className="w-5 h-5" />, title: "Innovation", description: "Exploring cutting-edge technologies" }
  ];

  return (
    <section id="about" ref={ref} className="py-24 relative overflow-hidden bg-inkyblack">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/20 to-inkyblack/90" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-teal/5 blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      <div className="section-container relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal via-lime to-orange bg-clip-text text-transparent">
            About Me
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Computer Science & Engineering student passionate about creating innovative digital solutions that combine technical excellence with intuitive user experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Enhanced Profile Image with Advanced Effects */}
          <motion.div
            className="relative group perspective"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
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
            >
              <img 
                src="/profile.jpg" 
                alt="Nikhil Jangid"
                className="w-full h-full object-cover"
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
              
              {/* Sparkle Effects */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-lime rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}

              {/* Floating Tech Icons */}
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
                      data-cursor-text={link.label}
                    >
                      {link.icon}
                    </motion.a>
                  </HoverCardTrigger>
                  <HoverCardContent className="bg-inkyblack/90 border border-lime/20">
                    <p className="text-sm text-gray-300">Connect on {link.label}</p>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </motion.div>
          </motion.div>

          {/* Philosophy Cards with Enhanced Animations */}
          <div className="space-y-8">
            {philosophyPoints.map((point, index) => (
              <motion.div
                key={index}
                className="bg-charcoal/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-lime/20 transition-all duration-300"
                initial={{ opacity: 0, x: 50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 0 30px rgba(204, 255, 0, 0.1)"
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-lime/20 to-teal/20 border border-lime/20">
                    {point.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{point.title}</h3>
                    <p className="text-gray-400">{point.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
