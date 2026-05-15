// hooks/useSession.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sessionAPI } from "@/api/session";
import { Attempt } from "@/types/session";
import { ScoreSpeechRequest } from "@/types/speechace";
import api from "@/utils/api";

export const useSession = (
  userId?: string,
  wordId?: string,
  sessionId?: string,
) => {
  const queryClient = useQueryClient();

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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["session", userId, wordId],
      });

      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["user-sessions", userId],
      });
    },
  });

  // GET ALL SESSIONS BY USER ID
  const { data: userSessions, isLoading: isUserSessionsLoading } = useQuery({
    queryKey: ["user-sessions", userId],
    queryFn: () => sessionAPI.getAllSessionsByUserId(userId!),
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });

  // GET SESSION BY USER + WORD
  const {
    data: sessionData,
    isLoading: isSessionLoading,
    refetch: refetchSession,
  } = useQuery({
    queryKey: ["session", userId, wordId],

    queryFn: () => sessionAPI.getSessionByUserAndWord(userId!, wordId!),

    enabled: !!userId && !!wordId,

    refetchOnWindowFocus: false,
  });

  // GET SINGLE SESSION
  const { data: singleSession, isLoading: isSingleSessionLoading } = useQuery({
    queryKey: ["single-session", sessionId],

    queryFn: () => sessionAPI.getSingleSession(sessionId!),

    enabled: !!sessionId,

    refetchOnWindowFocus: false,
  });

  // GET ALL SESSIONS
  const { data: sessions, isLoading: isSessionsLoading } = useQuery({
    queryKey: ["sessions"],

    queryFn: sessionAPI.getAllSessions,

    refetchOnWindowFocus: false,
  });

  // CREATE SESSION / ADD ATTEMPT
  const {
    mutate: createOrUpdateSession,

    isPending: isCreateOrUpdatePending,
  } = useMutation({
    mutationFn: sessionAPI.createOrUpdateSession,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["session", userId, wordId],
      });

      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });
    },
  });

  // UPDATE ATTEMPT FEEDBACK
  const {
    mutate: updateAttemptFeedback,

    isPending: isUpdateFeedbackPending,
  } = useMutation({
    mutationFn: ({
      sessionId,
      attemptId,
      payload,
    }: {
      sessionId: string;

      attemptId: string;

      payload: {
        llmFeedback: string;
      };
    }) => sessionAPI.updateAttemptFeedback(sessionId, attemptId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["session", userId, wordId],
      });
    },
  });

  // DELETE ATTEMPT
  const {
    mutate: deleteAttempt,

    isPending: isDeleteAttemptPending,
  } = useMutation({
    mutationFn: ({
      sessionId,
      attemptId,
    }: {
      sessionId: string;

      attemptId: string;
    }) => sessionAPI.deleteAttempt(sessionId, attemptId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["session", userId, wordId],
      });

      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });
    },
  });

  // DELETE SESSION
  const {
    mutate: deleteSession,

    isPending: isDeleteSessionPending,
  } = useMutation({
    mutationFn: sessionAPI.deleteSession,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });
    },
  });

  return {
    //SCORING
    pronunciationScore,
    scoreSpeech,
    isScoring,
    isSuccess,
    isError,
    submitError,

    // DATA
    session: sessionData?.data ?? null,
    singleSession: singleSession?.data ?? null,
    sessions: sessions?.data ?? [],

    // LOADING
    isSessionLoading,
    isSingleSessionLoading,
    isSessionsLoading,
    isCreateOrUpdatePending,
    isUpdateFeedbackPending,
    isDeleteAttemptPending,
    isDeleteSessionPending,

    // ACTIONS
    refetchSession,
    createOrUpdateSession,
    updateAttemptFeedback,
    deleteAttempt,
    deleteSession,

    // DATA
    userSessions: userSessions?.data ?? [],

    // LOADING
    isUserSessionsLoading,
  };
};
