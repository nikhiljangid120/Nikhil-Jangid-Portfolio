import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'contact', label: 'Contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Determine navbar visibility (hide on scroll down, show on scroll up)
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;
      setVisible(isVisible);
      setPrevScrollPos(currentScrollPos);
      
      // Add background when scrolled
      setScrolled(currentScrollPos > 50);
      
      // Determine active section based on scroll position
      const sections = navItems.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      })).filter(item => item.element);
      
      if (sections.length) {
        const currentSection = sections.reduce((acc, section) => {
          if (!section.element) return acc;
          const rect = section.element.getBoundingClientRect();
          const offset = 150; // Adjust based on navbar height
          
          if (rect.top <= offset && rect.bottom > offset) {
            return section.id;
          }
          return acc;
        }, sections[0].id);
        
        setActiveSection(currentSection);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, navItems]);

  // Animation variants
  const navbarVariants = {
    visible: { y: 0, opacity: 1 },
    hidden: { y: -100, opacity: 0 }
  };

  const logoVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  };

  const navItemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: (i) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.3, delay: i * 0.1 } 
    }),
    hover: { 
      scale: 1.1, 
      color: "#9BF00B", 
      transition: { duration: 0.2 } 
    }
  };

  const mobileMenuVariants = {
    closed: { 
      opacity: 0,
      height: 0,
      transition: { 
        opacity: { duration: 0.2 },
        height: { duration: 0.3 }
      }
    },
    open: { 
      opacity: 1,
      height: 'auto',
      transition: { 
        opacity: { duration: 0.3 },
        height: { duration: 0.4 }
      }
    }
  };

  return (
    <motion.header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-inkyblack/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}
      variants={navbarVariants}
      initial="visible"
      animate={visible ? "visible" : "hidden"}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <motion.div 
            variants={logoVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="text-2xl font-spaceGrotesk font-bold flex items-center"
          >
            <span className="text-white">Nikhil</span>
            <span className="text-lime">Jangid</span>
            <motion.div 
              className="ml-2 h-1 w-2 bg-lime rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                custom={index}
                variants={navItemVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                className={`relative nav-link font-medium text-sm transition-colors
                  ${activeSection === item.id 
                    ? 'text-lime font-semibold' 
                    : 'text-gray-300 hover:text-white'}`}
              >
                {activeSection === item.id && (
                  <motion.span
                    className="absolute -bottom-1 left-0 h-0.5 bg-lime"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                {item.label}
              </motion.a>
            ))}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="bg-lime text-inkyblack px-4 py-2 rounded-full font-medium text-sm shadow-glow-sm hover:shadow-glow-md transition-all duration-300"
            >
              Resume
            </motion.button>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 text-white rounded-md"
            onClick={toggleMenu}
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="md:hidden bg-inkyblack/95 backdrop-blur-lg border-t border-gray-800/50"
          >
            <nav className="flex flex-col py-4 px-4">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between py-4 border-b border-gray-800/30 last:border-0
                    ${activeSection === item.id 
                      ? 'text-lime font-medium' 
                      : 'text-gray-300'}`}
                >
                  <span>{item.label}</span>
                  <motion.div
                    animate={{ x: activeSection === item.id ? 0 : -4, opacity: activeSection === item.id ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeSection === item.id && <ChevronRight size={16} className="text-lime" />}
                  </motion.div>
                </motion.a>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 bg-lime text-inkyblack py-3 rounded-md font-medium text-sm flex items-center justify-center"
                onClick={() => setIsOpen(false)}
              >
                View Resume
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;