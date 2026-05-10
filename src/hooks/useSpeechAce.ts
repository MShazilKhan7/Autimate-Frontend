import { useMutation } from "@tanstack/react-query";
import api from "@/utils/api";
import { ScoreSpeechRequest } from "@/types/speechace";

export function useScoreSpeech() {
  const {
    data: pronunciationScore,
    mutate: scoreSpeech,
    isPending: isScoring,
    isSuccess,
    isError,
    error: submitError,
  } = useMutation<any, Error, ScoreSpeechRequest>({
    mutationFn: async (payload) => {
      const formData = new FormData();
      formData.append("word", payload.word);
      formData.append("audio", payload.audio);
      formData.append("wordId", payload.wordId);

      const response = await api.post("/api/score-speech", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data; // return scoring result
    },
  });

  return { pronunciationScore, scoreSpeech, isScoring, isSuccess, isError, submitError };
}
