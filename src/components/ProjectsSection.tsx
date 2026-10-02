import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Star, ChevronDown, ChevronUp, Layers, Zap, Filter, ArrowUpRight } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  flagship?: boolean;
  status: 'live' | 'in-progress';
  category: 'AI' | 'Backend' | 'Full-Stack';
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

type StatusFilter = 'all' | 'live' | 'in-progress';
type CategoryFilter = 'All' | 'AI' | 'Backend' | 'Full-Stack';

const projects: Project[] = [
  {
    id: 'flyeng-career',
    title: 'Flyeng Career',
    flagship: true,
    status: 'live',
    category: 'Full-Stack',
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
    id: 'rag-chatbot',
    title: 'RAG Chatbot — Document Q&A System',
    status: 'live',
    category: 'AI',
    overview: 'Production RAG pipeline for querying PDF documents: SHA-256 deduplicated ingestion, sliding-window chunking, 384-dim MiniLM embeddings, top-5 pgvector similarity search, and grounded answers generated through OpenRouter/Llama 3.3 — deployed on Render.',
    problem: 'Large document collections are difficult to query efficiently — keyword search misses semantic meaning, and LLM answers need grounded sources to be trustworthy.',
    solution: 'Built an end-to-end RAG document Q&A system: PDF ingestion with SHA-256 deduplication → sliding-window chunking → 384-dim MiniLM embeddings stored in pgvector → top-5 semantic retrieval → grounded Llama 3.3 responses with source attribution via OpenRouter.',
    highlights: ['SHA-256 Deduplication', 'Sliding-Window Chunking', '384-dim MiniLM Embeddings', 'Top-5 pgvector Search', 'OpenRouter + Llama 3.3', 'Dockerized & Deployed on Render'],
    tech: ['NestJS', 'React', 'PostgreSQL', 'pgvector', 'MiniLM', 'OpenRouter', 'Docker'],
    image: '/RAG-Chatbot.png',
    githubUrl: 'https://github.com/nikhiljangid120',
    liveUrl: 'https://nikhil-rag-chatbot.onrender.com/',
    architecture: 'Containerized full-stack app on Render with managed PostgreSQL: NestJS ingestion service (SHA-256 dedup, chunking, MiniLM embeddings), pgvector-backed retrieval with top-5 similarity search, OpenRouter/Llama 3.3 generation with source attribution',
  },
  {
    id: 'ai-resume',
    title: 'AI Resume Builder',
    status: 'live',
    category: 'AI',
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
    category: 'AI',
    overview: 'AI coding assistant that detects time/space complexity and suggests refactoring using the Groq API — first prize winner at a college-level hackathon.',
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
    category: 'AI',
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
  <span className="px-2.5 py-1 text-xs font-mono bg-muted/30 text-muted-foreground border border-border/70 rounded-md">
    {tech}
  </span>
);

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: -400, y: -400 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpot({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={() => setSpot({ x: -400, y: -400 })}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: index * 0.08 }}
      className={`group relative rounded-xl border overflow-hidden transition-all duration-300 ${
        project.flagship
          ? 'border-primary/25 bg-card/60 hover:border-primary/40 hover:shadow-[0_0_50px_rgba(38,235,218,0.09)]'
          : 'border-border/70 bg-card/40 hover:border-primary/30 hover:shadow-[0_0_40px_rgba(38,235,218,0.06)]'
      }`}
    >
      <span
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: spot.x < 0 ? 0 : 1,
          background: `radial-gradient(260px circle at ${spot.x}px ${spot.y}px, rgba(38,235,218,0.08), transparent 70%)`,
        }}
      />
      {/* Project Image */}
      {project.image && (
        <div className="relative h-48 overflow-hidden border-b border-white/5">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
          <div className="absolute bottom-3 left-4 flex gap-2">
            {project.flagship && (
              <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-primary/80 text-black rounded font-semibold">
                <Star size={10} />
                FLAGSHIP
              </span>
            )}
            <span className="px-2 py-0.5 text-xs font-mono bg-black/60 backdrop-blur-sm text-white/80 rounded border border-white/10">
              {project.category}
            </span>
            <span className={`px-2 py-0.5 text-xs font-mono rounded font-semibold ${
              project.status === 'live'
                ? 'bg-green-500/80 text-black'
                : 'bg-amber-500/60 text-black animate-pulse'
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
                <span className="px-2 py-0.5 text-xs font-mono bg-white/5 text-white/70 border border-white/10 rounded">
                  {project.category}
                </span>
                <span className={`px-2 py-0.5 text-xs font-mono rounded font-semibold border ${
                  project.status === 'live'
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                  {project.status === 'live' ? '● LIVE' : '◎ IN PROGRESS'}
                </span>
              </div>
            )}
            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors flex items-center gap-1.5">
              {project.title}
              <ArrowUpRight
                size={16}
                className="text-primary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
              />
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

const categoryFilters: CategoryFilter[] = ['All', 'AI', 'Backend', 'Full-Stack'];
const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'live', label: '● Live' },
  { value: 'in-progress', label: '◎ Building' },
];

