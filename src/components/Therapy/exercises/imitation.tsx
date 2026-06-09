// components/Therapy/exercises/ImitationExercise.tsx
/**
 * IMITATION — "Listen & repeat"
 * The child watches a model (video / image) and imitates the word.
 * Flow: show word + media → listen to TTS → child records → get score + AI feedback
 */
import { useCallback, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Volume2,
  Loader2,
  Play,
  Pause,
  RefreshCw,
  VideoOff,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import WordDisplay from "@/components/Therapy/WordDisplay";
import AudioControls from "@/components/Therapy/AudioControls";
import PhonemeBreakdown from "@/components/Therapy/PhonemeBreakdown";
import {
  ModuleStep,
  SpeechTherapyWord,
  resolveWord,
  SessionAttempt,
} from "@/api/therapy";
import { FilteredSpeechAPIResponse } from "@/data/speechTherapyWords";

/* ─── mini video player ─── */
function ReelPlayer({
  src,
  accentColor,
}: {
  src: string;
  accentColor: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const toggle = () => {
    if (!ref.current) return;
    ref.current.paused ? ref.current.play() : ref.current.pause();
  };
  const replay = () => {
    if (!ref.current) return;
    ref.current.currentTime = 0;
    ref.current.play();
  };

  return (
    <div className="relative w-full max-w-[200px] mx-auto">
      <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black shadow-xl aspect-[9/16]">
        {!error ? (
          <>
            <video
              ref={ref}
              src={src}
              className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              onError={() => setError(true)}
              onLoadedData={() => setLoaded(true)}
              playsInline
              onClick={toggle}
            />
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <Loader2 className="w-6 h-6 animate-spin text-white/50" />
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/50">
            <VideoOff className="w-8 h-8" />
            <span className="text-xs">Unavailable</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        {!playing && loaded && (
          <button
            onClick={toggle}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur flex items-center justify-center border border-white/20">
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </div>
          </button>
        )}

        {!error && (
          <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={toggle}
                disabled={!loaded}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white disabled:opacity-40"
                style={{ background: accentColor }}
              >
                {playing ? (
                  <Pause className="w-3.5 h-3.5 fill-white" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                )}
              </button>
              <button
                onClick={replay}
                disabled={!loaded}
                className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white disabled:opacity-40"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── main component ─── */
interface ImitationExerciseProps {
  step: ModuleStep;
  accentColor: string;
  onComplete: () => void;
  initialAttempt?: SessionAttempt | null;
}

export default function ImitationExercise({
  step,
  accentColor,
  onComplete,
  initialAttempt,
}: ImitationExerciseProps) {
  const word: SpeechTherapyWord | null = resolveWord(step);

  const [score, setScore] =
    useState<FilteredSpeechAPIResponse | null>(null);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [isPlayingFeedback, setIsPlayingFeedback] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

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
    u.pitch = 1.1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.name.includes("Google") || v.lang === "en-US"
    );
    if (preferred) u.voice = preferred;
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
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
        <Mic className="w-10 h-10 opacity-20" />
        <p className="text-sm">No word assigned to this step.</p>
      </div>
    );
  }

  const videos = word.videos ?? [];

  return (
    <div className="space-y-8">
      {/* instruction */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0"
          style={{ background: accentColor }}
        >
          <Mic className="w-4 h-4" />
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">
            Listen, then repeat the word
          </p>
          {step.config?.prompt && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {step.config.prompt}
            </p>
          )}
        </div>
      </div>

      {/* main layout */}
      <div
        className={`grid gap-8 items-start ${videos.length ? "md:grid-cols-[1fr_200px_1fr]" : "md:grid-cols-2"}`}
      >
        {/* word */}
        <WordDisplay
          word={word.word}
          images={word.images}
          category={word.category}
          phonemes={word.phonemes}
          score={score?.quality_score}
          isCorrect={score?.quality_class}
        />

        {/* optional video */}
        {videos.length > 0 && (
          <ReelPlayer src={videos[0]} accentColor={accentColor} />
        )}

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
                exit={{ opacity: 0, y: 8 }}
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