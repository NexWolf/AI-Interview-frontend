import { useFormContext } from "react-hook-form";
import { Sparkles, Briefcase, Award } from "lucide-react";



const interviewLevel = [
  {
    id: 1,
    title: "Junior",
    subTitle: "0 - 2 years",
    value: "Beginner",
    icon: Sparkles,
  },
  {
    id: 2,
    title: "Mid-level",
    subTitle: "2 - 5 years",
    value: "Intermediate",
    icon: Briefcase,
  },
  {
    id: 3,
    title: "Senior",
    subTitle: "5+ years",
    value: "Advanced",
    icon: Award,
  },
];

export const InterviewLevelSelect = () => {

    const {register} = useFormContext();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      {interviewLevel.map((level) => {
        const Icon = level.icon;

        return (
          <label
            key={level.id}
            className="group relative flex items-center justify-between p-4 rounded-xl border border-border bg-card/60 hover:bg-muted/50 transition-all duration-200 cursor-pointer select-none shadow-sm hover:shadow-md active:scale-[0.98] has-[:checked]:border-primary has-[:checked]:bg-primary/10 dark:has-[:checked]:bg-primary/15 has-[:checked]:ring-1 has-[:checked]:ring-primary/30"
          >
            <div className="flex items-center gap-3.5">
              {/* زر راديو بتصميم مخصص بدل الافتراضي */}
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  value={level.value}
                  {...register("difficultyLevel")}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center transition-all duration-200 peer-checked:border-primary peer-checked:bg-primary">
                  <div className="w-2 h-2 rounded-full bg-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* نصوص المستوى */}
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground group-has-[:checked]:text-primary transition-colors">
                  {level.title}
                </span>
                <span className="text-xs text-muted-foreground transition-colors">
                  {level.subTitle}
                </span>
              </div>
            </div>

            {/* أيقونة المستوى التفاعلية */}
            <Icon className="w-5 h-5 text-muted-foreground group-has-[:checked]:text-primary group-has-[:checked]:scale-110 transition-all duration-200" />
          </label>
        );
      })}
    </div>
  );
};

export default InterviewLevelSelect;