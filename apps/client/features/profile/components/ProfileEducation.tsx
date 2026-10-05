import ActionIcons from "@/shared/components/ui/ActionIcons";
import { EducationApi } from "../types/profile.types";
import { useEffect, useMemo, useState } from "react";
import Educations from "@/features/onboarding/components/Educations";
import { useForm } from "react-hook-form";
import { EducationData } from "../types/profileEducation.types";
import FormDialog from "@/shared/components/form/FormDialog";
import { useLanguage } from "@/shared/context/LanguageContext";

type EducationProps = {
  editable: boolean;
  educationData: EducationApi[] | [];
  onSave?: (data: FormData) => void;
};

export const ProfileEducation = ({
  educationData,
  onSave,
  editable,
}: EducationProps) => {


  const initialFormData: EducationData = useMemo(() => {
    if (educationData && Array.isArray(educationData) && educationData.length > 0) {
      return {
        educations: educationData.map((item) => ({
          institution: item.institution,
          degree: item.degree,
          fieldOfStudy: item.fieldOfStudy,
          endDate: item.endDate,
          startDate: item.startDate,
          isCurrent: item.isCurrent,
          description: item.description,
        })),
      };
    }

    return {
      educations: [
        {
          institution: "",
          degree: "",
          fieldOfStudy: "",
          endDate: "",
          startDate: "",
          isCurrent: false,
          description: "",
        },
      ],
    };
  }, [educationData]);

  const methods = useForm<EducationData>({
    defaultValues: initialFormData,
  });

  const { reset } = methods;

  useEffect(() => {
    if(educationData && educationData.length > 0) {
       reset(initialFormData);
    }
    
  }, [initialFormData, educationData, reset]);

  const handleFormSubmit = (data: EducationData) => {
    const formData = new FormData();
    data.educations.forEach((item, index) => {
      formData.append(`education[${index}][institution]`, item.institution);
      formData.append(`education[${index}][degree]`, item.degree);
      formData.append(`education[${index}][fieldOfStudy]`, item.fieldOfStudy);
      if(item.endDate) {
        formData.append(`education[${index}][endDate]`, item.endDate);
      }
      formData.append(`education[${index}][startDate]`, item.startDate);
      formData.append(`education[${index}][isCurrent]`, String(item.isCurrent));
      formData.append(`education[${index}][description]`, item.description);
    });

    if (onSave) {
      onSave(formData);
      setOpenForm(false);
    }
  };

  const [openForm, setOpenForm] = useState<boolean>(false);
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs space-y-4">
      {openForm && (
        <FormDialog
          title={isAr ? "تعديل بيانات التعليم" : "Edit Education Data"}
          description={
            isAr
              ? "قم بتحديث معلوماتك الأكاديمية والجامعية أدناه."
              : "Update your Education information below."
          }
          onOpen={openForm}
          onClose={() => {
            setOpenForm(false);
            reset(initialFormData);
          }}
          onSubmit={handleFormSubmit}
          methods={methods}
          form_button_title={isAr ? "حفظ" : "Save"}
          loading_title={isAr ? "جاري الحفظ..." : "Saving..."}
        >
          <Educations name="educations" />
        </FormDialog>
      )}

      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <h2 className="text-lg font-bold text-foreground">
          {isAr ? "التعليم والمؤهلات الأكاديمية" : "Education"}
        </h2>

        {editable && <ActionIcons onEdit={() => setOpenForm(true)} />}
      </div>

      {!educationData || educationData.length === 0 ? (
        <p className="text-xs text-muted-foreground italic py-2">
          {isAr ? "لم تتم إضافة أي مؤهلات تعليمية بعد." : "No education entries added yet."}
        </p>
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
                  {edu.fieldOfStudy}{" "}
                  {edu.degree ? `• Degree Code: ${edu.degree}` : ""}
                </p>
                <p className="text-xs text-muted-foreground/80">
                  {edu.startDate} — {edu.isCurrent ? (isAr ? "حتى الآن" : "Present") : edu.endDate}
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
  );
};

export default ProfileEducation;
