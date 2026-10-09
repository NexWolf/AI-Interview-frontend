"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";
import { USER_PROFILE_QUERY_KEY } from "./useProfile";
import { useUpdateProfile } from "./useUpdateProfile";
import { useUpdateSkills } from "./useUpdateSkills";
import { ProfileHeaderData } from "../types/profileHeader.types";
import { ProficiencyLevel } from "@/shared/types/userSkills";
import { defaultAuthRetry } from "@/shared/lib/queryUtils";
import { useLanguage } from "@/shared/context/LanguageContext";
import { toast } from "sonner";

export interface UseProfilePreviewOptions {
  editable?: boolean;
  username?: string;
}

export const useProfilePreview = ({
  editable = false,
  username,
}: UseProfilePreviewOptions) => {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const [copied, setCopied] = useState(false);

  const isEditable = Boolean(editable && !username);

  // 1. Fetch Profile Data
  const {
    data: profileData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: username ? ["profile", username] : USER_PROFILE_QUERY_KEY,
    queryFn: username
      ? () => profileService.getByUsername(username)
      : profileService.getAll,
    staleTime: 1000 * 60 * 10,
    retry: defaultAuthRetry,
  });

  // 2. Mutations
  const { mutate: updateProfileMutation } = useUpdateProfile();
  const { mutate: updateSkillsMutation, isPending: isUpdatingSkills } =
    useUpdateSkills();

  // 3. Action Handlers

  /**
   * Updates Profile Header (Avatar, Names, Bio, Phone, Social Links)
   */
  const handleEditHeader = (data: ProfileHeaderData) => {
    const isAvatarChange = Boolean(data.avatarUpload);
    const loadingMessage = isAvatarChange
      ? isAr
        ? "جاري رفع صورة الحساب..."
        : "Uploading profile picture..."
      : isAr
      ? "جاري حفظ التعديلات..."
      : "Saving profile changes...";

    toast.loading(loadingMessage, { id: "profile-update" });

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
      .filter((link) =>
        Boolean(link && (link.startsWith("http://") || link.startsWith("https://")))
      );

    if (validLinks.length > 0) {
      formData.append("socialLinks", JSON.stringify(validLinks));
    }

    updateProfileMutation(formData, {
      onSuccess: () => {
        toast.success(
          isAvatarChange
            ? isAr
              ? "تم تحديث الصورة بنجاح!"
              : "Profile picture updated successfully!"
            : isAr
            ? "تم تحديث الملف الشخصي بنجاح!"
            : "Profile updated successfully!",
          { id: "profile-update" }
        );
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message ||
            (isAr ? "فشل تحديث الملف الشخصي" : "Failed to update profile"),
          { id: "profile-update" }
        );
      },
    });
  };

  /**
   * Updates candidate skills & proficiency levels
   */
  const handleSaveSkills = (
    skills: { skillId: string; proficiencyLevel?: ProficiencyLevel }[]
  ) => {
    updateSkillsMutation(
      skills.map((s) => ({
        skillId: Number(s.skillId),
        proficiencyLevel: s.proficiencyLevel || "Beginner",
      })),
      {
        onSuccess: () => {
          toast.success(
            isAr ? "تم تحديث المهارات بنجاح" : "Skills updated successfully"
          );
        },
        onError: () => {
          toast.error(isAr ? "فشل تحديث المهارات" : "Failed to update skills");
        },
      }
    );
  };

  /**
   * Updates candidate education background
   */
  const handleEditEducation = (formData: FormData) => {
    updateProfileMutation(formData, {
      onSuccess: () =>
        toast.success(
          isAr ? "تم تحديث بيانات التعليم بنجاح" : "Education updated successfully"
        ),
      onError: () =>
        toast.error(
          isAr ? "فشل تحديث بيانات التعليم" : "Failed to update education"
        ),
    });
  };

  /**
   * Shares profile URL via Web Share API or copies to clipboard
   */
  const handleShareProfile = async () => {
    if (!profileData?.userName) return;
    const profileUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/profile/${profileData.userName}`
        : `/profile/${profileData.userName}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profileData.firstName} ${profileData.lastName} - AI Interview Coach Profile`,
          text: isAr
            ? `اطلع على الملف الشخصي والمهارات المعتمدة للمرشح ${profileData.firstName}`
            : `Check out ${profileData.firstName}'s candidate profile & AI-evaluated skills`,
          url: profileUrl,
        });
        return;
      } catch (err: any) {
        if (err.name === "AbortError") return;
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast.success(t("profile.shareSuccess"));
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error(isAr ? "تعذر نسخ الرابط" : "Failed to copy link");
    }
  };

  /**
   * Triggers clean print view for PDF saving
   */
  const handleDownloadPdf = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return {
    profileData,
    isLoading,
    isError,
    refetch,
    isEditable,
    isUpdatingSkills,
    copied,
    handleEditHeader,
    handleSaveSkills,
    handleEditEducation,
    handleShareProfile,
    handleDownloadPdf,
  };
};

export default useProfilePreview;
