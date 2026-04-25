import { motion } from 'framer-motion';
import { Star, Trophy, Zap, Flame } from 'lucide-react';

interface ProgressRewardsProps {
  currentIndex: number;
  totalItems: number;
  starsEarned: number;
  levelName: string;
  streak: number;
}

export function ProgressRewards({
  currentIndex, totalItems, starsEarned, levelName, streak,
}: ProgressRewardsProps) {
  const progressPercent = (currentIndex / totalItems) * 100;

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <Trophy className="w-4 h-4" />
          </div>
          <span className="font-bold text-foreground text-sm">{levelName}</span>
        </div>
        <span className="text-sm font-bold text-muted-foreground bg-muted/20 px-3 py-1 rounded-full">
          {currentIndex + 1} / {totalItems}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2.5 bg-muted/20 rounded-full overflow-hidden mb-4">
        <motion.div
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-soft"
        />
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3">
        {/* Stars */}
        <motion.div
          animate={starsEarned > 0 ? { scale: [1, 1.15, 1] } : {}}
          key={starsEarned}
          className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full"
        >
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span className="font-extrabold text-amber-700 text-sm">{starsEarned}</span>
        </motion.div>

        {/* Streak */}
        {streak > 1 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-full"
          >
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span className="font-extrabold text-rose-700 text-sm">{streak}x Streak!</span>
          </motion.div>
        )}

        {/* Progress dots */}
        <div className="flex gap-1.5 ml-auto">
          {[...Array(Math.min(totalItems, 8))].map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i < currentIndex
                  ? 'w-2 h-2 bg-emerald-500'
                  : i === currentIndex
                  ? 'w-3 h-3 bg-primary shadow-sm shadow-primary/30'
                  : 'w-2 h-2 bg-muted/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
