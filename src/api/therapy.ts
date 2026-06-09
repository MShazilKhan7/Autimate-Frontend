import api from "@/utils/api";

/* =========================
   WORD
========================= */

export interface SpeechTherapyWord {
  _id?: string;
  word: string;
  emoji: string;
  phonemes: string[];
  images?: string[];
  videos?: string[];
  category: string;
  color: string;
  createdAt?: string;
  updatedAt?: string;
}

/* =========================
   MODULE STEP (updated to match backend)
========================= */

export type ExerciseType =
  | "imitation"
  | "identify"
  | "expressive"
  | "functional"
  | "checkpoint";

export type DifficultyLevel = "easy" | "medium" | "hard";

export interface ExerciseConfig {
  prompt?: string;
  video?: string;
  image?: string;
  distractorWordIds?: string[] | SpeechTherapyWord[];
}

export interface ModuleStep {
  _id?: string;
  type: ExerciseType;
  wordId?: string | SpeechTherapyWord;
  title: string;
  order: number;
  difficulty?: DifficultyLevel;
  config?: ExerciseConfig;
}

/* =========================
   MODULE
========================= */

export interface SpeechTherapyModule {
  _id?: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  colorLight: string;
  steps: ModuleStep[];
  createdAt?: string;
  updatedAt?: string;
}

/* =========================
   SESSION / ATTEMPT
========================= */

export interface PhoneScore {
  phone: string;
  score: number;
}

export interface SessionAttempt {
  _id?: string;
  quality_score: number;
  quality_class: boolean;
  phone_score_list: PhoneScore[];
  llmFeedback?: string;
  createdAt?: string;
}

export interface TherapySession {
  _id?: string;
  userId: string;
  wordId: string;
  attempts: SessionAttempt[];
}

/* =========================
   HELPERS
========================= */

export function resolveWord(step: ModuleStep): SpeechTherapyWord | null {
  if (!step.wordId) return null;
  if (typeof step.wordId === "object") return step.wordId as SpeechTherapyWord;
  return null;
}

export function resolveDistractors(
  config?: ExerciseConfig
): SpeechTherapyWord[] {
  if (!config?.distractorWordIds) return [];
  return (config.distractorWordIds as SpeechTherapyWord[]).filter(
    (d) => typeof d === "object"
  );
}

/* =========================
   MODULES API
========================= */

export const therapyModulesAPI = {
  getAll: () =>
    api.get("/api/speech-therapy/modules").then((res) => res.data),

  getById: (id: string) =>
    api.get(`/api/speech-therapy/modules/${id}`).then((res) => res.data),

  create: (data: SpeechTherapyModule) =>
    api.post("/api/speech-therapy/modules", data).then((res) => res.data),

  update: (id: string, data: Partial<SpeechTherapyModule>) =>
    api.put(`/api/speech-therapy/modules/${id}`, data).then((res) => res.data),

  delete: (id: string) =>
    api.delete(`/api/speech-therapy/modules/${id}`).then((res) => res.data),
};

/* =========================
   WORDS API
========================= */

export const therapyWordsAPI = {
  getAll: () =>
    api.get("/api/speech-therapy/words").then((res) => res.data),

  getById: (id: string) =>
    api.get(`/api/speech-therapy/words/${id}`).then((res) => res.data),

  create: (data: SpeechTherapyWord) =>
    api.post("/api/speech-therapy/words", data).then((res) => res.data),

  update: (id: string, data: Partial<SpeechTherapyWord>) =>
    api.put(`/api/speech-therapy/words/${id}`, data).then((res) => res.data),

  delete: (id: string) =>
    api.delete(`/api/speech-therapy/words/${id}`).then((res) => res.data),
};