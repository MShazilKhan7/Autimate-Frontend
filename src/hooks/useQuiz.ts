import { useQuery } from '@tanstack/react-query';
import { quizAPI } from '@/api/quiz';

export const useQuiz = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['questions'],
    queryFn: quizAPI.getAllQuestions,
    refetchOnWindowFocus: false,
  });

  const questions = data?.data ?? [];

  return {
    questions,
    isQuestionsLoading: isLoading,
    questionsError: error,
  };
};