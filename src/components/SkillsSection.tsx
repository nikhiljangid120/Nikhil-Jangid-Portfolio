import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, Server, Globe, Database, Brain, Wrench, Sparkles } from 'lucide-react';

interface SkillCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  tileClass: string;
  span: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    id: 'backend',
    label: 'Backend',
    icon: <Server className="w-4 h-4" />,
    tileClass: 'bg-primary/10 text-primary',
    span: 'lg:col-span-2',
    skills: ['Node.js', 'Express.js', 'NestJS', 'REST APIs', 'JWT Auth', 'Swagger', 'TypeORM', 'Prisma', 'Nx Monorepo'],
  },
  {
    id: 'languages',
    label: 'Languages',
    icon: <Zap className="w-4 h-4" />,
    tileClass: 'bg-primary/10 text-primary',
    span: '',
    skills: ['JavaScript', 'TypeScript', 'C++', 'Python', 'SQL', 'HTML5', 'CSS3'],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    icon: <Globe className="w-4 h-4" />,
    tileClass: 'bg-secondary/10 text-secondary',
    span: '',
    skills: ['React.js', 'Next.js', 'Tailwind CSS', 'Zustand', 'Framer Motion', 'Bootstrap'],
  },
  {
    id: 'ai',
    label: 'AI Engineering',
    icon: <Brain className="w-4 h-4" />,
    tileClass: 'bg-secondary/10 text-secondary',
    span: 'lg:col-span-2',
    skills: ['RAG', 'LangChain', 'MCP', 'OpenRouter', 'Gemini API', 'Groq API', 'Llama Models', 'Prompt Engineering', 'Vector Embeddings', 'Semantic Search', 'LLM Orchestration', 'PDF Processing'],
  },
  {
    id: 'databases',
    label: 'Databases',
    icon: <Database className="w-4 h-4" />,
    tileClass: 'bg-accent/10 text-accent',
    span: '',
    skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'SQLite', 'pgvector', 'Firebase', 'Supabase'],
  },
  {
    id: 'devops',
    label: 'DevOps & Tools',
    icon: <Wrench className="w-4 h-4" />,
    tileClass: 'bg-accent/10 text-accent',
    span: '',
    skills: ['Docker', 'Docker Compose', 'Git', 'GitHub', 'Postman', 'Vercel', 'VS Code', 'Cursor'],
  },
];

const exploringSkills = ['Claude Code', 'Antigravity', 'AI Agents'];

const skillVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const SkillCard = ({ category, index }: { category: SkillCategory; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: -400, y: -400 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setSpot({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setSpot({ x: -400, y: -400 })}
      className={`relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 transition-colors duration-300 hover:border-primary/25 ${category.span}`}
      variants={skillVariants}
      whileHover={{ y: -3 }}
      transition={{ delay: index * 0.06 }}
    >
      <span
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: spot.x < 0 ? 0 : 1,
          background: `radial-gradient(240px circle at ${spot.x}px ${spot.y}px, rgba(38,235,218,0.07), transparent 70%)`,
        }}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${category.tileClass}`}>{category.icon}</div>
            <h3 className="text-base font-semibold text-white">{category.label}</h3>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground/70">
            {category.skills.length} tech
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {category.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-md bg-background/60 border border-border/60 text-gray-300 hover:border-primary/40 hover:text-primary transition-colors duration-200 cursor-default select-none"
            >
              <span className="w-1 h-1 rounded-full bg-primary/60" />
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const SkillsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  return (
    <section id="skills" ref={ref} className="py-20 relative overflow-hidden bg-background">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <motion.div
        className="section-container"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {/* Section Header */}
        <motion.div variants={skillVariants} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-primary/60" />
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-primary">Skills</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Technical</span>{' '}
            <span className="text-primary opacity-80">Arsenal</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl">
            A curated toolkit spanning languages, frameworks, databases, AI engineering, and DevOps —
            built from real production experience.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillCategories.map((category, index) => (
            <SkillCard key={category.id} category={category} index={index} />
          ))}

          {/* Always Exploring tile */}
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-dashed border-secondary/30 bg-card/20 p-6 transition-colors duration-300 hover:border-secondary/50"
            variants={skillVariants}
            whileHover={{ y: -3 }}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-secondary/10 text-secondary">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-semibold text-white">Always Exploring</h3>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground/70">next up</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {exploringSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-md bg-background/40 border border-secondary/20 text-gray-300 hover:border-secondary/50 hover:text-secondary transition-colors duration-200 cursor-default select-none"
                  >
                    <span className="w-1 h-1 rounded-full bg-secondary/60" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default SkillsSection;
