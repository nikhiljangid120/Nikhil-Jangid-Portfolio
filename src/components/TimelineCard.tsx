
import { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Calendar, MapPin, Award, Briefcase, GraduationCap, ExternalLink } from 'lucide-react';

interface TimelineCardProps {
  item: {
    year: string;
    title: string;
    organization: string;
    location: string;
    description: string;
    type: 'education' | 'work' | 'achievement';
    current?: boolean;
    link?: string;
  };
  index: number;
}

const TimelineCard = ({ item, index }: TimelineCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Create a parallax effect when hovering
  const rotateX = useTransform(mouseY, [-100, 100], [5, -5]);
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const iconMap = {
    'education': GraduationCap,
    'work': Briefcase,
    'achievement': Award
  };

  const colorMap = {
    'education': {
      bg: 'bg-teal/20',
      border: 'border-teal/30',
      text: 'text-teal',
      glow: 'from-teal/20'
    },
    'work': {
      bg: 'bg-lime/20',
      border: 'border-lime/30',
      text: 'text-lime',
      glow: 'from-lime/20'
    },
    'achievement': {
      bg: 'bg-gold/20',
      border: 'border-gold/30',
      text: 'text-gold',
      glow: 'from-gold/20'
    }
  };

  const colors = colorMap[item.type];
  const Icon = iconMap[item.type];
  
  return (
    <motion.div
      className={`relative pl-8 py-6 ${index !== 0 ? 'border-t border-white/10' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Timeline dot with icon and pulse animation */}
      <motion.div 
        className={`absolute -left-3 w-6 h-6 rounded-full flex items-center justify-center ${colors.bg} ${colors.border} border z-10`}
        whileHover={{ scale: 1.2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 10 }}
        style={{
          boxShadow: isHovered ? `0 0 15px 2px rgba(204, 255, 0, 0.6)` : 'none'
        }}
      >
        <Icon className={`w-3 h-3 ${colors.text}`} />
        
        {/* Pulse effect for current items */}
        {item.current && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                `0 0 0 0 ${item.type === 'education' ? 'rgba(0, 90, 102, 0.7)' : item.type === 'work' ? 'rgba(204, 255, 0, 0.7)' : 'rgba(255, 177, 0, 0.7)'}`,
                `0 0 0 10px ${item.type === 'education' ? 'rgba(0, 90, 102, 0)' : item.type === 'work' ? 'rgba(204, 255, 0, 0)' : 'rgba(255, 177, 0, 0)'}`
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        )}
      </motion.div>
      
      {/* Timeline vertical line with gradient */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      />

      {/* Content card with 3D effect */}
      <motion.div 
        className="perspective relative"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          mouseX.set(0);
          mouseY.set(0);
        }}
      >
        <motion.div
          className="relative bg-charcoal/50 backdrop-blur-sm rounded-lg p-5 border border-white/10 overflow-hidden preserve-3d"
          style={{
            rotateX: rotateX,
            rotateY: rotateY,
            transformPerspective: 1000
          }}
          whileHover={{ 
            scale: 1.02,
            borderColor: `${item.type === 'education' ? 'rgb(0, 90, 102, 0.3)' : item.type === 'work' ? 'rgb(204, 255, 0, 0.3)' : 'rgb(255, 177, 0, 0.3)'}`,
            transition: { duration: 0.3 }
          }}
        >
          {/* Subtle glow effect */}
          <motion.div 
            className={`absolute -inset-0.5 rounded-lg blur-sm opacity-30 bg-gradient-to-r ${colors.glow} to-transparent -z-10`}
            animate={{ 
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              repeatType: "mirror"
            }}
          />
          
          {/* Glass reflection effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-white/5 via-white/10 to-transparent opacity-0"
            animate={{ opacity: isHovered ? 0.15 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Sparkle effects */}
          {isHovered && (
            <>
              <motion.div 
                className="absolute w-1 h-1 rounded-full bg-white top-1/4 left-1/4"
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  repeatDelay: 0.2
                }}
              />
              <motion.div 
                className="absolute w-1 h-1 rounded-full bg-white top-3/4 right-1/4"
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  repeatDelay: 0.5
                }}
              />
            </>
          )}
          
          {/* Current indicator */}
          {item.current && (
            <div className="absolute right-3 top-3 z-10">
              <motion.div 
                className={`px-2 py-0.5 rounded-full text-xs ${colors.bg} ${colors.text} border ${colors.border}`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Current
              </motion.div>
            </div>
          )}
          
          {/* External link for items with links */}
          {item.link && (
            <motion.a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-3 top-3 z-10 p-1.5 rounded-full bg-charcoal/50 hover:bg-lime/20 border border-white/10 hover:border-lime/30 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-3.5 h-3.5 text-white hover:text-lime" />
            </motion.a>
          )}
          
          {/* Year */}
          <div className="flex items-center mb-2 z-10 relative">
            <Calendar className={`w-4 h-4 mr-2 ${colors.text}`} />
            <span className={`text-sm font-semibold ${colors.text}`}>{item.year}</span>
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-1 z-10 relative">{item.title}</h3>
          
          {/* Organization & Location */}
          <div className="flex flex-wrap items-center mb-3 text-sm text-gray-300 z-10 relative">
            <span className="mr-3">{item.organization}</span>
            <div className="flex items-center text-gray-400">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{item.location}</span>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-sm text-gray-400 z-10 relative">{item.description}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TimelineCard;
