import { motion } from 'framer-motion';
import { Lock, Star, CheckCircle } from 'lucide-react';

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
  levels, 
  currentLevel, 
  totalStars, 
  completedLevels,
  onSelectLevel 
}: LevelSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <span className="font-bold text-yellow-700">{totalStars} Stars</span>
        </div>
      </div>

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
              transition={{ delay: index * 0.1 }}
              onClick={() => isUnlocked && onSelectLevel(level.id)}
              disabled={!isUnlocked}
              className={`
                relative p-4 rounded-2xl border-3 transition-all duration-300
                ${isActive 
                  ? 'border-primary bg-primary/10 shadow-lg scale-105' 
                  : isUnlocked 
                    ? 'border-secondary bg-card hover:border-primary/50 hover:shadow-md' 
                    : 'border-muted bg-muted/30 opacity-60'
                }
              `}
            >
              {/* Completed badge */}
              {isCompleted && (
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Lock icon */}
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-2xl">
                  <div className="bg-muted rounded-full p-3">
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
              )}

              <div className="text-4xl mb-2">{level.icon}</div>
              <h3 className="font-bold text-foreground text-sm">{level.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{level.description}</p>
              
              {!isUnlocked && (
                <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <Star className="w-3 h-3" />
                  <span>{level.starsRequired} stars needed</span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
