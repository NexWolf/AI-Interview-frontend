export interface ProjectItem {
  id: string;
  title: string;
  role: string;
  period: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  codebaseProjectId?: string;
  isAnalyzed?: boolean;
  analyzedStats?: {
    files: number;
    symbols: number;
  };
  evaluation?: {
    interviewId: string;
    overallScore: number;
    technicalKnowledgeScore?: number;
    currentLevel?: string;
    completedAt?: string;
    reportPdfUrl?: string | null;
  };
}

export interface ProfileProjectsProps {
  editable?: boolean;
  username?: string;
}

export interface ProjectFormData {
  title: string;
  role: string;
  period: string;
  description: string;
  technologiesInput: string;
  githubUrl: string;
  liveUrl: string;
}
