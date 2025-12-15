import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpeakingCharacterProps {
  word: string;
  isPlaying: boolean;
  onPlayComplete?: () => void;
}

// Viseme shapes for mouth animation
type Viseme = 'closed' | 'open' | 'wide' | 'rounded' | 'smile';

const visemeShapes: Record<Viseme, { d: string; lipWidth: number; lipHeight: number }> = {
  closed: {
    d: 'M 35 75 Q 50 78 65 75',
    lipWidth: 30,
    lipHeight: 2,
  },
  open: {
    d: 'M 35 72 Q 50 85 65 72',
    lipWidth: 28,
    lipHeight: 15,
  },
  wide: {
    d: 'M 32 70 Q 50 90 68 70',
    lipWidth: 36,
    lipHeight: 20,
  },
  rounded: {
    d: 'M 40 72 Q 50 82 60 72 Q 55 78 50 80 Q 45 78 40 72',
    lipWidth: 20,
    lipHeight: 12,
  },
  smile: {
    d: 'M 35 74 Q 50 82 65 74',
    lipWidth: 30,
    lipHeight: 8,
  },
};

// Map letters to visemes (simplified)
const getVisemeForLetter = (letter: string): Viseme => {
  const l = letter.toLowerCase();
  if ('aeiou'.includes(l)) {
    if ('ao'.includes(l)) return 'wide';
    if ('e'.includes(l)) return 'smile';
    if ('iu'.includes(l)) return 'rounded';
    return 'open';
  }
  if ('bmp'.includes(l)) return 'closed';
  if ('fv'.includes(l)) return 'smile';
  if ('ouw'.includes(l)) return 'rounded';
  if ('lr'.includes(l)) return 'open';
  return 'closed';
};

