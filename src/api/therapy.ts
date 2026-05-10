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
   MODULE STEP
========================= */

export type ModuleStepType =
  | "imitation"
  | "expressive"
  | "phoneme"
  | "checkpoint";

export interface ModuleStep {
  _id?: string;

  type: ModuleStepType;

  // can be populated object OR just id
  wordId?: string | SpeechTherapyWord;

  title: string;
  phase: string;
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
    api
      .put(`/api/speech-therapy/modules/${id}`, data)
      .then((res) => res.data),

  delete: (id: string) =>
    api
      .delete(`/api/speech-therapy/modules/${id}`)
      .then((res) => res.data),
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
    api
      .put(`/api/speech-therapy/words/${id}`, data)
      .then((res) => res.data),

  delete: (id: string) =>
    api
      .delete(`/api/speech-therapy/words/${id}`)
      .then((res) => res.data),
};