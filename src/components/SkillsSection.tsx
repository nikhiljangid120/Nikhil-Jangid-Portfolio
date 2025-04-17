
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Skill {
  name: string;
  level: number;
  category: string;
  color: string;
}

const SkillsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  
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
    { name: "C++", level: 90, category: "languages", color: "from-teal to-lime" },
    { name: "JavaScript", level: 85, category: "languages", color: "from-gold to-orange" },
    { name: "Python", level: 75, category: "languages", color: "from-purple to-teal" },
    { name: "HTML/CSS", level: 90, category: "languages", color: "from-orange to-gold" },
    
    // Frontend
    { name: "React.js", level: 85, category: "frontend", color: "from-teal to-lime" },
    { name: "Tailwind CSS", level: 90, category: "frontend", color: "from-purple to-teal" },
    { name: "UI/UX Design", level: 70, category: "frontend", color: "from-gold to-orange" },
    { name: "Responsive Design", level: 85, category: "frontend", color: "from-orange to-gold" },
    
    // Backend
    { name: "Node.js", level: 75, category: "backend", color: "from-lime to-teal" },
    { name: "Express.js", level: 80, category: "backend", color: "from-teal to-purple" },
    { name: "RESTful APIs", level: 85, category: "backend", color: "from-gold to-orange" },
    { name: "MongoDB", level: 65, category: "backend", color: "from-orange to-gold" },
    
    // Tools & Others
    { name: "Git/GitHub", level: 85, category: "tools", color: "from-purple to-teal" },
    { name: "Data Structures", level: 90, category: "tools", color: "from-lime to-teal" },
    { name: "Algorithms", level: 85, category: "tools", color: "from-teal to-purple" },
    { name: "Linux", level: 70, category: "tools", color: "from-gold to-orange" }
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={skillVariants}
              className="card-3d p-8 bg-charcoal/50"
            >
              <h3 className="text-2xl font-bold mb-6 text-lime">{category.label}</h3>
              <div className="space-y-6">
                {skills
                  .filter(skill => skill.category === category.id)
                  .map((skill, index) => (
                    <motion.div 
                      key={index}
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="skill-bar-bg">
                        <motion.div 
                          className={`skill-bar-fill bg-gradient-to-r ${skill.color}`}
                          initial={{ width: "0%" }}
                          animate={inView ? { width: `${skill.level}%` } : { width: "0%" }}
                          transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                        />
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          variants={skillVariants}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold mb-8">Currently Learning</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="tech-pill">Advanced MongoDB</div>
            <div className="tech-pill">AWS Cloud Services</div>
            <div className="tech-pill">Deep Learning</div>
            <div className="tech-pill">TypeScript</div>
            <div className="tech-pill">Next.js</div>
            <div className="tech-pill">GraphQL</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SkillsSection;
