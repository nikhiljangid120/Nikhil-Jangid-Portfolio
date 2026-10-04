import { useRef, useState, useEffect, useMemo, useCallback, useReducer, memo } from 'react';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import { Code, ShieldCheck, Database, Lightbulb, Github, Linkedin, Mail, MessageCircle, Brain } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card';
import { flushSync } from 'react-dom';
import {
  JOHN_SYSTEM_CONTEXT,
  FALLBACK_RESPONSES,
  QUICK_PROMPTS,
  buildWelcome,
  getLocalResponse,
  isResetCommand,
  pickVaried,
  type KnowledgeTopic,
} from '../lib/john';

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
  | { type: 'FINISH_TYPING'; payload: number }
  | { type: 'RESET_CHAT' };

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
    case 'RESET_CHAT':
      return { ...state, messages: [], input: '' };
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
      // Reveal in chunks so long answers finish in ~1.5s instead of dragging on
      const charsPerTick = Math.max(1, Math.ceil(text.length / 90));
      const speed = Math.random() * 12 + 10;
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text.slice(index, index + charsPerTick));
        setIndex((prev) => Math.min(text.length, prev + charsPerTick));
      }, speed);
      return () => clearTimeout(timer);
    } else {
      dispatch({ type: 'FINISH_TYPING', payload: messageId });
    }
  }, [index, text, messageId, dispatch]);

  return (
    <span className="relative">
      {displayedText}
      {index < text.length && <span className="inline-block w-1 h-4 bg-primary animate-blink ml-1 align-middle" />}
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
          className="w-1.5 h-1.5 bg-primary rounded-full"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
        />
      ))}
    </div>
  </div>
));

