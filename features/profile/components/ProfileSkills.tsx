import ActionIcons from "@/shared/components/ui/ActionIcons";
import { mockProfileData, SkillApi } from "./ProfilePreview";

type PropsSkills = {
  skillsData: SkillApi | null;
  onEdit?: () => void;
  onAdd?: () => void;
  editable ?: boolean;
};

// دالة مساعدة لتحديد تنسيق ولون مستوى المهارة
const getLevelBadge = (level?: SkillApi["level"]) => {
  switch (level) {
    case "Expert":
      return {
        label: "Expert",
        className:
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      };
    case "Intermediate":
      return {
        label: "Intermediate",
        className:
          "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      };
    case "Beginner":
      return {
        label: "Beginner",
        className:
          "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      };
    case "Not Assessed":
    default:
      return {
        label: "Not Assessed",
        className: "bg-muted text-muted-foreground border-border/60",
      };
  }
};

export const ProfileSkills = ({ skillsData, onEdit, onAdd , editable}: PropsSkills) => {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-foreground">
            Skills & Expertise
          </h2>
          <span className="text-xs text-muted-foreground">
            {mockProfileData.skills.length} Skills
          </span>
        </div>

        {/* Actions Icons */}
        {editable && <ActionIcons onAdd={onAdd} onEdit={onEdit}/>}
      </div>

      {mockProfileData.skills.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">
          No skills added yet.
        </p>
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
  );
};

export default ProfileSkills;
