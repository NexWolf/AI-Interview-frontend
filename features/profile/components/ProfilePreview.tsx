"use client";

import { useEffect } from "react";
import { useProfile } from "../hook/useProfile";
import { SkillApi } from "../types/profile.types";
import ProfileEducation from "./ProfileEducation";
import ProfileHeader from "./ProfileHeader";
import ProfileSkills from "./ProfileSkills";



type ProfileViewProps = {
  editable ?: boolean; 
};

export const mockProfileData = {
  basicData: {
    firstName: "Ahmed",
    lastName: "Jheer",
    userName: "ahmed_jheer",
    email: "ahmed@example.com",
    phoneNumber: "+970 590 000 000",
  },
  bioData: {
    avatar: "/ahmedprofile.jpeg",
    bio: "Frontend Developer specializing in React, Next.js, and TypeScript. Passionate about clean code and UI/UX architecture.",
    socialLink: "https://admin-portfolio-delta-flame.vercel.app/",
  },
  education: [
    {
      institution: "Islamic University of Gaza",
      fieldOfStudy: "Computer Engineering",
      degree: 101,
      startDate: "2020",
      endDate: "2024",
      isCurrent: false,
      description:
        "Focused on software engineering principles, web development, and algorithms.",
    },
  ],
  skills: [
    { id: 1, name: "React", level: "Expert" },
    { id: 2, name: "Next.js", level: "Intermediate" },
    { id: 3, name: "TypeScript", level: "Expert" },
    { id: 4, name: "Tailwind CSS", level: "Intermediate" },
    { id: 5, name: "Node.js", level: "Beginner" },
    { id: 6, name: "GraphQL", level: "Not Assessed" },
    { id: 7, name: "Docker" },
  ] as SkillApi[],
  isVerified: true,
};



export const ProfilePreview = ({ editable = false}: ProfileViewProps) => {
  const {data : profileData } = useProfile();

  useEffect(() => {
    console.log(profileData)
  },[profileData])


/* START INTERVIEW ACTION */
const handleStartInterview = () => {
  console.log("interview")
}

/* ACTION FOR PROFILE HEADER */
const handleEditHeader = () => {
console.log("interview")
}

/* ACTION FOR SKILLS */
const handleEditSkills = () => {
console.log("interview")
}

const handleAddSkills = () => {
  console.log("interview")
}

/* ACTION FOR EDUCATION */
const handleAddEducation = () => {
  console.log("interview")
} 

const handleEditEducation = () => {
  console.log("interview")
}

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 pt-12">

      {/* 1. Main Header Card (Banner + Avatar + Basic Info) */}
      <ProfileHeader data={profileData} editable={editable}  onEdit={handleEditHeader} onStart={handleStartInterview}/>

      {/* 3. Skills Section */}
      <ProfileSkills skillsData={profileData?.skills || []} editable={editable} onEdit={handleEditSkills} onAdd={handleAddSkills}/>

      {/* 2. Education Section */}
      <ProfileEducation  editable={editable} educationData={profileData?.educations || []} onAdd={handleAddEducation} onEdit={handleEditEducation}  />
    </div>
  );
};

export default ProfilePreview;
