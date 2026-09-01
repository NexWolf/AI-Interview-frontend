"use client";
import { Input } from "@/shared/components/ui/Input";
import { useFieldArray, useFormContext } from "react-hook-form";

type PropsEducation = {
  onBack?: () => void;
};

const EducationStep = ({ onBack }: PropsEducation) => {
  const {
    register,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext();

  const { append, remove, fields } = useFieldArray({
    control,
    name: "education",
  });

  return (
    <div className="space-y-6 max-w-xl mx-auto p-6 bg-card rounded-2xl border border-border/50 shadow-sm">
      {/* Header & Title */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">
          Education Details
        </h3>
        <p className="text-xs text-muted-foreground">
          Add your academic background and degrees.
        </p>
      </div>

      {/* Dynamic Education Fields */}
      <div className="space-y-6">
        {fields.map((filed, index) => {
          const isCurrent = watch(`education.${index}.isCurrent`);
          return (
            <div
              key={index}
              className="relative space-y-4 p-5 rounded-xl border border-border/60 bg-background/50 backdrop-blur-xs transition-all duration-200 hover:border-border"
            >
              {/* Card Badge & Delete Option */}
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Education #{index + 1}
                </span>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Input Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="University Name"
                  {...register("education.institution")}
                />
                <Input
                  label="Degree"
                  type="number"
                  {...register("education.degree")}
                />
              </div>

              <Input
                label="Field Study"
                {...register("education.fieldOfStudy")}
              />

              {/* Styled Radio / Checkbox Section */}
              <div className="pt-1">
                <label
                  htmlFor={`isCurrent-${index}`}
                  className="group relative flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-all duration-200 cursor-pointer select-none"
                >
                  <div className="relative flex items-center justify-center">
                    <Input
                      label=""
                      id={`isCurrent-${index}`}
                      type="radio"
                      {...register(`education.${index}.isCurrent`)}
                      className="peer h-4 w-4 appearance-none rounded-full border border-input bg-background checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all cursor-pointer"
                    />
                    <span className="pointer-events-none absolute h-2 w-2 rounded-full bg-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                    I am currently studying here
                  </span>
                </label>
              </div>

              {/* Dates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="relative">
                  <Input
                    label="Start Data"
                    {...register("education.startDate")}
                    type="month"
                    className="w-full h-11 px-3.5 text-sm bg-background text-foreground rounded-xl border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 cursor-pointer"
                  />
                </div>
                {!isCurrent && (
                  <div className="relative">
                    <Input
                      label="End Data"
                      {...register("education.endData")}
                      type="month"
                      className="w-full h-11 px-3.5 text-sm bg-background text-foreground rounded-xl border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              <Input
                label="Description"
                {...register("education.description")}
              />
            </div>
          );
        })}
      </div>

      {/* Add Button */}
      <div className="flex items-center justify-center pt-2">
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
          className="group flex items-center justify-center gap-2 w-full py-3 border border-dashed border-border/80 hover:border-primary/60 rounded-xl bg-muted/10 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-primary/10 group-hover:bg-primary text-primary group-hover:text-primary-foreground flex items-center justify-center text-sm font-medium transition-all duration-200">
            +
          </div>
          <span className="text-xs font-semibold">Add Another Education</span>
        </button>
      </div>

      {/* Navigation Buttons */}
      {onBack && (
        <div className="flex items-center pt-4 border-t border-border/40">
          <button
            type="button"
            onClick={onBack}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default EducationStep;
