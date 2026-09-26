"use client";

import { useEffect } from "react";

import ProfileEducation from "./ProfileEducation";
import ProfileHeader from "./ProfileHeader";
import ProfileSkills from "./ProfileSkills";
import { useQuery } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";
import { ProfileFormValues, ProfileHeaderData } from "../types/profileHeader.types";
import { useUpdateProfile } from "../hook/useUpdateProfile";
import { useUpdateSkills } from "../hook/useUpdateSkills";
import { toast } from "sonner";
import { ProficiencyLevel } from "@/shared/types/userSkills";
import ProfileHeaderSkeleton from "./ProfileHeaderLoading";
import { useRouter } from "next/navigation";
import ProfilePortfolio from "./ProfilePortfolio";

type ProfileViewProps = {
  editable?: boolean;
  username?: string;
};

export const ProfilePreview = ({ editable = false, username }: ProfileViewProps) => {
  const { mutate: updateProfiel, isPending } = useUpdateProfile();
  const router = useRouter();

  const isEditable = Boolean(editable && !username);

  const { data: profileData } = useQuery({
    queryKey: username ? ["profile", username] : ["profile"],
    queryFn: username
      ? () => profileService.getByUsername(username)
      : profileService.getAll,
  });

  /* START INTERVIEW ACTION */
  const handleStartInterview = () => {
    router.push("/interview/setup");
  };

  /* ACTION FOR PROFILE HEADER */
  const handleEditHeader = (data: ProfileHeaderData) => {
    const isAvatarChange = Boolean(data.avatarUpload);
    if (isAvatarChange) {
      toast.loading("Uploading profile picture...", { id: "profile-update" });
    } else {
      toast.loading("Saving profile changes...", { id: "profile-update" });
    }

    const formData = new FormData();
    if (data.firstName) formData.append("firstName", data.firstName);
    if (data.lastName) formData.append("lastName", data.lastName);
    if (data.userName) formData.append("userName", data.userName);
    if (data.bio) formData.append("bio", data.bio);
    if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);

    const rawAvatar: any = data.avatarUpload;
    const avatarFile = Array.isArray(rawAvatar) ? rawAvatar[0] : rawAvatar;

    if (avatarFile instanceof File) {
      formData.append("avatar", avatarFile);
    }

    const cleanSocialLink = (link: string): string => {
      return link.replace(/^(socialLinks\.\d+\.)+/, "").trim();
    };

    const validLinks = (data.socialLinks || [])
      .map(cleanSocialLink)
      .filter((link) => Boolean(link && (link.startsWith("http://") || link.startsWith("https://"))));

    if (validLinks.length > 0) {
      formData.append("socialLinks", JSON.stringify(validLinks));
    }

    updateProfiel(formData, {
      onSuccess: () => {
        toast.success(
          isAvatarChange
            ? "Profile picture updated successfully!"
            : "Profile updated successfully!",
          { id: "profile-update" }
        );
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message || "Failed to update profile",
          { id: "profile-update" }
        );
      },
    });
  };



  const { mutate: updateSkills, isPending: isUpdatingSkills } = useUpdateSkills();

  /* ACTION FOR SKILLS */
  const handleSaveSkills = (
    skills: { skillId: string; proficiencyLevel?: ProficiencyLevel }[]
  ) => {
    updateSkills(
      skills.map((s) => ({
        skillId: Number(s.skillId),
        proficiencyLevel: s.proficiencyLevel || "Beginner",
      })),
      {
        onSuccess: () => {
          toast.success("Skills updated successfully");
        },
        onError: () => {
          toast.error("Failed to update skills");
        },
      }
    );
  };

  /* ACTION FOR EDUCATION */
  const handleAddEducation = () => {
    console.log("interview");
  };

  const handleEditEducation = (formData: FormData) => {
    updateProfiel(formData, {
      onSuccess: () => console.log("profile Updated Successfully")
    })
  };

  if (!profileData) {
    return <ProfileHeaderSkeleton />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 pt-12">
      {/* 1. Main Header Card (Banner + Avatar + Basic Info) */}
      <ProfileHeader
        data={profileData}
        editable={isEditable}
        onSave={handleEditHeader}
        onStart={handleStartInterview}
      />

      {/* 3. Skills Section */}
      <ProfileSkills
        skillsData={profileData?.skills}
        editable={isEditable}
        onSave={handleSaveSkills}
        isLoading={isUpdatingSkills}
      />

      <ProfilePortfolio journey={profileData?.learningJourney} />

      {/* 2. Education Section */}
      <ProfileEducation
        editable={isEditable}
        educationData={profileData?.educations}
        onSave={handleEditEducation}
      />
    </div>
  );
};

export default ProfilePreview;
