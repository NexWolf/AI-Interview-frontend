"use client";
import { useFormContext } from "react-hook-form";
import { Input } from "@/shared/components/ui/Input";
import Image from "next/image";
import { useEffect, useState } from "react";
import { dbStore } from "@/shared/lib/dbStore";
import FormHeader from "./FormHeader";
import { FileUploadInput } from "./FileUploadInput";

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

  useEffect(() => {
    console.log(avatarPreview);
  }, [avatarPreview]);

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
    <div className="w-full max-w-xl mx-auto space-y-6">
      <FormHeader
        leftStep="One step left"
        title="Complete Your Profile"
        description="Please fill in the required fields below to personalize your workspace experience."
      />

      <div className="flex flex-col gap-6 bg-card/50 p-6 rounded-2xl border border-border/40 shadow-xs">
        {/* Avatar Section */}
        <div className="flex flex-col items-center justify-center py-2">
          {avatarPreview ? (
            <div className="relative group">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-primary/20 shadow-md ring-4 ring-background">
                <Image
                  alt="Avatar Image Url"
                  src={avatarPreview}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <button
                type="button"
                onClick={handleClearAvatar}
                title="Remove image"
                className="absolute -top-1 -right-1 z-30 bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-all duration-200 rounded-full w-7 h-7 flex justify-center items-center text-xs font-semibold shadow-md hover:scale-110 cursor-pointer"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="w-full">
              <FileUploadInput
                name="bioData.avatar"
                label="Upload Your Avatar!"
              />
            </div>
          )}
        </div>

        {/* Social Links Field */}
        <div className="space-y-1.5">
          <Input
            {...register("bioData.socialLink", {})}
            label="Social Links"
            placeholder="https://linkedin.com/in/username"
          />
          {errors.socialLinks && (
            <p className="text-destructive text-xs font-medium mt-1">
              {String(errors.socialLinks.message)}
            </p>
          )}
        </div>

        {/* Bio Textarea Field */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Bio</label>
          <textarea
            className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all duration-200 min-h-[100px] resize-none"
            {...register("bioData.bio", {})}
            placeholder="Tell us a little about yourself and your professional journey..."
          />
          {errors.bio && (
            <p className="text-destructive text-xs font-medium mt-1">
              {String(errors.bio.message)}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer"
          >
            Back
          </button>
        )}

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-xl font-medium text-sm shadow-xs transition-all duration-200 cursor-pointer"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};
