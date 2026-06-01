import { useMutation, useQuery } from "@tanstack/react-query";
import { analysisService } from "@/api/analysis";

export const useAnalysisList = () => {
  return useQuery({
    queryKey: ["analysisList"],
    queryFn: () => analysisService.listResults(),
  });
};

export const useUploadResume = () => {
  return useMutation({
    mutationFn: analysisService.uploadResume,
  });
};

export const useAnalyzeResume = () => {
  return useMutation({
    mutationFn: analysisService.analyze,
  });
};

export const useAnalysisResult = (resultId: string) => {
  return useQuery({
    queryKey: ["result", resultId],
    queryFn: () => analysisService.getResult(resultId),
    enabled: !!resultId,
  });
};

export const useFeedback = (feedbackId: string) => {
  return useQuery({
    queryKey: ["feedback", feedbackId],
    queryFn: () => analysisService.getFeedback(feedbackId),
    enabled: !!feedbackId,
  });
};
