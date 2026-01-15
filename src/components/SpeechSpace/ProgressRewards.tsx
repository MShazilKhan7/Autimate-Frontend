import { motion } from 'framer-motion';
import { Star, Trophy, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ProgressRewardsProps {
  currentIndex: number;
  totalItems: number;
  starsEarned: number;
  levelName: string;
  streak: number;
}

export function ProgressRewards({ 
  currentIndex, 
  totalItems, 
  starsEarned, 
  levelName,
  streak 
}: ProgressRewardsProps) {
  const progressPercent = ((currentIndex) / totalItems) * 100;

  return (
    <div className="bg-card rounded-2xl p-4 shadow-lg border border-primary/10">
      {/* Level and progress */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          <span className="font-medium text-foreground">{levelName}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {totalItems}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <Progress value={progressPercent} className="h-3" />
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between">
        {/* Stars earned this session */}
        <motion.div 
          className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full"
          animate={starsEarned > 0 ? { scale: [1, 1.1, 1] } : {}}
          key={starsEarned}
        >
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-bold text-yellow-700 text-sm">{starsEarned}</span>
        </motion.div>

        {/* Streak indicator */}
        {streak > 1 && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full"
          >
            <Zap className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="font-bold text-orange-700 text-sm">{streak}x Streak!</span>
          </motion.div>
        )}

        {/* Progress dots */}
        <div className="flex gap-1">
          {[...Array(Math.min(totalItems, 5))].map((_, i) => (
            <motion.div
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${
                i < currentIndex 
                  ? 'bg-green-500' 
                  : i === currentIndex 
                    ? 'bg-primary' 
                    : 'bg-muted'
              }`}
              animate={i === currentIndex ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
