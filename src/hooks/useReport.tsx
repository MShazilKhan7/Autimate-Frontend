// hooks/useReport.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { reportAPI } from "@/api/report";

export const useReport = (
  sessionId?: string,
  userId?: string,
  wordId?: string,
) => {
  const queryClient = useQueryClient();

  // GET REPORT
  const {
    data: reportData,
    isLoading: isReportLoading,
    refetch: refetchReport,
  } = useQuery({
    queryKey: ["report", sessionId],

    queryFn: () => reportAPI.getReportBySessionId(sessionId!),

    enabled: !!sessionId,

    refetchOnWindowFocus: false,
  });

  // GENERATE REPORT
  const {
    mutateAsync: generateReport,

    isPending: isGenerateReportPending,
  } = useMutation({
    mutationFn: (sessionId: string) =>
      reportAPI.generateReport(sessionId),

    onSuccess: () => {
      // REPORT CACHE
      queryClient.invalidateQueries({
        queryKey: ["report", sessionId],
      });

      // SESSION CACHE
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

  return {
    // DATA
    report: reportData?.report ?? null,

    // LOADING
    isReportLoading,
    isGenerateReportPending,

    // ACTIONS
    refetchReport,
    generateReport,
  };
};