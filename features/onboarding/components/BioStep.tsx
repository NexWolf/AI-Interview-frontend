"use client";

import { useEffect, useState } from "react";
import { get, useFormContext } from "react-hook-form";
import Image from "next/image";
import { Input } from "@/shared/components/ui/Input";
import { dbStore } from "@/shared/lib/dbStore";
import { FileUploadInput } from "./FileUploadInput";
import { ArrowLeft, ArrowRight, X, Sparkles } from "lucide-react";

type PropsBio = {
  onNext?: () => void;
  onBack?: () => void;
};

export const BioStep = ({ onNext, onBack }: PropsBio) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const avatarValue = watch("bioData.avatar");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // استخراج الأخطاء المتداخلة بأمان
  const socialLinkError = get(errors, "bioData.socialLink");
  const bioError = get(errors, "bioData.bio");

  /* FUNCTION TO GET FILE VALUE */
  const extractFile = (data: any): File | string | null => {
    if (!data) return null;
    if (typeof data === "string") return data;
    if (data instanceof File) return data;
    if (Array.isArray(data) && data.length > 0) return extractFile(data[0]);
    if (typeof data === "object" && data[0] instanceof File) return data[0];
    return null;
  };

  useEffect(() => {
    const targetFile = extractFile(avatarValue);
    let objectUrl: string | null = null;

    if (targetFile instanceof File) {
      objectUrl = URL.createObjectURL(targetFile);
      setAvatarPreview(objectUrl);
    } else {
      setAvatarPreview(null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [avatarValue]);

  const handleClearAvatar = async () => {
    if (avatarPreview && avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    setValue("bioData.avatar", null, {
      shouldValidate: true,
      shouldDirty: true,
    });

    const FORM_KEY = "onboarding_form";
    const FORM_DATA = await dbStore.get<Record<string, any>>(FORM_KEY);
    if (FORM_DATA && FORM_DATA?.bioData) {
      FORM_DATA.bioData.avatar = null;
      await dbStore.save(FORM_KEY, FORM_DATA);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. الحاوية الرئيسية الموحدة للحقول */}
      <div className="space-y-5 rounded-2xl border border-border/50 dark:border-border/30 bg-secondary/20 dark:bg-secondary/10 p-5 sm:p-6 backdrop-blur-xs">
        
        {/* قسم رفع ومعاينة الصورة الرمزية (Avatar Section) */}
        <div className="flex flex-col items-center justify-center py-2">
          {avatarPreview ? (
            <div className="relative group">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-primary/40 shadow-lg ring-4 ring-background transition-transform duration-300 group-hover:scale-105">
                <Image
                  alt="Avatar Preview"
                  src={avatarPreview}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleClearAvatar}
                title="Remove image"
                className="absolute -top-1 -right-1 z-20 bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-all duration-200 rounded-full w-7 h-7 flex items-center justify-center shadow-md hover:scale-110 active:scale-95 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-full">
              <FileUploadInput
                name="bioData.avatar"
                label="Upload Profile Photo"
              />
            </div>
          )}
        </div>

        {/* حقل الروابط الاجتماعية (Social Links) */}
        <div className="space-y-1">
          <Input
            {...register("bioData.socialLink")}
            label="Social Profile or Portfolio"
            placeholder="https://linkedin.com/in/username"
          />
          {socialLinkError && (
            <p className="text-destructive text-xs font-medium px-1">
              {String(socialLinkError.message)}
            </p>
          )}
        </div>

        {/* حقل النبذة الشخصية (Bio Textarea) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              About You (Bio)
            </label>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary" />
              Brief summary
            </span>
          </div>

          <textarea
            className="w-full rounded-2xl border border-border/70 dark:border-border/40 bg-input/40 dark:bg-input/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 min-h-[110px] resize-none"
            {...register("bioData.bio")}
            placeholder="Tell us a little about your journey, interests, and what you're building..."
          />

          {bioError && (
            <p className="text-destructive text-xs font-medium px-1">
              {String(bioError.message)}
            </p>
          )}
        </div>
      </div>

      {/* 2. أزرار التنقل (Back & Continue) */}
      <div className="flex items-center justify-between pt-6 border-t border-border/50 dark:border-border/30">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/60 dark:border-border/40 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-7 py-2.5 rounded-xl font-medium text-sm shadow-md hover:shadow-lg dark:shadow-none transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default BioStep;