import { useRef, useState, useEffect, useMemo, useCallback, useReducer } from 'react';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import { Code, ShieldCheck, Database, Lightbulb, Github, Linkedin, Mail, Coffee, Sparkles, MessageCircle } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card';
import { throttle, debounce } from 'lodash';
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
        messages: [...state.messages, { id: state.messages.length, text: action.payload.text, isUser: action.payload.isUser, isTyping: action.payload.isTyping }],
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
const TypingEffect = ({ text, messageId, dispatch }: { text: string; messageId: number; dispatch: React.Dispatch<ChatAction> }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 2);
      return () => clearTimeout(timer);
    } else {
      dispatch({ type: 'FINISH_TYPING', payload: messageId });
    }
  }, [index, text, messageId, dispatch]);

  return (
    <span className="relative">
      {displayedText}
      {index < text.length && (
        <span className="inline-block w-1 h-4 bg-lime animate-blink ml-1 align-middle" />
      )}
    </span>
  );
};

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
  const [chatState, dispatch] = useReducer(chatReducer, { messages: [], input: '', responseHistory: {} });
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Throttle mouse move
  const handleMouseMove = useMemo(
    () =>
      throttle((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }, 16),
    []
  );

  // Simplified time-based greeting
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning! How can I assist you with Nikhil’s portfolio today?';
    if (hour < 18) return 'Good afternoon! Ready to explore Nikhil’s projects?';
    return 'Good evening! Want to learn about Nikhil’s work?';
  };

  // Gemini API call for unmatched queries
  const fetchGeminiResponse = async (query: string, isHumorous: boolean): Promise<string> => {
    try {
      const tone = isHumorous ? 'witty and humorous' : 'professional and concise';
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are JARVIS 2.0, Nikhil Jangid’s AI assistant. Nikhil is a 20-year-old B.Tech CSE student from Shahpura, Jaipur, skilled in MERN, AI/ML, DSA, Java, Python, and projects like ResumeRocket, Flyeng Career, FlexForge, and NJ Careers. Respond to the query "${query}" in a ${tone} tone. Keep it under 80 words, relevant to Nikhil’s profile, and end with a question. Avoid references to sci-fi, Bollywood, or unrelated themes unless explicitly relevant to the query.`,
                },
              ],
            },
          ],
        }),
      });

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || `Sorry, I didn’t catch that. Want to ask about Nikhil’s projects?`;
      return generatedText;
    } catch (error) {
      console.error('Gemini API error:', error);
      return `I couldn’t process that. Try asking about Nikhil’s skills or projects. What’s next?`;
    }
  };

  // Debounced query handler
  const handleQuery = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) return;

      flushSync(() => {
        dispatch({ type: 'ADD_MESSAGE', payload: { text: query, isUser: true } });
      });

      const lowerQuery = query.toLowerCase().trim();
      const responseCount = (chatState.responseHistory[lowerQuery] || 0) + 1;
      dispatch({ type: 'INCREMENT_RESPONSE', payload: lowerQuery });

      // Detect humorous intent
      const isHumorous = lowerQuery.includes('joke') || lowerQuery.includes('funny') || lowerQuery.includes('haha') || lowerQuery.includes('tease');

      // User-related queries
      if (lowerQuery.includes('who are you') || lowerQuery.includes('what’s your name') || lowerQuery.includes('who’s the human')) {
        const responses = [
          `${getTimeGreeting()} I’m JARVIS 2.0, Nikhil Jangid’s AI assistant. He’s a 20-year-old B.Tech CSE student from Shahpura, Jaipur, working on projects like ResumeRocket. What would you like to know?`,
          `Nikhil Jangid is a 20-year-old B.Tech CSE student at Amity University, Jaipur, skilled in MERN and AI. I’m his AI assistant, JARVIS 2.0. Want to explore his projects?`,
          `I’m JARVIS 2.0, and Nikhil Jangid is a 20-year-old coder from Shahpura, Jaipur, studying B.Tech CSE. Check out his work like Flyeng Career. What’s next?`,
        ];
        dispatch({
          type: 'ADD_MESSAGE',
          payload: { text: responses[responseCount % 3], isUser: false, isTyping: true },
        });
      } else if (lowerQuery.includes('where are you from') || lowerQuery.includes('where on the map') || lowerQuery.includes('birthplace')) {
        const responses = [
          `Nikhil is from Shahpura, Jaipur, Rajasthan. Want to know more about his background?`,
          `Nikhil was born in Shahpura, Jaipur. Curious about his journey in tech?`,
          `Nikhil’s hometown is Shahpura, Jaipur. Interested in how it shaped his career?`,
        ];
        dispatch({
          type: 'ADD_MESSAGE',
          payload: { text: responses[responseCount % 3], isUser: false, isTyping: true },
        });
      } else if (lowerQuery.includes('how old are you') || lowerQuery.includes('how many years')) {
        const responses = [
          `Nikhil is 20 years old and studying B.Tech CSE. Want to know about his projects?`,
          `Nikhil’s 20, pursuing B.Tech CSE at Amity University. Interested in his skills?`,
          `At 20, Nikhil’s a B.Tech CSE student building tools like NJ Careers. What’s next?`,
        ];
        dispatch({
          type: 'ADD_MESSAGE',
          payload: { text: responses[responseCount % 3], isUser: false, isTyping: true },
        });
      } else if (lowerQuery.includes('what are you studying') || lowerQuery.includes('college') || lowerQuery.includes('favorite subjects')) {
        const responses = [
          `Nikhil studies B.Tech in Computer Science at Amity University, focusing on DSA, AI, and web development. Want to know more about his coursework?`,
          `Nikhil’s pursuing B.Tech CSE at Amity University, with interests in AI and algorithms. Curious about his studies?`,
          `Nikhil’s a B.Tech CSE student at Amity, specializing in DSA and full-stack development. Interested in his favorite topics?`,
        ];
        dispatch({
          type: 'ADD_MESSAGE',
          payload: { text: responses[responseCount % 3], isUser: false, isTyping: true },
        });
      } else if (lowerQuery.includes('technologies') || lowerQuery.includes('core strengths') || lowerQuery.includes('superpower in tech')) {
        const responses = [
          `Nikhil’s skilled in MERN (React, Node.js, Express, MongoDB), DSA, AI/ML, Java, Python, and No-Code platforms. Want details on any skill?`,
          `Nikhil’s strengths include MERN stack, AI/ML, DSA, Java, and Python. Curious about his tech stack?`,
          `Nikhil excels in full-stack development with MERN, AI, and DSA. Interested in a specific technology?`,
        ];
        dispatch({
          type: 'ADD_MESSAGE',
          payload: { text: responses[responseCount % 3], isUser: false, isTyping: true },
        });
      } else if (lowerQuery.includes('projects') || lowerQuery.includes('what have you built') || lowerQuery.includes('something that made you go')) {
        const responses = [
          `Nikhil’s projects include ResumeRocket, Flyeng Career, FlexForge, OneNote, Nexicon, AI Website Builder, Quiz App, and NJ Careers. Which one interests you?`,
          `Nikhil has built ResumeRocket, Flyeng Career, NJ Careers, and more. Want to explore a specific project?`,
          `Nikhil’s portfolio features ResumeRocket, FlexForge, NJ Careers, and others. Curious about any project?`,
        ];
        dispatch({
          type: 'ADD_MESSAGE',
          payload: { text: responses[responseCount % 3], isUser: false, isTyping: true },
        });
      } else if (lowerQuery.includes('resumerocket')) {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            text: `ResumeRocket is Nikhil’s AI-powered resume builder using React, Tailwind, and Framer Motion for ATS-optimized CVs. Want to know about its features?`,
            isUser: false,
            isTyping: true,
          },
        });
      } else if (lowerQuery.includes('flyeng career') || lowerQuery.includes('flyeng')) {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            text: `Flyeng Career is Nikhil’s educational platform with programming content, compiler design, and a community forum, built with MERN. Interested in its features?`,
            isUser: false,
            isTyping: true,
          },
        });
      } else if (lowerQuery.includes('ai code analyzer') || lowerQuery.includes('dsa visualizer')) {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            text: `Nikhil’s AI Code Analyzer improves code quality, and his DSA Visualizer illustrates algorithms, both using React and Node.js. Want more details?`,
            isUser: false,
            isTyping: true,
          },
        });
      } else if (lowerQuery.includes('flexforge')) {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            text: `FlexForge is Nikhil’s AI fitness platform creating personalized workout and nutrition plans, built with Tailwind and Framer Motion. Curious about its design?`,
            isUser: false,
            isTyping: true,
          },
        });
      } else if (lowerQuery.includes('onenote')) {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            text: `OneNote is Nikhil’s Linktree alternative with customizable links and analytics, built with MERN. Want to explore its features?`,
            isUser: false,
            isTyping: true,
          },
        });
      } else if (lowerQuery.includes('nexicon')) {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            text: `Nexicon is Nikhil’s social media app built with MERN for user connectivity. Interested in its backend?`,
            isUser: false,
            isTyping: true,
          },
        });
      } else if (lowerQuery.includes('ai website builder')) {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            text: `Nikhil’s AI Website Builder simplifies website creation with no-code tools and AI. Want to know how it works?`,
            isUser: false,
            isTyping: true,
          },
        });
      } else if (lowerQuery.includes('quiz app')) {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            text: `Nikhil’s Quiz App offers dynamic quizzes with real-time feedback, built with React. Curious about its features?`,
            isUser: false,
            isTyping: true,
          },
        });
      } else if (lowerQuery.includes('nj careers') || lowerQuery.includes('careers roadmap')) {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            text: `NJ Careers is Nikhil’s platform for career roadmaps and skill assessments, guiding tech professionals. Want to explore its functionality?`,
            isUser: false,
            isTyping: true,
          },
        });
      } else if (lowerQuery.includes('inspires you') || lowerQuery.includes('why do you code')) {
        const responses = [
          `Nikhil codes to solve problems and build impactful tools like ResumeRocket. Want to know more about his motivation?`,
          `Nikhil is driven to create innovative apps like Flyeng Career. Curious about his goals?`,
          `Nikhil enjoys turning ideas into reality through coding, as seen in NJ Careers. What inspires you?`,
        ];
        dispatch({
          type: 'ADD_MESSAGE',
          payload: { text: responses[responseCount % 3], isUser: false, isTyping: true },
        });
      } else if (lowerQuery.includes('jarvis 2.0') || lowerQuery.includes('how does jarvis work')) {
        const responses = [
          `I’m JARVIS 2.0, Nikhil’s AI chatbot built with React to answer questions about his projects and skills. Want to ask about ResumeRocket?`,
          `JARVIS 2.0 is Nikhil’s React-based chatbot for portfolio queries. Curious about Flyeng Career?`,
          `I’m JARVIS 2.0, here to share Nikhil’s work like NJ Careers using React. What’s your question?`,
        ];
        dispatch({
          type: 'ADD_MESSAGE',
          payload: { text: responses[responseCount % 3], isUser: false, isTyping: true },
        });
      } else if (lowerQuery.includes('future goals') || lowerQuery.includes('where do you see') || lowerQuery.includes('what do you want to become')) {
        const responses = [
          `Nikhil aims to advance AI and full-stack development, scaling projects like ResumeRocket. What’s his next step?`,
          `Nikhil plans to grow Flyeng Career into a major educational platform. Interested in his vision?`,
          `Nikhil wants to innovate with AI and web apps like NJ Careers. Curious about his plans?`,
        ];
        dispatch({
          type: 'ADD_MESSAGE',
          payload: { text: responses[responseCount % 3], isUser: false, isTyping: true },
        });
      } else if (lowerQuery.includes('connect') || lowerQuery.includes('collaborate')) {
        const responses = [
          `You can reach Nikhil on GitHub (nikhiljangid120), LinkedIn, or email (nikhiljangid343@gmail.com). Got a project idea?`,
          `Nikhil’s available for collabs via GitHub, LinkedIn, or nikhiljangid343@gmail.com. What’s your pitch?`,
          `Contact Nikhil on GitHub, LinkedIn, or email (nikhiljangid343@gmail.com) for collaborations. What’s up?`,
        ];
        dispatch({
          type: 'ADD_MESSAGE',
          payload: { text: responses[responseCount % 3], isUser: false, isTyping: true },
        });
      } else if (lowerQuery.includes('hobbies') || lowerQuery.includes('when not coding') || lowerQuery.includes('guilty pleasure')) {
        const responses = [
          `Nikhil enjoys reading tech articles and exploring new tools when not coding. What’s your hobby?`,
          `Outside coding, Nikhil studies tech trends and learns new skills. Curious about his interests?`,
          `Nikhil spends free time diving into tech blogs and tutorials. What do you do for fun?`,
        ];
        dispatch({
          type: 'ADD_MESSAGE',
          payload: { text: responses[responseCount % 3], isUser: false, isTyping: true },
        });
      } else if (lowerQuery.includes('currently working on') || lowerQuery.includes('what’s cooking')) {
        const responses = [
          `Nikhil’s developing Flyeng Career and enhancing NJ Careers’ features. Want to know more?`,
          `Nikhil’s focused on Flyeng Career’s community forum and NJ Careers’ assessments. Curious about his work?`,
          `Nikhil’s refining Flyeng Career and NJ Careers. Interested in his current projects?`,
        ];
        dispatch({
          type: 'ADD_MESSAGE',
          payload: { text: responses[responseCount % 3], isUser: false, isTyping: true },
        });
      } else if (lowerQuery.includes('coding or chilling') || lowerQuery.includes('what’s your vibe')) {
        const responses = [
          `Nikhil’s mostly coding, working on projects like Flyeng Career. What’s your focus?`,
          `Nikhil spends most of his time coding, like on NJ Careers. What’s your vibe?`,
          `Nikhil’s busy with coding projects like ResumeRocket. What’s your routine?`,
        ];
        dispatch({
          type: 'ADD_MESSAGE',
          payload: { text: responses[responseCount % 3], isUser: false, isTyping: true },
        });
      } else if (lowerQuery.includes('portfolio') || lowerQuery.includes('website') || lowerQuery.includes('tech stack')) {
        const responses = [
          `Nikhil’s portfolio uses React, Tailwind, Framer Motion, and Node.js for a fast, modern UI. Want to know about a feature?`,
          `Nikhil’s website is built with React, Tailwind, and Node.js for performance. Curious about its design?`,
          `Nikhil’s portfolio runs on React, Tailwind, and Framer Motion with a Node.js backend. Interested in its tech?`,
        ];
        dispatch({
          type: 'ADD_MESSAGE',
          payload: { text: responses[responseCount % 3], isUser: false, isTyping: true },
        });
      } else if (lowerQuery.includes('tailwind') || lowerQuery.includes('why tailwind')) {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            text: `Nikhil uses Tailwind CSS for fast, responsive styling in projects like ResumeRocket. Want to know more about his frontend?`,
            isUser: false,
            isTyping: true,
          },
        });
      } else if (lowerQuery.includes('framer motion') || lowerQuery.includes('animations')) {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            text: `Nikhil uses Framer Motion for smooth animations in his portfolio and projects. Curious about a specific effect?`,
            isUser: false,
            isTyping: true,
          },
        });
      } else if (lowerQuery.includes('react') || lowerQuery.includes('why react')) {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            text: `Nikhil chooses React for its component-based structure and efficiency in projects like ResumeRocket. Want to discuss React?`,
            isUser: false,
            isTyping: true,
          },
        });
      } else if (lowerQuery.includes('node') || lowerQuery.includes('express') || lowerQuery.includes('backend')) {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            text: `Nikhil uses Node.js and Express for robust APIs in Nexicon and other projects. Interested in his backend work?`,
            isUser: false,
            isTyping: true,
          },
        });
      } else if (lowerQuery.includes('mongodb')) {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            text: `Nikhil uses MongoDB for flexible data storage in Nexicon and Flyeng Career. Want to know about his database design?`,
            isUser: false,
            isTyping: true,
          },
        });
      } else if (lowerQuery.includes('ai/ml') || lowerQuery.includes('genai')) {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            text: `Nikhil’s AI/ML skills power ResumeRocket’s ATS optimization and NJ Careers’ assessments. Curious about his AI projects?`,
            isUser: false,
            isTyping: true,
          },
        });
      } else if (lowerQuery.includes('no-code')) {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            text: `Nikhil’s No-Code skills drive his AI Website Builder for easy web creation. Want to explore its workflow?`,
            isUser: false,
            isTyping: true,
          },
        });
      } else if (lowerQuery.includes('performance') || lowerQuery.includes('optimization')) {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            text: `Nikhil optimizes his portfolio with useMemo and throttled events for speed. Want to learn his techniques?`,
            isUser: false,
            isTyping: true,
          },
        });
      } else {
        // Use Gemini API for unmatched queries
        const geminiResponse = await fetchGeminiResponse(lowerQuery, isHumorous);
        dispatch({
          type: 'ADD_MESSAGE',
          payload: { text: geminiResponse, isUser: false, isTyping: true },
        });
      }

      dispatch({ type: 'CLEAR_INPUT' });
    }, 200),
    [chatState.responseHistory]
  );

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuery(chatState.input);
  };

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
      setTimeout(() => setShowBadge(true), 1500);
    }
  }, [inView, controls]);

  useEffect(() => {
    return () => {
      handleMouseMove.cancel();
      handleQuery.cancel();
    };
  }, [handleMouseMove, handleQuery]);

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
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const imageVariants = {
    hover: { scale: 1.02 },
  };

  // Sparkles
  const generateSparkles = useCallback((count: number): Sparkle[] => {
    return Array.from({ length: count }).map((_, index) => ({
      id: index,
      size: Math.random() * 2 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 1,
      duration: Math.random() * 1.5 + 1,
    }));
  }, []);

  const sparkles = useMemo(() => generateSparkles(6), [generateSparkles]);

  return (
    <section id="about" ref={ref} className="py-24 relative overflow-hidden bg-inkyblack">
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
            transition: opacity 0.3s ease;
            z-index: 5;
          }

          .card-3d:hover .spark-cascade {
            opacity: 0.8;
          }

          .spark {
            position: absolute;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(204, 255, 0, 0.9), rgba(0, 204, 204, 0.5));
            animation: spark-anim 0.8s ease-out infinite;
            pointer-events: none;
            will-change: transform, opacity;
          }

          .neon-glow {
            position: absolute;
            inset: 0;
            border-radius: 12px;
            box-shadow: 0 0 0 rgba(204, 255, 0, 0);
            transition: box-shadow 0.3s ease;
            z-index: 4;
          }

          .card-3d:hover .neon-glow {
            box-shadow: 0 0 25px rgba(204, 255, 0, 0.9), 0 0 50px rgba(0, 204, 204, 0.6);
            animation: glow-pulse 1.8s ease-in-out infinite;
          }

          .overlay-glow {
            position: absolute;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(204, 255, 0, 0.4), transparent 70%);
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            transform: translate(-50%, -50%);
            z-index: 3;
          }

          .card-3d:hover .overlay-glow {
            opacity: 0.6;
          }

          @keyframes spark-anim {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          }

          @keyframes glow-pulse {
            0%, 100% { box-shadow: 0 0 25px rgba(204, 255, 0, 0.9), 0 0 50px rgba(0, 204, 204, 0.6); }
            50% { box-shadow: 0 0 35px rgba(204, 255, 0, 1), 0 0 70px rgba(0, 204, 204, 0.8); }
          }

          .image-container {
            will-change: transform;
            transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
            transition: transform 0.3s ease-out;
            transform-style: preserve-3d;
          }

          .chat-orb {
            position: fixed;
            bottom: 1.5rem;
            right: 1.5rem;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(204, 255, 0, 0.9), rgba(0, 204, 204, 0.7));
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 60;
            box-shadow: 0 0 20px rgba(204, 255, 0, 0.6);
            animation: orb-pulse 2s ease-in-out infinite;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .chat-orb:hover {
            transform: scale(1.15);
            box-shadow: 0 0 30px rgba(204, 255, 0, 0.8);
          }

          .chat-orb::before {
            content: '';
            position: absolute;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 2px solid rgba(204, 255, 0, 0.5);
            animation: orbit 4s linear infinite;
            transform: translateZ(0);
          }

          @keyframes orb-pulse {
            0%, 100% { box-shadow: 0 0 20px rgba(204, 255, 0, 0.6), 0 0 40px rgba(0, 204, 204, 0.4); }
            50% { box-shadow: 0 0 30px rgba(204, 255, 0, 0.9), 0 0 60px rgba(0, 204, 204, 0.6); }
          }

          @keyframes orbit {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .chat-container {
            position: fixed;
            bottom: 6rem;
            right: 1.5rem;
            width: 400px;
            max-height: 600px;
            background: rgba(10, 10, 20, 0.95);
            backdrop-filter: blur(12px);
            border: 1px solid transparent;
            border-image: linear-gradient(45deg, rgba(204, 255, 0, 0.8), rgba(0, 204, 204, 0.8)) 1;
            border-radius: 16px;
            overflow: hidden;
            z-index: 60;
            display: flex;
            flex-direction: column;
            box-shadow: 0 0 25px rgba(204, 255, 0, 0.3);
            animation: container-pulse 3s ease-in-out infinite;
          }

          @keyframes container-pulse {
            0%, 100% { box-shadow: 0 0 25px rgba(204, 255, 0, 0.3); }
            50% { box-shadow: 0 0 35px rgba(204, 255, 0, 0.5); }
          }

          .chat-header {
            padding: 1rem;
            background: linear-gradient(45deg, rgba(204, 255, 0, 0.3), rgba(0, 204, 204, 0.3));
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .chat-messages {
            flex: 1;
            padding: 1.5rem;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(204, 255, 0, 0.6) transparent;
          }

          .chat-messages::-webkit-scrollbar {
            width: 8px;
          }

          .chat-messages::-webkit-scrollbar-track {
            background: transparent;
          }

          .chat-messages::-webkit-scrollbar-thumb {
            background: rgba(204, 255, 0, 0.6);
            border-radius: 4px;
          }

          .message {
            margin-bottom: 1rem;
            padding: 0.75rem 1rem;
            border-radius: 12px;
            max-width: 85%;
            font-size: 0.9rem;
            line-height: 1.4;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .message-user {
            background: linear-gradient(45deg, rgba(204, 255, 0, 0.4), rgba(204, 255, 0, 0.2));
            margin-left: auto;
            color: #fff;
          }

          .message-bot {
            background: linear-gradient(45deg, rgba(0, 204, 204, 0.4), rgba(0, 204, 204, 0.2));
            margin-right: auto;
            color: #fff;
          }

          .message:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          }

          .chat-input {
            padding: 1rem;
            background: rgba(10, 10, 20, 0.7);
            border-top: 1px solid rgba(204, 255, 0, 0.3);
          }

          .chat-input form {
            display: flex;
            gap: 0.75rem;
          }

          .chat-input input {
            flex: 1;
            padding: 0.75rem;
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(204, 255, 0, 0.4);
            border-radius: 8px;
            color: #fff;
            outline: none;
            font-size: 0.9rem;
            transition: border-color 0.3s ease;
          }

          .chat-input input:focus {
            border-color: rgba(204, 255, 0, 0.8);
          }

          .chat-input button {
            padding: 0.75rem 1.5rem;
            background: linear-gradient(45deg, rgba(204, 255, 0, 0.9), rgba(0, 204, 204, 0.9));
            border: none;
            border-radius: 8px;
            color: #000;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .chat-input button:hover {
            transform: scale(1.05);
            box-shadow: 0 0 15px rgba(204, 255, 0, 0.5);
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
              bottom: 5rem;
              max-height: 70vh;
            }

            .chat-orb {
              bottom: 1rem;
              right: 1rem;
              width: 60px;
              height: 60px;
            }

            .chat-messages {
              padding: 1rem;
            }

            .message {
              font-size: 0.85rem;
            }
          }

          @media (min-width: 768px) {
            .chat-container {
              width: 360px;
              max-height: 550px;
            }
          }

          @media (min-width: 1024px) {
            .chat-container {
              width: 400px;
              max-height: 600px;
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
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <MessageCircle className="w-7 h-7 text-black" />
      </motion.div>

      {/* Chatbot Container */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            className="chat-container"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="chat-header">
              <h3 className="text-base font-bold text-white">JARVIS 2.0</h3>
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
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
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative inline-block font-['Inter']">
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-rose-400 to-amber-400 px-3 py-1 rounded-lg shadow-[0_4px_12px_rgba(251,191,36,0.3)]">
              About me
            </span>
            <motion.span
              className="absolute -inset-2 blur-2xl opacity-50 bg-gradient-to-r from-emerald-400 via-rose-400 to-amber-400 rounded-xl -z-10"
              animate={{
                opacity: [0.4, 0.7, 0.4],
                scale: [1, 1.05, 1],
                backgroundPosition: ['0% center', '100% center', '0% center'],
                boxShadow: ['0 8px 16px rgba(251,191,36,0.2)', '0 12px 24px rgba(251,191,36,0.4)', '0 8px 16px rgba(251,191,36,0.2)'],
              }}
              transition={{ duration: 3, repeat: Infinity, repeatType: 'mirror' }}
            />
          </h2>
          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            I'm a 20-year-old B.Tech CSE innovator from Shahpura, Jaipur, building impactful solutions with MERN, DSA, and backend technologies. Passionate about turning ideas into reality—explore my journey through JARVIS 2.0.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
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
                    ? `perspective(1000px) rotateX(${(mousePosition.y - 50) * 0.1}deg) rotateY(${(mousePosition.x - 50) * 0.1}deg) translateZ(0)`
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
                        style={{ left: `${mousePosition.x}%`, top: `${mousePosition.y}%`, animationDelay: '0.3s' }}
                      />
                      <div
                        className="spark"
                        style={{ left: `${mousePosition.x}%`, top: `${mousePosition.y}%`, animationDelay: '0.6s' }}
                      />
                    </>
                  )}
                </div>
                <div
                  className="overlay-glow"
                  style={{ left: `${mousePosition.x}%`, top: `${mousePosition.y}%` }}
                />
              </div>

              {sparkles.map((sparkle) => (
                <motion.div
                  key={`sparkle-${sparkle.id}`}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%`, width: `${sparkle.size}px`, height: `${sparkle.size}px` }}
                  animate={{ opacity: [0, 0.8, 0], scale: [0, 1, 0] }}
                  transition={{ duration: sparkle.duration, delay: sparkle.delay, repeat: Infinity, repeatDelay: Math.random() * 2 }}
                />
              ))}

              <AnimatePresence>
                {showBadge && (
                  <motion.div
                    className="absolute top-4 right-4 bg-lime/20 backdrop-blur-md rounded-full px-3 py-1 text-sm border border-lime/40 flex items-center gap-2"
                    initial={{ scale: 0, rotate: -20, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <Sparkles className="w-4 h-4 text-purple" />
                    <span className="text-black">Portfolio Pro</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
              {socialLinks.map((link, index) => (
                <HoverCard key={index}>
                  <HoverCardTrigger asChild>
                    <motion.a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-charcoal/50 backdrop-blur-md rounded-full text-gray-400 hover:text-lime transition-colors duration-300 interactive"
                      whileHover={{ scale: 1.1, boxShadow: "0 0 10px rgba(204, 255, 0, 0.15)" }}
                      whileTap={{ scale: 0.95 }}
                      data-cursor-text={link.label}
                    >
                      {link.icon}
                      <span className="absolute inset-0 rounded-full pointer-events-none">
                        <motion.span
                          className="absolute inset-0 rounded-full bg-lime/15"
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: 1.5, opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        />
                      </span>
                    </motion.a>
                  </HoverCardTrigger>
                  <HoverCardContent className="glass-card bg-inkyblack/90 border border-lime/20">
                    <div className="flex flex-col items-center">
                      <div className="mb-2">{link.icon}</div>
                      <p className="text-sm font-medium text-white mb-1">Connect on {link.label}</p>
                      <p className="text-xs text-gray-400">Click to visit</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </motion.div>
          </motion.div>

          <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate={controls}>
            {philosophyPoints.map((point, index) => (
              <motion.div
                key={index}
                className="bg-charcoal/30 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-lime/20 transition-all duration-300 relative overflow-hidden"
                variants={itemVariants}
                whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(204, 255, 0, 0.1)" }}
                onHoverStart={() => setActiveCard(index)}
                onHoverEnd={() => setActiveCard(null)}
              >
                <div className="flex items-start gap-4 relative z-10">
                  <motion.div
                    className={`p-3 rounded-lg bg-gradient-to-r from-${point.color}/20 to-charcoal/30 border border-${point.color}/15`}
                    animate={{ rotate: activeCard === index ? [0, 4, -4, 0] : 0 }}
                    transition={{ repeat: activeCard === index ? Infinity : 0, duration: 1.8 }}
                  >
                    {point.icon}
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{point.title}</h3>
                    <p className="text-gray-400">{point.description}</p>
                  </div>
                </div>
                <motion.div
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 50%, rgba(204, 255, 0, 0.08), transparent 70%)` }}
                  animate={activeCard === index ? { opacity: 0.4 } : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;