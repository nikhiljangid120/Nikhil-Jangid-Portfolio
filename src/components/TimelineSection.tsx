
import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { GraduationCap, Briefcase, Award, Calendar, ChevronRight, ChevronLeft, X, Clock, MapPin, ExternalLink } from 'lucide-react';

interface TimelineItem {
  year: string;
  title: string;
  organization: string;
  description: string;
  type: 'education' | 'experience' | 'achievement';
  details?: string;
  location?: string;
}

const TimelineSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
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
  
  const timelineItems: TimelineItem[] = [
    {
      year: "2022",
      title: "B.Tech in Computer Science & Engineering",
      organization: "Amity University, Rajasthan",
      description: "Currently pursuing my bachelor's degree with a focus on algorithms, data structures, and web development technologies (2022-2026).",
      type: "education",
      details: "Coursework includes Advanced Data Structures, Operating Systems, Database Management, Computer Networks, and Web Technologies. Actively participating in coding clubs, hackathons, and academic projects while maintaining a strong academic record.",
      location: "Jaipur, Rajasthan"
    },
    {
      year: "2024",
      title: "Web Development Intern",
      organization: "Internpe",
      description: "Worked on developing responsive web applications using React.js and Node.js, implementing RESTful APIs and user authentication systems.",
      type: "experience",
      details: "Built and deployed a full-stack e-commerce platform with features like user authentication, product catalog, and payment integration. Collaborated with design and backend teams to ensure seamless integration. Improved website performance by 40% through code optimization and image compression techniques.",
      location: "Remote"
    },
    {
      year: "2023",
      title: "2nd Runner-Up – Whack Hackathon 2.0",
      organization: "Amity University, Rajasthan",
      description: "Secured the 2nd runner-up position in Whack Hackathon 2.0, a college-level hackathon, by developing an innovative solution in the field of web development and AI.",
      type: "achievement",
      details: "Worked with a team to design and implement a web-based solution that combined AI with user experience design to improve customer engagement for local businesses. The project was recognized for its creativity, technical execution, and real-world applicability.",
      location: "Jaipur, Rajasthan"
    },
    {
      year: "2021",
      title: "Senior Secondary Education (12th Grade)",
      organization: "Spectrum Global Academy",
      description: "Completed senior secondary education with a focus on Physics, Chemistry, and Mathematics (PCM), graduating with high honors.",
      type: "education",
      details: "Graduated with distinction, achieving exceptional marks in Mathematics, Physics, and Chemistry. Developed a solid foundation in logical reasoning, analytical thinking, and problem-solving, which laid the groundwork for future computer science studies.",
      location: "Jaipur, Rajasthan"
    },
    {
      year: "2019",
      title: "Secondary School Graduation (10th Grade)",
      organization: "Emmanuel Mission Secondary School",
      description: "Completed secondary education with a focus on science and mathematics subjects, excelling in mathematics and science along with other subjects too.",
      type: "education",
      details: "Graduated with top honors, achieving excellence in subjects like Mathematics, Physics, and Computer Science. Actively participated in extracurricular activities such as chess clubs and science fairs.",
      location: "Jaipur, Rajasthan"
    }
      
  ];
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'education':
        return <GraduationCap className="w-4 h-4 text-white" />;
      case 'experience':
        return <Briefcase className="w-4 h-4 text-white" />;
      case 'achievement':
        return <Award className="w-4 h-4 text-white" />;
      default:
        return <Calendar className="w-4 h-4 text-white" />;
    }
  };
  
  const getGradient = (type: string) => {
    switch (type) {
      case 'education':
        return 'from-teal to-lime';
      case 'experience':
        return 'from-purple to-teal';
      case 'achievement':
        return 'from-orange to-gold';
      default:
        return 'from-teal to-lime';
    }
  };
  
  const getBgColor = (type: string) => {
    switch (type) {
      case 'education':
        return 'bg-teal/10';
      case 'experience':
        return 'bg-purple/10';
      case 'achievement':
        return 'bg-orange/10';
      default:
        return 'bg-teal/10';
    }
  };
  
  const getBorderColor = (type: string) => {
    switch (type) {
      case 'education':
        return 'border-teal/30';
      case 'experience':
        return 'border-purple/30';
      case 'achievement':
        return 'border-orange/30';
      default:
        return 'border-teal/30';
    }
  };
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'education':
        return 'Education';
      case 'experience':
        return 'Experience';
      case 'achievement':
        return 'Achievement';
      default:
        return 'Timeline';
    }
  };
  
  const handlePrevItem = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : timelineItems.length - 1));
  };
  
  const handleNextItem = () => {
    setActiveIndex((prev) => (prev < timelineItems.length - 1 ? prev + 1 : 0));
  };
  
  return (
    <section id="timeline" ref={ref} className="py-20 relative overflow-hidden bg-gradient-to-b from-charcoal/80 to-inkyblack/80">
      {/* Improved background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,23,96,0.3),transparent_70%)] -z-10" />
      
      <motion.div 
        className="absolute top-20 left-0 w-full h-full mix-blend-overlay opacity-20"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.2"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />
      
      <motion.div 
        className="section-container relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-4 inline-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
                <motion.span 
      className="text-3xl md:text-5xl font-bold relative inline-block font-['Montserrat']"
      animate={{ 
        backgroundPosition: ['0% center', '100% center', '0% center'],
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-blue-400 to-pink-400 to-coral-400 px-3 py-1 rounded-lg shadow-[0_4px_14px_rgba(236,72,153,0.4)]">
        My Journey
      </span>
      <motion.span 
        className="absolute -inset-2 blur-2xl opacity-50 bg-gradient-to-r from-green-300 via-blue-400 to-pink-400 to-coral-400 rounded-xl -z-10"
        animate={{ 
          opacity: [0.4, 0.8, 0.4],
          scale: [1, 1.06, 1],
          boxShadow: [
            '4px 4px 16px rgba(236,72,153,0.3)', 
            '6px 6px 24px rgba(59,130,246,0.5)', 
            '4px 4px 16px rgba(236,72,153,0.3)'
          ],
          backgroundPosition: ['0% center', '100% center', '0% center']
        }}
        transition={{ duration: 2.5, repeat: Infinity, repeatType: "mirror" }}
      />
    </motion.span>
          </motion.h2>
          
          <motion.div 
            className="w-20 h-1.5 bg-gradient-to-r from-purple to-teal mx-auto mb-8"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "5rem", opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          />
          
          <motion.p 
            className="text-lg text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            The path that has shaped my skills and experiences in technology and development.
          </motion.p>
        </motion.div>
        
        {/* Mobile Timeline Carousel - Enhanced */}
        <div className="lg:hidden mb-16 relative">
          <motion.div
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={handlePrevItem}
              className="p-3 rounded-full bg-gradient-to-r from-purple/20 to-purple/5 text-white/70 hover:text-white transition-colors interactive border border-white/10"
              whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(155, 81, 224, 0.4)" }}
              whileTap={{ scale: 0.9 }}
              data-cursor-text="Previous"
            >
              <ChevronLeft size={20} />
            </motion.button>
            
            <div className="px-4 py-1.5 bg-charcoal/50 backdrop-blur-sm rounded-full text-sm border border-white/10">
              {activeIndex + 1} / {timelineItems.length}
            </div>
            
            <motion.button
              onClick={handleNextItem}
              className="p-3 rounded-full bg-gradient-to-r from-teal/5 to-teal/20 text-white/70 hover:text-white transition-colors interactive border border-white/10"
              whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(0, 204, 189, 0.4)" }}
              whileTap={{ scale: 0.9 }}
              data-cursor-text="Next"
            >
              <ChevronRight size={20} />
            </motion.button>
          </motion.div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className={`relative rounded-xl overflow-hidden p-0 ${getBgColor(timelineItems[activeIndex].type)} border ${getBorderColor(timelineItems[activeIndex].type)}`}
            >
              {/* Type indicator badge */}
              <motion.div
                className={`absolute top-0 right-0 z-10 px-3 py-1 rounded-bl-lg text-xs font-medium bg-gradient-to-r ${getGradient(timelineItems[activeIndex].type)}`}
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                {getTypeLabel(timelineItems[activeIndex].type)}
              </motion.div>
              
              <div className="p-6">
                <div className="flex flex-col mb-4">
                  <h3 className="text-xl font-bold text-white relative inline-block">
                    <motion.span
                      className="relative z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {timelineItems[activeIndex].title}
                    </motion.span>
                    <motion.div 
                      className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple/50 via-teal/50 to-purple/50"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </h3>
                  
                  <div className="flex items-center mt-4 text-sm space-x-4">
                    <div className="flex items-center text-lime">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{timelineItems[activeIndex].year}</span>
                    </div>
                    
                    {timelineItems[activeIndex].location && (
                      <div className="flex items-center text-gray-400">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{timelineItems[activeIndex].location}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <h4 className="text-gray-300 font-medium mb-3 flex items-center">
                  {getIcon(timelineItems[activeIndex].type)}
                  <span className="ml-2">{timelineItems[activeIndex].organization}</span>
                </h4>
                
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{timelineItems[activeIndex].description}</p>
                
                <motion.button
                  onClick={() => setSelectedItem(timelineItems[activeIndex])}
                  className={`mt-2 text-sm flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${getGradient(timelineItems[activeIndex].type)} bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 interactive`}
                  whileHover={{ x: 5 }}
                  data-cursor-text="Details"
                >
                  <span>View details</span>
                  <ChevronRight size={16} className="ml-1" />
                </motion.button>
              </div>
              
              {/* Visual flourish - animated corner */}
              <motion.div 
                className="absolute -bottom-10 -right-10 w-20 h-20 rounded-full"
                style={{
                  background: `conic-gradient(from 225deg at 50% 50%, transparent 0deg, ${timelineItems[activeIndex].type === 'education' ? '#00CCA9' : timelineItems[activeIndex].type === 'experience' ? '#9B51E0' : '#F97316'} 360deg)`,
                  opacity: 0.2,
                }}
                animate={{ 
                  rotate: [0, 360],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{ 
                  rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity, repeatType: "reverse" }
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Desktop Timeline - Enhanced */}
        <div className="hidden lg:block relative max-w-4xl mx-auto">
          {/* Main timeline line */}
          <motion.div 
            className="absolute left-[60px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple/50 via-teal/50 to-purple/50"
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
          />
          
          {timelineItems.map((item, index) => (
            <motion.div
              key={index}
              className="mb-20 relative pl-[120px]"
              variants={itemVariants}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Animated circle for timeline dot */}
              <motion.div 
                className={`absolute left-[49px] bg-gradient-to-r ${getGradient(item.type)} w-[22px] h-[22px] rounded-full z-20 flex items-center justify-center`}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20, 
                  delay: index * 0.1 
                }}
                viewport={{ once: true }}
              >
                {getIcon(item.type)}
                
                {/* Pulse animation */}
                <motion.div
                  className={`absolute inset-0 rounded-full bg-gradient-to-r ${getGradient(item.type)}`}
                  animate={{ 
                    opacity: [0, 0.2, 0],
                    scale: [1, 1.8, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />
              </motion.div>
              
              {/* Year badge */}
              <motion.div 
                className="absolute left-0 top-0 w-[40px] text-center"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <span className="bg-charcoal/70 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono text-lime border border-lime/20">
                  {item.year.split(' - ')[0]}
                </span>
              </motion.div>
              
              <motion.div 
                className={`relative border border-white/10 rounded-xl overflow-hidden group interactive ${hoveredIndex === index ? 'ring-1 ring-offset-2 ring-offset-inkyblack' : ''} ${hoveredIndex === index ? (item.type === 'education' ? 'ring-teal/50' : item.type === 'experience' ? 'ring-purple/50' : 'ring-orange/50') : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                data-cursor-text="Expand"
                onClick={() => setSelectedItem(item)}
              >
                {/* Card background */}
                <motion.div 
                  className={`absolute inset-0 ${getBgColor(item.type)} opacity-50 z-0`}
                  initial={{ opacity: 0.5 }}
                  whileHover={{ opacity: 0.7 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Shimmering effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full z-0"
                  animate={{ x: hoveredIndex === index ? ['0%', '200%'] : '-100%' }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                
                {/* Type badge */}
                <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-medium bg-gradient-to-r ${getGradient(item.type)} text-inkyblack rounded-bl-lg`}>
                  {getTypeLabel(item.type)}
                </div>
                
                <div className="p-6 relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-start mb-3 justify-between">
                    <h3 className="text-xl font-bold text-white mb-2 sm:mb-0 group-hover:text-lime transition-colors duration-300">
                      {item.title}
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mb-3 text-sm">
                    <div className="flex items-center text-lime">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{item.year}</span>
                    </div>
                    
                    {item.location && (
                      <div className="flex items-center text-gray-400">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <h4 className="text-gray-300 font-medium mb-3 flex items-center">
                    {getIcon(item.type)}
                    <span className="ml-2">{item.organization}</span>
                  </h4>
                  
                  <p className="text-gray-400 text-sm">{item.description}</p>
                  
                  <motion.div 
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-lime/30 to-transparent"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  
                  <motion.div
                    className="absolute top-3 right-3 mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ rotate: 90 }}
                  >
                    <ExternalLink size={16} className="text-lime" />
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Connecting line to the next item */}
              {index < timelineItems.length - 1 && (
                <motion.div 
                  className="absolute left-[60px] top-0 w-0.5 h-24 z-0"
                  style={{
                    background: `linear-gradient(to bottom, 
                      ${item.type === 'education' ? 'rgba(0, 204, 169, 0.5)' : item.type === 'experience' ? 'rgba(155, 81, 224, 0.5)' : 'rgba(249, 115, 22, 0.5)'}, 
                      ${timelineItems[index + 1].type === 'education' ? 'rgba(0, 204, 169, 0.5)' : timelineItems[index + 1].type === 'experience' ? 'rgba(155, 81, 224, 0.5)' : 'rgba(249, 115, 22, 0.5)'})`
                  }}
                  initial={{ height: 0, top: 11 }}
                  whileInView={{ height: "100%", top: 11 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                />
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Timeline Item Modal - Enhanced */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div 
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
            >
              <motion.div 
                className={`relative w-full max-w-2xl rounded-xl overflow-hidden border border-white/10`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal background */}
                <motion.div 
                  className={`absolute inset-0 ${getBgColor(selectedItem.type)} opacity-80 z-0`}
                  animate={{ 
                    opacity: [0.7, 0.9, 0.7], 
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    repeatType: "mirror" 
                  }}
                />
                
                {/* Decorative flourish */}
                <motion.div 
                  className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-30 z-0"
                  style={{
                    background: `radial-gradient(circle, ${selectedItem.type === 'education' ? 'rgba(0, 204, 169, 0.6)' : selectedItem.type === 'experience' ? 'rgba(155, 81, 224, 0.6)' : 'rgba(249, 115, 22, 0.6)'} 0%, transparent 70%)`,
                  }}
                  animate={{ 
                    scale: [1, 1.2, 1], 
                    opacity: [0.2, 0.4, 0.2] 
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    repeatType: "mirror" 
                  }}
                />
                
                <motion.button
                  className="absolute top-4 right-4 p-2 rounded-full bg-charcoal/50 backdrop-blur-sm text-white/70 hover:text-white hover:bg-charcoal/80 transition-colors border border-white/10 z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedItem(null)}
                >
                  <X size={20} />
                </motion.button>
                
                <div className="relative p-8 z-10">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${getGradient(selectedItem.type)} mb-4`}>
                      {getIcon(selectedItem.type)}
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getGradient(selectedItem.type)} text-inkyblack`}>
                      {getTypeLabel(selectedItem.type)}
                    </span>
                  </div>
                  
                  <motion.h3 
                    className="text-2xl font-bold mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {selectedItem.title}
                  </motion.h3>
                  
                  <div className="flex flex-wrap gap-4 text-sm mb-4">
                    <div className="flex items-center text-lime">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{selectedItem.year}</span>
                    </div>
                    
                    {selectedItem.location && (
                      <div className="flex items-center text-gray-400">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{selectedItem.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <motion.h4 
                    className="text-xl text-white/90 font-medium mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {selectedItem.organization}
                  </motion.h4>
                  
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <p className="text-white/80">{selectedItem.description}</p>
                    {selectedItem.details && (
                      <motion.div 
                        className="mt-4 p-5 bg-charcoal/50 backdrop-blur-sm rounded-xl border border-white/10"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <h5 className="text-lime font-medium mb-2 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Details
                        </h5>
                        <p className="text-white/70 leading-relaxed">{selectedItem.details}</p>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default TimelineSection;
