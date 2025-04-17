
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
        transition={{ duration: 1 }}
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