export default function SpeakingCharacter({ word, isPlaying, onPlayComplete }: SpeakingCharacterProps) {
  const [currentViseme, setCurrentViseme] = useState<Viseme>('smile');
  const [currentLetterIndex, setCurrentLetterIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);

  const animateSpeech = useCallback(async () => {
    if (!word || isAnimating) return;
    
    setIsAnimating(true);
    const letters = word.split('');
    
    for (let i = 0; i < letters.length; i++) {
      setCurrentLetterIndex(i);
      const viseme = getVisemeForLetter(letters[i]);
      setCurrentViseme(viseme);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Return to smile
    setCurrentViseme('smile');
    setCurrentLetterIndex(-1);
    setIsAnimating(false);
    onPlayComplete?.();
  }, [word, isAnimating, onPlayComplete]);

  useEffect(() => {
    if (isPlaying && !isAnimating) {
      animateSpeech();
    }
  }, [isPlaying, animateSpeech, isAnimating]);

  const mouthShape = visemeShapes[currentViseme];

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* Character Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Character SVG */}
        <svg
          viewBox="0 0 100 120"
          className="w-48 h-56 md:w-64 md:h-72"
          aria-label="Friendly speaking character"
        >
          {/* Background glow */}
          <defs>
            <radialGradient id="faceGlow" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="hsl(56, 84%, 89%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(56, 84%, 89%)" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(30, 50%, 35%)" />
              <stop offset="100%" stopColor="hsl(30, 45%, 25%)" />
            </linearGradient>
            <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(35, 70%, 80%)" />
              <stop offset="100%" stopColor="hsl(30, 60%, 75%)" />
            </linearGradient>
          </defs>

          {/* Glow effect */}
          <circle cx="50" cy="50" r="55" fill="url(#faceGlow)" />

          {/* Hair - back */}
          <ellipse cx="50" cy="30" rx="38" ry="28" fill="url(#hairGradient)" />
          
          {/* Ears */}
          <ellipse cx="15" cy="55" rx="6" ry="8" fill="url(#skinGradient)" />
          <ellipse cx="85" cy="55" rx="6" ry="8" fill="url(#skinGradient)" />

          {/* Face */}
          <ellipse cx="50" cy="55" rx="35" ry="38" fill="url(#skinGradient)" />

          {/* Hair - front/bangs */}
          <path
            d="M 20 35 Q 30 15 50 12 Q 70 15 80 35 Q 70 28 50 25 Q 30 28 20 35"
            fill="url(#hairGradient)"
          />

          {/* Eyebrows */}
          <motion.path
            d="M 28 42 Q 35 40 42 42"
            stroke="hsl(30, 45%, 25%)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            animate={{ y: isPlaying ? -1 : 0 }}
          />
          <motion.path
            d="M 58 42 Q 65 40 72 42"
            stroke="hsl(30, 45%, 25%)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            animate={{ y: isPlaying ? -1 : 0 }}
          />

          {/* Eyes */}
          <g>
            {/* Left eye */}
            <ellipse cx="35" cy="52" rx="8" ry="9" fill="white" />
            <motion.ellipse
              cx="35"
              cy="53"
              rx="5"
              ry="5"
              fill="hsl(200, 60%, 30%)"
              animate={{ 
                cy: isPlaying ? [53, 52, 53] : 53,
              }}
              transition={{ duration: 0.3, repeat: isPlaying ? Infinity : 0, repeatDelay: 1 }}
            />
            <circle cx="37" cy="51" r="2" fill="white" />
            
            {/* Right eye */}
            <ellipse cx="65" cy="52" rx="8" ry="9" fill="white" />
            <motion.ellipse
              cx="65"
              cy="53"
              rx="5"
              ry="5"
              fill="hsl(200, 60%, 30%)"
              animate={{ 
                cy: isPlaying ? [53, 52, 53] : 53,
              }}
              transition={{ duration: 0.3, repeat: isPlaying ? Infinity : 0, repeatDelay: 1 }}
            />
            <circle cx="67" cy="51" r="2" fill="white" />
          </g>

          {/* Cheeks (blush) */}
          <ellipse cx="25" cy="65" rx="8" ry="5" fill="hsl(350, 60%, 85%)" opacity="0.6" />
          <ellipse cx="75" cy="65" rx="8" ry="5" fill="hsl(350, 60%, 85%)" opacity="0.6" />

          {/* Nose */}
          <ellipse cx="50" cy="62" rx="3" ry="4" fill="hsl(30, 50%, 70%)" />

          {/* Mouth - Animated */}
          <g className="mouth">
            {/* Outer lip line */}
            <motion.path
              d={mouthShape.d}
              stroke="hsl(350, 40%, 55%)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="hsl(350, 50%, 65%)"
              initial={false}
              animate={{ d: mouthShape.d }}
              transition={{ duration: 0.1, ease: 'easeOut' }}
            />
            
            {/* Inner mouth (when open) */}
            <AnimatePresence>
              {(currentViseme === 'open' || currentViseme === 'wide' || currentViseme === 'rounded') && (
                <motion.ellipse
                  cx="50"
                  cy="76"
                  rx={mouthShape.lipWidth / 3}
                  ry={mouthShape.lipHeight / 2.5}
                  fill="hsl(350, 30%, 25%)"
                  initial={{ opacity: 0, ry: 0 }}
                  animate={{ opacity: 1, ry: mouthShape.lipHeight / 2.5 }}
                  exit={{ opacity: 0, ry: 0 }}
                  transition={{ duration: 0.1 }}
                />
              )}
            </AnimatePresence>

            {/* Tongue hint for wide open */}
            <AnimatePresence>
              {currentViseme === 'wide' && (
                <motion.ellipse
                  cx="50"
                  cy="80"
                  rx="8"
                  ry="4"
                  fill="hsl(350, 50%, 60%)"
                  initial={{ opacity: 0, ry: 0 }}
                  animate={{ opacity: 1, ry: 4 }}
                  exit={{ opacity: 0, ry: 0 }}
                  transition={{ duration: 0.1 }}
                />
              )}
            </AnimatePresence>
          </g>

          {/* Teeth hint for smile */}
          {currentViseme === 'smile' && (
            <rect x="42" y="74" width="16" height="4" rx="2" fill="white" opacity="0.8" />
          )}
        </svg>

        {/* Speaking indicator */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute -right-2 -top-2"
            >
              <div className="flex gap-1 bg-card px-3 py-2 rounded-full shadow-lg">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ 
                      scaleY: [1, 1.8, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Phoneme display */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 flex flex-wrap justify-center gap-2"
      >
        {word.split('').map((letter, index) => (
          <motion.span
            key={index}
            className={`
              px-3 py-1.5 rounded-xl text-lg font-bold transition-all duration-200
              ${currentLetterIndex === index 
                ? 'bg-primary text-primary-foreground scale-125 shadow-lg' 
                : 'bg-secondary-soft text-foreground'
              }
            `}
            animate={{
              scale: currentLetterIndex === index ? 1.25 : 1,
              y: currentLetterIndex === index ? -4 : 0,
            }}
          >
            {letter.toUpperCase()}
          </motion.span>
        ))}
      </motion.div>

      {/* Instruction text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-muted-foreground text-center text-sm"
      >
        {isPlaying ? 'Watch my mouth!' : 'Tap play to see how to say it'}
      </motion.p>
    </div>
  );
}
