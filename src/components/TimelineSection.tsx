
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, Briefcase, Award, Calendar } from 'lucide-react';

interface TimelineItem {
  year: string;
  title: string;
  organization: string;
  description: string;
  type: 'education' | 'experience' | 'achievement';
}

const TimelineSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const timelineItems: TimelineItem[] = [
    {
      year: "2021 - Present",
      title: "B.Tech in Computer Science & Engineering",
      organization: "Engineering College, Rajasthan",
      description: "Currently pursuing my bachelor's degree with a focus on algorithms, data structures, and web development technologies.",
      type: "education"
    },
    {
      year: "2023",
      title: "Web Development Intern",
      organization: "Tech Startup",
      description: "Worked on developing responsive web applications using React.js and Node.js, implementing RESTful APIs and user authentication systems.",
      type: "experience"
    },
    {
      year: "2022",
      title: "National Coding Competition Finalist",
      organization: "TechFest 2022",
      description: "Secured a position in the finals of a national-level coding competition, showcasing problem-solving skills and algorithmic thinking.",
      type: "achievement"
    },
    {
      year: "2021",
      title: "Senior Secondary Education",
      organization: "Senior Secondary School, Rajasthan",
      description: "Completed senior secondary education with a focus on Mathematics and Computer Science, graduating with high honors.",
      type: "education"
    },
    {
      year: "2020",
      title: "Web Design Contest Winner",
      organization: "Regional Tech Symposium",
      description: "Won first place in a regional web design competition for creating an innovative and accessible educational platform interface.",
      type: "achievement"
    }
  ];
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'education':
        return <GraduationCap className="w-4 h-4 text-white" />;
      case 'experience':
        return <Briefcase className="w-4 h-4 text-white" />;
      case 'achievement':
        return <Award className="w-4 h-4 text-white" />;
      default:
        return <Calendar className="w-4 h-4 text-white" />;
    }
  };
  
  const getGradient = (type: string) => {
    switch (type) {
      case 'education':
        return 'from-teal to-lime';
      case 'experience':
        return 'from-purple to-teal';
      case 'achievement':
        return 'from-orange to-gold';
      default:
        return 'from-teal to-lime';
    }
  };
  
  return (
    <section id="timeline" ref={ref} className="py-20 relative overflow-hidden bg-gradient-to-b from-charcoal/80 to-inkyblack/80">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,23,96,0.2),transparent_70%)] -z-10" />
      
      <motion.div 
        className="section-container"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Journey</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-purple to-teal mx-auto mb-8" />
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            The path that has shaped my skills and experiences in technology and development.
          </p>
        </motion.div>
        
        <div className="relative max-w-3xl mx-auto pl-8 sm:pl-12 border-l-2 border-muted">
          {timelineItems.map((item, index) => (
            <motion.div
              key={index}
              className="mb-12 relative"
              variants={itemVariants}
              custom={index}
            >
              <div className={`timeline-dot bg-gradient-to-r ${getGradient(item.type)}`}>
                {getIcon(item.type)}
              </div>
              
              <div className="card-3d p-6 ml-6 bg-charcoal/50">
                <div className="flex flex-col sm:flex-row sm:items-center mb-2 sm:mb-4 justify-between">
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <span className="text-sm text-lime flex items-center sm:ml-4">
                    <Calendar className="w-4 h-4 mr-1" /> {item.year}
                  </span>
                </div>
                <h4 className="text-gray-300 font-medium mb-3">{item.organization}</h4>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default TimelineSection;
