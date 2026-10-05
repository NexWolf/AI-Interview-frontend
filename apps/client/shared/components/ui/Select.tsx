import { cn } from "@/shared/lib/utils";
import { ChevronDown } from "lucide-react";
import { forwardRef, type ReactNode, type SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  leading?: ReactNode;
  options?: readonly (string | SelectOption)[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, className, leading, id, options = [], placeholder, children, ...props }, ref) => {
    const selectId = id ?? props.name;

    return (
      <div className="relative w-full space-y-1 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-medium text-muted-foreground"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leading && (
            <span className="pointer-events-none absolute left-3 z-10 flex items-center justify-center text-muted-foreground">
              {leading}
            </span>
          )}

          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full rounded-lg border border-input-border bg-background px-3 py-2 text-sm text-input-foreground",
              "outline-none transition-all duration-200 cursor-pointer appearance-none pr-9",
              "focus:border-input-focus-border focus:ring-2 focus:ring-input-focus-ring/30",
              "disabled:cursor-not-allowed disabled:opacity-50",
              leading && "pl-10",
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-muted-foreground bg-background">
                {placeholder}
              </option>
            )}

            {options.map((opt) => {
              const value = typeof opt === "string" ? opt : opt.value;
              const label = typeof opt === "string" ? opt : opt.label;
              return (
                <option key={value} value={value} className="bg-background text-foreground py-1">
                  {label}
                </option>
              );
            })}

            {children}
          </select>

          <span className="pointer-events-none absolute right-3 flex items-center justify-center text-muted-foreground">
            <ChevronDown className="h-4 w-4 opacity-70" />
          </span>
        </div>
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
