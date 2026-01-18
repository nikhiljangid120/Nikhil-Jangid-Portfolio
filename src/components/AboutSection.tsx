import { useRef, useState, useEffect, useMemo, useCallback, useReducer, memo } from 'react';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import { Code, ShieldCheck, Database, Lightbulb, Github, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card';
import { throttle } from 'lodash';
import { flushSync } from 'react-dom';

interface Sparkle {
  id: number;
  size: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

interface SocialLink {
  icon: JSX.Element;
  href: string;
  label: string;
}

interface PhilosophyPoint {
  icon: JSX.Element;
  title: string;
  description: string;
  color: string;
}

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  isTyping?: boolean;
}

interface ChatState {
  messages: ChatMessage[];
  input: string;
  responseHistory: { [key: string]: number };
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: { text: string; isUser: boolean; isTyping?: boolean } }
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'CLEAR_INPUT' }
  | { type: 'INCREMENT_RESPONSE'; payload: string }
  | { type: 'FINISH_TYPING'; payload: number };

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, { id: state.messages.length, ...action.payload }],
      };
    case 'SET_INPUT':
      return { ...state, input: action.payload };
    case 'CLEAR_INPUT':
      return { ...state, input: '' };
    case 'INCREMENT_RESPONSE':
      return {
        ...state,
        responseHistory: {
          ...state.responseHistory,
          [action.payload]: (state.responseHistory[action.payload] || 0) + 1,
        },
      };
    case 'FINISH_TYPING':
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.payload ? { ...msg, isTyping: false } : msg
        ),
      };
    default:
      return state;
  }
};

// Typing Effect Component
const TypingEffect = memo(({ text, messageId, dispatch }: { text: string; messageId: number; dispatch: React.Dispatch<ChatAction> }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const speed = Math.random() * 20 + 10; // Variable typing speed (10-30ms)
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      dispatch({ type: 'FINISH_TYPING', payload: messageId });
    }
  }, [index, text, messageId, dispatch]);

  return (
    <span className="relative">
      {displayedText}
      {index < text.length && <span className="inline-block w-1 h-4 bg-lime animate-blink ml-1 align-middle" />}
    </span>
  );
});

// Thinking Indicator Component
const ThinkingIndicator = memo(() => (
  <div className="flex items-center gap-1.5 px-3 py-2">
    <span className="text-gray-400 text-sm">Thinking</span>
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 bg-lime rounded-full"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
        />
      ))}
    </div>
  </div>
));

