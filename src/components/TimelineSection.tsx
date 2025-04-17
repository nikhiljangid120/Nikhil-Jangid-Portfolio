
import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { GraduationCap, Briefcase, Award, Calendar, ChevronRight, ChevronLeft, X } from 'lucide-react';

interface TimelineItem {
  year: string;
  title: string;
  organization: string;
  description: string;
  type: 'education' | 'experience' | 'achievement';
  details?: string;
}

const TimelineSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
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
      year: "2021 - Present",
      title: "B.Tech in Computer Science & Engineering",
      organization: "Engineering College, Rajasthan",
      description: "Currently pursuing my bachelor's degree with a focus on algorithms, data structures, and web development technologies.",
      type: "education",
      details: "Coursework includes Advanced Data Structures, Operating Systems, Database Management, Computer Networks, and Web Technologies. Actively participating in coding clubs and hackathons while maintaining a strong academic record."
    },
    {
      year: "2023",
      title: "Web Development Intern",
      organization: "Tech Startup",
      description: "Worked on developing responsive web applications using React.js and Node.js, implementing RESTful APIs and user authentication systems.",
      type: "experience",
      details: "Built and deployed a full-stack e-commerce platform with features like user authentication, product catalog, and payment integration. Collaborated with design and backend teams to ensure seamless integration. Improved website performance by 40% through code optimization and image compression techniques."
    },
    {
      year: "2022",
      title: "National Coding Competition Finalist",
      organization: "TechFest 2022",
      description: "Secured a position in the finals of a national-level coding competition, showcasing problem-solving skills and algorithmic thinking.",
      type: "achievement",
      details: "Competed among 5000+ participants nationwide and reached the final round of 20 contestants. Solved complex algorithmic challenges involving graph theory, dynamic programming, and optimization problems under tight time constraints."
    },
    {
      year: "2021",
      title: "Senior Secondary Education",
      organization: "Senior Secondary School, Rajasthan",
      description: "Completed senior secondary education with a focus on Mathematics and Computer Science, graduating with high honors.",
      type: "education",
      details: "Graduated with 95% marks with distinction in Mathematics, Physics, and Computer Science. Developed a strong foundation in logical thinking, problem-solving, and analytical skills that later proved essential for computer science studies."
    },
    {
      year: "2020",
      title: "Web Design Contest Winner",
      organization: "Regional Tech Symposium",
      description: "Won first place in a regional web design competition for creating an innovative and accessible educational platform interface.",
      type: "achievement",
      details: "Designed and prototyped an intuitive learning management system focused on accessibility for differently-abled users. Implemented responsive design principles, high-contrast modes, and screen reader compatibility to ensure inclusive user experience."
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
  
  const handlePrevItem = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : timelineItems.length - 1));
  };
  
  const handleNextItem = () => {
    setActiveIndex((prev) => (prev < timelineItems.length - 1 ? prev + 1 : 0));
  };
  
  return (
    <section id="timeline" ref={ref} className="py-20 relative overflow-hidden bg-gradient-to-b from-charcoal/80 to-inkyblack/80">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,23,96,0.2),transparent_70%)] -z-10" />
      
      <motion.div 
        className="section-container relative"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Journey</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-purple to-teal mx-auto mb-8" />
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            The path that has shaped my skills and experiences in technology and development.
          </p>
        </motion.div>
        
        {/* Mobile Timeline Carousel */}
        <div className="lg:hidden mb-16 relative">
          <motion.div
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={handlePrevItem}
              className="p-2 rounded-full bg-charcoal/70 text-white/70 hover:text-white transition-colors interactive"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              data-cursor-text="Previous"
            >
              <ChevronLeft size={20} />
            </motion.button>
            
            <div className="px-4 py-1 bg-charcoal/50 rounded-full text-sm">
              {activeIndex + 1} / {timelineItems.length}
            </div>
            
            <motion.button
              onClick={handleNextItem}
              className="p-2 rounded-full bg-charcoal/70 text-white/70 hover:text-white transition-colors interactive"
              whileHover={{ scale: 1.1 }}
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
              className={`card-3d p-6 ${getBgColor(timelineItems[activeIndex].type)}`}
            >
              <div className="flex flex-col mb-4">
                <h3 className="text-xl font-bold text-white">{timelineItems[activeIndex].title}</h3>
                <div className="flex items-center mt-2 text-sm">
                  <Calendar className="w-4 h-4 mr-1 text-lime" />
                  <span className="text-lime">{timelineItems[activeIndex].year}</span>
                </div>
              </div>
              
              <h4 className="text-gray-300 font-medium mb-3">{timelineItems[activeIndex].organization}</h4>
              <p className="text-gray-400 text-sm mb-4">{timelineItems[activeIndex].description}</p>
              
              <motion.button
                onClick={() => setSelectedItem(timelineItems[activeIndex])}
                className="text-sm text-lime flex items-center interactive"
                whileHover={{ x: 5 }}
                data-cursor-text="Details"
              >
                View details <ChevronRight size={16} className="ml-1" />
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Desktop Timeline */}
        <div className="hidden lg:block relative max-w-3xl mx-auto pl-8 sm:pl-12 border-l-2 border-muted">
          {timelineItems.map((item, index) => (
            <motion.div
              key={index}
              className="mb-12 relative"
              variants={itemVariants}
              custom={index}
            >
              <div className={`timeline-dot bg-gradient-to-r ${getGradient(item.type)}`}>
                {getIcon(item.type)}
              </div>
              
              <motion.div 
                className={`card-3d p-6 ml-6 ${getBgColor(item.type)} relative group interactive`}
                whileHover={{ x: 5 }}
                data-cursor-text="Expand"
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center mb-2 sm:mb-4 justify-between">
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <span className="text-sm text-lime flex items-center sm:ml-4">
                    <Calendar className="w-4 h-4 mr-1" /> {item.year}
                  </span>
                </div>
                <h4 className="text-gray-300 font-medium mb-3">{item.organization}</h4>
                <p className="text-gray-400 text-sm">{item.description}</p>
                
                <motion.div 
                  className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-lime/30 to-transparent"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                />
                
                <motion.div
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ rotate: 90 }}
                >
                  <ChevronRight size={16} className="text-lime" />
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        {/* Timeline Item Modal */}
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
                className={`relative w-full max-w-2xl ${getBgColor(selectedItem.type)} card-3d p-8`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  className="absolute top-4 right-4 p-1 rounded-full bg-charcoal/50 text-white/70 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedItem(null)}
                >
                  <X size={20} />
                </motion.button>
                
                <div className={`inline-block p-2 rounded-md bg-gradient-to-r ${getGradient(selectedItem.type)} mb-4`}>
                  {getIcon(selectedItem.type)}
                </div>
                
                <h3 className="text-2xl font-bold mb-2">{selectedItem.title}</h3>
                <div className="flex items-center text-sm mb-4">
                  <Calendar className="w-4 h-4 mr-1 text-lime" />
                  <span className="text-lime">{selectedItem.year}</span>
                </div>
                
                <h4 className="text-xl text-white/90 font-medium mb-4">{selectedItem.organization}</h4>
                
                <div className="space-y-4">
                  <p className="text-white/80">{selectedItem.description}</p>
                  {selectedItem.details && (
                    <div className="mt-4 p-4 bg-charcoal/30 rounded-md">
                      <h5 className="text-lime font-medium mb-2">Details</h5>
                      <p className="text-white/70">{selectedItem.details}</p>
                    </div>
                  )}
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
