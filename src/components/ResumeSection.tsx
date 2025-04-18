
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ResumeSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section id="resume" className="section-container relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-inkyblack/50 to-charcoal/50 backdrop-blur-sm" />
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-1 h-1 bg-lime/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      {/* Content */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Resume</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            View my professional experience and qualifications
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          {/* Interactive Resume Preview */}
          <motion.div
            className="relative group w-full md:w-2/3 lg:w-1/2 aspect-[3/4] bg-gradient-to-br from-lime/10 to-purple/10 rounded-xl overflow-hidden border border-white/10"
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <Dialog>
              <DialogTrigger asChild>
                <motion.button 
                  className="w-full h-full p-6 relative group cursor-none interactive"
                  data-cursor-text="View Resume"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-lime/20 via-purple/20 to-teal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Resume Preview Image */}
                  <div className="w-full h-full relative">
                    <img
                      src="/resume-preview.png" 
                      alt="Resume Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </motion.button>
              </DialogTrigger>
              
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Resume</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <iframe
                    src="/resume.pdf"
                    className="w-full h-[80vh]"
                    title="Resume Viewer"
                  />
                </div>
              </DialogContent>
            </Dialog>

            {/* Glassmorphism hover effect */}
            <motion.div
              className="absolute inset-0 backdrop-blur-sm bg-white/5"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Download button */}
            <motion.a
              href="/resume.pdf"
              download
              className="absolute bottom-6 right-6 p-3 rounded-full bg-lime text-inkyblack interactive"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              data-cursor-text="Download"
            >
              <Download className="w-5 h-5" />
            </motion.a>
          </motion.div>

          {/* Resume Highlights */}
          <motion.div 
            className="w-full md:w-1/3 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="card-3d p-6 hover:bg-lime/5">
              <h3 className="text-xl font-bold mb-2">Experience</h3>
              <p className="text-gray-400">4+ years of development experience</p>
            </div>

            <div className="card-3d p-6 hover:bg-purple/5">
              <h3 className="text-xl font-bold mb-2">Education</h3>
              <p className="text-gray-400">B.Tech in Computer Science</p>
            </div>

            <div className="card-3d p-6 hover:bg-teal/5">
              <h3 className="text-xl font-bold mb-2">Skills</h3>
              <p className="text-gray-400">Full Stack Development, DSA</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ResumeSection;
