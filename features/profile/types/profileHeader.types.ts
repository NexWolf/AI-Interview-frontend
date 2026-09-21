import { ProfileApi } from "./profile.types";



export type ProfileHeaderData = Omit<ProfileApi, "skills" | "educations"  | "id" |  "avatarPublicId" | "onboardingDone"  | "lang" | "role" | "authProvider"  | "createdAt" | "updatedAt"> & {
    avatarUpload : File | null
};


export type ProfileFormValues = Omit<ProfileHeaderData , "socialLinks"> & {
    socialLinks : {value : string}[],

}

