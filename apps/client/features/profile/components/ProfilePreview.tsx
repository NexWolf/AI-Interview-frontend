"use client";

import React from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileAIReadinessCard from "./ProfileAIReadinessCard";
import ProfileProjects from "./ProfileProjects";
import ProfileSkills from "./ProfileSkills";
import ProfileEducation from "./ProfileEducation";
import ProfileHeaderSkeleton from "./ProfileHeaderLoading";
import { ProfilePrintStyles, ProfileShareExportCard } from "./preview";
import { useProfilePreview } from "../hook/useProfilePreview";

export interface ProfilePreviewProps {
  editable?: boolean;
  username?: string;
}

/**
 * ProfilePreview Component (Container & Composition Root)
 * Follows Single Responsibility and Container-Presenter patterns.
 */
export const ProfilePreview: React.FC<ProfilePreviewProps> = ({
  editable = false,
  username,
}) => {
  const {
    profileData,
    isLoading,
    isEditable,
    isUpdatingSkills,
    copied,
    handleEditHeader,
    handleSaveSkills,
    handleEditEducation,
    handleShareProfile,
    handleDownloadPdf,
  } = useProfilePreview({ editable, username });

  if (isLoading || !profileData) {
    return <ProfileHeaderSkeleton />;
  }

  return (
    <>
      {/* 1. Dedicated print stylesheet for clean PDF export */}
      <ProfilePrintStyles />

      <div className="max-w-4xl mx-auto space-y-6 pb-12 pt-4 sm:pt-6 print-full-width">
        {/* 2. Main Header Card (Banner, Avatar, Personal Info, Social Links) */}
        <ProfileHeader
          data={profileData}
          editable={isEditable}
          onSave={handleEditHeader}
        />

        {/* 3. AI Interview Readiness & Insights Overview */}
        <ProfileAIReadinessCard
          skills={profileData?.skills}
          editable={isEditable}
        />

        {/* 4. Featured Projects & Technical Experience */}
        <ProfileProjects
          editable={isEditable}
          username={profileData?.userName}
        />

        {/* 5. Skills & Proficiency Assessment Section */}
        <ProfileSkills
          skillsData={profileData?.skills}
          editable={isEditable}
          onSave={handleSaveSkills}
          isLoading={isUpdatingSkills}
        />

        {/* 6. Academic Background & Education Section */}
        <ProfileEducation
          editable={isEditable}
          educationData={profileData?.educations}
          onSave={handleEditEducation}
        />

        {/* 7. Action Bar: Share Profile & PDF Export */}
        <ProfileShareExportCard
          userName={profileData?.userName}
          isEditable={isEditable}
          copied={copied}
          onShare={handleShareProfile}
          onDownloadPdf={handleDownloadPdf}
        />
      </div>
    </>
  );
};

export default ProfilePreview;
