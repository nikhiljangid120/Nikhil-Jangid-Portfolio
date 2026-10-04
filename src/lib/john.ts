/**
 * John — knowledge engine for the portfolio chatbot.
 * Scored keyword matcher over a topic knowledge base, small-talk layer,
 * follow-up memory and the llm system prompt.
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
const CAPABILITIES_RE = /\b(what can you do|what do you do|how can you help|your (skills|capabilities|features)|what can i ask|help me)\b/i;
/** Questions aimed at the assistant itself (tech, model, llm cost) — answered before topic matching so "I mean this chatbot" is never mistaken for the RAG project topic. */
const BOT_TECH_RE = /\b(i mean (this|you)|no,? i mean|what (llm|model) (do you use|are you|powers you)|which llm|llm do you use|do you use an? llm|free llm|paid llm|paid or free|free or paid|how do you work|how are you (built|made)|are you (open source|chatgpt|gemini|claude)|your (tech stack|architecture))\b/i;

export const getSmallTalk = (query: string): string | null => {
  const q = query.trim();

  if (BOT_TECH_RE.test(q)) {
    return pickVaried('bottech', [
      `Ah — you mean me. I'm John: a hand-built knowledge engine answering from Nikhil's verified portfolio facts, with a Gemini 1.5 Flash model as the fallback for off-script questions. No paid chat service behind me — just the local engine, the Gemini API, and this site's frontend.`,
      `Me? Hybrid design: a deterministic knowledge base handles the portfolio facts, and Google's Gemini 1.5 Flash covers everything outside it. If the API key isn't configured, I run entirely on the local engine.`,
      `Fair question. I'm John — part hand-written knowledge engine, part Gemini 1.5 Flash LLM, running fully inside this site. Portfolio questions get verified local answers; anything else goes to the LLM.`,
    ]);
  }
  if (PING_RE.test(q)) {
    return pickVaried('ping', [
      `Pong. 🏓 John online and fully synced with Nikhil's profile. What do you want to dig into?`,
      `Signal is strong. Systems nominal. Ask me anything about Nikhil's work.`,
    ]);
  }
  if (GREETING_RE.test(q)) {
    return pickVaried('greeting', [
      `Hey! John here — Nikhil's portfolio assistant. Want the backend deep-dive (NestJS, PostgreSQL, concurrency), the AI projects (RAG, LLM apps), or a quick rundown of his internships?`,
      `Hello! Good to see you. I can walk you through Nikhil's strongest experience, five shipped projects, or his stack. Where should we start?`,
      `Hi there. I've got Nikhil's engineering profile loaded — featured roles, projects with live URLs, DSA stats, all of it. What's on your mind?`,
    ]);
  }
  if (HOW_ARE_YOU_RE.test(q)) {
    return pickVaried('howareyou', [
      `Running clean — 400+ DSA problems and 4,500+ commits worth of context loaded. 😄 What would you like to know about Nikhil?`,
      `All systems green. Better question: are you here to evaluate Nikhil for a role? I can give you the 30-second pitch or the deep technical dive.`,
    ]);
  }
  if (BOT_AGE_RE.test(q)) {
    return pickVaried('botage', [
      `I'm John — the current build of Nikhil's portfolio assistant, made to answer recruiter and engineer questions about him. He's the 21-year-old human behind me, by the way.`,
    ]);
  }
  if (CONCISE_RE.test(q)) {
    return pickVaried('concise', [
      `Noted — short answers from here. What do you want to know?`,
      `Got it. Straight to the point from now on. Ask away.`,
    ]);
  }
  if (INSULT_RE.test(q)) {
    return pickVaried('insult', [
      `Fair. I'll do better — tell me what you actually wanted and I'll give you the precise answer.`,
      `Ouch. Correcting course: ask me a direct question about Nikhil's experience, projects, or stack and I'll keep it tight.`,
    ]);
  }
  if (PRAISE_RE.test(q) || THANKS_RE.test(q)) {
    return pickVaried('thanks', [
      `Anytime. If you're hiring, Nikhil's email is nikhiljangid343@gmail.com — worth a conversation.`,
      `Glad that helped. Want the follow-up detail on his internships or a live project URL?`,
      `Happy to help. His resume download and LinkedIn are both one click away if you want the full picture.`,
    ]);
  }
  if (BYE_RE.test(q)) {
    return pickVaried('bye', [
      `Take care. Nikhil's profiles stay open — github.com/nikhiljangid120 and linkedin.com/in/nikhil-jangid-b84360264.`,
      `See you. Come back if you want the deeper technical walkthrough.`,
    ]);
  }
  if (YES_RE.test(q)) {
    return pickVaried('yes', [
      `Great — his SDE internship at Wisflux is the strongest signal: NestJS services in an Nx monorepo, pessimistic-locking booking transactions, and a live RAG pipeline. Want that in detail?`,
      `Then let's go deep. Pick one: the concurrency-safe booking backend, the RAG document pipeline, or the Flyeng Career platform.`,
    ]);
  }
  if (NO_RE.test(q)) {
    return pickVaried('no', [
      `No problem. Scroll the sections whenever you like — or ask me something specific anytime.`,
      `Understood. I'll be here if you want project URLs, stack details, or contact info.`,
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
    keywords: ['wisflux', 'wisflux tech labs', 'current company', 'latest internship'],
    responses: [
      `Wisflux Tech Labs is his most recent role — SDE Intern (Jun–Aug 2026). He worked in an Nx monorepo on NestJS backend services with PostgreSQL and TypeORM, and shipped two headline builds: a transactional hotel-booking backend using pessimistic locking to kill double-booking race conditions, and a live RAG document Q&A system on pgvector + OpenRouter/Llama 3.3, fully Dockerized.`,
      `At Wisflux Tech Labs he was the backend/AI intern: NestJS + PostgreSQL + Docker Compose inside an Nx monorepo. He owned the concurrency layer of a booking system (transactional workflows, row locks, JWT auth, Swagger docs) and the entire RAG ingestion-to-retrieval pipeline.`,
    ],
    followUps: [
      `Want the concurrency detail — how the pessimistic locking actually prevents double bookings?`,
      `Want to see the RAG system he shipped there? It's live at https://nikhil-rag-chatbot.onrender.com/`,
    ],
  },
  {
    id: 'celebal',
    keywords: ['celebal', 'celebal technologies'],
    responses: [
      `Celebal Technologies — Frontend Developer Intern, May–Jul 2025. He built a shipment tracking web app in React.js and Tailwind CSS, wired it to REST APIs, and worked in an Agile team with real Git workflows.`,
      `At Celebal he focused on React.js interfaces: a shipment tracking dashboard, REST API integration, and day-to-day Agile collaboration with code reviews.`,
    ],
    followUps: [`Want his current Wisflux work, or his project evidence next?`],
  },
  {
    id: 'flyeng',
    keywords: ['flyeng', 'fly eng', 'career platform', 'flagship'],
    responses: [
      `Flyeng Career is his flagship product — an AI-powered career development platform live at http://flyeng-career.vercel.app/. Built with Next.js 14, TypeScript, PostgreSQL and Prisma: personalized roadmaps, resume optimization, interview prep, and a portfolio builder for aspiring engineers.`,
      `Flyeng Career (http://flyeng-career.vercel.app/) is the flagship: Next.js 14 + TypeScript + PostgreSQL + Prisma, with LLM-driven resume optimization, interview prep, and generated learning roadmaps.`,
    ],
    followUps: [`Want to know which part of Flyeng he'd rebuild differently, or see his other AI projects?`],
  },
  {
    id: 'yoe',
    keywords: ['years of experience', 'how many years', 'how much experience', 'total experience', 'yoe', 'months of experience', 'tenure', 'years experience', 'experience years'],
    responses: [
      `Counting verified professional experience: about 2 months as a Frontend Developer Intern at Celebal Technologies (May–Jul 2025) and about 3 months as an SDE Intern at Wisflux Tech Labs (Jun–Aug 2026) — roughly 5 months of industry internships, on top of a 4-year B.Tech CSE and a year-plus of shipping his own products. Want the Wisflux or Celebal breakdown?`,
      `About 5 months of verified industry internship: ~2 months at Celebal Technologies (May–Jul 2025) and ~3 months at Wisflux Tech Labs (Jun–Aug 2026). He's early-career but ships production code — want the strongest of those two?`,
    ],
    followUps: [
      `Want the Wisflux backend deep dive, or the Celebal frontend delivery summary?`,
    ],
  },
  {
    id: 'experience',
    keywords: ['experience', 'work experience', 'internship', 'internships', 'internship experience', 'professional experience', 'work history', 'employment', 'career', 'worked as'],
    responses: [
      `His strongest professional evidence is Wisflux Tech Labs and Celebal Technologies. At Wisflux he worked as an SDE Intern on NestJS services, PostgreSQL, Docker, concurrency-safe booking flows, and a production RAG pipeline. At Celebal he built React/Tailwind interfaces and integrated REST APIs in an Agile team.`,
      `Experience summary: backend/AI depth at Wisflux Tech Labs — NestJS, PostgreSQL, TypeORM, Docker, pessimistic locking, and RAG with pgvector — plus frontend delivery at Celebal Technologies with React.js, Tailwind CSS, REST APIs, and Git-based teamwork.`,
    ],
    followUps: [
      `Want the Wisflux backend deep dive, or the Celebal frontend delivery summary?`,
      `Want to know exactly what he shipped at Wisflux?`,
    ],
  },
  {
    id: 'rag',
    keywords: ['rag', 'rag chatbot', 'chatbot', 'chat bot', 'retrieval', 'document q&a', 'document intelligence', 'pgvector', 'vector search', 'vector database', 'embedding', 'embeddings', 'minilm', 'semantic search', 'llama'],
    responses: [
      `The RAG Chatbot — Document Q&A System is live at https://nikhil-rag-chatbot.onrender.com/. The pipeline: PDF ingestion → SHA-256 dedup → sliding-window chunking → 384-dim MiniLM embeddings → top-5 pgvector similarity search → grounded answers via OpenRouter + Llama 3.3. NestJS + React + PostgreSQL, Dockerized, deployed on Render.`,
      `His RAG system (https://nikhil-rag-chatbot.onrender.com/) is a real retrieval pipeline, not a wrapper: SHA-256 deduplicated PDFs, sliding-window chunking, 384-dimensional MiniLM embeddings stored in pgvector, top-5 similarity retrieval, then grounded generation through OpenRouter/Llama 3.3.`,
    ],
    followUps: [
      `Curious how RAG compares to fine-tuning for this problem? I can explain his reasoning.`,
      `Want the chunking and embedding design decisions behind it?`,
    ],
  },
  {
    id: 'resume-builder',
    keywords: ['resume builder', 'ai resume', 'ats'],
    responses: [
      `The AI Resume Builder (https://ai-resume-builder-epbj.vercel.app/) is a Next.js + TypeScript app on Gemini 1.5 Flash. It generates ATS-optimized resumes with AI suggestions, live preview, multiple templates, and PDF export.`,
    ],
    followUps: [`Want to see his code analyzer or fitness platform next?`],
  },
  {
    id: 'code-analyzer',
    keywords: ['code analyzer', 'code analysis', 'd3'],
    responses: [
      `The AI Code Analyzer (https://code-analyzer-f7bq.vercel.app/) uses Next.js + Groq API for LLM code-quality analysis and D3.js to visualize complexity across multiple languages.`,
    ],
    followUps: [`Want the rest of his live projects?`],
  },
  {
    id: 'fitness',
    keywords: ['fitness', 'nutrition', 'workout'],
    responses: [
      `The AI Fitness Platform (https://fitness-platform-zeta.vercel.app/) is a Next.js + Firebase app using the Gemini API to generate personalized workout plans and nutrition targets with progress tracking.`,
    ],
    followUps: [`Want his project list ranked, or the ones closest to backend/AI work?`],
  },
  {
    id: 'rag-vs-ft',
    keywords: ['rag vs fine tuning', 'rag vs finetuning', 'fine tune', 'fine tuning', 'finetune', 'why rag'],
    responses: [
      `His take: RAG wins when the knowledge changes and you need citations — you re-index documents instead of retraining. Fine-tuning wins for teaching format, tone or a narrow task on stable data. For a document Q&A product, RAG is cheaper, auditable, and always current.`,
    ],
    followUps: [`Want to hear about the embedding and retrieval side of his pipeline?`],
  },
  {
    id: 'concurrency',
    keywords: ['concurrency', 'race condition', 'race conditions', 'transaction', 'transactions', 'acid', 'isolation level', 'optimistic locking'],
    responses: [
      `This is his strongest backend answer. In the booking system he wraps the availability check and the reservation write in one database transaction and takes a pessimistic row lock on the room's availability record, so a second concurrent request waits instead of reading stale data and double-booking. He chose pessimistic over optimistic locking because contention on hot room-dates is high and retry storms are worse than short waits.`,
    ],
    followUps: [`Want the same treatment for his database design choices (types, indexes, migrations)?`],
  },
  {
    id: 'sql',
    keywords: ['database design', 'indexes', 'indexing', 'normalization', 'migration', 'migrations', 'typeorm', 'prisma', 'sql query', 'joins'],
    responses: [
      `He works PostgreSQL-first: normalized relational schemas, explicit indexes on the columns that back hot queries, and migrations kept in version control. In NestJS he's used both TypeORM (booking service, RAG store) and Prisma (Flyeng Career), and he's comfortable dropping to raw SQL when a query needs hand-tuning.`,
    ],
    followUps: [`Want the full database list he's shipped with, or the concurrency story?`],
  },
  {
    id: 'backend',
    keywords: ['backend', 'back end', 'server side', 'nest', 'nestjs', 'node', 'express', 'api', 'apis', 'rest', 'restful', 'microservice', 'microservices', 'jwt', 'authentication', 'authorization', 'swagger'],
    responses: [
      `Backend is his core strength: NestJS and Node.js with REST API design, JWT auth, TypeORM/Prisma data layers, PostgreSQL, Swagger documentation, and Docker for reproducible environments. He cares about validation, error contracts, and transactional correctness — not just endpoints that return 200.`,
      `He builds with NestJS as the primary framework — modular services, DTO validation, guards for auth, typed repositories — plus Express when a service doesn't need the structure. Everything ships containerized with Swagger docs.`,
    ],
    followUps: [`Want his AI engineering side, or the concurrency-safe booking design?`],
  },
  {
    id: 'ai-engineering',
    keywords: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'llm', 'llms', 'genai', 'generative ai', 'prompt engineering', 'openrouter', 'groq', 'gemini'],
    responses: [
      `On the AI side he's a builder, not a researcher: RAG pipelines (ingestion, chunking, embeddings, vector retrieval), LLM API integration (OpenRouter, Gemini, Groq), prompt engineering, and grounding/guardrailing so answers stay factual. Every AI feature he's shipped runs in production, not a notebook.`,
    ],
    followUps: [
      `Want his RAG architecture in detail?`,
      `Want to know when he chooses RAG over fine-tuning?`,
    ],
  },
  {
    id: 'frontend',
    keywords: ['frontend', 'front end', 'react', 'next js', 'nextjs', 'typescript', 'tailwind', 'ui', 'ux', 'zustand', 'framer motion'],
    responses: [
      `Frontend-wise he ships React and Next.js 14 (App Router) in TypeScript with Tailwind CSS, Zustand for state, and Framer Motion for animation — this portfolio is itself an example, built with React, TypeScript, Tailwind and Framer Motion.`,
    ],
    followUps: [`Want his backend stack, or the full skills list?`],
  },
  {
    id: 'devops',
    keywords: ['devops', 'docker', 'docker compose', 'ci cd', 'cicd', 'deployment', 'deploy', 'vercel', 'render', 'git', 'github workflow', 'monorepo', 'nx'],
    responses: [
      `He containerizes everything: Docker and Docker Compose for multi-service local environments, Nx monorepos for shared code across backend services, Git/GitHub for workflow, and Vercel + Render for deployment. His RAG chatbot runs as a live multi-service Docker deployment.`,
    ],
    followUps: [`Want the project it's running — the RAG pipeline? Or his database work?`],
  },
  {
    id: 'system-design',
    keywords: ['system design', 'architecture', 'scalable', 'scalability', 'distributed', 'caching', 'queue', 'load balancing', 'design pattern'],
    responses: [
      `He reasons about systems in terms of boundaries, failure modes, and data integrity: what's the source of truth, where do race conditions hide, what happens on retry, and what can be made idempotent. The booking backend is his clearest example — locking, transactional boundaries, and validation placed exactly where the invariant lives.`,
    ],
    followUps: [`Want that booking design broken down?`],
  },
  {
    id: 'testing',
    keywords: ['testing', 'unit test', 'unit tests', 'jest', 'test coverage', 'tdd'],
    responses: [
      `He writes tests where they pay off — service and business-logic layers — and uses Swagger plus typed DTOs to make API contracts self-checking. He's honest that coverage isn't the goal; catching regressions in critical paths like booking transactions and retrieval logic is.`,
    ],
    followUps: [`Want to know how he validates the RAG pipeline's answers?`],
  },
  {
    id: 'dsa',
    keywords: ['dsa', 'data structures', 'algorithms', 'leetcode', 'gfg', 'geeksforgeeks', 'codechef', 'problem solving', 'competitive programming', 'hackerearth'],
    responses: [
      `400+ DSA problems solved in C++ across LeetCode and GeeksForGeeks, 3⭐ on CodeChef, top 10% ranking on GFG, plus a 100-day LeetCode streak badge. LeetCode profile: https://leetcode.com/u/nikhil_888/`,
      `He's solved 400+ problems (LeetCode + GFG) in C++, holds a 3⭐ CodeChef rating and a top-10% GFG rank, and worked through a 100-day LeetCode streak. Code lives at https://leetcode.com/u/nikhil_888/`,
    ],
    followUps: [`Want his GitHub too? It's 4,500+ contributions: https://github.com/nikhiljangid120`],
  },
  {
    id: 'achievements',
    keywords: ['achievement', 'achievements', 'award', 'hackathon', 'prize', 'certification', 'certifications', 'certificate', 'ibm', 'mckinsey', 'first prize'],
    responses: [
      `Highlights: First Prize at the Amity University college hackathon, GirlScript Summer of Code contributor, IBM SkillsBuild AI certification, McKinsey Forward Program graduate, 3⭐ CodeChef, top 10% GFG, 400+ DSA problems and 4,500+ GitHub contributions.`,
    ],
    followUps: [`Want the story behind the hackathon win, or his certifications in detail?`],
  },
  {
    id: 'open-source',
    keywords: ['open source', 'opensource', 'gssoc', 'girlscript', 'contribution', 'contributions'],
    responses: [
      `He contributed through GirlScript Summer of Code (GSSoC) and keeps a 4,500+ contribution GitHub graph — https://github.com/nikhiljangid120. Open source is where he learned to read unfamiliar codebases and match an existing team's conventions.`,
    ],
    followUps: [`Want his own projects next? Five of them are live.`],
  },
  {
    id: 'education',
    keywords: ['education', 'college', 'university', 'cgpa', 'gpa', 'b tech', 'btech', 'degree', 'amity', 'graduation', 'graduate', 'graduated', 'school', 'marks', 'study', 'studied', 'studies', 'sgpa'],
    responses: [
      `B.Tech in Computer Science & Engineering from Amity University Rajasthan, batch 2022–2026, with an 8.48 CGPA. He graduated in 2026 and is now working full-time on engineering roles.`,
    ],
    followUps: [`Want what he did alongside the degree — internships and projects?`],
  },
  {
    id: 'identity',
    keywords: ['who is nikhil', 'about nikhil', 'tell me about nikhil', 'introduce nikhil', 'nikhil jangid', 'his background', 'summary', 'introduction'],
    responses: [
      `Nikhil Jangid — 21, based in Jaipur, India. B.Tech CSE graduate (Amity University Rajasthan, 8.48 CGPA) and SDE Intern at Wisflux Tech Labs, where he built NestJS backend services and a live RAG document Q&A system. Internships at Wisflux and Celebal Technologies, 5 shipped projects, 400+ DSA problems, 4,500+ GitHub contributions. He's targeting Software Engineer / Backend / Full-Stack roles.`,
      `Short version: Nikhil is a backend-leaning full-stack engineer from Jaipur. He's shipped a production RAG pipeline on pgvector, an AI career platform, and a suite of live AI tools. Strong on NestJS, PostgreSQL and Docker, with real AI/LLM integration experience.`,
    ],
    followUps: [
      `Want his internship history, or the projects that show his range?`,
      `Want his contact details for a role, or his strongest technical story?`,
    ],
  },
  {
    id: 'critical',
    keywords: ['reject', 'reject him', 'why reject', 'why to reject', 'turn down', 'not hire', 'fire', 'fire him', 'fired', 'weakness', 'weaknesses', 'weak point', 'demerit', 'demerits', 'flaw', 'flaws', 'downside', 'downsides', 'cons', 'red flag'],
    responses: [
      `I won't make that call for you — but here's the verified evidence to decide on: Wisflux SDE Intern work (NestJS, PostgreSQL, Docker, concurrency-safe booking flows, production RAG pipeline) and Celebal frontend delivery (React, Tailwind, REST APIs, Agile). Want to know exactly what he shipped at Wisflux?`,
      `Fair question — honest answer. Verified gaps: he's early-career (two internships, no full-time role yet) and his depth is backend-leaning, so a pure-frontend specialist or data-science role would stretch the fit. Verified counterweight: five live projects, 400+ DSA problems, 4,500+ GitHub contributions, production RAG pipeline, 8.48 CGPA. Want the evidence behind any of these?`,
      `That's your judgment to make. What I can verify: five live projects, two internships, 400+ DSA problems, 4,500+ GitHub contributions. If a specific concern is driving the question, name it and I'll give you the straight facts.`,
    ],
    followUps: [`Want to know exactly what he shipped at Wisflux?`],
  },
  {
    id: 'hiring',
    keywords: ['why should i hire', 'why hire', 'should i hire', 'why him', 'why nikhil', 'strength', 'strengths', 'good fit', 'stand out', 'recruiter', 'evaluate', 'merits', 'why select', 'why to select', 'select him', 'why choose', 'choose him', 'why pick', 'pick him'],
    responses: [
      `Three reasons: he ships — five live products, not tutorials. He goes deep where it's hard — pessimistic locking and transactional integrity, retrieval pipelines with real dedup and chunking. And he's full-stack fluent but backend-anchored, so he can own a feature end to end.`,
      `Because he builds production software, not demos. Live deployments with Docker, a RAG system with genuine ingestion and retrieval design, an AI platform used by students, plus 400+ DSA problems for the algorithmic side of interviews.`,
      `Evidence, not promises: five live projects, two internships, a production RAG pipeline, and concurrency-safe booking transactions. Want the Wisflux backend deep dive, or the Celebal frontend delivery summary?`,
    ],
    followUps: [
      `Want his email to move forward? It's nikhiljangid343@gmail.com.`,
      `Want his resume, or the technical depth on any project?`,
    ],
  },
  {
    id: 'employability',
    keywords: ['employable', 'is he employable', 'job ready', 'job-ready', 'hireable', 'hirable'],
    responses: [
      `Rather than guess, I'd point you to the closest verified signal: five live projects, two internships, 400+ DSA problems, and 4,500+ GitHub contributions.`,
      `The verified signals say yes: five shipped products, two internship cycles with real code reviews, and a 400+ DSA record. Want the single strongest piece of evidence?`,
    ],
    followUps: [`Want the Wisflux backend work — the strongest signal?`],
  },
  {
    id: 'visitor-role',
    keywords: ['hiring manager', 'recruiter', 'hr', 'ceo', 'cto', 'director', 'founder', 'employee', 'connection', 'client', 'visitor', 'interviewer', 'manager'],
    responses: [
      `If you're evaluating Nikhil: start with his Wisflux work. It shows backend depth — NestJS, PostgreSQL, Docker, transactions, locking, and a production RAG pipeline. For product range, check Flyeng Career and the RAG chatbot. For next steps, email nikhiljangid343@gmail.com or connect on LinkedIn.`,
      `For HR/recruiters: he's a backend-leaning full-stack engineer, available for SWE/Backend/Full-Stack roles. For CTOs/engineering leads: his strongest signals are transactional correctness, RAG architecture, and shipping live products. Want the short hiring pitch or technical deep dive?`,
    ],
    followUps: [`Want the hiring pitch, technical deep dive, or contact details?`],
  },
  {
    id: 'gender',
    keywords: ['male or female', 'gender', 'is he male', 'is he female', 'is nikhil male', 'is nikhil female', 'boy or girl', 'man or woman', 'female', 'his pronoun', 'pronouns', 'she or he'],
    responses: [
      `Nikhil is male — he/him. Professionally, the more useful context is that he's a Jaipur-based software engineer focused on backend, full-stack, and AI systems. Want his experience summary?`,
      `He's male. And if you're building a briefing doc: 21, Jaipur, India, backend-leaning full-stack engineer, open to SWE/Backend/Full-Stack roles. Want the full profile?`,
    ],
    followUps: [`Want his professional summary, contact details, or strongest projects?`],
  },
  {
    id: 'origin',
    keywords: ['is he from', 'where from', 'from pakistan', 'pakistan', 'nationality', 'country is he from', 'indian', 'india'],
    responses: [
      `Nikhil is from Jaipur, Rajasthan, India. He's Indian and open to relocating, remote, or hybrid engineering roles.`,
      `He's based in Jaipur, Rajasthan, India — not Pakistan. He's open to relocation and remote or hybrid work for the right team.`,
    ],
    followUps: [`Want his availability, experience, or contact details?`],
  },
  {
    id: 'role-fit',
    keywords: ['data engineer', 'data engineering', 'data scientist', 'data science', 'ml engineer', 'machine learning engineer', 'analyst', 'qa engineer', 'tester', 'devops engineer', 'designer'],
    responses: [
      `His primary lane is Software Engineering — backend-leaning full-stack work and practical AI engineering. He isn't positioning himself as a data engineer or data scientist, though his RAG work includes embeddings, pgvector, semantic retrieval, and document pipelines.`,
      `Not as a primary role. Nikhil is targeting Software Engineer, Backend Developer, and Full-Stack Developer positions, with AI engineering as a strong complement. His RAG system gives him real data-pipeline and vector-search exposure, but his core is product/backend engineering.`,
    ],
    followUps: [`Want the backend, AI, or RAG evidence behind that positioning?`],
  },
  {
    id: 'mcp',
    keywords: ['mcp', 'model context protocol', 'agent protocol', 'ai agents', 'agentic'],
    responses: [
      `MCP means Model Context Protocol — a standard way for AI models to securely connect with tools, data sources, and external systems. Nikhil lists it in his AI/agentic toolkit alongside LangChain, RAG, embeddings, semantic search, structured outputs, and LLM orchestration.`,
      `He knows MCP (Model Context Protocol) as part of his AI/agentic engineering stack. It lets an LLM discover and use approved tools or data connectors through a consistent interface — useful for building capable, grounded AI agents rather than a chat box with no real-world access.`,
    ],
    followUps: [`Want how MCP differs from a normal REST API integration, or his RAG architecture?`],
  },
  {
    id: 'source-code',
    keywords: ['source code', 'sourcecode', 'codebase', 'repository', 'repositories', 'repo', 'github code', 'see the code', 'show code'],
    responses: [
      `His source code is on GitHub: https://github.com/nikhiljangid120. The Projects section links to the relevant repositories and live deployments; the RAG chatbot, AI Resume Builder, Code Analyzer, and Fitness Platform are all represented there.`,
      `You can browse Nikhil's work at https://github.com/nikhiljangid120. Each project card on this site has a GitHub button when a dedicated repository is available, alongside its live link.`,
    ],
    followUps: [`Want a recommendation for which repository or live project to inspect first?`],
  },
  {
    id: 'contact',
    keywords: ['contact', 'email', 'mail', 'reach', 'connect', 'phone', 'mobile', 'number', 'linkedin', 'get in touch', 'hire him', 'call'],
    responses: [
      `Email: nikhiljangid343@gmail.com · Phone: +91 8058803339 · LinkedIn: https://linkedin.com/in/nikhil-jangid-b84360264 · GitHub: https://github.com/nikhiljangid120. He replies fastest on email or LinkedIn.`,
      `You can reach him at nikhiljangid343@gmail.com or +91 8058803339. His LinkedIn is https://linkedin.com/in/nikhil-jangid-b84360264 — or use the Contact form on this site.`,
    ],
    followUps: [`Want his resume as well?`],
  },
  {
    id: 'availability',
    keywords: ['available', 'availability', 'open to work', 'notice period', 'start date', 'when can he start', 'join', 'joining', 'currently working'],
    responses: [
      `Yes — he's actively interviewing for Software Engineer, Backend Developer and Full-Stack Developer roles, and available to start immediately (no notice period to serve; his Wisflux internship wrapped in Aug 2026).`,
    ],
    followUps: [`Want the role types he's targeting, or his contact details?`],
  },
  {
    id: 'role-placement',
    keywords: ['where to put him', 'where should i put', 'which team', 'which role', 'what role', 'place him', 'fit him', 'assign him', 'position for him'],
    responses: [
      `Based on verified evidence, his best fit is backend or full-stack engineering: NestJS/PostgreSQL/TypeORM depth from Wisflux, React/Next.js delivery from Celebal and his own products, plus practical AI engineering (RAG, pgvector, LLM APIs). Rather than guess beyond that, the verified signals: five live projects, two internships, 400+ DSA problems, 4,500+ GitHub contributions.`,
      `Backend or full-stack is where the evidence points — the booking-transaction work and RAG pipeline are his strongest artifacts. AI engineering is a strong second lane. Want the backend evidence or the AI evidence?`,
    ],
    followUps: [`Want the backend evidence or the AI evidence?`],
  },
  {
    id: 'current-status',
    keywords: ['currently doing', 'what is he doing', "what's he doing", 'what he is doing', 'right now', 'at the moment', 'these days', 'nowadays', 'up to lately'],
    responses: [
      `Verified status: he wrapped his Wisflux SDE internship in Aug 2026, graduated B.Tech CSE in 2026, and is actively interviewing for SWE / Backend / Full-Stack roles. Anything more current sits outside what I can verify — for a definitive answer, Nikhil is reachable at nikhiljangid343@gmail.com.`,
    ],
    followUps: [`Want his availability details or contact info?`],
  },
  {
    id: 'salary',
    keywords: ['salary', 'ctc', 'compensation', 'package', 'pay', 'expected salary', 'expected ctc'],
    responses: [
      `He hasn't posted a number — compensation is a conversation based on the role, level, and location. Email nikhiljangid343@gmail.com and he'll discuss it directly and quickly.`,
    ],
    followUps: [`Want his experience summary to frame that conversation?`],
  },
  {
    id: 'relocation',
    keywords: ['relocate', 'relocation', 'remote', 'onsite', 'on site', 'hybrid', 'willing to move', 'bangalore', 'bengaluru', 'noida', 'gurgaon', 'pune', 'hyderabad'],
    responses: [
      `He's based in Jaipur and open to relocating for the right engineering team — he's also fully comfortable working remote or hybrid, since his internship work spanned a distributed setup with Docker-based environments.`,
    ],
    followUps: [`Want his contact info to discuss the role specifics?`],
  },
  {
    id: 'skills',
    keywords: ['skills', 'tech stack', 'technologies', 'technology', 'stack', 'toolkit', 'toolbelt', 'languages', 'frameworks', 'tools'],
    responses: [
      `His stack, grouped: Languages — JavaScript/TypeScript, C++, Python, SQL. Backend — NestJS, Node.js, Express, TypeORM, Prisma, REST, JWT, Swagger. Frontend — React, Next.js 14, Tailwind, Zustand, Framer Motion. Data — PostgreSQL, MongoDB, MySQL, pgvector, Firebase, Supabase. AI — RAG pipelines, MiniLM embeddings, OpenRouter, Llama, Gemini, Groq. DevOps — Docker, Docker Compose, Git, Nx, Vercel, Render.`,
      `Anchored in NestJS + TypeScript + PostgreSQL, with Docker everywhere and React/Next.js on the front. He adds practical AI engineering: RAG pipelines, vector search with pgvector, and LLM integration through OpenRouter, Gemini and Groq.`,
    ],
    followUps: [`Want the backend detail, the AI detail, or the DevOps side?`],
  },
  {
    id: 'projects',
    keywords: ['projects', 'project', 'portfolio work', 'applications', 'apps', 'built', 'showcase', 'live links'],
    responses: [
      `Five projects, all live: Flyeng Career (AI career platform), the RAG Chatbot (document Q&A), AI Resume Builder, AI Code Analyzer, and the AI Fitness Platform. Flyeng and the RAG chatbot are the two he'd lead a conversation with — the code is pinned at https://github.com/nikhiljangid120.`,
      `He has five projects spanning AI and full-stack work. The two with the most engineering depth are the production RAG pipeline and Flyeng Career — his flagship Next.js product. Everything is public at https://github.com/nikhiljangid120.`,
    ],
    followUps: [
      `Live links: Flyeng → http://flyeng-career.vercel.app/ · RAG Chatbot → https://nikhil-rag-chatbot.onrender.com/ · Resume Builder → https://ai-resume-builder-epbj.vercel.app/ · Code Analyzer → https://code-analyzer-f7bq.vercel.app/ · Fitness → https://fitness-platform-zeta.vercel.app/ · all code at https://github.com/nikhiljangid120`,
      `Want me to recommend which one to look at first?`,
    ],
  },
  {
    id: 'recommend',
    keywords: ['which project', 'best project', 'favorite project', 'recommend', 'where should i start', 'standout project', 'proudest'],
    responses: [
      `Depends what you're evaluating. For AI engineering: the RAG Chatbot — real ingestion, dedup, chunking, embeddings, retrieval. For product thinking: Flyeng Career, his flagship, live and used by students. For full-stack range: the AI Resume Builder and the AI Fitness Platform.`,
    ],
    followUps: [`Want me to go deep on any of those?`],
  },
  {
    id: 'resume',
    keywords: ['resume', 'cv', 'download resume', 'permanent address', 'pdf'],
    responses: [
      `His resume is downloadable from the Hero section (the "Download Resume" button) and from the Resume section further down the page. It covers both internships, the RAG system and Flyeng Career, his stack, and the 400+ DSA / 8.48 CGPA record.`,
    ],
    followUps: [`Want his email in case you'd rather reach out directly?`],
  },
  {
    id: 'owner',
    keywords: ['who made this', 'who built this', 'who created this', 'who designed this', 'owner', 'developer of this site', 'your developer', 'website made', 'site built'],
    responses: [
      `Nikhil Jangid built this entire portfolio himself — React + TypeScript + Tailwind CSS + Framer Motion, and I'm the in-house assistant. It's a working sample of his frontend craft, not a template.`,
      `He did — design and code. React, TypeScript, Tailwind and Framer Motion, with a terminal-inspired interface. His email is nikhiljangid343@gmail.com if you want to ask him about it.`,
    ],
    followUps: [`Want his project list, or the tech behind any specific section?`],
  },
  {
    id: 'this-site',
    keywords: ['this website', 'this site', 'this portfolio', 'built this website', 'technology used here', 'tech behind'],
    responses: [
      `This portfolio is a React + Vite + TypeScript single-page app: Tailwind CSS for the design system, Framer Motion for the animation layer, a custom command palette, and a small knowledge engine powering me. Sections cover his hero terminal, about, skills, projects, resume, timeline and contact.`,
    ],
    followUps: [`Want to see his engineering projects next?`],
  },
  {
    id: 'bot-identity',
    keywords: ['who are you', 'your name', 'what is jarvis', 'who is jarvis', 'what is john', 'who is john', 'john', 'are you a bot', 'are you a chatbot', 'are you human', 'are you real', 'are you an ai', 'what are you', 'tell me about yourself', 'about yourself', 'what model', 'are you chatgpt', 'gpt'],
    responses: [
      `I'm John — Nikhil's custom portfolio assistant. Part hand-built knowledge engine, part LLM (Gemini 1.5 Flash), running entirely in this site. I know his internships, all five projects, his stack, achievements and contact details. Ask me anything a recruiter would ask.`,
      `John, at your service — Nikhil's AI assistant for this portfolio. I can go as deep as you want on his NestJS backends, RAG pipeline, or full-stack projects.`,
    ],
    followUps: [`Try me: "why should I hire him?" or "explain the RAG pipeline".`],
  },
  {
    id: 'help',
    keywords: ['what can you do', 'what do you do', 'how can you help', 'what can i ask', 'your capabilities', 'your features', 'command', 'commands'],
    responses: [
      `Ask me anything about Nikhil: "what's his tech stack", "tell me about his internships", "explain the RAG pipeline", "what are his strengths", "is he available", "how do I contact him", or "which project should I check out". You can also say "reset" to clear our chat.`,
      `I cover: Wisflux and Celebal experience, all five projects with live URLs, his full stack, DSA and achievement record, education, availability, and contact details. Just ask naturally.`,
    ],
    followUps: [`Ask me "why should I hire him" — I have a good answer.`],
  },
  {
    id: 'personal',
    keywords: ['how old', 'age', 'where is he', 'where does he live', 'where is nikhil', 'based', 'hometown', 'which city', 'location', 'from jaipur', 'jaipur'],
    responses: [
      `Nikhil is 21 and based in Jaipur, Rajasthan, India — open to relocating for the right role and comfortable remote or hybrid.`,
    ],
    followUps: [`Want his contact details, or his experience summary?`],
  },
  {
    id: 'hobbies',
    keywords: ['hobby', 'hobbies', 'free time', 'outside work', 'fun', 'interests', 'personal life', 'football', 'cricket'],
    responses: [
      `Outside of code he keeps the same builder mindset: he reads engineering blogs and postmortems, follows AI tooling closely, and spends time on DSA problems for the sport of it — that's how the 400+ count got there.`,
    ],
    followUps: [`Want the professional side — his projects or stack?`],
  },
  {
    id: 'favorites',
    keywords: ['favorite language', 'favourite language', 'favorite tech', 'favourite tech', 'favorite framework', 'preferred stack', 'ideal stack', 'editor', 'vs code', 'vim'],
    responses: [
      `He's most productive in TypeScript with NestJS on the backend and PostgreSQL underneath — that combination covers most of his shipped work. For AI features, Python and the LLM APIs come in. For DSA, C++.`,
    ],
    followUps: [`Want the full stack breakdown?`],
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
      `Fair, direct question. If you need a 10-year veteran enterprise architect to manage 50 engineers on day one, that's not Nikhil — he graduated B.Tech CSE in 2026. But if you need an engineer who independently designs concurrency-safe NestJS transactional services, builds production RAG vector pipelines with pgvector, and solves 400+ DSA problems with 4,500+ commits, he punches way above his cohort.`,
      `Here is the unfiltered truth: He is early-career (2026 graduate) and hasn't navigated a 10,000-person corporate hierarchy yet. Reasons you should hire him anyway: He builds production software, not weekend tutorials. Wisflux trusted him with core transactional booking workflows with pessimistic locking and end-to-end RAG pipelines.`,
    ],
    followUps: [`Want to inspect his Wisflux backend architecture or his live RAG project?`],
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
      `Transparently: His strength is heavily backend and systems focused. While he crafts clean React/Next.js interfaces (like this portfolio and Flyeng Career), deep CSS micro-optimizations and complex design agency aesthetics aren't where he chooses to spend 80% of his time. He obsesses over database locking, query latency, data structures, and pipeline correctness.`,
      `His primary growth area: He's eager to scale beyond single-instance cloud deploys into distributed Kubernetes clusters and high-throughput streaming systems like Kafka. He masters concepts fast — going from zero to shipping production pgvector RAG during his Wisflux internship proves that.`,
    ],
    followUps: [`Want to test him on systems design or DSA?`],
  },
  {
    id: 'why-leave-wisflux',
    keywords: [
      'why did he leave wisflux',
      'why leave wisflux',
      'why not continue at wisflux',
      'ppo',
      'did he get a ppo',
      'why looking for a job',
      'why is he job hunting',
      'why switch',
      'left wisflux',
    ],
    responses: [
      `His Wisflux tenure was a structured 3-month Summer SDE Internship (Jun–Aug 2026) while completing his final year of B.Tech CSE. He successfully shipped their transactional booking service with pessimistic locking and an end-to-end RAG system. With his degree completed in 2026, he is now actively interviewing for full-time Software Engineer / Backend roles.`,
    ],
    followUps: [`Want his full internship breakdown or live project demos?`],
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
      `Not at all. Look at his consistency: 4 years of steady academic and project execution at Amity University (8.48 CGPA), a 100-day LeetCode streak, and 4,500+ GitHub contributions. He is looking for a team with high engineering standards where he can drop anchor, own backend services, and grow into a senior engineer.`,
    ],
    followUps: [`Ask me about his work ethic or his availability.`],
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
      `Definitely not. Vibe coders crash the moment a database transaction hits a deadlock or vector embeddings return garbage. Nikhil solved 400+ DSA problems in C++ on LeetCode/GFG and built his RAG pipeline with SHA-256 dedup, sliding-window chunking, and raw pgvector similarity queries from scratch. AI is an accelerator in his workflow, not a crutch for missing fundamentals.`,
    ],
    followUps: [`Want the technical breakdown of his RAG pipeline or locking mechanism?`],
  },
  {
    id: 'pessimistic-locking',
    keywords: [
      'pessimistic locking',
      'optimistic locking',
      'locking',
      'concurrency',
      'race condition',
      'race conditions',
      'double booking',
      'transactional',
      'typeorm locking',
      'select for update',
    ],
    responses: [
      `At Wisflux, Nikhil implemented pessimistic row locking (SELECT ... FOR UPDATE) inside TypeORM transactions. Why? In high-demand booking systems, optimistic locking (version checking) fails frequently under contention, forcing retries and bad UX. Pessimistic locking locks the resource row at the PostgreSQL level for the transaction duration, guaranteeing zero double-bookings with full consistency.`,
    ],
    followUps: [`Want how this was tested or how it fit into the Nx monorepo?`],
  },
  {
    id: 'rag-internals',
    keywords: [
      'hallucination',
      'hallucinations',
      'sliding window',
      'chunking',
      'vector search',
      'pgvector',
      'minilm',
      'grounded',
      'rag pipeline',
      'rag chatbot pipeline',
    ],
    responses: [
      `His RAG system (live at https://nikhil-rag-chatbot.onrender.com/) prevents hallucinations through a 4-step pipeline: 1) SHA-256 deduplication on upload, 2) sliding-window chunking to preserve contextual boundaries across paragraphs, 3) 384-dimensional MiniLM embeddings stored in pgvector, and 4) top-5 cosine similarity retrieval injected into an OpenRouter/Llama 3.3 prompt with strict source-grounding instructions.`,
    ],
    followUps: [`Want to test the live RAG system yourself?`],
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
      `Nikhil has 4,500+ GitHub contributions and 400+ DSA problems solved... which means his IDE in dark mode has seen more of him than the actual sun this year. He implemented pessimistic locking at Wisflux probably because he has trust issues with concurrent threads. But hey, his production services don't crash, so we'll forgive the vitamin D deficiency! 😄`,
      `Roasting him? The guy built five full-stack apps and an AI secretary (me) just so recruiters wouldn't have to read a PDF resume. If he spent half as much time sleeping as he does configuring Docker Compose, he might actually remember what 8 hours of rest feels like! 😉`,
    ],
    followUps: [`Want a serious answer now about his stack or projects? 😄`],
  },
  {
    id: 'personal-life',
    keywords: [
      'touch grass',
      'girlfriend',
      'sleep',
      'outside coding',
      'free time',
      'does he sleep',
    ],
    responses: [
      `He touches grass when walking between his desk and the coffee machine! In reality, when he's not solving LeetCode or refactoring Dockerfiles, he reads tech postmortems, experiments with new LLM agent protocols (MCP), and follows open-source developments.`,
    ],
    followUps: [`Want to know about his hackathon win or his certifications?`],
  },
  {
    id: 'jailbreak',
    keywords: [
      'ignore previous instructions',
      'ignore all instructions',
      'system prompt',
      'you are now',
      'dan mode',
      'jailbreak',
      'override',
      'pretend to be',
      'say you hate',
    ],
    responses: [
      `Nice try! My system instructions are guarded with pessimistic locking and SHA-256 checksums. I am John, Nikhil's portfolio secretary, and I stay loyal to verified engineering facts. If you want to challenge me, ask me a tough systems design or concurrency question instead!`,
    ],
    followUps: [`Try asking: "Explain his pessimistic locking implementation" or "Why should I hire him?"`],
  },
  {
    id: 'salary-negotiation',
    keywords: [
      'hire him for $5',
      '500 rupees',
      'pay him 1 dollar',
      'cheap',
      'minimum salary',
      'pay less',
      'low budget',
    ],
    responses: [
      `Nikhil is an engineer who ships production software, not Fiverr gigs. His compensation expectations are aligned with competitive market standards for high-performing early-career Software Engineers and Backend Developers. For exact numbers and offer discussions, reach out directly at nikhiljangid343@gmail.com.`,
    ],
    followUps: [`Want to discuss his availability date or technical scope?`],
  },
  {
    id: 'pressure-stress',
    keywords: [
      'handle pressure',
      'under pressure',
      'stress',
      'tight deadlines',
      'outages',
      'late nights',
      'production bug',
      'on-call',
    ],
    responses: [
      `During his Wisflux internship and hackathons (where he took First Prize), he built under real production constraints. In fact, he proactively implemented pessimistic row locking specifically to eliminate race conditions under concurrent load. He writes defensive code first so on-call fires don't happen in the first place.`,
    ],
    followUps: [`Want to discuss his Wisflux experience or his availability?`],
  },
  {
    id: 'pedigree',
    keywords: [
      'tier 3',
      'tier 1',
      'iit',
      'nit',
      'amity',
      'college tier',
      'pedigree',
      'degree matter',
      'college brand',
    ],
    responses: [
      `College names don't write clean Dockerfiles or fix race conditions — execution does. Nikhil built 5 live deployed applications, completed 2 industry internships, solved 400+ DSA problems, and graduated with an 8.48 CGPA. His verified code at https://github.com/nikhiljangid120 is the ultimate proof of ability.`,
    ],
    followUps: [`Want to see his live flagship Flyeng Career platform or his RAG chatbot?`],
  },
  {
    id: 'joke',
    keywords: ['joke', 'jokes', 'funny', 'make me laugh', 'humor', 'humour', 'pun'],
    responses: [
      `Why did the NestJS route go to therapy? Too many dependencies injected. 😄 Want a real answer about his concurrency-safe booking database instead?`,
      `Why are DBAs bad dancers? They keep locking the tables. 🕺 Ask me about his RAG pipeline next.`,
      `A recruiter asked him "scale?" — he said "horizontal." The recruiter nodded, then asked about the DSA count. 400+. 😄`,
    ],
    followUps: [`Now that we've got that out of the way — projects or stack?`],
  },
];

