import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, RotateCcw, Home,
  Mic, Sparkles, Volume2, Loader2, CheckCircle2, ArrowRight, Layers,
  Play, Pause, RefreshCw, VideoOff,
} from 'lucide-react';
import { Pill } from '@/components/ui/badge';
import Layout from '@/components/Layout/Layout';
import WordDisplay from '@/components/Therapy/WordDisplay';
import AudioControls from '@/components/Therapy/AudioControls';
import PhonemeBreakdown from '@/components/Therapy/PhonemeBreakdown';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import {
  therapyModulesAPI,
  SpeechTherapyModule,
  SpeechTherapyWord,
  ModuleStep,
} from '@/api/therapy';
import { useAuth } from '@/hooks/useAuth';
import { SpeechAPIResponse } from '@/data/speechTherapyWords';

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

function resolveWord(step: ModuleStep): SpeechTherapyWord | null {
  if (!step.wordId) return null;
  if (typeof step.wordId === 'object') return step.wordId as SpeechTherapyWord;
  return null;
}

/* ─────────────────────────────────────────────
   Word Video Player (Reel Style)
───────────────────────────────────────────── */
interface WordVideoPlayerProps {
  videos: string[];
  accentColor: string;
}

function WordVideoPlayer({ videos, accentColor }: WordVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const currentSrc = videos[currentVideoIndex];

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
    setIsPlaying(false);
  }, [currentSrc]);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.paused) {
      vid.play();
    } else {
      vid.pause();
    }
  };

  const replay = () => {
    const vid = videoRef.current;
    if (!vid) return;

    vid.currentTime = 0;
    vid.play();
  };

  if (!videos.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="w-full flex justify-center"
    >
      <div className="relative w-full max-w-[240px]">
        {/* Reel Container */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl aspect-[9/16]">
          
          {/* Video */}
          {!hasError ? (
            <>
              <video
                ref={videoRef}
                src={currentSrc}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                onError={() => setHasError(true)}
                onLoadedData={() => setIsLoaded(true)}
                playsInline
                onClick={togglePlay}
              />

              {/* Loading */}
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <Loader2 className="w-7 h-7 animate-spin text-white/60" />
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/60">
              <VideoOff className="w-10 h-10" />
              <span className="text-sm">Video unavailable</span>
            </div>
          )}

          {/* Dark overlay gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

          {/* Top label */}
          <div className="absolute top-0 left-0 right-0 flex items-center px-4 py-3 z-10">
            <div
              className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-md"
              style={{
                background: `${accentColor}dd`,
              }}
            >
              Word Video
            </div>

            {videos.length > 1 && (
              <div className="ml-auto text-white/80 text-xs font-medium">
                {currentVideoIndex + 1}/{videos.length}
              </div>
            )}
          </div>

          {/* Center play button */}
          {!isPlaying && isLoaded && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <div className="w-20 h-20 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center border border-white/20 transition-transform active:scale-95">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
            </button>
          )}

          {/* Bottom Controls */}
          {!hasError && (
            <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
              <div className="flex items-center gap-2">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  disabled={!isLoaded}
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg disabled:opacity-40 active:scale-95 transition-transform"
                  style={{
                    background: accentColor,
                  }}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  )}
                </button>

                {/* Replay */}
                <button
                  onClick={replay}
                  disabled={!isLoaded}
                  className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white disabled:opacity-40 active:scale-95 transition-transform"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                {/* Status */}
                <div className="ml-2 text-white/75 text-xs">
                  {isPlaying
                    ? "Playing..."
                    : isLoaded
                    ? "Tap video"
                    : "Loading..."}
                </div>

                {/* Dots */}
                {videos.length > 1 && (
                  <div className="ml-auto flex items-center gap-1.5">
                    {videos.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentVideoIndex(i)}
                        className="transition-all rounded-full"
                        style={{
                          width: i === currentVideoIndex ? 18 : 7,
                          height: 7,
                          background:
                            i === currentVideoIndex
                              ? accentColor
                              : "rgba(255,255,255,0.35)",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Module Selector Screen
───────────────────────────────────────────── */
interface ModuleSelectorProps {
  modules: SpeechTherapyModule[];
  completedModules: Set<string>;
  onSelect: (mod: SpeechTherapyModule) => void;
}

function ModuleSelector({ modules, completedModules, onSelect }: ModuleSelectorProps) {
  return (
    <div className="space-y-5">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-foreground">Choose a Module</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Select a therapy module to begin your session
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((mod) => {
          const done = completedModules.has(mod._id!);

          return (
            <motion.button
              key={mod._id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(mod)}
              className="text-left border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-all group bg-white"
            >
              <div className="h-2 w-full" style={{ background: mod.color }} />

              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                    style={{ background: mod.colorLight }}
                  >
                    {mod.emoji}
                  </div>

                  <div className="flex items-center gap-2">
                    {done && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    )}
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                <h3 className="font-bold text-base text-foreground leading-tight">
                  {mod.title}
                </h3>

                {mod.subtitle && (
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                    {mod.subtitle}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-3">
                  <Pill className="bg-slate-100 text-slate-600">
                    <Layers className="h-2.5 w-2.5 mr-1" />{mod.steps.length} steps
                  </Pill>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {modules.length === 0 && (
        <div className="col-span-full flex flex-col items-center py-20 text-muted-foreground gap-3">
          <Layers className="h-10 w-10 opacity-20" />
          <p className="text-sm">No modules found.</p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step Type Badge
───────────────────────────────────────────── */
const STEP_TYPE_LABELS: Record<string, string> = {
  imitation: 'Imitation',
  expressive: 'Expressive',
  phoneme: 'Phoneme',
  checkpoint: 'Checkpoint',
};

const STEP_TYPE_COLORS: Record<string, string> = {
  imitation: 'bg-sky-100 text-sky-700',
  expressive: 'bg-violet-100 text-violet-700',
  phoneme: 'bg-amber-100 text-amber-700',
  checkpoint: 'bg-emerald-100 text-emerald-700',
};

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function SpeechTherapy() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [selectedModule, setSelectedModule] = useState<SpeechTherapyModule | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  const [recordings, setRecordings] = useState<Record<string, SpeechAPIResponse>>({});
  const [speechPronunciationScore, setSpeechPronunciationScore] = useState<SpeechAPIResponse | null>(null);

  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [isPlayingFeedback, setIsPlayingFeedback] = useState(false);
  const feedbackUtterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isLoggedIn) navigate('/auth');
  }, [isLoggedIn, navigate]);

  const { data: modulesData, isLoading } = useQuery<SpeechTherapyModule[]>({
    queryKey: ['speech-therapy-modules'],
    queryFn: () => therapyModulesAPI.getAll().then((res) => res.data ?? res),
  });

  const modules: SpeechTherapyModule[] = modulesData ?? [];

  const steps: ModuleStep[] = selectedModule?.steps ?? [];
  const currentStep: ModuleStep | undefined = steps[stepIndex];
  const currentWord: SpeechTherapyWord | null = currentStep ? resolveWord(currentStep) : null;

  const stepKey = currentStep?._id ?? `${selectedModule?._id}-${stepIndex}`;
  const currentRecording = stepKey ? recordings[stepKey] : null;
  const hasRecording = !!currentRecording;

  const progressPct = steps.length > 0 ? ((stepIndex + 1) / steps.length) * 100 : 0;
  const completedCount = Object.keys(recordings).length;

  const hasVideos = !!(currentWord?.videos?.length);

  /* ── Callbacks ─────────────────────────────── */
  const resetStepState = useCallback(() => {
    setSpeechPronunciationScore(null);
    setFeedbackText(null);
    window.speechSynthesis.cancel();
  }, []);

  const handleRecordingComplete = useCallback(() => {
    if (stepKey) {
      setRecordings((prev) => ({ ...prev, [stepKey]: {} as SpeechAPIResponse }));
    }
  }, [stepKey]);

  const handleFeedbackReady = useCallback((text: string) => {
    setFeedbackText(text);
    playFeedbackTTS(text);
  }, []);

  const playFeedbackTTS = (text: string) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.85;
    utter.pitch = 1.2;
    utter.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.name.includes('Google') || v.name.includes('Samantha') || v.lang === 'en-US'
    );
    if (preferred) utter.voice = preferred;
    utter.onstart = () => setIsPlayingFeedback(true);
    utter.onend = () => setIsPlayingFeedback(false);
    utter.onerror = () => setIsPlayingFeedback(false);
    feedbackUtterRef.current = utter;
    window.speechSynthesis.speak(utter);
  };

  const replayFeedback = () => { if (feedbackText) playFeedbackTTS(feedbackText); };

  const goNext = useCallback(() => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((p) => p + 1);
      resetStepState();
    }
  }, [stepIndex, steps.length, resetStepState]);

  const goPrev = useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex((p) => p - 1);
      resetStepState();
    }
  }, [stepIndex, resetStepState]);

  const resetCurrent = useCallback(() => {
    if (stepKey) {
      setRecordings((prev) => { const n = { ...prev }; delete n[stepKey]; return n; });
    }
    resetStepState();
  }, [stepKey, resetStepState]);

  const finishModule = () => {
    if (selectedModule?._id) {
      setCompletedModules((prev) => new Set([...prev, selectedModule._id!]));
    }
    setSelectedModule(null);
    setStepIndex(0);
    setRecordings({});
    resetStepState();
  };

  /* ── Loading ───────────────────────────────── */
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isLoading && modules.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">No therapy modules found.</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </Layout>
    );
  }

  if (!selectedModule) {
    return (
      <Layout>
        <div className="min-h-full bg-background">
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[35rem] h-[35rem] rounded-full bg-primary/5 blur-3xl -translate-y-1/3 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[25rem] h-[25rem] rounded-full bg-sky-200/20 blur-3xl translate-y-1/3 -translate-x-1/4" />
          </div>
          <div className="relative z-10 p-6 md:p-8 mx-auto">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="gap-2 rounded-xl hover:bg-muted/30 font-semibold">
                <Home className="w-4 h-4" /> Dashboard
              </Button>
              <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Mic className="w-3.5 h-3.5" /> Speech Therapy
              </div>
            </div>
            <ModuleSelector
              modules={modules}
              completedModules={completedModules}
              onSelect={(mod) => { setSelectedModule(mod); setStepIndex(0); setRecordings({}); resetStepState(); }}
            />
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentStep) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">This module has no steps.</p>
          <Button onClick={() => setSelectedModule(null)}>Back to Modules</Button>
        </div>
      </Layout>
    );
  }

  /* ── SESSION SCREEN ────────────────────────── */
  const accentColor = selectedModule.color;
  const isLastStep = stepIndex === steps.length - 1;

  return (
    <Layout>
      <div className="min-h-full bg-background">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[35rem] h-[35rem] rounded-full bg-primary/5 blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[25rem] h-[25rem] rounded-full bg-sky-200/20 blur-3xl translate-y-1/3 -translate-x-1/4" />
        </div>

        <div className="relative z-10 p-6 md:p-8 max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-7">
            <Button
              variant="ghost" size="sm"
              onClick={() => setSelectedModule(null)}
              className="gap-2 rounded-xl hover:bg-muted/30 font-semibold"
            >
              <ChevronLeft className="w-4 h-4" /> Modules
            </Button>
            <div className="flex items-center gap-3">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white"
                style={{ background: accentColor }}
              >
                <span>{selectedModule.emoji}</span>
                {selectedModule.title}
              </div>
              <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow rounded-full px-4 py-1.5 text-sm font-bold text-foreground">
                {stepIndex + 1} <span className="text-muted-foreground font-normal">/ {steps.length}</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-7">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>{completedCount} of {steps.length} steps completed</span>
              <span className="font-bold" style={{ color: accentColor }}>{Math.round(progressPct)}%</span>
            </div>
            <div className="w-full h-2.5 bg-muted/20 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(to right, ${accentColor}, ${selectedModule.colorLight})` }}
              />
            </div>
            <div className="flex justify-center gap-1.5 mt-3">
              {steps.map((s, i) => (
                <button
                  key={s._id ?? i}
                  onClick={() => { setStepIndex(i); resetStepState(); }}
                  className={`transition-all duration-200 rounded-full ${
                    i === stepIndex
                      ? 'w-5 h-2.5'
                      : recordings[s._id ?? `${selectedModule._id}-${i}`]
                      ? 'w-2.5 h-2.5 bg-emerald-400'
                      : 'w-2.5 h-2.5 bg-muted/40 hover:bg-muted'
                  }`}
                  style={i === stepIndex ? { background: accentColor } : undefined}
                />
              ))}
            </div>
          </div>

          {/* Step type + phase label */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STEP_TYPE_COLORS[currentStep.type] ?? 'bg-muted/30 text-muted-foreground'}`}>
              {STEP_TYPE_LABELS[currentStep.type] ?? currentStep.type}
            </span>
            {currentStep.phase && (
              <span className="text-xs text-muted-foreground">{currentStep.phase}</span>
            )}
            <span className="ml-auto text-sm font-semibold text-foreground">{currentStep.title}</span>
          </div>

          {/* Main Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={stepKey}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl shadow-black/5 rounded-3xl p-8 md:p-10"
            >
              {currentWord ? (
                <div className={`grid gap-10 items-start ${hasVideos ? 'md:grid-cols-[1fr_1.2fr]' : 'md:grid-cols-2'}`}>

                  {/* Left – word visual + video */}
                  <div className="flex flex-col items-center gap-5">
                    <WordDisplay
                      word={currentWord.word}
                      image={currentWord.images?.[0]}
                      category={currentWord.category}
                      phonemes={currentWord.phonemes}
                      score={speechPronunciationScore?.text_score?.word_score_list?.[0]?.quality_score}
                      isCorrect={speechPronunciationScore?.text_score?.word_score_list?.[0]?.quality_class}
                    />

                    {/* Video player – only if videos exist */}
                    {hasVideos && (
                      <div className="w-full">
                        <WordVideoPlayer
                          videos={currentWord.videos!}
                          accentColor={accentColor}
                        />
                      </div>
                    )}
                  </div>

                  {/* Right – audio + feedback */}
                  <div className="space-y-6">
                    <AudioControls
                      word={currentWord.word}
                      wordData={currentWord}
                      onRecordingComplete={handleRecordingComplete}
                      hasRecording={hasRecording}
                      setSpeechPronunciationScore={setSpeechPronunciationScore}
                      onFeedbackReady={handleFeedbackReady}
                    />

                    {speechPronunciationScore?.text_score?.word_score_list?.[0]?.phone_score_list && (
                      <PhonemeBreakdown
                        phonemes={speechPronunciationScore.text_score.word_score_list[0].phone_score_list}
                        wordScore={speechPronunciationScore.text_score.word_score_list[0].quality_score}
                        isCorrect={speechPronunciationScore.text_score.word_score_list[0].quality_class}
                      />
                    )}

                    {/* AI Feedback Banner */}
                    <AnimatePresence>
                      {feedbackText && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-3"
                        >
                          <div className="flex-1">
                            <p className="text-xs font-bold text-primary uppercase tracking-wide mb-1">AI Feedback</p>
                            <p className="text-sm text-foreground leading-relaxed">{feedbackText}</p>
                          </div>
                          <Button
                            variant="ghost" size="sm"
                            onClick={replayFeedback}
                            disabled={isPlayingFeedback}
                            className="rounded-xl shrink-0 text-primary hover:bg-primary/10"
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {hasRecording && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
                        <Button
                          variant="ghost" size="sm"
                          onClick={resetCurrent}
                          className="gap-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        >
                          <RotateCcw className="w-4 h-4" /> Try Again
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <span className="text-5xl">{selectedModule.emoji}</span>
                  <h3 className="text-xl font-bold text-foreground">{currentStep.title}</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    This step is a <strong>{STEP_TYPE_LABELS[currentStep.type]}</strong> in the <em>{currentStep.phase}</em> phase.
                    There is no word assigned to this step.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={goPrev}
              disabled={stepIndex === 0}
              className="rounded-2xl gap-2 border-2 border-muted/40 hover:bg-muted/20 font-semibold px-6 py-5 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>

            {isLastStep && hasRecording ? (
              <motion.div whileHover={{ scale: 1.04 }}>
                <Button
                  onClick={finishModule}
                  className="rounded-2xl gap-2 px-8 py-5 text-white font-bold shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <Sparkles className="w-4 h-4" /> Finish Module
                </Button>
              </motion.div>
            ) : (
              <Button
                onClick={goNext}
                disabled={isLastStep}
                className="rounded-2xl gap-2 px-8 py-5 text-white font-bold shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-30"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}