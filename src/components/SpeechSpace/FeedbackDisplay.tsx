import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles, Heart, ThumbsUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FeedbackDisplayProps {
  score: number | null;
  onContinue: () => void;
  isVisible: boolean;
}

export function FeedbackDisplay({ score, onContinue, isVisible }: FeedbackDisplayProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible && score !== null && score >= 8) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, score]);

  const getFeedback = () => {
    if (score === null) return null;
    
    if (score >= 9) {
      return {
        emoji: '🌟',
        title: 'Amazing!',
        message: "You're a superstar!",
        color: 'from-yellow-400 to-orange-400',
        stars: 3,
        icon: Sparkles
      };
    } else if (score >= 7) {
      return {
        emoji: '🎉',
        title: 'Great Job!',
        message: 'Keep up the good work!',
        color: 'from-green-400 to-emerald-400',
        stars: 2,
        icon: ThumbsUp
      };
    } else if (score >= 5) {
      return {
        emoji: '💪',
        title: 'Almost There!',
        message: "You're getting better!",
        color: 'from-blue-400 to-cyan-400',
        stars: 1,
        icon: Heart
      };
    } else {
      return {
        emoji: '🌱',
        title: 'Keep Trying!',
        message: 'Practice makes perfect!',
        color: 'from-purple-400 to-pink-400',
        stars: 0,
        icon: Heart
      };
    }
  };

  const feedback = getFeedback();

  return (
    <AnimatePresence>
      {isVisible && feedback && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          {/* Confetti */}
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: -50,
                    rotate: 0,
                  }}
                  animate={{
                    y: window.innerHeight + 50,
                    rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    delay: Math.random() * 0.5,
                    ease: "linear"
                  }}
                >
                  {['⭐', '🌟', '✨', '🎉', '🎊', '💫', '🌈'][Math.floor(Math.random() * 7)]}
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className={`
              relative bg-gradient-to-br ${feedback.color} 
              rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center text-white
            `}
          >
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 text-4xl opacity-30">✨</div>
            <div className="absolute top-4 right-4 text-4xl opacity-30">✨</div>
            <div className="absolute bottom-4 left-4 text-4xl opacity-30">🌟</div>
            <div className="absolute bottom-4 right-4 text-4xl opacity-30">🌟</div>

            {/* Main content */}
            <motion.div
              className="text-7xl mb-4"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              {feedback.emoji}
            </motion.div>

            <h2 className="text-3xl font-bold mb-2">{feedback.title}</h2>
            <p className="text-lg opacity-90 mb-4">{feedback.message}</p>

            {/* Stars earned */}
            <div className="flex justify-center gap-2 mb-6">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ 
                    scale: i < feedback.stars ? 1 : 0.5, 
                    rotate: 0 
                  }}
                  transition={{ delay: 0.5 + i * 0.2, type: "spring" }}
                >
                  <Star 
                    className={`w-10 h-10 ${
                      i < feedback.stars 
                        ? 'text-yellow-300 fill-yellow-300' 
                        : 'text-white/30'
                    }`} 
                  />
                </motion.div>
              ))}
            </div>

            {/* Score */}
            <div className="bg-white/20 rounded-2xl p-3 mb-6">
              <span className="text-2xl font-bold">{score}/10</span>
            </div>

            {/* Continue button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onContinue}
              className="bg-white text-gray-800 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              Continue →
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
