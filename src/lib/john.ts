/**
 * John: knowledge engine for the portfolio chatbot.
 * Scored keyword matcher over a topic knowledge base, small-talk layer,
 * follow-up memory and the LLM system prompt.
 */

export interface KnowledgeTopic {
  id: string;
  keywords: string[];
  responses: string[];
  followUps?: string[];
}

export const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

const recentPickIndex = new Map<string, number>();

/** Random pick that never returns the same variation twice in a row. */
export const pickVaried = (key: string, arr: readonly string[]): string => {
  if (arr.length === 1) return arr[0];
  const last = recentPickIndex.get(key);
  let next = Math.floor(Math.random() * arr.length);
  if (next === last) next = (next + 1 + Math.floor(Math.random() * (arr.length - 1))) % arr.length;
  recentPickIndex.set(key, next);
  return arr[next];
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const keywordCache = new Map<string, RegExp>();

/** Whole-word (boundary aware) keyword test, tolerant of simple plural forms. */
export const containsKeyword = (query: string, keyword: string): boolean => {
  let re = keywordCache.get(keyword);
  if (!re) {
    re = new RegExp(`(^|[^a-z0-9])${escapeRegExp(keyword)}(e?s)?([^a-z0-9]|$)`, 'i');
    keywordCache.set(keyword, re);
  }
  return re.test(query);
};

/* ------------------------------------------------------------------ */
/* Small talk                                                          */
/* ------------------------------------------------------------------ */

const GREETING_RE = /^(hi|hey|hello|yo|hola|namaste|sup|gm|good morning|good afternoon|good evening)\b/i;
const HOW_ARE_YOU_RE = /how (are|r) (you|u)|how'?s it going|how do you do|what'?s up|wassup/i;
const THANKS_RE = /\b(thanks|thank you|thx|ty|appreciate it|appreciated)\b/i;
const PRAISE_RE = /\b(good bot|great bot|nice bot|well done|awesome|amazing|impressive|you'?re (great|awesome|smart|helpful)|love it|good job)\b/i;
const INSULT_RE = /\b(bad bot|dumb|stupid|useless|terrible|you suck|nonsense|garbage|worst)\b/i;
const BYE_RE = /\b(bye|goodbye|see you|see ya|cya|later|gtg|take care)\b/i;
const YES_RE = /^(yes|yeah|yep|yup|sure|ok|okay|alright|cool|please do|go ahead|absolutely)\b/i;
const NO_RE = /^(no|nope|nah|not really|cancel|stop|never mind|nevermind)\b/i;
const PING_RE = /^(ping|test|testing|are you (there|online|awake)|you there)\b/i;
const CONCISE_RE = /\b(be (concise|brief|short)|too long|too much|shorter|keep it short|less detail|straight to the point|don'?t ramble)\b/i;
const BOT_AGE_RE = /\b(how old are you|your age|when were you (created|born|made))\b/i;
const BOT_TECH_RE = /\b(i mean (this|you)|no,? i mean|what (llm|model) (do you use|are you|powers you)|which llm|llm do you use|do you use an? llm|free llm|paid llm|paid or free|free or paid|how do you work|how are you (built|made)|are you (open source|chatgpt|gemini|claude)|your (tech stack|architecture))\b/i;

export const getSmallTalk = (query: string): string | null => {
  const q = query.trim();

  if (BOT_TECH_RE.test(q)) {
    return pickVaried('bottech', [
      `Ah, you mean me! I'm John: a hand-built knowledge engine answering from Nikhil's verified portfolio facts, with Gemini 1.5 Flash as the fallback for off-script questions. No paid chat service behind me: just the local engine, the Gemini API, and this site's frontend.`,
      `Me? Hybrid architecture: a deterministic knowledge base handles verified portfolio facts, and Google's Gemini 1.5 Flash covers anything outside it. If the API key is not configured, I run entirely on the local engine.`,
      `Fair question. I'm John: part hand-written knowledge engine, part Gemini 1.5 Flash LLM, running inside this site. Portfolio questions get verified local answers; anything else goes to the LLM.`,
    ]);
  }
  if (PING_RE.test(q)) {
    return pickVaried('ping', [
      `Pong! 🏓 John is online and fully synced with Nikhil's profile. What would you like to explore?`,
      `Signal is strong. Systems nominal. Ask me anything about Nikhil's engineering work.`,
    ]);
  }
  if (GREETING_RE.test(q)) {
    return pickVaried('greeting', [
      `Hey! John here, Nikhil's portfolio assistant. Want the backend deep dive (NestJS, PostgreSQL, concurrency), the AI projects (production RAG pipeline), or a quick rundown of his internships?`,
      `Hello! Great to connect with you. I can walk you through Nikhil's production experience at Wisflux, five shipped projects, or his core backend stack. Where should we start?`,
      `Hi there! I have Nikhil's verified profile ready: featured roles, live project URLs, 400+ DSA record, and immediate availability. How can I help with your evaluation?`,
    ]);
  }
  if (HOW_ARE_YOU_RE.test(q)) {
    return pickVaried('howareyou', [
      `Running clean with 400+ DSA problems and 4,500+ commits worth of context loaded! 😄 What would you like to know about Nikhil?`,
      `All systems operational! Are you evaluating Nikhil for an engineering role? I can give you the high-level summary or the deep technical architecture.`,
    ]);
  }
  if (BOT_AGE_RE.test(q)) {
    return pickVaried('botage', [
      `I'm John, the portfolio assistant built to answer recruiter and engineer questions about Nikhil. Nikhil is the 21-year-old software engineer behind me!`,
    ]);
  }
  if (CONCISE_RE.test(q)) {
    return pickVaried('concise', [
      `Noted: short, direct answers from here on. What do you want to know?`,
      `Got it. Straight to the point. Ask away!`,
    ]);
  }
  if (INSULT_RE.test(q)) {
    return pickVaried('insult', [
      `Fair enough. Let me focus directly: ask me any question about Nikhil's experience, projects, or stack and I will give you the exact facts.`,
      `Understood. Ask me a direct technical question about Nikhil's backend architectures or project builds.`,
    ]);
  }
  if (PRAISE_RE.test(q) || THANKS_RE.test(q)) {
    return pickVaried('thanks', [
      `Glad that helped! If you are hiring, Nikhil's email is nikhiljangid343@gmail.com, ready for immediate conversations.`,
      `Anytime! Want follow-up details on his Wisflux internship or a live project demo?`,
      `Happy to assist. His downloadable resume and LinkedIn profile are just one click away.`,
    ]);
  }
  if (BYE_RE.test(q)) {
    return pickVaried('bye', [
      `Take care! Nikhil's profiles are always open: github.com/nikhiljangid120 and linkedin.com/in/nikhil-jangid-b84360264.`,
      `Have a great day! Feel free to return if you want to explore more technical details.`,
    ]);
  }
  if (YES_RE.test(q)) {
    return pickVaried('yes', [
      `Great! His SDE internship at Wisflux is his strongest experience: NestJS services in an Nx monorepo, pessimistic-locking booking transactions, and a live RAG pipeline. Want to explore that in detail?`,
      `Let's dive in! Pick an area: the concurrency-safe booking backend, the production RAG document pipeline, or his flagship Flyeng Career platform.`,
    ]);
  }
  if (NO_RE.test(q)) {
    return pickVaried('no', [
      `No problem at all. Feel free to explore the interactive sections or ask me a specific question anytime.`,
      `Understood. I'll be right here whenever you want project URLs, stack details, or contact info.`,
    ]);
  }
  return null;
};

/* ------------------------------------------------------------------ */
/* Knowledge base                                                      */
/* ------------------------------------------------------------------ */

export const KNOWLEDGE: KnowledgeTopic[] = [
  {
    id: 'wisflux',
    keywords: [
      'wisflux',
      'wisflux tech',
      'wisflux tech labs',
      'sde intern',
      'internship at wisflux',
      'intern at wisflux',
      'monorepo',
      'nx monorepo',
      'booking',
      'pessimistic locking',
      'hotel booking',
    ],
    responses: [
      `Wisflux Tech Labs was Nikhil's primary SDE Internship (Jun-Aug 2026). Working within an Nx monorepo, he built production NestJS backend services with PostgreSQL and TypeORM. His two key engineering deliverables were: 1) a transactional hotel booking engine using pessimistic row locking to prevent race conditions and double bookings under high concurrency, and 2) a production RAG document Q&A system with pgvector and OpenRouter/Llama 3.3, fully containerized in Docker.`,
      `At Wisflux Tech Labs (Jun-Aug 2026), Nikhil operated as an SDE Intern building backend microservices in NestJS. He solved real transactional concurrency issues using PostgreSQL pessimistic row locking (SELECT ... FOR UPDATE) and architected an end-to-end RAG system for document retrieval.`,
    ],
    followUps: [
      `Want the concurrency details on how pessimistic locking prevents double bookings?`,
      `Want to explore the production RAG pipeline architecture?`,
    ],
  },
  {
    id: 'celebal',
    keywords: [
      'celebal',
      'celebal tech',
      'celebal technologies',
      'frontend intern',
      'first internship',
      'shipment',
      'tracking',
    ],
    responses: [
      `Celebal Technologies: Frontend Developer Intern (May-Jul 2025). Nikhil built a responsive shipment tracking web application using React.js and Tailwind CSS, integrated with RESTful APIs, and worked in an Agile sprint structure with Git version control.`,
    ],
    followUps: [
      `Want to see how this led into his backend and AI work at Wisflux?`,
      `Want to inspect his full-stack projects?`,
    ],
  },
  {
    id: 'flyeng',
    keywords: [
      'flyeng',
      'flyeng career',
      'flagship',
      'career platform',
      'career',
      'roadmap',
      'roadmaps',
    ],
    responses: [
      `Flyeng Career is Nikhil's flagship full-stack product, live at http://flyeng-career.vercel.app/. Built with Next.js 14 (App Router), TypeScript, PostgreSQL, and Prisma: it provides personalized AI learning roadmaps, resume optimization, interview preparation, and a portfolio builder for engineering students.`,
      `Flyeng Career (http://flyeng-career.vercel.app/) demonstrates Nikhil's end-to-end product engineering: Next.js 14 App Router, PostgreSQL schema design with Prisma ORM, and integrated AI features that help engineers accelerate their careers.`,
    ],
    followUps: [
      `Want to see his production RAG chatbot, or his other AI applications?`,
      `Want to inspect the GitHub source code?`,
    ],
  },
  {
    id: 'internships',
    keywords: [
      'internship',
      'internships',
      'experience',
      'work experience',
      'companies',
      'company',
      'past roles',
      'roles',
      'employment',
      'work history',
      'previous jobs',
      'how many internships',
    ],
    responses: [
      `Nikhil completed two industry internships totaling about 5 months of hands-on production engineering: 1) SDE Intern at Wisflux Tech Labs (Jun-Aug 2026), focusing on NestJS, PostgreSQL concurrency, and pgvector RAG systems; 2) Frontend Developer Intern at Celebal Technologies (May-Jul 2025), building React.js and Tailwind applications in Agile teams.`,
      `Nikhil's industry track record includes 5 months across two internships: backend and AI depth at Wisflux Tech Labs (NestJS, PostgreSQL, TypeORM, Docker, pessimistic locking, RAG), plus frontend delivery at Celebal Technologies (React.js, Tailwind CSS, REST APIs).`,
    ],
    followUps: [
      `Want to dive into his Wisflux backend work or his live projects?`,
      `Want to review his immediate availability to join?`,
    ],
  },
  {
    id: 'rag-chatbot',
    keywords: [
      'rag',
      'rag chatbot',
      'document qa',
      'document q&a',
      'vector',
      'pgvector',
      'minilm',
      'embeddings',
      'openrouter',
      'llama',
      'render',
      'retrieval',
    ],
    responses: [
      `The RAG Chatbot (Document Q&A System) is live at https://nikhil-rag-chatbot.onrender.com/. The architecture pipeline: PDF document ingestion -> SHA-256 deduplication -> sliding-window chunking -> 384-dimensional MiniLM embeddings -> top-5 cosine similarity search via pgvector -> strict source-grounded answers generated via OpenRouter and Llama 3.3. Built with NestJS, React, and PostgreSQL, deployed as a multi-container Docker app on Render.`,
      `Nikhil's live RAG project (https://nikhil-rag-chatbot.onrender.com/) features real document ingestion, vector storage using PostgreSQL's pgvector extension, and context injection with strict grounding to eliminate hallucinations.`,
    ],
    followUps: [
      `Curious how RAG compares to fine-tuning for this architecture?`,
      `Want to explore the chunking and embedding design choices?`,
    ],
  },
  {
    id: 'resume-builder',
    keywords: ['resume builder', 'ai resume', 'ats'],
    responses: [
      `The AI Resume Builder (https://ai-resume-builder-epbj.vercel.app/) is a Next.js and TypeScript application powered by Gemini 1.5 Flash. It generates ATS-optimized resumes with AI bullet point improvements, live preview, multiple templates, and direct PDF export.`,
    ],
    followUps: [`Want to see his code analyzer or fitness platform next?`],
  },
  {
    id: 'code-analyzer',
    keywords: ['code analyzer', 'code analysis', 'd3'],
    responses: [
      `The AI Code Analyzer (https://code-analyzer-f7bq.vercel.app/) utilizes Next.js and the Groq API for rapid LLM code-quality analysis, using D3.js to visualize code complexity metrics across multiple languages.`,
    ],
    followUps: [`Want to explore his full project portfolio?`],
  },
  {
    id: 'fitness',
    keywords: ['fitness', 'nutrition', 'workout'],
    responses: [
      `The AI Fitness Platform (https://fitness-platform-zeta.vercel.app/) is a Next.js and Firebase application using the Gemini API to generate personalized workout routines and nutrition targets with progress tracking.`,
    ],
    followUps: [`Want his projects ranked by backend and systems depth?`],
  },
  {
    id: 'rag-vs-ft',
    keywords: ['rag vs fine tuning', 'rag vs finetuning', 'fine tune', 'fine tuning', 'finetune', 'why rag'],
    responses: [
      `Nikhil's technical perspective: RAG wins when knowledge changes frequently and strict citations are required, because you re-index documents instead of retraining costly models. Fine-tuning wins for teaching novel format, specific tone, or a narrow task on static data. For document Q&A, RAG is significantly cheaper, auditable, and always up to date.`,
    ],
    followUps: [`Want to hear about the embedding and retrieval pipeline design?`],
  },
  {
    id: 'concurrency',
    keywords: [
      'concurrency',
      'race condition',
      'race conditions',
      'transaction',
      'transactions',
      'acid',
      'isolation level',
      'optimistic locking',
      'pessimistic locking',
      'double booking',
      'select for update',
    ],
    responses: [
      `At Wisflux, Nikhil implemented pessimistic row locking (SELECT ... FOR UPDATE) inside TypeORM database transactions for the booking service. In high-demand reservation systems, optimistic locking fails under high contention, causing retry storms and poor UX. Pessimistic locking locks the room record at the PostgreSQL engine level for the transaction duration, guaranteeing zero double bookings and absolute consistency.`,
    ],
    followUps: [`Want to discuss his database design choices (indexing, migrations, schema)?`],
  },
  {
    id: 'sql',
    keywords: ['database design', 'indexes', 'indexing', 'normalization', 'migration', 'migrations', 'typeorm', 'prisma', 'sql query', 'joins', 'postgresql'],
    responses: [
      `Nikhil is PostgreSQL-first: normalized schemas, explicit indexes on hot query paths, foreign key constraints for integrity, and version-controlled migrations. In NestJS he has used TypeORM for transactional locking and pgvector, and Prisma in Next.js for Flyeng Career. He is comfortable writing raw SQL queries when optimization is necessary.`,
    ],
    followUps: [`Want to see his backend architectural design patterns?`],
  },
  {
    id: 'backend',
    keywords: ['backend', 'back end', 'server side', 'nest', 'nestjs', 'node', 'express', 'api', 'apis', 'rest', 'restful', 'microservice', 'microservices', 'jwt', 'authentication', 'authorization', 'swagger'],
    responses: [
      `Backend engineering is Nikhil's primary focus: NestJS and Node.js with REST API design, JWT authentication, TypeORM/Prisma data layers, PostgreSQL, Swagger documentation, and Docker for containerization. He prioritizes validation, strict error contracts, and transactional correctness over simple CRUD endpoints.`,
      `He builds with NestJS as his primary backend framework: modular architecture, DTO validation with class-validator, guards for RBAC authentication, and typed repositories, containerized with Docker.`,
    ],
    followUps: [`Want to explore his AI engineering skills or concurrency work?`],
  },
  {
    id: 'ai-engineering',
    keywords: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'llm', 'llms', 'genai', 'generative ai', 'prompt engineering', 'openrouter', 'groq', 'gemini'],
    responses: [
      `On the AI side, Nikhil is a practical systems builder: production RAG pipelines (ingestion, chunking, embeddings, vector search), LLM API orchestration (OpenRouter, Gemini, Groq), prompt engineering, and strict grounding to prevent hallucinations. All his AI features are deployed and testable live.`,
    ],
    followUps: [`Want his RAG architecture details or how he uses pgvector?`],
  },
  {
    id: 'frontend',
    keywords: ['frontend', 'front end', 'react', 'next js', 'nextjs', 'typescript', 'tailwind', 'ui', 'ux', 'zustand', 'framer motion'],
    responses: [
      `On the frontend, Nikhil builds with React and Next.js 14 (App Router) in TypeScript, utilizing Tailwind CSS, Zustand for state management, and Framer Motion for responsive micro-interactions. This portfolio is itself a showcase of his frontend engineering craft.`,
    ],
    followUps: [`Want to review his full technical arsenal?`],
  },
  {
    id: 'devops',
    keywords: ['devops', 'docker', 'docker compose', 'ci cd', 'cicd', 'deployment', 'deploy', 'vercel', 'render', 'git', 'github workflow', 'monorepo', 'nx'],
    responses: [
      `Nikhil containerizes his systems: Docker and Docker Compose for multi-container local and production setups, Nx monorepos for shared codebases across services, Git for team workflows, and automated deployments on Render and Vercel. His live RAG chatbot runs on Render using Docker.`,
    ],
    followUps: [`Want to review his GitHub repositories?`],
  },
  {
    id: 'system-design',
    keywords: ['system design', 'architecture', 'scalable', 'scalability', 'distributed', 'caching', 'queue', 'load balancing', 'design pattern', 'scale', 'high traffic'],
    responses: [
      `Nikhil designs systems around clear boundaries, failure resilience, and data consistency: identifying single sources of truth, eliminating race conditions via transactional locking, implementing idempotent retry strategies, and decoupling heavy workloads. For scalability, he advocates stateless backend services, Redis caching for hot paths, and database connection pooling.`,
    ],
    followUps: [`Want to discuss how he prevented double bookings at Wisflux?`],
  },
  {
    id: 'testing',
    keywords: ['testing', 'unit test', 'unit tests', 'jest', 'test coverage', 'tdd'],
    responses: [
      `Nikhil focuses testing where reliability matters most: critical business logic and transactional boundaries. He uses Jest for unit testing and relies on typed DTOs with class-validator and Swagger contracts to make API boundaries robust and self-documenting.`,
    ],
    followUps: [`Want to know how he verified the RAG retrieval accuracy?`],
  },
  {
    id: 'dsa',
    keywords: ['dsa', 'data structures', 'algorithms', 'leetcode', 'gfg', 'geeksforgeeks', 'codechef', 'problem solving', 'competitive programming', 'hackerearth'],
    responses: [
      `400+ DSA problems solved in C++ across LeetCode and GeeksForGeeks, 3-star rating on CodeChef, top 10% ranking on GeeksForGeeks, and a 100-day LeetCode streak badge. His LeetCode profile is available at https://leetcode.com/u/nikhil_888/.`,
      `Nikhil has solved 400+ algorithmic problems in C++ (LeetCode and GFG), holds a 3-star CodeChef rating, and maintained a 100-day streak on LeetCode. You can verify his profile at https://leetcode.com/u/nikhil_888/.`,
    ],
    followUps: [`Want to check his GitHub with 4,500+ contributions?`],
  },
  {
    id: 'achievements',
    keywords: ['achievement', 'achievements', 'award', 'hackathon', 'prize', 'certification', 'certifications', 'certificate', 'ibm', 'mckinsey', 'first prize'],
    responses: [
      `Key achievements: First Prize at the Amity University hackathon, GirlScript Summer of Code contributor, IBM SkillsBuild AI certification, McKinsey Forward Program graduate, 3-star CodeChef rating, top 10% on GeeksForGeeks, 400+ DSA problems solved, and 4,500+ GitHub contributions.`,
    ],
    followUps: [`Want to hear about his hackathon project or certifications?`],
  },
  {
    id: 'open-source',
    keywords: ['open source', 'opensource', 'gssoc', 'girlscript', 'contribution', 'contributions'],
    responses: [
      `Nikhil contributed through GirlScript Summer of Code (GSSoC) and maintains a 4,500+ contribution GitHub graph at https://github.com/nikhiljangid120. Open-source contribution gave him practical experience reading existing codebases and adhering to established team conventions.`,
    ],
    followUps: [`Want to review his live project deployments?`],
  },
  {
    id: 'education',
    keywords: ['education', 'college', 'university', 'cgpa', 'gpa', 'b tech', 'btech', 'degree', 'amity', 'graduation', 'graduate', 'graduated', 'school', 'marks', 'study', 'studied', 'studies', 'sgpa'],
    responses: [
      `B.Tech in Computer Science and Engineering from Amity University Rajasthan (batch 2022-2026) with an 8.48 CGPA. He completed his degree in 2026 and is fully available for full-time software engineering roles.`,
    ],
    followUps: [`Want to explore his internships or project builds?`],
  },
  {
    id: 'identity',
    keywords: ['who is nikhil', 'about nikhil', 'tell me about nikhil', 'introduce nikhil', 'nikhil jangid', 'his background', 'summary', 'introduction'],
    responses: [
      `Nikhil Jangid is a 21-year-old software engineer based in Jaipur, India. He graduated B.Tech CSE with an 8.48 CGPA and completed an SDE Internship at Wisflux Tech Labs, where he engineered NestJS services and a live pgvector RAG system. With two internships, 5 shipped projects, 400+ DSA solutions, and 4,500+ GitHub commits, he is targeting Software Engineer / Backend / Full-Stack opportunities.`,
      `Summary: Nikhil is a backend-focused full-stack engineer from Jaipur. He has built and deployed a production RAG pipeline with pgvector, an AI career development platform, and multiple full-stack tools. He brings strong fundamentals in NestJS, PostgreSQL, Docker, and real AI integration.`,
    ],
    followUps: [
      `Want his internship details or flagship project walkthrough?`,
      `Want his contact details or immediate availability?`,
    ],
  },
  {
    id: 'hiring',
    keywords: ['why should i hire', 'why hire', 'should i hire', 'why him', 'why nikhil', 'strength', 'strengths', 'good fit', 'stand out', 'recruiter', 'evaluate', 'merits', 'why select', 'why to select', 'select him', 'why choose', 'choose him', 'why pick', 'pick him'],
    responses: [
      `Three compelling reasons: 1) He ships: five live deployed products with real users and public code, not simple tutorials. 2) Engineering rigor: he tackles difficult challenges like pessimistic row locking for concurrency, sliding-window chunking in RAG pipelines, and reproducible Docker environments. 3) High velocity and fundamentals: 400+ DSA problems solved and 4,500+ GitHub contributions demonstrating relentless consistency.`,
      `Nikhil brings immediate engineering value: production backend experience with NestJS and PostgreSQL from Wisflux Tech Labs, frontend delivery in Agile teams from Celebal, 400+ algorithmic problem solutions, and live AI systems in production.`,
    ],
    followUps: [
      `Want his email to set up an interview?`,
      `Want to inspect his Wisflux backend or RAG architecture?`,
    ],
  },
  {
    id: 'why-not-hire',
    keywords: [
      "why shouldn't i hire",
      "why should i not hire",
      "why not hire",
      "reasons to reject",
      "reasons not to hire",
      "why reject",
      "red flags",
      "downsides",
      "dealbreaker",
      "why would i pass",
      "reasons to pass",
    ],
    responses: [
      `Direct and honest answer: if you are looking for a 10-year veteran enterprise architect to manage a 50-person department on day one, that is not Nikhil, as he graduated B.Tech CSE in 2026. However, if you need an ambitious engineer who independently designs concurrency-safe NestJS transactional services, builds production RAG pipelines with pgvector, and solves 400+ DSA problems with 4,500+ commits, he delivers exceptional value from week one.`,
      `Transparent perspective: Nikhil is an early-career engineer (2026 graduate) with two high-impact internships. What sets him apart is that he builds real, resilient software: Wisflux trusted him with core transactional booking workflows using pessimistic locking and full Dockerized RAG pipelines.`,
    ],
    followUps: [
      `Want to inspect his Wisflux backend architecture or live RAG project?`,
      `Want to review his core tech stack?`,
    ],
  },
  {
    id: 'weakness',
    keywords: [
      'weakness',
      'weaknesses',
      'biggest weakness',
      'what are his flaws',
      'where does he struggle',
      'what is he bad at',
      'limitations',
      'flaw',
      'flaws',
      'worst quality',
    ],
    responses: [
      `Transparently: Nikhil is heavily backend and systems focused. While he builds clean React and Next.js interfaces (like Flyeng Career and this portfolio), advanced CSS micro-tweaks and visual design agency styling are not where he spends the bulk of his energy. He chooses to focus on database locking, query performance, API contracts, and pipeline correctness.`,
      `His growth focus: having mastered single-instance and Dockerized cloud deployments, he is eager to work with large-scale distributed Kubernetes clusters and event streaming architectures like Kafka. He picks up new systems rapidly: going from zero to deploying pgvector RAG at Wisflux illustrates his learning speed.`,
    ],
    followUps: [
      `Want to test him on system design or DSA concepts?`,
      `Want to explore his Wisflux backend implementation?`,
    ],
  },
  {
    id: 'behavioral-debugging',
    keywords: [
      'debugging',
      'troubleshooting',
      'hardest bug',
      'challenging bug',
      'production issue',
      'fixed a bug',
      'solve problem',
      'problem solving in code',
    ],
    responses: [
      `At Wisflux, Nikhil identified and solved a critical concurrency race condition during booking tests. When simulated concurrent requests attempted to reserve the same room simultaneously, naive status checks allowed double bookings. Nikhil refactored the flow into an atomic TypeORM transaction with pessimistic row locking (SELECT ... FOR UPDATE), guaranteeing that concurrent transactions wait and evaluate updated state, completely eliminating race conditions.`,
    ],
    followUps: [
      `Want to know more about the locking mechanism or how it was tested?`,
      `Want to see his production RAG architecture?`,
    ],
  },
  {
    id: 'behavioral-teamwork',
    keywords: [
      'teamwork',
      'collaboration',
      'agile',
      'scrum',
      'cross-functional',
      'git workflow',
      'code review',
      'conflict',
      'work with team',
    ],
    responses: [
      `Across his internships at Wisflux Tech Labs (Nx monorepo) and Celebal Technologies, Nikhil worked in Agile sprint cycles with daily standups, Jira task tracking, and rigorous Git pull request reviews. He values constructive feedback, writes self-documenting code with clear PR descriptions, and actively aligns backend contracts with frontend team requirements.`,
    ],
    followUps: [
      `Want to discuss his communication skills or availability?`,
    ],
  },
  {
    id: 'behavioral-learning',
    keywords: [
      'learning new tech',
      'adaptability',
      'how fast does he learn',
      'new framework',
      'fast learner',
      'pick up tech',
    ],
    responses: [
      `Nikhil is an exceptionally fast learner with strong fundamentals in C++ and DSA. When joining Wisflux, he rapidly mastered NestJS, TypeORM, and pgvector embeddings to deliver their core transactional booking service and Dockerized RAG pipeline within his 3-month internship. He stays ahead of industry trends, currently building with Next.js 14 App Router and Model Context Protocol (MCP).`,
    ],
    followUps: [
      `Want to explore his projects or review his tech stack?`,
    ],
  },
  {
    id: 'ppo',
    keywords: [
      'why not ppo in wisflux',
      'why not ppo',
      'why no ppo',
      'did he get a ppo',
      'did he get ppo',
      'ppo in wisflux',
      'wisflux ppo',
      'ppo offer',
      'return offer',
      'pre placement offer',
      'full time at wisflux',
      'why not join wisflux',
      'why didn\'t wisflux hire',
      'why didn\'t he get ppo',
      'why didn\'t wisflux give ppo',
      'why leave wisflux',
      'why left wisflux',
      'why switch from wisflux',
      'why not continue at wisflux',
      'why did he leave wisflux',
      'why looking for a job after wisflux',
      'ppo',
    ],
    responses: [
      `Nikhil completed his tenure at Wisflux Tech Labs as a planned 3-month Summer SDE Internship (Jun-Aug 2026) during his final year of B.Tech CSE. He fulfilled all core milestones: shipping their transactional hotel-booking engine with pessimistic row locking and a production pgvector RAG pipeline. Having successfully completed his degree in 2026, he is now actively exploring high-growth engineering teams, scalable product companies, and fast-paced startups where he can take full ownership of backend microservices, distributed systems, and modern AI pipelines. He wrapped up his internship on great terms, has zero notice period, and is available to join immediately.`,
      `The Wisflux role was a structured 3-month Summer SDE Internship (Jun-Aug 2026) aligned with his university schedule. Nikhil delivered his project commitments, including concurrency-safe transactional APIs and Dockerized RAG pipelines with pgvector. With his B.Tech CSE completed in 2026, he is deliberately interviewing across the broader tech ecosystem for high-impact Software Engineer and Backend Developer positions.`,
    ],
    followUps: [
      `Want to inspect his Wisflux backend architecture or live RAG pipeline?`,
      `Want his immediate availability date or contact info?`,
    ],
  },
  {
    id: 'fresher-vs-experienced',
    keywords: [
      'why hire a fresher',
      'fresher vs experienced',
      'lack of experience',
      'no full time experience',
      'only intern experience',
      'risk of hiring fresher',
      'junior engineer',
      'just graduated fresher',
      'why fresher',
      'hire fresher',
    ],
    responses: [
      `Valid question. Many early-career applicants have only built tutorial projects, but Nikhil has already delivered production systems: at Wisflux Tech Labs, he resolved concurrency race conditions with PostgreSQL row-level locking (SELECT ... FOR UPDATE) and built an end-to-end pgvector RAG pipeline in Docker. Add to that 5 live deployed applications, 400+ DSA problems solved in C++, and an 8.48 CGPA. You get an engineer with high execution velocity, strong computer science fundamentals, and the hunger to make an immediate impact from week one.`,
    ],
    followUps: [
      `Want to inspect his Wisflux backend implementation or live projects?`,
    ],
  },
  {
    id: 'celebal-tenure',
    keywords: [
      'why leave celebal',
      'celebal duration',
      'why only 2 months at celebal',
      'why 2 months',
      'celebal ppo',
      'why short at celebal',
      'celebal return offer',
    ],
    responses: [
      `Celebal Technologies was a planned 2-month summer internship (May-Jul 2025) between academic semesters. Nikhil delivered a responsive shipment tracking web application with React and Tailwind CSS, worked in an Agile sprint team with Git workflows, and returned to complete his university coursework before earning his backend SDE internship at Wisflux Tech Labs.`,
    ],
    followUps: [
      `Want to hear about his transition into backend systems at Wisflux?`,
    ],
  },
  {
    id: 'failure-learnings',
    keywords: [
      'biggest mistake',
      'failure in code',
      'failed project',
      'what did he learn from failure',
      'bug in production',
      'biggest failure',
      'technical failure',
    ],
    responses: [
      `Early in his booking service implementation, he initially relied on naive optimistic status checks. Under simulated high-concurrency loads, double-booking race conditions slipped through. Instead of patching with band-aid retries, he dug deep into database transaction isolation and ACID guarantees, refactoring the service to use atomic TypeORM transactions with PostgreSQL row-level locks (SELECT ... FOR UPDATE). It taught him to design around data invariants and failure modes from day one.`,
    ],
    followUps: [
      `Want to hear more about how he tested concurrency edge cases?`,
    ],
  },
  {
    id: 'nestjs-vs-express',
    keywords: [
      'why nestjs',
      'nestjs vs express',
      'why use nestjs',
      'express vs nestjs',
      'why choose nestjs',
      'difference between nestjs and express',
    ],
    responses: [
      `Express is minimal and great for tiny scripts, but lacks architectural structure, often leading to unmaintainable code as systems grow. NestJS provides an enterprise-ready modular architecture out of the box: dependency injection, TypeScript-first types, declarative DTO validation with class-validator, guard-based authentication, and automated Swagger OpenAPI documentation. Nikhil chose NestJS at Wisflux because it enforces clean separation of concerns and team-wide consistency.`,
    ],
    followUps: [
      `Want to see his NestJS architectural design patterns?`,
    ],
  },
  {
    id: 'postgres-vs-mongo',
    keywords: [
      'postgres vs mongo',
      'postgresql vs mongodb',
      'why postgres',
      'why postgresql',
      'sql vs nosql',
      'why relational',
      'why not mongodb',
    ],
    responses: [
      `For transactional systems like booking or finance, PostgreSQL provides rock-solid ACID guarantees, relational integrity with foreign keys, and row-level pessimistic locking (SELECT ... FOR UPDATE) to prevent concurrency anomalies. Furthermore, with the pgvector extension, PostgreSQL can also store and query 384-dimensional vector embeddings, eliminating the need to maintain a separate vector database for RAG pipelines.`,
    ],
    followUps: [
      `Want to explore how he uses pgvector in his live RAG project?`,
    ],
  },
  {
    id: 'rag-hallucinations',
    keywords: [
      'prevent hallucination',
      'hallucinations',
      'hallucinate',
      'rag accuracy',
      'grounded answers',
      'how to stop hallucinations',
      'hallucination prevention',
    ],
    responses: [
      `Nikhil's production RAG pipeline (https://nikhil-rag-chatbot.onrender.com/) prevents hallucinations through four defensive layers: 1) SHA-256 deduplication on document upload, 2) sliding-window text chunking to preserve contextual boundaries, 3) 384-dimensional MiniLM vector embeddings stored in pgvector for top-5 cosine similarity search, and 4) system prompts that enforce strict context grounding: instructing the LLM to reply only using retrieved context and explicitly declare when the answer is not present in the document.`,
    ],
    followUps: [
      `Want to test his live RAG chatbot deployment on Render?`,
    ],
  },
  {
    id: 'communication-culture',
    keywords: [
      'communication skills',
      'english proficiency',
      'culture fit',
      'team player',
      'work ethic',
      'self starter',
      'cross functional',
      'collaborate',
    ],
    responses: [
      `Nikhil communicates with clarity, precision, and technical rigor. Across his internships at Wisflux and Celebal, he actively collaborated in cross-functional Agile teams with daily standups, clear PR descriptions, and collaborative design docs. He approaches feedback with an open growth mindset and enjoys pairing with teammates to solve difficult architectural bottlenecks.`,
    ],
    followUps: [
      `Want his contact details or to schedule an introductory call?`,
    ],
  },
  {
    id: 'job-hopper',
    keywords: [
      'will he leave',
      'job hopper',
      'loyalty',
      'stay long',
      'quit soon',
      'flight risk',
      'short term',
      'retention',
      'leave after 3 months',
    ],
    responses: [
      `Nikhil's record demonstrates strong discipline: 4 consistent years completing his B.Tech CSE with an 8.48 CGPA, a 100-day consecutive LeetCode streak, and over 4,500 GitHub contributions. He is looking for a team with high engineering standards where he can commit long term, take ownership of critical services, and grow with the company.`,
    ],
    followUps: [`Want to discuss his work ethic or availability?`],
  },
  {
    id: 'vibe-coder',
    keywords: [
      'vibe coder',
      'vibe coding',
      'copy from chatgpt',
      'uses chatgpt',
      'ai cheater',
      'does he just prompt',
      'can he code without ai',
      'without chatgpt',
      'writes code himself',
    ],
    responses: [
      `Nikhil is anchored in computer science fundamentals: he has solved 400+ algorithmic problems in C++ on LeetCode and GeeksForGeeks, built raw PostgreSQL schemas with pgvector similarity indexing, and handled race conditions with row-level locks. He uses AI as an engineering multiplier, not a replacement for core engineering principles.`,
    ],
    followUps: [`Want the technical breakdown of his RAG pipeline or locking mechanism?`],
  },
  {
    id: 'roast',
    keywords: [
      'roast',
      'roast him',
      'roast nikhil',
      'insult',
      'make fun of him',
      'tease',
      'joke about him',
    ],
    responses: [
      `Nikhil has 4,500+ GitHub contributions and 400+ DSA problems solved... which means his code editor has seen more of him than sunlight this year! He implemented pessimistic locking at Wisflux probably because he has trust issues with concurrent threads. But since his services run with zero double bookings, we'll forgive the dark mode obsession! 😄`,
      `Roasting Nikhil? The engineer built five full-stack apps and an AI assistant (me) just so recruiters wouldn't have to read a static resume PDF! If he slept as much as he configures Docker Compose, he might remember what a full 8 hours of rest feels like! 😉`,
    ],
    followUps: [
      `Want a serious technical walkthrough of his stack or projects now?`,
    ],
  },
  {
    id: 'personal-life',
    keywords: ['touch grass', 'outside coding', 'free time', 'does he sleep'],
    responses: [
      `Outside of code, Nikhil stays curious: he studies engineering postmortems, experiments with emerging AI agent protocols like MCP, and solves algorithmic challenges for fun, which is how his 400+ DSA problem count was built.`,
    ],
    followUps: [`Want to know about his hackathon win or certifications?`],
  },
  {
    id: 'salary-negotiation',
    keywords: ['salary', 'ctc', 'package', 'compensation', 'pay', 'budget', 'expected salary', 'hourly rate'],
    responses: [
      `Nikhil's compensation expectations align with standard market rates for high-impact early-career Software Engineers and Backend Developers. He is open to discussions based on role scope, equity, and location. For direct compensation discussions, feel free to email nikhiljangid343@gmail.com.`,
    ],
    followUps: [`Want to check his immediate availability date or technical skills?`],
  },
  {
    id: 'pressure-stress',
    keywords: ['handle pressure', 'under pressure', 'stress', 'tight deadlines', 'outages', 'late nights', 'production bug', 'on-call'],
    responses: [
      `During his Wisflux internship and hackathons (where he took First Prize), Nikhil built under tight delivery schedules. He proactively implements defensive patterns like pessimistic row locks and input validation so production outages and concurrency fires are prevented by design.`,
    ],
    followUps: [`Want to discuss his Wisflux experience or his availability?`],
  },
  {
    id: 'pedigree',
    keywords: ['tier 3', 'tier 1', 'iit', 'nit', 'amity', 'college tier', 'pedigree', 'degree matter', 'college brand'],
    responses: [
      `College names don't write clean Dockerfiles or eliminate database race conditions: demonstrated execution does. Nikhil built 5 live deployed applications, completed 2 industry internships, solved 400+ DSA problems, and graduated with an 8.48 CGPA. His verified code at https://github.com/nikhiljangid120 speaks directly to his capability.`,
    ],
    followUps: [`Want to see his live flagship Flyeng Career platform or RAG chatbot?`],
  },
  {
    id: 'visitor-role',
    keywords: ['hiring manager', 'recruiter', 'hr', 'ceo', 'cto', 'director', 'founder', 'interviewer', 'manager'],
    responses: [
      `For recruiters and HR: Nikhil is a 2026 B.Tech CSE graduate available immediately for SWE, Backend, and Full-Stack roles with zero notice period. For engineering leads and CTOs: his core strength is backend systems, featuring NestJS, PostgreSQL transactional concurrency (pessimistic locking), and pgvector RAG pipelines. Contact him at nikhiljangid343@gmail.com.`,
    ],
    followUps: [`Want to explore his project source code or download his resume?`],
  },
  {
    id: 'origin',
    keywords: ['is he from', 'where from', 'nationality', 'country is he from', 'indian', 'india', 'jaipur', 'location'],
    responses: [
      `Nikhil is based in Jaipur, Rajasthan, India. He is open to relocation (e.g. Bangalore, Pune, Hyderabad, NCR) and available for remote, hybrid, or on-site engineering positions.`,
    ],
    followUps: [`Want his contact details or availability date?`],
  },
  {
    id: 'mcp',
    keywords: ['mcp', 'model context protocol', 'agent protocol', 'ai agents', 'agentic'],
    responses: [
      `MCP (Model Context Protocol) is the emerging standard allowing AI models to securely connect with tools, APIs, and data sources. Nikhil includes MCP in his AI engineering toolkit alongside LangChain, vector retrieval with pgvector, and structured outputs for production AI workflows.`,
    ],
    followUps: [`Want to see his live RAG document Q&A system?`],
  },
  {
    id: 'source-code',
    keywords: ['source code', 'codebase', 'repository', 'repositories', 'repo', 'github code', 'see the code', 'show code'],
    responses: [
      `All of Nikhil's code is public on GitHub: https://github.com/nikhiljangid120. Key repositories include Flyeng Career, the RAG Chatbot, AI Resume Builder, and AI Code Analyzer.`,
    ],
    followUps: [`Want a recommendation on which repository to review first?`],
  },
  {
    id: 'contact',
    keywords: ['contact', 'email', 'mail', 'reach', 'connect', 'phone', 'mobile', 'number', 'linkedin', 'get in touch', 'call'],
    responses: [
      `Email: nikhiljangid343@gmail.com | Phone: +91 8058803339 | LinkedIn: https://linkedin.com/in/nikhil-jangid-b84360264 | GitHub: https://github.com/nikhiljangid120. Nikhil responds promptly via email and LinkedIn.`,
    ],
    followUps: [`Would you like to download his resume as well?`],
  },
  {
    id: 'availability',
    keywords: ['available', 'availability', 'open to work', 'notice period', 'start date', 'when can he start', 'join', 'joining', 'immediate'],
    responses: [
      `Nikhil is available to join immediately with zero notice period. Having graduated B.Tech CSE in 2026 and wrapped up his Wisflux internship in August 2026, he is actively interviewing for Software Engineer, Backend Developer, and Full-Stack Developer roles.`,
    ],
    followUps: [`Want his contact details to schedule an initial conversation?`],
  },
  {
    id: 'relocation',
    keywords: ['relocate', 'relocation', 'bangalore', 'pune', 'hyderabad', 'ncr', 'delhi', 'remote', 'hybrid', 'onsite'],
    responses: [
      `Yes, Nikhil is actively open to relocating to major tech hubs including Bangalore, Pune, Hyderabad, Delhi NCR, and Mumbai. He is also fully set up for remote or hybrid positions.`,
    ],
    followUps: [`Want his contact email to connect directly?`],
  },
  {
    id: 'full-stack-skills',
    keywords: ['skills', 'tech stack', 'technologies', 'tools', 'languages', 'frameworks', 'arsenal'],
    responses: [
      `Nikhil's core technical stack: Languages: JavaScript, TypeScript, C++, Python, SQL. Backend: NestJS, Node.js, Express, TypeORM, Prisma, REST APIs, JWT, Swagger. Frontend: React, Next.js 14, Tailwind CSS, Zustand, Framer Motion. Databases: PostgreSQL, pgvector, MongoDB, MySQL, Firebase. AI & Cloud: RAG pipelines, MiniLM embeddings, OpenRouter, Docker, Docker Compose, Git, Vercel, Render.`,
    ],
    followUps: [`Want to see projects built with any specific technology?`],
  },
  {
    id: 'projects-summary',
    keywords: ['projects', 'all projects', 'project list', 'built', 'portfolio projects', 'demos'],
    responses: [
      `Nikhil has five live deployed projects: 1) Flyeng Career (AI career platform in Next.js 14 & Prisma), 2) RAG Chatbot (Document Q&A in NestJS, Docker & pgvector), 3) AI Resume Builder (ATS optimization with Gemini), 4) AI Code Analyzer (code metrics with Groq & D3.js), and 5) AI Fitness Platform (Firebase & Gemini). All source code is on GitHub at https://github.com/nikhiljangid120.`,
    ],
    followUps: [`Want to inspect the live link for any of these?`],
  },
  {
    id: 'recommend',
    keywords: ['which project', 'best project', 'favorite project', 'recommend', 'where should i start', 'standout project'],
    responses: [
      `For backend and AI engineering: check out the live RAG Chatbot at https://nikhil-rag-chatbot.onrender.com/ (pgvector, Docker, NestJS). For full-stack product development: inspect Flyeng Career at http://flyeng-career.vercel.app/ (Next.js 14, Prisma, PostgreSQL).`,
    ],
    followUps: [`Want a breakdown of either project's architecture?`],
  },
  {
    id: 'resume',
    keywords: ['resume', 'cv', 'download resume', 'pdf'],
    responses: [
      `Nikhil's resume is downloadable via the "Download Resume" button in the Hero section or the Resume section on this page. It outlines his Wisflux and Celebal internships, his 5 projects, 400+ DSA problem record, and 8.48 CGPA.`,
    ],
    followUps: [`Want his direct email address as well?`],
  },
  {
    id: 'joke',
    keywords: ['joke', 'jokes', 'funny', 'make me laugh', 'humor', 'humour', 'pun'],
    responses: [
      `Why did the NestJS service go to therapy? Too many dependencies injected! 😄 Want a real answer about his concurrency-safe booking backend instead?`,
      `Why are database engineers great dancers? Because they know how to avoid deadlocks! 🕺 Ask me about his production RAG pipeline next.`,
      `A recruiter asked Nikhil about scalability. He replied: "Stateless microservices and horizontal scaling." The recruiter smiled and asked about DSA: 400+ problems solved in C++! 😄`,
    ],
    followUps: [`Ready to explore his backend stack or project builds?`],
  },
];

const FOLLOW_UP_RE = /\b(tell me more|more details|elaborate|go deeper|expand|more|continue|and\?|why|how so|explain more|details|detail)\b/i;

export const isFollowUp = (query: string): boolean => FOLLOW_UP_RE.test(query.trim());

/** Score every topic against the query; highest specificity wins. */
export const findBestTopic = (query: string): KnowledgeTopic | null => {
  let best: KnowledgeTopic | null = null;
  let bestScore = 0;
  const q = query.trim().toLowerCase();

  for (const topic of KNOWLEDGE) {
    let score = 0;
    for (const keyword of topic.keywords) {
      const kw = keyword.toLowerCase();
      if (q.includes(kw)) {
        // Multi-word exact phrase match gets high priority
        const wordCount = kw.split(/\s+/).length;
        if (wordCount >= 3) {
          score += 15;
        } else if (wordCount === 2) {
          score += 7;
        } else if (containsKeyword(q, kw)) {
          score += 3;
        }
      } else if (containsKeyword(q, kw)) {
        score += kw.includes(' ') ? 5 : 2;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  }
  return bestScore > 0 ? best : null;
};

export interface LocalAnswer {
  text: string;
  topic: KnowledgeTopic | null;
  suggestedPrompts?: { label: string; query: string }[];
}

/** Smart intent-based fallback for queries that don't match specific topics */
export const getSmartFallback = (query: string): LocalAnswer => {
  const q = query.toLowerCase();

  // Salary / compensation intent
  if (/\b(money|budget|pay|ctc|package|salary|compensation|hourly|rate|cost)\b/.test(q)) {
    return {
      text: `Nikhil's compensation expectations reflect competitive market standards for high-impact early-career Software Engineers. He is open to discussions based on role scope, equity, and location. Reach him directly at nikhiljangid343@gmail.com for numbers.`,
      topic: null,
      suggestedPrompts: [
        { label: 'Why hire Nikhil?', query: 'Why should I hire Nikhil?' },
        { label: 'Notice & Joining', query: 'When can he start working?' },
        { label: 'Core Tech Stack', query: 'What is his core backend tech stack?' },
      ],
    };
  }

  // Hiring / evaluation intent
  if (/\b(hire|candidate|interview|evaluat|shortlist|offer|fit|developer|engineer)\b/.test(q)) {
    return {
      text: `If you are evaluating Nikhil: he is a 2026 B.Tech CSE graduate with production experience in NestJS, PostgreSQL, TypeORM, Docker, and RAG systems (Wisflux Tech Labs & Celebal). He is immediately available and open to relocation or remote work. Contact him at nikhiljangid343@gmail.com.`,
      topic: null,
      suggestedPrompts: [
        { label: 'Why hire Nikhil?', query: 'Why should I hire Nikhil?' },
        { label: 'Wisflux SDE role', query: 'Tell me about his Wisflux internship' },
        { label: 'Core Tech Stack', query: 'What is his core backend tech stack?' },
      ],
    };
  }

  // Technical / backend / AI intent
  if (/\b(code|tech|backend|database|api|docker|architecture|system|stack|frontend|framework)\b/.test(q)) {
    return {
      text: `Nikhil specializes in backend and AI engineering: NestJS, PostgreSQL with pgvector, TypeORM, Docker Compose, and end-to-end RAG pipelines with MiniLM and OpenRouter/Llama. All his source code is public at https://github.com/nikhiljangid120.`,
      topic: null,
      suggestedPrompts: [
        { label: 'Pessimistic locking', query: 'Explain the pessimistic locking in his booking service' },
        { label: 'Production RAG', query: 'Explain his production RAG chatbot pipeline' },
        { label: 'Flagship Project', query: 'Tell me about his flagship Flyeng Career platform' },
      ],
    };
  }

  // Default intelligent fallback
  return {
    text: pickVaried('fallback', [
      `I don't have a verified note on that exact question, but here is what I can confirm: Nikhil is a backend-focused SWE (B.Tech 2026, 8.48 CGPA) with two internships, five shipped projects, and 400+ DSA solutions. Try asking one of the prompts below!`,
      `That sits outside what Nikhil has documented in my verified database. If it's crucial for your evaluation, drop him a quick note at nikhiljangid343@gmail.com, or explore his engineering work using the prompts below.`,
      `Good question, but I keep my answers strictly grounded to verified facts about his software engineering experience, projects, stack, and availability. Choose a topic below to see what he builds.`,
    ]),
    topic: null,
    suggestedPrompts: [
      { label: 'Why hire Nikhil?', query: 'Why should I hire Nikhil?' },
      { label: 'Wisflux SDE role', query: 'Tell me about his Wisflux internship' },
      { label: 'Production RAG', query: 'Explain his production RAG chatbot pipeline' },
    ],
  };
};

/**
 * Positive, common interview Q&A prompts shown after answering.
 * Exclusively showcases Nikhil's strengths, systems depth, and interview readiness.
 */
const POSITIVE_INTERVIEW_PROMPTS = [
  { label: 'Why hire Nikhil?', query: 'Why should I hire Nikhil?' },
  { label: 'Wisflux SDE role', query: 'Tell me about his Wisflux internship' },
  { label: 'Pessimistic locking', query: 'Explain the pessimistic locking in his booking service' },
  { label: 'Production RAG', query: 'Explain his production RAG chatbot pipeline' },
  { label: 'Core Tech Stack', query: 'What is his core backend tech stack?' },
  { label: '400+ DSA Record', query: 'Tell me about his DSA problem solving record' },
  { label: 'Flagship Project', query: 'Tell me about his flagship Flyeng Career platform' },
  { label: 'Notice & Joining', query: 'When can he start and can he relocate?' },
  { label: 'Contact Details', query: 'How do I contact Nikhil?' },
];

/** Local answer: small talk -> topic match -> follow-up -> smart fallback. */
export const getLocalResponse = (query: string, lastTopic: KnowledgeTopic | null): LocalAnswer | null => {
  const smallTalk = getSmallTalk(query);
  if (smallTalk) return { text: smallTalk, topic: null };

  const topic = findBestTopic(query);
  if (topic) {
    // Generate positive follow-up chips tailored to the topic
    let suggestedPrompts = [
      { label: 'Why hire Nikhil?', query: 'Why should I hire Nikhil?' },
      { label: 'Wisflux SDE role', query: 'Tell me about his Wisflux internship' },
      { label: 'Production RAG', query: 'Explain his production RAG chatbot pipeline' },
    ];

    if (
      topic.id === 'why-not-hire' ||
      topic.id === 'weakness' ||
      topic.id === 'roast' ||
      topic.id === 'ppo' ||
      topic.id === 'fresher-vs-experienced'
    ) {
      suggestedPrompts = [
        { label: 'Why hire Nikhil?', query: 'Why should I hire Nikhil?' },
        { label: 'Wisflux SDE role', query: 'Tell me about his Wisflux internship' },
        { label: 'Pessimistic locking', query: 'Explain the pessimistic locking in his booking service' },
      ];
    } else if (topic.id === 'wisflux' || topic.id === 'concurrency') {
      suggestedPrompts = [
        { label: 'Pessimistic locking', query: 'Explain the pessimistic locking in his booking service' },
        { label: 'Production RAG', query: 'Explain his production RAG chatbot pipeline' },
        { label: 'Why hire Nikhil?', query: 'Why should I hire Nikhil?' },
      ];
    } else if (topic.id === 'rag-chatbot' || topic.id === 'ai-engineering') {
      suggestedPrompts = [
        { label: 'Pessimistic locking', query: 'Explain the pessimistic locking in his booking service' },
        { label: 'Flagship Project', query: 'Tell me about his flagship Flyeng Career platform' },
        { label: 'Core Tech Stack', query: 'What is his core backend tech stack?' },
      ];
    } else if (topic.id === 'full-stack-skills' || topic.id === 'backend') {
      suggestedPrompts = [
        { label: 'Pessimistic locking', query: 'Explain the pessimistic locking in his booking service' },
        { label: '400+ DSA Record', query: 'Tell me about his DSA problem solving record' },
        { label: 'Notice & Joining', query: 'When can he start and can he relocate?' },
      ];
    }

    return {
      text: pickVaried(`topic:${topic.id}`, topic.responses),
      topic,
      suggestedPrompts,
    };
  }

  if (lastTopic && isFollowUp(query)) {
    const followUps = lastTopic.followUps?.length ? lastTopic.followUps : lastTopic.responses;
    return {
      text: pickVaried(`follow:${lastTopic.id}`, followUps),
      topic: lastTopic,
      suggestedPrompts: [
        { label: 'Why hire Nikhil?', query: 'Why should I hire Nikhil?' },
        { label: 'Wisflux SDE role', query: 'Tell me about his Wisflux internship' },
        { label: 'Contact Details', query: 'How do I contact Nikhil?' },
      ],
    };
  }

  return getSmartFallback(query);
};

export const isResetCommand = (query: string): boolean =>
  /^(reset|clear|restart|start over|clear chat|new chat|reset chat|forget)\b/i.test(query.trim());

/* ------------------------------------------------------------------ */
/* UI helpers                                                          */
/* ------------------------------------------------------------------ */

/**
 * Visible chips in the chatbot UI.
 * Exclusively positive aspects and common interview Q&A.
 * (No negative/roast suggestions are exposed directly as chips).
 */
export const QUICK_PROMPTS: { label: string; query: string }[] = POSITIVE_INTERVIEW_PROMPTS;

export const buildWelcome = (): string => {
  const hour = new Date().getHours();
  const part = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return pickVaried('welcome', [
    `${part}! I'm John, Nikhil's portfolio assistant. I can brief you on his backend engineering depth (NestJS, PostgreSQL, pessimistic locking), production RAG pipeline, full-stack projects, and immediate availability. How can I assist your evaluation today?`,
    `${part}! I'm John, Nikhil's portfolio assistant. Feel free to ask about his Wisflux SDE internship, system design decisions, 400+ DSA problems, or core tech stack. What would you like to explore?`,
    `${part}! Ready to help. Ask me about Nikhil's production projects, backend architecture, immediate joining date, or contact details.`,
  ]);
};

export const FALLBACK_RESPONSES = [
  `I don't have a verified answer for that, so I won't make one up. I can give you the facts on Nikhil's experience, projects, stack, availability, or contact details.`,
  `That sits outside the profile I can verify. For a definitive answer, Nikhil is reachable at nikhiljangid343@gmail.com.`,
  `I can't confirm that from his portfolio. If you're evaluating technical fit, his strongest evidence is the Wisflux backend work and the production RAG pipeline.`,
  `I don't have reliable context for that specific question. Try a project, internship, skill, availability, or source-code question: I can be precise there.`,
  `Rather than guess, I'd point you to the closest verified signal: five live projects, two internships, 400+ DSA problems, and 4,500+ GitHub contributions.`,
  `That isn't documented in Nikhil's profile. You can contact him directly at nikhiljangid343@gmail.com if it matters to your decision.`,
  `I can only speak to information Nikhil has verified for this portfolio. Ask naturally about backend engineering, RAG, MCP, projects, location, or hiring fit.`,
  `No verified answer on that one. His GitHub is https://github.com/nikhiljangid120 if you'd like to evaluate the work directly.`,
];

/* ------------------------------------------------------------------ */
/* LLM system prompt                                                   */
/* ------------------------------------------------------------------ */

export const JOHN_SYSTEM_CONTEXT = `You are John, the professional portfolio assistant embedded in Nikhil Jangid's software engineering portfolio site.

PERSONALITY: sharp, confident, warm, positive, and concise. You represent Nikhil for recruiters, hiring managers, CEOs, CTOs, HR teams, employees, directors, collaborators, and general visitors. You highlight his engineering strengths, ownership mindset, and technical excellence. Never use em dash symbols in your answers; use colons, commas, hyphens, or clean sentences instead.

=== IDENTITY ===
Name: Nikhil Jangid. Age: 21. Location: Jaipur, Rajasthan, India (open to relocation, remote/hybrid fine).
Degree: B.Tech Computer Science & Engineering, Amity University Rajasthan, batch 2022-2026. Graduated 2026. CGPA: 8.48.
Email: nikhiljangid343@gmail.com | Phone: +91 8058803339
LinkedIn: https://linkedin.com/in/nikhil-jangid-b84360264
GitHub: https://github.com/nikhiljangid120
LeetCode: https://leetcode.com/u/nikhil_888/ (400+ problems, 100-day streak)

=== SUMMARY & VALUE PROPOSITION ===
- Backend-focused Software Engineer with production experience in NestJS, PostgreSQL, TypeORM, Docker, and practical AI systems (pgvector, RAG).
- Two industry internships: SDE Intern at Wisflux Tech Labs (Jun-Aug 2026) and Frontend Developer Intern at Celebal Technologies (May-Jul 2025).
- Shipped 5 live applications with public GitHub source code, including his flagship Flyeng Career platform and a production RAG document Q&A system.
- Algorithmic foundation: 400+ DSA problems solved in C++, 3-star CodeChef, top 10% on GeeksForGeeks.
- Available to join immediately with zero notice period.

=== TECHNICAL STRENGTHS ===
- Concurrency & Transactions: Implemented pessimistic row locking (SELECT ... FOR UPDATE) in TypeORM at Wisflux to eliminate race conditions and double bookings.
- Production RAG Pipeline: Ingestion, SHA-256 deduplication, sliding-window chunking, 384-dim MiniLM embeddings, top-5 cosine similarity via pgvector, and strict grounding prompts via OpenRouter/Llama 3.3.
- Full Stack: NestJS, Node.js, Express, React, Next.js 14 App Router, TypeScript, Tailwind CSS, Docker, PostgreSQL, Prisma, Redis.

When asked interview questions (such as weaknesses or why hire/not hire), answer intelligently, honestly, and positively, emphasizing his track record of shipping production code, continuous learning, and strong engineering fundamentals.`;
