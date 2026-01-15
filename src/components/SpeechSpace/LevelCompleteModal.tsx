import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LevelCompleteModalProps {
  isOpen: boolean;
  levelName: string;
  starsEarned: number;
  totalPossibleStars: number;
  onNextLevel: () => void;
  onReplay: () => void;
  hasNextLevel: boolean;
}

export function LevelCompleteModal({
  isOpen,
  levelName,
  starsEarned,
  totalPossibleStars,
  onNextLevel,
  onReplay,
  hasNextLevel
}: LevelCompleteModalProps) {
  const percentage = Math.round((starsEarned / totalPossibleStars) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          {/* Celebration confetti */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -50,
                  rotate: 0,
                  scale: 0.5 + Math.random() * 0.5,
                }}
                animate={{
                  y: window.innerHeight + 50,
                  rotate: 720 * (Math.random() > 0.5 ? 1 : -1),
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 1,
                  ease: "linear"
                }}
              >
                {['🎉', '🎊', '⭐', '🌟', '✨', '🏆', '🎈', '🎀', '💫', '🌈'][Math.floor(Math.random() * 10)]}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 50 }}
            className="bg-gradient-to-br from-primary via-primary/90 to-accent rounded-3xl p-8 shadow-2xl max-w-md w-full text-center text-white relative overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-6xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                >
                  ⭐
                </div>
              ))}
            </div>

            {/* Trophy */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative z-10"
            >
              <div className="text-8xl mb-4">🏆</div>
            </motion.div>

            <h2 className="text-3xl font-bold mb-2 relative z-10">Level Complete!</h2>
            <p className="text-xl opacity-90 mb-6 relative z-10">{levelName}</p>

            {/* Stats */}
            <div className="bg-white/20 rounded-2xl p-4 mb-6 relative z-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5 + i * 0.2, type: "spring" }}
                  >
                    <Star 
                      className={`w-10 h-10 ${
                        i < Math.ceil(starsEarned / (totalPossibleStars / 3))
                          ? 'text-yellow-300 fill-yellow-300' 
                          : 'text-white/30'
                      }`} 
                    />
                  </motion.div>
                ))}
              </div>
              <div className="text-2xl font-bold">{starsEarned} Stars Earned!</div>
              <div className="text-sm opacity-80">{percentage}% Score</div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 relative z-10">
              {hasNextLevel && (
                <Button
                  onClick={onNextLevel}
                  className="w-full bg-white text-primary hover:bg-white/90 font-bold text-lg py-6"
                >
                  Next Level <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
              <Button
                onClick={onReplay}
                variant="outline"
                className="w-full border-white/50 text-white hover:bg-white/20 font-medium"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Replay Level
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