// Gemini API Key (hardcoded as requested)
const GEMINI_API_KEY = 'AIzaSyD7Gw3UWDbWe0BxXhUk9oM56dc13VLLGVM';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const controls = useAnimation();
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [showBadge, setShowBadge] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [chatState, dispatch] = useReducer(chatReducer, { messages: [], input: '', responseHistory: {} });
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Throttle mouse move with requestAnimationFrame
  const handleMouseMove = useCallback(
    throttle((e: React.MouseEvent<HTMLDivElement>) => {
      requestAnimationFrame(() => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      });
    }, 16),
    []
  );

  // Simplified time-based greeting
  const getTimeGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning! How can I assist you with Nikhil’s portfolio today?';
    if (hour < 18) return 'Good afternoon! Ready to explore Nikhil’s projects?';
    return 'Good evening! Want to learn about Nikhil’s work?';
  }, []);

  // Gemini API call
  const fetchGeminiResponse = useCallback(async (query: string, isHumorous: boolean): Promise<string> => {
    try {
      const tone = isHumorous ? 'witty and humorous' : 'professional and concise';
      const systemContext = `You are JARVIS 2.0, Nikhil Jangid's AI assistant for his portfolio website.

About Nikhil:
- 21-year-old Final-year B.Tech CSE student at Amity University, Rajasthan
- CGPA: ~8.36-8.39, Graduation Year: 2026
- Location: Jaipur, Rajasthan
- Focus: Frontend & Full-Stack Development with AI-powered product building
- Self-driven, project-first developer who prioritizes building real, usable products

Core Skills:
- JavaScript (ES6+), React.js, Next.js (App Router, SSR/SSG)
- HTML, CSS, Tailwind CSS, REST API integration
- LLM API integration (Gemini, OpenAI), Prompt engineering
- MongoDB, MySQL, Firebase, Basic Node.js, Python (basic)
- Git & GitHub, 400+ DSA problems solved

Key Projects:
- AI Resume Builder: Next.js + Gemini API, ATS-focused resume optimization
- AI Fitness Platform: AI-powered fitness & nutrition planning
- AI Code Analyzer: LLM-based code analysis and visualization
- Flyeng Career (ongoing): AI-powered career and portfolio platform

Achievements:
- Solved 400+ DSA problems, Top 10% rankings in coding contests
- 22-week continuous coding challenge (160+ days)
- Multiple AI and technology certifications

Work Style: Prefers ownership over instructions, thrives in fast-moving environments, learns by building.`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemContext}\n\nRespond to the query "${query}" in a ${tone} tone. Keep it under 80 words, highly relevant to his portfolio, and end with an engaging question. Avoid generic filler.`,
                },
              ],
            },
          ],
        }),
      });

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || `System busy. Try asking about his AI Resume Builder or React skills!`;
    } catch (error) {
      console.error('Gemini API error:', error);
      return `Connection interrupted. Want to explore his projects manually?`;
    }
  }, []);

  // Handle query with optimized submission
  const handleQuery = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      flushSync(() => {
        dispatch({ type: 'ADD_MESSAGE', payload: { text: query, isUser: true } });
      });

      // Show thinking indicator immediately
      setIsThinking(true);

      const lowerQuery = query.toLowerCase().trim();
      dispatch({ type: 'INCREMENT_RESPONSE', payload: lowerQuery });

      const isHumorous = lowerQuery.includes('joke') || lowerQuery.includes('funny') || lowerQuery.includes('haha') || lowerQuery.includes('tease');
      const responseCount = chatState.responseHistory[lowerQuery] || 0;

      const responses: { [key: string]: string[] } = {
        'who are you|what\'s your name|who\'s the human': [
          `${getTimeGreeting()} I'm JARVIS 2.0. Nikhil Jangid is a 21-year-old Final Year CSE undergrad from Jaipur with a CGPA of 8.36+. He builds AI-powered products like the AI Resume Builder. What can I show you?`,
          `Nikhil Jangid is a 21-year-old Full Stack dev and AI enthusiast in his final year at Amity University (2026). I'm his digital assistant. Want to see his AI projects?`,
          `I'm JARVIS 2.0. Nikhil is a 21-year-old coder from Jaipur, crushing it in his final year with 400+ DSA problems solved and projects like AI Fitness Platform. Check out his GitHub?`,
        ],
        'skills|what can you do|technologies': [
          `Nikhil's core stack: React.js, Next.js, JavaScript, Tailwind CSS. He builds AI-powered products using Gemini & OpenAI APIs. Also solid in MongoDB, Firebase, and has 400+ DSA problems under his belt. Want details on any specific skill?`,
          `Frontend wizard with React & Next.js, AI integration expert (LLMs, prompt engineering), and a consistent problem solver. No fluff - just real, deployed projects. Which area interests you?`,
        ],
        'projects|work|portfolio': [
          `Top projects: AI Resume Builder (ATS optimization), AI Fitness Platform (nutrition planning), AI Code Analyzer (code visualization). All deployed and live! Which one would you like to explore?`,
          `Nikhil ships real products, not tutorials. His AI Resume Builder helps job seekers, the Fitness Platform plans workouts, and the Code Analyzer helps devs. Interested in the tech behind any of these?`,
        ],
        'contact|hire|email': [
          `Want to connect? Email: nikhiljangid343@gmail.com. LinkedIn: linkedin.com/in/nikhil-jangid-b84360264. He's actively looking for Frontend/Full-Stack intern roles. Shall I show you his resume?`,
        ],
      };

      let responseText: string;
      const matchedKey = Object.keys(responses).find((key) => new RegExp(key).test(lowerQuery));
      if (matchedKey) {
        // Small delay to make thinking indicator visible
        await new Promise(resolve => setTimeout(resolve, 500));
        responseText = responses[matchedKey][responseCount % responses[matchedKey].length];
      } else {
        responseText = await fetchGeminiResponse(lowerQuery, isHumorous);
      }

      setIsThinking(false);
      dispatch({ type: 'ADD_MESSAGE', payload: { text: responseText, isUser: false, isTyping: true } });
      dispatch({ type: 'CLEAR_INPUT' });
    },
    [chatState.responseHistory, getTimeGreeting, fetchGeminiResponse]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleQuery(chatState.input);
    },
    [chatState.input, handleQuery]
  );

  // Scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatState.messages]);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
      setTimeout(() => setShowBadge(true), 1000);
    }
  }, [inView, controls]);

  useEffect(() => {
    return () => handleMouseMove.cancel();
  }, [handleMouseMove]);

  const socialLinks: SocialLink[] = useMemo(
    () => [
      { icon: <Github className="w-6 h-6" />, href: "https://github.com/nikhiljangid120", label: "GitHub" },
      { icon: <Linkedin className="w-6 h-6" />, href: "https://www.linkedin.com/in/nikhil-jangid-b84360264/", label: "LinkedIn" },
      { icon: <Mail className="w-6 h-6" />, href: "mailto:nikhiljangid343@gmail.com", label: "Email" },
    ],
    []
  );

  const philosophyPoints: PhilosophyPoint[] = useMemo(
    () => [
      { icon: <Code className="w-5 h-5" />, title: "Clean Code", description: "Writing maintainable and scalable solutions", color: "lime" },
      { icon: <ShieldCheck className="w-5 h-5" />, title: "Best Practices", description: "Following industry standards", color: "teal" },
      { icon: <Database className="w-5 h-5" />, title: "Optimization", description: "Building performant apps", color: "purple" },
      { icon: <Lightbulb className="w-5 h-5" />, title: "Innovation", description: "Pushing tech boundaries", color: "gold" },
    ],
    []
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const imageVariants = {
    hover: { scale: 1.02 },
  };

  const chatVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 30 },
  };

  const messageVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  // Sparkles
  const generateSparkles = useCallback((count: number): Sparkle[] => {
    return Array.from({ length: count }).map((_, index) => ({
      id: index,
      size: Math.random() * 1.5 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: Math.random() * 1.2 + 0.8,
    }));
  }, []);

  const sparkles = useMemo(() => generateSparkles(5), [generateSparkles]);

  return (
    <section id="about" ref={ref} className="py-20 relative overflow-hidden bg-inkyblack">
      <style>
        {`
          .spark-cascade {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 5;
          }

          .card-3d:hover .spark-cascade {
            opacity: 0.7;
          }

          .spark {
            position: absolute;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(204, 255, 0, 0.8), rgba(0, 204, 204, 0.4));
            animation: spark-anim 0.7s ease-out infinite;
            pointer-events: none;
          }

          .neon-glow {
            position: absolute;
            inset: 0;
            border-radius: 12px;
            box-shadow: 0 0 0 rgba(204, 255, 0, 0);
            transition: box-shadow 0.2s ease;
            z-index: 4;
          }

          .card-3d:hover .neon-glow {
            box-shadow: 0 0 20px rgba(204, 255, 0, 0.7), 0 0 40px rgba(0, 204, 204, 0.5);
          }

          @keyframes spark-anim {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 0.9; }
            100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          }

          .chat-orb {
            position: fixed;
            bottom: 1.2rem;
            right: 1.2rem;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(204, 255, 0, 0.8), rgba(0, 204, 204, 0.6));
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 60;
            box-shadow: 0 0 15px rgba(204, 255, 0, 0.5);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .chat-orb:hover {
            transform: scale(1.1);
            box-shadow: 0 0 25px rgba(204, 255, 0, 0.7);
          }

          .chat-orb::after {
            content: '';
            position: absolute;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 1.5px solid rgba(204, 255, 0, 0.4);
            animation: ripple 3s ease-in-out infinite;
            transform: scale(0.8);
          }

          @keyframes ripple {
            0% { transform: scale(0.8); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 0.2; }
            100% { transform: scale(0.8); opacity: 0.5; }
          }

          .chat-container {
            position: fixed;
            bottom: 5rem;
            right: 1.2rem;
            width: 360px;
            max-height: 550px;
            background: rgba(15, 15, 25, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            overflow: hidden;
            z-index: 60;
            display: flex;
            flex-direction: column;
            box-shadow: 0 0 20px rgba(204, 255, 0, 0.2);
            border: 1px solid transparent;
            animation: glow-border 2s ease-in-out infinite;
          }

          @keyframes glow-border {
            0%, 100% { border-color: rgba(204, 255, 0, 0.3); }
            50% { border-color: rgba(204, 255, 0, 0.6); }
          }

          .chat-header {
            padding: 0.8rem;
            background: linear-gradient(45deg, rgba(204, 255, 0, 0.2), rgba(0, 204, 204, 0.2));
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .chat-messages {
            flex: 1;
            padding: 1rem;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(204, 255, 0, 0.5) transparent;
          }

          .chat-messages::-webkit-scrollbar {
            width: 6px;
          }

          .chat-messages::-webkit-scrollbar-thumb {
            background: rgba(204, 255, 0, 0.5);
            border-radius: 3px;
          }

          .message {
            margin-bottom: 0.8rem;
            padding: 0.6rem 1rem;
            border-radius: 10px;
            max-width: 80%;
            font-size: 0.85rem;
            line-height: 1.3;
            box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15);
            transition: transform 0.2s ease;
          }

          .message-user {
            background: linear-gradient(45deg, rgba(204, 255, 0, 0.3), rgba(204, 255, 0, 0.15));
            margin-left: auto;
            color: #fff;
          }

          .message-bot {
            background: linear-gradient(45deg, rgba(0, 204, 204, 0.3), rgba(0, 204, 204, 0.15));
            margin-right: auto;
            color: #fff;
          }

          .message:hover {
            transform: translateY(-1px);
          }

          .chat-input {
            padding: 0.8rem;
            background: rgba(15, 15, 25, 0.7);
            border-top: 1px solid rgba(204, 255, 0, 0.2);
          }

          .chat-input form {
            display: flex;
            gap: 0.5rem;
          }

          .chat-input input {
            flex: 1;
            padding: 0.6rem;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(204, 255, 0, 0.3);
            border-radius: 6px;
            color: #fff;
            outline: none;
            font-size: 0.85rem;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
          }

          .chat-input input:focus {
            border-color: rgba(204, 255, 0, 0.7);
            box-shadow: 0 0 8px rgba(204, 255, 0, 0.3);
          }

          .chat-input button {
            padding: 0.6rem 1.2rem;
            background: linear-gradient(45deg, rgba(204, 255, 0, 0.8), rgba(0, 204, 204, 0.8));
            border: none;
            border-radius: 6px;
            color: #000;
            font-weight: 500;
            cursor: pointer;
            transition: transform 0.2s ease;
          }

          .chat-input button:hover {
            transform: scale(1.05);
          }

          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }

          .animate-blink {
            animation: blink 0.5s step-end infinite;
          }

          /* Responsive Styles */
          @media (max-width: 640px) {
            .chat-container {
              width: 90%;
              bottom: 4.5rem;
              max-height: 65vh;
            }

            .chat-orb {
              bottom: 0.8rem;
              right: 0.8rem;
              width: 50px;
              height: 50px;
            }

            .chat-messages {
              padding: 0.8rem;
            }

            .message {
              font-size: 0.8rem;
            }
          }

          @media (min-width: 1024px) {
            .chat-container {
              width: 380px;
              max-height: 580px;
            }
          }
        `}
      </style>

      {/* Chatbot Orb */}
      <motion.div
        className="chat-orb"
        onClick={() => setIsChatOpen(!isChatOpen)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        <MessageCircle className="w-6 h-6 text-black" />
      </motion.div>

      {/* Chatbot Container */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            className="chat-container"
            variants={chatVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="chat-header">
              <h3 className="text-sm font-semibold text-white">JARVIS 2.0</h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="chat-messages" ref={chatContainerRef}>
              {chatState.messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`message ${message.isUser ? 'message-user' : 'message-bot'}`}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  {message.isUser || !message.isTyping ? (
                    message.text
                  ) : (
                    <TypingEffect text={message.text} messageId={message.id} dispatch={dispatch} />
                  )}
                </motion.div>
              ))}
            </div>
            <div className="chat-input">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={chatState.input}
                  onChange={(e) => dispatch({ type: 'SET_INPUT', payload: e.target.value })}
                  placeholder="Ask about Nikhil or his portfolio..."
                  autoFocus
                />
                <button type="submit">Send</button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="section-container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative inline-block font-['Inter']">
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-rose-400 to-amber-400 px-3 py-1 rounded-lg shadow-[0_4px_12px_rgba(251,191,36,0.3)]">
              About me
            </span>
            <motion.span
              className="absolute -inset-2 blur-2xl opacity-50 bg-gradient-to-r from-emerald-400 via-rose-400 to-amber-400 rounded-xl -z-10"
              animate={{
                opacity: [0.4, 0.6, 0.4],
                scale: [1, 1.03, 1],
              }}
              transition={{ duration: 2.5, repeat: Infinity, repeatType: 'mirror' }}
            />
          </h2>
          <motion.p
            className="text-lg text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            I'm a 21-year-old Final Year B.Tech CSE student from Jaipur, building AI-powered products with React, Next.js, and LLM integrations. Passionate about shipping real, usable solutions—explore my journey through JARVIS 2.0.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="relative group perspective"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <motion.div
              className="relative w-full aspect-square rounded-2xl overflow-hidden card-3d"
              variants={imageVariants}
              whileHover="hover"
            >
              <div
                className="image-container w-full h-full"
                style={{
                  transform: isHovered
                    ? `perspective(1000px) rotateX(${(mousePosition.y - 50) * 0.08}deg) rotateY(${(mousePosition.x - 50) * 0.08}deg) translateZ(0)`
                    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)',
                }}
              >
                <img src="/profile.jpg" alt="Nikhil Jangid" className="w-full h-full object-cover" />
                <div className="neon-glow" />
                <div className="spark-cascade">
                  {isHovered && (
                    <>
                      <div
                        className="spark"
                        style={{ left: `${mousePosition.x}%`, top: `${mousePosition.y}%`, animationDelay: '0s' }}
                      />
                      <div
                        className="spark"
                        style={{ left: `${mousePosition.x}%`, top: `${mousePosition.y}%`, animationDelay: '0.2s' }}
                      />
                    </>
                  )}
                </div>
              </div>

              {sparkles.map((sparkle) => (
                <motion.div
                  key={`sparkle-${sparkle.id}`}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%`, width: `${sparkle.size}px`, height: `${sparkle.size}px` }}
                  animate={{ opacity: [0, 0.7, 0], scale: [0, 0.8, 0] }}
                  transition={{ duration: sparkle.duration, delay: sparkle.delay, repeat: Infinity }}
                />
              ))}

              {showBadge && (
                <motion.div
                  className="absolute top-3 right-3 bg-lime/20 backdrop-blur-md rounded-full px-2 py-1 text-xs border border-lime/30 flex items-center gap-1"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <span className="text-black">Portfolio Pro</span>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3"
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              {socialLinks.map((link, index) => (
                <HoverCard key={index}>
                  <HoverCardTrigger asChild>
                    <motion.a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-charcoal/50 backdrop-blur-md rounded-full text-gray-400 hover:text-lime transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {link.icon}
                    </motion.a>
                  </HoverCardTrigger>
                  <HoverCardContent className="bg-inkyblack/90 border border-lime/20 p-3">
                    <div className="flex flex-col items-center">
                      <div className="mb-1">{link.icon}</div>
                      <p className="text-xs text-white">Connect on {link.label}</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </motion.div>
          </motion.div>

          <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate={controls}>
            {philosophyPoints.map((point, index) => (
              <motion.div
                key={index}
                className="bg-charcoal/30 backdrop-blur-md rounded-lg p-5 border border-white/10 hover:border-lime/20 transition-all duration-200"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => setActiveCard(index)}
                onHoverEnd={() => setActiveCard(null)}
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    className={`p-2 rounded-md bg-gradient-to-r from-${point.color}/20 to-charcoal/30`}
                    animate={{ rotate: activeCard === index ? [0, 3, -3, 0] : 0 }}
                    transition={{ repeat: activeCard === index ? Infinity : 0, duration: 1.5 }}
                  >
                    {point.icon}
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{point.title}</h3>
                    <p className="text-gray-400 text-sm">{point.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;