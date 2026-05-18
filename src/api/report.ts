// api/report.ts

import api from "@/utils/api";

export const reportAPI = {
  // GENERATE REPORT
  generateReport: async (sessionId: string) => {
    const response = await api.post(
      `/api/reports/generate/${sessionId}`,
    );

    return response.data;
  },

  // GET REPORT BY SESSION ID
  getReportBySessionId: async (sessionId: string) => {
    const response = await api.get(`/api/reports/${sessionId}`);

    return response.data;
  },
};