import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Home,
  Mic,
  Sparkles,
  Volume2,
  Target,
  ImageIcon,
  Puzzle,
  BookOpen,
  PartyPopper,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Layers,
} from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import WordDisplay from '@/components/Therapy/WordDisplay';
import AudioControls from '@/components/Therapy/AudioControls';
import PhonemeBreakdown from '@/components/Therapy/PhonemeBreakdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { exercisesCurriculum } from '@/data/curriculum';
import {
  EXERCISE_KIND,
  getCategoryLabelsForModule,
  getTherapyWordById,
  therapyWords,
  type CurriculumModule,
  type CurriculumPhase,
  type CurriculumStep,
  type SpeechAPIResponse,
  type TherapyWord,
} from '@/data/speechTherapyWords';

function speakHint(text: string) {
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.82;
  window.speechSynthesis.speak(utter);
}

function phaseStyles(phase?: CurriculumPhase) {
  switch (phase) {
    case 'say_it_together':
      return 'bg-sky-500/15 text-sky-900 border-sky-300/50';
    case 'sound_puzzle':
      return 'bg-violet-500/12 text-violet-900 border-violet-300/40';
    case 'name_it':
      return 'bg-emerald-500/12 text-emerald-900 border-emerald-300/40';
    case 'listen_and_tap':
      return 'bg-amber-500/12 text-amber-900 border-amber-300/45';
    case 'finish_the_word':
      return 'bg-primary/15 text-primary border-primary/30';
    default:
      return 'bg-muted text-muted-foreground border-muted';
  }
}

function phaseLabel(phase?: CurriculumPhase) {
  if (!phase) return 'Activity';
  const map: Record<CurriculumPhase, string> = {
    say_it_together: 'Say it together',
    sound_puzzle: 'Sound puzzle',
    name_it: 'Name it',
    listen_and_tap: 'Picture + speak',
    finish_the_word: 'Finish the word',
  };
  return map[phase];
}

function kindIcon(kind: CurriculumStep['type']) {
  switch (kind) {
    case EXERCISE_KIND.IMIATION:
      return Mic;
    case EXERCISE_KIND.PHONEME_COMPLETION:
      return Puzzle;
    case EXERCISE_KIND.EXPRESSIVE_LABEL:
      return ImageIcon;
    case EXERCISE_KIND.RECEPTIVE_CHOICE:
      return Mic;
    case EXERCISE_KIND.WORD_COMPLETION:
      return Target;
    case EXERCISE_KIND.CHECKPOINT:
      return PartyPopper;
    default:
      return Target;
  }
}

function kindTitle(kind: CurriculumStep['type']) {
  switch (kind) {
    case EXERCISE_KIND.IMIATION:
      return 'Echo';
    case EXERCISE_KIND.PHONEME_COMPLETION:
      return 'Sound puzzle';
    case EXERCISE_KIND.EXPRESSIVE_LABEL:
      return 'Naming';
    case EXERCISE_KIND.RECEPTIVE_CHOICE:
      return 'Speak the match';
    case EXERCISE_KIND.WORD_COMPLETION:
      return 'Finish the word';
    case EXERCISE_KIND.CHECKPOINT:
      return 'Checkpoint';
    default:
      return 'Activity';
  }
}

function seededShuffle<T>(items: T[], seedStr: string): T[] {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    h ^= h << 13;
    h ^= h >>> 7;
    h ^= h << 5;
    const j = Math.abs(h) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function TherapyImageCollage({
  images,
  alt,
  className,
}: {
  images: string[];
  alt: string;
  className?: string;
}) {
  const list = images.slice(0, 4);
  if (list.length === 0) {
    return (
      <div className={cn('aspect-square bg-muted flex items-center justify-center', className)}>
        <ImageIcon className="w-10 h-10 text-muted-foreground/40" />
      </div>
    );
  }
  if (list.length === 1) {
    return <img src={list[0]} alt={alt} className={cn('w-full h-full object-cover', className)} />;
  }
  return (
    <div
      className={cn(
        'grid gap-1 h-full w-full min-h-[10rem]',
        list.length === 2 ? 'grid-cols-2' : 'grid-cols-2 grid-rows-2',
        className,
      )}
    >
      {list.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt={`${alt} ${i + 1}`}
          className="w-full h-full object-cover min-h-0 rounded-md"
        />
      ))}
    </div>
  );
}

