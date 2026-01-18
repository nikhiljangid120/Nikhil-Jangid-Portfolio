import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Github, Code, Plus, Link, Brain, Lightbulb, BookOpen, Terminal } from 'lucide-react';

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
  status: 'live' | 'in-progress';
}

// Project data - 3 Live AI Projects + Small Projects
const projects: Project[] = [
  // Live AI Projects (Featured)
  {
    id: "ai-resume-builder",
    title: "AI Resume Builder",
    description: "AI-powered resume builder with ATS optimization.",
    longDescription: "An intelligent resume builder leveraging Gemini API for ATS-focused resume optimization, real-time suggestions, and professional formatting.",
    image: "/Resume.jpeg",
    technologies: ["Next.js", "Gemini API", "Tailwind CSS", "TypeScript"],
    category: 'ai',
    githubUrl: "https://github.com/nikhiljangid120/AI-Resume-Builder",
    liveUrl: "https://ai-resume-builder-epbj.vercel.app/",
    featured: true,
    status: 'live'
  },
  {
    id: "ai-fitness-platform",
    title: "AI Fitness Platform",
    description: "AI-powered fitness & nutrition planning.",
    longDescription: "A comprehensive fitness platform with AI-driven workout plans, nutrition tracking, and personalized health recommendations.",
    image: "/Fitness.png",
    technologies: ["Next.js", "React", "Firebase", "Gemini API"],
    category: 'ai',
    githubUrl: "https://github.com/nikhiljangid120/Fitness-Platform",
    liveUrl: "https://fitness-platform-zeta.vercel.app/",
    featured: true,
    status: 'live'
  },
  {
    id: "ai-code-analyzer",
    title: "AI Code Analyzer & Visualizer",
    description: "LLM-based code analysis and visualization tool.",
    longDescription: "An AI-powered tool for analyzing code quality, complexity metrics, and providing optimization suggestions with interactive visualizations.",
    image: "/Analyzer.png",
    technologies: ["Next.js", "Groq API", "D3.js", "TypeScript"],
    category: 'ai',
    githubUrl: "https://github.com/nikhiljangid120/Code-Analyzer",
    liveUrl: "https://code-analyzer-f7bq.vercel.app/",
    featured: true,
    status: 'live'
  },
  // Small Showpiece Projects (Non-Featured)
  {
    id: "social-media-app",
    title: "Social Media App",
    description: "Interest-based social networking platform.",
    image: "/Media.png",
    technologies: ["React", "Node.js", "MongoDB"],
    category: 'web',
    githubUrl: "https://github.com/nikhiljangid120/Social-Media-Platform",
    liveUrl: "https://nexicon.vercel.app/",
    featured: false,
    status: 'live'
  },
];

// Flyeng Career - Major Upcoming Project
const upcomingProject = {
  id: "flyeng-career",
  title: "Flyeng Career",
  description: "AI-powered career & portfolio platform helping students prepare for software engineering roles.",
  longDescription: "A comprehensive platform with AI career guidance, portfolio building, interview prep, and structured learning paths.",
  image: "/FlyEng.png",
  technologies: ["Next.js", "PostgreSQL", "AI/LLM", "Prisma"],
  features: ["AI Career Guidance", "Portfolio Builder", "Interview Prep", "Learning Paths"],
  githubUrl: "https://github.com/nikhiljangid120",
};

const ProjectsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const featuredProjects = projects.filter(project => project.featured);
  const filteredProjects = activeCategory === 'all'
    ? projects.filter(project => !project.featured)
    : projects.filter(project => !project.featured && project.category === activeCategory);

  const categories = [
    { id: 'all', name: 'All Modules', icon: Code },
    { id: 'web', name: 'Web', icon: Link },
    { id: 'ai', name: 'AI/ML', icon: Brain },
    { id: 'mobile', name: 'Mobile', icon: Plus },
    { id: 'tool', name: 'Tools', icon: Lightbulb },
  ];

  return (
    <section id="projects" ref={ref} className="py-20 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <div className="section-container relative z-10">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-2 text-primary mb-4 font-mono">
            <Terminal size={18} />
            <span>~/projects</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Deployed</span> <span className="text-primary opacity-80">Solutions</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            A repository of deployed applications, experiments, and system architectures.
          </p>
        </motion.div>

        {/* Featured Grid */}
        <div className="mb-20">
          <h3 className="text-xl font-mono text-secondary mb-6 flex items-center">
            <BookOpen className="mr-2" size={20} />
            featured_builds.json
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.map((project, idx) => (
              <a
                href={project.liveUrl || project.githubUrl}
                key={project.id}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative h-full"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.1 }}
                  className="tech-card h-full flex flex-col p-0"
                >
                  <div className="relative h-56 overflow-hidden border-b border-border">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] to-transparent opacity-60" />
                    <div className="absolute top-3 right-3 flex space-x-2">
                      {project.status === 'live' && (
                        <span className="px-2 py-0.5 text-xs font-mono bg-green-500/20 text-green-400 border border-green-500/30 rounded">
                          LIVE
                        </span>
                      )}
                      {project.status === 'in-progress' && (
                        <span className="px-2 py-0.5 text-xs font-mono bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-300 border border-purple-500/40 rounded animate-pulse">
                          🚀 COMING SOON
                        </span>
                      )}
                      <span className="px-2 py-0.5 text-xs font-mono bg-muted text-foreground border border-border rounded uppercase">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h4 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-muted-foreground mb-4 text-sm flex-1">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.technologies.slice(0, 4).map(tech => (
                        <span key={tech} className="tech-badge">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </a>
            ))}
          </div>
        </div>

        {/* Flyeng Career - Premium Upcoming Project Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h3 className="text-xl font-mono text-secondary mb-6 flex items-center">
            <Lightbulb className="mr-2" size={20} />
            upcoming_major_project
          </h3>

          <div className="relative p-8 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/10 via-card/50 to-orange-500/10 border-2 border-purple-500/30">
            {/* Animated glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-orange-500/5"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Coming Soon Badge */}
            <motion.div
              className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm font-bold text-white flex items-center gap-2 shadow-lg shadow-purple-500/30"
              animate={{ boxShadow: ['0 0 20px rgba(168,85,247,0.3)', '0 0 40px rgba(168,85,247,0.5)', '0 0 20px rgba(168,85,247,0.3)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.span
                className="w-2 h-2 bg-white rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              🚀 COMING SOON
            </motion.div>

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Image */}
              <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden border border-purple-500/20">
                <img
                  src={upcomingProject.image}
                  alt={upcomingProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h4 className="text-3xl font-bold text-foreground">
                  {upcomingProject.title}
                </h4>
                <p className="text-muted-foreground text-lg">
                  {upcomingProject.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {upcomingProject.technologies.map(tech => (
                    <span key={tech} className="px-3 py-1 text-sm bg-purple-500/20 text-purple-300 rounded-lg border border-purple-500/30">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  {upcomingProject.features.map((feature, i) => (
                    <motion.div
                      key={feature}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                      initial={{ opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.7 + i * 0.1 }}
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {feature}
                    </motion.div>
                  ))}
                </div>

                {/* GitHub Link */}
                <a
                  href={upcomingProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                >
                  <Github size={16} />
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* GitHub Stats / CTA */}
        <div className="mt-24 text-center">
          <a
            href="https://github.com/nikhiljangid120"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-border bg-card rounded hover:bg-muted transition-colors font-mono text-sm"
          >
            <Github className="mr-2" size={18} />
            view_full_repository_on_github()
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
