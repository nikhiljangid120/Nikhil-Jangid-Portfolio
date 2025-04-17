
import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Code, X, Play, Maximize2, Award } from 'lucide-react';
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
  
  return (
    <section id="projects" ref={ref} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-inkyblack/90 to-charcoal/90 -z-10" />
      
      {/* Visual elements */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-inkyblack to-transparent z-0" />
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-inkyblack to-transparent z-0" />
      
      <motion.div 
        className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-orange/10 blur-3xl z-0"
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
        className="section-container relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div variants={projectVariants} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-orange to-gold mx-auto mb-8" />
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            A showcase of my technical skills and problem-solving abilities through real-world applications.
          </p>
        </motion.div>
        
        {/* Mobile Carousel */}
        <div className="md:hidden mb-16">
          <Carousel>
            <CarouselContent>
              {featuredProjects.map((project, index) => (
                <CarouselItem key={index}>
                  <motion.div
                    className="card-3d bg-charcoal/50 overflow-hidden interactive"
                    whileHover={{ y: -5 }}
                    data-cursor-text="View"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="relative">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-inkyblack to-transparent" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-gold">{project.title}</h3>
                      <p className="text-gray-300 text-sm mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 3).map((tech, techIndex) => (
                          <span key={techIndex} className="tech-pill text-xs">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="tech-pill text-xs">+{project.technologies.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-charcoal/70 text-white border-0" />
            <CarouselNext className="right-2 bg-charcoal/70 text-white border-0" />
          </Carousel>
        </div>
        
        {/* Desktop Grid */}
        <div className="hidden md:block space-y-24">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={index}
              variants={projectVariants}
              className={`grid grid-cols-12 gap-8 items-center relative ${
                index % 2 === 0 ? '' : 'md:rtl'
              }`}
            >
              <div className={`lg:col-span-7 col-span-12 relative group ${
                index % 2 === 0 ? '' : 'md:ltr'
              }`}>
                <motion.div
                  className="absolute -inset-0.5 bg-gradient-to-br from-lime/20 to-gold/20 rounded-lg blur opacity-20 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"
                  animate={{ 
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    repeatType: "mirror"
                  }}
                />
                <div className="relative overflow-hidden rounded-lg group cursor-pointer interactive" onClick={() => setSelectedProject(project)}>
                  <motion.img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full object-cover h-72"
                    whileHover={{ 
                      scale: 1.1,
                      transition: { duration: 0.7 }
                    }}
                    data-cursor-text="Expand"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inkyblack/90 via-inkyblack/50 to-inkyblack/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="flex space-x-4 scale-0 group-hover:scale-100 transition-transform duration-300">
                      {project.githubUrl && (
                        <motion.a 
                          href={project.githubUrl}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-3 bg-charcoal/80 rounded-full text-white hover:text-lime transition-colors duration-300"
                          whileHover={{ y: -5 }}
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
                          className="p-3 bg-charcoal/80 rounded-full text-white hover:text-lime transition-colors duration-300"
                          whileHover={{ y: -5 }}
                          onClick={(e) => e.stopPropagation()}
                          data-cursor-text="Live Demo"
                        >
                          <ExternalLink size={24} />
                        </motion.a>
                      )}
                      <motion.button
                        className="p-3 bg-charcoal/80 rounded-full text-white hover:text-lime transition-colors duration-300"
                        whileHover={{ y: -5 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(project);
                        }}
                        data-cursor-text="Details"
                      >
                        <Maximize2 size={24} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
              
              <motion.div 
                className={`lg:col-span-5 col-span-12 ${index % 2 === 0 ? '' : 'md:ltr'}`}
                whileHover={{ x: index % 2 === 0 ? 10 : -10 }}
              >
                <motion.div
                  initial={{ x: index % 2 === 0 ? 50 : -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3 className="text-2xl font-bold mb-4 text-gold">{project.title}</h3>
                  <p className="text-gray-300 mb-6">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="tech-pill">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-4">
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
                </motion.div>
              </motion.div>
              
              {/* Decorative lines */}
              <div className="absolute hidden lg:block left-1/2 top-1/2 w-10 h-0.5 bg-gradient-to-r from-lime/30 to-transparent -z-10" />
            </motion.div>
          ))}
        </div>
        
        {otherProjects.length > 0 && (
          <motion.div variants={projectVariants} className="mt-24">
            <h3 className="text-2xl font-bold text-center mb-12 relative">
              <span className="relative z-10">Other Notable Projects</span>
              <motion.div 
                className="absolute left-1/2 -translate-x-1/2 bottom-0 w-48 h-1 bg-gradient-to-r from-orange/30 via-gold/30 to-orange/30"
                animate={{ 
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {otherProjects.map((project, index) => (
                <motion.div
                  key={index}
                  className="card-3d p-6 bg-charcoal/50 relative overflow-hidden group interactive"
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  onClick={() => setSelectedProject(project)}
                  data-cursor-text="View details"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-bold text-gold">{project.title}</h4>
                    <div className="flex space-x-3">
                      {project.githubUrl && (
                        <motion.a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-lime transition-colors duration-300"
                          whileHover={{ scale: 1.2 }}
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
                          whileHover={{ scale: 1.2 }}
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
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange/30 via-gold/50 to-orange/30"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        <motion.div 
          variants={projectVariants}
          className="mt-16 text-center"
        >
          <motion.a 
            href="https://github.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-charcoal/70 text-white font-medium rounded-md border border-white/10 hover:border-lime/40 transition-all duration-300 overflow-hidden group interactive"
            whileHover={{ y: -5 }}
            data-cursor-text="GitHub"
          >
            <Code size={18} className="relative z-10" />
            <span className="relative z-10">View More on GitHub</span>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-lime/20 to-orange/20 -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              animate={{ 
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: "mirror"
              }}
            />
          </motion.a>
        </motion.div>
        
        {/* Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                className="relative w-full max-w-4xl bg-charcoal/90 card-3d p-8"
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
                  onClick={() => setSelectedProject(null)}
                >
                  <X size={20} />
                </motion.button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative overflow-hidden rounded-lg">
                    <img 
                      src={selectedProject.image} 
                      alt={selectedProject.title} 
                      className="w-full h-full object-cover"
                    />
                    {selectedProject.liveUrl && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                        <a 
                          href={selectedProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-lime text-charcoal font-medium rounded-md flex items-center space-x-2"
                        >
                          <Play size={18} />
                          <span>Live Demo</span>
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-bold mb-2 text-gold flex items-center">
                      {selectedProject.title}
                      {selectedProject.featured && (
                        <div className="ml-2 p-1 bg-gold/20 rounded-md">
                          <Award size={16} className="text-gold" />
                        </div>
                      )}
                    </h3>
                    <p className="text-gray-300 mb-4">{selectedProject.description}</p>
                    
                    {selectedProject.details && (
                      <div className="mb-4 p-4 bg-inkyblack/50 rounded-md">
                        <h4 className="text-lime font-medium mb-2">Project Details</h4>
                        <p className="text-gray-400 text-sm">{selectedProject.details}</p>
                      </div>
                    )}
                    
                    <div className="mt-auto">
                      <h4 className="text-lime font-medium mb-2">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {selectedProject.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="tech-pill">
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex space-x-4">
                        {selectedProject.githubUrl && (
                          <a 
                            href={selectedProject.githubUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-charcoal text-white font-medium rounded-md flex items-center space-x-2 hover:bg-charcoal/70 transition-colors"
                          >
                            <Github size={18} />
                            <span>View Code</span>
                          </a>
                        )}
                        {selectedProject.liveUrl && (
                          <a 
                            href={selectedProject.liveUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-gradient-to-r from-teal to-purple text-white font-medium rounded-md flex items-center space-x-2 hover:opacity-90 transition-opacity"
                          >
                            <ExternalLink size={18} />
                            <span>Visit Site</span>
                          </a>
                        )}
                      </div>
                    </div>
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

export default ProjectsSection;
