import api from "./axios";
import { UploadResumeResponse, AnalysisResponse, FeedbackResponse, FullAnalysisResult, AnalysisListItem } from "@/types/analysis";


export const analysisService = {
  async uploadResume(formData: FormData): Promise<UploadResumeResponse> {
    const response = await api.post("/api/v1/js/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async analyze(data: { resume_id: string; jd_id: string }): Promise<AnalysisResponse> {
    const response = await api.post("/api/v1/analyze", data);
    return response.data;
  },

  async listResults(): Promise<{ results: AnalysisListItem[] }> {
    const response = await api.get("/api/v1/results");
    return response.data;
  },

  async getResult(resultId: string): Promise<FullAnalysisResult> {
    const response = await api.get(`/api/v1/results/${resultId}`);
    return response.data;
  },

  async getFeedback(feedbackId: string): Promise<FeedbackResponse> {
    const response = await api.get(`/api/v1/feedback/${feedbackId}`);
    return response.data;
  },
};
