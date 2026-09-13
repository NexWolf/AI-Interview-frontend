"use client";

import { Input } from "@/shared/components/ui/Input";
import { Plus, Trash2, Globe, Link2 } from "lucide-react";
import { useEffect } from "react";
import {
  FieldPath,
  FieldValues,
  useFieldArray,
  useFormContext,
} from "react-hook-form";

type SocialLinkProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label?: string;
};

export const SocialLinks = <T extends FieldValues>({
  name,
  label = "Social Profiles & Links",
}: SocialLinkProps<T>) => {
  const { control, register , watch} = useFormContext<T>();

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: name as never,
  });

  const socialLinksWatch = watch(name);

  useEffect(() => {
    console.log(socialLinksWatch)
    console.log(fields.length)
  },[socialLinksWatch])

  return (
    <div className="space-y-3 w-full">
      {/* 1. ترويسة القسم وعداد الروابط */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-primary" />
          <span>{label}</span>
        </label>
        {fields.length > 0 && (
          <span className="text-[11px] text-muted-foreground font-medium">
            {fields.length} {fields.length === 1 ? "link" : "links"}
          </span>
        )}
      </div>

      {/* 2. قائمة الروابط المضافة */}
      <div className="space-y-2.5">
        {fields.map((field, index) => {
          return (
            <div
              key={field.id}
              className="flex items-center gap-2.5 group animate-in fade-in duration-200"
            >
              {/* حقل الرابط */}
              <div className="flex-1 min-w-0">
                <Input
                  {...register(`${name}.${index}.value` as FieldPath<T>)}
                  placeholder="https://linkedin.com/in/username or github.com/..."
                />
              </div>

              {/* زر الحذف - يظهر إذا كان هناك أكثر من رابط أو للحذف المباشر */}
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  title="Remove this link"
                  className="h-10 w-10 shrink-0 rounded-xl border border-border/60 dark:border-border/40 bg-secondary/30 dark:bg-secondary/10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}

        {/* تنبيه في حال عدم وجود أي رابط بعد */}
        {fields.length === 0 && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl border border-dashed border-border/60 dark:border-border/40 bg-secondary/10 text-xs text-muted-foreground">
            <Link2 className="w-4 h-4 text-primary shrink-0" />
            <span>No social profiles added yet. Add your LinkedIn, GitHub, or portfolio below.</span>
          </div>
        )}
      </div>

      {/* 3. زر إضافة رابط جديد */}
      <button
        type="button"
        onClick={() => {
            console.log("before")
            append({value : ""} as never)
            console.log("after")
        }}
        className="group flex items-center justify-center gap-2 w-full py-2.5 border border-dashed border-border/70 dark:border-border/40 hover:border-primary/50 rounded-xl bg-secondary/20 dark:bg-secondary/10 hover:bg-primary/5 text-xs font-medium text-muted-foreground hover:text-primary transition-all duration-200 active:scale-[0.99] cursor-pointer"
      >
        <div className="h-5 w-5 rounded-full bg-primary/10 group-hover:bg-primary text-primary group-hover:text-primary-foreground flex items-center justify-center transition-all duration-200">
          <Plus className="w-3 h-3" />
        </div>
        <span>Add New Link</span>
      </button>
    </div>
  );
};

export default SocialLinks;