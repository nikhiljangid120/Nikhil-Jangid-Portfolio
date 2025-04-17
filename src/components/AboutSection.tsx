
import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Laptop, Code, ShieldCheck, Database } from 'lucide-react';

const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  
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
      transition: { duration: 0.6 }
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
      
      <motion.div 
        className="section-container"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div variants={childVariants} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-teal to-orange mx-auto mb-8" />
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            I'm a pre-final year Computer Science & Engineering student from Rajasthan, India, 
            passionate about creating innovative digital solutions that blend technical excellence with creative vision.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <motion.div variants={childVariants} className="card-3d p-8 bg-charcoal/50">
            <h3 className="text-2xl font-bold mb-4 text-teal">My Journey</h3>
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
          </motion.div>
          
          <motion.div variants={childVariants} className="card-3d p-8 bg-charcoal/50">
            <h3 className="text-2xl font-bold mb-4 text-orange">My Philosophy</h3>
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
              className="card-3d p-6 text-center flex flex-col items-center bg-charcoal/50"
              variants={childVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <motion.div
                variants={iconVariants}
                className="mb-4 p-3 rounded-full bg-inkyblack/50"
              >
                {interest.icon}
              </motion.div>
              <h4 className="text-xl font-bold mb-2">{interest.title}</h4>
              <p className="text-gray-400 text-sm">{interest.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
