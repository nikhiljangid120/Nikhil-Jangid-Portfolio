import { useState, useRef, useEffect, TouchEvent as ReactTouchEvent, MouseEvent as ReactMouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, X, Maximize, Image as ImageIcon, Award as AwardIcon, RotateCcw } from 'lucide-react';

interface Badge {
  id: number;
  name: string;
  platform: string;
  category: string;
  issueDate: string;
  credentialUrl: string;
  logo: string;
  image?: string; // Optional image URL for 3D viewer
}

// Helper function to generate skills based on badge category
const generateSkillsFromCategory = (category: string): string[] => {
  const skillSets: Record<string, string[]> = {
    'DSA': ['Algorithms', 'Data Structures', 'Problem Solving', 'Time Complexity', 'Space Analysis'],
    'Web Dev': ['JavaScript', 'React', 'CSS', 'HTML', 'Responsive Design', 'Frontend', 'API Integration'],
    'Hackathons': ['Teamwork', 'Innovation', 'Rapid Prototyping', 'Problem Solving', 'Coding', 'Presentation'],
    'Achievements': ['Technical Expertise', 'Professional Skills', 'Industry Knowledge', 'Advanced Concepts', 'Continuous Learning'],
    'All': ['Coding', 'Technical Skills', 'Software Development'], // Default/fallback
  };
  return skillSets[category] || skillSets['All'];
};


