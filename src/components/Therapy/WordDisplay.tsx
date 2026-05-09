import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WordDisplayProps {
  word: string;
  /** Prefer `images`; falls back to legacy single `image`. */
  images?: string[];
  image?: string;
  category: string;
  phonemes: string[];
  score?: number;
  isCorrect?: string;
  showWord?: boolean;
  showPhonemes?: boolean;
}

export default function WordDisplay({
  word,
  images,
  image,
  category,
  phonemes,
  score,
  isCorrect,
  showWord = true,
  showPhonemes = true,
}: WordDisplayProps) {
  const list = images?.length ? images : image ? [image] : [];
  const hasScore = score !== undefined;
  const isGood = isCorrect && isCorrect !== 'bad';

  return (
    <div className="flex flex-col items-center text-center space-y-5 w-full max-w-xl mx-auto">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="relative w-full"
      >
        <div
          className={cn(
            'relative rounded-3xl overflow-hidden shadow-2xl ring-4 transition-all duration-500',
            hasScore
              ? isGood
                ? 'ring-emerald-400 shadow-emerald-200'
                : 'ring-rose-400 shadow-rose-200'
              : 'ring-white shadow-primary/10',
          )}
        >
          {list.length === 0 ? (
            <div className="w-full aspect-square max-h-72 mx-auto bg-muted flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <ImageIcon className="w-12 h-12 opacity-40" />
              <span className="text-sm font-medium">No image</span>
            </div>
          ) : list.length === 1 ? (
            <img src={list[0]} alt={word} className="w-full max-h-80 object-cover mx-auto" />
          ) : (
            <div
              className={cn(
                'grid gap-1.5 p-1.5 bg-muted/30',
                list.length === 2 ? 'grid-cols-2' : 'grid-cols-2 grid-rows-2',
              )}
            >
              {list.slice(0, 4).map((src, i) => (
                <motion.div
                  key={`${src}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="relative rounded-2xl overflow-hidden aspect-square shadow-md ring-2 ring-white/80"
                >
                  <img src={src} alt={`${word} view ${i + 1}`} className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
            <span className="text-white text-xs font-bold capitalize tracking-wide">{category}</span>
          </div>
        </div>
      </motion.div>

      {showWord && (
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-5xl sm:text-6xl font-extrabold text-foreground tracking-tight"
        >
          {word}
        </motion.h2>
      )}

      {showPhonemes && phonemes.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex items-center gap-1.5 flex-wrap justify-center"
        >
          {phonemes.map((p, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="bg-primary/10 text-primary text-sm font-mono font-bold px-3 py-1 rounded-lg">{p}</span>
              {i < phonemes.length - 1 && <span className="text-muted-foreground text-xs">·</span>}
            </span>
          ))}
        </motion.div>
      )}

      {hasScore && (
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-base shadow-lg',
            isGood ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-rose-500 text-white shadow-rose-500/30',
          )}
        >
          {isGood ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span>{score}% accuracy</span>
        </motion.div>
      )}
    </div>
  );
}
