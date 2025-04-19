
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Laptop, Code, ShieldCheck, Database, User, Lightbulb } from 'lucide-react';

const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [activeInterest, setActiveInterest] = useState<number | null>(null);
  
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
  
  const interests = [
    { 
      icon: <Code className="h-8 w-8" />,
      title: "Data Structures & Algorithms",
      description: "Passionate about solving complex problems with efficient code using C++",
      color: "rgb(204, 255, 0)",
      bgColor: "rgba(204, 255, 0, 0.2)"
    },
    { 
      icon: <Laptop className="h-8 w-8" />,
      title: "Full Stack Development",
      description: "Building responsive web applications with React, Node.js and modern frontend technologies",
      color: "rgb(255, 154, 0)",
      bgColor: "rgba(255, 154, 0, 0.2)"
    },
    { 
      icon: <ShieldCheck className="h-8 w-8" />,
      title: "Cybersecurity",
      description: "Exploring ethical hacking concepts and securing applications from vulnerabilities",
      color: "rgb(250, 204, 21)",
      bgColor: "rgba(250, 204, 21, 0.2)"
    },
    { 
      icon: <Database className="h-8 w-8" />,
      title: "Machine Learning",
      description: "Learning Python-based ML foundations to build intelligent data systems",
      color: "rgb(168, 85, 247)",
      bgColor: "rgba(168, 85, 247, 0.2)"
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
            className="text-lg text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Computer Science & Engineering student passionate about creating innovative digital solutions.
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <motion.div 
            variants={childVariants} 
            className="card-3d p-8 bg-charcoal/50 backdrop-blur-sm relative overflow-hidden group"
          >
            <motion.div 
              className="absolute top-4 left-4 p-3 rounded-full bg-teal/20 text-teal"
              whileHover={{ scale: 1.2, rotate: 15 }}
            >
              <User className="w-6 h-6" />
            </motion.div>
            
            <h3 className="text-2xl font-bold mb-4 text-teal mt-12">My Journey</h3>
            <p className="text-gray-300 mb-4">
              From curiosity about digital systems to a passion for full-stack development. Currently pursuing my B.Tech degree while mastering computer science fundamentals and cutting-edge web technologies.
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
            className="card-3d p-8 bg-charcoal/50 backdrop-blur-sm relative overflow-hidden group"
          >
            <motion.div 
              className="absolute top-4 left-4 p-3 rounded-full bg-orange/20 text-orange"
              whileHover={{ scale: 1.2, rotate: 15 }}
            >
              <Lightbulb className="w-6 h-6" />
            </motion.div>
            
            <h3 className="text-2xl font-bold mb-4 text-orange mt-12">My Philosophy</h3>
            <p className="text-gray-300 mb-4">
              Great software combines technical excellence with intuitive user experience. Transforming complex problems into elegant, impactful solutions while constantly learning new technologies.
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
              onMouseEnter={() => setActiveInterest(index)}
              onMouseLeave={() => setActiveInterest(null)}
              style={{
                borderColor: activeInterest === index ? interest.color : 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <motion.div
                className="mb-4 p-3 rounded-full relative"
                animate={activeInterest === index ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                style={{
                  backgroundColor: activeInterest === index ? interest.bgColor : 'rgba(15, 23, 42, 0.5)'
                }}
              >
                <motion.div style={{ color: interest.color }}>
                  {interest.icon}
                </motion.div>
                <motion.div 
                  className="absolute inset-0 rounded-full"
                  initial={{ boxShadow: "0 0 0 0 rgba(204, 255, 0, 0)" }}
                  animate={activeInterest === index 
                    ? { boxShadow: `0 0 0 10px ${interest.color}00` } 
                    : { boxShadow: "0 0 0 0 rgba(204, 255, 0, 0)" }
                  }
                  transition={{ duration: 1, repeat: activeInterest === index ? Infinity : 0 }}
                />
              </motion.div>
              <h4 className="text-xl font-bold mb-2" style={{ 
                color: activeInterest === index ? interest.color : 'white'
              }}>
                {interest.title}
              </h4>
              <p className="text-gray-400 text-sm">{interest.description}</p>
              
              {activeInterest === index && (
                <motion.div
                  className="absolute -z-10 inset-0"
                  style={{ 
                    background: `radial-gradient(circle at center, ${interest.bgColor} 0%, rgba(15, 23, 42, 0) 70%)`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              
              <motion.div 
                className="absolute bottom-0 left-0 h-0.5"
                style={{ backgroundColor: interest.color, opacity: 0.5 }}
                initial={{ width: 0 }}
                animate={activeInterest === index ? { width: "100%" } : { width: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutSection;