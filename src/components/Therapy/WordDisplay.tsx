import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

interface WordDisplayProps {
  word: string;
  image: string;
  category: string;
  phonemes: string[];
  score?: number;
  isCorrect?: string;
}

export default function WordDisplay({ word, image, category, phonemes, score, isCorrect }: WordDisplayProps) {
  const hasScore = score !== undefined;
  const isGood = isCorrect && isCorrect !== 'bad';

  return (
    <div className="flex flex-col items-center text-center space-y-5">
      {/* Image */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="relative"
      >
        <div className={`relative rounded-3xl overflow-hidden shadow-2xl ring-4 transition-all duration-500 ${
          hasScore
            ? isGood
              ? 'ring-emerald-400 shadow-emerald-200'
              : 'ring-rose-400 shadow-rose-200'
            : 'ring-white shadow-primary/10'
        }`}>
          <img
            src={image}
            alt={word}
            className="w-44 h-44 object-cover"
          />
          {/* Category chip on image */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
            <span className="text-white text-xs font-bold capitalize tracking-wide">{category}</span>
          </div>
        </div>
      </motion.div>

      {/* Word */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-5xl sm:text-6xl font-extrabold text-foreground tracking-tight"
      >
        {word}
      </motion.h2>

      {/* Phonemes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="flex items-center gap-1.5 flex-wrap justify-center"
      >
        {phonemes.map((p, i) => (
          <span key={i} className="flex items-center gap-1">
            <span className="bg-primary/10 text-primary text-sm font-mono font-bold px-3 py-1 rounded-lg">
              {p}
            </span>
            {i < phonemes.length - 1 && (
              <span className="text-muted-foreground text-xs">·</span>
            )}
          </span>
        ))}
      </motion.div>

      {/* Score Badge */}
      {hasScore && (
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-base shadow-lg ${
            isGood
              ? 'bg-emerald-500 text-white shadow-emerald-500/30'
              : 'bg-rose-500 text-white shadow-rose-500/30'
          }`}
        >
          {isGood
            ? <CheckCircle2 className="w-5 h-5" />
            : <XCircle className="w-5 h-5" />
          }
          <span>{score}% accuracy</span>
        </motion.div>
      )}
    </div>
  );
}
