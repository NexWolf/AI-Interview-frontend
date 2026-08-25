export interface LevelDataType {
    level : number,
    currentXP : number,
    maxXP : number,
}


export interface BioDataType {
    id: number,
    firstName: string,
    lastName: string,
    headline: string,
    location: string,
    about: string,
    university ?: string,
    personal_photo ?: string,
    join_at: string,
    level ?: LevelDataType,
    website_url : string
}

export interface Educations {
    id: number,
    school: string,
    degree: number,
    study_field: string,
    start_at: string,
    end_at: string,
    description: string,
    media_url: string,
    image_url : string
}

export type ProfileLanguageType = "ar" | "en"

export interface ProjectType {
    id: number,
    image: string,
    name: string,
    url: string
}

export interface CertificateType {
    id: number,
    title: string;
    media_url?: string;
    image?: string;
}


export interface SkillsDataType {
    id: number,
    icon_key: string,
    name: string,
    rate: number,
    status: "weak" | "medium" | "strong" | "good" | "needed"
}


export interface profileDataType {
    id: number,
    bio: BioDataType,
    skills: SkillsDataType[],
    about: string,
    strengths: string,
    need_improve: string,
    activity: null,
    education: Educations[],
    profile_language: ProfileLanguageType,
    certificate: CertificateType[],
    projects: ProjectType[]
}

















// /* on edit mode */
// /* data of profile need frombackend */
// export interface BioDataType {
//     firstName : string,
//     lastName : string,
//     additional_name : string,
//     headline : string,
//     about : string,
//     location : string,
//     education : string,
//     connections : number,
// }

// export interface core {
//     education :
// }

// export interface ProfileSetupSections {
//     core :
// }

// interface websiteDataType {
//     name : string,
//     type : string,
// }

// export interface editContentInfo {
//     profile_Url : string,
//     email : string,
//     phone_number : string,
//     address : string,
//     birithday : string,
//    website : websiteDataType[]
// }

// export interface ProfileDoumyData  {
//     bio :
// } 