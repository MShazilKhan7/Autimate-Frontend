import { useMutation } from "@tanstack/react-query";
import api from "@/utils/api";

interface AIFeedbackPayload {
  id: number;
  word: string;
  image?: string;
  category?: string;
  phonemes?: string[];
  mockResponse: any;
}

interface AIFeedbackResponse {
  success: boolean;
  word: string;
  overallScore: number;
  passed: boolean;
  feedback: string;
}

export function useAIFeedback() {
  const {
    data: feedbackData,
    mutate: generateFeedback,
    isPending: isGenerating,
    isSuccess,
    isError,
    error: feedbackError,
    reset,
  } = useMutation<AIFeedbackResponse, Error, AIFeedbackPayload>({
    mutationFn: async (payload) => {
      const response = await api.post("/api/ai/generate", payload, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    },
  });

  return {
    feedbackData,
    feedbackText: feedbackData?.feedback ?? null,
    generateFeedback,
    isGenerating,
    isSuccess,
    isError,
    feedbackError,
    reset,
  };
}