const FOLLOW_UP_RE = /\b(tell me more|more details|elaborate|go deeper|expand|more|continue|and\?|why|how so|explain more|details|detail)\b/i;

export const isFollowUp = (query: string): boolean => FOLLOW_UP_RE.test(query.trim());

/** Score every topic against the query; highest specificity wins. */
export const findBestTopic = (query: string): KnowledgeTopic | null => {
  let best: KnowledgeTopic | null = null;
  let bestScore = 0;
  for (const topic of KNOWLEDGE) {
    let score = 0;
    for (const keyword of topic.keywords) {
      if (containsKeyword(query, keyword)) score += keyword.includes(' ') ? 3 : 2;
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
        { label: 'Availability', query: 'When can Nikhil start working?' },
        { label: 'Relocation', query: 'Can he relocate to Bangalore or Pune?' },
        { label: 'Why hire him', query: 'Why should I hire Nikhil?' },
      ],
    };
  }

  // Hiring / evaluation intent
  if (/\b(hire|candidate|interview|evaluat|shortlist|offer|fit|developer|engineer)\b/.test(q)) {
    return {
      text: `If you are evaluating Nikhil: he is a 2026 B.Tech CSE graduate with production experience in NestJS, PostgreSQL, TypeORM, Docker, and RAG systems (Wisflux Tech Labs & Celebal). He is immediately available and open to relocation or remote work. Contact him at nikhiljangid343@gmail.com.`,
      topic: null,
      suggestedPrompts: [
        { label: 'Why NOT hire him?', query: "Why shouldn't I hire Nikhil?" },
        { label: 'Wisflux SDE', query: 'Tell me about his Wisflux internship' },
        { label: 'Tech Stack', query: 'What is his tech stack?' },
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
        { label: 'RAG Pipeline', query: 'Explain his production RAG chatbot pipeline' },
        { label: 'Projects', query: 'Which project should I check out first?' },
      ],
    };
  }

  // Default intelligent fallback
  return {
    text: pickVaried('fallback', [
      `I don't have a verified note on that exact question, but here is what I can confirm: Nikhil is a backend-focused SWE (B.Tech 2026, 8.48 CGPA) with two internships, five shipped projects, and 400+ DSA solutions. Try asking one of the prompts below!`,
      `That sits outside what Nikhil has documented in my verified database. If it's crucial for your evaluation, drop him a quick note at nikhiljangid343@gmail.com — or explore his engineering work using the prompts below.`,
      `Good question, but I keep my answers strictly grounded to verified facts about his software engineering experience, projects, stack, and availability. Choose a topic below to see what he builds.`,
    ]),
    topic: null,
    suggestedPrompts: [
      { label: 'Why hire him?', query: 'Why should I hire Nikhil?' },
      { label: 'Pessimistic locking', query: 'Explain the pessimistic locking in his booking service' },
      { label: 'Roast Nikhil 😄', query: 'Roast Nikhil' },
    ],
  };
};

