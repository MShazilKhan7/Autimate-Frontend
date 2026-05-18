// types/session.ts

export interface PhoneScore {
  phone: string;
  quality_score: number;
  sound_most_like?: string;
}

export interface Attempt {
  _id: string;
  word: string;
  quality_score: number;
  quality_class: string;
  phone_score_list: PhoneScore[];
  llmFeedback?: string;
  createdAt: string;
}

export interface Session {
  hasReport: boolean;
  _id: string;
  userId: string;
  wordId: string;
  word: string;
  attempts: Attempt[];
  createdAt: string;
  updatedAt: string;
}