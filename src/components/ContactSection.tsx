import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Send, Mail, Phone, MapPin, Github, Linkedin, Code, ExternalLink, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import confetti from 'canvas-confetti';

const ContactSection = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const formRef = useRef(null);
  const sectionRef = useRef(null);
  const successButtonRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  const triggerConfetti = () => {
    if (successButtonRef.current) {
      const rect = successButtonRef.current.getBoundingClientRect();
      const x = rect.x + rect.width / 2;
      const y = rect.y + rect.height / 2;
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { 
          x: x / window.innerWidth, 
          y: y / window.innerHeight 
        },
        colors: ['#10B981', '#A3E635', '#22D3EE', '#ffffff'],
        zIndex: 1000,
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields",
        variant: "destructive"
      });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Trigger confetti effect
      triggerConfetti();
      
      // Reset success state after animation completes
      setTimeout(() => {
        setIsSuccess(false);
        // Reset form
        setName('');
        setEmail('');
        setMessage('');
      }, 3000);
      
      toast({
        title: "Message Sent",
        description: "Thanks for reaching out! I'll get back to you soon.",
      });
    }, 1500);
  };
  
  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'nikhiljangid343@gmail.com',
      href: 'mailto:nikhiljangid343@gmail.com',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 8058803339',
      href: 'tel:+918058803339',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Jaipur, Rajasthan, India',
      href: 'https://maps.google.com/?q=Jaipur,Rajasthan,India',
    },
  ];
  
  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com/nikhiljangid120',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/nikhil-jangid-b84360264/',
    },
    {
      icon: Code,
      label: 'LeetCode',
      href: 'https://leetcode.com/u/nikhil_888/',
    },
    {
      icon: ExternalLink,
      label: 'GeeksForGeeks',
      href: 'https://www.geeksforgeeks.org/user/nikhiljals77/',
    },
  ];
  
  const codingProfiles = [
    {
      label: 'CodeChef',
      href: 'https://www.codechef.com/users/nikhil_139/',
      badge: '3⭐ Coder',
    },
    {
      label: 'HackerEarth',
      href: 'https://www.hackerearth.com/@nikhil_888/',
      badge: 'Emerging Programmer',
    },
    {
      label: 'LeetCode',
      href: 'https://leetcode.com/u/nikhil_888/',
      badge: '100 Days Badge',
    },
    {
      label: 'GeeksForGeeks',
      href: 'https://www.geeksforgeeks.org/user/nikhiljals77/',
      badge: 'Daily DSA Practice',
    },
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const successVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    },
    exit: { 
      scale: 1.2, 
      opacity: 0,
      transition: { duration: 0.3 } 
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal to-inkyblack -z-10" />
      
      <motion.div 
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-gradient-to-b from-lime/10 to-transparent blur-3xl z-0 opacity-30"
        animate={{ 
          x: [0, -30, 0],
          y: [0, 20, 0],
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity,
          repeatType: "mirror"
        }}
      />
      
      <motion.div 
        className="absolute bottom-20 left-12 w-96 h-96 rounded-full bg-gradient-to-t from-teal/10 to-purple/5 blur-3xl z-0 opacity-20"
        animate={{ 
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          repeatType: "mirror"
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 relative inline-block">
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-teal via-lime to-teal">
              Let's Connect
            </span>
            <motion.span 
              className="absolute -inset-1 blur-lg opacity-30 bg-gradient-to-r from-teal via-lime to-teal rounded-lg -z-10"
              animate={{ 
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
            />
          </h2>
          
          <motion.div 
            className="w-20 h-1.5 bg-gradient-to-r from-teal to-lime mx-auto mb-6"
            initial={{ width: 0, opacity: 0 }}
            animate={inView ? { width: "5rem", opacity: 1 } : { width: 0, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          
          <p className="text-lg text-gray-300">
            Have a project in mind or want to discuss an opportunity? I'd love to hear from you.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="bg-charcoal/50 backdrop-blur-sm rounded-xl border border-white/5 p-6 md:p-8 relative overflow-hidden"
          >
            <motion.h3 variants={itemVariants} className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="text-lime mr-2">📝</span> Send a Message
            </motion.h3>
            
            {/* Form */}
            <motion.form 
              ref={formRef} 
              onSubmit={handleSubmit} 
              variants={containerVariants}
              className={isSuccess ? "opacity-0 pointer-events-none" : ""}
              animate={isSuccess ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div variants={itemVariants} className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-inkyblack border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime/50 focus:border-transparent transition-colors"
                  placeholder="Your name"
                  required
                />
              </motion.div>
              
              <motion.div variants={itemVariants} className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-inkyblack border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime/50 focus:border-transparent transition-colors"
                  placeholder="your.email@example.com"
                  required
                />
              </motion.div>
              
              <motion.div variants={itemVariants} className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-inkyblack border border-white/10 rounded-lg text-white h-32 resize-none focus:outline-none focus:ring-2 focus:ring-lime/50 focus:border-transparent transition-colors"
                  placeholder="Tell me about your project, question, or opportunity..."
                  required
                />
              </motion.div>
              
              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-gradient-to-r from-lime to-teal text-inkyblack font-medium rounded-lg flex items-center justify-center hover:shadow-lg hover:shadow-lime/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <motion.div 
                      className="mr-3 h-5 w-5"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <svg className="h-full w-full text-inkyblack" viewBox="0 0 24 24">
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeWidth="3"
                          d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10"
                        />
                      </svg>
                    </motion.div>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send size={18} className="mr-2" /> Send Message
                  </span>
                )}
              </motion.button>
            </motion.form>
            
            {/* Success Animation */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-charcoal/90 to-inkyblack/90 backdrop-blur-sm z-10"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={successVariants}
                >
                  <motion.div 
                    ref={successButtonRef}
                    className="relative flex flex-col items-center"
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: 1,
                      transition: { 
                        type: "spring", 
                        stiffness: 200, 
                        damping: 20,
                        delay: 0.1
                      } 
                    }}
                  >
                    <motion.div
                      className="w-20 h-20 rounded-full bg-gradient-to-r from-lime to-teal flex items-center justify-center mb-6"
                      animate={{ 
                        boxShadow: ["0 0 0 0 rgba(163, 230, 53, 0.7)", "0 0 0 20px rgba(163, 230, 53, 0)"],
                      }}
                      transition={{
                        repeat: 3,
                        duration: 1.5,
                        ease: "easeOut",
                      }}
                    >
                      <CheckCircle size={40} className="text-inkyblack" />
                    </motion.div>
                    
                    <motion.h3
                      className="text-2xl font-bold text-white mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: 0.3 } 
                      }}
                    >
                      Message Sent!
                    </motion.h3>
                    
                    <motion.p
                      className="text-gray-300 text-center max-w-xs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: 0.4 } 
                      }}
                    >
                      Thanks for reaching out! I'll get back to you as soon as possible.
                    </motion.p>
                  </motion.div>
                  
                  {/* Animated particles */}
                  <motion.div className="absolute inset-0 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-lime"
                        initial={{ 
                          x: "50%", 
                          y: "50%", 
                          opacity: 0,
                          scale: 0 
                        }}
                        animate={{ 
                          x: `${Math.random() * 100}%`,
                          y: `${Math.random() * 100}%`,
                          opacity: [0, 1, 0],
                          scale: [0, 1.5, 0]
                        }}
                        transition={{
                          duration: 2 + Math.random() * 2,
                          delay: 0.2 + Math.random() * 0.3,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Background pulse animation */}
            {isSuccess && (
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-lime/20 to-teal/20 rounded-xl z-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: [0, 0.2, 0],
                  scale: [0.8, 1.2, 1.5],
                }}
                transition={{
                  duration: 2,
                  ease: "easeOut",
                }}
              />
            )}
          </motion.div>
          
          {/* Contact Information */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex flex-col justify-between"
          >
            {/* Contact Details */}
            <motion.div variants={containerVariants} className="mb-10">
              <motion.h3 variants={itemVariants} className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="text-lime mr-2">📞</span> Contact Information
              </motion.h3>
              
              <div className="space-y-4">
                {contactInfo.map((contact, index) => (
                  <motion.a
                    key={index}
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={itemVariants}
                    className="flex items-center p-4 bg-inkyblack/50 border border-white/5 rounded-lg hover:bg-charcoal/70 hover:border-lime/20 transition-colors duration-300 group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime/10 to-teal/10 flex items-center justify-center mr-4 group-hover:from-lime/20 group-hover:to-teal/20 transition-colors duration-300">
                      <contact.icon size={18} className="text-lime" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{contact.label}</p>
                      <p className="text-white font-medium">{contact.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
            
            {/* Social Links */}
            <motion.div variants={containerVariants} className="mb-10">
              <motion.h3 variants={itemVariants} className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="text-lime mr-2">🌐</span> Connect Online
              </motion.h3>
              
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center px-4 py-2 bg-inkyblack/50 border border-white/5 rounded-lg hover:bg-charcoal/70 hover:border-lime/20 transition-colors duration-300"
                  >
                    <social.icon size={16} className="text-lime mr-2" />
                    <span className="text-white text-sm">{social.label}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
            
            {/* Coding Profiles */}
            <motion.div variants={containerVariants}>
              <motion.h3 variants={itemVariants} className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="text-lime mr-2">💻</span> Coding Profiles & Achievements
              </motion.h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {codingProfiles.map((profile, index) => (
                  <motion.a
                    key={index}
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="flex flex-col p-4 bg-inkyblack/50 border border-white/5 rounded-lg hover:bg-charcoal/70 hover:border-lime/20 transition-colors duration-300"
                  >
                    <span className="text-white font-medium">{profile.label}</span>
                    <span className="text-xs px-2 py-0.5 bg-lime/20 text-lime rounded-full w-fit mt-2">{profile.badge}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;