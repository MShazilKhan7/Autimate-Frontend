import { motion } from 'framer-motion';
import { Lock, Star, CheckCircle, ChevronRight } from 'lucide-react';

interface Level {
  id: number;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  starsRequired: number;
}

interface LevelSelectorProps {
  levels: Level[];
  currentLevel: number;
  totalStars: number;
  completedLevels: number[];
  onSelectLevel: (levelId: number) => void;
}

export function LevelSelector({
  levels, currentLevel, totalStars, completedLevels, onSelectLevel,
}: LevelSelectorProps) {
  return (
    <div className="space-y-5">
      {/* Stars header */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg rounded-2xl px-5 py-3">
        <span className="text-sm font-bold text-muted-foreground">Your Stars</span>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-full">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span className="font-extrabold text-amber-700">{totalStars} collected</span>
        </div>
      </div>

      {/* Level grid */}
      <div className="grid grid-cols-2 gap-4">
        {levels.map((level, index) => {
          const isUnlocked = totalStars >= level.starsRequired;
          const isCompleted = completedLevels.includes(level.id);
          const isActive = currentLevel === level.id;

          return (
            <motion.button
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={isUnlocked ? { scale: 1.04, y: -3 } : {}}
              whileTap={isUnlocked ? { scale: 0.97 } : {}}
              onClick={() => isUnlocked && onSelectLevel(level.id)}
              disabled={!isUnlocked}
              className={`relative p-5 rounded-3xl border-2 transition-all duration-300 text-left overflow-hidden shadow-lg ${
                isActive
                  ? 'border-primary bg-primary/5 shadow-primary/20'
                  : isUnlocked
                  ? 'border-white/60 bg-white/80 backdrop-blur-xl hover:border-primary/40 hover:shadow-xl'
                  : 'border-muted/20 bg-white/40 opacity-60 cursor-not-allowed'
              }`}
            >
              {/* Completed badge */}
              {isCompleted && (
                <div className="absolute top-3 right-3 bg-emerald-500 rounded-full p-1 shadow-md shadow-emerald-500/30">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
              )}

              {/* Lock overlay */}
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-3xl">
                  <div className="flex flex-col items-center gap-1">
                    <div className="bg-muted rounded-full p-3 shadow-md">
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground font-semibold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      {level.starsRequired} needed
                    </div>
                  </div>
                </div>
              )}

              <div className="text-4xl mb-3">{level.icon}</div>
              <h3 className="font-bold text-foreground text-sm mb-1">{level.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{level.description}</p>

              {isUnlocked && (
                <div className={`mt-3 flex items-center gap-1 text-xs font-bold ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {isActive ? 'Selected' : 'Tap to start'}
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
