
import { motion } from 'framer-motion';
import { Calendar, MapPin, Award, Briefcase, GraduationCap } from 'lucide-react';

interface TimelineCardProps {
  item: {
    year: string;
    title: string;
    organization: string;
    location: string;
    description: string;
    type: 'education' | 'work' | 'achievement';
    current?: boolean;
  };
  index: number;
}

const TimelineCard = ({ item, index }: TimelineCardProps) => {
  const iconMap = {
    education: GraduationCap,
    work: Briefcase,
    achievement: Award,
  };

  const colorMap = {
    education: {
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/20',
      text: 'text-teal-400',
      glow: 'from-teal-500/30',
      accent: 'bg-teal-500',
    },
    work: {
      bg: 'bg-lime-500/10',
      border: 'border-lime-500/20',
      text: 'text-lime-400',
      glow: 'from-lime-500/30',
      accent: 'bg-lime-500',
    },
    achievement: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      glow: 'from-amber-500/30',
      accent: 'bg-amber-500',
    },
  };

  const colors = colorMap[item.type];
  const Icon = iconMap[item.type];

  // Enhanced animation variants with staggered effects
  const cardVariants = {
    hidden: { opacity: 0, y: 80, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.7, 
        ease: [0.25, 0.1, 0.25, 1],
        delay: index * 0.2,
      }
    },
    hover: {
      y: -12,
      scale: 1.03,
      transition: { 
        duration: 0.4, 
        ease: 'easeOut',
        type: 'spring',
        stiffness: 300,
        damping: 15
      }
    },
    tap: {
      scale: 0.98,
      y: -8,
      transition: { duration: 0.2, ease: 'easeOut' }
    }
  };

  const contentVariants = {
    collapsed: { height: 'auto', opacity: 1 },
    expanded: { height: 'auto', opacity: 1 }
  };

  const detailsVariants = {
    collapsed: { opacity: 0, height: 0 },
    expanded: { 
      opacity: 1, 
      height: 'auto',
      transition: { 
        opacity: { duration: 0.5 }, 
        height: { duration: 0.5 } 
      }
    }
  };
  
  // Shimmer effect animation
  const shimmerVariants = {
    animate: {
      x: ['0%', '100%'],
      opacity: [0, 1, 0],
      transition: {
        x: { repeat: Infinity, duration: 2.5, ease: 'linear' },
        opacity: { repeat: Infinity, duration: 2.5, ease: 'linear' }
      }
    }
  };

  return (
    <motion.div
      className={`relative pl-12 py-10 group ${index !== 0 ? 'border-t border-white/5' : ''}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={cardVariants}
    >
      {/* Timeline dot with icon */}
      <motion.div 
        className={`absolute -left-3 w-6 h-6 rounded-full flex items-center justify-center ${colors.bg} ${colors.border} border`}
        whileHover={{ scale: 1.2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 10 }}
      >
        <Icon className={`w-3 h-3 ${colors.text}`} />
      </motion.div>
      
      {/* Timeline vertical line */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-px bg-white/10"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />

      {/* Content card */}
      <motion.div 
        className="relative bg-charcoal/50 backdrop-blur-sm rounded-lg p-5 border border-white/10 overflow-hidden"
        whileHover={{ y: -5, transition: { duration: 0.3 } }}
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
        
        {/* Current indicator */}
        {item.current && (
          <div className="absolute right-3 top-3">
            <motion.div 
              className={`px-2 py-0.5 rounded-full text-xs ${colors.bg} ${colors.text} border ${colors.border}`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Current
            </motion.div>
          </div>
        )}
        
        {/* Year */}
        <div className="flex items-center mb-2">
          <Calendar className={`w-4 h-4 mr-2 ${colors.text}`} />
          <span className={`text-sm font-semibold ${colors.text}`}>{item.year}</span>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
        
        {/* Organization & Location */}
        <div className="flex items-center mb-3 text-sm text-gray-300">
          <span className="mr-3">{item.organization}</span>
          <div className="flex items-center text-gray-400">
            <MapPin className="w-3 h-3 mr-1" />
            <span>{item.location}</span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-400">{item.description}</p>
      </motion.div>
    </motion.div>
  );
};

export default TimelineCard;