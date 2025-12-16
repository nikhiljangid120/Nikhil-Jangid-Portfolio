import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Code, ShieldCheck, Database, Lightbulb, Award, Trophy, Rocket, Puzzle } from 'lucide-react';
import { cn } from '@/lib/utils';

type GameCharacter = {
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
  speed: number;
};

type GameItem = {
  id: number;
  x: number;
  y: number;
  type: 'code' | 'security' | 'database' | 'innovation';
  collected: boolean;
  icon: JSX.Element;
  info: string;
};

const AboutMiniGame = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [character, setCharacter] = useState<GameCharacter>({
    x: 50,
    y: 50,
    direction: 'right',
    speed: 5,
  });
  const [score, setScore] = useState(0);
  const [items, setItems] = useState<GameItem[]>([]);
  const [keys, setKeys] = useState({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });
  const [factIndex, setFactIndex] = useState(0);
  const [showFact, setShowFact] = useState(false);
  const [gameSize, setGameSize] = useState({ width: 0, height: 0 });
  const [message, setMessage] = useState('Collect all items to learn about my skills');
  
  const facts = [
    "I excel in creating clean, maintainable code for scalable applications",
    "I implement robust security practices in all my projects",
    "I design efficient database structures for optimal performance",
    "I'm passionate about exploring innovative solutions and new technologies",
    "Game completed! You've discovered my core development principles"
  ];

  useEffect(() => {
    if (gameContainerRef.current) {
      const rect = gameContainerRef.current.getBoundingClientRect();
      setGameSize({
        width: rect.width,
        height: rect.height
      });

      // Generate items
      const newItems: GameItem[] = [
        {
          id: 1,
          x: Math.random() * 70 + 10,
          y: Math.random() * 40 + 10,
          type: 'code',
          collected: false,
          icon: <Code className="w-6 h-6 text-lime" />,
          info: "Clean Code"
        },
        {
          id: 2,
          x: Math.random() * 70 + 10,
          y: Math.random() * 40 + 50,
          type: 'security',
          collected: false,
          icon: <ShieldCheck className="w-6 h-6 text-purple" />,
          info: "Security Best Practices"
        },
        {
          id: 3,
          x: Math.random() * 70 + 10,
          y: Math.random() * 40 + 10,
          type: 'database',
          collected: false,
          icon: <Database className="w-6 h-6 text-teal" />,
          info: "Database Optimization"
        },
        {
          id: 4,
          x: Math.random() * 70 + 10,
          y: Math.random() * 40 + 50,
          type: 'innovation',
          collected: false,
          icon: <Lightbulb className="w-6 h-6 text-gold" />,
          info: "Innovation Focus"
        }
      ];
      setItems(newItems);
    }
  }, [gameContainerRef]);

  useEffect(() => {
    if (!gameStarted) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        setKeys(prev => ({ ...prev, [e.key]: true }));
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        setKeys(prev => ({ ...prev, [e.key]: false }));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted]);
  
  useEffect(() => {
    if (!gameStarted) return;
    
    const moveInterval = setInterval(() => {
      setCharacter(prev => {
        let newX = prev.x;
        let newY = prev.y;
        let newDirection = prev.direction;
        
        if (keys.ArrowUp) {
          newY = Math.max(0, prev.y - prev.speed);
          newDirection = 'up';
        }
        if (keys.ArrowDown) {
          newY = Math.min(90, prev.y + prev.speed);
          newDirection = 'down';
        }
        if (keys.ArrowLeft) {
          newX = Math.max(0, prev.x - prev.speed);
          newDirection = 'left';
        }
        if (keys.ArrowRight) {
          newX = Math.min(90, prev.x + prev.speed);
          newDirection = 'right';
        }
        
        return {
          ...prev,
          x: newX,
          y: newY,
          direction: newDirection
        };
      });
      
      // Check for collisions
      setItems(prev => {
        const newItems = [...prev];
        let isNewCollision = false;
        
        for (let i = 0; i < newItems.length; i++) {
          if (!newItems[i].collected && 
              Math.abs(character.x - newItems[i].x) < 10 && 
              Math.abs(character.y - newItems[i].y) < 10) {
            newItems[i].collected = true;
            setScore(prev => prev + 1);
            setFactIndex(i);
            setShowFact(true);
            isNewCollision = true;
            
            setTimeout(() => {
              setShowFact(false);
            }, 3000);
          }
        }
        
        // Check if all items collected
        if (newItems.every(item => item.collected) && newItems.length > 0 && !gameCompleted) {
          setGameCompleted(true);
          setFactIndex(4);
          setShowFact(true);
          setTimeout(() => {
            setMessage("Game completed! You've discovered all my skills!");
          }, 1000);
        }
        
        return newItems;
      });
    }, 50);
    
    return () => clearInterval(moveInterval);
  }, [gameStarted, keys, character, gameCompleted]);

  const handleStart = () => {
    setGameStarted(true);
    setMessage('Use arrow keys to move and collect all items');
  };

  const handleRestart = () => {
    setCharacter({
      x: 50,
      y: 50,
      direction: 'right',
      speed: 5
    });
    setScore(0);
    setGameCompleted(false);
    setItems(prev => prev.map(item => ({ ...item, collected: false })));
    setMessage('Use arrow keys to move and collect all items');
  };

  // Mobile touch controls
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!gameStarted) return;
    
    const touch = e.touches[0];
    const container = gameContainerRef.current;
    
    if (container) {
      const rect = container.getBoundingClientRect();
      const relX = ((touch.clientX - rect.left) / rect.width) * 100;
      const relY = ((touch.clientY - rect.top) / rect.height) * 100;
      
      setCharacter(prev => ({
        ...prev,
        x: Math.max(0, Math.min(90, relX)),
        y: Math.max(0, Math.min(90, relY)),
        direction: relX > prev.x ? 'right' : relX < prev.x ? 'left' : prev.y > relY ? 'up' : 'down'
      }));
    }
  };

  return (
    <div className="my-12 w-full max-w-2xl mx-auto perspective">
      <motion.div 
        className="text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-spaceGrotesk font-bold mb-2 bg-gradient-to-r from-lime via-teal to-purple bg-clip-text text-transparent">
          Interactive Skill Discovery
        </h3>
        <p className="text-gray-300 mb-4">{message}</p>
        
        {gameStarted ? (
          <div className="flex justify-center gap-4 mb-4">
            <motion.button
              onClick={handleRestart}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-teal/80 to-purple/80 text-white hover:from-teal hover:to-purple transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Restart Game
            </motion.button>
            <div className="px-4 py-2 rounded-md bg-charcoal/50 text-gray-200">
              Items Collected: {score}/{items.length}
            </div>
          </div>
        ) : (
          <motion.button
            onClick={handleStart}
            className="px-6 py-3 rounded-md bg-gradient-to-r from-lime/80 to-teal/80 text-black font-medium hover:from-lime hover:to-teal transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Game
          </motion.button>
        )}
      </motion.div>
      
      <motion.div
        ref={gameContainerRef}
        className="relative w-full h-64 md:h-80 rounded-xl bg-charcoal/20 backdrop-blur-md border border-white/10 overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onTouchMove={handleTouchMove}
      >
        {/* Grid background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        
        {/* Character */}
        {gameStarted && (
          <motion.div 
            className="absolute w-10 h-10 rounded-full bg-gradient-to-r from-lime to-teal flex items-center justify-center"
            style={{ 
              left: `${character.x}%`, 
              top: `${character.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            transition={{ type: "spring", damping: 10 }}
            animate={{ scale: [1, 1.1, 1], rotate: character.direction === 'left' ? -15 : character.direction === 'right' ? 15 : 0 }}
          >
            <Rocket className={cn(
              "w-6 h-6 text-white transition-transform duration-200",
              {
                "rotate-0": character.direction === 'up',
                "rotate-180": character.direction === 'down',
                "-rotate-90": character.direction === 'left',
                "rotate-90": character.direction === 'right'
              }
            )} />
            
            {/* Particle trail */}
            {gameStarted && (
              <motion.div 
                className="absolute -z-10 w-14 h-14 rounded-full bg-gradient-to-r from-lime/20 to-teal/20 blur-sm"
                animate={{ 
                  scale: [1, 0.8, 0.6, 0.4, 0.2, 0],
                  opacity: [0.7, 0.5, 0.3, 0.1, 0]
                }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            )}
          </motion.div>
        )}
        
        {/* Items */}
        {items.map(item => (
          <motion.div
            key={item.id}
            className={cn(
              "absolute w-12 h-12 rounded-lg flex items-center justify-center",
              item.collected ? "opacity-30" : "opacity-100"
            )}
            style={{ 
              left: `${item.x}%`, 
              top: `${item.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0 }}
            animate={{ 
              scale: item.collected ? [1, 1.5, 0] : [0.9, 1.1, 0.9],
              rotate: item.collected ? [0, 180, 360] : [0, 10, -10, 0]
            }}
            transition={item.collected 
              ? { duration: 0.5 } 
              : { duration: 2, repeat: Infinity, repeatType: "reverse" }
            }
          >
            <div className={cn(
              "w-full h-full rounded-lg flex items-center justify-center",
              item.type === 'code' ? "bg-lime/20 border border-lime/40" :
              item.type === 'security' ? "bg-purple/20 border border-purple/40" :
              item.type === 'database' ? "bg-teal/20 border border-teal/40" :
              "bg-gold/20 border border-gold/40"
            )}>
              {item.icon}
            </div>
          </motion.div>
        ))}
        
        {/* Particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [0, -20, -40],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
        
        {/* Fact popup */}
        <motion.div
          className="absolute left-1/2 bottom-4 transform -translate-x-1/2 w-4/5 py-3 px-5 rounded-lg backdrop-blur-md bg-gradient-to-r from-charcoal/80 to-inkyblack/80 border border-white/10 text-white text-center"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: showFact ? 0 : 100, opacity: showFact ? 1 : 0 }}
          transition={{ duration: 0.4, type: "spring" }}
        >
          <p>{facts[factIndex]}</p>
        </motion.div>
      </motion.div>
      
      {/* Mobile controls */}
      <div className="md:hidden mt-4 grid grid-cols-3 gap-2 max-w-xs mx-auto">
        <div className="col-start-2">
          <button 
            className="w-full h-12 rounded-md bg-charcoal/50 flex items-center justify-center"
            onTouchStart={() => setKeys(prev => ({ ...prev, ArrowUp: true }))}
            onTouchEnd={() => setKeys(prev => ({ ...prev, ArrowUp: false }))}
          >
            <motion.div 
              whileTap={{ scale: 0.9 }}
              className="text-white"
            >
              ⬆️
            </motion.div>
          </button>
        </div>
        <div className="col-start-1 col-span-1 row-start-2">
          <button 
            className="w-full h-12 rounded-md bg-charcoal/50 flex items-center justify-center"
            onTouchStart={() => setKeys(prev => ({ ...prev, ArrowLeft: true }))}
            onTouchEnd={() => setKeys(prev => ({ ...prev, ArrowLeft: false }))}
          >
            <motion.div 
              whileTap={{ scale: 0.9 }}
              className="text-white"
            >
              ⬅️
            </motion.div>
          </button>
        </div>
        <div className="col-start-3 col-span-1 row-start-2">
          <button 
            className="w-full h-12 rounded-md bg-charcoal/50 flex items-center justify-center"
            onTouchStart={() => setKeys(prev => ({ ...prev, ArrowRight: true }))}
            onTouchEnd={() => setKeys(prev => ({ ...prev, ArrowRight: false }))}
          >
            <motion.div 
              whileTap={{ scale: 0.9 }}
              className="text-white"
            >
              ➡️
            </motion.div>
          </button>
        </div>
        <div className="col-start-2 row-start-2">
          <button 
            className="w-full h-12 rounded-md bg-charcoal/50 flex items-center justify-center"
            onTouchStart={() => setKeys(prev => ({ ...prev, ArrowDown: true }))}
            onTouchEnd={() => setKeys(prev => ({ ...prev, ArrowDown: false }))}
          >
            <motion.div 
              whileTap={{ scale: 0.9 }}
              className="text-white"
            >
              ⬇️
            </motion.div>
          </button>
        </div>
      </div>
      
      {/* Game instructions */}
      <motion.div 
        className="mt-4 text-center text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p>Use arrow keys to move or touch/drag on mobile</p>
        <p>Collect all items to discover my core skills</p>
      </motion.div>
    </div>
  );
};

export default AboutMiniGame;
