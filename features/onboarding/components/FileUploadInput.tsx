"use client";

import { useState } from "react";
import { Cloud, FileText, X } from "lucide-react";
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
  RegisterOptions,
} from "react-hook-form";

const DEFAULT_MAX_SIZE_MB = 10;
const DEFAULT_ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "application/pdf",
  "text/plain",
];
const DEFAULT_ACCEPTED_LABEL = "PNG, JPG, PDF, TXT";

type PropsUpload<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
  multiple?: boolean;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  acceptedLabel?: string;
  rules?: RegisterOptions<T, FieldPath<T>>;
};

export function FileUploadInput<T extends FieldValues>({
  name,
  label,
  multiple = true,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  acceptedLabel = DEFAULT_ACCEPTED_LABEL,
  rules,
}: PropsUpload<T>) {
  const { control } = useFormContext<T>();
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const files: File[] = Array.isArray(value) ? value : [];

        const validateAndAdd = (incoming: FileList | null) => {
          if (!incoming) return;

          const validFiles = Array.from(incoming).filter((file) => {
            const isTypeOk = acceptedTypes.includes(file.type);
            const isSizeOk = file.size <= maxSizeMB * 1024 * 1024;
            return isTypeOk && isSizeOk;
          });

          if (validFiles.length === 0) return;

          onChange(multiple ? [...files, ...validFiles] : [validFiles[0]]);
        };

        const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
          e.preventDefault();
          setIsDragging(false);
          validateAndAdd(e.dataTransfer.files);
        };

        const handleRemove = (index: number) => {
          const updated = files.filter((_, i) => i !== index);
          onChange(updated);
        };

        return (
          <div className="flex flex-col gap-2 w-full">
            {/* عنوان الحقل */}
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </label>

            {/* منطقة الإفلات والرفع الزجاجية */}
            <label
              htmlFor={name}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`group flex flex-col items-center justify-center gap-3 w-full rounded-2xl border-2 border-dashed p-8 sm:p-10 cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-primary bg-primary/10 ring-4 ring-primary/10"
                  : "border-border/70 dark:border-border/40 bg-card/40 dark:bg-card/20 hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              {/* أيقونة السحابة التفاعلية */}
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-transform duration-300 group-hover:scale-110 shadow-xs">
                <Cloud className="w-6 h-6" />
              </div>

              {/* النصوص التوضيحية */}
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  Maximum file size {maxSizeMB}MB ({acceptedLabel})
                </p>
              </div>

              <input
                id={name}
                type="file"
                multiple={multiple}
                accept={acceptedTypes.join(",")}
                className="hidden"
                onChange={(e) => {
                  validateAndAdd(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>

            {/* رسالة الخطأ المتوافقة مع الثيم */}
            {error && (
              <p className="text-destructive text-xs font-medium px-1 mt-0.5">
                {error.message}
              </p>
            )}

            {/* قائمة الملفات التي تم رفعها */}
            {files.length > 0 && (
              <ul className="flex flex-col gap-2 mt-2">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-border/60 dark:border-border/40 bg-secondary/40 dark:bg-secondary/20 text-xs text-foreground backdrop-blur-xs transition-all animate-in fade-in"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-4 h-4 text-primary shrink-0" />
                      <span className="truncate font-medium">{file.name}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-1 rounded-md transition-all ml-2 cursor-pointer"
                      title="Remove file"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      }}
    />
  );
}

export default FileUploadInput;