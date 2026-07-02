import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Terminal, Star, ChevronDown, ChevronUp, Layers, Zap } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  flagship?: boolean;
  status: 'live' | 'in-progress';
  overview: string;
  problem: string;
  solution: string;
  highlights: string[];
  tech: string[];
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  architecture?: string;
}

const projects: Project[] = [
  {
    id: 'flyeng-career',
    title: 'Flyeng Career',
    flagship: true,
    status: 'live',
    overview: 'AI-powered career development platform helping aspiring software engineers prepare for placements through personalized roadmaps, portfolio building, interview preparation, resume enhancement, and AI-assisted career guidance.',
    problem: 'Students lack a unified platform that combines AI-driven career guidance, portfolio building, and interview preparation in one experience.',
    solution: 'Built a comprehensive platform with AI/LLM integration, structured learning paths, resume optimization, and progress tracking — all within a production-grade Next.js + PostgreSQL architecture.',
    highlights: ['AI Career Guidance', 'Portfolio Builder', 'Resume Optimization', 'Learning Roadmaps', 'Interview Preparation', 'Progress Tracking'],
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'AI/LLM'],
    image: '/FlyEng.png',
    githubUrl: 'https://github.com/nikhiljangid120',
    liveUrl: 'http://flyeng-career.vercel.app/',
    architecture: 'Next.js App Router with server components, PostgreSQL database via Prisma ORM, AI integration through OpenRouter API',
  },
  {
    id: 'hotel-booking',
    title: 'Hotel Booking Management System',
    status: 'in-progress',
    overview: 'Enterprise-style booking backend built using NestJS with transactional workflows, concurrency-safe reservations, availability management, JWT authentication, and PostgreSQL.',
    problem: 'Race conditions and double-booking in concurrent reservation scenarios require database-level locking and transactional integrity.',
    solution: 'Implemented pessimistic locking with TypeORM transactions, JWT-secured endpoints, availability engine with scheduled jobs, and Docker Compose for deployment.',
    highlights: ['Booking Lifecycle', 'Availability Engine', 'Swagger Documentation', 'DTO Validation', 'Dockerized Deployment', 'Pessimistic Locking', 'Scheduled Jobs'],
    tech: ['NestJS', 'PostgreSQL', 'TypeORM', 'Docker', 'JWT', 'Swagger', 'Nx Monorepo'],
    githubUrl: 'https://github.com/nikhiljangid120',
    architecture: 'Modular NestJS architecture within Nx monorepo, PostgreSQL with TypeORM pessimistic locking, Docker Compose orchestration',
  },
  {
    id: 'doc-intelligence',
    title: 'AI Document Intelligence Platform',
    status: 'in-progress',
    overview: 'Intelligent document processing platform capable of ingesting PDFs, generating vector embeddings, performing semantic search, and answering questions using Retrieval-Augmented Generation (RAG).',
    problem: 'Large document collections are difficult to query efficiently — keyword search misses semantic meaning and context.',
    solution: 'Built a full RAG pipeline: PDF ingestion → text chunking → MiniLM vector embeddings stored in pgvector → semantic retrieval → Llama-based response generation via OpenRouter with source attribution.',
    highlights: ['PDF Upload & Chunking', 'pgvector Storage', 'MiniLM Embeddings', 'Semantic Search', 'OpenRouter + Llama', 'Source Attribution'],
    tech: ['NestJS', 'PostgreSQL', 'pgvector', 'MiniLM', 'OpenRouter', 'Llama', 'TypeScript'],
    githubUrl: 'https://github.com/nikhiljangid120',
    architecture: 'NestJS backend with pgvector extension for PostgreSQL, sentence-transformers/MiniLM for embedding generation, OpenRouter for LLM inference',
  },
  {
    id: 'ai-resume',
    title: 'AI Resume Builder',
    status: 'live',
    overview: 'AI-powered resume builder with ATS optimization, real-time suggestions, and professional formatting using Gemini API.',
    problem: 'Job seekers struggle to format ATS-friendly resumes that pass automated screening systems.',
    solution: 'Integrated Gemini API for context-aware resume suggestions, ATS score analysis, and content optimization with live preview.',
    highlights: ['ATS Optimization', 'Gemini API Integration', 'Live Preview', 'Multiple Templates', 'PDF Export'],
    tech: ['Next.js', 'TypeScript', 'Gemini API', 'Tailwind CSS'],
    image: '/Resume.jpeg',
    githubUrl: 'https://github.com/nikhiljangid120/AI-Resume-Builder',
    liveUrl: 'https://ai-resume-builder-epbj.vercel.app/',
    architecture: 'Next.js with server actions, Gemini 1.5 Flash for AI suggestions, client-side PDF generation',
  },
  {
    id: 'ai-code-analyzer',
    title: 'AI Code Analyzer',
    status: 'live',
    overview: 'LLM-based code analysis and visualization tool providing code quality metrics, complexity analysis, and optimization suggestions.',
    problem: 'Developers need quick, actionable feedback on code quality without setting up heavyweight analysis tools.',
    solution: 'Built a browser-based analyzer using Groq API with Llama for fast inference, D3.js for complexity visualization, and structured output parsing.',
    highlights: ['Code Quality Metrics', 'Complexity Visualization', 'Groq API', 'D3.js Charts', 'Multi-Language Support'],
    tech: ['Next.js', 'TypeScript', 'Groq API', 'D3.js'],
    image: '/Analyzer.png',
    githubUrl: 'https://github.com/nikhiljangid120/Code-Analyzer',
    liveUrl: 'https://code-analyzer-f7bq.vercel.app/',
    architecture: 'Next.js frontend with Groq API for ultra-fast LLM inference, D3.js for interactive visualizations',
  },
  {
    id: 'ai-fitness',
    title: 'AI Fitness Platform',
    status: 'live',
    overview: 'AI-powered fitness and nutrition planning platform with personalized workout plans, nutrition tracking, and health recommendations.',
    problem: 'Generic fitness apps don\'t adapt to individual body composition, goals, or dietary preferences.',
    solution: 'Integrated Firebase for real-time data sync, Gemini API for personalized plan generation, and comprehensive progress tracking dashboards.',
    highlights: ['Personalized Workout Plans', 'Nutrition Tracking', 'AI Recommendations', 'Progress Dashboard', 'Firebase Sync'],
    tech: ['Next.js', 'React', 'Firebase', 'Gemini API', 'Tailwind CSS'],
    image: '/Fitness.png',
    githubUrl: 'https://github.com/nikhiljangid120/Fitness-Platform',
    liveUrl: 'https://fitness-platform-zeta.vercel.app/',
    architecture: 'Next.js with Firebase Realtime Database, Gemini API for AI recommendations, responsive dashboard UI',
  },
];

