"use client";

import { useEffect, useState } from "react";
import ProfileEducation from "./ProfileEducation";
import ProfileHeader from "./ProfileHeader";
import ProfileSkills from "./ProfileSkills";
import ProfileAIReadinessCard from "./ProfileAIReadinessCard";
import ProfileProjects from "./ProfileProjects";
import { useQuery } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";
import { ProfileHeaderData } from "../types/profileHeader.types";
import { useUpdateProfile } from "../hook/useUpdateProfile";
import { useUpdateSkills } from "../hook/useUpdateSkills";
import { toast } from "sonner";
import { ProficiencyLevel } from "@/shared/types/userSkills";
import ProfileHeaderSkeleton from "./ProfileHeaderLoading";
import { useRouter } from "next/navigation";
import { Share2, Download, ExternalLink, Check, Copy } from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";
import { cn } from "@/shared/lib/utils";

type ProfileViewProps = {
  editable?: boolean;
  username?: string;
};

export const ProfilePreview = ({ editable = false, username }: ProfileViewProps) => {
  const { mutate: updateProfiel } = useUpdateProfile();
  const router = useRouter();
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const [copied, setCopied] = useState(false);

  const isEditable = Boolean(editable && !username);

  const { data: profileData } = useQuery({
    queryKey: username ? ["profile", username] : ["profile"],
    queryFn: username
      ? () => profileService.getByUsername(username)
      : profileService.getAll,
  });

  /* ACTION FOR PROFILE HEADER */
  const handleEditHeader = (data: ProfileHeaderData) => {
    const isAvatarChange = Boolean(data.avatarUpload);
    if (isAvatarChange) {
      toast.loading(isAr ? "جاري رفع صورة الحساب..." : "Uploading profile picture...", { id: "profile-update" });
    } else {
      toast.loading(isAr ? "جاري حفظ التعديلات..." : "Saving profile changes...", { id: "profile-update" });
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
            ? (isAr ? "تم تحديث الصورة بنجاح!" : "Profile picture updated successfully!")
            : (isAr ? "تم تحديث الملف الشخصي بنجاح!" : "Profile updated successfully!"),
          { id: "profile-update" }
        );
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message || (isAr ? "فشل تحديث الملف الشخصي" : "Failed to update profile"),
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
          toast.success(isAr ? "تم تحديث المهارات بنجاح" : "Skills updated successfully");
        },
        onError: () => {
          toast.error(isAr ? "فشل تحديث المهارات" : "Failed to update skills");
        },
      }
    );
  };

  /* ACTION FOR EDUCATION */
  const handleEditEducation = (formData: FormData) => {
    updateProfiel(formData, {
      onSuccess: () => toast.success(isAr ? "تم تحديث بيانات التعليم بنجاح" : "Education updated successfully"),
      onError: () => toast.error(isAr ? "فشل تحديث بيانات التعليم" : "Failed to update education"),
    });
  };

  /* SHARE PROFILE */
  const handleShareProfile = async () => {
    if (!profileData?.userName) return;
    const profileUrl = typeof window !== "undefined"
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

  /* DOWNLOAD AS PDF */
  const handleDownloadPdf = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (!profileData) {
    return <ProfileHeaderSkeleton />;
  }

  return (
    <>
      {/* Print stylesheet to format PDF download cleanly */}
      <style jsx global>{`
        @media print {
          /* Hide non-profile dashboard elements */
          header,
          aside,
          nav,
          .no-print {
            display: none !important;
          }
          body {
            background: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 10mm !important;
          }
          .print-full-width {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .bg-card,
          .bg-background {
            background-color: transparent !important;
            box-shadow: none !important;
          }
          .border {
            border-color: #cbd5e1 !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-6 pb-12 pt-4 sm:pt-6 print-full-width">
        {/* 1. Main Header Card (Banner + Avatar + Basic Info) */}
        <ProfileHeader
          data={profileData}
          editable={isEditable}
          onSave={handleEditHeader}
        />

        {/* 2. AI Interview Readiness & Insights Card */}
        <ProfileAIReadinessCard
          skills={profileData?.skills}
          editable={isEditable}
        />

        {/* 3. Featured Projects & Technical Experience */}
        <ProfileProjects
          editable={isEditable}
          username={profileData?.userName}
        />

        {/* 4. Skills Section */}
        <ProfileSkills
          skillsData={profileData?.skills}
          editable={isEditable}
          onSave={handleSaveSkills}
          isLoading={isUpdatingSkills}
        />

        {/* 5. Education Section */}
        <ProfileEducation
          editable={isEditable}
          educationData={profileData?.educations}
          onSave={handleEditEducation}
        />

        {/* 6. Bottom Card: Share & Export / Download PDF */}
        <div className="no-print rounded-2xl border border-border/70 bg-gradient-to-r from-card via-card/90 to-primary/5 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Share2 className="w-4 h-4 text-primary" />
                {isAr ? "مشاركة وتصدير الملف الشخصي" : "Share & Export Profile"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isAr
                  ? "شارك رابط ملفك الشخصي المعتمد مع مسؤولي التوظيف، أو قم بتنزيل نسخة PDF منسقة."
                  : "Share your verified profile link with recruiters or download a clean, print-ready PDF version."}
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Share profile button */}
              <button
                type="button"
                onClick={handleShareProfile}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                title={t("profile.share")}
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Share2 className="w-3.5 h-3.5 text-primary" />
                )}
                <span>{copied ? (isAr ? "تم نسخ الرابط!" : "Copied Link!") : t("profile.share")}</span>
              </button>

              {/* Download PDF button */}
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-md shadow-primary/20 transition-all cursor-pointer active:scale-95"
                title={t("profile.downloadPdf")}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t("profile.downloadPdf")}</span>
              </button>

              {/* Public preview if in dashboard editable mode */}
              {isEditable && profileData.userName && (
                <a
                  href={`/profile/${profileData.userName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-all shadow-xs active:scale-95"
                  title={t("profile.publicPreview")}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{t("profile.publicPreview")}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePreview;
