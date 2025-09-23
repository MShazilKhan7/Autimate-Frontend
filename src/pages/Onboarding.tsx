import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionCard from '@/components/Onboarding/QuestionCard';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';
import onboardingQuestions from '@/data/onboardingQuestions.json';

export default function Onboarding() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isCompleting, setIsCompleting] = useState(false);

  const { state, dispatch } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if not authenticated or no child info
  useEffect(() => {
    if (!state.user?.isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (!state.child) {
      navigate('/child-info');
      return;
    }
  }, [state.user, state.child, navigate]);

  const currentQuestion = onboardingQuestions[currentQuestionIndex];
  const totalQuestions = onboardingQuestions.length;

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: answer,
    };
    setAnswers(newAnswers);

    // Update context
    dispatch({
      type: 'SET_ONBOARDING_ANSWER',
      payload: { questionId: currentQuestion.id, answer },
    });
  };

  const handleNext = async () => {
    if (currentQuestionIndex === totalQuestions - 1) {
      // Complete onboarding
      setIsCompleting(true);
      
      setTimeout(() => {
        dispatch({ type: 'COMPLETE_ONBOARDING' });
        
        toast({
          title: 'Assessment Complete!',
          description: `Thank you for providing information about ${state.child?.name}. Let's begin the therapy journey!`,
        });
        
        setIsCompleting(false);
        navigate('/dashboard');
      }, 2000);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const canGoNext = answers[currentQuestion?.id] !== undefined;
  const canGoPrevious = currentQuestionIndex > 0;

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
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
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

        {/* Floating celebration elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, y: 100 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [100, -100],
              x: [0, (Math.random() - 0.5) * 200],
            }}
            transition={{
              duration: 3,
              delay: i * 0.2,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            className="absolute text-4xl"
            style={{
              left: `${20 + i * 10}%`,
              bottom: 0,
            }}
          >
            {['🎉', '🎈', '⭐', '🌟', '✨', '🎊'][i]}
          </motion.div>
        ))}
      </div>
    );
  }

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

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
            Getting to know {state.child?.name}
          </h1>
          <p className="text-muted-foreground">
            These questions help us create the best therapy experience
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentQuestionIndex}
            question={currentQuestion}
            selectedAnswer={answers[currentQuestion.id]}
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