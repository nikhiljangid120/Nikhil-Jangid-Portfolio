
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomCursor from './CustomCursor';
import Navbar from './Navbar';
import Footer from './Footer';
import { Loader } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Hide default cursor for desktop users
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      document.body.style.cursor = 'none';
    }
    
    // Simulate loading time for smooth page transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
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
        ease: [0.6, 0.05, 0.01, 0.9], // Fixed cubic-bezier values
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
      <div className="fixed inset-0 bg-inkyblack flex items-center justify-center z-50">
        <div className="text-center space-y-6">
          <motion.div 
            className="inline-block w-24 h-24 relative"
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
              <span className="text-2xl font-spaceGrotesk font-bold text-white">
                <span className="inline-block">N</span>
                <span className="inline-block text-lime">J</span>
              </span>
            </motion.div>
          </motion.div>
          
          <motion.div
            className="flex space-x-2 items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <span className="text-sm text-gray-400">Crafting experience</span>
            <Loader className="h-4 w-4 text-lime animate-spin" />
          </motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <AnimatePresence mode="wait">
      <div className="min-h-screen flex flex-col overflow-hidden">
        <CustomCursor />
        <Navbar />
        <motion.main
          className="flex-grow"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
        >
          {children}
        </motion.main>
        <Footer />
      </div>
    </AnimatePresence>
  );
};

export default Layout;
