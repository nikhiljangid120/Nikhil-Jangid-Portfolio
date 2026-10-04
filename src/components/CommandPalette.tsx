import { useEffect, useState, useMemo } from 'react';
import { Command } from 'cmdk';
import {
    Search,
    Home,
    User,
    Code,
    Briefcase,
    FileText,
    Clock,
    Mail,
    Github,
    Linkedin,
    ExternalLink,
    Copy,
    Bot,
    Download,
    Sparkles,
    GraduationCap,
    Check,
    Layers,
    Terminal,
    X
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface CommandItemType {
    id: string;
    title: string;
    category: 'Navigation' | 'Experience' | 'Projects' | 'Skills' | 'Actions';
    description?: string;
    icon: any;
    keywords: string[];
    action: () => void;
    badge?: string;
}

const CommandPalette = () => {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };

        const handleCustomOpen = () => setOpen(true);
        window.addEventListener('open-command-palette', handleCustomOpen);
        document.addEventListener('keydown', down);

        return () => {
            document.removeEventListener('keydown', down);
            window.removeEventListener('open-command-palette', handleCustomOpen);
        };
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const header = document.querySelector('header');
            const navbarHeight = header?.getBoundingClientRect().height || 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - navbarHeight - 20;

            window.scrollTo({
                top: Math.max(0, offsetPosition),
                behavior: 'smooth',
            });
        }
    };

    const copyEmail = () => {
        navigator.clipboard.writeText('nikhiljangid343@gmail.com');
        setCopied(true);
        toast.success('Email copied to clipboard: nikhiljangid343@gmail.com');
        setTimeout(() => setCopied(false), 2000);
    };

    const openChatbot = () => {
        window.dispatchEvent(new CustomEvent('open-portfolio-chat'));
        toast.info("John is online — ask him anything about Nikhil's work!");
    };

    const items: CommandItemType[] = useMemo(() => [
        // Navigation
        {
            id: 'nav-home',
            title: 'Home',
            category: 'Navigation',
            description: 'Back to hero section & overview',
            icon: Home,
            keywords: ['home', 'start', 'hero', 'top', 'intro'],
            action: () => scrollToSection('home'),
        },
        {
            id: 'nav-about',
            title: 'About Me',
            category: 'Navigation',
            description: 'Engineering philosophy, background & bio',
            icon: User,
            keywords: ['about', 'bio', 'who', 'me', 'profile', 'engineer'],
            action: () => scrollToSection('about'),
        },
        {
            id: 'nav-skills',
            title: 'Skills & Stack',
            category: 'Navigation',
            description: 'Languages, backend, databases & DevOps',
            icon: Code,
            keywords: ['skills', 'tech', 'stack', 'languages', 'backend', 'tools'],
            action: () => scrollToSection('skills'),
        },
        {
            id: 'nav-projects',
            title: 'Featured Projects',
            category: 'Navigation',
            description: '5 shipped applications with live demos',
            icon: Briefcase,
            keywords: ['projects', 'work', 'apps', 'portfolio', 'live', 'code'],
            action: () => scrollToSection('projects'),
        },
        {
            id: 'nav-resume',
            title: 'Resume & Credentials',
            category: 'Navigation',
            description: 'Download CV, stats & verified achievements',
            icon: FileText,
            keywords: ['resume', 'cv', 'download', 'pdf', 'credentials', 'certifications'],
            action: () => scrollToSection('resume'),
        },
        {
            id: 'nav-timeline',
            title: 'Timeline & Experience',
            category: 'Navigation',
            description: 'Internships at Wisflux, Celebal & B.Tech CSE',
            icon: Clock,
            keywords: ['timeline', 'experience', 'internship', 'education', 'wisflux', 'celebal', 'journey'],
            action: () => scrollToSection('timeline'),
        },
        {
            id: 'nav-contact',
            title: 'Contact & Hire',
            category: 'Navigation',
            description: 'Get in touch for software engineering roles',
            icon: Mail,
            keywords: ['contact', 'hire', 'email', 'message', 'reach', 'phone'],
            action: () => scrollToSection('contact'),
        },

        // Experience & Timeline Items
        {
            id: 'exp-wisflux',
            title: 'Wisflux Tech Labs — SDE Intern',
            category: 'Experience',
            description: 'NestJS Nx monorepo, pessimistic locking & RAG pipeline (2026)',
            icon: Terminal,
            badge: 'Experience',
            keywords: ['wisflux', 'sde', 'intern', 'nestjs', 'postgresql', 'typeorm', 'rag', 'locking', 'backend'],
            action: () => scrollToSection('timeline'),
        },
        {
            id: 'exp-celebal',
            title: 'Celebal Technologies — Frontend Intern',
            category: 'Experience',
            description: 'React.js, Tailwind CSS & shipment tracking app (2025)',
            icon: Layers,
            badge: 'Experience',
            keywords: ['celebal', 'frontend', 'react', 'tailwind', 'shipment', 'intern'],
            action: () => scrollToSection('timeline'),
        },
        {
            id: 'edu-btech',
            title: 'B.Tech in Computer Science & Engineering',
            category: 'Experience',
            description: 'Amity University Rajasthan · CGPA: 8.48 (2022–2026)',
            icon: GraduationCap,
            badge: 'Education',
            keywords: ['btech', 'cse', 'education', 'amity', 'degree', 'college', 'gpa', 'university', 'graduated'],
            action: () => scrollToSection('timeline'),
        },

        // Projects
        {
            id: 'proj-flyeng',
            title: 'Flyeng Career — AI Platform',
            category: 'Projects',
            description: 'Flagship AI career platform (Next.js 14, TypeScript, PostgreSQL, Prisma)',
            icon: Sparkles,
            badge: 'Live',
            keywords: ['flyeng', 'career', 'platform', 'flagship', 'ai', 'nextjs', 'prisma'],
            action: () => {
                scrollToSection('projects');
            },
        },
        {
            id: 'proj-rag',
            title: 'RAG Chatbot — Document Q&A System',
            category: 'Projects',
            description: 'PDF dedup, sliding-window chunking, MiniLM embeddings & pgvector',
            icon: Bot,
            badge: 'Live',
            keywords: ['rag', 'chatbot', 'document', 'qa', 'pgvector', 'minilm', 'llama', 'openrouter', 'docker'],
            action: () => {
                scrollToSection('projects');
            },
        },
        {
            id: 'proj-resume',
            title: 'AI Resume Builder',
            category: 'Projects',
            description: 'ATS-optimized resume generator with Gemini 1.5 Flash',
            icon: FileText,
            badge: 'Live',
            keywords: ['resume', 'builder', 'ats', 'gemini', 'generator', 'cv'],
            action: () => {
                scrollToSection('projects');
            },
        },
        {
            id: 'proj-analyzer',
            title: 'AI Code Analyzer (Hackathon Winner)',
            category: 'Projects',
            description: 'Time & space complexity visualization with Groq API & D3.js',
            icon: Code,
            badge: 'Award Winner',
            keywords: ['analyzer', 'code', 'complexity', 'groq', 'd3', 'hackathon'],
            action: () => {
                scrollToSection('projects');
            },
        },
        {
            id: 'proj-fitness',
            title: 'AI Fitness Platform',
            category: 'Projects',
            description: 'Personalized workout & nutrition planning with Gemini API & Firebase',
            icon: Sparkles,
            badge: 'Live',
            keywords: ['fitness', 'workout', 'nutrition', 'firebase', 'gemini'],
            action: () => {
                scrollToSection('projects');
            },
        },

        // Skills
        {
            id: 'skill-nest',
            title: 'NestJS & TypeScript',
            category: 'Skills',
            description: 'Enterprise backend architecture, dependency injection, Nx monorepo',
            icon: Terminal,
            keywords: ['nestjs', 'typescript', 'backend', 'node', 'express', 'api'],
            action: () => scrollToSection('skills'),
        },
        {
            id: 'skill-db',
            title: 'PostgreSQL & pgvector',
            category: 'Skills',
            description: 'Relational data modeling, transactions, pessimistic locking & vector search',
            icon: Layers,
            keywords: ['postgresql', 'postgres', 'pgvector', 'sql', 'database', 'typeorm', 'prisma'],
            action: () => scrollToSection('skills'),
        },
        {
            id: 'skill-docker',
            title: 'Docker & Containerization',
            category: 'Skills',
            description: 'Multi-container local setups, Docker Compose & cloud deployment',
            icon: Terminal,
            keywords: ['docker', 'compose', 'devops', 'render', 'vercel', 'deploy'],
            action: () => scrollToSection('skills'),
        },
        {
            id: 'skill-dsa',
            title: 'DSA: 400+ Problems Solved',
            category: 'Skills',
            description: 'C++ problem solving across LeetCode & GeeksForGeeks',
            icon: Code,
            keywords: ['dsa', 'leetcode', 'algorithms', 'c++', 'data structures', 'gfg'],
            action: () => scrollToSection('skills'),
        },

        // Actions
        {
            id: 'act-chat',
            title: 'Ask John (Portfolio AI Assistant)',
            category: 'Actions',
            description: 'Instant answers on stack, internships, tricky questions & fit',
            icon: Bot,
            badge: 'AI',
            keywords: ['chat', 'john', 'assistant', 'ask', 'bot', 'ai', 'questions'],
            action: openChatbot,
        },
        {
            id: 'act-copy-email',
            title: 'Copy Email Address',
            category: 'Actions',
            description: 'nikhiljangid343@gmail.com',
            icon: copied ? Check : Copy,
            keywords: ['copy', 'email', 'address', 'mail', 'clipboard'],
            action: copyEmail,
        },
        {
            id: 'act-resume-dl',
            title: 'Download Resume (PDF)',
            category: 'Actions',
            description: 'Get verified 1-page software engineer resume',
            icon: Download,
            keywords: ['download', 'resume', 'pdf', 'cv', 'get'],
            action: () => {
                window.open('/Resume-Nikhil-Jangid.pdf', '_blank');
                toast.success('Opening resume PDF...');
            },
        },
        {
            id: 'act-github',
            title: 'Visit GitHub Profile',
            category: 'Actions',
            description: 'github.com/nikhiljangid120 · 4,500+ contributions',
            icon: Github,
            keywords: ['github', 'git', 'repo', 'code', 'profile'],
            action: () => window.open('https://github.com/nikhiljangid120', '_blank'),
        },
        {
            id: 'act-linkedin',
            title: 'Connect on LinkedIn',
            category: 'Actions',
            description: 'linkedin.com/in/nikhil-jangid-b84360264',
            icon: Linkedin,
            keywords: ['linkedin', 'connect', 'social', 'network'],
            action: () => window.open('https://www.linkedin.com/in/nikhil-jangid-b84360264/', '_blank'),
        },
    ], [copied]);

    const categories: ('Navigation' | 'Experience' | 'Projects' | 'Skills' | 'Actions')[] = [
        'Navigation',
        'Experience',
        'Projects',
        'Skills',
        'Actions',
    ];

    const runItem = (item: CommandItemType) => {
        setOpen(false);
        setTimeout(() => {
            item.action();
        }, 100);
    };

    return (
        <>
            {/* Search Trigger Hint - Floating Button */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open command palette"
                className="fixed bottom-5 left-5 z-40 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e1320]/90 backdrop-blur-md border border-white/10 text-xs text-muted-foreground cursor-pointer hover:text-primary hover:border-primary/30 transition-all font-mono shadow-lg hover:shadow-primary/10 group"
            >
                <Search size={13} className="text-primary group-hover:scale-110 transition-transform" />
                <span>Search portfolio</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="p-0 border border-white/15 bg-[#0b0f19] shadow-[0_25px_80px_rgba(0,0,0,0.9)] max-w-2xl rounded-2xl overflow-hidden [&>button]:hidden">
                    <Command className="w-full bg-transparent text-foreground font-sans">
                        {/* Search Input Bar */}
                        <div className="flex items-center border-b border-white/10 px-4 py-3 bg-[#0e1422]">
                            <Search className="mr-3 h-4 w-4 shrink-0 text-primary opacity-80" />
                            <Command.Input
                                placeholder="Search sections, projects, Wisflux, skills, or actions..."
                                className="flex h-9 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground font-mono text-foreground focus:ring-0 border-0"
                            />
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="p-1 rounded-md text-muted-foreground hover:text-white transition-colors ml-2"
                                aria-label="Close search"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Search Results List */}
                        <Command.List className="max-h-[380px] overflow-y-auto overflow-x-hidden p-2 custom-scrollbar space-y-2">
                            <Command.Empty className="py-10 text-center text-sm text-muted-foreground font-mono">
                                <p className="text-foreground font-medium mb-1">No matching results found.</p>
                                <p className="text-xs text-muted-foreground">Try searching for "Wisflux", "RAG", "NestJS", "Projects", or "Resume".</p>
                            </Command.Empty>

                            {categories.map((cat) => {
                                const catItems = items.filter((item) => item.category === cat);
                                if (catItems.length === 0) return null;

                                return (
                                    <Command.Group
                                        key={cat}
                                        heading={cat}
                                        className="[&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-primary/70 [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5"
                                    >
                                        {catItems.map((item) => {
                                            const IconComponent = item.icon;
                                            return (
                                                <Command.Item
                                                    key={item.id}
                                                    value={`${item.title} ${item.description || ''} ${item.keywords.join(' ')}`}
                                                    onSelect={() => runItem(item)}
                                                    className="relative flex cursor-pointer select-none items-center rounded-xl px-3 py-2.5 text-sm outline-none transition-all duration-150 aria-selected:bg-primary/15 aria-selected:text-white hover:bg-white/5 group border border-transparent aria-selected:border-primary/25"
                                                >
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-primary mr-3 shrink-0 group-hover:scale-105 group-aria-selected:bg-primary/20 transition-all">
                                                        <IconComponent size={15} />
                                                    </div>

                                                    <div className="flex flex-col min-w-0 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-foreground group-aria-selected:text-primary transition-colors truncate">
                                                                {item.title}
                                                            </span>
                                                            {item.badge && (
                                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-primary/10 text-primary border border-primary/20 shrink-0">
                                                                    {item.badge}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {item.description && (
                                                            <span className="text-xs text-muted-foreground truncate font-sans">
                                                                {item.description}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="ml-2 text-xs font-mono text-muted-foreground opacity-0 group-aria-selected:opacity-100 transition-opacity flex items-center gap-1 shrink-0 text-primary">
                                                        <span>Select</span>
                                                        <ExternalLink size={11} />
                                                    </div>
                                                </Command.Item>
                                            );
                                        })}
                                    </Command.Group>
                                );
                            })}
                        </Command.List>

                        {/* Search Footer */}
                        <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5 bg-[#0e1422] text-[11px] font-mono text-muted-foreground">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/80">↑</kbd>
                                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/80">↓</kbd>
                                    <span>Navigate</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/80">↵</kbd>
                                    <span>Select</span>
                                </span>
                            </div>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/80">ESC</kbd>
                                <span>Close</span>
                            </span>
                        </div>
                    </Command>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CommandPalette;
