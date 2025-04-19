
import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Code, ShieldCheck, Database, User, Lightbulb, Github, Linkedin, Mail, Coffee } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card';

const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Parallax effect for image
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  
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

  const journey = [
    { year: "2020", title: "Started Coding Journey", description: "First encounter with programming and web development basics" },
    { year: "2021", title: "First Major Project", description: "Developed a full-stack web application with React and Node.js" },
    { year: "2022", title: "College Admission", description: "Started B.Tech in Computer Science & Engineering" },
    { year: "2023", title: "Internship Experience", description: "Worked as a software development intern at a tech startup" }
  ];

  const philosophyPoints = [
    "Clean code leads to maintainable software",
    "User experience should always be prioritized",
    "Continuous learning is key to growth",
    "Collaborate to build better solutions"
  ];

  return (
    <section id="about" ref={ref} className="py-24 relative overflow-hidden bg-inkyblack">
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/20 to-inkyblack/90" />
      
      {/* Grid pattern and animated gradient blobs */}
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
          {/* Profile Image with Advanced Effects */}
          <motion.div
            className="relative group perspective"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ y }}
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
              
              {/* Glassmorphism Overlay */}
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
            </motion.div>

            {/* Social Links */}
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
                      whileHover={{ scale: 1.1 }}
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

          {/* Journey and Philosophy */}
          <div className="space-y-12">
            {/* Journey Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-charcoal/30 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-teal" />
                <h3 className="text-2xl font-bold text-teal">My Journey</h3>
              </div>
              <div className="space-y-4">
                {journey.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="relative pl-8 pb-4 border-l border-lime/20 last:pb-0"
                  >
                    <div className="absolute -left-3 w-6 h-6 bg-gradient-to-r from-teal to-lime rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <span className="text-sm text-lime/80">{item.year}</span>
                    <h4 className="text-lg font-semibold text-white mt-1">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Philosophy */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-charcoal/30 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-6 h-6 text-orange" />
                <h3 className="text-2xl font-bold text-orange">My Philosophy</h3>
              </div>
              <div className="grid gap-4">
                {philosophyPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange to-gold" />
                    <p className="text-gray-300">{point}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
