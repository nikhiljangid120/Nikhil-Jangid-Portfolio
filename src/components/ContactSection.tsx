
import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2, Github, Linkedin, Twitter, Instagram, CheckCircle2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FormField {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  value: string;
  type: string;
  required: boolean;
  touched: boolean;
}

const ContactSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const { toast } = useToast();
  
  const [activeField, setActiveField] = useState<string | null>(null);
  const [formStep, setFormStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formFields, setFormFields] = useState<FormField[]>([
    { id: 'name', name: 'name', label: 'Your Name', placeholder: 'John Doe', value: '', type: 'text', required: true, touched: false },
    { id: 'email', name: 'email', label: 'Your Email', placeholder: 'john@example.com', value: '', type: 'email', required: true, touched: false },
    { id: 'subject', name: 'subject', label: 'Subject', placeholder: 'How can I help you?', value: '', type: 'text', required: true, touched: false },
    { id: 'message', name: 'message', label: 'Message', placeholder: 'Your message here...', value: '', type: 'textarea', required: true, touched: false }
  ]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormFields(prev => 
      prev.map(field => 
        field.name === name 
          ? { ...field, value, touched: true } 
          : field
      )
    );
  };
  
  const handleFocus = (fieldId: string) => {
    setActiveField(fieldId);
  };
  
  const handleBlur = () => {
    setActiveField(null);
  };
  
  const handleNextStep = () => {
    if (formStep < formFields.length - 1) {
      setFormStep(prev => prev + 1);
    }
  };
  
  const handlePrevStep = () => {
    if (formStep > 0) {
      setFormStep(prev => prev - 1);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after showing success
      setTimeout(() => {
        setFormFields(fields => fields.map(field => ({ ...field, value: '', touched: false })));
        setFormStep(0);
        setIsSubmitted(false);
      }, 3000);
    }, 1500);
  };
  
  const contactInfo = [
    { icon: <Mail className="w-6 h-6" />, title: "Email", content: "nikhil.jangid@example.com", link: "mailto:nikhil.jangid@example.com", color: "text-teal", bgColor: "bg-teal/20" },
    { icon: <Phone className="w-6 h-6" />, title: "Phone", content: "+91 98765 43210", link: "tel:+919876543210", color: "text-orange", bgColor: "bg-orange/20" },
    { icon: <MapPin className="w-6 h-6" />, title: "Location", content: "Rajasthan, India", link: null, color: "text-purple", bgColor: "bg-purple/20" }
  ];
  
  const socialLinks = [
    { icon: <Github />, url: "https://github.com/", label: "GitHub" },
    { icon: <Linkedin />, url: "https://linkedin.com/in/", label: "LinkedIn" },
    { icon: <Twitter />, url: "https://twitter.com/", label: "Twitter" },
    { icon: <Instagram />, url: "https://instagram.com/", label: "Instagram" }
  ];
  
  return (
    <section id="contact" ref={ref} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-inkyblack/90 to-charcoal/90 -z-10" />
      
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-lime"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.5, 0],
              scale: [1, 0],
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeOut",
            }}
          />
        ))}
      </div>
      
      <motion.div 
        className="section-container"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-teal to-orange mx-auto mb-8" />
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Have a project in mind or want to discuss potential collaborations? Feel free to reach out!
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2 space-y-8"
          >
            {contactInfo.map((item, index) => (
              <motion.div 
                key={index}
                className="card-3d p-6 bg-charcoal/50 flex items-start space-x-4 group relative overflow-hidden"
                whileHover={{ x: 10 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className={`p-3 rounded-full ${item.bgColor} ${item.color}`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                  {item.link ? (
                    <a 
                      href={item.link} 
                      className={`${item.color} hover:opacity-80 transition-opacity duration-300 interactive`}
                      data-cursor-text={item.title}
                    >
                      {item.content}
                    </a>
                  ) : (
                    <p className="text-gray-300">{item.content}</p>
                  )}
                </div>
                
                <motion.div 
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-lime/50 via-transparent to-transparent"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
            
            <motion.div 
              className="card-3d p-6 bg-charcoal/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h3 className="text-lg font-bold mb-4">Connect With Me</h3>
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                  <motion.a 
                    key={index}
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-charcoal/70 rounded-full text-gray-300 hover:text-lime transition-colors duration-300 interactive"
                    whileHover={{ y: -5 }}
                    data-cursor-text={link.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  >
                    {link.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              className="hidden lg:block card-3d p-6 bg-gradient-to-br from-charcoal/80 to-inkyblack/90 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h3 className="text-lg font-bold mb-4 text-lime">Quick Response</h3>
              <p className="text-gray-400 text-sm mb-3">I typically respond to all inquiries within 24 hours.</p>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                <span className="text-xs text-gray-400">Available for projects</span>
              </div>
              
              <motion.div 
                className="absolute -z-10 inset-0 opacity-30"
                initial={{ backgroundPosition: '0% 0%' }}
                animate={{ backgroundPosition: '100% 100%' }}
                transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(204, 255, 0, 0.1), transparent 70%)',
                }}
              />
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-3 card-3d p-8 bg-charcoal/50 relative overflow-hidden"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <span className="gradient-text">Send Me a Message</span>
              <motion.div 
                className="ml-3 w-2 h-2 rounded-full bg-lime"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </h3>
            
            {isSubmitted ? (
              <motion.div 
                className="flex flex-col items-center justify-center py-16 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 5, stiffness: 100, delay: 0.2 }}
                  className="mb-6 text-lime"
                >
                  <CheckCircle2 size={64} />
                </motion.div>
                <h4 className="text-xl font-bold mb-3 text-lime">Message Sent!</h4>
                <p className="text-gray-300 max-w-sm">
                  Thank you for reaching out. I'll get back to you as soon as possible.
                </p>
              </motion.div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {formStep === 0 && (
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formFields[0].value}
                          onChange={handleChange}
                          onFocus={() => handleFocus('name')}
                          onBlur={handleBlur}
                          required
                          className={`w-full px-4 py-3 bg-inkyblack/50 border rounded-md focus:outline-none focus:ring-2 text-white transition-all duration-300 ${
                            activeField === 'name' 
                              ? 'border-lime/50 focus:ring-lime/50' 
                              : 'border-gray-700 focus:ring-lime/30'
                          }`}
                          placeholder="John Doe"
                        />
                        {activeField === 'name' && (
                          <motion.div 
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs text-lime"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            What should I call you?
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="relative">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                          Your Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formFields[1].value}
                          onChange={handleChange}
                          onFocus={() => handleFocus('email')}
                          onBlur={handleBlur}
                          required
                          className={`w-full px-4 py-3 bg-inkyblack/50 border rounded-md focus:outline-none focus:ring-2 text-white transition-all duration-300 ${
                            activeField === 'email' 
                              ? 'border-lime/50 focus:ring-lime/50' 
                              : 'border-gray-700 focus:ring-lime/30'
                          }`}
                          placeholder="john@example.com"
                        />
                        {activeField === 'email' && (
                          <motion.div 
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs text-lime"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            Where can I reach you?
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                  
                  {formStep === 1 && (
                    <motion.div
                      className="space-y-6"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative">
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formFields[2].value}
                          onChange={handleChange}
                          onFocus={() => handleFocus('subject')}
                          onBlur={handleBlur}
                          required
                          className={`w-full px-4 py-3 bg-inkyblack/50 border rounded-md focus:outline-none focus:ring-2 text-white transition-all duration-300 ${
                            activeField === 'subject' 
                              ? 'border-lime/50 focus:ring-lime/50' 
                              : 'border-gray-700 focus:ring-lime/30'
                          }`}
                          placeholder="How can I help you?"
                        />
                        {activeField === 'subject' && (
                          <motion.div 
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs text-lime"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            What's this about?
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                  
                  {formStep === 2 && (
                    <motion.div
                      className="space-y-6"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formFields[3].value}
                          onChange={handleChange}
                          onFocus={() => handleFocus('message')}
                          onBlur={handleBlur}
                          required
                          rows={5}
                          className={`w-full px-4 py-3 bg-inkyblack/50 border rounded-md focus:outline-none focus:ring-2 text-white resize-none transition-all duration-300 ${
                            activeField === 'message' 
                              ? 'border-lime/50 focus:ring-lime/50' 
                              : 'border-gray-700 focus:ring-lime/30'
                          }`}
                          placeholder="Your message here..."
                        />
                        {activeField === 'message' && (
                          <motion.div 
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs text-lime"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            Tell me more...
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="flex justify-between">
                        <motion.button
                          type="button"
                          onClick={handlePrevStep}
                          className="px-4 py-2 bg-charcoal/70 text-white font-medium rounded-md flex items-center space-x-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                          <span>Back</span>
                        </motion.button>
                        
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-6 py-3 bg-gradient-to-r from-teal to-lime text-white font-medium rounded-md transition-all duration-300 hover:opacity-90 flex items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              <span>Send Message</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {formStep < 2 && (
                  <div className="flex justify-between mt-8">
                    {formStep > 0 && (
                      <motion.button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-4 py-2 bg-charcoal/70 text-white font-medium rounded-md flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        <span>Back</span>
                      </motion.button>
                    )}
                    
                    <motion.button
                      type="button"
                      onClick={handleNextStep}
                      className={`px-6 py-3 bg-gradient-to-r from-purple to-teal text-white font-medium rounded-md transition-all duration-300 hover:opacity-90 flex items-center space-x-2 ${
                        formStep === 0 && formFields[0].value && formFields[1].value 
                          ? '' 
                          : formStep === 1 && formFields[2].value 
                          ? '' 
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      whileHover={{ scale: formStep === 0 && formFields[0].value && formFields[1].value ? 1.05 : 1 }}
                      whileTap={{ scale: formStep === 0 && formFields[0].value && formFields[1].value ? 0.95 : 1 }}
                      disabled={
                        (formStep === 0 && (!formFields[0].value || !formFields[1].value)) ||
                        (formStep === 1 && !formFields[2].value)
                      }
                    >
                      <span>Continue</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </motion.button>
                  </div>
                )}
                
                <div className="pt-4">
                  <div className="flex justify-center space-x-2">
                    {[0, 1, 2].map(step => (
                      <motion.div
                        key={step}
                        className={`w-3 h-3 rounded-full ${formStep === step ? 'bg-lime' : 'bg-gray-600'}`}
                        animate={{ scale: formStep === step ? [1, 1.2, 1] : 1 }}
                        transition={{ duration: 0.5, repeat: formStep === step ? Infinity : 0 }}
                      />
                    ))}
                  </div>
                </div>
              </form>
            )}
            
            {/* Decorative elements */}
            <motion.div 
              className="absolute -z-10 top-0 right-0 w-64 h-64"
              animate={{ 
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity,
                repeatType: "mirror"
              }}
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(204, 255, 0, 0.05), transparent 70%)',
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactSection;
