// components/profile/ProfileHeader.tsx
import Image from "next/image";
import { Plus, Pencil, MapPin, Calendar, Link2 } from "lucide-react";
import { BioDataType, profileDataType } from "@/types/community/profile";
import ActionButton from "../shared/ActionButton";

interface ProfileHeaderProps {
  data: BioDataType;
  onAdd?: () => void;
  onEdit?: () => void;
}

export const ProfileHeader = ({ data, onAdd, onEdit }: ProfileHeaderProps) => {
//   const currentXp = data.level?.currentXP ?? 0;
//   const nextLevel = data.level?.maxXP ?? 0;
//   const percentage = Math.min(Math.max((nextLevel / currentXp) * 100, 0));
  return (
    <div className="relative w-full overflow-hidden rounded-md border border-slate-800/80 bg-[#0B0F17] p-6 text-slate-200 shadow-xl backdrop-blur-md ">
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-15"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: "16px 16px",
        }}
      />

      <ActionButton onAdd={onAdd} onEdit={onEdit} />

      {/* Main Content  */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar Image */}
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-slate-700/50 shadow-inner">
          <Image
            src={data?.personal_photo ?? ""}
            alt={data.lastName}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* User Info Details */}
        <div className="flex flex-1 flex-col items-center sm:items-start text-center sm:text-left">
          {/* Name & Headline */}
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            {data.firstName} {data.lastName}
          </h1>
          <p className="text-sm font-medium text-slate-400 mt-0.5">
            {data.headline}
          </p>

          {/* About Section Sub-text */}
          <div className="text-xs max-w-xl">
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              {data.about ||
                "Passionate about building clean, scalable and user-focused web experiences."}
            </p>
          </div>

          {/* Metadata Row (Location, Joined Date, Website) */}
          <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-y-2 gap-x-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>{data.location}</span>
            </div>

            <span className="hidden sm:inline text-slate-700">|</span>

            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Joined {data.join_at}</span>
            </div>

            {data.website_url && (
              <>
                <span className="hidden sm:inline text-slate-700">|</span>
                <div className="flex items-center gap-1.5">
                  <Link2 className="h-3.5 w-3.5 text-slate-400" />
                  <a
                    href={`https://${data.website_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-slate-200 transition-colors"
                  >
                    {data.website_url}
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

{
  /* <div className="mt-3 max-w-xl">
            <h2 className="text-xs font-semibold text-slate-300">Education</h2>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              {data.university}
            </p>
          </div>

          <div className="mt-3 w-full">
            <h2 className="text-xs font-semibold text-slate-300">Level</h2>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              {data.level?.level}
            </p>

            <div className="w-full space-y-2">
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-800/80 p-[1px] shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#8B6B4D] via-[#C6A87D] to-[#E3D3B4] transition-all duration-500 ease-out shadow-[0_0_12px_rgba(198,168,125,0.4)]"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div> */
}
