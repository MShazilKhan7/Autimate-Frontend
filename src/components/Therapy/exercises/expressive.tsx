// components/Therapy/exercises/ExpressiveExercise.tsx
/**
 * EXPRESSIVE — "Name what you see"
 * A picture / video is shown. Child must say the target word spontaneously.
 * Reveal the word only after the child has attempted.
 */
import { useCallback, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Volume2, Sparkles, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import AudioControls from "@/components/Therapy/AudioControls";
import PhonemeBreakdown from "@/components/Therapy/PhonemeBreakdown";
import { ModuleStep, SpeechTherapyWord, resolveWord, SessionAttempt } from "@/api/therapy";
import { FilteredSpeechAPIResponse } from "@/data/speechTherapyWords";

interface ExpressiveExerciseProps {
  step: ModuleStep;
  accentColor: string;
  onComplete: () => void;
  initialAttempt?: SessionAttempt | null;
}

export default function ExpressiveExercise({
  step,
  accentColor,
  onComplete,
  initialAttempt,
}: ExpressiveExerciseProps) {
  const word: SpeechTherapyWord | null = resolveWord(step);

  const [revealed, setRevealed] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [score, setScore] = useState<FilteredSpeechAPIResponse | null>(null);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [isPlayingFeedback, setIsPlayingFeedback] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (initialAttempt) {
      setScore(initialAttempt as unknown as FilteredSpeechAPIResponse);
      setFeedbackText(initialAttempt.llmFeedback ?? null);
      setHasRecording(true);
      setRevealed(true);
    }
  }, [initialAttempt]);

  const playTTS = useCallback((text: string) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85;
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find((v) => v.lang === "en-US");
    if (pref) u.voice = pref;
    u.onstart = () => setIsPlayingFeedback(true);
    u.onend = () => setIsPlayingFeedback(false);
    u.onerror = () => setIsPlayingFeedback(false);
    utterRef.current = u;
    window.speechSynthesis.speak(u);
  }, []);

  const handleFeedbackReady = useCallback(
    (text: string) => {
      setFeedbackText(text);
      playTTS(text);
    },
    [playTTS]
  );

  if (!word) {
    return (
      <div className="flex flex-col items-center py-16 text-muted-foreground gap-3">
        <Mic className="w-10 h-10 opacity-20" />
        <p className="text-sm">No word assigned to this step.</p>
      </div>
    );
  }

  const imageUrl = step.config?.image ?? word.images?.[0];

  return (
    <div className="space-y-8">
      {/* instruction */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0"
          style={{ background: accentColor }}
        >
          <Eye className="w-4 h-4" />
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">
            Look at the picture and say what you see
          </p>
          {step.config?.prompt && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {step.config.prompt}
            </p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* image with hidden word */}
        <div className="space-y-4">
          {/* picture */}
          <div className="relative rounded-2xl overflow-hidden border border-muted/20 aspect-square bg-muted/10 flex items-center justify-center shadow-sm">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Describe this"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[5rem]">{word.emoji}</span>
            )}
          </div>

          {/* reveal toggle */}
          <div className="text-center">
            <AnimatePresence mode="wait">
              {!revealed ? (
                <motion.div
                  key="hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => setRevealed(true)}
                    className="rounded-xl gap-2 border-dashed"
                  >
                    <EyeOff className="w-4 h-4" />
                    Reveal word after attempting
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="revealed"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div
                    className="inline-block px-6 py-3 rounded-2xl text-white"
                    style={{ background: accentColor }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-0.5">
                      The word is
                    </p>
                    <p className="text-3xl font-extrabold tracking-tight">
                      {word.word}
                    </p>
                  </div>
                  {word.phonemes?.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      /{word.phonemes.join("-")}/
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* audio + feedback */}
        <div className="space-y-5">
          <AudioControls
            word={word.word}
            wordData={word}
            onRecordingComplete={() => {
              setHasRecording(true);
              setRevealed(true);
              onComplete();
            }}
            hasRecording={hasRecording}
            setSpeechPronunciationScore={
              setScore as React.Dispatch<
                React.SetStateAction<FilteredSpeechAPIResponse | null>
              >
            }
            onFeedbackReady={handleFeedbackReady}
          />

          {score?.phone_score_list && (
            <PhonemeBreakdown
              phonemes={score.phone_score_list}
              wordScore={score.quality_score}
              isCorrect={score.quality_class}
            />
          )}

          <AnimatePresence>
            {feedbackText && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-3"
              >
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Feedback
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {feedbackText}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => playTTS(feedbackText)}
                  disabled={isPlayingFeedback}
                  className="rounded-xl shrink-0 text-primary hover:bg-primary/10"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}