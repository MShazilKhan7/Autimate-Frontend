import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import QuestionCard from "@/components/Onboarding/QuestionCard";
import { useToast } from "@/hooks/use-toast";
import { useQuiz } from "@/hooks/useOnboarding";
import { QuestionWithAnswers } from "@/types/onboarding";

interface AnswerData {
  questionId: string;
  answerText: string;
  answerId: string;
}

export default function Onboarding() {
  const { questions, isQuestionsLoading, questionsError , submitQuiz } = useQuiz();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerData[]>([]);
  const [isCompleting, setIsCompleting] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  const currentQuestion: QuestionWithAnswers | undefined =
    questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  useEffect(() => {
    if (questions.length > 0) {
      const savedProgress = localStorage.getItem("onboardingProgress");
      if (savedProgress) {
        try {
          const progress = JSON.parse(savedProgress);
          setAnswers(progress.answers || []);

          if (progress.answers && progress.answers.length > 0) {
            const lastAnsweredQuestionId =
              progress.answers[progress.answers.length - 1].questionId;
            const lastAnsweredIndex = questions.findIndex(
              (q) => q._id === lastAnsweredQuestionId
            );

            if (
              lastAnsweredIndex !== -1 &&
              lastAnsweredIndex < questions.length - 1
            ) {
              setCurrentQuestionIndex(lastAnsweredIndex + 1);
            } else if (lastAnsweredIndex === questions.length - 1) {
              setCurrentQuestionIndex(lastAnsweredIndex);
            }
          }
        } catch (error) {
          console.error("Error loading saved progress:", error);
          localStorage.removeItem("onboardingProgress");
        }
      }
    }
  }, [questions.length]);

  const handleAnswerSelect = (answerId: string, answerText: string) => {
    if (!currentQuestion) return;

    const newAnswer: AnswerData = {
      questionId: currentQuestion._id,
      answerText: answerText,
      answerId: answerId,
    };

    setAnswers((prev) => {
      const filteredAnswers = prev.filter(
        (ans) => ans.questionId !== currentQuestion._id
      );
      return [...filteredAnswers, newAnswer];
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      const progress = {
        answers,
        currentQuestionIndex,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem("onboardingProgress", JSON.stringify(progress));
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((prev) => prev - 1);
  };
  function buildQAJson(pairs: AnswerData[]) {
    return {
      answers: pairs.map((p) => ({
        questionId: p.questionId,
        answerId: p.answerId,
      })),
    };
  }

  const handleComplete = () => {
    setIsCompleting(true);

    const finalProgress = {
      answers,
      completed: true,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem("onboardingProgress", JSON.stringify(finalProgress));

    const json = buildQAJson(finalProgress.answers);
    console.log(json);
    submitQuiz(json)

    setTimeout(() => {
      toast({
        title: "Assessment Complete!",
        description: `Thank you! Let's begin the therapy journey!`,
      });
      setIsCompleting(false);
      // navigate("/dashboard");
    }, 1000);
  };

  // Check if current question is answered
  const isCurrentQuestionAnswered = currentQuestion
    ? answers.some((ans) => ans.questionId === currentQuestion._id)
    : false;

  const canGoNext = isCurrentQuestionAnswered;
  const canGoPrevious = currentQuestionIndex > 0;

  // Get selected answer for current question
  const getSelectedAnswerForCurrentQuestion = () => {
    if (!currentQuestion) return undefined;
    const answerData = answers.find(
      (ans) => ans.questionId === currentQuestion._id
    );
    return answerData?.answerText;
  };

  if (isQuestionsLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading questions...
      </div>
    );

  if (questionsError)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load questions.
      </div>
    );

  if (isCompleting) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="absolute inset-0 warm-gradient opacity-50" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-8xl mb-6"
          >
            🌈
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-therapy-xl text-primary mb-4"
          >
            Assessment Complete!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-muted-foreground"
          >
            Preparing your personalized therapy experience...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) return <div>No questions available</div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 warm-gradient opacity-50" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-therapy-xl text-primary mb-2">
            Getting to know your child
          </h1>
          <p className="text-muted-foreground">
            These questions help us create the best therapy experience
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={getSelectedAnswerForCurrentQuestion()}
            onAnswerSelect={handleAnswerSelect}
            onNext={handleNext}
            onPrevious={handlePrevious}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
          />
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
