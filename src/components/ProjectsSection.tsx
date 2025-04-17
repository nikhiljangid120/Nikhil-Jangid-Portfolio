import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Code, X, Play, Maximize2, Award, Eye, Sparkles, ArrowRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  details?: string;
}

const ProjectsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const projectVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const projects: Project[] = [
    {
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce platform with product catalog, user authentication, and payment processing integration.",
      image: "https://dummyimage.com/600x400/234/fff&text=E-Commerce+App",
      technologies: ["React", "Node.js", "Express", "MongoDB", "JWT", "Stripe API"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      featured: true,
      details: "This comprehensive e-commerce solution features a responsive product catalog with filtering and search capabilities, secure user authentication with JWT, role-based access control, and seamless payment processing via Stripe API. The admin dashboard provides inventory management, order tracking, and analytics."
    },
    {
      title: "Task Management Dashboard",
      description: "A responsive task management application with drag-and-drop interface, user roles, and real-time updates.",
      image: "https://dummyimage.com/600x400/345/fff&text=Task+Dashboard",
      technologies: ["React", "Redux", "Node.js", "Socket.IO", "MongoDB"],
      githubUrl: "https://github.com",
      featured: true,
      details: "This productivity tool allows teams to manage tasks through an intuitive drag-and-drop interface with Kanban boards. Features include real-time updates via Socket.IO, customizable task categories, deadline notifications, and detailed project analytics to track team productivity."
    },
    {
      title: "Algorithmic Visualizer",
      description: "An interactive tool to visualize sorting algorithms, pathfinding algorithms, and data structures in real-time.",
      image: "https://dummyimage.com/600x400/456/fff&text=Algorithm+Visualizer",
      technologies: ["HTML", "CSS", "JavaScript", "Data Structures", "Algorithms"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      featured: true,
      details: "This educational tool provides interactive visualizations of complex algorithms and data structures. Users can adjust parameters and watch real-time animations of sorting algorithms (quicksort, mergesort, etc.), pathfinding algorithms (Dijkstra's, A*), and various data structures like binary trees and heaps."
    },
    {
      title: "Weather Forecast App",
      description: "A weather application providing current conditions and 5-day forecasts using geolocation and weather APIs.",
      image: "https://dummyimage.com/600x400/567/fff&text=Weather+App",
      technologies: ["React", "OpenWeather API", "Geolocation API", "CSS3"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      featured: false,
      details: "This weather application delivers accurate forecasts using the OpenWeather API with a clean, responsive interface. Features include geolocation-based weather data, 5-day forecasts with hourly breakdowns, animated weather conditions, and customizable location favorites."
    }
  ];
  
  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);
  
  const shimmerEffect = {
    hidden: { backgroundPosition: '200% 0' },
    visible: { 
      backgroundPosition: '-200% 0',
      transition: { 
        repeat: Infinity,
        duration: 8,
        ease: 'linear'
      }
    }
  };
  
  return (
    <section id="projects" ref={ref} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-inkyblack/90 to-charcoal/90 -z-10" />
      
      {/* Enhanced visual elements */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-inkyblack to-transparent z-0" />
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-inkyblack to-transparent z-0" />
      
      <motion.div 
        className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-orange/10 blur-3xl z-0 opacity-60"
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
        className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-purple/10 blur-3xl z-0 opacity-40"
        animate={{ 
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{ 
          duration: 18, 
          repeat: Infinity,
          repeatType: "mirror"
        }}
      />
      
      <motion.div 
        className="section-container relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div variants={projectVariants} className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-4 relative inline-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.span 
              className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-gold via-orange to-gold"
              animate={{ 
                backgroundPosition: ['0% center', '100% center', '0% center'],
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "linear",
              }}
            >
              Featured Projects
            </motion.span>
            <motion.span 
              className="absolute -inset-1 blur-lg opacity-30 bg-gradient-to-r from-gold via-orange to-gold rounded-lg z-0"
              animate={{ 
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                repeatType: "mirror"
              }}
            />
          </motion.h2>
          
          <motion.div 
            className="w-20 h-1.5 bg-gradient-to-r from-orange to-gold mx-auto mb-8"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "5rem", opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          />
          
          <motion.p 
            className="text-lg text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            A showcase of my technical skills and problem-solving abilities through real-world applications.
          </motion.p>
        </motion.div>
        
        {/* Mobile Carousel */}
        <div className="md:hidden mb-16">
          <Carousel className="w-full">
            <CarouselContent>
              {featuredProjects.map((project, index) => (
                <CarouselItem key={index}>
                  <motion.div
                    className="relative overflow-hidden group interactive rounded-xl"
                    whileHover={{ y: -5 }}
                    data-cursor-text="View"
                    onClick={() => setSelectedProject(project)}
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-orange/20 to-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <div className="relative">
                      <div className="relative overflow-hidden h-48">
                        <motion.img 
                          src={project.image} 
                          alt={project.title} 
                          className="w-full h-48 object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.5 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-inkyblack/80 to-transparent" />
                        
                        <motion.div 
                          className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange/70 to-gold/70"
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                      
                      <div className="p-6 bg-charcoal/90 backdrop-blur-sm border border-white/5">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold text-gold flex items-center space-x-2">
                            <Sparkles className="w-4 h-4 text-gold animate-pulse mr-1" />
                            <span>{project.title}</span>
                          </h3>
                          
                          {project.featured && (
                            <motion.div 
                              className="bg-gold/20 rounded-full p-1 flex items-center justify-center"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Award className="w-3 h-3 text-gold" />
                            </motion.div>
                          )}
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-4">{project.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.slice(0, 3).map((tech, techIndex) => (
                            <motion.span 
                              key={techIndex} 
                              className="tech-pill text-xs"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * techIndex }}
                            >
                              {tech}
                            </motion.span>
                          ))}
                          {project.technologies.length > 3 && (
                            <motion.span 
                              className="tech-pill text-xs"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              +{project.technologies.length - 3}
                            </motion.span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <motion.div 
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Eye className="w-5 h-5 text-white" />
                    </motion.div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-charcoal/70 text-white border-0 hover:bg-gold/70 transition-colors duration-300" />
            <CarouselNext className="right-2 bg-charcoal/70 text-white border-0 hover:bg-gold/70 transition-colors duration-300" />
          </Carousel>
        </div>
        
        {/* Desktop Grid - Enhanced */}
        <div className="hidden md:block space-y-36">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={index}
              variants={projectVariants}
              className={`grid grid-cols-12 gap-8 items-center relative ${
                index % 2 === 0 ? '' : 'md:rtl'
              }`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className={`lg:col-span-7 col-span-12 relative group ${
                index % 2 === 0 ? '' : 'md:ltr'
              }`}>
                {/* Animated glow effect */}
                <motion.div
                  className="absolute -inset-0.5 bg-gradient-to-r from-gold/40 via-orange/40 to-gold/40 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-700 group-hover:duration-200 -z-10"
                  animate={{ 
                    backgroundPosition: ['0% center', '100% center', '0% center'],
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    repeatType: "mirror"
                  }}
                />
                
                <div className="relative overflow-hidden rounded-xl group cursor-pointer interactive" onClick={() => setSelectedProject(project)}>
                  <div className="absolute inset-0 bg-gradient-to-br from-orange/20 to-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  
                  <motion.img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full object-cover h-72"
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.7 }
                    }}
                    data-cursor-text="Explore"
                  />
                  
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-inkyblack/90 via-inkyblack/60 to-inkyblack/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <motion.div 
                      className="flex space-x-4 scale-0 group-hover:scale-100 transition-transform duration-300"
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {project.githubUrl && (
                        <motion.a 
                          href={project.githubUrl}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-3 bg-charcoal/80 backdrop-blur-sm rounded-full text-white hover:text-lime transition-colors duration-300 border border-white/10"
                          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(204, 255, 0, 0.3)" }}
                          onClick={(e) => e.stopPropagation()}
                          data-cursor-text="GitHub"
                        >
                          <Github size={24} />
                        </motion.a>
                      )}
                      {project.liveUrl && (
                        <motion.a 
                          href={project.liveUrl}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-3 bg-charcoal/80 backdrop-blur-sm rounded-full text-white hover:text-lime transition-colors duration-300 border border-white/10"
                          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(204, 255, 0, 0.3)" }}
                          onClick={(e) => e.stopPropagation()}
                          data-cursor-text="Live Demo"
                        >
                          <ExternalLink size={24} />
                        </motion.a>
                      )}
                      <motion.button
                        className="p-3 bg-charcoal/80 backdrop-blur-sm rounded-full text-white hover:text-lime transition-colors duration-300 border border-white/10"
                        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(204, 255, 0, 0.3)" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(project);
                        }}
                        data-cursor-text="Details"
                      >
                        <Maximize2 size={24} />
                      </motion.button>
                    </motion.div>
                  </motion.div>
                  
                  {/* Project number badge */}
                  <motion.div 
                    className={`absolute ${index % 2 === 0 ? '-left-5' : '-right-5'} -top-5 bg-gradient-to-br from-gold to-orange w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-xl text-inkyblack z-20`}
                    initial={{ scale: 0, rotate: -20 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.3 }}
                  >
                    {index + 1}
                  </motion.div>
                </div>
              </div>
              
              <motion.div 
                className={`lg:col-span-5 col-span-12 relative ${index % 2 === 0 ? '' : 'md:ltr'}`}
                whileHover={{ x: index % 2 === 0 ? 10 : -10 }}
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-charcoal/30 backdrop-blur-sm p-6 rounded-xl border border-white/5 relative overflow-hidden group">
                  {/* Shimmer effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 -translate-x-full z-0"
                    animate={{ x: ['0%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 5 }}
                  />
                
                  <h3 className="text-2xl font-bold mb-4 text-white relative z-10 flex items-center">
                    <motion.span
                      className="bg-clip-text text-transparent bg-gradient-to-r from-gold via-orange to-gold mr-2"
                      animate={{ 
                        backgroundPosition: ['0% center', '100% center', '0% center'],
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      {project.title}
                    </motion.span>
                    
                    {project.featured && (
                      <motion.div 
                        className="inline-flex ml-2"
                        initial={{ rotate: -10, scale: 0.8 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Award className="w-5 h-5 text-gold" />
                      </motion.div>
                    )}
                  </h3>
                  
                  <p className="text-gray-300 mb-6 relative z-10">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                    {project.technologies.map((tech, techIndex) => (
                      <motion.span 
                        key={techIndex} 
                        className="px-3 py-1 rounded-full text-xs font-medium relative overflow-hidden group"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * techIndex }}
                        viewport={{ once: true }}
                      >
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-gold/20 via-orange/20 to-gold/20 opacity-30 group-hover:opacity-60 transition-opacity duration-300" 
                          animate={{ 
                            backgroundPosition: ['0% center', '100% center', '0% center'],
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        <span className="relative z-10 text-white">{tech}</span>
                      </motion.span>
                    ))}
                  </div>
                  
                  <div className="flex space-x-4 relative z-10">
                    {project.githubUrl && (
                      <motion.a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-lime transition-colors duration-300 flex items-center interactive"
                        data-cursor-text="Code"
                        whileHover={{ x: 5 }}
                      >
                        <Github size={18} className="mr-2" /> View Code
                      </motion.a>
                    )}
                    
                    {project.liveUrl && (
                      <motion.a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-lime transition-colors duration-300 flex items-center interactive"
                        data-cursor-text="Demo"
                        whileHover={{ x: 5 }}
                      >
                        <Play size={18} className="mr-2" /> Live Demo
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
              
              {/* Connection lines */}
              <motion.div 
                className={`absolute hidden lg:block left-1/2 top-1/2 w-20 h-0.5 bg-gradient-to-r ${index % 2 === 0 ? 'from-lime/30 to-transparent' : 'from-transparent to-lime/30'} -z-10`}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
              />
            </motion.div>
          ))}
        </div>
        
        {/* Other Projects - Enhanced */}
        {otherProjects.length > 0 && (
          <motion.div 
            variants={projectVariants} 
            className="mt-32"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <h3 className="text-2xl font-bold text-center mb-12 relative">
              <motion.span 
                className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-purple via-teal to-purple"
                animate={{ 
                  backgroundPosition: ['0% center', '100% center', '0% center'],
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                Other Notable Projects
              </motion.span>
              <motion.div 
                className="absolute left-1/2 -translate-x-1/2 bottom-0 w-48 h-1 bg-gradient-to-r from-purple/30 via-teal/50 to-purple/30"
                animate={{ 
                  backgroundPosition: ['0% 0%', '100% 100%'],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              />
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherProjects.map((project, index) => (
                <motion.div
                  key={index}
                  className="relative rounded-xl overflow-hidden group interactive"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  onClick={() => setSelectedProject(project)}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  data-cursor-text="View details"
                >
                  {/* Card background with gradient */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-charcoal/90 to-inkyblack/90 z-0" 
                    initial={{ opacity: 0.9 }}
                    whileHover={{ opacity: 1 }}
                  />
                  
                  {/* Animated border */}
                  <motion.div 
                    className="absolute inset-0 rounded-xl p-[1px] z-10"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    whileHover={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <motion.div 
                        className="w-[500%] h-[500%] absolute -top-[200%] -left-[200%] bg-conic-gradient" 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }} 
                        style={{
                          backgroundImage: 'conic-gradient(from 0deg, transparent 0%, transparent 40%, rgba(204, 255, 0, 0.1) 50%, transparent 60%, transparent 100%)',
                        }}
                      />
                    </div>
                  </motion.div>
                  
                  <div className="relative p-6 z-20">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-bold text-white group-hover:text-gold transition-colors duration-300">{project.title}</h4>
                      <div className="flex space-x-3">
                        {project.githubUrl && (
                          <motion.a 
                            href={project.githubUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-lime transition-colors duration-300"
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github size={20} />
                          </motion.a>
                        )}
                        {project.liveUrl && (
                          <motion.a 
                            href={project.liveUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-lime transition-colors duration-300"
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={20} />
                          </motion.a>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-4 text-sm">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 4).map((tech, techIndex) => (
                        <span key={techIndex} className="tech-pill text-xs">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="tech-pill text-xs">+{project.technologies.length - 4} more</span>
                      )}
                    </div>
                    
                    <motion.div 
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple/30 via-teal/50 to-purple/30"
                      initial={{ width: 0 }}
                      animate={{ width: hoverIndex === index ? "100%" : "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <motion.div 
                      className="absolute bottom-3 right-3 text-lime opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{ x: hoverIndex === index ? 0 : 10, opacity: hoverIndex === index ? 1 : 0 }}
                    >
                      <ArrowRight size={20} />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Enhanced GitHub CTA */}
        <motion.div 
          variants={projectVariants}
          className="mt-20 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.a 
            href="https://github.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-8 py-4 relative rounded-md border border-white/10 hover:border-lime/40 transition-all duration-300 overflow-hidden interactive"
            whileHover={{ y: -5, boxShadow: "0 15px 30px -10px rgba(204, 255, 0, 0.2)" }}
            data-cursor-text="GitHub"
          >
            <motion.div 
              className="absolute inset-0 opacity-0 bg-gradient-to-r from-lime/10 to-orange/10 transition-opacity duration-500"
              whileHover={{ opacity: 1 }}
            />
            
            <motion.div 
              className="absolute inset-0 z-0 opacity-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-lime/20 via-transparent to-transparent"
              animate={{ 
                opacity: [0, 0.5, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
            
            <Code size={20} className="relative z-10 text-lime" />
            <span className="relative z-10 font-medium text-white">View More on GitHub</span>
            
            <motion.div 
              className="absolute right-0 w-12 h-full bg-gradient-to-l from-lime/10 to-transparent opacity-0"
              initial={{ x: 100, opacity: 0 }}
              whileHover={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>
        </motion.div>
        
        {/* Project Detail Modal - Enhanced */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
