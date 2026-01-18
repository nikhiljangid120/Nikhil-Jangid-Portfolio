import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Download, FileText, GraduationCap, Code, Briefcase, Award, ExternalLink, Rocket } from 'lucide-react';

const ResumeSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const highlights = [
    { icon: GraduationCap, label: "B.Tech CSE", value: "2022 - 2026" },
    { icon: Award, label: "CGPA", value: "8.36+" },
    { icon: Code, label: "DSA Problems", value: "400+" },
    { icon: Briefcase, label: "Projects", value: "4+ Live" },
  ];

  const skills = {
    "Frontend": ["React.js", "Next.js", "Tailwind CSS", "TypeScript"],
    "Backend": ["Node.js", "Express.js", "REST APIs", "Firebase"],
    "AI/LLM": ["Gemini API", "OpenAI", "Prompt Engineering"],
    "Tools": ["Git", "GitHub", "MongoDB", "PostgreSQL"],
  };

  const projects = [
    { name: "AI Resume Builder", url: "https://ai-resume-builder-epbj.vercel.app/", status: "live" },
    { name: "AI Fitness Platform", url: "https://fitness-platform-zeta.vercel.app/", status: "live" },
    { name: "AI Code Analyzer", url: "https://code-analyzer-f7bq.vercel.app/", status: "live" },
    { name: "Flyeng Career", url: null, status: "building" },
  ];

  return (
    <section id="resume" ref={ref} className="py-20 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-2 text-primary mb-4 font-mono">
            <FileText className="w-5 h-5" />
            <span>~/resume</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Resume &</span> <span className="text-primary opacity-80">Experience</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Final-year CSE student at Amity University, Rajasthan. Building AI-powered products.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Stats & Download */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              {highlights.map((item, i) => (
                <motion.div
                  key={i}
                  className="p-4 bg-card/50 border border-border rounded-xl text-center group hover:border-primary/50 transition-colors"
                  whileHover={{ y: -2 }}
                >
                  <item.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <div className="text-lg font-bold text-foreground">{item.value}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Download Button */}
            <motion.a
              href="/Nikhil Jangid_ATS Friendly Resume.pdf"
              download
              className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-5 h-5" />
              Download Resume
            </motion.a>

            {/* Projects Quick List */}
            <div className="p-4 bg-card/50 border border-border rounded-xl">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Rocket className="w-4 h-4 text-primary" />
                Featured Projects
              </h3>
              <div className="space-y-2">
                {projects.map((project, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{project.name}</span>
                    {project.status === "live" ? (
                      <a href={project.url!} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                        Live <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-orange-400 text-xs px-2 py-0.5 bg-orange-400/10 rounded">Building</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Skills Grid */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(skills).map(([category, items], i) => (
                <motion.div
                  key={category}
                  className="p-6 bg-card/50 border border-border rounded-xl hover:border-primary/50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                >
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg border border-primary/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Flyeng Career Highlight */}
            <motion.div
              className="mt-6 p-6 bg-gradient-to-r from-purple-500/10 via-primary/5 to-orange-500/10 border border-purple-500/30 rounded-xl relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <motion.div
                className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold text-white flex items-center gap-1"
                animate={{ boxShadow: ['0 0 10px rgba(168,85,247,0.5)', '0 0 20px rgba(168,85,247,0.8)', '0 0 10px rgba(168,85,247,0.5)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🚀 Coming Soon
              </motion.div>

              <h3 className="text-xl font-bold text-foreground mb-2">Flyeng Career</h3>
              <p className="text-sm text-muted-foreground mb-4">
                AI-powered career platform with portfolio building, interview prep, and structured learning paths for aspiring software engineers.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Next.js", "PostgreSQL", "AI/LLM", "Prisma"].map((tech) => (
                  <span key={tech} className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ResumeSection;