import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { onboardingAPI } from '@/api/onboarding';
import { useToast } from '@/hooks/use-toast';
export const useQuiz = () => {
  const {toast} = useToast();
  const navigate = useNavigate();

  // Fetch questions
  const { data, isLoading: isQuestionsLoading, error: questionsError } = useQuery({
    queryKey: ['questions'],
    queryFn: onboardingAPI.getAllQuestions,
    refetchOnWindowFocus: false,
  });

  const questions = data ?? [];

  // Save quiz responses
  const {
    mutate: submitQuiz,
    isPending: isSubmitting,
    isSuccess,
    isError,
    error: submitError,
  } = useMutation({
    mutationFn: onboardingAPI.saveAnswers,
    onSuccess: () => {
      navigate('/dashboard');
      localStorage.removeItem("onboardingProgress");
      toast({
        title: "Assessment Complete!",
        description: `Thank you! Let's begin the therapy journey!`,
      });
    },
  });

  return {
    // questions
    questions,
    isQuestionsLoading,
    questionsError,

    // answers state
    submitQuiz,
    isSubmitting,
    isSuccess,
    isError,
    submitError,
  };
};
