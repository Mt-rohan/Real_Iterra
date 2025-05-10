// Type definitions for the application

// Type for pose detection results
export interface PoseAnalysisResult {
    summary: string;
  }
  
  // Type for the AI feedback
  export interface AIFeedback {
    tips: string[];
    fullResponse: string;
  }
  
  // Type for the combined analysis results
  export interface AnalysisResults {
    videoUrl: string;
    poseSummary: string;
    aiFeedback: AIFeedback;
  }
  