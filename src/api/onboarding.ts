import api from "@/utils/api";
import { AssessmentProfile, QuestionWithAnswers } from "@/types/onboarding";

export interface SubmitOnboardingRequest {
  name: string;
  age: string;
  diagnosis: string;
  gender: 0 | 1;
  profile: AssessmentProfile;
}

export const onboardingAPI = {
  getAllQuestions: async (): Promise<QuestionWithAnswers[]> =>
    api.get("/api/on-boarding").then((res) => res.data.data),
  saveAnswers: async (answers: { questionId: string; answerId: string }[]) =>
    api.post("/api/on-boarding/save", { answers }).then((res) => {
      console.log("Save API Response:", answers);
      return res.data;
    }),
    submitOnboarding: async (data: SubmitOnboardingRequest) =>
    api.post("/api/on-boarding/submit", data).then((res) => {
      console.log("Submit API Response:", data);
      return res.data;
    }),
  getChildInfo: async () =>
    api.get("/api/on-boarding/child-info").then((res) => res.data.data),
  updateChildInfo: async (data: { name: string; age: string }) =>
    api.put("/api/on-boarding/child-info", data).then((res) => res.data),
};
  
