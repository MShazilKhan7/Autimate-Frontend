// components/Therapy/SessionShell.tsx
import { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpeechTherapyModule, ModuleStep } from "@/api/therapy";

const STEP_TYPE_META: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  imitation:  { label: "Imitation",  bg: "bg-blue-100",   text: "text-blue-700" },
  identify:   { label: "Identify",   bg: "bg-violet-100", text: "text-violet-700" },
  expressive: { label: "Expressive", bg: "bg-amber-100",  text: "text-amber-700" },
  functional: { label: "Functional", bg: "bg-emerald-100",text: "text-emerald-700" },
  checkpoint: { label: "Checkpoint", bg: "bg-rose-100",   text: "text-rose-600" },
};

interface SessionShellProps {
  module: SpeechTherapyModule;
  steps: ModuleStep[];
  stepIndex: number;
  completedStepKeys: Set<string>;
  stepKey: string;
  hasRecording: boolean;
  children: ReactNode;
  onPrev: () => void;
  onNext: () => void;
  onReset?: () => void;
  onFinish: () => void;
  onJumpTo: (i: number) => void;
}

export default function SessionShell({
  module: mod,
  steps,
  stepIndex,
  completedStepKeys,
  stepKey,
  hasRecording,
  children,
  onPrev,
  onNext,
  onReset,
  onFinish,
  onJumpTo,
}: SessionShellProps) {
  const navigate = useNavigate();
  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;
  const progressPct = steps.length > 0 ? ((stepIndex + 1) / steps.length) * 100 : 0;
  const completedCount = completedStepKeys.size;
  const meta = STEP_TYPE_META[currentStep?.type ?? ""] ?? {
    label: currentStep?.type ?? "",
    bg: "bg-muted/30",
    text: "text-muted-foreground",
  };

  return (
    <div className="min-h-full bg-background">
      {/* decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] rounded-full bg-sky-200/20 blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8 max-w-5xl mx-auto">
        {/* ── top header ── */}
        <div className="flex items-center justify-between mb-7">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/therapy")}
            className="gap-2 rounded-xl font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            Modules
          </Button>

          <div className="flex items-center gap-3">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white"
              style={{ background: mod.color }}
            >
              <span>{mod.emoji}</span>
              {mod.title}
            </div>
            <div className="bg-white/80 backdrop-blur border border-white/60 shadow rounded-full px-4 py-1.5 text-sm font-bold text-foreground">
              {stepIndex + 1}
              <span className="text-muted-foreground font-normal">
                {" "}/ {steps.length}
              </span>
            </div>
          </div>
        </div>

        {/* ── progress bar ── */}
        <div className="mb-7">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>{completedCount} of {steps.length} steps completed</span>
            <span className="font-bold" style={{ color: mod.color }}>
              {Math.round(progressPct)}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-muted/20 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(to right, ${mod.color}, ${mod.colorLight})`,
              }}
            />
          </div>

          {/* step dots */}
          <div className="flex justify-center gap-1.5 mt-3 flex-wrap">
            {steps.map((s, i) => {
              const key = s._id ?? `${mod._id}-${i}`;
              const active = i === stepIndex;
              const done = completedStepKeys.has(key);
              return (
                <button
                  key={key}
                  onClick={() => onJumpTo(i)}
                  title={s.title}
                  className="transition-all duration-200 rounded-full"
                  style={{
                    width: active ? 20 : 10,
                    height: 10,
                    background: active
                      ? mod.color
                      : done
                      ? "#34d399"
                      : "rgba(0,0,0,0.12)",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* ── step type label ── */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${meta.bg} ${meta.text}`}>
            {meta.label}
          </span>
          {currentStep?.difficulty && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-muted/30 text-muted-foreground capitalize">
              {currentStep.difficulty}
            </span>
          )}
          <span className="ml-auto text-sm font-semibold text-foreground truncate max-w-[200px]">
            {currentStep?.title}
          </span>
        </div>

        {/* ── exercise card ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stepKey}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.28 }}
            className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl shadow-black/5 rounded-3xl p-6 md:p-10"
          >
            {children}
          </motion.div>
        </AnimatePresence>

        {/* ── bottom navigation ── */}
        <div className="flex items-center justify-between mt-6 gap-3">
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={stepIndex === 0}
            className="rounded-2xl gap-2 border-2 border-muted/40 font-semibold px-6 py-5 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {onReset && (currentStep.type === "identify" || hasRecording) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="rounded-xl gap-2 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-4 h-4" />
                Retry
              </Button>
            )}

            {isLastStep && hasRecording ? (
              <motion.div whileHover={{ scale: 1.04 }}>
                <Button
                  onClick={onFinish}
                  className="rounded-2xl gap-2 px-8 py-5 text-white font-bold shadow-lg"
                  style={{ background: mod.color }}
                >
                  <Sparkles className="w-4 h-4" />
                  Finish Module
                </Button>
              </motion.div>
            ) : (
              <Button
                onClick={onNext}
                disabled={isLastStep}
                className="rounded-2xl gap-2 px-8 py-5 text-white font-bold shadow-lg disabled:opacity-30"
                style={{ background: mod.color }}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}