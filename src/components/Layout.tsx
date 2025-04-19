
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import { Loader } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing');
  
  useEffect(() => {
    // Hide default cursor for desktop users
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      document.body.style.cursor = isMobile ? 'auto' : 'none';
    };
    
    // Initial check
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Simulate loading progress with multiple steps
    const loadingTexts = [
      'Initializing', 
      'Loading projects', 
      'Preparing experience', 
      'Finalizing portfolio'
    ];
    
    let progress = 0;
    const intervalId = setInterval(() => {
      progress += 1;
      setLoadingProgress(progress);
      
      // Update loading text at specific progress points
      if (progress === 25) setLoadingText(loadingTexts[1]);
      if (progress === 50) setLoadingText(loadingTexts[2]);
      if (progress === 75) setLoadingText(loadingTexts[3]);
      
      if (progress >= 100) {
        clearInterval(intervalId);
        setTimeout(() => setIsLoading(false), 300);
      }
    }, 30);
    
    return () => {
      document.body.style.cursor = 'auto';
      clearTimeout(timer);
    };
  }, []);
  
  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.9],
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.5
      }
    }
  };
  
  // Loader animation
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-inkyblack flex flex-col items-center justify-center z-50">
        <div className="text-center space-y-8 max-w-md px-4">
          {/* Animated Logo */}
          <motion.div 
            className="inline-block w-32 h-32 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="absolute w-full h-full border-4 border-t-lime border-r-teal border-b-orange border-l-purple rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="text-4xl font-spaceGrotesk font-bold text-white">
                <span className="inline-block">N</span>
                <span className="inline-block text-lime">J</span>
              </span>
            </motion.div>
            
            {/* Sparkle Effect */}
            <motion.div
              className="absolute top-0 right-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ delay: 0.5, duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <Sparkles className="h-6 w-6 text-lime" />
            </motion.div>
            
            <motion.div
              className="absolute bottom-1 left-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ delay: 1.2, duration: 1.5, repeat: Infinity, repeatDelay: 1.5 }}
            >
              <Sparkles className="h-5 w-5 text-orange" />
            </motion.div>
          </motion.div>
          
          {/* Introduction Text */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Welcome to My <span className="text-lime">Portfolio</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              Crafting digital experiences with creativity and code
            </p>
          </motion.div>
          
          {/* Progress Bar */}
          <motion.div
            className="w-full max-w-xs mx-auto space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <div className="relative h-2 w-full bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-lime to-purple rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Code className="h-3 w-3" />
                <span>{loadingText}</span>
              </div>
              <span>{loadingProgress}%</span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <AnimatePresence mode="wait">
      <div className="min-h-screen flex flex-col overflow-hidden">
        <Navbar />
        <CustomCursor />
        <motion.main
          className="flex-grow"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
        >
          {/* Hero Section Intro */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {children}
          </motion.div>
        </motion.main>
        <Footer />
      </div>
    </AnimatePresence>
  );
};

export default Layout;