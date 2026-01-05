import { useState, useMemo, useCallback, memo, useRef, useEffect } from 'react';
import { Award, X, ExternalLink, FileText, CheckCircle, Eye, Zap, Star, Globe, Code, Database, Cloud, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

interface Badge {
  id: number;
  name: string;
  platform: string;
  category: string;
  issueDate: string;
  credentialUrl: string;
  logo: string;
  image?: string;
  pdf?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  skills?: string[];
  color?: string;
}

const categoryIcons = {
  'AI': Brain,
  'Coding': Code,
  'Programming': Code,
  'Web Dev': Globe,
  'DSA': Database,
  'Cloud': Cloud,
  'Data Science': Database
};

const categoryColors = {
  'AI': 'from-purple-500/20 to-pink-500/20',
  'Coding': 'from-green-500/20 to-blue-500/20',
  'Programming': 'from-blue-500/20 to-cyan-500/20',
  'Web Dev': 'from-orange-500/20 to-red-500/20',
  'DSA': 'from-yellow-500/20 to-orange-500/20',
  'Cloud': 'from-cyan-500/20 to-blue-500/20',
  'Data Science': 'from-indigo-500/20 to-purple-500/20'
};

// Enhanced Badge Card with glassmorphism design
const BadgeCard = memo(({ badge, index, onClick }: { badge: Badge; index: number; onClick: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }
    setIsHovered(false);
  }, []);

  const CategoryIcon = categoryIcons[badge.category as keyof typeof categoryIcons] || Star;

  return (
    <div
      ref={cardRef}
      className={`group relative overflow-hidden rounded-2xl transition-all duration-500 ease-out cursor-pointer
        ${isHovered ? 'scale-105' : 'scale-100'}
        before:absolute before:inset-0 before:bg-gradient-to-br ${categoryColors[badge.category as keyof typeof categoryColors] || 'from-gray-500/20 to-gray-600/20'}
        before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100`}
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        animationDelay: `${index * 50}ms`
      }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      <div className="relative p-6 h-full flex flex-col">
        {/* Header with logo and level */}
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <img
                src={badge.logo || '/api/placeholder/40/40'}
                alt={`${badge.platform} logo`}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <CategoryIcon className="w-8 h-8 text-white/80 hidden" />
            </div>
            {badge.level && (
              <div className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-xs font-bold text-black">
                {badge.level[0]}
              </div>
            )}
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Eye className="w-5 h-5 text-white/60" />
          </div>
        </div>

        {/* Badge info */}
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2 group-hover:text-yellow-300 transition-colors duration-300">
            {badge.name}
          </h3>
          <p className="text-white/60 text-sm mb-3">{badge.platform}</p>
          <p className="text-white/40 text-xs mb-4">{badge.issueDate}</p>
        </div>

        {/* Skills tags */}
        {badge.skills && badge.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {badge.skills.slice(0, 3).map((skill, i) => (
              <span
                key={skill}
                className="px-2 py-1 bg-white/10 text-white/80 rounded-md text-xs border border-white/20 
                  hover:bg-white/20 transition-colors duration-200"
                style={{ animationDelay: `${(index * 50) + (i * 100)}ms` }}
              >
                {skill}
              </span>
            ))}
            {badge.skills.length > 3 && (
              <span className="px-2 py-1 bg-white/5 text-white/60 rounded-md text-xs">
                +{badge.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Action indicator */}
        <div className="flex items-center justify-between text-xs text-white/40 group-hover:text-white/80 transition-colors duration-300">
          <span>Click to view</span>
          <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center group-hover:border-yellow-400 transition-colors duration-300">
            <div className="w-2 h-2 bg-white/40 rounded-full group-hover:bg-yellow-400 transition-colors duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
});

// Enhanced Popup with 3D toggle
const BadgePopup = memo(({ badge, isOpen, closePopup }: { badge: Badge; isOpen: boolean; closePopup: () => void }) => {
  const [is3DEnabled, setIs3DEnabled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const previewRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!is3DEnabled || !previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 10;
    const y = (e.clientY - rect.top - rect.height / 2) / 10;
    setMousePos({ x, y });
  }, [is3DEnabled]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={closePopup}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <img
                src={badge.logo || '/api/placeholder/32/32'}
                alt={`${badge.platform} logo`}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">{badge.name}</h2>
              <p className="text-white/60">{badge.platform}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* 3D Toggle */}
            <button
              onClick={() => setIs3DEnabled(!is3DEnabled)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                is3DEnabled 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">3D View</span>
            </button>
            
            {/* External link */}
            <a
              href={badge.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors duration-300"
            >
              <ExternalLink className="w-5 h-5 text-white" />
            </a>
            
            {/* Close button */}
            <button
              onClick={closePopup}
              className="p-2 bg-white/10 hover:bg-red-500/20 rounded-xl transition-colors duration-300"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Preview Section */}
            <div className="lg:col-span-2">
              <div
                ref={previewRef}
                className="relative aspect-[4/3] bg-gradient-to-br from-white/5 to-white/10 rounded-2xl overflow-hidden border border-white/10"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
                style={is3DEnabled ? {
                  transform: `perspective(1000px) rotateX(${-mousePos.y}deg) rotateY(${mousePos.x}deg)`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.1s ease-out'
                } : {}}
              >
                {badge.image ? (
                  <img
                    src={badge.image}
                    alt={`${badge.name} certificate`}
                    className="w-full h-full object-contain p-4"
                    style={is3DEnabled ? {
                      transform: 'translateZ(50px)',
                      filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))'
                    } : {}}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                      <Award className="w-10 h-10 text-white/60" />
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-2">{badge.name}</h3>
                    <p className="text-white/60">{badge.platform}</p>
                  </div>
                )}
                
                {/* 3D indicator */}
                {is3DEnabled && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-medium text-white">
                    3D Active
                  </div>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-6">
              {/* Details */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Verification Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-white/60">Issue Date:</span>
                    <span className="text-white ml-2">{badge.issueDate}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Category:</span>
                    <span className="text-white ml-2">{badge.category}</span>
                  </div>
                  {badge.level && (
                    <div>
                      <span className="text-white/60">Level:</span>
                      <span className="text-white ml-2">{badge.level}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills */}
              {badge.skills && badge.skills.length > 0 && (
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-white font-semibold mb-4">Skills Covered</h3>
                  <div className="flex flex-wrap gap-2">
                    {badge.skills.map((skill, i) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white/90 rounded-lg text-sm border border-white/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <a
                  href={badge.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Credential
                </a>
                
                {badge.pdf && (
                  <a
                    href={badge.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 border border-white/20"
                  >
                    <FileText className="w-4 h-4" />
                    Download PDF
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Main Component
const BadgesCertificates = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const badges: Badge[] = useMemo(() => [
    {
      id: 1,
      name: 'Google AI Essentials',
      platform: 'Google',
      category: 'AI',
      issueDate: 'Jun 2024',
      credentialUrl: 'https://grow.google/certificates/ai-essentials',
      logo: '/api/placeholder/40/40',
      image: '/api/placeholder/400/300',
      pdf: '#',
      level: 'Beginner',
      skills: ['AI Fundamentals', 'Machine Learning', 'Python'],
    },
    {
      id: 2,
      name: '100 Days Badge',
      platform: 'LeetCode',
      category: 'Coding',
      issueDate: 'Apr 2024',
      credentialUrl: 'https://leetcode.com/profile',
      logo: '/api/placeholder/40/40',
      image: '/api/placeholder/400/300',
      level: 'Intermediate',
      skills: ['Algorithms', 'Data Structures', 'Problem Solving'],
    },
    {
      id: 3,
      name: '100 Days Coding Streak',
      platform: 'CodeChef',
      category: 'Coding',
      issueDate: 'Mar 2024',
      credentialUrl: 'https://codechef.com/certificates',
      logo: '/api/placeholder/40/40',
      image: '/api/placeholder/400/300',
      level: 'Intermediate',
      skills: ['Competitive Programming', 'C++', 'Algorithms'],
    },
    {
      id: 4,
      name: 'C++ Skills Certification',
      platform: 'HackerRank',
      category: 'Programming',
      issueDate: 'Feb 2024',
      credentialUrl: 'https://hackerrank.com/certificates/cpp',
      logo: '/api/placeholder/40/40',
      image: '/api/placeholder/400/300',
      pdf: '#',
      level: 'Advanced',
      skills: ['C++', 'STL', 'OOP'],
    },
    {
      id: 5,
      name: 'Full Stack Development',
      platform: 'freeCodeCamp',
      category: 'Web Dev',
      issueDate: 'Jan 2024',
      credentialUrl: 'https://freecodecamp.org/certification/full-stack',
      logo: '/api/placeholder/40/40',
      image: '/api/placeholder/400/300',
      level: 'Intermediate',
      skills: ['React', 'Node.js', 'MongoDB', 'Express'],
    },
    {
      id: 6,
      name: 'MERN Stack Developer',
      platform: 'Udemy',
      category: 'Web Dev',
      issueDate: 'Dec 2023',
      credentialUrl: 'https://udemy.com/certificate/mern',
      logo: '/api/placeholder/40/40',
      image: '/api/placeholder/400/300',
      pdf: '#',
      level: 'Intermediate',
      skills: ['MongoDB', 'Express', 'React', 'Node.js'],
    },
    {
      id: 7,
      name: 'JavaScript Algorithms and Data Structures',
      platform: 'freeCodeCamp',
      category: 'Programming',
      issueDate: 'Nov 2023',
      credentialUrl: 'https://freecodecamp.org/certification/javascript',
      logo: '/api/placeholder/40/40',
      image: '/api/placeholder/400/300',
      level: 'Intermediate',
      skills: ['JavaScript', 'Algorithms', 'ES6'],
    },
    {
      id: 8,
      name: 'Data Structures and Algorithms',
      platform: 'CodeChef',
      category: 'DSA',
      issueDate: 'Oct 2023',
      credentialUrl: 'https://codechef.com/certifications/dsa',
      logo: '/api/placeholder/40/40',
      image: '/api/placeholder/400/300',
      level: 'Advanced',
      skills: ['Linked Lists', 'Trees', 'Dynamic Programming'],
    },
    {
      id: 9,
      name: 'AWS Certified Developer',
      platform: 'Amazon',
      category: 'Cloud',
      issueDate: 'Sep 2023',
      credentialUrl: 'https://aws.amazon.com/certification/developer',
      logo: '/api/placeholder/40/40',
      image: '/api/placeholder/400/300',
      pdf: '#',
      level: 'Intermediate',
      skills: ['AWS', 'Lambda', 'DynamoDB'],
    },
    {
      id: 10,
      name: 'Python for Data Science',
      platform: 'Coursera',
      category: 'Data Science',
      issueDate: 'Aug 2023',
      credentialUrl: 'https://coursera.org/certificate/python-data-science',
      logo: '/api/placeholder/40/40',
      image: '/api/placeholder/400/300',
      pdf: '#',
      level: 'Beginner',
      skills: ['Python', 'Pandas', 'NumPy'],
    },
  ], []);

  const categories = ['All', 'AI', 'Coding', 'Programming', 'Web Dev', 'DSA', 'Cloud', 'Data Science'];
  const filteredBadges = useMemo(() => 
    badges.filter(b => activeCategory === 'All' || b.category === activeCategory), 
    [badges, activeCategory]
  );

  const openPopup = useCallback((badge: Badge) => {
    setSelectedBadge(badge);
    setIsPopupOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setIsPopupOpen(false);
    setSelectedBadge(null);
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-5xl font-bold mb-6 relative inline-block font-['Inter']">
  <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400 px-4 py-2 rounded-xl shadow-[0_6px_16px_rgba(168,85,247,0.5)]">
    Badges & Certifications
  </span>
  <motion.span 
   className="absolute -inset-3 blur-3xl opacity-60 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400 rounded-xl -z-10"
    animate={{ 
       opacity: [0.4, 0.9, 0.4],
      scale: [1, 1.08, 1],
      rotate: [0, 2, -2, 0],
      boxShadow: [
        '6px 6px 20px rgba(168,85,247,0.4)',     // purple-500
        '8px 8px 28px rgba(232,121,249,0.6)',    // fuchsia-500
        '6px 6px 20px rgba(34,211,238,0.4)',     // cyan-400
        '6px 6px 20px rgba(168,85,247,0.4)'
      ],
      backgroundPosition: ['0% center', '100% center', '0% center']
    }}
    transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
  />
</h1>

          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Explore my professional certifications and achievements across various technologies and platforms
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => {
            const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons] || Star;
            return (
              <button
                key={category}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category !== 'All' && <CategoryIcon className="w-4 h-4" />}
                {category}
              </button>
            );
          })}
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredBadges.map((badge, index) => (
            <BadgeCard 
              key={badge.id} 
              badge={badge} 
              index={index} 
              onClick={() => openPopup(badge)} 
            />
          ))}
        </div>

        {filteredBadges.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-2xl flex items-center justify-center">
              <Award className="w-12 h-12 text-white/40" />
            </div>
            <p className="text-white/60 text-lg">No badges found in this category</p>
          </div>
        )}
      </div>

      {/* Enhanced Popup */}
      {selectedBadge && (
        <BadgePopup
          badge={selectedBadge}
          isOpen={isPopupOpen}
          closePopup={closePopup}
        />
      )}
    </section>
  );
};

export default BadgesCertificates;