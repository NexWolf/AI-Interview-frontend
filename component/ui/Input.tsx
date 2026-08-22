import { cn } from "@/lib/utils";
import { forwardRef,  type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, leading, id, trailing, ...props }, ref) => {
    const inputId = id ?? props.name;


    return (
      <div className="relative w-full space-y-1 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-[#9DA5B4]"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leading && (
            <span className="pointer-events-none absolute left-3 flex items-center justify-center text-[#9DA5B4]">
              {leading}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-lg border border-[#232B34] bg-[#161C22] px-3 py-2 text-sm text-white",
              "placeholder-[#9DA5B4]/50 outline-none transition-colors duration-200",
              "focus:border-[#7E5F43] focus:ring-1 focus:ring-[#7E5F43]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              leading && "pl-10",
              trailing && "pr-10",
              className
            )}
            {...props}
          />

          {trailing && (
            <span className="absolute right-3 flex items-center justify-center text-[#9DA5B4]">
              {trailing}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";