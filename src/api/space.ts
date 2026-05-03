import api from "@/utils/api";

export interface PracticeItem {
  id?: string;
  text: string;
  type: "letter" | "word" | "sentence";
  hint: string;
  emoji?: string;
}

export interface SpeechSpaceLevel {
  _id?: string;
  levelNumber: number;
  name: string;
  description: string;
  icon: string;
  starsRequired: number;
  items: PracticeItem[];
}

export const spaceAPI = {
  getAll: () => api.get("/api/speech-space").then(res => res.data),
};