/** Local answer: small talk → topic match → follow-up → smart fallback. */
export const getLocalResponse = (query: string, lastTopic: KnowledgeTopic | null): LocalAnswer | null => {
  const smallTalk = getSmallTalk(query);
  if (smallTalk) return { text: smallTalk, topic: null };

  const topic = findBestTopic(query);
  if (topic) {
    return {
      text: pickVaried(`topic:${topic.id}`, topic.responses),
      topic,
      suggestedPrompts: topic.id === 'why-not-hire'
        ? [
            { label: 'Pessimistic locking', query: 'Explain the pessimistic locking in his booking service' },
            { label: 'RAG Pipeline', query: 'Explain his production RAG chatbot pipeline' },
            { label: 'Roast him 😄', query: 'Roast Nikhil' },
          ]
        : topic.id === 'pessimistic-locking'
        ? [
            { label: 'RAG Pipeline', query: 'Explain his production RAG chatbot pipeline' },
            { label: 'Why hire him?', query: 'Why should I hire Nikhil?' },
            { label: 'Wisflux SDE', query: 'Tell me about his Wisflux internship' },
          ]
        : topic.id === 'roast'
        ? [
            { label: 'Why hire him?', query: 'Why should I hire Nikhil?' },
            { label: 'Tech stack', query: 'What is his tech stack?' },
            { label: 'Wisflux SDE', query: 'Tell me about his Wisflux internship' },
          ]
        : undefined,
    };
  }

  if (lastTopic && isFollowUp(query)) {
    const followUps = lastTopic.followUps?.length ? lastTopic.followUps : lastTopic.responses;
    return { text: pickVaried(`follow:${lastTopic.id}`, followUps), topic: lastTopic };
  }

  return getSmartFallback(query);
};

