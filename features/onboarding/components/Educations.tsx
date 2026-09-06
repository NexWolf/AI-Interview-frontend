"use client";

import { Input } from "@/shared/components/ui/Input";
import { useFieldArray, useFormContext } from "react-hook-form";
import { GraduationCap, Plus, Trash2, ArrowLeft, Calendar } from "lucide-react";

type PropsEducation = {
  onBack?: () => void;
};

const EducationStep = ({ onBack }: PropsEducation) => {
  const { register, control, watch } = useFormContext();

  const { append, remove, fields } = useFieldArray({
    control,
    name: "education",
  });

  return (
    <div className="space-y-6">
      {/* 1. قائمة المؤهلات التعليمية الديناميكية */}
      <div className="space-y-5">
        {fields.map((field, index) => {
          const isCurrent = watch(`education.${index}.isCurrent`);

          return (
            <div
              key={field.id}
              className="relative space-y-4 rounded-2xl border border-border/60 dark:border-border/40 bg-secondary/20 dark:bg-secondary/10 p-5 sm:p-6 backdrop-blur-xs transition-all duration-200 hover:border-primary/40"
            >
              {/* ترويسة البطاقة مع زر الحذف */}
              <div className="flex items-center justify-between pb-3 border-b border-border/50 dark:border-border/30">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span>Education #{index + 1}</span>
                </div>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                    title="Remove this education entry"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              {/* حقول الجامعة والدرجة العلمية */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="University / Institution"
                  placeholder="Ex: Stanford University"
                  {...register(`education.${index}.institution`)}
                />
                <Input
                  label="Degree"
                  placeholder="Ex: Bachelor's, Master's"
                  {...register(`education.${index}.degree`)}
                />
              </div>

              {/* حقل التخصص */}
              <Input
                label="Field of Study"
                placeholder="Ex: Computer Science & Software Engineering"
                {...register(`education.${index}.fieldOfStudy`)}
              />

              {/* خيار "حالياً أدرس هنا" كـ Checkbox احترافي */}
              <div className="pt-1">
                <label
                  htmlFor={`isCurrent-${index}`}
                  className="group flex items-center gap-3 p-3 rounded-xl border border-border/60 dark:border-border/40 bg-card/60 dark:bg-card/20 hover:border-primary/40 transition-all cursor-pointer select-none"
                >
                  <input
                    id={`isCurrent-${index}`}
                    type="checkbox"
                    {...register(`education.${index}.isCurrent`)}
                    className="h-4 w-4 rounded-md border-border/80 text-primary accent-primary focus:ring-primary/20 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                    I am currently studying here
                  </span>
                </label>
              </div>

              {/* شبكة تواريخ الدراسة */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <Input
                    label="Start Date"
                    type="month"
                    {...register(`education.${index}.startDate`)}
                  />
                </div>

                {!isCurrent ? (
                  <div className="space-y-1 animate-in fade-in">
                    <Input
                      label="End Date"
                      type="month"
                      {...register(`education.${index}.endDate`)}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col justify-end pb-1">
                    <div className="flex items-center gap-2 h-10 px-3.5 rounded-xl border border-border/40 bg-muted/40 text-xs text-muted-foreground font-medium">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>Present (Expected completion)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* حقل الوصف الإضافي */}
              <Input
                label="Description (Optional)"
                placeholder="Activities, societies, thesis topic or academic honors..."
                {...register(`education.${index}.description`)}
              />
            </div>
          );
        })}
      </div>

      {/* 2. زر إضافة مؤهل علمي آخر */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() =>
            append({
              institution: "",
              degree: null,
              fieldOfStudy: "",
              startDate: "",
              endDate: "",
              isCurrent: false,
              description: "",
            })
          }
          className="group flex items-center justify-center gap-2 w-full py-3.5 border-2 border-dashed border-border/70 dark:border-border/40 hover:border-primary/60 rounded-2xl bg-card/40 dark:bg-card/20 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer"
        >
          <div className="h-6 w-6 rounded-full bg-primary/10 group-hover:bg-primary text-primary group-hover:text-primary-foreground flex items-center justify-center transition-all duration-200">
            <Plus className="h-4 w-4" />
          </div>
          <span className="text-xs sm:text-sm font-semibold">
            Add Another Education
          </span>
        </button>
      </div>

      {/* 3. زر الرجوع للخلف (Back Button) */}
      {onBack && (
        <div className="flex items-center pt-6 border-t border-border/50 dark:border-border/30">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/60 dark:border-border/40 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default EducationStep;