// Gemini API key is injected at build time via Vite env (set VITE_GEMINI_API_KEY in your environment / Vercel)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const controls = useAnimation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [chatState, dispatch] = useReducer(chatReducer, { messages: [], input: '', responseHistory: {} });
  const [activeChips, setActiveChips] = useState<{ label: string; query: string }[]>(QUICK_PROMPTS);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const conversationRef = useRef<{ role: 'user' | 'model'; text: string }[]>([]);
  const lastTopicRef = useRef<KnowledgeTopic | null>(null);
  const hasWelcomedRef = useRef(false);

  // Listen for open-portfolio-chat event from command palette or other components
  useEffect(() => {
    const handleOpenChat = () => setIsChatOpen(true);
    window.addEventListener('open-portfolio-chat', handleOpenChat);
    return () => window.removeEventListener('open-portfolio-chat', handleOpenChat);
  }, []);

  // Gemini call with the full profile context and multi-turn conversation memory
  const fetchGeminiResponse = useCallback(
    async (
      query: string,
      isHumorous: boolean,
      history: { role: 'user' | 'model'; text: string }[]
    ): Promise<string> => {
      if (!GEMINI_API_KEY) {
        return pickVaried('offline', FALLBACK_RESPONSES);
      }

      try {
        const tone = isHumorous
          ? 'witty, humorous and clever — one light quip is fine, but stay informative'
          : 'professional, direct and concise';

        const contents = [
          ...history.slice(-8).map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
          { role: 'user', parts: [{ text: query }] },
        ];

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [
                {
                  text: `${JOHN_SYSTEM_CONTEXT}\n\nAnswer in a ${tone} tone. Use the conversation so far to resolve follow-ups like "tell me more" or "why?".`,
                },
              ],
            },
            contents,
            generationConfig: {
              temperature: isHumorous ? 0.9 : 0.6,
              maxOutputTokens: 260,
              topP: 0.95,
            },
          }),
        });

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        return text?.trim() || pickVaried('fallback', FALLBACK_RESPONSES);
      } catch (error) {
        console.error('Gemini API error:', error);
        return `My live connection dropped, but the local knowledge base is intact — ask me about his internships, projects, stack, or contact details.`;
      }
    },
    []
  );

  // Handle query with optimized submission
  const handleQuery = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      if (!trimmed || isThinking) return;

      // Reset conversation on request
      if (isResetCommand(trimmed)) {
        conversationRef.current = [];
        lastTopicRef.current = null;
        dispatch({ type: 'RESET_CHAT' });
        setActiveChips(QUICK_PROMPTS);
        setIsThinking(false);
        hasWelcomedRef.current = true;
        setTimeout(() => {
          dispatch({ type: 'ADD_MESSAGE', payload: { text: buildWelcome(), isUser: false, isTyping: true } });
        }, 250);
        return;
      }

      flushSync(() => {
        dispatch({ type: 'ADD_MESSAGE', payload: { text: trimmed, isUser: true } });
      });

      setIsThinking(true);

      const lowerQuery = trimmed.toLowerCase();
      dispatch({ type: 'INCREMENT_RESPONSE', payload: lowerQuery });

      const isHumorous =
        lowerQuery.includes('joke') ||
        lowerQuery.includes('funny') ||
        lowerQuery.includes('haha') ||
        lowerQuery.includes('tease');

      // 1. Local knowledge engine handles portfolio facts and small talk deterministically
      const localAnswer = getLocalResponse(lowerQuery, lastTopicRef.current);
      let responseText: string;

      if (localAnswer) {
        await new Promise((resolve) => setTimeout(resolve, 280 + Math.random() * 240));
        responseText = localAnswer.text;
        if (localAnswer.topic) lastTopicRef.current = localAnswer.topic;
        if (localAnswer.suggestedPrompts && localAnswer.suggestedPrompts.length > 0) {
          setActiveChips(localAnswer.suggestedPrompts);
        }
      } else {
        // 2. LLM fallback for anything outside the knowledge base
        responseText = await fetchGeminiResponse(lowerQuery, isHumorous, conversationRef.current);
      }

      const nextHistory = [
        ...conversationRef.current,
        { role: 'user' as const, text: trimmed },
        { role: 'model' as const, text: responseText },
      ].slice(-12);
      conversationRef.current = nextHistory;

      setIsThinking(false);
      dispatch({ type: 'ADD_MESSAGE', payload: { text: responseText, isUser: false, isTyping: true } });
      dispatch({ type: 'CLEAR_INPUT' });
    },
    [fetchGeminiResponse, isThinking]
  );

  // Greet once the first time the console is opened
  useEffect(() => {
    if (isChatOpen && !hasWelcomedRef.current) {
      hasWelcomedRef.current = true;
      const timer = setTimeout(() => {
        dispatch({ type: 'ADD_MESSAGE', payload: { text: buildWelcome(), isUser: false, isTyping: true } });
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isChatOpen]);

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
    }
  }, [inView, controls]);

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
      { icon: <Database className="w-5 h-5" />, title: "Scalable Backend", description: "NestJS, PostgreSQL & clean APIs with concurrency safety.", color: "primary", colorClass: "bg-primary/10 border-primary/20 text-primary" },
      { icon: <Brain className="w-5 h-5" />, title: "AI & RAG Systems", description: "Contextual embeddings, pgvector & Llama models.", color: "secondary", colorClass: "bg-secondary/10 border-secondary/20 text-secondary" },
      { icon: <Code className="w-5 h-5" />, title: "Clean Architecture", description: "Structured TypeScript, modular Nx monorepos & clean patterns.", color: "accent", colorClass: "bg-accent/10 border-accent/20 text-accent" },
      { icon: <ShieldCheck className="w-5 h-5" />, title: "System Reliability", description: "Docker environments, robust unit tests & secure JWT auth.", color: "amber", colorClass: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
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

  const chatVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 30 },
  };

  const messageVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <section id="about" ref={ref} className="py-20 relative overflow-hidden bg-inkyblack">
      <style>
        {`
          .chat-orb {
            position: fixed;
            bottom: 1.2rem;
            right: 1.2rem;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: rgba(38, 235, 218, 0.92);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 60;
            box-shadow: 0 10px 28px rgba(0, 0, 0, 0.32);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .chat-orb:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.36);
          }

          .chat-container {
            position: fixed;
            bottom: 5.5rem;
            right: 1.2rem;
            width: 360px;
            max-height: min(560px, calc(100dvh - 9rem));
            background: rgba(13, 17, 23, 0.96);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            overflow: hidden;
            z-index: 60;
            display: flex;
            flex-direction: column;
            box-shadow: 0 18px 60px rgba(0, 0, 0, 0.38);
            border: 1px solid rgba(48, 54, 61, 0.9);
          }

          .chat-header {
            padding: 0.7rem 0.8rem;
            background: linear-gradient(45deg, rgba(38, 235, 218, 0.12), rgba(38, 235, 218, 0.04));
            border-bottom: 1px solid rgba(38, 235, 218, 0.15);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
          }

          .chat-status-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #26ebda;
            box-shadow: 0 0 8px rgba(38, 235, 218, 0.9);
            animation: pulse-glow 2s ease-in-out infinite;
          }

          .chat-messages {
            flex: 1;
            padding: 1rem;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(38, 235, 218, 0.4) transparent;
          }

          .chat-messages::-webkit-scrollbar {
            width: 6px;
          }

          .chat-messages::-webkit-scrollbar-thumb {
            background: rgba(38, 235, 218, 0.4);
            border-radius: 3px;
          }

          .message {
            margin-bottom: 0.8rem;
            padding: 0.6rem 0.9rem;
            border-radius: 10px;
            max-width: 85%;
            font-size: 0.85rem;
            line-height: 1.35;
            box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s ease;
          }

          .message-user {
            background: rgba(38, 235, 218, 0.14);
            border: 1px solid rgba(38, 235, 218, 0.2);
            margin-left: auto;
            color: #fff;
          }

          .message-bot {
            background: rgba(255, 255, 255, 0.04);
            border-left: 2px solid rgba(38, 235, 218, 0.32);
            margin-right: auto;
            color: rgba(240, 246, 252, 0.92);
          }

          .message:hover {
            transform: translateY(-1px);
          }

          .chat-chips {
            display: flex;
            gap: 0.4rem;
            padding: 0.5rem 0.75rem;
            overflow-x: auto;
            scrollbar-width: none;
            border-top: 1px solid rgba(38, 235, 218, 0.1);
            flex-shrink: 0;
          }

          .chat-chips::-webkit-scrollbar {
            display: none;
          }

          .chat-chips button {
            flex-shrink: 0;
            font-size: 0.7rem;
            font-family: 'JetBrains Mono', monospace;
            padding: 0.3rem 0.6rem;
            border-radius: 999px;
            border: 1px solid rgba(38, 235, 218, 0.3);
            background: rgba(38, 235, 218, 0.06);
            color: rgba(38, 235, 218, 0.85);
            cursor: pointer;
            transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
          }

          .chat-chips button:hover {
            transform: translateY(-1px);
            background: rgba(38, 235, 218, 0.14);
            border-color: rgba(38, 235, 218, 0.6);
          }

          .chat-input {
            padding: 0.8rem;
            background: rgba(13, 17, 23, 0.8);
            border-top: 1px solid rgba(38, 235, 218, 0.15);
            flex-shrink: 0;
          }

          .chat-input form {
            display: flex;
            gap: 0.5rem;
          }

          .chat-input input {
            flex: 1;
            min-width: 0;
            padding: 0.6rem;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(38, 235, 218, 0.25);
            border-radius: 6px;
            color: #fff;
            outline: none;
            font-size: 0.85rem;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
          }

          .chat-input input:focus {
            border-color: rgba(38, 235, 218, 0.45);
            box-shadow: 0 0 0 3px rgba(38, 235, 218, 0.08);
          }

          .chat-input input::placeholder {
            color: rgba(255, 255, 255, 0.35);
          }

          .chat-input input:disabled {
            opacity: 0.55;
            cursor: not-allowed;
          }

          .chat-input button {
            padding: 0.6rem 1.1rem;
            background: linear-gradient(45deg, rgba(38, 235, 218, 0.9), rgba(20, 184, 166, 0.9));
            border: none;
            border-radius: 6px;
            color: #04121a;
            font-weight: 600;
            font-size: 0.85rem;
            cursor: pointer;
            transition: transform 0.2s ease, opacity 0.2s ease;
          }

          .chat-input button:hover:not(:disabled) {
            transform: translateY(-1px);
          }

          .chat-input button:disabled {
            opacity: 0.45;
            cursor: not-allowed;
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
              right: 5%;
              bottom: 4.5rem;
              max-height: min(65vh, calc(100dvh - 8rem));
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
              max-width: 90%;
            }
          }

          @media (min-width: 1024px) {
            .chat-container {
              width: 380px;
              max-height: min(580px, calc(100dvh - 9rem));
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
        <MessageCircle className="w-6 h-6 text-[#04121a]" />
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
              <div className="flex items-center gap-2">
                <span className="chat-status-dot" />
                <h3 className="text-sm font-semibold text-white">John</h3>
                <span className="text-[10px] font-mono text-primary/70">Nikhil's secretary · online</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuery('reset')}
                  className="text-[10px] font-mono text-gray-400 hover:text-primary transition-colors"
                  title="Start a new conversation"
                >
                  clear
                </button>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
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
            {!isThinking && activeChips.length > 0 && (
              <div className="chat-chips custom-scrollbar">
                {activeChips.map(({ label, query }) => (
                  <button key={label} type="button" onClick={() => handleQuery(query)}>
                    {label}
                  </button>
                ))}
              </div>
            )}
            <div className="chat-input">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={chatState.input}
                  onChange={(e) => dispatch({ type: 'SET_INPUT', payload: e.target.value })}
                  placeholder={isThinking ? 'John is responding...' : 'Ask me anything about Nikhil...'}
                  disabled={isThinking}
                  autoFocus
                />
                <button type="submit" disabled={isThinking || !chatState.input.trim()}>
                  Send
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="section-container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-x-10 gap-y-10 items-start"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Section header */}
          <motion.div
            className="lg:col-start-1 lg:row-start-1"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-primary/60" />
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-primary">About</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-foreground">About</span> <span className="text-primary opacity-80">Me</span>
            </h2>
            <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
              I'm a <span className="text-primary font-semibold">Software Engineer</span> with a strong interest in backend development, distributed systems, and AI-powered applications.
              My experience spans production backend engineering with NestJS and PostgreSQL, full-stack development using React and Next.js, and intelligent systems built around RAG and modern LLMs.
            </p>
          </motion.div>

          {/* Narrative + social */}
          <div className="space-y-6 lg:col-start-1 lg:row-start-2 min-w-0">
            <motion.p variants={itemVariants} className="text-gray-300 text-sm md:text-base leading-relaxed">
              During my internship at <span className="text-primary font-semibold">Wisflux Tech Labs</span>, I developed transactional backend services, implemented concurrency-safe booking workflows, built document intelligence pipelines using vector embeddings and pgvector, and worked within an Nx monorepo to build modular, scalable applications.
            </motion.p>
            <motion.p variants={itemVariants} className="text-gray-400 text-sm md:text-base leading-relaxed">
              I enjoy designing reliable software, learning system architecture, and transforming complex problems into maintainable engineering solutions. When I'm not shipping, I'm usually deep in a system design article, a DSA problem, or whatever AI tooling just dropped that week.
            </motion.p>

            {/* Social links */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 pt-2">
              {socialLinks.map((link, index) => (
                <HoverCard key={index}>
                  <HoverCardTrigger asChild>
                    <motion.a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-card/60 border border-border/70 rounded-full text-gray-400 hover:text-primary hover:border-primary/30 transition-colors duration-200"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {link.icon}
                    </motion.a>
                  </HoverCardTrigger>
                  <HoverCardContent className="bg-inkyblack/90 border border-primary/20 p-3">
                    <div className="flex flex-col items-center">
                      <div className="mb-1">{link.icon}</div>
                      <p className="text-xs text-white">Connect on {link.label}</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </motion.div>
          </div>

          {/* Photo */}
          <motion.div variants={itemVariants} className="relative mx-auto w-full max-w-[340px] lg:mx-0 lg:max-w-none lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-start group" whileHover={{ y: -4 }}>
            <div className="relative rounded-xl border border-primary/25 bg-charcoal/40 p-2 shadow-[0_0_40px_rgba(38,235,218,0.08)] transition-shadow duration-300 group-hover:shadow-[0_0_60px_rgba(38,235,218,0.15)]">
              <span className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-sm" />
              <span className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-sm" />
              <span className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-sm" />
              <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-sm" />
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src="/profile.jpg"
                  alt="Nikhil Jangid"
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inkyblack/95 via-inkyblack/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-semibold text-sm font-mono">Nikhil Jangid</p>
                  <p className="text-primary text-xs font-mono flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    SDE Intern @ Wisflux Tech Labs
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Core Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-start-1 lg:row-start-3 min-w-0">
            {philosophyPoints.map((point, index) => (
              <motion.div
                key={index}
                className="bg-card/40 backdrop-blur-md rounded-xl p-4 border border-border/70 hover:border-primary/25 hover-lift flex flex-col justify-between transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -2 }}
              >
                <div className="flex flex-col gap-2">
                  <div className={`p-2 rounded-md ${point.colorClass} w-fit`}>
                    {point.icon}
                  </div>
                  <h4 className="text-sm font-semibold text-white mt-1">{point.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{point.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Professional Snapshot */}
          <motion.div variants={itemVariants} className="bg-charcoal/30 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden flex flex-col lg:col-start-2 lg:row-start-3 lg:self-start">
            <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-sm bg-primary/70" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">Snapshot</span>
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
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;