import api from "@/utils/api";

export interface SpeechTherapyWord {
  _id?: string;
  word: string;
  image: string;
  category: string;
  phonemes: string[];
  mockResponse?: any;
}

export const therapyAPI = {
  getAll: () => api.get("/api/speech-therapy").then(res => res.data),
};
