import api from "@/utils/api";
import { QuestionWithAnswers } from "@/types/onboarding";

export const onboardingAPI = {
  getAllQuestions: async (): Promise<QuestionWithAnswers[]> =>
    api.get("/api/on-boarding").then((res) => res.data.data),
  saveAnswers: async (answers: { questionId: string; answerId: string }[]) =>
    api.post("/api/on-boarding/save", { answers }).then((res) => {
      console.log("Save API Response:", answers);
      return res.data;
    }),
};
