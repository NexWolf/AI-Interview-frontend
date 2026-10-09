export interface CodebaseStatistics {
  files: number;
  analyzedFiles: number;
  unsupportedFiles?: number;
  symbols: number;
  relationships: number;
  diagnostics?: number;
}

export interface CodebaseRepository {
  url: string;
  owner: string;
  name: string;
  branch: string;
}

export interface AnalyzeRepositoryResult {
  projectId: string;
  repository: CodebaseRepository;
  statistics: CodebaseStatistics;
  knowledgeMarkdown?: string;
  graphJson?: Record<string, unknown>;
}
