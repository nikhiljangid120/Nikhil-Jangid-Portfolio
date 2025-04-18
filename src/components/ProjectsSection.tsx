
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Github, Code, Plus, ChevronRight, Link, Lightbulb, Brain, Dumbbell, Award, BookOpen } from 'lucide-react';

// Define project structure
interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  technologies: string[];
  category: 'web' | 'mobile' | 'ai' | 'tool' | 'featured';
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

// Project data
const projects: Project[] = [
  {
    id: "nj-careers",
    title: "NJ Careers",
    description: "Career roadmaps, quizzes, and skill analysis platform for tech enthusiasts.",
    longDescription: "A comprehensive platform offering structured career roadmaps, interactive skill assessments, and personalized learning paths for tech professionals, guiding them from beginners to experts.",
    image: "https://dummyimage.com/600x400/8a2be2/ffffff&text=NJ+Careers",
    technologies: ["React", "Node.js", "MongoDB", "Express", "Machine Learning"],
    category: 'featured',
    githubUrl: "https://github.com/nikhiljangid120",
    liveUrl: "https://example.com/njcareers",
    featured: true
  },
  {
    id: "resume-rocket",
    title: "ResumeRocket",
    description: "AI-powered resume builder with real-time feedback and optimization.",
    longDescription: "An intelligent resume builder that leverages NLP to analyze and optimize resumes, providing real-time feedback, ATS compatibility checks, and industry-specific recommendations.",
    image: "https://dummyimage.com/600x400/4169e1/ffffff&text=ResumeRocket",
    technologies: ["React", "OpenAI", "Firebase", "TailwindCSS"],
    category: 'ai',
    githubUrl: "https://github.com/nikhiljangid120",
    liveUrl: "https://example.com/resumerocket",
    featured: true
  },
  {
    id: "one-note",
    title: "OneNote",
    description: "Feature-rich LinkTree alternative with analytics and customization options.",
    longDescription: "A modern LinkTree alternative offering advanced analytics, rich customization options, and integrated social media tools for creators and professionals.",
    image: "https://dummyimage.com/600x400/20b2aa/ffffff&text=OneNote",
    technologies: ["Next.js", "Supabase", "Vercel Analytics", "Framer Motion"],
    category: 'web',
    githubUrl: "https://github.com/nikhiljangid120",
    liveUrl: "https://example.com/onenote",
    featured: true
  },
  {
    id: "flex-forge",
    title: "FlexForge",
    description: "AI-powered fitness platform with personalized workout and nutrition plans.",
    longDescription: "An intelligent fitness companion that creates personalized workout routines and nutrition plans based on users' goals, fitness levels, and preferences, with real-time feedback and progress tracking.",
    image: "https://dummyimage.com/600x400/ff6347/ffffff&text=FlexForge",
    technologies: ["React Native", "TensorFlow", "Firebase", "Express"],
    category: 'ai',
    githubUrl: "https://github.com/nikhiljangid120",
    liveUrl: "https://example.com/flexforge",
    featured: true
  },
  {
    id: "nexicon",
    title: "Nexicon",
    description: "Modern social media platform with unique content discovery features.",
    longDescription: "A next-generation social network focusing on meaningful connections through interest-based communities, with unique content discovery algorithms and creator-friendly monetization options.",
    image: "https://dummyimage.com/600x400/ffd700/000000&text=Nexicon",
    technologies: ["React", "Node.js", "PostgreSQL", "Socket.IO", "Redis"],
    category: 'web',
    githubUrl: "https://github.com/nikhiljangid120",
    featured: false
  },
  {
    id: "ai-code-analyzer",
    title: "AI Code Analyzer",
    description: "Tool for analyzing code complexity, suggesting optimizations, and visualizing algorithms.",
    longDescription: "An intelligent code analysis tool that evaluates code quality, suggests optimizations, and provides interactive visualizations for algorithms and data structures to aid understanding and learning.",
    image: "https://dummyimage.com/600x400/32cd32/ffffff&text=AI+Code+Analyzer",
    technologies: ["Python", "JavaScript", "D3.js", "GPT-4", "Docker"],
    category: 'ai',
    githubUrl: "https://github.com/nikhiljangid120",
    liveUrl: "https://example.com/code-analyzer",
    featured: false
  },
  {
    id: "ai-website-builder",
    title: "AI Website Builder",
    description: "No-code website builder with AI-powered design and content suggestions.",
    longDescription: "A revolutionary website builder that uses AI to generate designs, suggest content, and optimize for conversions, making professional web development accessible to everyone.",
    image: "https://dummyimage.com/600x400/9932cc/ffffff&text=AI+Website+Builder",
    technologies: ["Vue.js", "GPT-4", "AWS", "TailwindCSS"],
    category: 'ai',
    githubUrl: "https://github.com/nikhiljangid120",
    featured: false
  },
  {
    id: "flyeng-career",
    title: "Flyeng Career",
    description: "Educational platform for programming, compiler design, and community learning.",
    longDescription: "A comprehensive educational platform providing structured content on programming languages, compiler design, and computer science, complemented by a vibrant community forum and regular coding contests.",
    image: "https://dummyimage.com/600x400/ff4500/ffffff&text=Flyeng+Career",
    technologies: ["React", "Django", "PostgreSQL", "Redis", "Docker"],
    category: 'web',
    githubUrl: "https://github.com/nikhiljangid120",
    liveUrl: "https://example.com/flyeng",
    featured: false
  }
];

const ProjectsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const featuredProjects = projects.filter(project => project.featured);
  
  const filteredProjects = activeCategory === 'all' 
    ? projects.filter(project => !project.featured)
    : projects.filter(project => !project.featured && project.category === activeCategory);
  
  // For animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const categories = [
    { id: 'all', name: 'All Projects', icon: Code },
    { id: 'web', name: 'Web Apps', icon: Link },
    { id: 'ai', name: 'AI & ML', icon: Brain },
    { id: 'mobile', name: 'Mobile Apps', icon: Plus },
    { id: 'tool', name: 'Tools & Utilities', icon: Lightbulb },
  ];

  return (
    <section id="projects" ref={ref} className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-inkyblack to-charcoal -z-10" />
      
      <motion.div 
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-purple/10 to-lime/5 blur-3xl opacity-60"
        animate={{ 
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
      />
      
      <motion.div 
        className="absolute bottom-20 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-teal/10 to-orange/5 blur-3xl opacity-40"
        animate={{ 
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
      />
      
      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 relative inline-block">
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-lime via-teal to-purple">
              My Projects
            </span>
            <motion.span 
              className="absolute -inset-1 blur-lg opacity-30 bg-gradient-to-r from-lime via-teal to-purple rounded-lg -z-10"
              animate={{ 
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
            />
          </h2>
          
          <motion.div 
            className="w-20 h-1.5 bg-gradient-to-r from-lime to-teal mx-auto mb-6"
            initial={{ width: 0, opacity: 0 }}
            animate={inView ? { width: "5rem", opacity: 1 } : { width: 0, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          
          <p className="text-lg text-gray-300">
            A showcase of my technical skills through real-world applications.
          </p>
        </motion.div>
        
        {/* Featured Projects */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-20"
        >
          <motion.div 
            variants={itemVariants} 
            className="relative mb-10 flex items-center"
          >
            <h3 className="text-2xl font-bold text-white relative z-10 flex items-center">
              <Award className="mr-2 text-gold" size={24} />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold to-orange">
                Featured Projects
              </span>
            </h3>
            <div className="ml-4 h-0.5 flex-grow bg-gradient-to-r from-gold/50 to-transparent"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="group bg-gradient-to-br from-charcoal/80 to-inkyblack/80 rounded-xl overflow-hidden border border-white/5 hover:border-lime/20 transition-colors duration-300 interactive"
                data-cursor-text="View Details"
                onClick={() => setSelectedProject(project)}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inkyblack via-inkyblack/60 to-transparent opacity-80" />
                  
                  {/* Category badge */}
                  <div className="absolute top-3 right-3 px-3 py-1 bg-lime/90 text-inkyblack rounded-full text-xs font-semibold">
                    {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                  </div>
                  
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-lime via-teal to-purple"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
                
                <div className="p-6 relative">
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-lime transition-colors duration-300">
                    {project.title}
                  </h4>
                  
                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span key={techIndex} className="px-2 py-1 bg-inkyblack/60 border border-white/10 rounded-md text-xs font-medium text-gray-300">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-inkyblack/60 border border-white/10 rounded-md text-xs font-medium text-gray-300">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                  
                  {/* Links */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-3">
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-lime transition-colors duration-300 p-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github size={18} />
                        </a>
                      )}
                      
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-lime transition-colors duration-300 p-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                    
                    <motion.div 
                      className="flex items-center text-sm font-medium text-lime"
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span>Details</span>
                      <ChevronRight size={16} className="ml-1" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Project Categories */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-10"
        >
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-white relative z-10 mb-10 flex items-center">
              <BookOpen className="mr-2 text-lime" size={24} />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-lime to-teal">
                All Projects
              </span>
            </h3>
            
            <div className="flex flex-wrap gap-3 mb-10">
              {categories.map(category => (
                <motion.button
                  key={category.id}
                  className={`px-4 py-2 rounded-full flex items-center text-sm font-medium transition-all duration-300 ${
                    activeCategory === category.id 
                      ? 'bg-lime text-inkyblack shadow-lg shadow-lime/20' 
                      : 'bg-charcoal/50 text-gray-300 hover:bg-inkyblack/70'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <category.icon size={16} className="mr-2" />
                  {category.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
          
          {/* Filtered Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="group bg-inkyblack/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5 hover:border-teal/20 transition-all duration-300 interactive"
                data-cursor-text="View Project"
                onClick={() => setSelectedProject(project)}
                whileHover={{ y: -5, boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.3)" }}
              >
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inkyblack to-transparent opacity-70" />
                  
                  {/* Category tag */}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-inkyblack/70 backdrop-blur-sm rounded-md text-xs font-medium text-teal border border-teal/20">
                    {project.category}
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-teal transition-colors duration-300">
                    {project.title}
                  </h4>
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex space-x-2">
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-teal transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github size={16} />
                        </a>
                      )}
                      
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-teal transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                    
                    <span className="text-xs text-teal group-hover:underline">Learn more</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* GitHub Link CTA */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mt-16 text-center"
        >
          <motion.a 
            href="https://github.com/nikhiljangid120" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-charcoal/80 to-inkyblack border border-white/10 rounded-lg hover:border-lime/30 transition-all duration-300 group interactive"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 15px 30px -10px rgba(204, 255, 0, 0.1)" }}
            data-cursor-text="GitHub"
          >
            <Github className="text-lime group-hover:rotate-12 transition-transform duration-300" size={20} />
            <span className="font-medium text-white">Explore More on GitHub</span>
            
            <motion.div 
              className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-lime to-teal group-hover:w-full transition-all duration-500"
              initial={{ width: 0 }}
              whileHover={{ width: "100%" }}
            />
          </motion.a>
        </motion.div>
        
        {/* Project Details Modal */}
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-inkyblack/95 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              className="relative bg-charcoal/80 border border-white/10 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 md:h-80">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inkyblack via-inkyblack/50 to-transparent" />
                
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <h3 className="text-3xl font-bold text-white mb-2">{selectedProject.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedProject.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="px-3 py-1 bg-inkyblack/50 backdrop-blur-sm rounded-full text-xs font-medium text-lime border border-lime/20">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button 
                  className="absolute top-4 right-4 w-8 h-8 bg-inkyblack/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-lime hover:text-inkyblack transition-colors duration-300"
                  onClick={() => setSelectedProject(null)}
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6">
                <p className="text-gray-300 text-lg mb-6">
                  {selectedProject.longDescription || selectedProject.description}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  {selectedProject.githubUrl && (
                    <a 
                      href={selectedProject.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-5 py-2 bg-inkyblack/70 hover:bg-inkyblack text-white rounded-lg flex items-center transition-colors duration-300"
                    >
                      <Github size={18} className="mr-2" />
                      View Code
                    </a>
                  )}
                  
                  {selectedProject.liveUrl && (
                    <a 
                      href={selectedProject.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-5 py-2 bg-lime/90 hover:bg-lime text-inkyblack rounded-lg flex items-center font-medium transition-colors duration-300"
                    >
                      <ExternalLink size={18} className="mr-2" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
