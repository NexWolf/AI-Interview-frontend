"use client";
import ActionIcons from "@/shared/components/ui/ActionIcons";
import { mockProfileData } from "./ProfilePreview";
import Image from "next/image";
import { useEffect, useState } from "react"; 
import FormTag from "@/shared/components/form/FormTag";
import BasicStep from "@/features/onboarding/components/BasicStep";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";

type PropsPropfile = {
  onEdit ?: () => void;
  onStart ?: () => void;
  editable ?: boolean; 
  bioData : null;
  basicData : null
};

const handleEditHeader = () => {
  console.log("submited");
}

export const ProfileHeader = ({ onEdit, onStart , bioData , basicData , editable}: PropsPropfile) => {
  const [openForm , setOpenForm] = useState<boolean>(true);

  useEffect(() => {
    console.log(openForm);
  }, [openForm]);

  return (
    <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-xs">

    {openForm && (
      <Dialog open={openForm} onOpenChange={setOpenForm}>
      {/* 1. زر فتح الـ Popup */}
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-secondary-foreground bg-secondary hover:bg-secondary/80 border border-border/60 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <Pencil className="w-4 h-4 text-muted-foreground" />
          <span>Edit Bio</span>
        </button>
      </DialogTrigger>

      {/* 2. محتوى الـ Popup */}
      <DialogContent className="sm:max-w-lg rounded-2xl border-border/60 bg-card p-6 shadow-lg">
        <DialogHeader className="space-y-1.5 text-left">
          <DialogTitle className="text-xl font-bold text-foreground">
            Edit Bio Data
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update your bio and personal information below.
          </DialogDescription>
        </DialogHeader>

        {/* 3. النموذج المدمج داخلياً */}
        <div className="pt-2">
          <FormTag
            onSubmit={handleEditHeader}
            FORM_DATA={BasicStep}
          >
            <BasicStep  />
          </FormTag>
        </div>
      </DialogContent>
    </Dialog>
    )}


    {/* Cover Banner */}
    <div className="h-32 md:h-44 bg-linear-to-br from-primary/30 via-primary/10 to-background" />

    <div className="p-6 pt-0 relative">
      {/* Avatar & Actions Row */}
      <div className="flex justify-between items-end -mt-16 md:-mt-20 mb-4">
        <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-card bg-muted overflow-hidden shadow-md flex items-center justify-center text-muted-foreground font-bold text-2xl">
          {mockProfileData.bioData.avatar ? (
            <Image
              src={mockProfileData.bioData.avatar}
              alt={mockProfileData.basicData.userName}
              fill
              sizes="(max-width: 768px) 112px, 144px"
              priority
              className="object-cover"
            />
          ) : (
            <span>
              {mockProfileData.basicData.firstName[0]}
              {mockProfileData.basicData.lastName[0]}
            </span>
          )}
        </div>


        {/* Action Buttons Row */}
        <div className="flex items-center gap-3">
          {editable && (
            <button
              type="button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <span>🎯</span>
              <span>Start Interview</span>
            </button>
          )}

          {editable && (
           <ActionIcons onEdit={() => setOpenForm(true)}/>
          )}
        </div>
      </div>

      {/* User Details */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">
              {mockProfileData.basicData.firstName}{" "}
              {mockProfileData.basicData.lastName}
            </h1>
            {mockProfileData.isVerified && (
              <span className="text-primary text-sm bg-primary/10 px-2 py-0.5 rounded-full font-medium">
                ✓ Verified
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            @{mockProfileData.basicData.userName}
          </p>
        </div>

        {/* Bio */}
        {mockProfileData.bioData.bio && (
          <p className="text-sm text-foreground/90 leading-relaxed max-w-2xl">
            {mockProfileData.bioData.bio}
          </p>
        )}

        {/* Contact & Social Links Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1 border-t border-border/40">
          <div className="flex items-center gap-1">
            <span>📧</span>
            <span>{mockProfileData.basicData.email}</span>
          </div>
          {mockProfileData.basicData.phoneNumber && (
            <div className="flex items-center gap-1">
              <span>📞</span>
              <span>{mockProfileData.basicData.phoneNumber}</span>
            </div>
          )}
          {mockProfileData.bioData.socialLink && (
            <a
              href={mockProfileData.bioData.socialLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <span>🔗</span>
              <span>Portfolio / Link</span>
            </a>
          )}
        </div>
      </div>
    </div>
  </div>
  )
};

export default ProfileHeader;