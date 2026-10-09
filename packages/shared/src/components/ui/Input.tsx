import { cn } from "../../lib/utils";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, leading, id, trailing, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="relative w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-foreground/80 tracking-wide"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leading && (
            <span className="pointer-events-none absolute left-3 flex items-center justify-center text-muted-foreground">
              {leading}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-sm text-foreground",
              "placeholder:text-muted-foreground/60 outline-none transition-all duration-200",
              "focus:border-primary focus:ring-2 focus:ring-primary/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              leading && "pl-10",
              trailing && "pr-10",
              className,
            )}
            {...props}
          />

          {trailing && (
            <span className="absolute right-3 flex items-center justify-center text-muted-foreground">
              {trailing}
            </span>
          )}
        </div>
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
