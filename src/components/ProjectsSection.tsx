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

// Project data (Same data, cleaned up for display)
const projects: Project[] = [
  {
    id: "nj-careers",
    title: "NJ Careers",
    description: "Career roadmaps & skill analysis platform.",
    longDescription: "A comprehensive platform offering structured career roadmaps, interactive skill assessments, and personalized learning paths for tech professionals.",
    image: "/Careers.png",
    technologies: ["React", "Node.js", "MongoDB", "ML"],
    category: 'featured',
    githubUrl: "https://github.com/nikhiljangid120",
    liveUrl: "https://example.com/njcareers",
    featured: true,
    status: 'in-progress'
  },
  {
    id: "resume-rocket",
    title: "ResumeRocket",
    description: "AI-powered resume builder & optimizer.",
    longDescription: "An intelligent resume builder that leverages NLP & APIs to analyze and optimize resumes with real-time feedback.",
    image: "/Resume.jpeg",
    technologies: ["Next.js", "OpenAI", "Firebase"],
    category: 'ai',
    githubUrl: "https://github.com/nikhiljangid120/AI-Resume-Builder",
    liveUrl: "https://ai-resume-builder-five-pi.vercel.app/",
    featured: true,
    status: 'live'
  },
  {
    id: "one-note",
    title: "OneNote",
    description: "LinkTree alternative with analytics.",
    image: "Tree.png",
    technologies: ["Next.js", "Supabase", "Analytics"],
    category: 'web',
    githubUrl: "https://github.com/nikhiljangid120",
    liveUrl: "https://example.com/onenote",
    featured: true,
    status: 'in-progress'
  },
  {
    id: "flex-forge",
    title: "FlexForge",
    description: "AI fitness & nutrition planner.",
    image: "Fitness.png",
    technologies: ["Next.js", "React", "Firebase"],
    category: 'ai',
    githubUrl: "https://github.com/nikhiljangid120/Fitness-Platform",
    liveUrl: "https://flex-forge.vercel.app/",
    featured: true,
    status: 'live'
  },
  {
    id: "nexicon",
    title: "Nexicon",
    description: "Interest-based social media platform.",
    image: "Media.png",
    technologies: ["React", "Node.js", "Socket.IO"],
    category: 'web',
    githubUrl: "https://github.com/nikhiljangid120/Social-Media-Platform",
    liveUrl: "https://nexicon.vercel.app/",
    featured: false,
    status: 'live'
  },
  {
    id: "ai-code-analyzer",
    title: "AI Code Analyzer",
    description: "Code quality & complexity analysis tool.",
    image: "Analyzer.png",
    technologies: ["Next.js", "GPT-4", "D3.js"],
    category: 'ai',
    githubUrl: "https://github.com/nikhiljangid120/Code-Analyzer",
    liveUrl: "https://code-analyzer-5v1c.onrender.com/Code-Analyzer",
    featured: false,
    status: 'live'
  },
  {
    id: "ai-website-builder",
    title: "AI Website Builder",
    description: "No-code AI website generator.",
    image: "Website.png",
    technologies: ["Next.js", "Gemini 2.0", "AWS"],
    category: 'ai',
    githubUrl: "https://github.com/nikhiljangid120",
    featured: false,
    status: 'in-progress'
  },
  {
    id: "flyeng-career",
    title: "Flyeng Career",
    description: "Compiler design & coding platform.",
    image: "FlyEng.png",
    technologies: ["Next.js", "PostgreSQL", "Docker"],
    category: 'web',
    githubUrl: "https://github.com/nikhiljangid120",
    liveUrl: "https://example.com/flyeng",
    featured: false,
    status: 'in-progress'
  },
  {
    id: "quiz-website",
    title: "Quiz Platform",
    description: "Real-time quiz & leaderboard system.",
    image: "/Quiz.png",
    technologies: ["React", "Firebase", "JS"],
    category: 'web',
    githubUrl: "https://github.com/nikhiljangid120",
    featured: false,
    status: 'in-progress'
  },
  {
    id: "hospital-management",
    title: "Hospital System",
    description: "Comprehensive HMS portal.",
    image: "/Hospital.png",
    technologies: ["Java", "JSP", "MySQL"],
    category: 'web',
    githubUrl: "https://github.com/nikhiljangid120",
    featured: false,
    status: 'in-progress'
  },
];

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

        {/* Archive / Library */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h3 className="text-xl font-mono text-muted-foreground">
              module_library
            </h3>

            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 text-sm font-mono rounded border transition-all ${activeCategory === cat.id
                      ? 'border-primary text-primary bg-primary/10'
                      : 'border-border text-muted-foreground hover:border-gray-500'
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: 0.2 + (idx * 0.05) }}
                className="tech-card p-5 group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-muted/50 rounded-lg">
                    <Code size={20} className="text-primary" />
                  </div>
                  <div className="flex space-x-2">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener" className="text-muted-foreground hover:text-white transition-colors">
                        <Github size={18} />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener" className="text-muted-foreground hover:text-white transition-colors">
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>

                <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map(tech => (
                    <span key={tech} className="text-xs text-muted-foreground font-mono">
                      #{tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

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
