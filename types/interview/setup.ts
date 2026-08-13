export type Language_type = "ar" | "en";
export type Interview_level = "junior" | "mid-level" | "senior";

export interface setupInterview {
    language : Language_type,
    technologies : string[],
    interview_level : Interview_level
}