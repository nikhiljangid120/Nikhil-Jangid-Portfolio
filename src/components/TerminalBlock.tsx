
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface TerminalLine {
  text: string;
  delay?: number;
  color?: string;
  isCommand?: boolean;
}

interface TerminalBlockProps {
  lines: TerminalLine[];
  onComplete?: () => void;
  title?: string;
  autoScroll?: boolean;
}

const TerminalBlock = ({ lines, onComplete, title = "bash", autoScroll = true }: TerminalBlockProps) => {
  const [displayedLines, setDisplayedLines] = useState<TerminalLine[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      if (onComplete) {
        setTimeout(onComplete, 800);
      }
      return;
    }

    const line = lines[currentLineIndex];
    if (!line) return;

    const timeout = setTimeout(() => {
      setDisplayedLines(prev => [...prev, line]);
      setCurrentLineIndex(prev => prev + 1);
    }, line.delay || 150);

    return () => clearTimeout(timeout);
  }, [currentLineIndex, lines, onComplete]);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedLines, autoScroll]);

  return (
    <div className="w-full max-w-2xl mx-auto font-mono text-sm sm:text-base rounded-lg overflow-hidden border border-muted bg-[#0d1117] shadow-2xl">
      {/* Terminal Title Bar */}
      <div className="flex items-center px-4 py-2 bg-muted/50 border-b border-muted">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="ml-4 text-xs text-muted-foreground opacity-70 flex-1 text-center font-bold">
          {title} — zsh
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={scrollRef}
        className="p-4 h-64 sm:h-80 overflow-y-auto bg-[#0d1117]/95 scroll-smooth"
      >
        <div className="flex flex-col space-y-1">
          {displayedLines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`${line.color || 'text-foreground'}`}
            >
              <span className="opacity-50 mr-2 select-none">
                {line.isCommand ? '$' : '>'}
              </span>
              {line.text}
            </motion.div>
          ))}
          
          {/* Active Cursor Line */}
          {currentLineIndex < lines.length && (
            <div className="flex items-center text-primary">
              <span className="opacity-50 mr-2 select-none">$</span>
              <span className="w-2.5 h-5 bg-primary/80 animate-pulse block" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TerminalBlock;
