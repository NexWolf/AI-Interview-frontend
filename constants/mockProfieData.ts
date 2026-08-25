import { profileDataType } from "@/types/community/profile";

export const profileData : profileDataType = {
    id : 0,
    bio : {
        id : 0,
        firstName : "Ahmed",
        lastName : "Jheer",
        headline : "Frontend Developer Next.js & React.js",
        location : "gaza, palestine",
        university : "Al Azhar Univercity",
        personal_photo : "/Ai_Interview.jpg",
        join_at : "seb 2026",
        level : {
          level : 3,
          currentXP : 500,
          maxXP : 200 
        },
        about : "Frontend Developer crafting responsive, performant, and intuitive web experiences.",
        website_url : "////////"
    },
    skills : [
        {id : 0 , icon_key : "////" , name : "Mext js", rate : 70 , status : "good"},
        {id : 1 , icon_key : "////" , name : "javascript", rate : 50 , status : "medium"},
        {id : 2 , icon_key : "////" , name : "node js", rate : 20 , status : "good"},

    ],
    about : "Frontend Developer crafting responsive, performant, and intuitive web experiences.",
    strengths : ["Modern Frontend Architecture" , "Full-Cycle Development & Leadership" , "Form Validation"],
    need_improve : ["Advanced Backend Architecture", "DevOps & Automation Pipelines", ""],
    activity : null,
    education : [
        {id : 0, school : "Al A;azhar Univercity", degree : 78.8 , study_field : "biomedical Engeneer", start_at : "jan 2016", end_at : "jan 2022", description : "Focused on medical device technology, healthcare software applications, and biomedical engineering principles." , media_url : "/////"}
    ],
    profile_language : "en",
    certificate :  [
        {id : 0 , title : "Web React & Next Front-end" , media_url :"////", image : "/signBG.jpeg"},
        {id : 1 , title : "Web React & Next Front-end" , media_url :"////", image : "/signBG.jpeg"},
    ],
    projects : [
        {id : 0 , image : "/signBg.jpeg", name : "NEXWOLF", url : "/////"},
        {id : 1 , image : "/signBg.jpeg", name : "NEXWOLF", url : "/////"},
        {id : 2 , image : "/signBg.jpeg", name : "NEXWOLF", url : "/////"},
        {id : 3 , image : "/signBg.jpeg", name : "NEXWOLF", url : "/////"},
    ] 

}