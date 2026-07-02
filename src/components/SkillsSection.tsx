import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Zap, Server, Globe, Database, Brain, Wrench } from 'lucide-react';

interface SkillCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    label: 'Languages',
    icon: <Zap className="w-4 h-4" />,
    color: 'from-gold to-orange',
    skills: ['JavaScript', 'TypeScript', 'C++', 'Python', 'SQL', 'HTML5', 'CSS3'],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    icon: <Globe className="w-4 h-4" />,
    color: 'from-teal to-lime',
    skills: ['React.js', 'Next.js', 'Tailwind CSS', 'Zustand', 'Framer Motion', 'Bootstrap'],
  },
  {
    id: 'backend',
    label: 'Backend',
    icon: <Server className="w-4 h-4" />,
    color: 'from-purple to-teal',
    skills: ['Node.js', 'Express.js', 'NestJS', 'REST APIs', 'JWT Auth', 'Swagger', 'TypeORM', 'Prisma', 'Nx Monorepo'],
  },
  {
    id: 'databases',
    label: 'Databases',
    icon: <Database className="w-4 h-4" />,
    color: 'from-lime to-teal',
    skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'SQLite', 'pgvector', 'Firebase', 'Supabase'],
  },
  {
    id: 'ai',
    label: 'AI Engineering',
    icon: <Brain className="w-4 h-4" />,
    color: 'from-orange to-gold',
    skills: ['RAG', 'OpenRouter', 'Gemini API', 'Groq API', 'Llama Models', 'Prompt Engineering', 'Vector Embeddings', 'Semantic Search', 'PDF Processing'],
  },
  {
    id: 'devops',
    label: 'DevOps & Tools',
    icon: <Wrench className="w-4 h-4" />,
    color: 'from-teal to-purple',
    skills: ['Docker', 'Docker Compose', 'Git', 'GitHub', 'Postman', 'Vercel', 'VS Code', 'Cursor', 'Claude Code', 'Antigravity'],
  },
];

const SkillsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [activeCategory, setActiveCategory] = useState<string>('backend');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const skillVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const activeSkillCategory = skillCategories.find((c) => c.id === activeCategory)!;

  return (
    <section id="skills" ref={ref} className="py-20 relative overflow-hidden bg-gradient-to-b from-charcoal/80 to-inkyblack/80">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.05),transparent_70%)] -z-10" />

      {/* Subtle animated blobs */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-lime/5"
            style={{
              width: Math.random() * 80 + 40,
              height: Math.random() * 80 + 40,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 60 - 30, 0],
              y: [0, Math.random() * 60 - 30, 0],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <motion.div
        className="section-container"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {/* Section Header */}
        <motion.div variants={skillVariants} className="mb-12">
          <div className="flex items-center space-x-2 text-primary mb-4 font-mono">
            <Zap className="w-5 h-5" />
            <span>~/skills</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Technical</span>{' '}
            <span className="text-primary opacity-80">Arsenal</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl">
            A curated toolkit spanning languages, frameworks, databases, AI engineering, and DevOps — built from real production experience.
          </p>
        </motion.div>

        {/* Category Tab Buttons */}
        <motion.div
          className="flex flex-wrap gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {skillCategories.map((category) => (
            <motion.button
              key={category.id}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium font-mono transition-all duration-300 interactive border ${
                activeCategory === category.id
                  ? 'bg-primary/10 text-primary border-primary/50'
                  : 'bg-charcoal/40 text-white/60 hover:bg-charcoal/70 border-white/10 hover:border-white/20'
              }`}
              onClick={() => setActiveCategory(category.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {category.icon}
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills Tag Cloud */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="mb-12"
          >
            {/* Category Header */}
            <div className={`flex items-center gap-3 mb-6 p-4 rounded-xl bg-gradient-to-r ${activeSkillCategory.color} bg-opacity-10 border border-white/5`}>
              <div className={`p-2.5 rounded-lg bg-gradient-to-r ${activeSkillCategory.color} text-black`}>
                {activeSkillCategory.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{activeSkillCategory.label}</h3>
                <p className="text-xs text-muted-foreground font-mono">{activeSkillCategory.skills.length} technologies</p>
              </div>
            </div>

            {/* Skill Tags */}
            <div className="flex flex-wrap gap-3">
              {activeSkillCategory.skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  className="relative group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <motion.span
                    className="inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-mono font-medium bg-charcoal/50 border border-white/10 text-gray-200 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-default select-none"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mr-2" />
                    {skill}
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* All Categories Overview Grid */}
        <motion.div variants={skillVariants} className="mt-8">
          <h3 className="text-lg font-mono text-muted-foreground mb-6 text-center">
            <span className="text-primary/60">$ </span>cat skills.json
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {skillCategories.map((cat) => (
              <motion.div
                key={cat.id}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 hover-lift gradient-border ${
                  activeCategory === cat.id
                    ? 'bg-primary/10 border-primary/40'
                    : 'bg-charcoal/20 border-white/5 hover:border-white/15'
                }`}
                onClick={() => setActiveCategory(cat.id)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className={`p-2 rounded-md bg-gradient-to-r ${cat.color} text-black w-fit mb-3`}>
                  {cat.icon}
                </div>
                <p className="text-xs font-mono font-semibold text-white mb-1">{cat.label}</p>
                <p className="text-xs text-muted-foreground">{cat.skills.length} skills</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SkillsSection;