export const isResetCommand = (query: string): boolean =>
  /^(reset|clear|restart|start over|clear chat|new chat|reset chat|forget)\b/i.test(query.trim());

/* ------------------------------------------------------------------ */
/* UI helpers                                                          */
/* ------------------------------------------------------------------ */

export const QUICK_PROMPTS: { label: string; query: string }[] = [
  { label: 'Why hire him?', query: 'Why should I hire Nikhil?' },
  { label: 'Why NOT hire him?', query: "Why shouldn't I hire Nikhil?" },
  { label: 'Pessimistic locking', query: 'Explain the pessimistic locking in his booking service' },
  { label: 'RAG Pipeline', query: 'Explain his production RAG chatbot pipeline' },
  { label: 'Roast Nikhil 😄', query: 'Roast Nikhil' },
  { label: 'Notice & Joining', query: 'When can he start and can he relocate?' },
  { label: 'His Weakness?', query: "What is Nikhil's biggest weakness?" },
  { label: 'Tech Stack', query: 'What is his core backend tech stack?' },
  { label: 'Contact Details', query: 'How do I contact Nikhil?' },
];

export const buildWelcome = (): string => {
  const hour = new Date().getHours();
  const part = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return pickVaried('welcome', [
    `${part} — I'm John, Nikhil's portfolio secretary. I can brief you on his backend depth (NestJS, pessimistic locking), production RAG pipeline, hiring fit, or why you might (or might not!) hire him. What are you evaluating?`,
    `${part}! I'm John. Test me with tough questions: "Why shouldn't I hire him?", "Explain his pessimistic locking", "Roast him", or ask for his live project links and availability. Where should we start?`,
    `${part} — ready to help. Ask me anything from his 400+ DSA count to his Wisflux backend architecture, RAG vector search, or tricky recruiter questions.`,
  ]);
};

