// services/sessionAPI.ts

import api from "@/utils/api";
import { Session, Attempt } from "@/types/session";

export const sessionAPI = {
  // CREATE SESSION / ADD ATTEMPT
  createOrUpdateSession: async (payload: {
    userId: string;
    wordId: string;
    word: string;
    attempt: Omit<Attempt, "_id" | "createdAt">;
  }) =>
    api
      .post<{
        success: boolean;
        message: string;
        data: Session;
      }>("/api/sessions/", payload)
      .then((res) => res.data),

  // GET ALL SESSIONS
  getAllSessions: async () =>
    api
      .get<{
        success: boolean;
        count: number;
        data: Session[];
      }>("/api/sessions/")
      .then((res) => res.data),

  // GET SESSION BY USER + WORD
  getSessionByUserAndWord: async (userId: string, wordId: string) =>
    api
      .get<{
        success: boolean;
        data: Session;
      }>(`/api/sessions/user/${userId}/word/${wordId}`)
      .then((res) => res.data),

  // GET SINGLE SESSION
  getSingleSession: async (sessionId: string) =>
    api
      .get<{
        success: boolean;
        data: Session;
      }>(`/api/sessions/${sessionId}`)
      .then((res) => res.data),

  getAllSessionsByUserId: async (userId: string) =>
    api
      .get<{
        success: boolean;
        data: Session[];
      }>(`/api/sessions/user/${userId}`)
      .then((res) => res.data),
  // UPDATE ATTEMPT FEEDBACK
  updateAttemptFeedback: async (
    sessionId: string,
    attemptId: string,
    payload: {
      llmFeedback: string;
    },
  ) =>
    api
      .patch<{
        success: boolean;
        message: string;
        data: Session;
      }>(`/api/sessions/${sessionId}/attempt/${attemptId}/feedback`, payload)
      .then((res) => res.data),

  // DELETE SINGLE ATTEMPT
  deleteAttempt: async (sessionId: string, attemptId: string) =>
    api
      .delete<{
        success: boolean;
        message: string;
        data: Session;
      }>(`/api/sessions/${sessionId}/attempt/${attemptId}`)
      .then((res) => res.data),

  // DELETE SESSION
  deleteSession: async (sessionId: string) =>
    api
      .delete<{
        success: boolean;
        message: string;
      }>(`/api/sessions/${sessionId}`)
      .then((res) => res.data),
};
