import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };

    const handleChatState = (e: Event) => {
      const customEvent = e as CustomEvent<{ isOpen: boolean }>;
      setIsChatOpen(customEvent.detail?.isOpen ?? false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('portfolio-chat-state', handleChatState);

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('portfolio-chat-state', handleChatState);
    };
  }, []);

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
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Name and Title */}
          <motion.div
            className="bg-card/50 p-4 rounded-lg border border-border/80"
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

          {/* Copyright & In-page back to top */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <motion.div
              className="text-muted-foreground text-sm font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Building reliable software, one commit at a time.
            </motion.div>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              Back to top
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Floating scroll-to-top: cleanly stacked vertically above the chat button on the right edge */}
      <AnimatePresence>
        {showTopBtn && !isChatOpen && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.7, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-[5.4rem] right-[1.55rem] z-40 w-10 h-10 flex items-center justify-center rounded-full bg-card/90 backdrop-blur-md text-muted-foreground hover:text-primary border border-border/80 hover:border-primary/50 shadow-xl transition-colors cursor-pointer"
            whileHover={{ y: -2, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Back to top"
            title="Scroll to top"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;