"use client";

import ActionIcons from "@/shared/components/ui/ActionIcons";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import FormDialog from "@/shared/components/form/FormDialog";
import { useForm } from "react-hook-form";
import { Input } from "@/shared/components/ui/Input";
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
} from "lucide-react";
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
      avatarUpload : null,
    };
  }, [data]);

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
    console.log("THIS IS AVATAR UPLOAD FROM ULOAD INPUT",watchSocialLinks);
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
            <FileUploadInput name="avatarUpload" label="" multiple={false}/>
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
          <div className="relative h-28 w-28 sm:h-36 sm:w-36 shrink-0 rounded-full border-4 border-card dark:border-card/90 bg-muted  shadow-xl ring-2 ring-primary/10 flex items-center justify-center text-primary-foreground font-bold text-2xl sm:text-3xl bg-gradient-to-tr from-primary to-primary/70">
            <span className="absolute top-0 right-2 ">
              {/* <ActionIcons onEdit={() => setOpenImageForm(true)} /> */}
            </span>
            {data?.avatarUrl ? (
              <Image
                src={data?.avatarUrl as string ?? ""}
                alt={data?.userName ?? "UserImage"}
                fill
                sizes="(max-width: 640px) 112px, 144px"
                priority
                className="object-cover"
              />
            ) : (
              <span>
                {data?.firstName[0]}
                {data?.lastName[0]}
              </span>
            )}
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
    </div>
  );
};

export default ProfileHeader;
