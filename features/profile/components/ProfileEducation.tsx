import ActionIcons from "@/shared/components/ui/ActionIcons";
import { mockProfileData } from "./ProfilePreview";
import { EducationApi } from "../types/profile.types";

type EducationProps = {
    editable : boolean,
    educationData : EducationApi[] | [],
    onEdit ?: () => void,
    onAdd ?: () => void, 
}

export const ProfileEducation = ({educationData , onEdit , onAdd , editable} : EducationProps) => { 
    return (
         <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground border-b border-border/40 pb-3">
          Education
        </h2>

         {editable && (
                <ActionIcons onEdit={onEdit} onAdd={onAdd}/>
            )}
        </div>

        {mockProfileData.education.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No education entries added yet.</p>
        ) : (
          <div className="space-y-6">
            {educationData.map((edu, index) => (
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
    )
}

export default ProfileEducation;