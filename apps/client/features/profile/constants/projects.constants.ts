import { ProjectItem, ProjectFormData } from "../types/profileProjects.types";

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    title: "AI Interview Coach Platform",
    role: "Full-Stack Developer",
    period: "2024 - Present",
    description:
      "Engineered an interactive mock interview system with real-time speech evaluation, dynamic question generation, and candidate skill analytics.",
    technologies: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "Web Speech API"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: "proj-2",
    title: "Microservices Cloud Infrastructure",
    role: "Backend Engineer",
    period: "2023 - 2024",
    description:
      "Designed resilient asynchronous event pipelines using Docker and Redis, handling high-concurrency requests with low latency.",
    technologies: ["Python", "FastAPI", "Redis", "Docker", "PostgreSQL"],
    githubUrl: "https://github.com",
  },
];

export const INITIAL_PROJECT_FORM: ProjectFormData = {
  title: "",
  role: "",
  period: "",
  description: "",
  technologiesInput: "",
  githubUrl: "",
  liveUrl: "",
};
