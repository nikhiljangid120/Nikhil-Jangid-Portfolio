
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Play, Eye } from 'lucide-react';

interface ProjectCardProps {
  project: {
    title: string;
    description: string;
    image: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    featured?: boolean;
  };
  onView: () => void;
  index: number;
}

const ProjectCard3D = ({ project, onView, index }: ProjectCardProps) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [cardScale, setCardScale] = useState(1);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate rotation (limit to small angles)
    const rotateXValue = ((mouseY - centerY) / (rect.height / 2)) * -8;
    const rotateYValue = ((mouseX - centerX) / (rect.width / 2)) * 8;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseEnter = () => {
    setCardScale(1.03);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setCardScale(1);
  };

  return (
    <motion.div 
      ref={cardRef}
      className="perspective relative h-full interactive"
      data-cursor-text="Explore"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={onView}
    >
      <motion.div
        className="preserve-3d relative h-full rounded-xl overflow-hidden shadow-lg border border-white/10"
        style={{
          transformStyle: 'preserve-3d',
          transform: `scale(${cardScale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'transform 0.2s ease-out'
        }}
      >
        {/* Image layer */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-56 object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-inkyblack/90 to-transparent" />
        </div>

        {/* Content layer */}
        <div 
          className="relative z-10 h-full p-5 pt-56 bg-gradient-to-t from-inkyblack to-inkyblack/20"
          style={{ transform: 'translateZ(20px)' }}
        >
          <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{project.description}</p>
          
          <div className="flex gap-2 flex-wrap mb-4">
            {project.technologies.slice(0, 3).map((tech, i) => (
              <span key={i} className="tech-pill text-xs">{tech}</span>
            ))}
            {project.technologies.length > 3 && (
              <span className="tech-pill text-xs">+{project.technologies.length - 3}</span>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-lime transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github size={18} />
                </a>
              )}
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-lime transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={18} />
                </a>
              )}
            </div>
            <button 
              className="text-lime/80 hover:text-lime"
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
            >
              <Eye size={18} />
            </button>
          </div>
        </div>

        {/* Shine effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ 
            transform: `rotateX(${rotateX * 1.5}deg) rotateY(${rotateY * 1.5}deg) translateZ(10px)`,
            backgroundPosition: `${50 + rotateY * 2}% ${50 + rotateX * 2}%`
          }}
        />
        
        {/* Edge highlight */}
        <motion.div
          className="absolute inset-0 border border-lime/30 rounded-xl opacity-0 transition-opacity"
          animate={{ opacity: cardScale > 1 ? 1 : 0 }}
          style={{ transform: 'translateZ(5px)' }}
        />
      </motion.div>
    </motion.div>
  );
};

export default ProjectCard3D;
