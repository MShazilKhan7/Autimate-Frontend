// pages/SpeechTherapy/StepPage.tsx
/**
 * Route: /therapy/:moduleId/steps/:stepIndex
 *
 * • Fetches the module by id
 * • Resolves the current step from the URL param
 * • Dispatches to the correct exercise component
 * • Wraps everything in SessionShell (progress bar, nav buttons, etc.)
 */
import { useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import Layout from "@/components/Layout/Layout";
import SessionShell from "@/components/Therapy/exercises/sessionShell";
import ImitationExercise from "@/components/Therapy/exercises/imitation";
import IdentifyExercise from "@/components/Therapy/exercises/identify";
import ExpressiveExercise from "@/components/Therapy/exercises/expressive";
import FunctionalExercise from "@/components/Therapy/exercises/functional";
import CheckpointExercise from "@/components/Therapy/exercises/checkpoint";
import { Button } from "@/components/ui/button";

import {
  therapyModulesAPI,
  SpeechTherapyModule,
  ModuleStep,
} from "@/api/therapy";
import { useAuth } from "@/hooks/useAuth";
import { useSession } from "@/hooks/useSession";

/* ─── Module completion screen ─── */
function ModuleComplete({
  mod,
  onRestart,
  onBack,
}: {
  mod: SpeechTherapyModule;
  onRestart: () => void;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/90 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-10 max-w-sm w-full text-center space-y-6"
      >
        <div
          className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl shadow-lg"
          style={{ background: mod.colorLight }}
        >
          {mod.emoji}
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-foreground">
            Module Complete! 🎉
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            You finished <strong>{mod.title}</strong>. Great work!
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button
            onClick={onRestart}
            className="rounded-2xl py-5 font-bold text-white"
            style={{ background: mod.color }}
          >
            Restart Module
          </Button>
          <Button
            variant="outline"
            onClick={onBack}
            className="rounded-2xl py-5 font-semibold"
          >
            Back to Modules
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── main page ─── */
export default function StepPage() {
  const navigate = useNavigate();
  const { moduleId, stepIndex: stepParam } = useParams<{
    moduleId: string;
    stepIndex: string;
  }>();
  const { isLoggedIn, user } = useAuth();

  const stepIndex = parseInt(stepParam ?? "0", 10);

  const [isReset, setIsReset] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) navigate("/auth");
  }, [isLoggedIn, navigate]);

  /* ── fetch module ── */
  const { data: mod, isLoading } = useQuery<SpeechTherapyModule>({
    queryKey: ["speech-therapy-module", moduleId],
    queryFn: () =>
      therapyModulesAPI.getById(moduleId!).then((res) => res.data ?? res),
    enabled: !!moduleId,
  });

  /* ── completed step keys ── */
  const [completedStepKeys, setCompletedStepKeys] = useState<Set<string>>(
    new Set()
  );
  const [finished, setFinished] = useState(false);

  const steps: ModuleStep[] = mod?.steps ?? [];
  const currentStep: ModuleStep | undefined = steps[stepIndex];
  const stepKey =
    currentStep?._id ?? `${moduleId}-${stepIndex}`;

  /* ── session (last attempt) ── */
  const targetWord =
    currentStep && typeof currentStep.wordId === "object"
      ? (currentStep.wordId as any)
      : null;
  const { session } = useSession(user?.id, targetWord?._id);
  const lastAttempt = session?.attempts?.[session.attempts.length - 1] ?? null;

  /* ── navigate helpers ── */
  const goTo = useCallback(
    (idx: number) => {
      navigate(`/therapy/${moduleId}/steps/${idx}`);
    },
    [navigate, moduleId]
  );

  const handleComplete = useCallback(() => {
    setCompletedStepKeys((prev) => new Set([...prev, stepKey]));
  }, [stepKey]);

  const handleNext = useCallback(() => {
    if (stepIndex < steps.length - 1) {
      goTo(stepIndex + 1);
    }
    handleComplete();
  }, [stepIndex, steps.length, goTo]);

  const handlePrev = useCallback(() => {
    if (stepIndex > 0) goTo(stepIndex - 1);
  }, [stepIndex, goTo]);

  const handleReset = useCallback(() => {
    setCompletedStepKeys((prev) => {
      const n = new Set(prev);
      n.delete(stepKey);
      return n;
    });
    setIsReset(true);
  }, [stepKey]);

  const handleFinish = () => setFinished(true);

  /* ── loading ── */
  if (isLoading || !mod) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!steps.length) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">This module has no steps.</p>
          <Button onClick={() => navigate("/therapy")}>
            Back to Modules
          </Button>
        </div>
      </Layout>
    );
  }

  /* ── module finished ── */
  if (finished) {
    return (
      <Layout>
        <ModuleComplete
          mod={mod}
          onRestart={() => {
            setFinished(false);
            setCompletedStepKeys(new Set());
            goTo(0);
          }}
          onBack={() => navigate("/therapy")}
        />
      </Layout>
    );
  }

  /* ── guard out-of-bounds ── */
  if (!currentStep) {
    goTo(0);
    return null;
  }

  const isLastStep = stepIndex === steps.length - 1;
  const hasRecording = completedStepKeys.has(stepKey);

  /* ── render exercise ── */
  const renderExercise = () => {
    const type = currentStep.type;

    if (type === "imitation") {
      return (
        <ImitationExercise
          step={currentStep}
          accentColor={mod.color}
          onComplete={handleComplete}
          initialAttempt={lastAttempt as any}
        />
      );
    }

    if (type === "identify") {
      return (
        <IdentifyExercise
          step={currentStep}
          accentColor={mod.color}
          onComplete={handleComplete}
          isReset={isReset}
          onResetHandled={() => setIsReset(false)}
        />
      );
    }

    if (type === "expressive") {
      return (
        <ExpressiveExercise
          step={currentStep}
          accentColor={mod.color}
          onComplete={handleComplete}
          initialAttempt={lastAttempt as any}
        />
      );
    }

    if (type === "functional") {
      return (
        <FunctionalExercise
          step={currentStep}
          accentColor={mod.color}
          onComplete={handleComplete}
          initialAttempt={lastAttempt as any}
        />
      );
    }

    if (type === "checkpoint") {
      return (
        <CheckpointExercise
          step={currentStep}
          accentColor={mod.color}
          completedCount={completedStepKeys.size}
          totalSteps={steps.length}
          onComplete={() => {
            handleComplete();
            if (!isLastStep) handleNext();
          }}
        />
      );
    }

    // fallback
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
        <p className="text-sm">Unknown exercise type: {type}</p>
      </div>
    );
  };

  return (
    <Layout>
      <SessionShell
        module={mod}
        steps={steps}
        stepIndex={stepIndex}
        completedStepKeys={completedStepKeys}
        stepKey={stepKey}
        hasRecording={hasRecording}
        onPrev={handlePrev}
        onNext={handleNext}
        onReset={handleReset}
        onFinish={handleFinish}
        onJumpTo={goTo}
      >
        {renderExercise()}
      </SessionShell>
    </Layout>
  );
}