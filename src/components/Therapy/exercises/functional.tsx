// components/Therapy/exercises/FunctionalExercise.tsx
/**
 * FUNCTIONAL — "Use it in context"
 * Presents a scenario / sentence-fill prompt.
 * Child says the target word in a short functional phrase.
 * Records audio, gets score + feedback.
 */
import { useCallback, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Volume2, Sparkles, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import AudioControls from "@/components/Therapy/AudioControls";
import PhonemeBreakdown from "@/components/Therapy/PhonemeBreakdown";
import {
  ModuleStep,
  SpeechTherapyWord,
  resolveWord,
  SessionAttempt,
} from "@/api/therapy";
import { FilteredSpeechAPIResponse } from "@/data/speechTherapyWords";

interface FunctionalExerciseProps {
  step: ModuleStep;
  accentColor: string;
  onComplete: () => void;
  initialAttempt?: SessionAttempt | null;
}

export default function FunctionalExercise({
  step,
  accentColor,
  onComplete,
  initialAttempt,
}: FunctionalExerciseProps) {
  const word: SpeechTherapyWord | null = resolveWord(step);

  const [hasRecording, setHasRecording] = useState(false);
  const [score, setScore] = useState<FilteredSpeechAPIResponse | null>(null);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [isPlayingFeedback, setIsPlayingFeedback] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    playTTS(prompt);
  }, [])

  useEffect(() => {
    if (initialAttempt) {
      setScore(initialAttempt as unknown as FilteredSpeechAPIResponse);
      setFeedbackText(initialAttempt.llmFeedback ?? null);
      setHasRecording(true);
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

  const prompt =
    step.config?.prompt ??
    `Can you use the word "${word.word}" in a sentence?`;

  // split prompt to highlight the blank or target word
  const highlightedPrompt = prompt.replace(
    new RegExp(`\\b${word.word}\\b`, "gi"),
    `<mark>${word.word}</mark>`
  );

  return (
    <div className="space-y-8">
      {/* instruction */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0"
          style={{ background: accentColor }}
        >
          <MessageSquare className="w-4 h-4" />
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">
            Use the word in context
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Say the full phrase out loud
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* context card */}
        <div className="space-y-5">
          {/* word card */}
          <div
            className="rounded-2xl p-6 text-white space-y-1"
            style={{ background: accentColor }}
          >
            <p className="text-xs font-bold uppercase tracking-widest opacity-70">
              Target Word
            </p>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{word.emoji}</span>
              <span className="text-3xl font-extrabold tracking-tight">
                {word.word}
              </span>
            </div>
            {word.phonemes?.length > 0 && (
              <p className="text-sm opacity-70">
                /{word.phonemes.join("-")}/
              </p>
            )}
          </div>

          {/* prompt bubble */}
          <AnimatePresence>
            {feedbackText && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-muted/10 border border-muted/20 rounded-2xl p-1 flex items-start gap-3"
              >
                <div className="rounded-2xl p-5 w-full">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Prompt
                  </p>
                  <p
                    className="text-base text-foreground leading-relaxed font-medium [&_mark]:bg-primary/20 [&_mark]:text-primary [&_mark]:px-1 [&_mark]:rounded [&_mark]:not-italic"
                    dangerouslySetInnerHTML={{ __html: prompt }}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => playTTS(prompt)}
                  disabled={isPlayingFeedback}
                  className="rounded-xl shrink-0 text-primary hover:bg-primary/10"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* optional config image */}
          {step.config?.image && (
            <div className="rounded-2xl overflow-hidden max-w-100 max-h-100 border border-muted/20 bg-muted/10">
              <img
                src={step.config.image}
                alt="context"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* audio + feedback */}
        <div className="space-y-5">
          <AudioControls
            word={word.word}
            wordData={word}
            onRecordingComplete={() => {
              setHasRecording(true);
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