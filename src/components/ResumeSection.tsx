import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Download, Eye, Code, Server, Database, BookOpen, Github } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ResumeSection = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const controls = useAnimation();

  // Nikhil's resume data
  const resumeData = {
    name: "Nikhil Jangid",
    title: "MERN Stack Developer",
    age: 20,
    status: "Pre-final year B.Tech student",
    education: {
      degree: "B.Tech in Computer Science and Engineering",
      institution: "Amity University Rajasthan",
      year: "2021 - 2025",
    },
    skills: {
      languages: ["C++", "Python", "JavaScript", "HTML/CSS"],
      frameworks: ["React.js", "Node.js", "Express.js", "Next.js"],
      databases: ["MongoDB"],
      tools: ["Git", "GitHub", "VS Code", "Kali Linux"],
      areas: ["Data Structures & Algorithms", "Web Development", "Cybersecurity (Basics)", "Machine Learning (Basics)"]
    },
    projects: [
      {
        name: "Portfolio Website",
        tech: "Next.js, Tailwind CSS, Framer Motion",
        description: "Personal portfolio showcasing skills and projects with advanced animations"
      },
      {
        name: "E-Commerce Platform",
        tech: "MERN Stack, Redux",
        description: "Fully functional online store with user authentication and payment processing"
      }
    ]
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const SkillIcon = ({ name }) => {
    if (name.includes("React")) return <div className="text-blue-400">⚛️</div>;
    if (name.includes("Node")) return <Server className="w-4 h-4 text-green-400" />;
    if (name.includes("Mongo")) return <Database className="w-4 h-4 text-green-500" />;
    if (name.includes("C++")) return <Code className="w-4 h-4 text-blue-500" />;
    if (name.includes("Python")) return <div>🐍</div>;
    if (name.includes("Git")) return <Github className="w-4 h-4 text-orange" />;
    return <BookOpen className="w-4 h-4 text-gold" />;
  };

  return (
    <section id="resume" className="py-24 px-6 relative overflow-hidden">
      {/* Background with neural network-like pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal to-inky-black" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: 'linear-gradient(#005A66 1px, transparent 1px), linear-gradient(90deg, #005A66 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Neural network nodes */}
        {Array.from({ length: 15 }).map((_, index) => {
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          return (
            <motion.div
              key={`node-${index}`}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                background: index % 3 === 0 ? '#CCFF00' : index % 3 === 1 ? '#D94F30' : '#FFB100',
                boxShadow: `0 0 8px ${index % 3 === 0 ? '#CCFF00' : index % 3 === 1 ? '#D94F30' : '#FFB100'}`
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 0.9, 0.6],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: Math.random() * 2,
              }}
            />
          );
        })}
        
        {/* Neural network connections */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#005A66" />
              <stop offset="50%" stopColor="#FFB100" />
              <stop offset="100%" stopColor="#D94F30" />
            </linearGradient>
          </defs>
          {Array.from({ length: 15 }).map((_, i) => {
            const x1 = Math.random() * 100;
            const y1 = Math.random() * 100;
            const x2 = Math.random() * 100;
            const y2 = Math.random() * 100;
            return (
              <motion.line
                key={`line-${i}`}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke="url(#lineGradient)"
                strokeWidth="0.5"
                strokeOpacity="0.5"
                animate={{ 
                  strokeOpacity: [0.2, 0.5, 0.2],
                  strokeDashoffset: [0, 100]
                }}
                transition={{ 
                  duration: 10 + Math.random() * 5,
                  repeat: Infinity,
                  repeatType: "loop" 
                }}
                strokeDasharray="5,5"
              />
            );
          })}
        </svg>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
<h2 className="text-4xl md:text-5xl font-bold mb-6 relative inline-block font-['Poppins']">
  <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-rose-500 to-amber-500 px-3 py-1 rounded-lg shadow-[0_4px_12px_rgba(244,63,94,0.3)]">
    Resume
  </span>
  <motion.span 
    className="absolute -inset-2 blur-2xl opacity-50 bg-gradient-to-r from-red-400 via-rose-500 to-amber-500 rounded-xl -z-10"
    animate={{ 
      opacity: [0.4, 0.7, 0.4],
      scale: [1, 1.05, 1],
      backgroundPosition: ['0% center', '100% center', '0% center'],
      boxShadow: ['0 8px 16px rgba(244,63,94,0.2)', '0 12px 24px rgba(244,63,94,0.4)', '0 8px 16px rgba(244,63,94,0.2)']
    }}
    transition={{ duration: 2.5, repeat: Infinity, repeatType: "mirror" }}
  />
</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-teal to-orange mx-auto mb-6" />
          <p className="text-gray-300 max-w-2xl mx-auto">
            My professional experience and technical qualifications
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch">
          {/* Interactive Resume Preview */}
          <motion.div
            className="relative w-full lg:w-3/5 bg-gradient-to-br from-teal/10 to-purple/10 rounded-2xl overflow-hidden border border-white/10"
            whileHover={{ scale: 1.01 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Dialog>
              <DialogTrigger asChild>
                <motion.button 
                  className="w-full h-full relative cursor-pointer group"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    // Update the highlight position based on mouse
                    controls.start({
                      background: `radial-gradient(circle at ${x}px ${y}px, rgba(204, 255, 0, 0.15) 0%, rgba(0, 90, 102, 0.05) 50%, transparent 100%)`,
                    });
                  }}
                >
                  {/* Dynamic highlight effect */}
                  <motion.div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={controls}
                  />
                  
                  <div className="w-full h-full backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 relative overflow-hidden">
                    {/* Accent decorations */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-orange/30 to-transparent rounded-bl-full opacity-50" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-t from-teal/30 to-transparent rounded-tr-full opacity-50" />
                    
                    {/* Resume Content Preview */}
                    <div className="relative space-y-6 text-left">
                      <div className="border-l-4 border-orange pl-4 mb-8">
                        <h3 className="text-3xl font-bold text-white">{resumeData.name}</h3>
                        <p className="text-lime text-lg">{resumeData.title}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gold mb-2 flex items-center">
                              <BookOpen className="w-5 h-5 mr-2" /> Education
                            </h4>
                            <p className="text-white font-medium">
                              {resumeData.education.degree}
                            </p>
                            <p className="text-gray-300">
                              {resumeData.education.institution}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {resumeData.education.year}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="text-lg font-semibold text-gold mb-2 flex items-center">
                              <Code className="w-5 h-5 mr-2" /> Languages
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {resumeData.skills.languages.map((lang, i) => (
                                <span key={i} className="px-3 py-1 text-xs bg-teal/20 text-white rounded-full border border-teal/30 flex items-center gap-1">
                                  <SkillIcon name={lang} />
                                  {lang}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gold mb-2 flex items-center">
                              <Server className="w-5 h-5 mr-2" /> Frameworks & Tools
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {resumeData.skills.frameworks.slice(0, 4).map((fw, i) => (
                                <span key={i} className="px-3 py-1 text-xs bg-orange/20 text-white rounded-full border border-orange/30 flex items-center gap-1">
                                  <SkillIcon name={fw} />
                                  {fw}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-lg font-semibold text-gold mb-2 flex items-center">
                              <Database className="w-5 h-5 mr-2" /> Areas of Expertise
                            </h4>
                            <p className="text-gray-300">
                              {resumeData.skills.areas.slice(0, 2).join(" • ")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple/80 to-teal/80 flex items-center justify-center opacity-0 group-hover:opacity-90 transition-opacity duration-500">
                      <div className="bg-white/10 backdrop-blur-md p-4 rounded-full flex items-center gap-2 border border-white/30">
                        <Eye className="w-6 h-6 text-white" />
                        <span className="text-white font-medium">View Full Resume</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              </DialogTrigger>
              
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-inky-black border border-teal/30">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-white">Nikhil Jangid - Resume</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  {/* Full Resume Content */}
                  <div className="bg-gradient-to-br from-charcoal/50 to-inky-black/70 p-8 rounded-lg border border-white/10 backdrop-blur-sm">
                    <div className="border-l-4 border-orange pl-6 mb-8">
                      <h2 className="text-4xl font-bold text-white">{resumeData.name}</h2>
                      <p className="text-lime text-xl">{resumeData.title}</p>
                      <p className="text-gray-300 mt-2">Age: {resumeData.age} • {resumeData.status}</p>
                    </div>
                    
                    <div className="space-y-10">
                      <div>
                        <h3 className="text-2xl font-semibold text-gold mb-4 pb-2 border-b border-white/20 flex items-center gap-2">
                          <BookOpen className="w-6 h-6" /> Education
                        </h3>
                        <div className="pl-2">
                          <h4 className="text-xl font-medium text-white">{resumeData.education.degree}</h4>
                          <p className="text-lg text-teal">{resumeData.education.institution}</p>
                          <p className="text-gray-400">{resumeData.education.year}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-2xl font-semibold text-gold mb-4 pb-2 border-b border-white/20 flex items-center gap-2">
                          <Code className="w-6 h-6" /> Technical Skills
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2">
                          <div>
                            <h4 className="text-lg font-medium text-white mb-2">Programming Languages</h4>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {resumeData.skills.languages.map((lang, i) => (
                                <span key={i} className="px-3 py-1 text-sm bg-teal/20 text-white rounded-full border border-teal/30 flex items-center gap-1">
                                  <SkillIcon name={lang} />
                                  {lang}
                                </span>
                              ))}
                            </div>
                            
                            <h4 className="text-lg font-medium text-white mb-2">Databases</h4>
                            <div className="flex flex-wrap gap-2">
                              {resumeData.skills.databases.map((db, i) => (
                                <span key={i} className="px-3 py-1 text-sm bg-gold/20 text-white rounded-full border border-gold/30 flex items-center gap-1">
                                  <Database className="w-4 h-4 mr-1" />
                                  {db}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-lg font-medium text-white mb-2">Frameworks & Libraries</h4>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {resumeData.skills.frameworks.map((fw, i) => (
                                <span key={i} className="px-3 py-1 text-sm bg-orange/20 text-white rounded-full border border-orange/30 flex items-center gap-1">
                                  <SkillIcon name={fw} />
                                  {fw}
                                </span>
                              ))}
                            </div>
                            
                            <h4 className="text-lg font-medium text-white mb-2">Tools & Platforms</h4>
                            <div className="flex flex-wrap gap-2">
                              {resumeData.skills.tools.map((tool, i) => (
                                <span key={i} className="px-3 py-1 text-sm bg-purple/20 text-white rounded-full border border-purple/30 flex items-center gap-1">
                                  <SkillIcon name={tool} />
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-2xl font-semibold text-gold mb-4 pb-2 border-b border-white/20 flex items-center gap-2">
                          <Server className="w-6 h-6" /> Areas of Expertise
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 pl-2">
                          {resumeData.skills.areas.map((area, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-lime rounded-full"></div>
                              <span className="text-gray-200">{area}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-2xl font-semibold text-gold mb-4 pb-2 border-b border-white/20 flex items-center gap-2">
                          <Code className="w-6 h-6" /> Projects
                        </h3>
                        <div className="space-y-4 pl-2">
                          {resumeData.projects.map((project, i) => (
                            <div key={i} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-teal/30 transition-colors">
                              <h4 className="text-lg font-medium text-white">{project.name}</h4>
                              <p className="text-lime text-sm mb-2">{project.tech}</p>
                              <p className="text-gray-300">{project.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Neon glow effect on hover */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{
                boxShadow: "0 0 20px rgba(204, 255, 0, 0.3), 0 0 40px rgba(0, 90, 102, 0.2)",
              }}
            />

            {/* Download button with hover effect */}
            <motion.a
              href="/resume.pdf"
              download
              className="absolute bottom-6 right-6 p-3 rounded-full bg-orange text-inky-black flex items-center justify-center group overflow-hidden"
              whileHover={{ 
                scale: 1.1,
                boxShadow: "0 0 15px rgba(204, 255, 0, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-lime opacity-0 group-hover:opacity-100 group-hover:animate-pulse" />
              <Download className="w-5 h-5 relative z-10" />
            </motion.a>
          </motion.div>

          {/* Resume Highlights */}
          <motion.div 
            className="w-full lg:w-2/5 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Tech Stack Card */}
            <motion.div 
              className="p-6 bg-gradient-to-r from-teal/10 to-transparent border border-teal/20 rounded-xl relative overflow-hidden group"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 90, 102, 0.3)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal/10 via-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 right-0 h-20 w-20 bg-teal/10 rounded-bl-full" />
              <div className="absolute -bottom-10 -left-10 h-20 w-20 bg-lime/10 rounded-full" />
                
              <h3 className="text-xl font-bold mb-3 text-white relative">Tech Stack</h3>
              <div className="h-1 w-12 bg-teal mb-4" />
              <p className="text-gray-300 mb-4 relative">
                Specialized in MERN Stack Development (MongoDB, Express.js, React.js, Node.js) with a strong foundation in Data Structures and Algorithms.
              </p>
              <div className="flex flex-wrap gap-2 relative">
                <span className="px-3 py-1 bg-teal/20 text-white text-xs rounded-full">React.js</span>
                <span className="px-3 py-1 bg-teal/20 text-white text-xs rounded-full">Node.js</span>
                <span className="px-3 py-1 bg-teal/20 text-white text-xs rounded-full">MongoDB</span>
              </div>
            </motion.div>

            {/* Education Card */}
            <motion.div 
              className="p-6 bg-gradient-to-r from-orange/10 to-transparent border border-orange/20 rounded-xl relative overflow-hidden group"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(217, 79, 48, 0.3)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange/10 via-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 right-0 h-20 w-20 bg-orange/10 rounded-bl-full" />
                
              <h3 className="text-xl font-bold mb-3 text-white relative">Education</h3>
              <div className="h-1 w-12 bg-orange mb-4" />
              <p className="text-gray-300 relative">
                Pre-final year B.Tech in Computer Science and Engineering at Amity University Rajasthan, focused on building practical development skills alongside academic excellence.
              </p>
            </motion.div>

            {/* Specialization Card */}
            <motion.div 
              className="p-6 bg-gradient-to-r from-gold/10 to-transparent border border-gold/20 rounded-xl relative overflow-hidden group"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(255, 177, 0, 0.3)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 right-0 h-20 w-20 bg-gold/10 rounded-bl-full" />
                
              <h3 className="text-xl font-bold mb-3 text-white relative">Specializations</h3>
              <div className="h-1 w-12 bg-gold mb-4" />
              <ul className="text-gray-300 space-y-2 relative">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-lime rounded-full"></div>
                  <span>Data Structures & Algorithms</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-lime rounded-full"></div>
                  <span>Web Development</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-lime rounded-full"></div>
                  <span>Cybersecurity (Kali Linux)</span>
                </li>
              </ul>
            </motion.div>
            
            {/* Contact CTA Button */}
            <motion.button
              className="w-full py-4 mt-4 bg-gradient-to-r from-orange to-teal rounded-xl font-medium text-white group flex items-center justify-center gap-2 relative overflow-hidden"
              whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(0, 90, 102, 0.5)" }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange via-purple to-teal bg-size-200 animate-gradient-x opacity-0 group-hover:opacity-20" />
              
              <span className="relative z-10">Contact Me</span>
              <motion.span
                className="relative z-10"
                initial={{ x: 0 }}
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, repeatType: "loop", duration: 1.5 }}
              >
                →
              </motion.span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ResumeSection;