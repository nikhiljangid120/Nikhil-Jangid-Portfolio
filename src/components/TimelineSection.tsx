
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
      description: "Started my B.Tech journey, diving deep into algorithms, data structures, operating systems, computer networks, and web development. Actively built personal projects and contributed to open source.",
      type: "education",
      details: "Coursework: Advanced Data Structures, Operating Systems, Database Management, Computer Networks, and Web Technologies. Participated in coding clubs, hackathons, and academic projects. Solved 400+ DSA problems across LeetCode and GeeksForGeeks throughout the degree.",
      location: "Jaipur, Rajasthan"
    },
    {
      year: "2025",
      title: "Frontend Developer Intern",
      organization: "Celebal Technologies",
      description: "Developed a shipment delivery application using React.js and Tailwind CSS. Integrated REST APIs and implemented responsive interfaces. Collaborated using Git within an Agile development workflow.",
      type: "experience",
      details: "Built a production-grade shipment tracking application with real-time status updates, responsive UI components, and clean REST API integration. Worked in an Agile environment with sprint planning, code reviews, and version-controlled deployments.",
      location: "Jaipur, Rajasthan (Hybrid)"
    },
    {
      year: "2026",
      title: "B.Tech CSE — Graduated",
      organization: "Amity University, Rajasthan",
      description: "Graduated with a CGPA of 8.48. Completed 4 years of Computer Science engineering with hands-on project experience, internships, and a strong foundation in software engineering principles.",
      type: "education",
      details: "Final CGPA: 8.48 (Class XII: 95.87% · Class X: 83.67%). Key achievements during degree: software engineering internships, 400+ DSA problems solved, 4,500+ GitHub contributions, First Prize in college hackathon, and built 4+ full-stack products.",
      location: "Jaipur, Rajasthan"
    },
    {
      year: "2026",
      title: "SDE Intern",
      organization: "Wisflux Tech Labs",
      description: "Built production-grade backend services using NestJS, PostgreSQL, TypeORM, and Docker Compose. Developed an end-to-end RAG document Q&A pipeline with pgvector and OpenRouter, and concurrency-safe booking workflows with modular Nx monorepo architecture.",
      type: "experience",
      details: "Backend Engineering: Developed transactional workflows secured with JWT auth, designed for consistency under concurrent requests using pessimistic locking. Implemented modular NestJS architecture within an Nx monorepo.\n\nAI Engineering: Designed and developed the RAG Chatbot — Document Q&A System (live at nikhil-rag-chatbot.onrender.com): PDF ingestion with SHA-256 deduplication, sliding-window chunking, 384-dim MiniLM vector embeddings with pgvector, and OpenRouter/Llama 3.3 for grounded, source-attributed responses. Deployed on Render with Docker and managed PostgreSQL.",
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
        return 'from-secondary to-primary';
      case 'experience':
        return 'from-primary to-accent';
      case 'achievement':
        return 'from-amber-400 to-amber-600';
      default:
        return 'from-primary to-secondary';
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'education':
        return 'bg-secondary/10';
      case 'experience':
        return 'bg-primary/10';
      case 'achievement':
        return 'bg-amber-500/10';
      default:
        return 'bg-primary/10';
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'education':
        return 'border-secondary/30';
      case 'experience':
        return 'border-primary/30';
      case 'achievement':
        return 'border-amber-500/30';
      default:
        return 'border-primary/30';
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
    <section id="timeline" ref={ref} className="py-20 relative overflow-hidden bg-background">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <motion.div
        className="section-container relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-primary/60" />
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-primary">Timeline</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">My</span>{' '}
            <span className="text-primary opacity-80">Journey</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl">
            From a curious CS student to a production-grade backend engineer — internships at Celebal Technologies and Wisflux Tech Labs, 5+ projects, and a CGPA of 8.48.
          </p>
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
              className="p-3 rounded-full bg-card/50 text-white/70 hover:text-white transition-colors interactive border border-border"
              whileHover={{ y: -1, borderColor: 'rgba(179, 146, 240, 0.28)' }}
              whileTap={{ scale: 0.96 }}
              data-cursor-text="Previous"
            >
              <ChevronLeft size={20} />
            </motion.button>

            <div className="px-4 py-1.5 bg-charcoal/50 backdrop-blur-sm rounded-full text-sm border border-white/10">
              {activeIndex + 1} / {timelineItems.length}
            </div>

            <motion.button
              onClick={handleNextItem}
              className="p-3 rounded-full bg-card/50 text-white/70 hover:text-white transition-colors interactive border border-border"
              whileHover={{ y: -1, borderColor: 'rgba(38, 235, 218, 0.28)' }}
              whileTap={{ scale: 0.96 }}
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
                      className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-secondary/50 via-primary/50 to-secondary/50"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </h3>

                  <div className="flex items-center mt-4 text-sm space-x-4">
                    <div className="flex items-center text-primary">
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
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop Timeline - Enhanced */}
        <div className="hidden lg:block relative max-w-4xl mx-auto">
          {/* Main timeline line */}
          <motion.div
            className="absolute left-[60px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary/50 via-primary/50 to-secondary/50"
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
              </motion.div>

              {/* Year badge */}
              <motion.div
                className="absolute left-0 top-0 w-[40px] text-center"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <span className="bg-charcoal/70 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono text-primary border border-primary/20">
                  {item.year.split(' - ')[0]}
                </span>
              </motion.div>

              <motion.div
                className={`relative border border-border/70 rounded-xl overflow-hidden group interactive bg-card/40 ${hoveredIndex === index ? 'ring-1 ring-border' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -2, transition: { duration: 0.25 } }}
                data-cursor-text="Expand"
                onClick={() => setSelectedItem(item)}
              >
                <div className={`absolute inset-0 ${getBgColor(item.type)} opacity-35 z-0`} />

                {/* Type badge */}
                <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-medium bg-gradient-to-r ${getGradient(item.type)} text-primary-foreground rounded-bl-lg`}>
                  {getTypeLabel(item.type)}
                </div>

                <div className="p-6 relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-start mb-3 justify-between">
                    <h3 className="text-xl font-bold text-white mb-2 sm:mb-0 group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-3 text-sm">
                    <div className="flex items-center text-primary">
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
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                  />

                  <motion.div
                    className="absolute top-3 right-3 mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ rotate: 90 }}
                  >
                    <ExternalLink size={16} className="text-primary" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Connecting line to the next item */}
              {index < timelineItems.length - 1 && (
                <motion.div
                  className="absolute left-[60px] top-0 w-0.5 h-24 z-0"
                  style={{
                    background: `linear-gradient(to bottom, 
                      ${item.type === 'education' ? 'rgba(179, 146, 240, 0.5)' : item.type === 'experience' ? 'rgba(38, 235, 218, 0.5)' : 'rgba(245, 158, 11, 0.5)'}, 
                      ${timelineItems[index + 1].type === 'education' ? 'rgba(179, 146, 240, 0.5)' : timelineItems[index + 1].type === 'experience' ? 'rgba(38, 235, 218, 0.5)' : 'rgba(245, 158, 11, 0.5)'})`
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
                    background: `radial-gradient(circle, ${selectedItem.type === 'education' ? 'rgba(179, 146, 240, 0.6)' : selectedItem.type === 'experience' ? 'rgba(38, 235, 218, 0.6)' : 'rgba(245, 158, 11, 0.6)'} 0%, transparent 70%)`,
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

                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getGradient(selectedItem.type)} text-primary-foreground`}>
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
                    <div className="flex items-center text-primary">
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
                        <h5 className="text-primary font-medium mb-2 flex items-center">
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
