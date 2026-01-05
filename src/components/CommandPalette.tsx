
import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    Code,
    Terminal,
    Home,
    Briefcase,
    Mail,
    Github,
    Linkedin,
    Search,
    Laptop
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const CommandPalette = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            {/* Search Trigger Hint - Floating Button or just a hint */}
            <div
                onClick={() => setOpen(true)}
                className="fixed bottom-5 left-5 z-40 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/80 backdrop-blur border border-border text-xs text-muted-foreground cursor-pointer hover:bg-muted transition-colors font-mono"
            >
                <Terminal size={12} />
                <span>Command Palette</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="overflow-hidden p-0 shadow-2xl bg-[#0d1117] border border-[#30363d] max-w-2xl translate-y-[-50%] top-[30%]">
                    <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
                        <div className="flex items-center border-b border-[#30363d] px-3">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <Command.Input
                                placeholder="Type a command or search..."
                                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 font-mono text-foreground"
                            />
                        </div>

                        <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden py-2 scroll-py-2 custom-scrollbar">
                            <Command.Empty className="py-6 text-center text-sm text-muted-foreground font-mono">No results found.</Command.Empty>

                            <Command.Group heading="Navigation" className="text-xs font-mono text-muted-foreground px-2 py-1.5 uppercase tracking-wider">
                                <Command.Item
                                    onSelect={() => runCommand(() => scrollToSection('home'))}
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-primary/20 aria-selected:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors font-mono"
                                >
                                    <Home className="mr-2 h-4 w-4" />
                                    <span>Home</span>
                                </Command.Item>
                                <Command.Item
                                    onSelect={() => runCommand(() => scrollToSection('about'))}
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-primary/20 aria-selected:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors font-mono"
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    <span>About Me</span>
                                </Command.Item>
                                <Command.Item
                                    onSelect={() => runCommand(() => scrollToSection('skills'))}
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-primary/20 aria-selected:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors font-mono"
                                >
                                    <Code className="mr-2 h-4 w-4" />
                                    <span>Skills</span>
                                </Command.Item>
                                <Command.Item
                                    onSelect={() => runCommand(() => scrollToSection('projects'))}
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-primary/20 aria-selected:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors font-mono"
                                >
                                    <Briefcase className="mr-2 h-4 w-4" />
                                    <span>Projects</span>
                                </Command.Item>
                                <Command.Item
                                    onSelect={() => runCommand(() => scrollToSection('contact'))}
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-primary/20 aria-selected:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors font-mono"
                                >
                                    <Mail className="mr-2 h-4 w-4" />
                                    <span>Contact</span>
                                </Command.Item>
                            </Command.Group>

                            <Command.Separator className="my-1 h-px bg-border" />

                            <Command.Group heading="Socials" className="text-xs font-mono text-muted-foreground px-2 py-1.5 uppercase tracking-wider">
                                <Command.Item
                                    onSelect={() => runCommand(() => window.open('https://github.com/nikhiljangid120', '_blank'))}
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-primary/20 aria-selected:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors font-mono"
                                >
                                    <Github className="mr-2 h-4 w-4" />
                                    <span>GitHub</span>
                                </Command.Item>
                                <Command.Item
                                    onSelect={() => runCommand(() => window.open('https://www.linkedin.com/in/nikhil-jangid-b84360264/', '_blank'))}
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-primary/20 aria-selected:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors font-mono"
                                >
                                    <Linkedin className="mr-2 h-4 w-4" />
                                    <span>LinkedIn</span>
                                </Command.Item>
                            </Command.Group>

                            <Command.Separator className="my-1 h-px bg-border" />

                            <Command.Group heading="Theme" className="text-xs font-mono text-muted-foreground px-2 py-1.5 uppercase tracking-wider">
                                <Command.Item
                                    disabled
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none opacity-50 font-mono"
                                >
                                    <Laptop className="mr-2 h-4 w-4" />
                                    <span>System Theme (Active)</span>
                                </Command.Item>
                            </Command.Group>
                        </Command.List>
                    </Command>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CommandPalette;
