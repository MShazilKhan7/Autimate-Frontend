import { motion } from 'framer-motion';
import type { PhonemeScore, PhoneScore } from '@/data/speechTherapyWords';

interface PhonemeBreakdownProps {
  phonemes: PhoneScore[];
  wordScore: number;
  isCorrect: string;
}

/**
 * Official Speechace quality_score rubric:
 * 90–100 → Green   — Excellent. Native or native-like
 * 80–90  → Green   — Very good and clearly intelligible
 * 70–80  → Orange  — Good. Intelligible but with evident mistakes
 * 60–70  → Red     — Fair. Possibly not intelligible
 *  0–60  → Red     — Poor and must be reattempted
 */
type ScoreTier = 'excellent' | 'very-good' | 'good' | 'fair' | 'poor';

function getTier(score: number): ScoreTier {
  if (score >= 90) return 'excellent';
  if (score >= 80) return 'very-good';
  if (score >= 70) return 'good';
  if (score >= 60) return 'fair';
  return 'poor';
}

const TIER_CONFIG: Record<ScoreTier, {
  cardClass: string;
  dotClass: string;
  badgeClass: string;
  label: string;
  description: string;
}> = {
  excellent: {
    cardClass: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    dotClass: 'bg-emerald-500',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    label: 'Excellent',
    description: 'Native-like',
  },
  'very-good': {
    cardClass: 'bg-green-50 border-green-200 text-green-900',
    dotClass: 'bg-green-500',
    badgeClass: 'bg-green-100 text-green-800 border-green-200',
    label: 'Very Good',
    description: 'Clearly intelligible',
  },
  good: {
    cardClass: 'bg-orange-50 border-orange-200 text-orange-900',
    dotClass: 'bg-orange-400',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
    label: 'Good',
    description: 'Minor mistakes',
  },
  fair: {
    cardClass: 'bg-red-50 border-red-200 text-red-900',
    dotClass: 'bg-red-400',
    badgeClass: 'bg-red-100 text-red-800 border-red-200',
    label: 'Fair',
    description: 'Several mistakes',
  },
  poor: {
    cardClass: 'bg-red-50 border-red-300 text-red-900',
    dotClass: 'bg-red-600',
    badgeClass: 'bg-red-200 text-red-900 border-red-300',
    label: 'Poor',
    description: 'Reattempt needed',
  },
};

function getFeedbackTip(score: number, phone: string, soundMostLike: string | undefined): string {
  const tier = getTier(score);
  if (tier === 'excellent' || tier === 'very-good') return '';
  if (soundMostLike && soundMostLike.toLowerCase() !== phone.toLowerCase()) {
    return `Sounded like "${soundMostLike.toUpperCase()}" — aim for "${phone.toUpperCase()}"`;
  }
  if (tier === 'good') return `Refine the "${phone.toUpperCase()}" sound`;
  if (tier === 'fair') return `Practice "${phone.toUpperCase()}" more carefully`;
  return `Reattempt the "${phone.toUpperCase()}" sound`;
}

function WordScoreSummary({ score }: { score: number }) {
  const tier = getTier(score);
  const config = TIER_CONFIG[tier];
  const summaryMessages: Record<ScoreTier, string> = {
    excellent: '🌟 Excellent — native-like pronunciation!',
    'very-good': '✅ Very good — clearly intelligible!',
    good: '🟡 Good — intelligible with a few small mistakes.',
    fair: '🔴 Fair — several mistakes, keep practicing.',
    poor: '🔴 Needs reattempting — keep working on it.',
  };
  return (
    <div className={`rounded-xl border px-5 py-3 text-center text-sm font-medium ${config.badgeClass}`}>
      {summaryMessages[tier]}
    </div>
  );
}

export default function PhonemeBreakdown({ phonemes, wordScore, isCorrect }: PhonemeBreakdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="space-y-5"
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground tracking-tight">
          Phoneme Breakdown
        </h3>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
            isCorrect
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`} />
          {isCorrect ? 'Correct' : 'Needs Practice'}
        </span>
      </div>

      {/* Phoneme grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {phonemes.map((phoneme, index) => {
          const tier = getTier(phoneme.quality_score);
          const config = TIER_CONFIG[tier];
          const tip = getFeedbackTip(phoneme.quality_score, phoneme.phone, phoneme.sound_most_like);

          return (
            <motion.div
              key={`${phoneme.phone}-${index}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3 + index * 0.07,
                type: 'spring',
                stiffness: 280,
                damping: 22,
              }}
              className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 px-3 pb-4 pt-5 text-center ${config.cardClass}`}
            >
              {/* Score dot */}
              <span
                className={`absolute right-3 top-3 h-2 w-2 rounded-full ${config.dotClass}`}
                aria-hidden="true"
              />

              {/* Phoneme symbol */}
              <p className="text-3xl font-bold leading-none tracking-widest uppercase">
                {phoneme.phone}
              </p>

              {/* Score */}
              <p className="text-lg font-semibold leading-none tabular-nums">
                {Math.round(phoneme.quality_score)}
                <span className="ml-0.5 text-xs font-medium opacity-60">/ 100</span>
              </p>

              {/* Tier label */}
              <span
                className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${config.badgeClass}`}
              >
                {config.label}
              </span>

              {/* sound_most_like — shown when it differs from the expected phone */}
              {phoneme.sound_most_like &&
                phoneme.sound_most_like.toLowerCase() !== phoneme.phone.toLowerCase() && (
                  <div className="mt-0.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-white/60 px-2 py-1.5 text-[11px] font-medium">
                    <span className="opacity-60">Heard:</span>
                    <span className="font-bold uppercase tracking-wide">
                      {phoneme.sound_most_like}
                    </span>
                    <span className="opacity-40">→</span>
                    <span className="font-bold uppercase tracking-wide">
                      {phoneme.phone}
                    </span>
                  </div>
                )}

              {/* Coaching tip for sub-80 scores */}
              {tip && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.07 }}
                  className="mt-0.5 text-[11px] leading-snug opacity-75"
                >
                  {tip}
                </motion.p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Score rubric legend */}
      {/* <div className="rounded-xl border border-border/40 bg-muted/30 px-4 py-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Score guide
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {(
            [
              { range: '90–100', color: 'bg-emerald-500', label: 'Excellent' },
              { range: '80–90', color: 'bg-green-500', label: 'Very Good' },
              { range: '70–80', color: 'bg-orange-400', label: 'Good' },
              { range: '60–70', color: 'bg-red-400', label: 'Fair' },
              { range: '0–60', color: 'bg-red-600', label: 'Poor' },
            ] as const
          ).map(({ range, color, label }) => (
            <div key={range} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={`h-2 w-2 rounded-full ${color}`} aria-hidden="true" />
              <span className="tabular-nums">{range}</span>
              <span className="opacity-60">— {label}</span>
            </div>
          ))}
        </div>
      </div> */}

      {/* Overall summary */}
      <WordScoreSummary score={wordScore} />
    </motion.div>
  );
}