function SpeakPromptBanner({ subtitle }: { subtitle: string }) {
  return (
    <div className="rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/[0.08] via-sky-500/[0.06] to-primary/[0.08] px-4 py-3.5 flex gap-3 items-start shadow-sm">
      <div className="rounded-full bg-primary/20 p-2.5 text-primary shrink-0">
        <Mic className="w-5 h-5" aria-hidden />
      </div>
      <div className="text-left min-w-0">
        <p className="font-bold text-foreground leading-snug">Your turn — speak your answer</p>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
}

function HintsPopover({ hints }: { hints?: string[] }) {
  const [open, setOpen] = useState(false);
  if (!hints?.length) return null;
  return (
    <div className="relative inline-block">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-xl gap-2 border-amber-200/80 bg-amber-50/80 text-amber-950 hover:bg-amber-100"
        onClick={() => setOpen((v) => !v)}
      >
        <Lightbulb className="w-4 h-4" /> Hints
      </Button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute z-20 mt-2 left-0 right-0 sm:right-auto sm:min-w-[280px] rounded-2xl border bg-popover text-popover-foreground shadow-lg p-3 space-y-2 text-sm"
          >
            {hints.map((h, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary font-bold">{i + 1}.</span>
                <span>{h}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

type LessonStage = 'intro' | 'steps' | 'wrap';

export default function SpeechTherapy() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<'pick' | 'lesson'>('pick');
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [lessonStage, setLessonStage] = useState<LessonStage>('intro');
  const [stepIndex, setStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [speechPronunciationScore, setSpeechPronunciationScore] = useState<SpeechAPIResponse | null>(null);

  const modules = useMemo(
    () => [...exercisesCurriculum.modules].sort((a, b) => a.order - b.order),
    [],
  );

  const activeModule = activeModuleId ? modules.find((m) => m.id === activeModuleId) : undefined;

  const sortedSteps = useMemo(() => {
    if (!activeModule) return [];
    return [...activeModule.steps].sort((a, b) => a.order - b.order);
  }, [activeModule]);

  const currentStep = sortedSteps[stepIndex];
  const lastStepIdx = sortedSteps.length - 1;

  useEffect(() => {
    setSpeechPronunciationScore(null);
  }, [stepIndex, currentStep?.id]);

  const openModule = useCallback((moduleId: string) => {
    const mod = modules.find((m) => m.id === moduleId);
    setActiveModuleId(moduleId);
    setScreen('lesson');
    setStepIndex(0);
    setLessonStage(mod?.lessonIntro ? 'intro' : 'steps');
    setSpeechPronunciationScore(null);
  }, [modules]);

  const exitLesson = useCallback(() => {
    setScreen('pick');
    setActiveModuleId(null);
    setLessonStage('intro');
    setStepIndex(0);
    setSpeechPronunciationScore(null);
  }, []);

  const isStepComplete = useMemo(() => {
    if (!currentStep) return false;
    return !!completedSteps[currentStep.id];
  }, [completedSteps, currentStep]);

  const markComplete = useCallback((stepId: string) => {
    setCompletedSteps((prev) => ({ ...prev, [stepId]: true }));
  }, []);

  const resetCurrentStep = useCallback(() => {
    if (!currentStep) return;
    setCompletedSteps((prev) => {
      const n = { ...prev };
      delete n[currentStep.id];
      return n;
    });
    setSpeechPronunciationScore(null);
  }, [currentStep]);

  const handleRecordingComplete = useCallback(() => {
    if (!currentStep) return;
    const speechKinds: CurriculumStep['type'][] = [
      EXERCISE_KIND.IMIATION,
      EXERCISE_KIND.PHONEME_COMPLETION,
      EXERCISE_KIND.EXPRESSIVE_LABEL,
      EXERCISE_KIND.RECEPTIVE_CHOICE,
      EXERCISE_KIND.WORD_COMPLETION,
      EXERCISE_KIND.CHECKPOINT,
    ];
    if (!speechKinds.includes(currentStep.type)) return;
    markComplete(currentStep.id);
  }, [currentStep, markComplete]);

  const goNext = useCallback(() => {
    if (!sortedSteps.length) return;
    if (stepIndex < lastStepIdx) {
      setStepIndex((i) => i + 1);
    } else {
      setLessonStage('wrap');
    }
  }, [sortedSteps.length, stepIndex, lastStepIdx]);

  const goPrev = useCallback(() => {
    if (lessonStage === 'wrap') {
      setLessonStage('steps');
      setStepIndex(lastStepIdx);
      return;
    }
    if (lessonStage === 'intro') return;
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }, [lessonStage, stepIndex, lastStepIdx]);

  const moduleProgressDone = useMemo(() => {
    if (!activeModule) return 0;
    return sortedSteps.filter((s) => completedSteps[s.id]).length;
  }, [activeModule, sortedSteps, completedSteps]);

  const progressPct =
    sortedSteps.length > 0 ? Math.round(((stepIndex + 1) / sortedSteps.length) * 100) : 0;

  const canGoNext =
    lessonStage === 'intro' ||
    lessonStage === 'wrap' ||
    (lessonStage === 'steps' && isStepComplete && stepIndex <= lastStepIdx);

  const wrapTitle = activeModule ? `You finished "${activeModule.title}"` : 'Lesson complete';

  return (
    <Layout>
      <div className="min-h-full bg-background">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[35rem] h-[35rem] rounded-full bg-primary/5 blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[25rem] h-[25rem] rounded-full bg-sky-200/20 blur-3xl translate-y-1/3 -translate-x-1/4" />
        </div>

        <div className="relative z-10 p-6 md:p-8 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-7 gap-4 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="gap-2 rounded-xl hover:bg-muted/30 font-semibold"
            >
              <Home className="w-4 h-4" /> Dashboard
            </Button>

            <div className="flex items-center gap-3 flex-wrap justify-end">
              <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Mic className="w-3.5 h-3.5" /> Speech Therapy
              </div>
              {screen === 'lesson' && activeModule && lessonStage === 'steps' && sortedSteps.length > 0 && (
                <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow rounded-full px-4 py-1.5 text-sm font-bold text-foreground">
                  {stepIndex + 1}{' '}
                  <span className="text-muted-foreground font-normal">/ {sortedSteps.length}</span>
                </div>
              )}
            </div>
          </div>

          {screen === 'pick' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                  {exercisesCurriculum.title}
                </h1>
                <p className="text-muted-foreground text-base leading-relaxed">{exercisesCurriculum.description}</p>
                <p className="text-sm font-semibold text-primary/90 bg-primary/5 border border-primary/15 rounded-2xl px-4 py-3 max-w-2xl mx-auto">
                  Voice-first: every exercise step asks for a spoken response — including picture prompts and short breaks. Use the microphone before moving on.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                {modules.map((mod, mi) => {
                  const modSteps = [...mod.steps].sort((a, b) => a.order - b.order);
                  const done = modSteps.filter((s) => completedSteps[s.id]).length;
                  const pct = modSteps.length ? Math.round((done / modSteps.length) * 100) : 0;
                  const topicCategories = getCategoryLabelsForModule(mod, therapyWords);
                  return (
                    <motion.div
                      key={mod.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: mi * 0.06 }}
                    >
                      <Card
                        className={cn(
                          'rounded-3xl border-white/60 bg-white/85 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden hover:shadow-2xl hover:border-primary/20 transition-all cursor-pointer group',
                        )}
                        onClick={() => openModule(mod.id)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between gap-3">
                            <div className="rounded-2xl bg-primary/10 p-2.5 text-primary group-hover:bg-primary/15 transition-colors">
                              <Layers className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-muted-foreground tabular-nums">{pct}%</span>
                          </div>
                          <CardTitle className="text-xl font-bold mt-3">{mod.title}</CardTitle>
                          <CardDescription className="text-base font-medium text-foreground/80">{mod.subtitle}</CardDescription>
                          {topicCategories.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {topicCategories.map((c) => (
                                <span
                                  key={c}
                                  className="text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-muted/70 text-muted-foreground capitalize"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground leading-relaxed">{mod.focus}</p>
                          <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-primary to-primary-soft"
                              initial={false}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.45 }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs font-semibold text-primary">
                            <span>
                              {done} / {modSteps.length} steps touched
                            </span>
                            <span className="inline-flex items-center gap-1">
                              Open <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {screen === 'lesson' && activeModule && (
            <>
              <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
                <Button variant="outline" size="sm" onClick={exitLesson} className="rounded-xl gap-2 font-semibold">
                  <BookOpen className="w-4 h-4" /> All lessons
                </Button>
                <div className="text-right min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Current lesson</p>
                  <p className="font-bold text-lg truncate">{activeModule.title}</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {lessonStage === 'intro' && activeModule.lessonIntro && (
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-8 md:p-12 text-center space-y-6 max-w-2xl mx-auto"
                  >
                    <div className="inline-flex rounded-full bg-primary/15 p-4 text-primary mx-auto">
                      <Sparkles className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold">{activeModule.lessonIntro.title}</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">{activeModule.lessonIntro.body}</p>
                    <p className="text-sm font-medium text-primary bg-primary/5 rounded-2xl px-4 py-3 border border-primary/15 max-w-lg mx-auto">
                      Every step asks you to use the microphone — speak each answer; there are no tap-to-choose exercises.
                    </p>
                    <Button
                      size="lg"
                      className="rounded-2xl px-10 py-6 text-lg font-bold bg-gradient-to-r from-primary to-primary-soft shadow-lg"
                      onClick={() => setLessonStage('steps')}
                    >
                      Start lesson <ChevronRight className="w-5 h-5 ml-1" />
                    </Button>
                  </motion.div>
                )}

                {lessonStage === 'wrap' && (
                  <motion.div
                    key="wrap"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-10 md:p-14 text-center space-y-6 max-w-xl mx-auto"
                  >
                    <motion.div
                      animate={{ rotate: [0, -6, 6, 0] }}
                      transition={{ duration: 0.6 }}
                      className="inline-flex rounded-full bg-emerald-500/15 p-5 text-emerald-700"
                    >
                      <CheckCircle2 className="w-14 h-14" />
                    </motion.div>
                    <h2 className="text-2xl md:text-3xl font-extrabold">{wrapTitle}</h2>
                    <p className="text-muted-foreground">
                      You moved through {sortedSteps.length} steps — {moduleProgressDone} marked complete this session.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                      <Button variant="outline" size="lg" className="rounded-2xl font-semibold" onClick={exitLesson}>
                        Choose another lesson
                      </Button>
                      <Button
                        size="lg"
                        className="rounded-2xl font-bold bg-gradient-to-r from-primary to-primary-soft"
                        onClick={() => navigate('/dashboard')}
                      >
                        Back to dashboard
                      </Button>
                    </div>
                  </motion.div>
                )}

                {lessonStage === 'steps' && currentStep && (
                  <motion.div
                    key={currentStep.id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl shadow-black/5 rounded-3xl p-8 md:p-10"
                  >
                    <StepChrome step={currentStep} activeModule={activeModule} therapyWords={therapyWords} />

                    <div className="flex flex-wrap gap-2 mb-6">
                      <HintsPopover hints={currentStep.hints} />
                      {'promptSpoken' in currentStep && currentStep.promptSpoken && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-xl gap-2 border-primary/25"
                          onClick={() => speakHint(currentStep.promptSpoken!)}
                        >
                          <Volume2 className="w-4 h-4" /> Hear cue
                        </Button>
                      )}
                    </div>

                    <StepBody
                      step={currentStep}
                      therapyWords={therapyWords}
                      completedSteps={completedSteps}
                      markComplete={markComplete}
                      resetCurrentStep={resetCurrentStep}
                      speechPronunciationScore={speechPronunciationScore}
                      setSpeechPronunciationScore={setSpeechPronunciationScore}
                      onRecordingComplete={handleRecordingComplete}
                    />

                    <div className="mt-8 pt-6 border-t border-muted/30">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>
                          {moduleProgressDone} of {sortedSteps.length} steps completed in this lesson
                        </span>
                        <span className="font-bold text-primary">{progressPct}% through order</span>
                      </div>
                      <div className="w-full h-2.5 bg-muted/20 rounded-full overflow-hidden mb-3">
                        <motion.div
                          animate={{
                            width: `${sortedSteps.length ? ((stepIndex + 1) / sortedSteps.length) * 100 : 0}%`,
                          }}
                          transition={{ duration: 0.45 }}
                          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-soft"
                        />
                      </div>
                      <div className="flex justify-center gap-1.5 flex-wrap max-w-2xl mx-auto">
                        {sortedSteps.map((s, i) => (
                          <button
                            key={s.id}
                            type="button"
                            title={s.title ?? s.id}
                            onClick={() => setStepIndex(i)}
                            className={cn(
                              'transition-all duration-200 rounded-full',
                              i === stepIndex
                                ? 'w-6 h-2.5 bg-primary'
                                : completedSteps[s.id]
                                  ? 'w-2.5 h-2.5 bg-emerald-400'
                                  : 'w-2.5 h-2.5 bg-muted/40 hover:bg-muted',
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {lessonStage !== 'intro' && lessonStage !== 'wrap' && (
                <div className="flex justify-between items-center mt-6 gap-4 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={goPrev}
                    disabled={lessonStage === 'steps' && stepIndex === 0}
                    className="rounded-2xl gap-2 border-2 border-muted/40 hover:bg-muted/20 font-semibold px-6 py-5 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </Button>

                  <Button
                    onClick={goNext}
                    disabled={!canGoNext || lessonStage !== 'steps'}
                    className="rounded-2xl gap-2 px-8 py-5 bg-gradient-to-r from-primary to-primary-soft text-primary-foreground font-bold shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all disabled:opacity-30"
                  >
                    {stepIndex === lastStepIdx ? 'Finish lesson' : 'Next'}{' '}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

function StepChrome({
  step,
  activeModule,
  therapyWords,
}: {
  step: CurriculumStep;
  activeModule: CurriculumModule;
  therapyWords: TherapyWord[];
}) {
  const Icon = kindIcon(step.type);
  const topicCategories = getCategoryLabelsForModule(activeModule, therapyWords);
  const wordMeta =
    'wordId' in step && typeof step.wordId === 'number'
      ? getTherapyWordById(step.wordId, therapyWords)
      : undefined;

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="rounded-2xl border border-muted/50 bg-muted/20 px-4 py-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
        <span className="font-bold text-foreground">{activeModule.title}</span>
        <span className="text-muted-foreground hidden sm:inline" aria-hidden>
          ·
        </span>
        <span className="text-muted-foreground">
          Lesson topics:{' '}
          <span className="font-semibold capitalize text-foreground">
            {topicCategories.length ? topicCategories.join(', ') : '—'}
          </span>
        </span>
        {wordMeta && (
          <>
            <span className="text-muted-foreground hidden sm:inline" aria-hidden>
              ·
            </span>
            <span className="rounded-full bg-primary/12 text-primary text-xs font-bold uppercase tracking-wide px-2.5 py-1 capitalize">
              Word group: {wordMeta.category}
            </span>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {step.phase && (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full border',
              phaseStyles(step.phase),
            )}
          >
            {phaseLabel(step.phase)}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-muted/40 px-3 py-1 rounded-full">
          <Icon className="w-3.5 h-3.5" />
          {kindTitle(step.type)}
        </span>
      </div>
      {step.title && <h3 className="text-xl md:text-2xl font-bold text-foreground">{step.title}</h3>}
      {step.instructions && (
        <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">{step.instructions}</p>
      )}
    </div>
  );
}

function StepBody({
  step,
  therapyWords,
  completedSteps,
  markComplete,
  resetCurrentStep,
  speechPronunciationScore,
  setSpeechPronunciationScore,
  onRecordingComplete,
}: {
  step: CurriculumStep;
  therapyWords: TherapyWord[];
  completedSteps: Record<string, boolean>;
  markComplete: (id: string) => void;
  resetCurrentStep: () => void;
  speechPronunciationScore: SpeechAPIResponse | null;
  setSpeechPronunciationScore: (v: SpeechAPIResponse | null) => void;
  onRecordingComplete: () => void;
}) {
  switch (step.type) {
    case EXERCISE_KIND.IMIATION:
      return (
        <ImitationStepPanel
          step={step}
          therapyWords={therapyWords}
          complete={!!completedSteps[step.id]}
          speechPronunciationScore={speechPronunciationScore}
          setSpeechPronunciationScore={setSpeechPronunciationScore}
          onRecordingComplete={onRecordingComplete}
          onReset={resetCurrentStep}
        />
      );
    case EXERCISE_KIND.PHONEME_COMPLETION:
      return (
        <PhonemeCompletionPanel
          step={step}
          therapyWords={therapyWords}
          complete={!!completedSteps[step.id]}
          speechPronunciationScore={speechPronunciationScore}
          setSpeechPronunciationScore={setSpeechPronunciationScore}
          onRecordingComplete={onRecordingComplete}
          onReset={resetCurrentStep}
        />
      );
    case EXERCISE_KIND.EXPRESSIVE_LABEL:
      return (
        <ExpressiveLabelStepPanel
          step={step}
          therapyWords={therapyWords}
          complete={!!completedSteps[step.id]}
          speechPronunciationScore={speechPronunciationScore}
          setSpeechPronunciationScore={setSpeechPronunciationScore}
          onRecordingComplete={onRecordingComplete}
          onReset={resetCurrentStep}
        />
      );
    case EXERCISE_KIND.RECEPTIVE_CHOICE:
      return (
        <ReceptiveChoicePanel
          step={step}
          therapyWords={therapyWords}
          complete={!!completedSteps[step.id]}
          speechPronunciationScore={speechPronunciationScore}
          setSpeechPronunciationScore={setSpeechPronunciationScore}
          onRecordingComplete={onRecordingComplete}
          onReset={resetCurrentStep}
        />
      );
    case EXERCISE_KIND.WORD_COMPLETION:
      return (
        <WordCompletionPanel
          step={step}
          therapyWords={therapyWords}
          complete={!!completedSteps[step.id]}
          speechPronunciationScore={speechPronunciationScore}
          setSpeechPronunciationScore={setSpeechPronunciationScore}
          onRecordingComplete={onRecordingComplete}
          onReset={resetCurrentStep}
        />
      );
    case EXERCISE_KIND.CHECKPOINT:
      return (
        <CheckpointPanel
          step={step}
          complete={!!completedSteps[step.id]}
          speechPronunciationScore={speechPronunciationScore}
          setSpeechPronunciationScore={setSpeechPronunciationScore}
          onRecordingComplete={onRecordingComplete}
          onReset={resetCurrentStep}
        />
      );
    default:
      return null;
  }
}

function ImitationStepPanel({
  step,
  therapyWords,
  complete,
  speechPronunciationScore,
  setSpeechPronunciationScore,
  onRecordingComplete,
  onReset,
}: {
  step: Extract<CurriculumStep, { type: typeof EXERCISE_KIND.IMIATION }>;
  therapyWords: TherapyWord[];
  complete: boolean;
  speechPronunciationScore: SpeechAPIResponse | null;
  setSpeechPronunciationScore: (v: SpeechAPIResponse | null) => void;
  onRecordingComplete: () => void;
  onReset: () => void;
}) {
  const w = getTherapyWordById(step.wordId, therapyWords);
  if (!w) return <p className="text-destructive text-sm">Missing word data.</p>;

  const showPhonemes = step.ui?.showPhonemeTiles !== false;

  return (
    <div className="grid md:grid-cols-2 gap-10 items-start">
      <WordDisplay
        word={w.word}
        images={w.images}
        category={w.category}
        phonemes={w.phonemes}
        showWord
        showPhonemes={showPhonemes}
        score={speechPronunciationScore?.text_score?.word_score_list?.[0]?.quality_score}
        isCorrect={speechPronunciationScore?.text_score?.word_score_list?.[0]?.quality_class}
      />
      <div className="space-y-6">
        <SpeakPromptBanner subtitle="Listen to the model word, then press record and echo it in your own clear voice." />
        {step.ui?.emphasis === 'listen_then_repeat' && (
          <p className="text-center text-sm font-semibold text-primary bg-primary/5 rounded-2xl py-3 px-4 border border-primary/15">
            Listen to the model, then repeat in your own voice.
          </p>
        )}
        <AudioControls
          word={w.word}
          onRecordingComplete={onRecordingComplete}
          hasRecording={complete}
          setSpeechPronunciationScore={setSpeechPronunciationScore}
        />
        {speechPronunciationScore?.text_score?.word_score_list?.[0]?.phone_score_list && (
          <PhonemeBreakdown
            phonemes={speechPronunciationScore.text_score.word_score_list[0].phone_score_list as any}
            wordScore={speechPronunciationScore.text_score.word_score_list[0].quality_score}
            isCorrect={speechPronunciationScore.text_score.word_score_list[0].quality_class}
          />
        )}
        {complete && (
          <div className="flex justify-center">
            <Button variant="ghost" size="sm" onClick={onReset} className="gap-2 rounded-xl">
              <RotateCcw className="w-4 h-4" /> Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function PhonemeCompletionPanel({
  step,
  therapyWords,
  complete,
  speechPronunciationScore,
  setSpeechPronunciationScore,
  onRecordingComplete,
  onReset,
}: {
  step: Extract<CurriculumStep, { type: typeof EXERCISE_KIND.PHONEME_COMPLETION }>;
  therapyWords: TherapyWord[];
  complete: boolean;
  speechPronunciationScore: SpeechAPIResponse | null;
  setSpeechPronunciationScore: (v: SpeechAPIResponse | null) => void;
  onRecordingComplete: () => void;
  onReset: () => void;
}) {
  const w = getTherapyWordById(step.wordId, therapyWords);
  if (!w) return <p className="text-destructive text-sm">Missing word data.</p>;

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      <SpeakPromptBanner subtitle="Say the whole word aloud. The tiles show the sounds — include the missing piece smoothly when you speak." />
      <WordDisplay word={w.word} images={w.images} category={w.category} phonemes={[]} showWord={false} showPhonemes={false} />
      <div className="flex flex-wrap gap-2 justify-center items-center">
        {step.phonemeSlots.map((slot, i) => (
          <span key={i} className="flex items-center gap-1">
            <span
              className={cn(
                'min-w-[2.75rem] px-3 py-2.5 rounded-xl font-mono font-bold text-lg border-2 transition-colors',
                slot === null
                  ? complete
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
                    : 'border-dashed border-primary/45 bg-primary/[0.06] text-muted-foreground animate-pulse'
                  : 'border-transparent bg-primary/12 text-primary',
              )}
            >
              {slot === null ? (complete ? step.correctOption : '?') : slot}
            </span>
            {i < step.phonemeSlots.length - 1 && <span className="text-muted-foreground font-bold">·</span>}
          </span>
        ))}
      </div>
      <div className="rounded-2xl border border-muted/60 bg-muted/20 px-4 py-3 text-center text-sm">
        <span className="text-muted-foreground">Say this word: </span>
        <span className="font-bold text-foreground">{w.word}</span>
        <span className="text-muted-foreground"> — “Correct sound” plays it if you want a model first.</span>
      </div>
      <AudioControls
        word={w.word}
        onRecordingComplete={onRecordingComplete}
        hasRecording={complete}
        setSpeechPronunciationScore={setSpeechPronunciationScore}
      />
      {speechPronunciationScore?.text_score?.word_score_list?.[0]?.phone_score_list && (
        <PhonemeBreakdown
          phonemes={speechPronunciationScore.text_score.word_score_list[0].phone_score_list as any}
          wordScore={speechPronunciationScore.text_score.word_score_list[0].quality_score}
          isCorrect={speechPronunciationScore.text_score.word_score_list[0].quality_class}
        />
      )}
      {complete && (
        <div className="flex justify-center">
          <Button variant="ghost" size="sm" onClick={onReset} className="gap-2 rounded-xl">
            <RotateCcw className="w-4 h-4" /> Practice again
          </Button>
        </div>
      )}
    </div>
  );
}

function ExpressiveLabelStepPanel({
  step,
  therapyWords,
  complete,
  speechPronunciationScore,
  setSpeechPronunciationScore,
  onRecordingComplete,
  onReset,
}: {
  step: Extract<CurriculumStep, { type: typeof EXERCISE_KIND.EXPRESSIVE_LABEL }>;
  therapyWords: TherapyWord[];
  complete: boolean;
  speechPronunciationScore: SpeechAPIResponse | null;
  setSpeechPronunciationScore: (v: SpeechAPIResponse | null) => void;
  onRecordingComplete: () => void;
  onReset: () => void;
}) {
  const w = getTherapyWordById(step.wordId, therapyWords);
  if (!w) return <p className="text-destructive text-sm">Missing word data.</p>;

  return (
    <div className="grid md:grid-cols-2 gap-10 items-start max-w-4xl mx-auto">
      <div className="space-y-4 md:col-span-2">
        <SpeakPromptBanner subtitle="Only the picture is shown — name what you see by speaking into the microphone." />
      </div>
      <div className="space-y-4">
        <WordDisplay
          word={w.word}
          images={w.images}
          category={w.category}
          phonemes={w.phonemes}
          showWord={false}
          showPhonemes={false}
          score={speechPronunciationScore?.text_score?.word_score_list?.[0]?.quality_score}
          isCorrect={speechPronunciationScore?.text_score?.word_score_list?.[0]?.quality_class}
        />
      </div>
      <div className="space-y-6">
        <AudioControls word={w.word} onRecordingComplete={onRecordingComplete} hasRecording={complete} setSpeechPronunciationScore={setSpeechPronunciationScore} />
        {speechPronunciationScore?.text_score?.word_score_list?.[0]?.phone_score_list && (
          <PhonemeBreakdown
            phonemes={speechPronunciationScore.text_score.word_score_list[0].phone_score_list as any}
            wordScore={speechPronunciationScore.text_score.word_score_list[0].quality_score}
            isCorrect={speechPronunciationScore.text_score.word_score_list[0].quality_class}
          />
        )}
        {complete && (
          <div className="flex justify-center">
            <Button variant="ghost" size="sm" onClick={onReset} className="gap-2 rounded-xl">
              <RotateCcw className="w-4 h-4" /> Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ReceptiveChoicePanel({
  step,
  therapyWords,
  complete,
  speechPronunciationScore,
  setSpeechPronunciationScore,
  onRecordingComplete,
  onReset,
}: {
  step: Extract<CurriculumStep, { type: typeof EXERCISE_KIND.RECEPTIVE_CHOICE }>;
  therapyWords: TherapyWord[];
  complete: boolean;
  speechPronunciationScore: SpeechAPIResponse | null;
  setSpeechPronunciationScore: (v: SpeechAPIResponse | null) => void;
  onRecordingComplete: () => void;
  onReset: () => void;
}) {
  const orderedIds = useMemo(() => {
    const ids = [...step.choiceWordIds];
    return step.shuffle ? seededShuffle(ids, step.id) : ids;
  }, [step.choiceWordIds, step.shuffle, step.id]);

  const isRow = step.layout === 'row';
  const target = getTherapyWordById(step.correctWordId, therapyWords);
  if (!target) return <p className="text-destructive text-sm">Missing word data.</p>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <SpeakPromptBanner subtitle="Pictures are for reference only — not buttons. Use Hear cue, decide which scene fits, then speak your answer. Correct sound models the expected word if you need support." />
      <div
        className={cn(
          'gap-4 mx-auto',
          isRow ? 'flex flex-row flex-wrap justify-center items-stretch' : 'grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl',
        )}
      >
        {orderedIds.map((wid, idx) => {
          const w = getTherapyWordById(wid, therapyWords);
          if (!w) return null;
          return (
            <motion.div
              key={wid}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                'relative rounded-3xl overflow-hidden border-4 shadow-lg border-white/90 ring-1 ring-black/5 min-w-[140px]',
                isRow ? 'flex-1 basis-[45%] sm:basis-[22%] max-w-[220px]' : '',
              )}
            >
              <div className="aspect-square w-full pointer-events-none select-none" aria-hidden>
                <TherapyImageCollage images={w.images} alt={`Picture ${idx + 1}`} />
              </div>
              <span className="sr-only">Picture {idx + 1}</span>
            </motion.div>
          );
        })}
      </div>
      <AudioControls
        word={target.word}
        onRecordingComplete={onRecordingComplete}
        hasRecording={complete}
        setSpeechPronunciationScore={setSpeechPronunciationScore}
      />
      {speechPronunciationScore?.text_score?.word_score_list?.[0]?.phone_score_list && (
        <PhonemeBreakdown
          phonemes={speechPronunciationScore.text_score.word_score_list[0].phone_score_list as any}
          wordScore={speechPronunciationScore.text_score.word_score_list[0].quality_score}
          isCorrect={speechPronunciationScore.text_score.word_score_list[0].quality_class}
        />
      )}
      {complete && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-bold text-emerald-700 capitalize">Nice — {target.word}</p>
          <Button variant="ghost" size="sm" onClick={onReset} className="gap-2 rounded-xl">
            <RotateCcw className="w-4 h-4" /> Practice again
          </Button>
        </div>
      )}
    </div>
  );
}

function WordCompletionPanel({
  step,
  therapyWords,
  complete,
  speechPronunciationScore,
  setSpeechPronunciationScore,
  onRecordingComplete,
  onReset,
}: {
  step: Extract<CurriculumStep, { type: typeof EXERCISE_KIND.WORD_COMPLETION }>;
  therapyWords: TherapyWord[];
  complete: boolean;
  speechPronunciationScore: SpeechAPIResponse | null;
  setSpeechPronunciationScore: (v: SpeechAPIResponse | null) => void;
  onRecordingComplete: () => void;
  onReset: () => void;
}) {
  const w = getTherapyWordById(step.wordId, therapyWords);
  if (!w) return <p className="text-destructive text-sm">Missing word data.</p>;

  const speakTarget = step.expectedSpeakWord;

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <SpeakPromptBanner subtitle="Read the hint letters, then say the full word aloud — match the model under Correct sound if needed." />
      <div className="flex flex-col lg:flex-row gap-10 items-center justify-center">
        <div className="flex-shrink-0 w-full max-w-xs">
          <WordDisplay word={w.word} images={w.images} category={w.category} phonemes={[]} showWord={false} showPhonemes={false} />
        </div>
        <div className="flex flex-col items-center gap-8 flex-1 w-full">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-2"
          >
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Say the full word</p>
            <p className="text-4xl sm:text-5xl font-extrabold tracking-tight text-primary wrap-break-word">{step.partialDisplay}</p>
          </motion.div>
          <AudioControls
            word={speakTarget}
            onRecordingComplete={onRecordingComplete}
            hasRecording={complete}
            setSpeechPronunciationScore={setSpeechPronunciationScore}
          />
          {speechPronunciationScore?.text_score?.word_score_list?.[0]?.phone_score_list && (
            <PhonemeBreakdown
              phonemes={speechPronunciationScore.text_score.word_score_list[0].phone_score_list as any}
              wordScore={speechPronunciationScore.text_score.word_score_list[0].quality_score}
              isCorrect={speechPronunciationScore.text_score.word_score_list[0].quality_class}
            />
          )}
          {complete && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-lg font-bold text-emerald-700">{w.word} — great job!</p>
              <Button variant="ghost" size="sm" onClick={onReset} className="gap-2 rounded-xl">
                <RotateCcw className="w-4 h-4" /> Practice again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CheckpointPanel({
  step,
  complete,
  speechPronunciationScore,
  setSpeechPronunciationScore,
  onRecordingComplete,
  onReset,
}: {
  step: Extract<CurriculumStep, { type: typeof EXERCISE_KIND.CHECKPOINT }>;
  complete: boolean;
  speechPronunciationScore: SpeechAPIResponse | null;
  setSpeechPronunciationScore: (v: SpeechAPIResponse | null) => void;
  onRecordingComplete: () => void;
  onReset: () => void;
}) {
  const phrase = step.speakPhrase ?? "I'm ready";

  return (
    <div className="flex flex-col items-center text-center gap-6 py-4 max-w-xl mx-auto">
      <motion.div
        animate={step.celebrate ? { scale: [1, 1.06, 1], rotate: [0, 2, -2, 0] } : {}}
        transition={{ duration: 1.2, repeat: step.celebrate ? Infinity : 0, repeatDelay: 2 }}
        className={cn(
          'rounded-full p-6',
          step.celebrate ? 'bg-gradient-to-br from-amber-200/80 to-primary/20 text-primary' : 'bg-muted text-muted-foreground',
        )}
      >
        <PartyPopper className={cn('w-14 h-14', step.celebrate && 'drop-shadow-md')} />
      </motion.div>
      <p className="text-lg text-muted-foreground leading-relaxed">{step.body}</p>
      <SpeakPromptBanner subtitle={`Say this short phrase aloud after reading it: "${phrase}" — then use Next when you are ready.`} />
      <div className="w-full max-w-md rounded-2xl border bg-muted/25 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Say aloud</p>
        <p className="text-xl font-extrabold text-foreground">{phrase}</p>
      </div>
      <AudioControls
        word={phrase}
        onRecordingComplete={onRecordingComplete}
        hasRecording={complete}
        setSpeechPronunciationScore={setSpeechPronunciationScore}
      />
      {speechPronunciationScore?.text_score?.word_score_list?.[0]?.phone_score_list && (
        <PhonemeBreakdown
          phonemes={speechPronunciationScore.text_score.word_score_list[0].phone_score_list as any}
          wordScore={speechPronunciationScore.text_score.word_score_list[0].quality_score}
          isCorrect={speechPronunciationScore.text_score.word_score_list[0].quality_class}
        />
      )}
      {complete && (
        <div className="flex flex-col gap-2 items-center">
          <p className="text-sm font-semibold text-emerald-700">Ready — continue when you like.</p>
          <Button variant="ghost" size="sm" onClick={onReset} className="gap-2 rounded-xl">
            <RotateCcw className="w-4 h-4" /> Record phrase again
          </Button>
        </div>
      )}
      {!complete && <p className="text-xs text-muted-foreground">Record once to unlock Next for this break.</p>}
    </div>
  );
}
