export interface UploadResumeResponse {
  resume_id: string;
  jd_id: string;
}

export interface AnalysisListItem {
  resultID: string;
  resumeID: string;
  jdID: string;
  finalScore: number;
  matchedKeywords: string[];
  missingCount: number;
  timestamp: string;
}

export interface AnalysisResponse {
  result_id: string;
  feedback_id: string;
  score: number;
}

export interface FeedbackResponse {
  result: string;
}

export interface FullAnalysisResult {
  result: {
    resultID: string;
    resumeID: string;
    jdID: string;
    finalScore: number;
    matchedKeywords: string[];
    timestamp: string;
  };
  feedback: {
    feedbackID: string;
    missingKeywords: string[];
    suggestions: string[];
    highlightedSections: any;
  } | null;
  profile: any;
}