const BadgesCertificates = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const modelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false); // Ref to track dragging state for touch

  // Animation frames for auto-rotation
  useEffect(() => {
    let animationId: number | null = null;
    if (autoRotate && isPopupOpen && modelRef.current) {
      let angle = Math.atan2(rotateY, rotateX); // Start from current orientation
      const rotateSpeed = 0.4; // Degrees per frame
      const rotate = () => {
        angle += rotateSpeed * (Math.PI / 180);
        // Keep the rotation feeling somewhat contained and natural
        const maxTilt = 15;
        setRotateY(Math.sin(angle) * maxTilt * 0.8); // Slightly different magnitude for Y
        setRotateX(Math.cos(angle) * maxTilt * 0.5); // Slightly different magnitude for X
        animationId = requestAnimationFrame(rotate);
      };
      animationId = requestAnimationFrame(rotate);
    }
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [autoRotate, isPopupOpen, rotateX, rotateY]); // Depend on rotateX/Y to restart from current pos if auto-rotate toggled


  // --- 3D Rotation Logic ---

  const calculateRotation = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    // Use the 3D viewer area dimensions for calculation if possible, otherwise fallback to container
    const viewerRect = modelRef.current?.parentElement?.getBoundingClientRect() || rect;

    const centerX = viewerRect.left + viewerRect.width / 2;
    const centerY = viewerRect.top + viewerRect.height / 2;

    // Increase sensitivity slightly for a more responsive feel
    const sensitivity = 20;
    const newRotateY = ((clientX - centerX) / (viewerRect.width / 2)) * sensitivity;
    const newRotateX = ((clientY - centerY) / (viewerRect.height / 2)) * -sensitivity * 0.8; // Make X rotation slightly less intense

    // Clamp rotation to prevent extreme angles
    const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
    setRotateY(clamp(newRotateY, -35, 35));
    setRotateX(clamp(newRotateX, -25, 25));
  };

  // Handle mouse movement for 3D effect
  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (autoRotate || !containerRef.current) return;
    requestAnimationFrame(() => calculateRotation(e.clientX, e.clientY));
  };

  // Handle touch movement for 3D effect
  const handleTouchMove = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (autoRotate || !containerRef.current || e.touches.length !== 1) return;
    isDragging.current = true; // Indicate dragging started
    requestAnimationFrame(() => calculateRotation(e.touches[0].clientX, e.touches[0].clientY));
  };

  // Reset rotation when not hovering (mouse) or dragging ends (touch)
  const resetRotation = () => {
     if (!autoRotate) {
       // Smoothly transition back to center
       setRotateX(prev => prev * 0.9);
       setRotateY(prev => prev * 0.9);
       if (Math.abs(rotateX) > 0.1 || Math.abs(rotateY) > 0.1) {
         requestAnimationFrame(resetRotation);
       } else {
         setRotateX(0);
         setRotateY(0);
       }
     }
  };

  const handleMouseLeave = () => {
     if (!autoRotate) {
        requestAnimationFrame(resetRotation); // Start smooth reset
     }
  };

  const handleTouchEnd = () => {
    if (!autoRotate && isDragging.current) {
        requestAnimationFrame(resetRotation); // Start smooth reset
    }
    isDragging.current = false; // Reset dragging state
  };

   // --- End 3D Rotation Logic ---

  const badges: Badge[] = [
    {
      id: 1,
      name: 'Data Structures & Algorithms',
      platform: 'HackerRank',
      category: 'DSA',
      issueDate: 'March 2023',
      credentialUrl: 'https://www.hackerrank.com/certificates/sample1',
      logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/hackerrank.svg',
      image: '/api/placeholder/800/600', // Replace with actual image if available
    },
    {
      id: 2,
      name: 'React Developer Certificate',
      platform: 'Coursera',
      category: 'Web Dev',
      issueDate: 'June 2023',
      credentialUrl: 'https://www.coursera.org/account/accomplishments/sample-react',
      logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/coursera.svg',
      image: '/api/placeholder/800/600', // Replace with actual image if available
    },
    {
      id: 3,
      name: 'CodeStorm Hackathon Winner',
      platform: 'GeeksforGeeks',
      category: 'Hackathons',
      issueDate: 'October 2023',
      credentialUrl: 'https://www.geeksforgeeks.org/certificates/sample-cs',
      logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/geeksforgeeks.svg',
      // No image specified, will use placeholder card
    },
    {
      id: 4,
      name: 'Problem Solving (Advanced)',
      platform: 'HackerRank',
      category: 'Achievements',
      issueDate: 'January 2024',
      credentialUrl: 'https://www.hackerrank.com/certificates/sample2',
      logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/hackerrank.svg',
      image: '/api/placeholder/800/600', // Replace with actual image if available
    },
    {
      id: 5,
      name: 'Full Stack Web Development',
      platform: 'Udemy',
      category: 'Web Dev',
      issueDate: 'April 2024',
      credentialUrl: 'https://www.udemy.com/certificate/sample-fs',
      logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/udemy.svg',
      image: '/api/placeholder/800/600', // Replace with actual image if available
    },
    {
      id: 6,
      name: 'AI & ML Fundamentals',
      platform: 'Coursera',
      category: 'Achievements',
      issueDate: 'August 2024',
      credentialUrl: 'https://www.coursera.org/account/accomplishments/sample-ai',
      logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/coursera.svg',
       // No image specified, will use placeholder card
    },
  ];

  const categories = ['All', 'DSA', 'Web Dev', 'Hackathons', 'Achievements'];

  const filteredBadges = badges.filter(
    (badge) => activeCategory === 'All' || badge.category === activeCategory
  );

  const openPopup = (badge: Badge) => {
    setSelectedBadge(badge);
    setIsPopupOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    // Reset rotation state when opening a new popup
    setRotateX(0);
    setRotateY(0);
    setAutoRotate(false); // Default to manual rotation
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    document.body.style.overflow = 'auto'; // Restore scrolling
    setAutoRotate(false); // Ensure auto-rotate is off on close
    // No need to reset selectedBadge here, AnimatePresence handles exit anim
  };

  // Animations
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.08, // Slightly faster stagger
        duration: 0.6,
        type: 'spring',
        stiffness: 80,
        damping: 12,
      },
    }),
    exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.3 } },
    hover: {
      y: -8, // Slightly less lift
      scale: 1.04, // Slightly less scale
      boxShadow: '0 25px 40px rgba(0, 0, 0, 0.4)', // Enhanced shadow
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 40 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        type: 'spring',
        stiffness: 90,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.85,
      y: 40,
      transition: { duration: 0.3, ease: 'easeIn' },
    },
  };

  // Floating particles for background
  const FloatingParticles = ({ count = 30, area = 'section' }: { count?: number, area?: 'section' | 'popup' }) => {
      const particleColor = area === 'popup' ? 'rgba(204, 255, 0, 0.4)' : `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 100)}, ${Math.random() * 0.4 + 0.1})`;
      const particleSizeRange = area === 'popup' ? [1, 3] : [2, 6];
      const durationRange = area === 'popup' ? [15, 30] : [20, 40];
      const travelDistance = area === 'popup' ? 100 : 150;

      return (
          <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
              {Array.from({ length: count }).map((_, i) => {
                  const size = Math.random() * (particleSizeRange[1] - particleSizeRange[0]) + particleSizeRange[0];
                  const duration = Math.random() * (durationRange[1] - durationRange[0]) + durationRange[0];
                  return (
                      <motion.div
                          key={`particle-${area}-${i}`}
                          className="absolute rounded-full"
                          style={{
                              width: size,
                              height: size,
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                              background: particleColor,
                              willChange: 'transform, opacity', // Optimization hint
                          }}
                          animate={{
                              x: [0, Math.random() * travelDistance - travelDistance / 2, 0],
                              y: [0, Math.random() * travelDistance - travelDistance / 2, 0],
                              opacity: [0.1, Math.random() * 0.3 + 0.2, 0.1], // Adjusted opacity
                          }}
                          transition={{
                              duration,
                              repeat: Infinity,
                              ease: 'easeInOut',
                          }}
                      />
                  );
              })}
          </div>
      );
  };

  return (
    <section
      id="badges-certificates"
      className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-[#16161b] to-[#0A0A0F]" // Slightly adjusted dark gradient
      style={{ fontFamily: "'Inter', sans-serif" }} // Using Inter as primary, Space Grotesk for headings
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,30,114,0.15),transparent_75%)] -z-10" />
      <div className="absolute bottom-0 left-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(204,255,0,0.08),transparent_60%)] w-1/2 h-1/2 -z-10" />
      <div className="absolute top-0 right-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,177,0,0.08),transparent_60%)] w-1/2 h-1/2 -z-10" />
      <FloatingParticles count={30} area="section" />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header with Enhanced Animation */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 50 }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
            whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, type: 'spring', stiffness: 100, delay: 0.1 }}
          >
            <Award className="w-14 h-14 md:w-16 md:h-16 text-[#CCFF00] mx-auto" />
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight font-['Space_Grotesk']">
            <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }}>
              Badges
            </motion.span>
            <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.5 }}>
              {" & "}
            </motion.span>
            <motion.span
              className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFB100] via-[#CCFF00] to-[#c0fa00]" // Slightly adjusted gradient
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Certificates
            </motion.span>
          </h2>

          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-[#FFB100] to-[#CCFF00] mx-auto mb-6"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }} // 6rem = 96px
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.9, ease: 'easeOut' }}
          />

          <motion.p
            className="text-base sm:text-lg text-[#C0C0C0] max-w-3xl mx-auto leading-relaxed" // Slightly lighter grey
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            A curated collection of my digital credentials, showcasing continuous learning, key skills, and verified achievements across various platforms.
            <span className="block mt-2 text-sm text-[#CCFF00]/80 font-medium">
              {/* Updated hint for mobile/desktop */}
              Click or tap a badge to explore in interactive 3D view.
            </span>
          </motion.p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              className={`px-4 md:px-5 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 ease-out border ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-[#FFB100] to-[#CCFF00] text-[#1A1A2E] border-transparent shadow-lg shadow-[#CCFF00]/20'
                  : 'bg-[#2a2a38]/40 text-[#E0E0E0] border-[#E0E0E0]/20 hover:bg-[#3a3a4c]/60 hover:border-[#CCFF00]/50 hover:text-white'
              } backdrop-blur-sm`}
              onClick={() => setActiveCategory(category)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.07, duration: 0.4 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout"> {/* popLayout for smoother reordering */}
            {filteredBadges.map((badge, index) => (
              <motion.div
                key={`${activeCategory}-${badge.id}`} // Key includes category for better exit/enter animation on filter change
                layout // Enable layout animation
                className="relative w-full min-h-[260px] sm:min-h-[280px] cursor-pointer group"
                style={{ willChange: 'transform, opacity' }} // Performance hint
                onClick={() => openPopup(badge)}
                variants={cardVariants}
                custom={index}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover="hover"
                layoutId={`badge-container-${badge.id}`} // Unique layoutId
              >
                {/* Card content with improved styling and effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1f1f2b]/70 via-[#1a1a26]/80 to-[#1f1f2b]/70 backdrop-blur-md border border-[#E0E0E0]/15 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 p-5 sm:p-6 flex flex-col items-center justify-between overflow-hidden">

                  {/* Subtle animated border on hover */}
                   <motion.div
                     className="absolute inset-0 border-2 border-transparent rounded-xl pointer-events-none"
                     style={{ willChange: 'border-color' }}
                     variants={{ hover: { borderColor: 'rgba(204, 255, 0, 0.4)' } }}
                     transition={{ duration: 0.4 }}
                   />

                  {/* Top-right subtle glow */}
                   <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-[#CCFF00]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10" />

                  {/* Main Content */}
                  <div className="relative z-10 flex flex-col items-center text-center w-full">
                    <motion.div
                      className="w-14 h-14 sm:w-16 sm:h-16 mb-4 flex items-center justify-center bg-[#2a2a38]/60 rounded-full border border-[#E0E0E0]/20 p-3 shadow-md transition-colors duration-300 group-hover:bg-[#CCFF00]/10 group-hover:border-[#CCFF00]/40"
                      // Removed rotate animation for cleaner look, focusing on overall card hover
                    >
                      <img
                        src={badge.logo}
                        alt={`${badge.platform} logo`}
                        className="w-full h-full object-contain filter brightness-0 invert opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                        loading="lazy"
                        width="48" height="48" // Add dimensions for performance
                      />
                    </motion.div>

                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 font-['Space_Grotesk'] transition-colors duration-300 group-hover:text-[#CCFF00]">{badge.name}</h3>
                    <p className="text-sm text-[#B0B0B0] group-hover:text-[#C8C8C8] transition-colors duration-300">{badge.platform}</p>
                    <div className="mt-3 mb-2 h-px w-12 bg-gradient-to-r from-transparent via-[#CCFF00]/40 to-transparent transition-opacity duration-300 group-hover:via-[#CCFF00]/70" />
                    <p className="text-xs text-[#A0A0A0]">{badge.issueDate}</p>
                  </div>

                  {/* View Details Button */}
                  <motion.div
                    className="mt-4 px-4 py-2 bg-[#2a2a38]/70 text-[#CCFF00] rounded-full text-xs sm:text-sm font-medium border border-[#CCFF00]/30 flex items-center gap-1.5 group-hover:bg-gradient-to-r group-hover:from-[#FFB100]/80 group-hover:to-[#CCFF00]/80 group-hover:text-[#1A1A2E] group-hover:border-transparent group-hover:shadow-md group-hover:shadow-[#CCFF00]/20 transition-all duration-400 ease-out"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }} // Button becomes slightly more opaque on card hover
                  >
                    <Maximize size={14} />
                    View
                  </motion.div>

                   {/* Inner animated particles on hover - subtle */}
                   <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-xl">
                     {Array.from({ length: 10 }).map((_, i) => (
                       <motion.div
                         key={`inner-particle-${i}`}
                         className="absolute w-1 h-1 rounded-full bg-[#CCFF00]/80"
                         initial={{ x: '50%', y: '50%', opacity: 0 }}
                         animate={{
                             x: `${Math.random() * 100}%`,
                             y: `${Math.random() * 100}%`,
                             opacity: [0, 0.6, 0],
                           }}
                         transition={{
                           duration: 1 + Math.random() * 1.5,
                           repeat: Infinity,
                           delay: Math.random() * 1,
                           ease: 'linear'
                         }}
                       />
                     ))}
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state when no badges match filter */}
        <AnimatePresence>
         {filteredBadges.length === 0 && activeCategory !== 'All' && (
           <motion.div
             className="py-16 text-center"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             transition={{ duration: 0.4 }}
           >
             <AwardIcon className="w-16 h-16 text-[#CCFF00]/20 mx-auto mb-4" strokeWidth={1} />
             <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">No Credentials Found</h3>
             <p className="text-[#A0A0A0] mt-2">There are no items matching the '{activeCategory}' category.</p>
             <motion.button
               className="mt-6 px-5 py-2.5 bg-[#2a2a38]/60 text-[#CCFF00] rounded-full text-sm font-semibold border border-[#CCFF00]/30 inline-flex items-center gap-2 backdrop-blur-sm"
               onClick={() => setActiveCategory('All')}
               whileHover={{ scale: 1.05, backgroundColor: 'rgba(204, 255, 0, 0.1)' }}
               whileTap={{ scale: 0.95 }}
             >
               <RotateCcw size={14} />
               Show All
             </motion.button>
           </motion.div>
         )}
        </AnimatePresence>
      </motion.div>

      {/* Dynamic 3D Popup */}
      <AnimatePresence>
        {isPopupOpen && selectedBadge && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md" // Slightly more blur
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup} // Close when clicking backdrop
            key="popup-backdrop"
          >
            <motion.div
              // Added touch handlers here
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              ref={containerRef} // Ref for mouse/touch position calculation
              className="w-full max-w-4xl bg-gradient-to-b from-[#1e1e28] to-[#121218] rounded-xl md:rounded-2xl shadow-2xl relative border border-white/10 overflow-hidden"
              variants={popupVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside popup
              layoutId={`badge-container-${selectedBadge.id}`} // Match layoutId for animation
            >
              {/* Close and Rotate Buttons */}
              <div className="absolute top-3 right-3 z-30 flex gap-2">
                <motion.button
                  className={`w-9 h-9 rounded-full ${autoRotate ? 'bg-[#CCFF00]/20' : 'bg-[#2a2a38]/70'} text-[#CCFF00] flex items-center justify-center backdrop-blur-sm border border-[#CCFF00]/30 transition-colors duration-300`}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(204, 255, 0, 0.3)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); setAutoRotate(!autoRotate); }}
                  title={autoRotate ? "Stop rotation" : "Auto rotate"}
                >
                   {/* Use motion for smooth spin transition */}
                  <motion.div animate={{ rotate: autoRotate ? 360 : 0 }} transition={{ repeat: autoRotate ? Infinity : 0, duration: 2, ease: 'linear' }}>
                    <RotateCcw size={16} />
                  </motion.div>
                </motion.button>
                <motion.button
                  className="w-9 h-9 rounded-full bg-[#2a2a38]/70 text-[#CCFF00] flex items-center justify-center backdrop-blur-sm border border-[#CCFF00]/30"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(204, 255, 0, 0.3)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closePopup}
                  title="Close"
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Popup Content: Vertical on mobile, Horizontal on desktop */}
              <div className="flex flex-col md:flex-row items-stretch max-h-[90vh] md:max-h-[600px] w-full">

                 {/* 3D Certificate Viewer Section */}
                <div className="w-full md:w-3/5 h-[250px] sm:h-[300px] md:h-auto relative bg-[#121218]/70 overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.05),transparent_60%)] pointer-events-none" />
                  <FloatingParticles count={15} area="popup"/>

                  {/* 3D Certificate Container */}
                  <div className="w-full h-full flex items-center justify-center p-4 sm:p-6 md:p-8 relative perspective">
                    <motion.div
                      ref={modelRef} // Ref for the rotating element
                      className="w-full h-full relative shadow-xl"
                      style={{
                        transformStyle: 'preserve-3d',
                        // Apply rotation state directly
                        rotateX: rotateX,
                        rotateY: rotateY,
                        // Use transition prop for smoother manual rotation
                        transition: autoRotate ? 'none' : 'transform 0.1s linear', // No transition during auto-rotate
                        willChange: 'transform', // Performance hint
                      }}
                    >
                      {/* Front Face (Image or Placeholder) */}
                      <div
                        className={`w-full h-full flex items-center justify-center rounded-md md:rounded-lg overflow-hidden border-2 ${selectedBadge.image ? 'border-[#CCFF00]/20 bg-black/20' : 'border-[#CCFF00]/30 bg-[#181820]/70'} p-1`}
                        style={{
                          transform: 'translateZ(1px)', // Bring front face slightly forward
                          boxShadow: '0 0 25px rgba(0, 0, 0, 0.5), 0 0 10px rgba(204, 255, 0, 0.1) inset',
                        }}
                      >
                        {selectedBadge.image ? (
                          <img
                            src={selectedBadge.image}
                            alt={`${selectedBadge.name} certificate preview`}
                            className="max-w-full max-h-full object-contain"
                            loading="eager" // Load popup image eagerly
                          />
                        ) : (
                          // Enhanced Placeholder Card
                          <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 md:p-6 bg-gradient-to-br from-[#1f1f2b]/50 to-[#2a2a38]/50 rounded">
                             <img
                                src={selectedBadge.logo}
                                alt={`${selectedBadge.platform} logo`}
                                className="w-16 h-16 sm:w-20 sm:h-20 mb-4 filter brightness-0 invert opacity-60"
                                width="80" height="80"
                              />
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-1 font-['Space_Grotesk']">
                               {selectedBadge.name}
                             </h3>
                             <div className="w-16 h-0.5 bg-gradient-to-r from-[#FFB100]/50 to-[#CCFF00]/50 mb-2" />
                             <p className="text-sm text-white/70 mb-1">Issued by {selectedBadge.platform}</p>
                             <p className="text-xs text-white/50">{selectedBadge.issueDate}</p>
                             <p className="text-xs text-[#CCFF00]/60 mt-3">(Visual Preview Unavailable)</p>
                           </div>
                        )}
                        {/* Subtle reflection for image */}
                        {selectedBadge.image && <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />}
                      </div>

                      {/* Back Face (Simulated Thickness) */}
                      <div
                        className="absolute inset-0 border-2 border-[#CCFF00]/20 rounded-md md:rounded-lg bg-[#101015]"
                        style={{
                          transform: 'translateZ(-4px)', // Push back face behind
                          boxShadow: '0 0 20px rgba(0, 0, 0, 0.6)',
                        }}
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Certificate Details Section */}
                <div className="w-full md:w-2/5 p-5 sm:p-6 md:p-8 overflow-y-auto flex-shrink md:flex-shrink-0 bg-[#16161b]">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 font-['Space_Grotesk'] leading-tight">
                      {selectedBadge.name}
                    </h2>

                    <div className="space-y-4 sm:space-y-5">
                      {/* Platform Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#2a2a38]/60 flex items-center justify-center border border-[#E0E0E0]/20 flex-shrink-0">
                          <img
                            src={selectedBadge.logo}
                            alt={`${selectedBadge.platform} logo`}
                            className="w-6 h-6 sm:w-7 sm:h-7 filter brightness-0 invert opacity-80"
                            width="28" height="28"
                          />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-white leading-tight">{selectedBadge.platform}</h3>
                          <p className="text-xs sm:text-sm text-[#A0A0A0]">Issuing Authority</p>
                        </div>
                      </div>

                      {/* Issue Date & Category Box */}
                      <div className="py-2.5 px-4 rounded-lg bg-[#2a2a38]/40 border border-[#E0E0E0]/15">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[11px] sm:text-xs font-medium text-[#CCFF00]/80 tracking-wide uppercase">Issued</span>
                          <span className="text-[11px] sm:text-xs text-white/60 px-2 py-0.5 bg-white/10 rounded">
                            {selectedBadge.category}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium text-sm sm:text-base">{selectedBadge.issueDate}</span>
                           {/* Animated Award Icon */}
                          <motion.div
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#CCFF00]/15 flex items-center justify-center border border-[#CCFF00]/30"
                            animate={{
                              scale: [1, 1.1, 1],
                              boxShadow: ['0 0 0px rgba(204, 255, 0, 0.3)', '0 0 8px rgba(204, 255, 0, 0.5)', '0 0 0px rgba(204, 255, 0, 0.3)']
                            }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            <Award size={12} className="text-[#CCFF00]" />
                          </motion.div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-white/90">Description</h4>
                        <p className="text-xs sm:text-sm text-[#B0B0B0] leading-relaxed">
                           This credential from <span className='font-medium text-white/80'>{selectedBadge.platform}</span> signifies successful completion and demonstrated proficiency in {selectedBadge.name.toLowerCase()}. It represents a commitment to skill development in the {selectedBadge.category} domain.
                        </p>
                      </div>

                      {/* Skills */}
                      <div className="pt-1">
                        <h4 className="text-sm font-semibold text-white/90 mb-2">Related Skills</h4>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {generateSkillsFromCategory(selectedBadge.category).map((skill, index) => (
                            <motion.span
                              key={skill+index}
                              className="px-2.5 py-1 bg-[#2a2a38]/50 text-[#C0C0C0] rounded-full text-[11px] sm:text-xs border border-[#E0E0E0]/15 transition-colors duration-200"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                              whileHover={{
                                backgroundColor: 'rgba(204, 255, 0, 0.15)',
                                color: '#FFFFFF',
                                borderColor: 'rgba(204, 255, 0, 0.4)',
                                scale: 1.03
                              }}
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 sm:mt-8">
                      <motion.a
                        href={selectedBadge.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-[#FFB100] to-[#CCFF00] text-[#1A1A2E] rounded-full text-sm sm:text-base font-semibold hover:shadow-lg hover:shadow-[#CCFF00]/25 transition-all duration-300 ease-out"
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Verify Credential <ExternalLink size={16} className="ml-1.5" />
                      </motion.a>
                    </div>
                  </motion.div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Basic responsive CSS & perspective */}
      <style jsx>{`
        .perspective {
          perspective: 1000px; /* Adjust perspective depth */
        }
        /* Ensure smooth scrolling on detail pane if needed */
        .overflow-y-auto::-webkit-scrollbar {
            width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
            background: rgba(204, 255, 0, 0.3);
            border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
            background: rgba(204, 255, 0, 0.5);
        }

        /* Add touch-action for better scroll/drag handling on touch devices */
        .perspective > div { /* The motion.div holding the 3D model */
           touch-action: none; /* Prevent browser default scrolling/gestures when dragging the model */
        }

      `}</style>
    </section>
  );
};

export default BadgesCertificates;
