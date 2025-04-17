
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import TimelineSection from "@/components/TimelineSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  
  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.9], // Fixed cubic-bezier values
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      transition: { 
        duration: 0.5,
        ease: [0.6, 0.05, 0.01, 0.9], // Fixed cubic-bezier values
      }
    }
  };

  useEffect(() => {
    // Simulate resource loading with progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 100);
    
    // Simulate resources loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
      clearInterval(interval);
      
      // Small delay before showing content to ensure smooth transition
      setTimeout(() => {
        setShowContent(true);
      }, 500);
    }, 2000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);
  
  // Particles generator
  const generateRandomParticles = (count: number) => {
    return Array.from({ length: count }).map((_, index) => ({
      id: index,
      size: Math.random() * 4 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2
    }));
  };
  
  const particles = generateRandomParticles(30);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-inkyblack flex items-center justify-center z-50">
        <div className="relative w-full max-w-md text-center px-4">
          {/* Animated particles */}
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 rounded-full bg-lime"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
                y: [0, -20, -40],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                repeatDelay: Math.random(),
              }}
            />
          ))}
          
          <motion.div 
            className="mb-8 inline-block relative"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="relative w-20 h-20 mb-3 mx-auto">
              <motion.div 
                className="absolute w-full h-full border-4 border-t-lime border-r-teal border-b-orange border-l-purple rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <motion.span 
                  className="text-2xl font-spaceGrotesk font-bold"
                  animate={{ color: ['#ffffff', '#CCFF00', '#ffffff'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <span className="inline-block">N</span>
                  <span className="inline-block text-lime">J</span>
                </motion.span>
              </motion.div>
            </div>
            
            <h2 className="text-2xl font-spaceGrotesk font-bold text-white mb-2">
              <motion.span
                className="inline-block"
                animate={{ 
                  color: ['#ffffff', '#005A66', '#D94F30', '#CCFF00', '#ffffff'] 
                }}
                transition={{ duration: 8, repeat: Infinity }}
              >
                Nikhil Jangid
              </motion.span>
            </h2>
            <p className="text-gray-400 text-sm mb-6">Portfolio Experience</p>
          </motion.div>
          
          <motion.div
            className="w-full bg-charcoal/30 h-1.5 rounded-full overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-teal via-lime to-orange"
              style={{ width: `${loadingProgress}%` }}
              initial={{ width: "0%" }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
          
          <motion.p
            className="mt-4 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading experience... {Math.round(loadingProgress)}%
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Layout>
            <HeroSection />
            <AboutSection />
            <SkillsSection />
            <ProjectsSection />
            <TimelineSection />
            <ContactSection />
          </Layout>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Index;
