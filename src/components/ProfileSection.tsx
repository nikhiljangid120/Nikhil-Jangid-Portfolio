
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const ProfileSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  // Create sparkle elements
  const sparkles = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2}s`,
    animationDuration: `${Math.random() * 2 + 1}s`
  }));
  
  return (
    <section 
      id="profile" 
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-inkyblack"
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/20 to-inkyblack/90" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        {/* Subtle glow effects */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-teal/5 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-lime/5 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", delay: 1 }}
        />
      </div>
      
      <div className="section-container relative z-10">
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-12"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Profile Image with interactive effects */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96 perspective">
              <motion.div 
                className="w-full h-full profile-image overflow-hidden rounded-full relative preserve-3d"
                whileHover={{ scale: 1.05, rotateY: 5, rotateX: -5 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <img 
                  src="/profile.jpg" 
                  alt="Nikhil Jangid" 
                  className="w-full h-full object-cover"
                />
                
                {/* Glassmorphism overlay on hover */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-lime/0 via-teal/10 to-purple/0"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.5 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Sparkle effects */}
                {sparkles.map(sparkle => (
                  <motion.div
                    key={sparkle.id}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      width: `${sparkle.size}px`,
                      height: `${sparkle.size}px`,
                      left: sparkle.left,
                      top: sparkle.top,
                      animationDelay: sparkle.animationDelay,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: sparkle.id * 0.2,
                    }}
                  />
                ))}
              </motion.div>
              
              {/* Glowing border effect */}
              <motion.div 
                className="absolute -inset-1 rounded-full opacity-0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.5 }}
                style={{
                  background: "radial-gradient(circle, rgba(204, 255, 0, 0.3) 0%, transparent 70%)",
                  filter: "blur(8px)"
                }}
              />
            </div>
          </motion.div>
          
          {/* Profile info with animation */}
          <motion.div 
            className="max-w-lg text-center md:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 gradient-text" 
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              About Me
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-300 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              Passionate full-stack developer with expertise in modern web technologies and problem solving.
            </motion.p>
            
            <motion.div
              className="glass-card p-6 backdrop-blur-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(204, 255, 0, 0.15)" }}
            >
              <p className="text-gray-300 mb-4">
                I believe in crafting elegant solutions to complex problems. My approach combines clean code with 
                thoughtful user experiences to create applications that are both powerful and intuitive.
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="tech-pill">React</span>
                <span className="tech-pill">TypeScript</span>
                <span className="tech-pill">Node.js</span>
                <span className="tech-pill">MongoDB</span>
                <span className="tech-pill">AWS</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProfileSection;
