"use client";
import ProfileHeader from "./ProfileHeader";
import { SkillOverview } from "./SkillsOverview";
import AboutCard from "./AboutCard";
import { BioData, ProfileApi, ProfileData } from "@/features/profile/types/profile.types";

type ProfileProps = {
  ProfileData: ProfileApi;
};

const handleBioAdd = () => {
  console.log("add bio");
};

const handleBioEdit = () => {
  console.log("ediit");
};

const ProfileComponent = ({ ProfileData }: ProfileProps) => {
  return (
    <div className="p-5 flex flex-col gap-2">
      <ProfileHeader
        data={ProfileData as ProfileApi}
        onAdd={handleBioAdd}
        onEdit={handleBioEdit}
      />

      <SkillOverview
        skills={
          Array.isArray(ProfileData.skills)
            ? ProfileData.skills.map((s: any) =>
                typeof s === "string" ? s : s.name || s.skillId || "",
              )
            : []
        }
      />
      <div>
        <AboutCard />
      </div>
    </div>
  );
};

export default ProfileComponent;
