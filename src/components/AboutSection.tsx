import { useRef, useState, useEffect, useMemo, useCallback, useReducer, memo } from 'react';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import { Code, ShieldCheck, Database, Lightbulb, Github, Linkedin, Mail, MessageCircle, Brain } from 'lucide-react';
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
  colorClass: string;
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
      const tone = isHumorous ? 'witty, humorous and clever' : 'professional, direct and concise';
      const systemContext = `You are JARVIS 2.0, the AI assistant embedded in Nikhil Jangid's software engineering portfolio.

Your personality: Sharp, confident, helpful. You know everything about Nikhil and represent him well. Never make up facts.

=== IDENTITY ===
Name: Nikhil Jangid
Age: 21
Location: Jaipur, Rajasthan, India
Degree: B.Tech Computer Science & Engineering, Amity University Rajasthan (Batch 2022–2026)
CGPA: 8.48
Email: nikhiljangid343@gmail.com
GitHub: https://github.com/nikhiljangid120
LinkedIn: https://linkedin.com/in/nikhil-jangid-b84360264
LeetCode: https://leetcode.com/u/nikhil_888/
Portfolio: Live on browser

=== CURRENT ROLE ===
SDE Intern @ Wisflux Tech Labs (June 2026 – Present) — Full-time internship
Work: NestJS backend services, PostgreSQL, TypeORM, Docker Compose, Nx Monorepo
Built: Transactional hotel booking backend with pessimistic locking and JWT auth
Built: RAG-based document intelligence platform (PDF ingestion → pgvector → MiniLM → OpenRouter + Llama)

=== PAST EXPERIENCE ===
1. Frontend Developer Intern @ Celebal Technologies (May–Jul 2025)
   - Built shipment tracking web app using React.js and Tailwind CSS
   - Integrated REST APIs, worked in Agile team with Git workflows

2. Web Development Intern @ InternPe (2024)
   - Built full-stack React.js + Node.js applications
   - Implemented RESTful APIs and authentication

=== TECHNICAL SKILLS ===
Languages: JavaScript (ES6+), TypeScript, C++, Python, SQL, HTML5, CSS3
Backend: NestJS, Node.js, Express.js, TypeORM, Prisma, REST APIs, JWT, Swagger, Nx Monorepo
Frontend: React.js, Next.js 14 (App Router), Tailwind CSS, Zustand, Framer Motion
Databases: PostgreSQL, MongoDB, MySQL, pgvector, Firebase, Supabase, SQLite
AI/ML: RAG pipelines, pgvector, MiniLM embeddings, OpenRouter, Llama, Gemini API, Groq API, Prompt Engineering
DevOps: Docker, Docker Compose, Git, GitHub, Vercel, Postman
DSA: 250+ problems solved on LeetCode, GFG, CodeChef

=== PROJECTS ===
1. Flyeng Career (FLAGSHIP - LIVE)
   URL: http://flyeng-career.vercel.app/
   Stack: Next.js 14, TypeScript, PostgreSQL, Prisma, AI/LLM
   What: AI-powered career development platform — personalized roadmaps, resume optimization, interview prep, portfolio builder for aspiring software engineers

2. Hotel Booking Management System (In Progress)
   Stack: NestJS, PostgreSQL, TypeORM, Docker, JWT, Swagger, Nx Monorepo
   What: Enterprise-grade booking backend with pessimistic locking, transactional workflows, availability engine, Swagger docs

3. AI Document Intelligence Platform (In Progress)
   Stack: NestJS, PostgreSQL, pgvector, MiniLM, OpenRouter, Llama
   What: Full RAG pipeline — PDF ingestion, vector embeddings, semantic search, context-aware Q&A with source attribution

4. AI Resume Builder (LIVE)
   URL: https://ai-resume-builder-epbj.vercel.app/
   Stack: Next.js, Gemini 1.5 Flash, TypeScript, Tailwind CSS
   What: ATS-optimized resume builder with AI suggestions, live preview, PDF export, multiple templates

5. AI Code Analyzer (LIVE)
   URL: https://code-analyzer-f7bq.vercel.app/
   Stack: Next.js, Groq API, D3.js
   What: LLM-powered code quality analyzer with complexity visualization, multi-language support

6. AI Fitness Platform (LIVE)
   URL: https://fitness-platform-zeta.vercel.app/
   Stack: Next.js, Firebase, Gemini API, Tailwind CSS
   What: AI fitness & nutrition planner with personalized workout plans, progress tracking

=== ACHIEVEMENTS ===
- First Prize — College Hackathon (Amity University)
- 250+ DSA problems solved (LeetCode, GFG, CodeChef)
- 4,500+ GitHub contributions
- GirlScript Summer of Code (GSSoC) contributor
- IBM SkillsBuild AI certification
- McKinsey Forward Program graduate
- 3⭐ CodeChef, Top 10% GFG ranking

=== PERSONALITY & GOALS ===
- Passionate about backend systems, distributed architecture, and AI engineering
- Believes in building production-grade, reliable software — not just demos
- Currently looking for Software Engineer / Backend Developer / Full-Stack roles
- Thrives in engineering-focused environments that value technical depth
- Open to work: Full-time SWE, Backend Dev, Full-Stack Dev positions`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemContext}\n\nUser asked: "${query}"\n\nRespond as JARVIS 2.0 in a ${tone} tone. Rules:\n- Keep it under 90 words\n- Be specific and factual (use real project names, tech stacks, URLs when relevant)\n- End with a relevant question or call-to-action\n- Never make up info not in the context above\n- If asked about contact/hiring, give his email and LinkedIn`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          },
        }),
      });

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || `I didn't quite catch that. Could you ask me about Nikhil's internships, backend stack details (like NestJS/PostgreSQL), or his AI/RAG projects?`;
    } catch (error) {
      console.error('Gemini API error:', error);
      return `Connection interrupted. Could you ask me a specific question about Nikhil's SDE internships, his NestJS/RAG project stack, or how to connect with him?`;
    }
  }, []);

  // Local parser to handle queries reliably without depending on API limits
  const getLocalResponse = useCallback((query: string): string | null => {
    const q = query.toLowerCase().trim();
    
    // 0. Conversational greetings, affirmations, and help feedback
    if (q === 'hi' || q === 'hello' || q === 'hey' || q === 'hola' || q === 'yo' || q.startsWith('greeting')) {
      return `Hello! I'm JARVIS 2.0, Nikhil's digital assistant. How can I help you explore his backend systems, RAG pipelines, or full-stack work?`;
    }
    if (q === 'yes' || q === 'yeah' || q === 'yep' || q === 'sure' || q === 'ok' || q === 'okay') {
      return `Awesome! What would you like to hear about? His Wisflux SDE internship, his RAG document pipeline, or his projects?`;
    }
    if (q.includes('stop giving') || q.includes('unnecessary') || q.includes('irrelevant') || q.includes('too long') || q.includes('concise') || q.includes('brief') || q.includes('attitude') || q.includes('behaviour')) {
      return `Understood. I will keep my answers short and direct. What specific detail can I provide for you?`;
    }
    if (q.includes('thank') || q === 'thanks' || q === 'cool' || q === 'great') {
      return `You're welcome! Let me know if you want to inspect his LeetCode rating or contact details.`;
    }
    if (q.includes('help') || q === 'what can you do') {
      return `I can tell you about Nikhil's internships (Wisflux, Celebal), project architectures (NestJS booking, RAG document search), coding stats, and contact info. Ask me anything!`;
    }

    // 0.5 Specific Personal Details
    if (q.includes('age') || q.includes('how old')) {
      return `Nikhil Jangid is 21 years old.`;
    }
    if (q.includes('location') || q.includes('live') || q.includes('jaipur')) {
      return `Nikhil is located in Jaipur, Rajasthan, India.`;
    }
    if (q.includes('education') || q.includes('college') || q.includes('university') || q.includes('cgpa') || q.includes('b.tech') || q.includes('degree') || q.includes('amity')) {
      return `Nikhil graduated with a B.Tech in Computer Science & Engineering from Amity University Rajasthan with an 8.48 CGPA.`;
    }

    // 1. Specific Internship Roles
    if (q.includes('wisflux')) {
      return `At Wisflux Tech Labs (June 2026 – Present), Nikhil is an SDE Intern building production NestJS backends. He designed a concurrency-safe booking database with TypeORM pessimistic locking, built RAG-based document intelligence systems (PDF ingestion, pgvector embeddings, Llama models), and structured applications within an Nx monorepo. Want details on his other internships?`;
    }
    if (q.includes('celebal')) {
      return `At Celebal Technologies (May – July 2025), Nikhil was a Frontend Developer Intern. He engineered a shipment delivery tracking application using React.js and Tailwind CSS, integrating RESTful APIs and coordinating within an Agile development workflow. Want to know about his Web Dev internship?`;
    }
    if (q.includes('internpe') || q.includes('intern pe')) {
      return `During his Web Development Internship at InternPe (2024), Nikhil built responsive full-stack applications with React.js and Node.js. He designed user authentication and integrated RESTful APIs to deliver clean user flows. Want details on his current SDE role?`;
    }

    // 2. Specific Projects
    if (q.includes('flyeng') || q.includes('fly eng')) {
      return `Flyeng Career (flagship project) is an AI-powered career development platform. It uses Next.js 14, PostgreSQL, and Prisma. It generates personalized learning roadmaps, does ATS resume score analysis, has an interview prep terminal, and a portfolio builder. Live at http://flyeng-career.vercel.app/. Would you like to check out his NestJS booking backend?`;
    }
    if (q.includes('hotel') || q.includes('booking')) {
      return `Nikhil built a Hotel Booking Management System backend with NestJS, PostgreSQL, and TypeORM. It implements transactional workflows with pessimistic locking to prevent race conditions during concurrent reservations. It features JWT auth, Swagger documentation, and a Docker environment. Would you like to discuss his RAG database instead?`;
    }
    if (q.includes('rag') || q.includes('document intelligence') || q.includes('pgvector') || q.includes('vector')) {
      return `The AI Document Intelligence Platform is a full RAG pipeline. It handles PDF uploading, text chunking, and generates vector embeddings using MiniLM. Embeddings are stored in pgvector (PostgreSQL), permitting fast semantic search. Responses are generated via Llama on OpenRouter with source attribution. Want to explore his AI Resume Builder?`;
    }
    if (q.includes('resume builder')) {
      return `Nikhil's AI Resume Builder is a Next.js app integrated with Gemini 1.5 Flash. It optimizes resume text for ATS engines, offers live templates, and exports to PDF. Live at https://ai-resume-builder-epbj.vercel.app/`;
    }
    if (q.includes('code analyzer')) {
      return `The AI Code Analyzer is built with Next.js and Groq API (Llama models) for fast inference. It parses code files, computes complexity, and renders interactive graphs with D3.js. Live at https://code-analyzer-f7bq.vercel.app/`;
    }
    if (q.includes('fitness') || q.includes('nutrition')) {
      return `The AI Fitness Platform uses Next.js, Firebase, and Gemini API to generate personalized diet plans and exercise routines. Live at https://fitness-platform-zeta.vercel.app/`;
    }

    // 3. Ownership / Website creation
    if (q.includes('owner') || q.includes('who made') || q.includes('who created') || q.includes('who built') || q.includes('whose site') || q.includes('who owns')) {
      return `Nikhil Jangid is the owner, developer, and creator of this website. He is a Software Engineer who built this developer dashboard using React, Tailwind CSS, TypeScript, and Framer Motion. Would you like to connect with him or download his resume?`;
    }

    // 4. Identity / Bot identity
    if (q.includes('who are you') || q.includes('your name') || q.includes('who is jarvis') || q.includes('what is jarvis') || q.includes('chatbot')) {
      return `I am JARVIS 2.0, Nikhil's digital AI assistant. I'm equipped with comprehensive knowledge of Nikhil's 3 internships, 6 production projects, and core backend/AI skills. What would you like to explore?`;
    }

    // 5. Contact / Hire info
    if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('reach') || q.includes('connect') || q.includes('phone') || q.includes('mail')) {
      return `You can connect with Nikhil at nikhiljangid343@gmail.com, or view his LinkedIn at linkedin.com/in/nikhil-jangid-b84360264. He is open to Software Engineer, Backend, and Full-Stack positions!`;
    }

    // 6. Experience Summary
    if (q.includes('experience') || q.includes('job') || q.includes('work') || q.includes('internship') || q.includes('intern')) {
      return `Nikhil has completed 3 internships: 1️⃣ SDE Intern at Wisflux Tech Labs (NestJS backend, RAG, pgvector); 2️⃣ Frontend Developer Intern at Celebal Technologies (React, Tailwind, shipment app); 3️⃣ Web Dev Intern at InternPe (React, Node). Which internship would you like to know more about?`;
    }

    // 7. Tech Stack / Skills
    if (q.includes('skills') || q.includes('tech stack') || q.includes('technologies') || q.includes('languages') || q.includes('databases') || q.includes('frameworks')) {
      return `Nikhil's core stack is NestJS, Node.js, PostgreSQL (TypeORM/Prisma), Docker, and React/Next.js. He also specializes in AI Engineering (RAG, pgvector, LLM APIs). Which section of his stack interests you?`;
    }

    // 8. Coding Stats / DSA
    if (q.includes('dsa') || q.includes('leetcode') || q.includes('gfg') || q.includes('codechef') || q.includes('problems') || q.includes('coding')) {
      return `Nikhil has solved 250+ data structures and algorithms problems across LeetCode, GFG, and CodeChef. He has a 3⭐ rating on CodeChef, top 10% ranking on GFG, and 4,500+ GitHub contributions. Shall I give you his GitHub link?`;
    }

    // 9. Achievements
    if (q.includes('achievement') || q.includes('award') || q.includes('hackathon') || q.includes('certification')) {
      return `Nikhil won First Prize in a College Hackathon at Amity University. He contributed to the GirlScript Summer of Code (GSSoC) and completed IBM SkillsBuild AI and McKinsey Forward certifications. What project details should we check?`;
    }

    // 10. Resume
    if (q.includes('resume') || q.includes('cv') || q.includes('download')) {
      return `You can download Nikhil's ATS-friendly resume from the Resume section, or click the download button in the Hero section. Do you want me to give you his contact details?`;
    }

    // 11. Jokes / Humorous
    if (q.includes('joke') || q.includes('funny') || q.includes('haha') || q.includes('humor')) {
      return `Why did the NestJS route go to therapy? Because it had too many dependencies injected! 😄 Want to hear about Nikhil's concurrency-safe booking database instead?`;
    }

    return null;
  }, [getTimeGreeting]);

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

      // 1. Try local response parser first to handle specific queries cleanly
      const localResponse = getLocalResponse(lowerQuery);
      let responseText: string;

      if (localResponse) {
        // Small delay to make thinking indicator visible and feel like AI response
        await new Promise(resolve => setTimeout(resolve, 600));
        responseText = localResponse;
      } else {
        // 2. Fallback to Gemini LLM for complex queries
        responseText = await fetchGeminiResponse(lowerQuery, isHumorous);
      }

      setIsThinking(false);
      dispatch({ type: 'ADD_MESSAGE', payload: { text: responseText, isUser: false, isTyping: true } });
      dispatch({ type: 'CLEAR_INPUT' });
    },
    [getLocalResponse, fetchGeminiResponse]
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
      { icon: <Database className="w-5 h-5" />, title: "Scalable Backend", description: "NestJS, PostgreSQL & clean APIs with concurrency safety.", color: "lime", colorClass: "bg-[#CCFF00]/10 border-[#CCFF00]/20 text-[#CCFF00]" },
      { icon: <Brain className="w-5 h-5" />, title: "AI & RAG Systems", description: "Contextual embeddings, pgvector & Llama models.", color: "teal", colorClass: "bg-[#005A66]/20 border-[#005A66]/30 text-[#00E5FF]" },
      { icon: <Code className="w-5 h-5" />, title: "Clean Architecture", description: "Structured TypeScript, modular Nx monorepos & clean patterns.", color: "purple", colorClass: "bg-[#2E1760]/20 border-[#2E1760]/30 text-[#D94F30]" },
      { icon: <ShieldCheck className="w-5 h-5" />, title: "System Reliability", description: "Docker environments, robust unit tests & secure JWT auth.", color: "gold", colorClass: "bg-[#FFB100]/10 border-[#FFB100]/20 text-[#FFB100]" },
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
              {isThinking && (
                <motion.div
                  className="message message-bot"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <ThinkingIndicator />
                </motion.div>
              )}
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
          className="mb-12"
        >
          <div className="flex items-center space-x-2 text-primary mb-4 font-mono">
            <Code className="w-5 h-5" />
            <span>~/about</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">About</span> <span className="text-primary opacity-80">Me</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
            I'm a <span className="text-primary font-semibold">Software Engineer</span> with a strong interest in backend development, distributed systems, and AI-powered applications.
            My experience spans production backend engineering with NestJS and PostgreSQL, full-stack development using React and Next.js, and intelligent systems built around RAG and modern LLMs.
          </p>
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
                <img src="/profile.jpg" alt="Nikhil Jangid - Software Engineer" className="w-full h-full object-cover object-center" />
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
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-lime">Open to Work</span>
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
            {/* About narrative */}
            <motion.p variants={itemVariants} className="text-gray-300 text-sm leading-relaxed">
              During my internship at <span className="text-lime font-semibold">Wisflux Tech Labs</span>, I developed transactional backend services, implemented concurrency-safe booking workflows, built document intelligence pipelines using vector embeddings and pgvector, and worked within an Nx monorepo to build modular, scalable applications.
            </motion.p>
            <motion.p variants={itemVariants} className="text-gray-400 text-sm leading-relaxed">
              I enjoy designing reliable software, learning system architecture, and transforming complex problems into maintainable engineering solutions.
            </motion.p>

            {/* Grid layout containing Snapshot and Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Professional Snapshot */}
              <motion.div variants={itemVariants} className="bg-charcoal/30 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden flex flex-col h-full">
                <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="ml-2 text-xs font-mono text-muted-foreground">~/snapshot</span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  {[
                    { field: 'Name', value: 'Nikhil Jangid' },
                    { field: 'Current Role', value: 'SDE Intern @ Wisflux Tech Labs' },
                    { field: 'Degree', value: 'B.Tech CSE' },
                    { field: 'Graduation', value: '2026' },
                    { field: 'CGPA', value: '8.48' },
                    { field: 'Location', value: 'Jaipur, Rajasthan' },
                    { field: 'Looking For', value: 'SWE | Backend | Full Stack' },
                    { field: 'Interests', value: 'Backend Systems · AI Engineering · System Design' },
                  ].map(({ field, value }, i) => (
                    <div key={field} className={`flex text-xs font-mono py-1.5 ${i < 7 ? 'border-b border-white/5' : ''}`}>
                      <span className="text-primary/70 w-28 shrink-0">{field}</span>
                      <span className="text-gray-200">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {philosophyPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    className="bg-charcoal/30 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:border-lime/30 hover-lift gradient-border card-glow flex flex-col justify-between transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{ scale: 1.03 }}
                    onHoverStart={() => setActiveCard(index)}
                    onHoverEnd={() => setActiveCard(null)}
                  >
                    <div className="flex flex-col gap-2">
                      <motion.div
                        className={`p-2 rounded-md ${point.colorClass} w-fit`}
                        animate={{ rotate: activeCard === index ? [0, 5, -5, 0] : 0 }}
                        transition={{ repeat: activeCard === index ? Infinity : 0, duration: 1.5 }}
                      >
                        {point.icon}
                      </motion.div>
                      <h4 className="text-sm font-semibold text-white mt-1">{point.title}</h4>
                      <p className="text-gray-400 text-xs leading-relaxed">{point.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;