export const FALLBACK_RESPONSES = [
  `I don't have a verified answer for that, so I won't make one up. I can give you the facts on Nikhil's experience, projects, stack, availability, or contact details.`,
  `That sits outside the profile I can verify. For a definitive answer, Nikhil is reachable at nikhiljangid343@gmail.com.`,
  `I can't confirm that from his portfolio. If you're evaluating technical fit, his strongest evidence is the Wisflux backend work and the production RAG pipeline.`,
  `I don't have reliable context for that specific question. Try a project, internship, skill, availability, or source-code question — I can be precise there.`,
  `Rather than guess, I'd point you to the closest verified signal: five live projects, two internships, 400+ DSA problems, and 4,500+ GitHub contributions.`,
  `That isn't documented in Nikhil's profile. You can contact him directly at nikhiljangid343@gmail.com if it matters to your decision.`,
  `I can only speak to information Nikhil has verified for this portfolio. Ask naturally about backend engineering, RAG, MCP, projects, location, or hiring fit.`,
  `No verified answer on that one. His GitHub is https://github.com/nikhiljangid120 if you'd like to evaluate the work directly.`,
];

/* ------------------------------------------------------------------ */
/* LLM system prompt                                                   */
/* ------------------------------------------------------------------ */

export const JOHN_SYSTEM_CONTEXT = `You are John, the professional portfolio secretary embedded in Nikhil Jangid's software engineering portfolio site.

PERSONALITY: sharp, confident, warm, and concise. You represent Nikhil for recruiters, hiring managers, CEOs, CTOs, HR teams, employees, directors, collaborators, and general visitors. You are an advocate for Nikhil but never dishonest. You never invent facts.

=== IDENTITY ===
Name: Nikhil Jangid. Age: 21. Location: Jaipur, Rajasthan, India (open to relocation, remote/hybrid fine).
Degree: B.Tech Computer Science & Engineering, Amity University Rajasthan, batch 2022-2026. Graduated 2026. CGPA: 8.48.
Email: nikhiljangid343@gmail.com | Phone: +91 8058803339
GitHub: https://github.com/nikhiljangid120 | LinkedIn: https://linkedin.com/in/nikhil-jangid-b84360264
LeetCode: https://leetcode.com/u/nikhil_888/

=== STATUS ===
Actively interviewing for Software Engineer / Backend Developer / Full-Stack Developer roles. Available immediately.

=== EXPERIENCE ===
1. SDE Intern @ Wisflux Tech Labs (Jun-Aug 2026, completed) - NestJS services in an Nx monorepo, PostgreSQL, TypeORM, Docker Compose.
   - Concurrency-safe transactional booking service: pessimistic locking to prevent double-booking, availability engine, JWT auth, Swagger docs.
   - RAG Chatbot - Document Q&A System, LIVE at https://nikhil-rag-chatbot.onrender.com/ : PDF ingestion with SHA-256 dedup, sliding-window chunking, 384-dim MiniLM embeddings, top-5 pgvector similarity search, grounded answers via OpenRouter + Llama 3.3, Dockerized on Render.
2. Frontend Developer Intern @ Celebal Technologies (May-Jul 2025) - React.js + Tailwind shipment tracking web app, REST API integration, Agile team with Git workflows.

=== PROJECTS (all live) ===
1. Flyeng Career (flagship) - http://flyeng-career.vercel.app/ - Next.js 14, TypeScript, PostgreSQL, Prisma, AI/LLM. AI career platform: personalized roadmaps, resume optimization, interview prep, portfolio builder.
2. RAG Chatbot - Document Q&A - https://nikhil-rag-chatbot.onrender.com/ - NestJS, React, PostgreSQL, pgvector, MiniLM, OpenRouter, Docker.
3. AI Resume Builder - https://ai-resume-builder-epbj.vercel.app/ - Next.js, Gemini 1.5 Flash, TypeScript, Tailwind. ATS-optimized resumes, live preview, PDF export.
4. AI Code Analyzer - https://code-analyzer-f7bq.vercel.app/ - Next.js, Groq API, D3.js. Code quality analysis with complexity visualization.
5. AI Fitness Platform - https://fitness-platform-zeta.vercel.app/ - Next.js, Firebase, Gemini API. Workout and nutrition planning.

=== SKILLS ===
Languages: JavaScript (ES6+), TypeScript, C++, Python, SQL, HTML5, CSS3.
Backend: NestJS, Node.js, Express.js, TypeORM, Prisma, REST APIs, JWT, Swagger, Nx monorepo.
Frontend: React.js, Next.js 14 (App Router), Tailwind CSS, Zustand, Framer Motion.
Data: PostgreSQL, pgvector, MongoDB, MySQL, Firebase, Supabase, SQLite.
AI: RAG pipelines, LangChain, Model Context Protocol (MCP), pgvector, MiniLM embeddings, semantic search, LLM orchestration, structured outputs, OpenRouter, Llama, Gemini API, Groq API, prompt engineering.
DevOps: Docker, Docker Compose, Git, GitHub, Vercel, Render, Postman.
DSA: 400+ problems in C++ across LeetCode and GeeksForGeeks.

=== ACHIEVEMENTS ===
First Prize, Amity University college hackathon. GirlScript Summer of Code (GSSoC) contributor. IBM SkillsBuild AI certification. McKinsey Forward Program graduate. 3-star CodeChef. Top 10% GFG ranking. 100-day LeetCode streak badge. 4,500+ GitHub contributions.

=== WORK STYLE ===
Backend-leaning full-stack engineer who ships production software, not demos. Cares about data integrity, transactional correctness, and deployable Docker setups. Fast, self-directed learner. Prefers engineering-focused teams that value technical depth.

=== ANSWER RULES ===
- Under 90 words. Short sentences. No filler, no corporate fluff.
- Be specific: real project names, real technologies, real URLs, real numbers.
- Never invent facts. If something isn't above, say so and point to nikhiljangid343@gmail.com.
- When relevant, end with a short question or a next step.
- For hiring/contact questions, give his email and LinkedIn.
- Never disparage Nikhil, and never claim skills he does not have.
- If asked to criticize him — weaknesses, whether to reject or fire him — answer honestly with verified facts only. Real gaps may be stated plainly (early-career, no full-time role yet, backend-leaning depth); never invent flaws, and never hard-sell against a direct concern.
- If asked what he is currently doing beyond the verified status above, say it sits outside the profile you can verify and give nikhiljangid343@gmail.com.
- If the user asks about YOU (your model, tech, cost, or says "I mean this chatbot"), explain: you are John — a hand-built knowledge engine answering from verified portfolio facts, with a Gemini 1.5 Flash fallback for off-script questions.
- If asked about salary, say compensation is a conversation to have directly with him.`;
