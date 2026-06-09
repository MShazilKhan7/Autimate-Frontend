// components/Therapy/exercises/IdentifyExercise.tsx
/**
 * IDENTIFY — "Point to the picture"
 * Show a prompt word and several image cards (target + distractors).
 * User taps the correct one. Immediate visual feedback.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, MousePointerClick, Volume2 } from "lucide-react";
import { ModuleStep, SpeechTherapyWord, resolveWord, resolveDistractors } from "@/api/therapy";
import { Button } from "@/components/ui/button";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface Choice {
  word: SpeechTherapyWord;
  isTarget: boolean;
}

interface IdentifyExerciseProps {
  step: ModuleStep;
  accentColor: string;
  onComplete: () => void;
  isReset?: boolean;
  onResetHandled?: () => void;
}

export default function IdentifyExercise({
  step,
  accentColor,
  onComplete,
  isReset,
  onResetHandled,
}: IdentifyExerciseProps) {
  const target = resolveWord(step);
  const distractors = resolveDistractors(step.config);
  console.log("Step CONFIG", step.config, "Target", target, "Distractors", distractors);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isPlayingWord, setIsPlayingWord] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const resetExercise = useCallback(() => {
    if (!target) return;

    const all: Choice[] = [
      { word: target, isTarget: true },
      ...distractors.map((d) => ({ word: d, isTarget: false })),
    ];

    setChoices(shuffle(all));
    setSelected(null);
    setAnswered(false);

    // stop any playing speech
    window.speechSynthesis.cancel();
    setIsPlayingWord(false);
  }, [target, distractors]);

  // Reset when step changes
  useEffect(() => {
    resetExercise();
  }, [step._id]);

  // Reset when parent requests it
  useEffect(() => {
    if (isReset) {
      resetExercise();
      onResetHandled?.();   // ← add this line
    }
  }, [isReset]);

  const playTTS = useCallback((text: string) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85;
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find((v) => v.lang === "en-US");
    if (pref) u.voice = pref;
    u.onstart = () => setIsPlayingWord(true);
    u.onend = () => setIsPlayingWord(false);
    u.onerror = () => setIsPlayingWord(false);
    utterRef.current = u;
    window.speechSynthesis.speak(u);
  }, []);

  const handleSelect = (wordId: string, isTarget: boolean) => {
    if (answered) return;
    setSelected(wordId);
    setAnswered(true);
    if (isTarget) onComplete();
  };

  if (!target) {
    return (
      <div className="flex flex-col items-center py-16 text-muted-foreground gap-3">
        <MousePointerClick className="w-10 h-10 opacity-20" />
        <p className="text-sm">No word assigned to this step.</p>
      </div>
    );
  }

  const isCorrect = selected === target._id;

  return (
    <div className="space-y-8">
      {/* prompt */}
      <div className="text-center space-y-2">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold"
          style={{ background: accentColor }}
        >
          <MousePointerClick className="w-4 h-4" />
          Find the picture
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
          {target.word}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => playTTS(target.word)}
          className="rounded-xl shrink-0 text-primary hover:bg-primary/10"
        >
          <Volume2 className="w-4 h-4" />
        </Button>
        {step.config?.prompt && (
          <p className="text-sm text-muted-foreground">{step.config.prompt}</p>
        )}
      </div>

      {/* image grid */}
      <div
        className={`grid gap-4 ${choices.length <= 2 ? "grid-cols-2" : choices.length === 3 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4"}`}
      >
        {choices.map(({ word, isTarget }) => {
          const sel = selected === word._id;
          const correct = sel && isTarget;
          const wrong = sel && !isTarget;

          let borderStyle = "border-2 border-muted/30";
          if (correct) borderStyle = "border-2 border-emerald-400 shadow-emerald-200 shadow-lg";
          if (wrong) borderStyle = "border-2 border-rose-400 shadow-rose-200 shadow-lg";
          if (answered && isTarget && !correct)
            borderStyle = "border-2 border-emerald-400 ring-4 ring-emerald-100";

          return (
            <motion.button
              key={word._id ?? word.word}
              whileHover={answered ? {} : { scale: 1.04, y: -2 }}
              whileTap={answered ? {} : { scale: 0.97 }}
              onClick={() => handleSelect(word._id!, isTarget)}
              disabled={answered}
              className={`relative rounded-2xl overflow-hidden bg-white ${borderStyle} transition-all`}
            >
              {/* image */}
              <div className="aspect-square bg-muted/10 flex items-center justify-center overflow-hidden">
                {word.images?.[0] ? (
                  <img
                    src={word.images[0]}
                    alt={word.word}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl">{word.emoji}</span>
                )}
              </div>

              {/* label */}
              <div className="px-3 py-2 text-center">
                <p className="text-sm font-semibold text-foreground">
                  {word.word}
                </p>
              </div>

              {/* result overlay */}
              <AnimatePresence>
                {answered && sel && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`absolute inset-0 flex items-center justify-center ${correct ? "bg-emerald-500/20" : "bg-rose-500/20"
                      }`}
                  >
                    {correct ? (
                      <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    ) : (
                      <XCircle className="w-10 h-10 text-rose-500" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* result banner */}
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-4 text-center font-semibold ${isCorrect
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
          >
            {isCorrect
              ? "🎉 Great job! That's correct!"
              : `Not quite — Keep trying!`}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}