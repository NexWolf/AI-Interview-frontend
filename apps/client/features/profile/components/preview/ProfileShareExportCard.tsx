"use client";

import React from "react";
import { Share2, Download, ExternalLink, Check } from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";

export interface ProfileShareExportCardProps {
  userName?: string;
  isEditable?: boolean;
  copied: boolean;
  onShare: () => void;
  onDownloadPdf: () => void;
}

export const ProfileShareExportCard: React.FC<ProfileShareExportCardProps> = ({
  userName,
  isEditable = false,
  copied,
  onShare,
  onDownloadPdf,
}) => {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  return (
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
            onClick={onShare}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
            title={t("profile.share")}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Share2 className="w-3.5 h-3.5 text-primary" />
            )}
            <span>
              {copied
                ? isAr
                  ? "تم نسخ الرابط!"
                  : "Copied Link!"
                : t("profile.share")}
            </span>
          </button>

          {/* Download PDF button */}
          <button
            type="button"
            onClick={onDownloadPdf}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-md shadow-primary/20 transition-all cursor-pointer active:scale-95"
            title={t("profile.downloadPdf")}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t("profile.downloadPdf")}</span>
          </button>

          {/* Public preview if in dashboard editable mode */}
          {isEditable && userName && (
            <a
              href={`/profile/${userName}`}
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
  );
};

export default ProfileShareExportCard;
