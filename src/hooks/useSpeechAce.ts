import { useMutation } from "@tanstack/react-query";
import api from "@/utils/api";

export function useScoreSpeech() {
  const {
    data: pronunciationScore,
    mutate: scoreSpeech,
    isPending: isScoring,
    isSuccess,
    isError,
    error: submitError,
  } = useMutation<any, Error, { text: string; audio: Blob | File }>({
    mutationFn: async (payload) => {
      const formData = new FormData();
      formData.append("text", payload.text);
      formData.append("audio", payload.audio);

      const response = await api.post("/api/score-speech", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data; // return scoring result
    },
  });

  return { pronunciationScore, scoreSpeech, isScoring, isSuccess, isError, submitError };
}
