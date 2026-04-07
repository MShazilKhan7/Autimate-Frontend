import { motion } from 'framer-motion';
import type { PhonemeScore } from '@/data/speechTherapyWords';

interface PhonemeBreakdownProps {
  phonemes: PhonemeScore[];
  wordScore: number;
  isCorrect: string;
}

function getScoreColor(score: number): string {
  if (score >= 85) return 'bg-primary-soft text-primary border-primary/30';
  if (score >= 60) return 'bg-accent-soft text-foreground border-accent/40';
  return 'bg-accent/20 text-foreground border-destructive/30';
}

function getScoreDotColor(score: number): string {
  if (score >= 85) return 'bg-primary';
  if (score >= 60) return 'bg-accent';
  return 'bg-destructive';
}

function getFeedbackText(score: number, phone: string): string {
  if (score >= 85) return '';
  if (score >= 60) return `Try the '${phone.toUpperCase()}' sound again`;
  return `Practice the '${phone.toUpperCase()}' sound more`;
}

export default function PhonemeBreakdown({ phonemes, wordScore, isCorrect }: PhonemeBreakdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      {/* Overall Score Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-therapy-lg text-foreground">Phoneme Breakdown</h3>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isCorrect
              ? 'bg-primary-soft text-primary'
              : 'bg-accent/20 text-destructive'
          }`}>
            {isCorrect ? '✓ CORRECT' : '✗ NEEDS PRACTICE'}
          </span>
        </div>
      </div>

      {/* Phoneme Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {phonemes.map((phoneme, index) => {
          const feedback = getFeedbackText(phoneme.quality_score, phoneme.phone);
          return (
            <motion.div
              key={`${phoneme.phone}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1, type: 'spring', stiffness: 300 }}
              className={`relative rounded-xl border-2 p-4 text-center ${getScoreColor(phoneme.quality_score)}`}
            >
              {/* Score Dot */}
              <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${getScoreDotColor(phoneme.quality_score)}`} />

              {/* Phoneme Label */}
              <p className="text-2xl font-bold mb-1 uppercase tracking-wide">
                {phoneme.phone}
              </p>

              {/* Score */}
              <p className="text-lg font-semibold mb-1">
                {Math.round(phoneme.quality_score)}%
              </p>

              {/* Comment */}
              <p className="text-xs font-medium opacity-80">
                {/* {phoneme.annotation.comment} */}
              </p>

              {/* Feedback tip for low scores */}
              {feedback && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="mt-2 text-xs bg-card/80 rounded-lg px-2 py-1"
                >
                  💡 {feedback}
                </motion.p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Overall Feedback */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="rounded-xl bg-secondary/30 p-4 text-center"
      >
        <p className="text-foreground font-medium">
          {wordScore >= 90 ? '🌟 Outstanding! Keep it up!' :
           wordScore >= 75 ? '🎉 Great job! Almost perfect!' :
           wordScore >= 60 ? '💪 Good effort! Let\'s practice the highlighted sounds.' :
           '🤗 Nice try! Let\'s practice together again.'}
        </p>
      </motion.div>
    </motion.div>
  );
}
