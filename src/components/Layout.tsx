
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomCursor from './CustomCursor';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  useEffect(() => {
    // Hide default cursor for desktop users
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      document.body.style.cursor = 'none';
    }
    
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);
  
  return (
    <AnimatePresence mode="wait">
      <div className="min-h-screen flex flex-col overflow-hidden">
        <CustomCursor />
        <Navbar />
        <motion.main
          className="flex-grow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.main>
        <Footer />
      </div>
    </AnimatePresence>
  );
};

export default Layout;
