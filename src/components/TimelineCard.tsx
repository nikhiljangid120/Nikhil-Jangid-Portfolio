import { motion } from 'framer-motion';
import { Calendar, MapPin, Award, Briefcase, GraduationCap, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface TimelineCardProps {
  item: {
    year: string;
    title: string;
    organization: string;
    location: string;
    description: string;
    type: 'education' | 'work' | 'achievement';
    current?: boolean;
    skills?: string[];
  };
  index: number;
}

const TimelineCard = ({ item, index }: TimelineCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
      {/* Timeline dot with icon - enhanced with spring animation */}
      <motion.div 
        className={`absolute -left-4 w-10 h-10 rounded-full flex items-center justify-center ${colors.bg} ${colors.border} border-2 z-10`}
        whileHover={{ 
          scale: 1.4, 
          rotate: [0, -10, 10, -5, 5, 0],
          boxShadow: `0 0 25px ${colors.text}/40`
        }}
        transition={{ 
          rotate: { duration: 0.5, ease: 'easeInOut' },
          scale: { type: 'spring', stiffness: 500, damping: 10 }
        }}
      >
        <Icon className={`w-5 h-5 ${colors.text}`} />
        
        {/* Ripple effect on icon */}
        <motion.div
          className={`absolute inset-0 rounded-full ${colors.border} opacity-70`}
          animate={{
            scale: [1, 1.5, 1.8],
            opacity: [0.7, 0.3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        />
      </motion.div>
      
      {/* Timeline vertical line with enhanced gradient */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-white/20 to-transparent"
        initial={{ scaleY: 0, opacity: 0 }}
        whileInView={{ 
          scaleY: 1, 
          opacity: [0, 0.5, 1],
          background: [
            'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)',
            `linear-gradient(to bottom, ${colors.text}50, transparent)`
          ]
        }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />

      {/* Enhanced content card with glassmorphism and interaction */}
      <motion.div 
        className={`relative bg-white/5 backdrop-blur-xl rounded-2xl p-7 border ${colors.border} shadow-xl overflow-hidden transition-all duration-300`}
        variants={cardVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Animated shimmer effect */}
        <motion.div 
          className={`absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -z-10`}
          variants={shimmerVariants}
          animate="animate"
        />

        {/* Enhanced dynamic background glow */}
        <motion.div 
          className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${colors.glow} to-transparent opacity-20 -z-10`}
          animate={{ 
            opacity: [0.15, 0.4, 0.15],
            scale: [1, 1.08, 1],
            rotate: [0, 0.5, 0],
            x: [-10, 10, -10]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity,
            repeatType: 'mirror'
          }}
        />

        {/* Current indicator with enhanced pulse effect */}
        {item.current && (
          <motion.div 
            className={`absolute right-4 top-4 px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border} shadow-md`}
            animate={{ 
              scale: [1, 1.08, 1],
              boxShadow: [
                `0 0 0px ${colors.text}/0`,
                `0 0 15px ${colors.text}/40`,
                `0 0 0px ${colors.text}/0`
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="relative">
              Current
              <span className={`absolute -left-1 -top-1 w-2 h-2 rounded-full ${colors.accent} opacity-80`}>
                <motion.span 
                  className="absolute inset-0 rounded-full bg-inherit"
                  animate={{ 
                    scale: [1, 2.5],
                    opacity: [1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeOut'
                  }}
                />
              </span>
            </span>
          </motion.div>
        )}
        
        {/* Year with enhanced animation */}
        <motion.div 
          className="flex items-center mb-3"
          initial={{ x: -30, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.2 + 0.1, duration: 0.6 }}
        >
          <Calendar className={`w-5 h-5 mr-2 ${colors.text}`} />
          <motion.span 
            className={`text-sm font-semibold ${colors.text}`}
            whileHover={{ 
              letterSpacing: '0.05em',
              color: 'white'
            }}
          >
            {item.year}
          </motion.span>
        </motion.div>
        
        {/* Title with enhanced gradient text */}
        <motion.h3 
          className={`text-xl font-bold bg-gradient-to-r ${colors.glow} to-white bg-clip-text text-transparent mb-2`}
          initial={{ y: 15, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.2 + 0.2, duration: 0.5 }}
          whileHover={{ 
            letterSpacing: '0.02em',
            scale: 1.01,
            transition: { duration: 0.3 }
          }}
        >
          {item.title}
        </motion.h3>
        
        {/* Organization & Location with enhanced hover effects */}
        <motion.div 
          className="flex flex-wrap gap-4 mb-4 text-sm text-gray-300"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
        >
          <motion.span 
            className="flex items-center group-hover:text-white transition-colors"
            whileHover={{ 
              x: 5, 
              color: 'white',
              transition: { type: 'spring', stiffness: 300 } 
            }}
          >
            <Briefcase className="w-4 h-4 mr-2 opacity-70" />
            {item.organization}
          </motion.span>
          
          <motion.div 
            className="flex items-center text-gray-400"
            whileHover={{ 
              x: 5, 
              color: 'white',
              transition: { type: 'spring', stiffness: 300 } 
            }}
          >
            <MapPin className="w-4 h-4 mr-1" />
            <span>{item.location}</span>
          </motion.div>
        </motion.div>
        
        {/* Description with enhanced fade-in */}
        <motion.div 
          variants={contentVariants}
          initial="collapsed"
          animate={isExpanded ? "expanded" : "collapsed"}
        >
          <motion.p 
            className="text-sm text-gray-300 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 + 0.4, duration: 0.7 }}
          >
            {item.description}
          </motion.p>
          
          {/* Expandable details section */}
          <motion.div
            variants={detailsVariants}
            initial="collapsed"
            animate={isExpanded ? "expanded" : "collapsed"}
            className="overflow-hidden mt-4"
          >
            {item.skills && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Skills & Technologies:</h4>
                <div className="flex flex-wrap gap-2">
                  {item.skills.map((skill, i) => (
                    <motion.span
                      key={i}
                      className={`px-3 py-1 rounded-full text-xs ${colors.bg} ${colors.text} border ${colors.border}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                      whileHover={{ 
                        scale: 1.1,
                        boxShadow: `0 0 10px ${colors.text}/30`
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
        
        {/* Expand/collapse button with rotation animation */}
        <motion.button
          className={`mt-3 flex items-center text-xs font-medium ${colors.text} focus:outline-none`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          <span>{isExpanded ? "Show less" : "Show more"}</span>
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronRight className="w-4 h-4 ml-1" />
          </motion.div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default TimelineCard;