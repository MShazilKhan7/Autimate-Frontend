import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface SpaceCharacterProps {
  isSpeaking: boolean;
  isListening: boolean;
  mood: 'happy' | 'encouraging' | 'celebrating' | 'thinking' | 'idle';
  message?: string;
}

export function SpaceCharacter({ isSpeaking, isListening, mood, message }: SpaceCharacterProps) {
  const [blinkState, setBlinkState] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState(true);
      setTimeout(() => setBlinkState(false), 150);
    }, 3000);
    return () => clearInterval(blinkInterval);
  }, []);

  const getMouthShape = () => {
    if (isSpeaking) {
      return (
        <motion.ellipse
          cx="100"
          cy="130"
          rx="20"
          ry="15"
          fill="#FF6B6B"
          animate={{
            ry: [15, 8, 15, 12, 15],
            rx: [20, 15, 20, 18, 20],
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      );
    }
    
    if (mood === 'celebrating') {
      return (
        <motion.path
          d="M 75 125 Q 100 155 125 125"
          stroke="#FF6B6B"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      );
    }
    
    if (mood === 'encouraging') {
      return (
        <path
          d="M 80 125 Q 100 145 120 125"
          stroke="#FF6B6B"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
      );
    }

    if (mood === 'thinking') {
      return (
        <ellipse cx="100" cy="128" rx="8" ry="6" fill="#FF6B6B" />
      );
    }
    
    return (
      <path
        d="M 82 125 Q 100 140 118 125"
        stroke="#FF6B6B"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
    );
  };

  const getEyeExpression = () => {
    if (blinkState) {
      return (
        <>
          <path d="M 70 95 L 85 95" stroke="#4A5568" strokeWidth="4" strokeLinecap="round" />
          <path d="M 115 95 L 130 95" stroke="#4A5568" strokeWidth="4" strokeLinecap="round" />
        </>
      );
    }

    if (mood === 'celebrating') {
      return (
        <>
          <path d="M 68 90 L 78 100 L 88 90" stroke="#4A5568" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 112 90 L 122 100 L 132 90" stroke="#4A5568" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      );
    }

    return (
      <>
        <motion.circle
          cx="78"
          cy="95"
          r="12"
          fill="white"
          stroke="#4A5568"
          strokeWidth="2"
        />
        <motion.circle
          cx="78"
          cy="95"
          r="6"
          fill="#4A5568"
          animate={isListening ? { cx: [78, 80, 78] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.circle
          cx="122"
          cy="95"
          r="12"
          fill="white"
          stroke="#4A5568"
          strokeWidth="2"
        />
        <motion.circle
          cx="122"
          cy="95"
          r="6"
          fill="#4A5568"
          animate={isListening ? { cx: [122, 124, 122] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        />
        {/* Eye sparkles */}
        <circle cx="74" cy="91" r="2" fill="white" />
        <circle cx="118" cy="91" r="2" fill="white" />
      </>
    );
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Speech bubble */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className="absolute -top-16 bg-white rounded-2xl px-4 py-2 shadow-lg border-2 border-primary/20 max-w-[200px] text-center"
          >
            <p className="text-sm font-medium text-foreground">{message}</p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-primary/20 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character */}
      <motion.div
        animate={
          mood === 'celebrating' 
            ? { y: [0, -10, 0], rotate: [0, 5, -5, 0] }
            : isListening 
            ? { scale: [1, 1.02, 1] }
            : { y: [0, -3, 0] }
        }
        transition={{
          duration: mood === 'celebrating' ? 0.5 : 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Body */}
          <motion.ellipse
            cx="100"
            cy="160"
            rx="45"
            ry="30"
            fill="url(#bodyGradient)"
          />
          
          {/* Head */}
          <motion.circle
            cx="100"
            cy="100"
            r="55"
            fill="url(#headGradient)"
            stroke="#FFB347"
            strokeWidth="3"
          />
          
          {/* Cheeks */}
          <circle cx="55" cy="110" r="12" fill="#FFB6C1" opacity="0.6" />
          <circle cx="145" cy="110" r="12" fill="#FFB6C1" opacity="0.6" />
          
          {/* Eyes */}
          {getEyeExpression()}
          
          {/* Eyebrows */}
          <motion.path
            d="M 65 78 Q 78 72 88 78"
            stroke="#4A5568"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            animate={mood === 'encouraging' ? { d: "M 65 75 Q 78 68 88 75" } : {}}
          />
          <motion.path
            d="M 112 78 Q 122 72 135 78"
            stroke="#4A5568"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            animate={mood === 'encouraging' ? { d: "M 112 75 Q 122 68 135 75" } : {}}
          />
          
          {/* Mouth */}
          {getMouthShape()}
          
          {/* Antenna */}
          <motion.line
            x1="100"
            y1="45"
            x2="100"
            y2="25"
            stroke="#FFB347"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{ x2: [100, 102, 98, 100] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle
            cx="100"
            cy="20"
            r="8"
            fill="#FF6B6B"
            animate={{ 
              scale: [1, 1.2, 1],
              fill: ['#FF6B6B', '#FFD93D', '#FF6B6B']
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          
          {/* Arms */}
          <motion.ellipse
            cx="45"
            cy="145"
            rx="15"
            ry="10"
            fill="url(#bodyGradient)"
            animate={mood === 'celebrating' ? { rotate: [0, -20, 0] } : {}}
            style={{ transformOrigin: '55px 145px' }}
          />
          <motion.ellipse
            cx="155"
            cy="145"
            rx="15"
            ry="10"
            fill="url(#bodyGradient)"
            animate={mood === 'celebrating' ? { rotate: [0, 20, 0] } : {}}
            style={{ transformOrigin: '145px 145px' }}
          />
          
          {/* Gradients */}
          <defs>
            <radialGradient id="headGradient" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#FFE4B5" />
              <stop offset="100%" stopColor="#FFD699" />
            </radialGradient>
            <radialGradient id="bodyGradient" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#87CEEB" />
              <stop offset="100%" stopColor="#5DADE2" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Celebration sparkles */}
      <AnimatePresence>
        {mood === 'celebrating' && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.cos(i * 60 * Math.PI / 180) * 80,
                  y: Math.sin(i * 60 * Math.PI / 180) * 80 - 20,
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              >
                {['⭐', '✨', '🌟', '💫', '🎉', '🎊'][i]}
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
