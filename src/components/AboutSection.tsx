
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Laptop, Code, ShieldCheck, Database, User, BookOpen, Lightbulb, Sparkles } from 'lucide-react';

const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [isHovered, setIsHovered] = useState<number | null>(null);
  
  // Scroll-based parallax
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const opacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }
    }
  };
  
  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.2
      }
    },
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };
  
  const interests = [
    { 
      icon: <Code className="h-8 w-8 text-lime" />,
      title: "Data Structures & Algorithms",
      description: "Passionate about solving complex problems with efficient code using C++"
    },
    { 
      icon: <Laptop className="h-8 w-8 text-orange" />,
      title: "Full Stack Development",
      description: "Building responsive web applications with React, Node.js and modern frontend technologies"
    },
    { 
      icon: <ShieldCheck className="h-8 w-8 text-gold" />,
      title: "Cybersecurity",
      description: "Exploring ethical hacking concepts and securing applications from vulnerabilities"
    },
    { 
      icon: <Database className="h-8 w-8 text-purple" />,
      title: "Machine Learning",
      description: "Learning Python-based ML foundations to build intelligent data systems"
    }
  ];
  
  return (
    <section id="about" ref={ref} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-inkyblack/60 to-charcoal/60 -z-10" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-inkyblack to-transparent -z-10" />
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-inkyblack to-transparent -z-10" />
      
      <motion.div 
        className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-purple/10 blur-3xl -z-10"
        animate={{ 
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity,
          repeatType: "mirror"
        }}
      />
      
      <motion.div 
        className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-teal/10 blur-3xl -z-10"
        animate={{ 
          x: [0, -30, 0],
          y: [0, -20, 0],
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity,
          repeatType: "mirror"
        }}
      />
      
      <motion.div 
        className="section-container"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div variants={childVariants} className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            About Me
          </motion.h2>
          <motion.div 
            className="w-20 h-1.5 bg-gradient-to-r from-teal to-orange mx-auto mb-8"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
          <motion.p 
            className="text-lg text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            I'm a pre-final year Computer Science & Engineering student from Rajasthan, India, 
            passionate about creating innovative digital solutions that blend technical excellence with creative vision.
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <motion.div 
            variants={childVariants} 
            style={{ y: y1 }}
            className="card-3d p-8 bg-charcoal/50 backdrop-blur-sm relative overflow-hidden group"
          >
            <motion.div 
              className="absolute top-4 left-4 p-3 rounded-full bg-teal/20 text-teal"
              variants={iconVariants}
              whileHover="hover"
            >
              <User className="w-6 h-6" />
            </motion.div>
            
            <h3 className="text-2xl font-bold mb-4 text-teal mt-12">My Journey</h3>
            <p className="text-gray-300 mb-4">
              My path into software development began with curiosity about how digital systems work. 
              As I delved deeper into programming concepts and web technologies, I discovered my passion 
              for building full-stack applications that solve real-world problems.
            </p>
            <p className="text-gray-300">
              Currently pursuing my B.Tech degree, I'm focused on mastering both foundational computer science 
              concepts and cutting-edge web technologies, while continuously honing my problem-solving skills 
              through competitive programming and personal projects.
            </p>
            
            <motion.div 
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-teal to-lime"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
            />
            
            <motion.div 
              className="absolute -z-10 top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/5 blur-xl"
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                repeatType: "mirror"
              }}
            />
          </motion.div>
          
          <motion.div 
            variants={childVariants} 
            style={{ y: y2 }}
            className="card-3d p-8 bg-charcoal/50 backdrop-blur-sm relative overflow-hidden group"
          >
            <motion.div 
              className="absolute top-4 left-4 p-3 rounded-full bg-orange/20 text-orange"
              variants={iconVariants}
              whileHover="hover"
            >
              <Lightbulb className="w-6 h-6" />
            </motion.div>
            
            <h3 className="text-2xl font-bold mb-4 text-orange mt-12">My Philosophy</h3>
            <p className="text-gray-300 mb-4">
              I believe that great software combines technical excellence with intuitive user experience. 
              My approach centers on building solutions that are not only functionally robust but also 
              aesthetically pleasing and easy to use.
            </p>
            <p className="text-gray-300">
              I'm driven by the challenge of transforming complex problems into elegant solutions, 
              and I'm constantly learning new technologies and methodologies to enhance my skill set.
              My goal is to create software that makes a meaningful impact.
            </p>
            
            <motion.div 
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange to-gold"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4 }}
            />
            
            <motion.div 
              className="absolute -z-10 top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/5 blur-xl"
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                repeatType: "mirror"
              }}
            />
          </motion.div>
        </div>
        
        <motion.h3 
          variants={childVariants}
          className="text-2xl font-bold text-center mb-12"
        >
          My Areas of Interest
        </motion.h3>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
        >
          {interests.map((interest, index) => (
            <motion.div
              key={index}
              className="card-3d p-6 text-center flex flex-col items-center bg-charcoal/50 backdrop-blur-sm relative overflow-hidden interactive"
              data-cursor-text="Explore"
              variants={childVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              onHoverStart={() => setIsHovered(index)}
              onHoverEnd={() => setIsHovered(null)}
            >
              <motion.div
                variants={iconVariants}
                className="mb-4 p-3 rounded-full bg-inkyblack/50 relative"
                animate={isHovered === index ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
              >
                {interest.icon}
                <motion.div 
                  className="absolute inset-0 rounded-full"
                  initial={{ boxShadow: "0 0 0 0 rgba(204, 255, 0, 0)" }}
                  animate={isHovered === index 
                    ? { boxShadow: "0 0 0 10px rgba(204, 255, 0, 0)" } 
                    : { boxShadow: "0 0 0 0 rgba(204, 255, 0, 0)" }
                  }
                  transition={{ duration: 1, repeat: isHovered === index ? Infinity : 0 }}
                />
              </motion.div>
              <h4 className="text-xl font-bold mb-2">{interest.title}</h4>
              <p className="text-gray-400 text-sm">{interest.description}</p>
              
              {isHovered === index && (
                <motion.div
                  className="absolute -z-10 inset-0 bg-gradient-to-br from-inkyblack/0 via-inkyblack/0 to-lime/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              
              <motion.div 
                className="absolute bottom-0 left-0 h-0.5 bg-lime/30"
                initial={{ width: 0 }}
                animate={isHovered === index ? { width: "100%" } : { width: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a 
              href="#contact" 
              className="px-6 py-3 bg-gradient-to-r from-purple/20 to-teal/20 text-white font-medium rounded-md border border-white/10 hover:border-lime/40 transition-all duration-300 flex items-center space-x-2 interactive"
              data-cursor-text="Connect"
            >
              <Sparkles className="w-5 h-5 text-lime" />
              <span>Let's Connect</span>
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
