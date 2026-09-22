"use client";

import ActionIcons from "@/shared/components/ui/ActionIcons";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import FormDialog from "@/shared/components/form/FormDialog";
import { useForm } from "react-hook-form";
import { Input } from "@/shared/components/ui/Input";
import { toast } from "sonner";
import {
  ProfileFormValues,
  ProfileHeaderData,
} from "../types/profileHeader.types";
import FileUploadInput from "@/features/onboarding/components/FileUploadInput";
import SocialLinks from "@/features/onboarding/components/SocialLinks";
import PhoneNumber from "@/features/onboarding/components/PhoneNumber";
import {
  Sparkles,
  CheckCircle2,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  Camera,
  Eye,
  X,
  Upload,
} from "lucide-react";
import CameraCaptureModal from "./CameraCaptureModal";
import ImageCropModal from "./ImageCropModal";
import "react-phone-number-input/style.css";
import { ProfileApi } from "../types/profile.types";

type PropsPropfile = {
  onSave: (data: ProfileHeaderData) => void;
  onStart?: () => void;
  editable?: boolean;
  data: ProfileApi;
  onEditImage?: (data: string) => void;
};

export const ProfileHeader = ({
  onSave,
  onEditImage,
  onStart,
  data,
  editable,
}: PropsPropfile) => {
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [openImageForm, setOpenImageForm] = useState<boolean>(false);
  const [previewImageOpen, setPreviewImageOpen] = useState<boolean>(false);
  const [choiceModalOpen, setChoiceModalOpen] = useState<boolean>(false);
  const [cameraModalOpen, setCameraModalOpen] = useState<boolean>(false);
  const [cropModalOpen, setCropModalOpen] = useState<boolean>(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const parseSocialLinks = (links: string[] | null): { value: string }[] => {
    if (!links || !Array.isArray(links)) return [];
    return links.map((link) => ({ value: link }));
  };

  const initialFormValues: ProfileFormValues = useMemo(() => {

    return {
      email: data?.email ?? "",
      isVerified: data?.isVerified,
      avatarUrl: data?.avatarUrl,
      firstName: data?.firstName ?? "",
      lastName: data?.lastName ?? "",
      userName: data?.userName ?? "",
      phoneNumber: data?.phoneNumber ?? "",
      bio: data?.bio ?? "",
      socialLinks: parseSocialLinks(data?.socialLinks),
      avatarUpload: null,
    };
  }, [data]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must not exceed 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handlePhotoCaptured = (dataUrl: string) => {
    setImageToCrop(dataUrl);
    setCropModalOpen(true);
  };

  const handleCropComplete = (croppedFile: File) => {
    const payload: ProfileHeaderData = {
      email: data?.email,
      isVerified: data?.isVerified,
      avatarUrl: data?.avatarUrl,
      firstName: data?.firstName,
      lastName: data?.lastName,
      userName: data?.userName,
      phoneNumber: data?.phoneNumber,
      bio: data?.bio,
      avatarUpload: croppedFile,
      socialLinks: data?.socialLinks || [],
    };

    onSave(payload);
    setImageToCrop(null);
  };

  const handleFormSubmit = (formData: ProfileFormValues) => {
    const payload: ProfileHeaderData = {
      ...formData,
      socialLinks: formData.socialLinks
        .map((item) => item.value.trim())
        .filter((url) => url.length > 0), // يمنع إرسال النصوص الفارغة
    };

    onSave(payload); // هذه الدالة التي تستدعي الـ PATCH API
    console.log(payload);
  };

  const methods = useForm<ProfileFormValues>({
    defaultValues: initialFormValues,
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  const {
    register,
    reset,
    watch,
    formState: { errors },
  } = methods;

  const watchSocialLinks = watch("avatarUpload");
  const watchProfileImage = watch("avatarUrl");

  useEffect(() => {
    console.log("THIS IS AVATAR UPLOAD FROM ULOAD INPUT", watchSocialLinks);
  }, [watch, watchSocialLinks]);

  useEffect(() => {
    if (initialFormValues) reset(initialFormValues);
    console.log(initialFormValues);
  }, [initialFormValues, reset]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/70 dark:border-border/40 bg-card/80 dark:bg-card/40 backdrop-blur-2xl shadow-xl dark:shadow-2xl dark:shadow-primary/5 transition-all">
      {/* OPEN IMAGE UPDATE FORM */}
      {/* {openImageForm && (
        <div>
          <FormDialog
            title="Edit Bio Data"
            description="Update your bio and personal information below."
            onOpen={openImageForm}
            onClose={() => {
              setOpenImageForm(false);
              reset(initialFormValues);
            }}
            onSubmit={handleFormSubmit}
            methods={methods}
            form_button_title="Edit"
          >
            <div>
              {imageUrl ? (
                <div></div>
              ) : (
                <div>
                  <FileUploadInput name="avatarUrl" label="" />
                </div>
              )}
            </div>
          </FormDialog>
        </div>
      )} */}

      {/* OPEN PROFILE UPDATE FORM */}
      {openForm && (
        <FormDialog
          title="Edit Bio Data"
          description="Update your bio and personal information below."
          onOpen={openForm}
          onClose={() => {
            setOpenForm(false);
            reset(initialFormValues);
          }}
          onSubmit={handleFormSubmit}
          methods={methods}
          form_button_title="Edit"
        >
          <div className="space-y-4 py-1">
            <FileUploadInput name="avatarUpload" label="" multiple={false} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="space-y-1">
                <Input
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  label="First Name"
                  placeholder="Ex: Ahmed"
                />
                {errors.firstName && (
                  <p className="text-destructive text-xs font-medium px-1">
                    {String(errors.firstName.message)}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Input
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  label="Last Name"
                  placeholder="Ex: Jheer"
                />
                {errors.lastName && (
                  <p className="text-destructive text-xs font-medium px-1">
                    {String(errors.lastName.message)}
                  </p>
                )}
              </div>
            </div>

            {/* Bio Field */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-medium text-foreground/85 flex items-center justify-between">
                <span>Bio</span>
                <span className="text-[11px] text-muted-foreground">About you</span>
              </label>
              <textarea
                {...register("bio")}
                rows={3}
                placeholder="Tell us a little bit about your experience, interests, or background..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background/50 hover:bg-background/80 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm text-foreground transition-all duration-200 resize-none outline-none"
              />
              {errors.bio && (
                <p className="text-destructive text-xs font-medium px-1">
                  {String(errors.bio.message)}
                </p>
              )}
            </div>

            <SocialLinks name="socialLinks" />
            <div className="space-y-1 pt-1">
              <PhoneNumber name="phoneNumber" />
            </div>
          </div>
        </FormDialog>
      )}

      {/* Cover Banner */}
      <div className="relative h-36 sm:h-48 md:h-52 w-full overflow-hidden bg-gradient-to-r from-primary/25 via-primary/10 to-accent/30 dark:from-primary/20 dark:via-primary/5 dark:to-card">
        <div className="absolute -top-12 -left-12 h-44 w-44 rounded-full bg-primary/20 blur-2xl" />
        <div className="absolute -bottom-8 right-10 h-36 w-36 rounded-full bg-primary/15 blur-2xl" />
      </div>

      <div className="p-6 sm:p-8 pt-0 relative z-10">
        {/* Avatar & Actions Row */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end -mt-16 sm:-mt-20 mb-5 gap-4">
          <div className="relative group shrink-0 w-fit">
            <div
              onClick={() => editable && setChoiceModalOpen(true)}
              className={`relative h-28 w-28 sm:h-36 sm:w-36 shrink-0 rounded-full border-4 border-card dark:border-card/90 bg-muted shadow-xl ring-2 ring-primary/20 flex items-center justify-center text-primary-foreground font-bold text-2xl sm:text-3xl bg-gradient-to-tr from-primary to-primary/70 overflow-hidden cursor-pointer select-none transition-transform duration-200 hover:scale-[1.02] active:scale-98`}
              style={{
                borderRadius: "9999px",
                overflow: "hidden",
                clipPath: "circle(50% at 50% 50%)",
                WebkitClipPath: "circle(50% at 50% 50%)",
              }}
              title={editable ? "Click to change photo" : undefined}
            >
              {data?.avatarUrl ? (
                <Image
                  src={data?.avatarUrl as string ?? ""}
                  alt={data?.userName ?? "UserImage"}
                  fill
                  sizes="(max-width: 640px) 112px, 144px"
                  priority
                  className="object-cover w-full h-full rounded-full"
                  style={{ borderRadius: "9999px", objectFit: "cover" }}
                />
              ) : (
                <span>
                  {data?.firstName?.[0]}
                  {data?.lastName?.[0]}
                </span>
              )}

              {/* Hover overlay if editable */}
              {editable && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center gap-1.5 text-white z-20">
                  <Camera className="w-6 h-6 text-white animate-in zoom-in-75 duration-150" />
                  <span className="text-[11px] font-semibold tracking-wide">
                    {data?.avatarUrl ? "Change Photo" : "Add Photo"}
                  </span>
                </div>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleAvatarFileSelect}
              className="hidden"
            />
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {editable && (
              <button
                onClick={() => onStart?.()}
                type="button"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-xl text-sm font-medium shadow-md hover:shadow-lg dark:shadow-none transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-primary-foreground" />
                <span>Start Interview</span>
              </button>
            )}

            {editable && <ActionIcons onEdit={() => setOpenForm(true)} />}
          </div>
        </div>

        {/* User Details */}
        <div className="space-y-3.5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {data?.firstName} {data?.lastName}
              </h1>

              {/* أيقونة التوثيق CheckCircle2 */}
              {data?.isVerified && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              @{data?.userName}
            </p>
          </div>

          {/* Bio */}
          {data?.bio && (
            <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed max-w-3xl">
              {data.bio}
            </p>
          )}

          {/* Contact Row مع أيقونات Mail و Phone */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-muted-foreground pt-4 border-t border-border/50 dark:border-border/30">
            {data?.email && (
              <div className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span className="font-medium">{data.email}</span>
              </div>
            )}
            {data?.phoneNumber && (
              <div className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span className="font-medium">{data.phoneNumber}</span>
              </div>
            )}
          </div>
        </div>

        {data?.socialLinks && data.socialLinks.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {data.socialLinks.map((url, idx) => {
              const cleanDomain = url
                .replace(/^https?:\/\/(www\.)?/, "")
                .replace(/\/$/, "");
              return (
                <a
                  key={idx}
                  href={url.startsWith("http") ? url : `https://${url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/60 dark:border-border/40 bg-secondary/30 dark:bg-secondary/15 hover:bg-secondary/70 hover:border-primary/40 text-xs font-medium text-foreground transition-all duration-150 active:scale-95"
                >
                  <Globe className="w-3.5 h-3.5 text-primary transition-transform group-hover:scale-110" />
                  <span className="truncate max-w-[200px]">{cleanDomain}</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors opacity-70" />
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Avatar Lightbox / Preview Modal */}
      {previewImageOpen && data?.avatarUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImageOpen(false)}
        >
          <div
            className="relative bg-card border border-border/70 rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-2xl flex flex-col items-center gap-5 text-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setPreviewImageOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 mt-1">
              <h3 className="text-lg font-bold text-foreground">Profile Picture</h3>
              <p className="text-xs text-muted-foreground">
                {data?.firstName} {data?.lastName} (@{data?.userName})
              </p>
            </div>

            {/* Circular high-res display */}
            <div
              className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full border-4 border-primary/30 shadow-2xl overflow-hidden ring-4 ring-primary/10 bg-muted"
              style={{
                borderRadius: "9999px",
                overflow: "hidden",
                clipPath: "circle(50% at 50% 50%)",
                WebkitClipPath: "circle(50% at 50% 50%)",
              }}
            >
              <Image
                src={data.avatarUrl}
                alt={data?.userName || "Profile Picture"}
                fill
                sizes="(max-width: 640px) 224px, 256px"
                priority
                className="object-cover w-full h-full rounded-full"
                style={{ borderRadius: "9999px", objectFit: "cover" }}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full pt-2">
              {editable && (
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImageOpen(false);
                    setChoiceModalOpen(true);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Change Photo</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setPreviewImageOpen(false)}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-border bg-secondary/50 hover:bg-secondary text-sm font-medium transition-all active:scale-95 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Choice Modal: Camera vs File Upload */}
      {choiceModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setChoiceModalOpen(false)}
        >
          <div
            className="relative bg-card border border-border/70 rounded-3xl p-6 sm:p-7 max-w-sm sm:max-w-md w-full shadow-2xl flex flex-col items-center gap-5 text-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setChoiceModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">Change Profile Picture</h3>
              <p className="text-xs text-muted-foreground">Select how you would like to set your new photo</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full pt-1">
              {/* Option 1: Live Camera */}
              <button
                type="button"
                onClick={() => {
                  setChoiceModalOpen(false);
                  setCameraModalOpen(true);
                }}
                className="group p-5 rounded-2xl border-2 border-border/70 hover:border-primary/60 bg-secondary/20 hover:bg-primary/5 flex flex-col items-center gap-3 transition-all duration-200 cursor-pointer text-center hover:scale-[1.02] active:scale-98"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-colors duration-200 shadow-sm">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-foreground">Take Photo</p>
                  <p className="text-[11px] text-muted-foreground">Use your webcam</p>
                </div>
              </button>

              {/* Option 2: Upload File */}
              <button
                type="button"
                onClick={() => {
                  setChoiceModalOpen(false);
                  fileInputRef.current?.click();
                }}
                className="group p-5 rounded-2xl border-2 border-border/70 hover:border-primary/60 bg-secondary/20 hover:bg-primary/5 flex flex-col items-center gap-3 transition-all duration-200 cursor-pointer text-center hover:scale-[1.02] active:scale-98"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-colors duration-200 shadow-sm">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-foreground">Upload File</p>
                  <p className="text-[11px] text-muted-foreground">Choose from device</p>
                </div>
              </button>
            </div>

            {data?.avatarUrl && (
              <button
                type="button"
                onClick={() => {
                  setChoiceModalOpen(false);
                  setPreviewImageOpen(true);
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-border/60 bg-secondary/20 hover:bg-secondary/60 text-xs font-medium text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-primary" />
                <span>View Current Photo</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onPhotoCaptured={handlePhotoCaptured}
      />

      {/* Image Crop & Resize Adjuster Modal */}
      <ImageCropModal
        isOpen={cropModalOpen}
        imageSrc={imageToCrop}
        onClose={() => {
          setCropModalOpen(false);
          setImageToCrop(null);
        }}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
};

export default ProfileHeader;
