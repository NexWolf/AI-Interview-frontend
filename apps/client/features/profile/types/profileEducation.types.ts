import { EducationApi, ProfileApi } from "./profile.types";

export type SingleEducationItem = Omit<
EducationApi, "id" | "userName" | "createdAt" | "updatedAt" | "userId">

export type EducationData = {
    educations : SingleEducationItem[];
}