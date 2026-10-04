
import { useRef, useState, useEffect } from 'react';
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

  // Lock body scroll and handle Escape key when modal is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setSelectedItem(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedItem]);

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
              className="p-3 rounded-full bg-card text-white/70 hover:text-white transition-colors interactive border border-border"
              whileHover={{ y: -1, borderColor: 'rgba(179, 146, 240, 0.28)' }}
              whileTap={{ scale: 0.96 }}
              aria-label="Previous timeline item"
              data-cursor-text="Previous"
            >
              <ChevronLeft size={20} />
            </motion.button>

            <div className="px-4 py-1.5 bg-[#0e1320] backdrop-blur-sm rounded-full text-sm font-mono border border-white/10">
              {activeIndex + 1} / {timelineItems.length}
            </div>

            <motion.button
              onClick={handleNextItem}
              className="p-3 rounded-full bg-card text-white/70 hover:text-white transition-colors interactive border border-border"
              whileHover={{ y: -1, borderColor: 'rgba(38, 235, 218, 0.28)' }}
              whileTap={{ scale: 0.96 }}
              aria-label="Next timeline item"
              data-cursor-text="Next"
            >
              <ChevronRight size={20} />
            </motion.button>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className={`relative rounded-xl overflow-hidden p-0 bg-[#0e1320] border ${getBorderColor(timelineItems[activeIndex].type)} shadow-xl`}
            >
              {/* Type indicator badge */}
              <div
                className={`absolute top-0 right-0 z-10 px-3 py-1 rounded-bl-lg text-xs font-medium bg-gradient-to-r ${getGradient(timelineItems[activeIndex].type)} text-primary-foreground`}
              >
                {getTypeLabel(timelineItems[activeIndex].type)}
              </div>

              <div className="p-6">
                <div className="flex flex-col mb-4">
                  <h3 className="text-xl font-bold text-white relative inline-block">
                    {timelineItems[activeIndex].title}
                  </h3>

                  <div className="flex items-center mt-3 text-sm space-x-4">
                    <div className="flex items-center text-primary font-mono">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      <span>{timelineItems[activeIndex].year}</span>
                    </div>

                    {timelineItems[activeIndex].location && (
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1.5" />
                        <span>{timelineItems[activeIndex].location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <h4 className="text-gray-300 font-medium mb-3 flex items-center">
                  <span className={`p-1.5 rounded-md bg-gradient-to-r ${getGradient(timelineItems[activeIndex].type)} mr-2.5`}>
                    {getIcon(timelineItems[activeIndex].type)}
                  </span>
                  <span>{timelineItems[activeIndex].organization}</span>
                </h4>

                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{timelineItems[activeIndex].description}</p>

                <motion.button
                  onClick={() => setSelectedItem(timelineItems[activeIndex])}
                  className={`mt-2 text-sm flex items-center px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-300 interactive font-medium`}
                  whileHover={{ x: 3 }}
                  data-cursor-text="Details"
                >
                  <span>View full details</span>
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
            className="absolute left-[60px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-secondary/50 via-primary/50 to-secondary/50"
            initial={{ height: 0 }}
            whileInView={{ height: "calc(100% - 2rem)" }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
          />

          {timelineItems.map((item, index) => (
            <motion.div
              key={index}
              className="mb-14 relative pl-[120px]"
              variants={itemVariants}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Animated circle for timeline dot */}
              <motion.div
                className={`absolute left-[49px] top-6 bg-gradient-to-r ${getGradient(item.type)} w-[24px] h-[24px] rounded-full z-20 flex items-center justify-center shadow-lg`}
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
                className="absolute left-0 top-6 w-[40px] text-center"
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                viewport={{ once: true }}
              >
                <span className="bg-[#0e1320] px-2 py-1 rounded text-xs font-mono text-primary border border-primary/25 shadow-sm">
                  {item.year.split(' - ')[0]}
                </span>
              </motion.div>

              <motion.div
                className={`relative border border-border/80 rounded-xl overflow-hidden group interactive bg-[#0d121d] shadow-lg transition-all duration-300 ${
                  hoveredIndex === index ? 'ring-1 ring-primary/40 border-primary/40 shadow-primary/5' : ''
                }`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                data-cursor-text="Expand"
                onClick={() => setSelectedItem(item)}
              >
                {/* Type badge */}
                <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-medium bg-gradient-to-r ${getGradient(item.type)} text-primary-foreground rounded-bl-lg shadow-sm z-10`}>
                  {getTypeLabel(item.type)}
                </div>

                <div className="p-6 relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-start mb-3 justify-between">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-200 pr-24">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-3 text-sm">
                    <div className="flex items-center text-primary font-mono">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      <span>{item.year}</span>
                    </div>

                    {item.location && (
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1.5" />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>

                  <h4 className="text-gray-300 font-medium mb-3 flex items-center">
                    <span className={`p-1.5 rounded-md bg-gradient-to-r ${getGradient(item.type)} mr-2.5 shadow-sm`}>
                      {getIcon(item.type)}
                    </span>
                    <span>{item.organization}</span>
                  </h4>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">{item.description}</p>

                  <div className="flex items-center text-xs font-mono text-primary/80 group-hover:text-primary transition-colors gap-1 pt-1">
                    <span>Click to view full details</span>
                    <ExternalLink size={13} className="ml-1 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Timeline Item Modal - Fully Opaque & Scrollable */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#0b0f19] shadow-[0_25px_70px_rgba(0,0,0,0.9)] text-foreground custom-scrollbar"
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                transition={{ type: "spring", damping: 26, stiffness: 320 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Top colored accent border */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${getGradient(selectedItem.type)}`} />

                {/* Subtle internal ambient tint */}
                <div
                  className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${selectedItem.type === 'education' ? 'rgba(179, 146, 240, 0.5)' : selectedItem.type === 'experience' ? 'rgba(38, 235, 218, 0.5)' : 'rgba(245, 158, 11, 0.5)'} 0%, transparent 70%)`,
                  }}
                />

                {/* Close Button */}
                <button
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors border border-white/10 z-20"
                  aria-label="Close details"
                  onClick={() => setSelectedItem(null)}
                >
                  <X size={18} />
                </button>

                <div className="p-6 sm:p-8 relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-lg bg-gradient-to-r ${getGradient(selectedItem.type)} shadow-md`}>
                      {getIcon(selectedItem.type)}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getGradient(selectedItem.type)} text-primary-foreground`}>
                      {getTypeLabel(selectedItem.type)}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-white pr-10">
                    {selectedItem.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-sm mb-4 text-muted-foreground font-mono">
                    <div className="flex items-center text-primary">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      <span>{selectedItem.year}</span>
                    </div>

                    {selectedItem.location && (
                      <div className="flex items-center text-gray-400">
                        <MapPin className="w-4 h-4 mr-1.5" />
                        <span>{selectedItem.location}</span>
                      </div>
                    )}
                  </div>

                  <h4 className="text-lg text-primary/95 font-medium mb-4 flex items-center">
                    {selectedItem.organization}
                  </h4>

                  <div className="space-y-4">
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{selectedItem.description}</p>
                    
                    {selectedItem.details && (
                      <div className="mt-5 p-5 bg-[#111726] rounded-xl border border-white/10 shadow-inner">
                        <h5 className="text-primary font-mono text-xs uppercase tracking-wider mb-2.5 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Detailed Overview & Technical Contributions
                        </h5>
                        <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line space-y-2">
                          {selectedItem.details}
                        </div>
                      </div>
                    )}
                  </div>
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
