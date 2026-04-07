import { motion } from 'framer-motion';

interface WordDisplayProps {
  word: string;
  image: string;
  category: string;
  phonemes: string[];
  score?: number;
  isCorrect?: string;
}

export default function WordDisplay({ word, image, category, phonemes, score, isCorrect }: WordDisplayProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      {/* Image */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="relative"
      >
        <img
          src={image}
          alt={word}
          className="w-36 h-36 sm:w-44 sm:h-44 object-cover rounded-3xl shadow-lg"
        />
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-card text-xs font-medium px-3 py-1 rounded-full shadow capitalize text-muted-foreground">
          {category}
        </span>
      </motion.div>

      {/* Word */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl sm:text-5xl font-bold text-primary"
      >
        {word}
      </motion.h2>

      {/* Phoneme Preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-1"
      >
        {phonemes.map((p, i) => (
          <span key={i} className="flex items-center gap-1">
            <span className="bg-secondary/50 text-foreground text-sm font-mono px-2 py-0.5 rounded-md">
              {p}
            </span>
            {i < phonemes.length - 1 && (
              <span className="text-muted-foreground text-xs">·</span>
            )}
          </span>
        ))}
      </motion.div>

      {/* Score Badge (shown after recording) */}
      {score !== undefined && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-lg ${
            isCorrect
              ? 'bg-primary-soft text-primary'
              : 'bg-accent/20 text-destructive'
          }`}
        >
          <span>{isCorrect ? '✓' : '✗'}</span>
          <span>{score}%</span>
        </motion.div>
      )}
    </div>
  );
}
