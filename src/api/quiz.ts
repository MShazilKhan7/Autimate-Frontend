import api from '@/utils/api';
import { QuestionWithAnswers } from '@/types/quiz';

export const quizAPI = {
  getAllQuestions: async (): Promise<QuestionWithAnswers[]> =>
    api.get('/api/questions/').then((res) => res.data),
};
