
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Github, Code } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

const ProjectsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  
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
      featured: true
    },
    {
      title: "Task Management Dashboard",
      description: "A responsive task management application with drag-and-drop interface, user roles, and real-time updates.",
      image: "https://dummyimage.com/600x400/345/fff&text=Task+Dashboard",
      technologies: ["React", "Redux", "Node.js", "Socket.IO", "MongoDB"],
      githubUrl: "https://github.com",
      featured: true
    },
    {
      title: "Algorithmic Visualizer",
      description: "An interactive tool to visualize sorting algorithms, pathfinding algorithms, and data structures in real-time.",
      image: "https://dummyimage.com/600x400/456/fff&text=Algorithm+Visualizer",
      technologies: ["HTML", "CSS", "JavaScript", "Data Structures", "Algorithms"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      featured: true
    },
    {
      title: "Weather Forecast App",
      description: "A weather application providing current conditions and 5-day forecasts using geolocation and weather APIs.",
      image: "https://dummyimage.com/600x400/567/fff&text=Weather+App",
      technologies: ["React", "OpenWeather API", "Geolocation API", "CSS3"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      featured: false
    }
  ];
  
  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);
  
  return (
    <section id="projects" ref={ref} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-inkyblack/90 to-charcoal/90 -z-10" />
      
      <motion.div 
        className="section-container"
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
        
        <div className="space-y-20">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={index}
              variants={projectVariants}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12`}
            >
              <div className="lg:w-1/2">
                <div className="relative group overflow-hidden rounded-xl">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inkyblack/90 to-inkyblack/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex space-x-4">
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-3 bg-charcoal/80 rounded-full text-white hover:text-lime transition-colors duration-300"
                        >
                          <Github size={24} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-3 bg-charcoal/80 rounded-full text-white hover:text-lime transition-colors duration-300"
                        >
                          <ExternalLink size={24} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 flex flex-col justify-center">
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
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-lime transition-colors duration-300 flex items-center"
                    >
                      <Github size={18} className="mr-2" /> View Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-lime transition-colors duration-300 flex items-center"
                    >
                      <ExternalLink size={18} className="mr-2" /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {otherProjects.length > 0 && (
          <motion.div variants={projectVariants} className="mt-24">
            <h3 className="text-2xl font-bold text-center mb-12">Other Notable Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {otherProjects.map((project, index) => (
                <motion.div
                  key={index}
                  className="card-3d p-6 bg-charcoal/50"
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-bold text-gold">{project.title}</h4>
                    <div className="flex space-x-3">
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-lime transition-colors duration-300"
                        >
                          <Github size={20} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-lime transition-colors duration-300"
                        >
                          <ExternalLink size={20} />
                        </a>
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
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        <motion.div 
          variants={projectVariants}
          className="mt-16 text-center"
        >
          <a 
            href="https://github.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-charcoal/70 text-white font-medium rounded-md border border-white/10 hover:border-lime/40 transition-all duration-300"
          >
            <Code size={18} />
            <span>View More on GitHub</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProjectsSection;
