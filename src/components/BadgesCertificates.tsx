import { useState, useRef } from 'react';
import { Award, ExternalLink, Code, Brain, Globe, Database, Cloud, GraduationCap } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

interface Badge {
  id: number;
  name: string;
  platform: string;
  category: string;
  issueDate: string;
  credentialUrl: string;
  skills?: string[];
}

const categoryIcons = {
  'AI': Brain,
  'Coding': Code,
  'Programming': Code,
  'Web Dev': Globe,
  'DSA': Database,
  'Cloud': Cloud,
  'Academic': GraduationCap,
};

const BadgesCertificates = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const badges: Badge[] = [
    // Achievements & Milestones
    { id: 1, name: 'First Prize – College Hackathon', platform: 'Amity University', category: 'Coding', issueDate: '2024', credentialUrl: '#', skills: ['Innovation', 'Teamwork'] },
    { id: 2, name: '250+ DSA Problems Solved', platform: 'LeetCode + GFG + CodeChef', category: 'Coding', issueDate: '2024', credentialUrl: 'https://leetcode.com/u/nikhil_888/', skills: ['Algorithms', 'Problem Solving'] },
    { id: 3, name: '4,500+ GitHub Contributions', platform: 'GitHub', category: 'Coding', issueDate: '2024-2026', credentialUrl: 'https://github.com/nikhiljangid120', skills: ['Open Source', 'Consistency'] },
    { id: 4, name: 'GirlScript Summer of Code', platform: 'GSSoC', category: 'Coding', issueDate: '2024', credentialUrl: '#', skills: ['Open Source', 'Collaboration'] },
    // AI & Technology
    { id: 5, name: 'IBM SkillsBuild AI', platform: 'IBM', category: 'AI', issueDate: '2024', credentialUrl: '#', skills: ['AI Fundamentals', 'Machine Learning'] },
    { id: 6, name: 'McKinsey Forward Program', platform: 'McKinsey & Company', category: 'Academic', issueDate: '2024', credentialUrl: '#', skills: ['Business Thinking', 'Leadership'] },
    { id: 7, name: 'Google AI Essentials', platform: 'Google', category: 'AI', issueDate: 'Jun 2024', credentialUrl: '#', skills: ['AI Fundamentals', 'Machine Learning'] },
    { id: 8, name: 'Prompt Engineering', platform: 'DeepLearning.AI', category: 'AI', issueDate: 'May 2024', credentialUrl: '#', skills: ['LLM', 'Prompt Design'] },
    // Coding Achievements
    { id: 9, name: '100 Days Badge', platform: 'LeetCode', category: 'Coding', issueDate: 'Apr 2024', credentialUrl: 'https://leetcode.com/u/nikhil_888/', skills: ['DSA', 'Problem Solving'] },
    { id: 10, name: '3⭐ Coder', platform: 'CodeChef', category: 'Coding', issueDate: '2024', credentialUrl: 'https://www.codechef.com/users/nikhil_139/', skills: ['Algorithms'] },
    // Programming Certifications
    { id: 11, name: 'C++ Skills Certification', platform: 'HackerRank', category: 'Programming', issueDate: 'Feb 2024', credentialUrl: '#', skills: ['C++', 'OOP'] },
    { id: 12, name: 'JavaScript Algorithms', platform: 'freeCodeCamp', category: 'Programming', issueDate: 'Nov 2023', credentialUrl: '#', skills: ['JavaScript', 'ES6'] },
    // Web Development
    { id: 13, name: 'Full Stack Development', platform: 'freeCodeCamp', category: 'Web Dev', issueDate: 'Jan 2024', credentialUrl: '#', skills: ['React', 'Node.js'] },
    { id: 14, name: 'Three Software Engineering Internships', platform: 'InternPe · Celebal · Wisflux', category: 'Academic', issueDate: '2024-2026', credentialUrl: '#', skills: ['Backend', 'Full Stack'] },
  ];

  const categories = ['All', 'Coding', 'Programming', 'AI', 'Web Dev', 'DSA', 'Cloud'];
  const filteredBadges = activeCategory === 'All'
    ? badges
    : badges.filter(b => b.category === activeCategory);

  return (
    <section id="badges" ref={ref} className="py-20 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-2 text-primary mb-4 font-mono">
            <Award className="w-5 h-5" />
            <span>~/achievements</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Achievements &</span> <span className="text-primary opacity-80">Certifications</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl">
            Milestones, certifications, and recognitions earned throughout the engineering journey.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap gap-2 mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {categories.map((category) => {
            const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons] || Award;
            return (
              <button
                key={category}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${activeCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card/50 text-muted-foreground hover:bg-card border border-border'
                  }`}
                onClick={() => setActiveCategory(category)}
              >
                {category !== 'All' && <CategoryIcon className="w-4 h-4" />}
                {category}
                {category === 'All' && <span className="text-xs opacity-70">({badges.length})</span>}
              </button>
            );
          })}
        </motion.div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBadges.map((badge, index) => {
            const CategoryIcon = categoryIcons[badge.category as keyof typeof categoryIcons] || Award;
            return (
              <motion.a
                key={badge.id}
                href={badge.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 bg-card/50 border border-border rounded-xl hover:border-primary/50 hover:bg-card transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -3 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CategoryIcon className="w-4 h-4 text-primary" />
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
                  {badge.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{badge.platform}</p>
                <p className="text-xs text-muted-foreground/70">{badge.issueDate}</p>

                {badge.skills && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {badge.skills.slice(0, 2).map((skill) => (
                      <span key={skill} className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </motion.a>
            );
          })}
        </div>

        {filteredBadges.length === 0 && (
          <div className="text-center py-12">
            <Award className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">No badges found in this category</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BadgesCertificates;