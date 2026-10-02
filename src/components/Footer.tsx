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
    <footer className="py-10 relative bg-background overflow-hidden border-t border-border/60">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

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
            className="mb-6 md:mb-0 bg-card/50 p-4 rounded-lg border border-border/80"
            whileHover={{ y: -2, borderColor: 'rgba(38, 235, 218, 0.28)' }}
            transition={{ duration: 0.25 }}
          >
            <div className="text-2xl font-bold font-spaceGrotesk tracking-tight">
              <span className="text-foreground">Nikhil</span>
              <span className="text-primary ml-1">Jangid</span>
            </div>
            <p className="text-muted-foreground text-sm mt-2 font-medium">
              <span className="text-primary">Software Engineer</span> · Backend · Full Stack · AI
            </p>
          </motion.div>

          {/* Copyright and Scroll-to-Top */}
          <div className="flex flex-col items-center md:items-end">
            <motion.div
              className="text-muted-foreground text-sm mb-4 font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Building reliable software, one commit at a time.
            </motion.div>
            <motion.button
              onClick={scrollToTop}
              className="p-3 bg-muted/30 rounded-full text-muted-foreground hover:text-primary border border-border transition-colors"
              whileHover={{ y: -2, borderColor: 'rgba(38, 235, 218, 0.28)' }}
              whileTap={{ scale: 0.97 }}
              aria-label="Scroll to top"
            >
              <ArrowUp size={20} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;