const FilterPill = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all duration-200 ${
      active
        ? 'bg-primary/10 text-primary border-primary/35'
        : 'bg-card/40 text-muted-foreground border-border hover:text-foreground hover:border-border/80'
    }`}
  >
    {children}
  </button>
);

const ProjectsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filtered = projects.filter(
    (p) =>
      (categoryFilter === 'All' || p.category === categoryFilter) &&
      (statusFilter === 'all' || p.status === statusFilter)
  );
  const flagshipVisible = filtered.some((p) => p.flagship);
  const gridProjects = filtered.filter((p) => !p.flagship);
  const isFiltering = categoryFilter !== 'All' || statusFilter !== 'all';

  return (
    <section id="projects" ref={ref} className="py-20 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <div className="section-container relative z-10">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-primary/60" />
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-primary">Projects</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Deployed</span>{' '}
            <span className="text-primary opacity-80">Solutions</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl">
            Production systems, AI-powered platforms, and backend engineering — each built to solve real problems.
          </p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          className="flex flex-wrap items-center gap-3 mb-10 p-3 md:p-4 bg-card/40 border border-border rounded-xl backdrop-blur-sm"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <span className="flex items-center gap-1.5 text-xs font-mono text-primary/70">
            <Filter size={12} />
            Filter
          </span>
          <div className="flex flex-wrap gap-2">
            {categoryFilters.map((c) => (
              <FilterPill key={c} active={categoryFilter === c} onClick={() => setCategoryFilter(c)}>
                {c}
              </FilterPill>
            ))}
          </div>
          <div className="hidden sm:block h-5 w-px bg-border mx-1" />
          <div className="flex flex-wrap gap-2">
            {statusFilters.map(({ value, label }) => (
              <FilterPill key={value} active={statusFilter === value} onClick={() => setStatusFilter(value)}>
                {label}
              </FilterPill>
            ))}
          </div>
          <span className="ml-auto text-xs font-mono text-muted-foreground/70">
            {filtered.length}/{projects.length} projects
          </span>
        </motion.div>

        {/* Flagship Project */}
        {flagshipVisible && (
          <div className="mb-12">
            <h3 className="text-sm font-mono text-primary/60 mb-4 flex items-center gap-2">
              <Star size={14} />
              flagship_project.json
            </h3>
            <ProjectCard project={projects.find((p) => p.flagship)!} index={0} />
          </div>
        )}

        {/* Other Projects Grid */}
        {gridProjects.length > 0 && (
          <div>
            <h3 className="text-sm font-mono text-muted-foreground mb-4 flex items-center gap-2">
              <Layers size={14} />
              production_builds.json
            </h3>
            <div
              key={`${categoryFilter}-${statusFilter}`}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {gridProjects.map((project, idx) => (
                <ProjectCard key={project.id} project={project} index={idx + 1} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filtered.length === 0 && (
          <motion.div
            className="p-10 border border-dashed border-white/10 rounded-xl text-center font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-muted-foreground text-sm">No projects match this filter combination.</p>
            <p className="text-muted-foreground/60 text-xs mt-2">Try a different category or status.</p>
          </motion.div>
        )}

        {isFiltering && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setCategoryFilter('All');
                setStatusFilter('all');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
            >
              <Zap size={12} />
              Reset filters
            </button>
          </div>
        )}

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
            View all repositories on GitHub
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
