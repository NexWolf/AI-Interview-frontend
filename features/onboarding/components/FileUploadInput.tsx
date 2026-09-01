"use client";

import { useState } from "react";
import { Cloud } from "lucide-react";
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
  acceptedLabel?: string,
  rules?:RegisterOptions<T , FieldPath<T>>
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
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wide text-navy-700">
              {label}
            </label>

            <label
              htmlFor={name}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-3 w-full rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-colors ${
                isDragging
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-gray-300 bg-white hover:bg-gray-50"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                <Cloud className="w-6 h-6 text-white" />
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-800">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
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

            {error && (
              <p className="text-xs text-red-500">{error.message}</p>
            )}

            {files.length > 0 && (
              <ul className="flex flex-col gap-2 mt-1">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 text-sm text-gray-700"
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="text-gray-400 hover:text-red-500 ml-2"
                    >
                      Remove
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