
import { ArrowUp } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <footer className="py-8 bg-inkyblack relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="text-xl font-spaceGrotesk font-bold">
              <span className="text-white">Nikhil</span>
              <span className="text-lime">Jangid</span>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Full Stack Developer & Problem Solver
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="text-gray-400 text-sm mb-2">
              &copy; {currentYear} Nikhil Jangid. All rights reserved.
            </div>
            <button
              onClick={scrollToTop}
              className="p-2 bg-charcoal/50 rounded-full text-gray-300 hover:text-lime transition-colors duration-300"
              aria-label="Scroll to top"
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
