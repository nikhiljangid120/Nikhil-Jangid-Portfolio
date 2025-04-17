
import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { BookOpen, Zap, Sparkles, Gauge, Award, Trophy } from 'lucide-react';

interface Skill {
  name: string;
  level: number;
  category: string;
  color: string;
  icon?: React.ReactNode;
}

const SkillsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [activeCategory, setActiveCategory] = useState<string>('languages');
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const skillVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const skills: Skill[] = [
    // Programming Languages
    { name: "C++", level: 90, category: "languages", color: "from-teal to-lime", icon: <Gauge /> },
    { name: "JavaScript", level: 85, category: "languages", color: "from-gold to-orange", icon: <Zap /> },
    { name: "Python", level: 75, category: "languages", color: "from-purple to-teal", icon: <BookOpen /> },
    { name: "HTML/CSS", level: 90, category: "languages", color: "from-orange to-gold", icon: <Sparkles /> },
    
    // Frontend
    { name: "React.js", level: 85, category: "frontend", color: "from-teal to-lime", icon: <Gauge /> },
    { name: "Tailwind CSS", level: 90, category: "frontend", color: "from-purple to-teal", icon: <Zap /> },
    { name: "UI/UX Design", level: 70, category: "frontend", color: "from-gold to-orange", icon: <Sparkles /> },
    { name: "Responsive Design", level: 85, category: "frontend", color: "from-orange to-gold", icon: <BookOpen /> },
    
    // Backend
    { name: "Node.js", level: 75, category: "backend", color: "from-lime to-teal", icon: <Gauge /> },
    { name: "Express.js", level: 80, category: "backend", color: "from-teal to-purple", icon: <Zap /> },
    { name: "RESTful APIs", level: 85, category: "backend", color: "from-gold to-orange", icon: <BookOpen /> },
    { name: "MongoDB", level: 65, category: "backend", color: "from-orange to-gold", icon: <Sparkles /> },
    
    // Tools & Others
    { name: "Git/GitHub", level: 85, category: "tools", color: "from-purple to-teal", icon: <Gauge /> },
    { name: "Data Structures", level: 90, category: "tools", color: "from-lime to-teal", icon: <Award /> },
    { name: "Algorithms", level: 85, category: "tools", color: "from-teal to-purple", icon: <Trophy /> },
    { name: "Linux", level: 70, category: "tools", color: "from-gold to-orange", icon: <BookOpen /> }
  ];
  
  const categories = [
    { id: "languages", label: "Programming Languages" },
    { id: "frontend", label: "Frontend" },
    { id: "backend", label: "Backend" },
    { id: "tools", label: "Tools & Others" }
  ];
  
  return (
    <section id="skills" ref={ref} className="py-20 relative overflow-hidden bg-gradient-to-b from-charcoal/80 to-inkyblack/80">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.1),transparent_70%)] -z-10" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-lime/5"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      <motion.div 
        className="section-container"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div variants={skillVariants} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Skills</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-lime to-teal mx-auto mb-8" />
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            My technical toolkit spans multiple domains, from low-level programming to modern web development frameworks.
          </p>
        </motion.div>
        
        {/* Category selection tabs */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 interactive ${
                activeCategory === category.id 
                  ? 'bg-lime text-inkyblack' 
                  : 'bg-charcoal/60 text-white/70 hover:bg-charcoal/80'
              }`}
              onClick={() => setActiveCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-cursor-text="Select"
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>
        
        {/* 3D Skill Universe */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {skills
              .filter(skill => skill.category === activeCategory)
              .map((skill, index) => (
                <motion.div 
                  key={index}
                  className="relative group perspective"
                  onHoverStart={() => setHoveredSkill(index)}
                  onHoverEnd={() => setHoveredSkill(null)}
                  initial={{ opacity: 0, rotateY: 25 }}
                  animate={{ 
                    opacity: 1, 
                    rotateY: hoveredSkill === index ? 0 : 15,
                    z: hoveredSkill === index ? 50 : 0,
                  }}
                  transition={{ 
                    duration: 0.4,
                    delay: index * 0.1
                  }}
                >
                  <motion.div
                    className="card-3d p-6 h-full bg-gradient-to-br from-charcoal/80 to-charcoal/60 backdrop-blur-sm border border-white/5 overflow-hidden interactive"
                    whileHover={{ scale: 1.05 }}
                    data-cursor-text={`${skill.level}%`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">{skill.name}</h3>
                      <motion.div 
                        className="p-2 rounded-full bg-gradient-to-r bg-inkyblack/50"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.8 }}
                      >
                        {skill.icon}
                      </motion.div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Proficiency</span>
                        <span className="text-sm text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="skill-bar-bg">
                        <motion.div 
                          className={`skill-bar-fill bg-gradient-to-r ${skill.color}`}
                          initial={{ width: "0%" }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ 
                            duration: 1.5, 
                            delay: 0.2 + index * 0.1,
                            ease: [0.215, 0.61, 0.355, 1]
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Glow effect on hover */}
                    <motion.div
                      className="absolute inset-0 -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: hoveredSkill === index ? 0.2 : 0,
                        background: `radial-gradient(circle at center, #CCFF00 0%, transparent 70%)`
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                  
                  {/* Floating particles */}
                  {hoveredSkill === index && (
                    <>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 rounded-full bg-lime"
                          initial={{ 
                            x: 0, 
                            y: 0, 
                            opacity: 0.8 
                          }}
                          animate={{ 
                            x: (Math.random() - 0.5) * 80, 
                            y: (Math.random() - 0.5) * 80,
                            opacity: 0
                          }}
                          transition={{ 
                            duration: 0.8 + Math.random() * 0.5,
                            repeat: Infinity,
                            repeatType: "loop"
                          }}
                          style={{
                            left: '50%',
                            top: '50%',
                          }}
                        />
                      ))}
                    </>
                  )}
                </motion.div>
              ))}
          </motion.div>
        </AnimatePresence>
        
        <motion.div 
          variants={skillVariants}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold mb-8">Currently Learning</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {["Advanced MongoDB", "AWS Cloud Services", "Deep Learning", "TypeScript", "Next.js", "GraphQL"].map((tech, index) => (
              <motion.div 
                key={index}
                className="tech-pill relative overflow-hidden group interactive"
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: "rgba(204, 255, 0, 0.2)",
                }}
                data-cursor-text="Learning"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              >
                {tech}
                <motion.div 
                  className="absolute bottom-0 left-0 h-0.5 w-full bg-lime"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SkillsSection;
