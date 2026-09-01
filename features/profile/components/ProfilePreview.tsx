"use client";

import Image from "next/image";

export interface SkillApi {
  id: number;
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Expert' | 'Not Assessed';
}

type ProfileViewProps = {
  userName: string;
};

export const mockProfileData = {
  basicData: {
    firstName: "Ahmed",
    lastName: "Jheer",
    userName: "ahmed_jheer",
    email: "ahmed@example.com",
    phoneNumber: "+970 590 000 000",
  },
  bioData: {
    avatar: "/ahmedprofile.jpeg",
    bio: "Frontend Developer specializing in React, Next.js, and TypeScript. Passionate about clean code and UI/UX architecture.",
    socialLink: "https://admin-portfolio-delta-flame.vercel.app/",
  },
  education: [
    {
      institution: "Islamic University of Gaza",
      fieldOfStudy: "Computer Engineering",
      degree: 101,
      startDate: "2020",
      endDate: "2024",
      isCurrent: false,
      description: "Focused on software engineering principles, web development, and algorithms.",
    },
  ],
  skills: [
    { id: 1, name: "React", level: "Expert" },
    { id: 2, name: "Next.js", level: "Intermediate" },
    { id: 3, name: "TypeScript", level: "Expert" },
    { id: 4, name: "Tailwind CSS", level: "Intermediate" },
    { id: 5, name: "Node.js", level: "Beginner" },
    { id: 6, name: "GraphQL", level: "Not Assessed" },
    { id: 7, name: "Docker" },
  ] as SkillApi[],
  isVerified: true,
};

// دالة مساعدة لتحديد تنسيق ولون مستوى المهارة
const getLevelBadge = (level?: SkillApi['level']) => {
  switch (level) {
    case 'Expert':
      return { label: 'Expert', className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
    case 'Intermediate':
      return { label: 'Intermediate', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' };
    case 'Beginner':
      return { label: 'Beginner', className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
    case 'Not Assessed':
    default:
      return { label: 'Not Assessed', className: 'bg-muted text-muted-foreground border-border/60' };
  }
};

export const ProfilePreview = ({ userName }: ProfileViewProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 pt-12">
      {/* 1. Main Header Card (Banner + Avatar + Basic Info) */}
      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-xs">
        {/* Cover Banner */}
        <div className="h-32 md:h-44 bg-gradient-to-br from-primary/30 via-primary/10 to-background" />

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

            {/* Action Buttons Row
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <span>🎯</span>
                <span>Start Interview</span>
              </button>

              <button
                type="button"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/60 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer"
              >
                Edit Profile
              </button>
            </div> */}
          </div>

          {/* User Details */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {mockProfileData.basicData.firstName} {mockProfileData.basicData.lastName}
                </h1>
                {mockProfileData.isVerified && (
                  <span className="text-primary text-sm bg-primary/10 px-2 py-0.5 rounded-full font-medium">
                    ✓ Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">@{mockProfileData.basicData.userName}</p>
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

      {/* 3. Skills Section */}
      <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <h2 className="text-lg font-bold text-foreground">
            Skills & Expertise
          </h2>
          <span className="text-xs text-muted-foreground">
            {mockProfileData.skills.length} Skills
          </span>
        </div>

        {mockProfileData.skills.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No skills added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {mockProfileData.skills.map((skill) => {
              const badge = getLevelBadge(skill.level);
              return (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-border transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* الدائرة الموحدة بالحرف الأول */}
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-bold uppercase shrink-0">
                      {skill.name[0]}
                    </div>
                    <span className="text-sm font-medium text-foreground truncate">
                      {skill.name}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border shrink-0 ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Education Section */}
      <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-foreground border-b border-border/40 pb-3">
          Education
        </h2>

        {mockProfileData.education.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No education entries added yet.</p>
        ) : (
          <div className="space-y-6">
            {mockProfileData.education.map((edu, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-muted/60 border border-border/40 flex items-center justify-center shrink-0 text-muted-foreground font-semibold text-sm">
                  🎓
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {edu.institution}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {edu.fieldOfStudy} {edu.degree ? `• Degree Code: ${edu.degree}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground/80">
                    {edu.startDate} — {edu.isCurrent ? "Present" : edu.endDate}
                  </p>
                  {edu.description && (
                    <p className="text-xs text-foreground/80 pt-1 leading-normal">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      
    </div>
  );
};

export default ProfilePreview;