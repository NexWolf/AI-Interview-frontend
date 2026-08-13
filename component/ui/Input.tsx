import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, leading, id, trailing, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="relative">
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          {label}
        </label>

        <div>
          {leading && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leading}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900",
              "outline-none transition",
              "placeholder:text-slate-400",
              "focus:border-slate-500 focus:ring-2 focus:ring-slate-200",
              "disabled:cursor-not-allowed disabled:bg-slate-100",
              "dark:border-slate-600 dark:bg-slate-800 dark:text-white",
              "dark:placeholder:text-slate-500",
              "dark:focus:border-slate-400 dark:focus:ring-slate-700",
              leading && "pl-10",
              trailing && "pr-10",
              className,
            )}
            {...props}
          />

          {trailing && (
            <span className="absolute right-4 flex items-center">
              {trailing}
            </span>
          )}
        </div>
      </div>
    );
  },
);

Input.displayName = "Input";
