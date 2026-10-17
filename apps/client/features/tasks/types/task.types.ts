export type TaskDifficulty = "Beginner" | "Intermediate" | "Advanced";

export type DevelopmentTaskStatus =
  | "Pending"
  | "InProgress"
  | "Submitted"
  | "Completed"
  | "Rejected";

export interface ConceptItem {
  name: string;
  explanation: string;
  whyItMatters?: string;
  practicalExample?: string;
}

export interface FileItem {
  path: string;
  action: "create" | "modify" | "delete" | string;
  purpose: string;
}

export interface CodeExampleItem {
  title: string;
  language: string;
  code: string;
  explanation: string;
}

export interface ResourceItem {
  title: string;
  url: string;
  type: "official_docs" | "youtube" | "course" | "article" | "tutorial" | string;
  language?: string;
  relatedConcept?: string;
  description?: string;
}

export interface DevelopmentTask {
  id: string | number;
  userId: string;
  analysisId: string | number;
  title: string;
  description: string;
  objective?: string | null;
  projectContext?: string | null;
  prerequisites?: string[];
  dependsOn?: number[];
  difficulty: TaskDifficulty;
  skills: string[];
  estimatedHours: number;
  concepts?: ConceptItem[];
  implementationSteps?: string[];
  filesToCreateOrModify?: FileItem[];
  codeExamples?: CodeExampleItem[];
  expectedOutput?: string | null;
  acceptanceCriteria: string[];
  tests?: string[];
  hints?: string[];
  commonMistakes?: string[];
  resources?: ResourceItem[];
  nextTaskConnection?: string | null;
  order: number;
  status: DevelopmentTaskStatus;
  submission?: string | null;
  review?: Record<string, unknown> | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MilestoneItem {
  order: number;
  title: string;
  description: string;
  skills: string[];
}

export interface AgentRoadmap {
  projectName: string;
  projectDescription: string;
  goal: string;
  technologyStack: string[];
  expectedDeliverable: string;
  milestones: MilestoneItem[];
}

export interface AgentProfile {
  careerDirection: string;
  careerDirectionConfidence: "low" | "medium" | "high" | string;
  strengths: string[];
  skillGaps: string[];
  interests: string[];
  reasoning: string[];
}

export interface AgentAnalysis {
  id: string | number;
  userId: string;
  interviewId: string | number;
  profile: AgentProfile;
  roadmap: AgentRoadmap;
  summary: string;
  nextStep: string;
  modelVersion?: string | null;
  createdAt: string;
  updatedAt: string;
  tasks: DevelopmentTask[];
}