const SkillBadge = ({ tech }: { tech: string }) => (
  <span className="px-2.5 py-1 text-xs font-mono bg-primary/10 text-primary border border-primary/20 rounded-md">
    {tech}
  </span>
);

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: index * 0.08 }}
      className={`relative rounded-2xl border overflow-hidden hover-lift gradient-border card-glow transition-all duration-300 ${
        project.flagship
          ? 'border-primary/40 bg-gradient-to-br from-primary/5 via-charcoal/50 to-teal/5'
          : 'border-white/10 bg-charcoal/30'
      }`}
    >
      {/* Project Image */}
      {project.image && (
        <div className="relative h-48 overflow-hidden border-b border-white/5">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
          <div className="absolute bottom-3 left-4 flex gap-2">
            {project.flagship && (
              <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-primary/80 text-black rounded font-semibold">
                <Star size={10} />
                FLAGSHIP
              </span>
            )}
            <span className={`px-2 py-0.5 text-xs font-mono rounded font-semibold ${
              project.status === 'live'
                ? 'bg-green-500/80 text-black'
                : 'bg-purple-500/60 text-white animate-pulse'
            }`}>
              {project.status === 'live' ? 'LIVE' : 'IN PROGRESS'}
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {!project.image && (
              <div className="flex gap-2 mb-2">
                {project.flagship && (
                  <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-primary/20 text-primary border border-primary/30 rounded font-semibold">
                    <Star size={10} />
                    FLAGSHIP
                  </span>
                )}
                <span className={`px-2 py-0.5 text-xs font-mono rounded font-semibold border ${
                  project.status === 'live'
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                }`}>
                  {project.status === 'live' ? '● LIVE' : '◎ IN PROGRESS'}
                </span>
              </div>
            )}
            <h3 className="text-xl font-bold text-white hover:text-primary transition-colors">
              {project.title}
            </h3>
          </div>
          <div className="flex gap-2 ml-4 shrink-0">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors">
                <ExternalLink size={15} />
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <Github size={15} />
              </a>
            )}
          </div>
        </div>

        {/* Overview */}
        <p className="text-gray-400 text-sm mb-4 leading-relaxed">{project.overview}</p>

        {/* Highlights */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.highlights.map((h) => (
            <span key={h} className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              {h}
            </span>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((t) => <SkillBadge key={t} tech={t} />)}
        </div>

        {/* Expand Toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Less details' : 'Architecture & Details'}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                <div>
                  <p className="text-xs font-mono text-primary/70 mb-1">// Problem</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{project.problem}</p>
                </div>
                <div>
                  <p className="text-xs font-mono text-primary/70 mb-1">// Solution</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{project.solution}</p>
                </div>
                {project.architecture && (
                  <div>
                    <p className="text-xs font-mono text-primary/70 mb-1">// Architecture</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{project.architecture}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const flagship = projects.find((p) => p.flagship)!;
  const rest = projects.filter((p) => !p.flagship);

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
            <span className="text-foreground">Deployed</span>{' '}
            <span className="text-primary opacity-80">Solutions</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl">
            Production systems, AI-powered platforms, and backend engineering — each built to solve real problems.
          </p>
        </motion.div>

        {/* Flagship Project */}
        <div className="mb-12">
          <h3 className="text-sm font-mono text-primary/60 mb-4 flex items-center gap-2">
            <Star size={14} />
            flagship_project.json
          </h3>
          <ProjectCard project={flagship} index={0} />
        </div>

        {/* Other Projects Grid */}
        <div>
          <h3 className="text-sm font-mono text-muted-foreground mb-4 flex items-center gap-2">
            <Layers size={14} />
            production_builds.json
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((project, idx) => (
              <ProjectCard key={project.id} project={project} index={idx + 1} />
            ))}
          </div>
        </div>

        {/* GitHub CTA */}
        <div className="mt-16 text-center">
          <motion.a
            href="https://github.com/nikhiljangid120"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border bg-card rounded-lg hover:bg-muted transition-colors font-mono text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <Github size={18} />
            view_all_repositories_on_github()
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
