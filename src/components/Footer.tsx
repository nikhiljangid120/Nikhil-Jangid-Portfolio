import { ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.8, 0.25, 1],
      },
    },
  };

  return (
    <footer className="py-12 relative bg-gradient-to-b from-[#1A1A1A] to-[#0A0E17] overflow-hidden">
      {/* Radial Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,23,96,0.2),transparent_70%)] -z-10" />

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#CCFF00]/10"
            style={{
              width: Math.random() * 40 + 20,
              height: Math.random() * 40 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 30 - 15, 0],
              y: [0, Math.random() * 30 - 15, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 8 + 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Top Gradient Divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#CCFF00]/50 to-transparent" />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Name and Title */}
          <motion.div
            className="mb-6 md:mb-0 bg-[#005A66]/20 backdrop-blur-lg p-4 rounded-xl border border-[#CCFF00]/20"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 20px rgba(204, 255, 0, 0.3)',
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-2xl font-bold font-['Space_Grotesk',_sans-serif] tracking-tight">
              <span className="text-white">Nikhil</span>
              <span className="text-[#CCFF00] ml-1">Jangid</span>
            </div>
            <p className="text-[#E0E0E0] text-sm mt-2 font-medium">
              <span className="text-[#D94F30]">Full Stack Developer</span> & Problem Solver
            </p>
          </motion.div>

          {/* Copyright and Scroll-to-Top */}
          <div className="flex flex-col items-center md:items-end">
            <motion.div
              className="text-[#E0E0E0] text-sm mb-4 font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              © {currentYear} Nikhil Jangid. All rights reserved.
            </motion.div>
            <motion.button
              onClick={scrollToTop}
              // --- MODIFICATION START ---
              // Added md:mr-4 to push it slightly left from the right edge on medium screens and up
              className="p-3 bg-[#2E1760]/30 backdrop-blur-md rounded-full text-[#E0E0E0] hover:text-[#CCFF00] border border-[#CCFF00]/20 relative overflow-hidden md:mr-20"
              // --- MODIFICATION END ---
              whileHover={{
                scale: 1.1,
                boxShadow: '0 0 25px rgba(204, 255, 0, 0.5)',
                backgroundColor: 'rgba(204, 255, 0, 0.1)',
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="Scroll to top"
            >
              <ArrowUp size={24} />
              {/* Particle Effects on Hover */}
              <motion.div
                className="absolute inset-0 -z-10"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.3 }}
                transition={{ duration: 0.3 }}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-[#CCFF00]"
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 1,
                      scale: 1,
                    }}
                    animate={{
                      x: (Math.random() - 0.5) * 50,
                      y: (Math.random() - 0.5) * 50,
                      opacity: 0,
                      scale: 0.5,
                    }}
                    transition={{
                      duration: 0.4 + Math.random() * 0.2,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeOut",
                    }}
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                  />
                ))}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Custom Styling (kept as is) */}
      <style jsx>{`
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.4;
          }
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;