// components/Therapy/exercises/CheckpointExercise.tsx
/**
 * CHECKPOINT — end-of-phase milestone
 * A celebration / review screen summarising progress so far.
 * No recording required — user reads a summary then continues.
 */
import { motion } from "framer-motion";
import { Trophy, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModuleStep } from "@/api/therapy";

interface CheckpointExerciseProps {
  step: ModuleStep;
  accentColor: string;
  completedCount: number;
  totalSteps: number;
  onComplete: () => void;   // marks as done & advances
}

const confettiColors = [
  "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#ec4899",
];

function Confetti() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            y: -20,
            x: `${Math.random() * 100}%`,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: "110%",
            rotate: Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1),
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 1.5,
            delay: Math.random() * 0.8,
            ease: "easeIn",
            repeat: Infinity,
            repeatDelay: Math.random() * 3,
          }}
          style={{
            position: "absolute",
            width: 8 + Math.random() * 8,
            height: 8 + Math.random() * 8,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            background:
              confettiColors[Math.floor(Math.random() * confettiColors.length)],
          }}
        />
      ))}
    </div>
  );
}

export default function CheckpointExercise({
  step,
  accentColor,
  completedCount,
  totalSteps,
  onComplete,
}: CheckpointExerciseProps) {
  const phaseName = step.config?.prompt ?? step.title;

  return (
    <div className="relative flex flex-col items-center text-center py-10 gap-8 overflow-hidden">
      <Confetti />

      {/* trophy */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl"
        style={{ background: accentColor }}
      >
        <Trophy className="w-12 h-12 text-white" />
      </motion.div>

      {/* headline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
          Phase Complete! 🎉
        </h2>
        {phaseName && (
          <p className="text-muted-foreground text-base">{phaseName}</p>
        )}
      </motion.div>

      {/* stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="grid grid-cols-2 gap-4 w-full max-w-xs"
      >
        <div
          className="rounded-2xl p-4 text-white"
          style={{ background: accentColor }}
        >
          <p className="text-3xl font-extrabold">{completedCount}</p>
          <p className="text-xs opacity-80 uppercase tracking-wide">
            Steps done
          </p>
        </div>
        <div className="rounded-2xl p-4 bg-muted/10 border border-muted/20">
          <p className="text-3xl font-extrabold text-foreground">
            {totalSteps}
          </p>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Total steps
          </p>
        </div>
      </motion.div>

      {/* stars */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-2"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.15, type: "spring" }}
          >
            <Star
              className="w-8 h-8 fill-amber-400 text-amber-400"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* cta */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
      >
        <Button
          onClick={onComplete}
          className="rounded-2xl gap-2 px-8 py-5 text-white font-bold shadow-lg"
          style={{ background: accentColor }}
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
}