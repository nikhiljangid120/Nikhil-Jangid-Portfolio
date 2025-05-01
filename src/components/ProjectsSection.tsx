import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, Github, Code, Plus, ChevronRight, Link, Lightbulb, Brain, BookOpen, Award } from 'lucide-react';

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
    image: "/Careers.png",
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
    longDescription: "An intelligent resume builder that leverages NLP & APIs to analyze and optimize resumes, providing real-time feedback, ATS compatibility checks, and industry-specific recommendations.",
    image: "/Resume.jpeg",
    technologies: ["Next.js", "OpenAI", "Firebase", "TailwindCSS"],
    category: 'ai',
    githubUrl: "https://github.com/nikhiljangid120/AI-Resume-Builder",
    liveUrl: "https://resume-rocket-nikhiljangid120s-projects.vercel.app/",
    featured: true
  },
  {
    id: "one-note",
    title: "OneNote",
    description: "Feature-rich LinkTree alternative with analytics and customization options.",
    longDescription: "A modern LinkTree alternative offering advanced analytics, rich customization options, and integrated social media tools for creators and professionals.",
    image: "Tree.png",
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
    image: "Fitness.png",
    technologies: ["Next.js", "React", "Firebase", "Express"],
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
    image: "Media.png",
    technologies: ["React", "Node.js", "MongoDB", "Socket.IO", "Redis"],
    category: 'web',
    githubUrl: "https://github.com/nikhiljangid120",
    featured: false
  },
  {
    id: "ai-code-analyzer",
    title: "AI Code Analyzer",
    description: "Tool for analyzing code complexity, suggesting optimizations, and visualizing algorithms.",
    longDescription: "An intelligent code analysis tool that evaluates code quality, suggests optimizations, and provides interactive visualizations for algorithms and data structures to aid understanding and learning.",
    image: "Analyzer.png",
    technologies: ["Next.js", "JavaScript", "D3.js", "GPT-4"],
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
    image: "Website.png",
    technologies: ["Next.js", "Gemini Flash 2.0", "AWS", "TailwindCSS"],
    category: 'ai',
    githubUrl: "https://github.com/nikhiljangid120",
    featured: false
  },
  {
    id: "flyeng-career",
    title: "Flyeng Career",
    description: "Educational platform for programming, compiler design, and community learning.",
    longDescription: "A comprehensive educational platform providing structured content on programming languages, compiler design, and computer science, complemented by a vibrant community forum and regular coding contests.",
    image: "FlyEng.png",
    technologies: ["Next.js", "PostgreSQL", "Redis", "Docker"],
    category: 'web',
    githubUrl: "https://github.com/nikhiljangid120",
    liveUrl: "https://example.com/flyeng",
    featured: false
  },
  {
    id: "quiz-website",
    title: "Quiz Website",
    description: "Interactive platform for creating and taking quizzes with real-time scoring.",
    longDescription: "A dynamic quiz platform that allows users to create, share, and take quizzes, featuring real-time scoring, leaderboards, and user authentication for an engaging learning experience.",
    image: "/Quiz.png",
    technologies: ["React", "Firebase", "TailwindCSS", "JavaScript"],
    category: 'web',
    githubUrl: "https://github.com/nikhiljangid120",
    featured: false
  },
  {
    id: "hospital-management",
    title: "Hospital Management System",
    description: "Web-based system for managing hospital operations, patient records, and appointments.",
    longDescription: "A comprehensive hospital management platform that streamlines patient records, appointment scheduling, billing, and staff coordination, with secure data handling and user-friendly interfaces.",
    image: "/Hospital.png",
    technologies: ["Java", "JSP", "JDBC", "Servlet", "MySQL"],
    category: 'web',
    githubUrl: "https://github.com/nikhiljangid120",
    featured: false
  },
];

const ProjectsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const { scrollYProgress } = useScroll({ target: ref });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const featuredProjects = projects.filter(project => project.featured);
  const filteredProjects = activeCategory === 'all' 
    ? projects.filter(project => !project.featured)
    : projects.filter(project => !project.featured && project.category === activeCategory);

  // Parallax effect
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 20
      }
    }
  };

  const categories = [
    { id: 'all', name: 'All Projects', icon: Code },
    { id: 'web', name: 'Web Apps', icon: Link },
    { id: 'ai', name: 'AI & ML', icon: Brain },
    { id: 'mobile', name: 'Mobile Apps', icon: Plus },
    { id: 'tool', name: 'Tools & Utilities', icon: Lightbulb },
  ];

  // Define live projects
  const liveProjectIds = ['flex-forge', 'ai-code-analyzer', 'resume-rocket', 'nexicon'];

  return (
    <section id="projects" ref={ref} className="py-24 relative overflow-hidden bg-inkyblack">
      {/* Background Elements */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-inkyblack via-charcoal/95 to-inkyblack"
        style={{ y: backgroundY }}
      />
      
      {/* Particle Effects */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-lime/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            repeatType: 'loop',
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-lime via-teal to-purple">
              My Creations
            </span>
            <motion.span 
              className="absolute inset-0 blur-2xl opacity-50 bg-gradient-to-r from-lime/50 via-teal/50 to-purple/50 -z-10"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          </h2>
          
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-lime to-teal mx-auto mb-8"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          
          <p className="text-xl text-gray-300 leading-relaxed">
            Discover my portfolio of innovative solutions and technical craftsmanship
          </p>
        </motion.div>

        {/* Featured Projects */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-24"
        >
          <motion.div 
            variants={itemVariants}
            className="relative mb-12 flex items-center"
          >
            <h3 className="text-3xl font-bold text-white flex items-center">
              <Award className="mr-3 text-gold" size={28} />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold to-orange">
                Star Projects
              </span>
            </h3>
            <motion.div 
              className="ml-6 h-0.5 flex-grow bg-gradient-to-r from-gold/50 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8 }}
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="group relative bg-gradient-to-br from-charcoal/90 to-inkyblack/90 rounded-2xl overflow-hidden border border-white/10 hover:border-lime/30 shadow-xl interactive"
                whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative h-56 overflow-hidden">
                  <motion.img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inkyblack via-inkyblack/50 to-transparent opacity-75" />
                  
                  <motion.div
                    className="absolute top-4 right-4 px-3 py-1 bg-lime/90 text-inkyblack rounded-full text-sm font-semibold"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                  </motion.div>
                  {/* Live/In Progress Badge */}
                  <motion.div
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold flex items-center ${
                      liveProjectIds.includes(project.id)
                        ? 'bg-[#CCFF00]/90 text-[#005A66] shadow-[0_0_10px_rgba(204,255,0,0.5)]'
                        : 'bg-[#FFB100]/90 text-[#0A0E17] shadow-[0_0_10px_rgba(255,177,0,0.5)]'
                    }`}
                    animate={{
                      scale: liveProjectIds.includes(project.id) ? [1, 1.05, 1] : 1,
                      opacity: [0.9, 1, 0.9],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    {liveProjectIds.includes(project.id) ? (
                      <>
                        <span className="mr-1">Live</span>
                        <motion.div
                          className="w-2 h-2 bg-[#005A66] rounded-full"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                        {/* Particle Effect on Hover */}
                        <motion.div
                          className="absolute inset-0 -z-10"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 0.3 }}
                        >
                          {Array.from({ length: 5 }).map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 rounded-full bg-[#CCFF00]"
                              initial={{ x: 0, y: 0, opacity: 1 }}
                              animate={{
                                x: (Math.random() - 0.5) * 30,
                                y: (Math.random() - 0.5) * 30,
                                opacity: 0,
                              }}
                              transition={{
                                duration: 0.4 + Math.random() * 0.2,
                                repeat: Infinity,
                                ease: 'easeOut',
                              }}
                              style={{ left: '50%', top: '50%' }}
                            />
                          ))}
                        </motion.div>
                      </>
                    ) : (
                      <span>In Progress</span>
                    )}
                  </motion.div>
                </div>

                <div className="p-6">
                  <h4 className="text-2xl font-bold text-white mb-3 group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-lime group-hover:to-teal transition-all duration-300">
                    {project.title}
                  </h4>

                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech, techIndex) => (
                      <motion.span
                        key={techIndex}
                        className="px-3 py-1 bg-inkyblack/50 border border-white/10 rounded-full text-xs font-medium text-gray-300 hover:bg-lime/20 hover:text-lime hover:border-lime/30 transition-all duration-300"
                        whileHover={{ scale: 1.1, rotate: 3 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4">
                      {project.githubUrl && (
                        <motion.a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-lime transition-colors duration-300"
                          onClick={(e) => e.stopPropagation()}
                          whileHover={{ scale: 1.2, rotate: 10 }}
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
                          onClick={(e) => e.stopPropagation()}
                          whileHover={{ scale: 1.2, rotate: -10 }}
                        >
                          <ExternalLink size={20} />
                        </motion.a>
                      )}
                    </div>

                    <motion.div 
                      className="flex items-center text-sm font-medium text-lime"
                      whileHover={{ x: 8 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <span>Explore</span>
                      <ChevronRight size={16} className="ml-1" />
                    </motion.div>
                  </div>
                </div>

                <motion.div 
                  className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-lime via-teal to-purple"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.8 }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Project Categories */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-20"
        >
          <motion.div variants={itemVariants} className="mb-12">
            <h3 className="text-3xl font-bold text-white flex items-center">
              <BookOpen className="mr-3 text-lime" size={28} />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-lime to-teal">
                Project Library
              </span>
            </h3>
          </motion.div>

          <div className="flex flex-wrap gap-4 mb-12">
            {categories.map(category => (
              <motion.button
                key={category.id}
                className={`px-5 py-2 rounded-full flex items-center text-sm font-semibold transition-all duration-300 ${
                  activeCategory === category.id 
                    ? 'bg-gradient-to-r from-lime to-teal text-inkyblack shadow-lg shadow-lime/30' 
                    : 'bg-charcoal/50 text-gray-300 hover:bg-charcoal/80'
                }`}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(204, 255, 0, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                <category.icon size={18} className="mr-2" />
                {category.name}
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="group relative bg-charcoal/50 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 hover:border-teal/30 shadow-lg interactive"
                whileHover={{ scale: 1.03, rotateX: 1, rotateY: 1 }}
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative h-48 overflow-hidden">
                  <motion.img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inkyblack to-transparent opacity-70" />
                  
                  <motion.div
                    className="absolute top-3 right-3 px-2 py-1 bg-teal/90 text-inkyblack rounded-full text-xs font-semibold"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    {project.category}
                  </motion.div>
                  {/* Live/In Progress Badge */}
                  <motion.div
                    className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold flex items-center ${
                      liveProjectIds.includes(project.id)
                        ? 'bg-[#CCFF00]/90 text-[#005A66] shadow-[0_0_10px_rgba(204,255,0,0.5)]'
                        : 'bg-[#FFB100]/90 text-[#0A0E17] shadow-[0_0_10px_rgba(255,177,0,0.5)]'
                    }`}
                    animate={{
                      scale: liveProjectIds.includes(project.id) ? [1, 1.05, 1] : 1,
                      opacity: [0.9, 1, 0.9],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    {liveProjectIds.includes(project.id) ? (
                      <>
                        <span className="mr-1">Live</span>
                        <motion.div
                          className="w-2 h-2 bg-[#005A66] rounded-full"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                        {/* Particle Effect on Hover */}
                        <motion.div
                          className="absolute inset-0 -z-10"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 0.3 }}
                        >
                          {Array.from({ length: 5 }).map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 rounded-full bg-[#CCFF00]"
                              initial={{ x: 0, y: 0, opacity: 1 }}
                              animate={{
                                x: (Math.random() - 0.5) * 30,
                                y: (Math.random() - 0.5) * 30,
                                opacity: 0,
                              }}
                              transition={{
                                duration: 0.4 + Math.random() * 0.2,
                                repeat: Infinity,
                                ease: 'easeOut',
                              }}
                              style={{ left: '50%', top: '50%' }}
                            />
                          ))}
                        </motion.div>
                      </>
                    ) : (
                      <span>In Progress</span>
                    )}
                  </motion.div>
                </div>

                <div className="p-5">
                  <h4 className="text-xl font-semibold text-white mb-2 group-hover:text-teal transition-colors duration-300">
                    {project.title}
                  </h4>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-3">
                      {project.githubUrl && (
                        <motion.a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-teal"
                          onClick={(e) => e.stopPropagation()}
                          whileHover={{ scale: 1.2 }}
                        >
                          <Github size={18} />
                        </motion.a>
                      )}
                      {project.liveUrl && (
                        <motion.a 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-teal"
                          onClick={(e) => e.stopPropagation()}
                          whileHover={{ scale: 1.2 }}
                        >
                          <ExternalLink size={18} />
                        </motion.a>
                      )}
                    </div>

                    <motion.span 
                      className="text-xs text-teal group-hover:underline"
                      whileHover={{ x: 5 }}
                    >
                      Discover
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* GitHub CTA */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center"
        >
          <motion.a 
            href="https://github.com/nikhiljangid120" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative inline-flex items-center px-8 py-4 bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-xl text-lg font-bold text-white overflow-hidden group shadow-lg shadow-black/50 hover:shadow-xl hover:shadow-lime/20 transition-all duration-500"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              borderColor: 'rgba(204, 255, 0, 0.5)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Animated glow effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-lime/30 via-teal/20 to-purple-500/30 opacity-0 blur-xl group-hover:opacity-100 transition-opacity duration-500"
              animate={{
                backgroundPosition: ['0% center', '100% center', '0% center'],
              }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
            />
            
            {/* Border highlight */}
            <motion.div 
              className="absolute inset-0 rounded-xl border border-lime/50 opacity-0 group-hover:opacity-100"
              animate={{ 
                boxShadow: ['0 0 10px rgba(204, 255, 0, 0.3)', '0 0 20px rgba(204, 255, 0, 0.5)', '0 0 10px rgba(204, 255, 0, 0.3)']
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            
            {/* Particles effect */}
            <motion.div 
              className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-lime via-teal to-cyan-400 opacity-0 blur-md group-hover:opacity-70"
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                opacity: [0, 0.7, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            <Github className="mr-3 text-lime relative z-10" size={24} />
            
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-white via-lime to-teal group-hover:from-lime group-hover:via-teal group-hover:to-cyan-400 transition-all duration-500">
              Dive into My Code Universe
            </span>
            
            {/* Animated underline */}
            <motion.div 
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-lime via-teal to-cyan-400"
              initial={{ width: 0 }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.4 }}
            />
            
            {/* Moving star/sparkle effect */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 blur-md -rotate-45"
              initial={{ left: '-30%' }}
              whileHover={{ 
                left: '130%',
                transition: { duration: 1.2, repeat: Infinity, repeatDelay: 0.5 }
              }}
            />
          </motion.a>
        </motion.div>

        {/* Project Details Modal */}
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-inkyblack/95 backdrop-blur-xl flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              className="relative bg-gradient-to-b from-charcoal/95 to-inkyblack/95 border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl"
              initial={{ scale: 0.8, opacity: 0, rotateX: 10 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateX: 10 }}
              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-80">
                <motion.img 
                  src={selectedProject.image} 
                  alt={selectedProject.title} 
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inkyblack via-inkyblack/60 to-transparent" />
                
                <div className="absolute bottom-0 left-0 w-full p-8">
                  <motion.h3 
                    className="text-4xl font-bold text-white mb-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {selectedProject.title}
                  </motion.h3>
                  <motion.div 
                    className="flex flex-wrap gap-3"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {selectedProject.technologies.map((tech, techIndex) => (
                      <motion.span
                        key={techIndex}
                        className="px-4 py-1.5 bg-inkyblack/70 backdrop-blur-sm rounded-full text-sm font-medium text-lime border border-lime/30"
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(204, 255, 0, 0.2)' }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>

                <motion.button 
                  className="absolute top-4 right-4 w-10 h-10 bg-inkyblack/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-lime hover:text-inkyblack transition-all duration-300"
                  onClick={() => setSelectedProject(null)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                >
                  ✕
                </motion.button>
              </div>

              <motion.div 
                className="p-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  {selectedProject.longDescription || selectedProject.description}
                </p>

                <div className="flex flex-wrap gap-4">
                  {selectedProject.githubUrl && (
                    <motion.a 
                      href={selectedProject.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-inkyblack/80 hover:bg-inkyblack text-white rounded-xl flex items-center font-semibold transition-all duration-300"
                      whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)' }}
                    >
                      <Github size={20} className="mr-2" />
                      Source Code
                    </motion.a>
                  )}
                  {selectedProject.liveUrl && (
                    <motion.a 
                      href={selectedProject.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-gradient-to-r from-lime to-teal text-inkyblack rounded-xl flex items-center font-semibold transition-all duration-300"
                      whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(204, 255, 0, 0.3)' }}
                    >
                      <ExternalLink size={20} className="mr-2" />
                      Live Preview
                    </motion.a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
