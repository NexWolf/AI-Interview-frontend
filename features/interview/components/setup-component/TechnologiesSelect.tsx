import { useUserSkills } from "@/shared/hook/useUserSkills";
import { useAllSkills } from "@/shared/hook/useAllSkills";
import { useFormContext } from "react-hook-form";

export const TecnologiesSelect = () => {
  const { data: userSkills } = useUserSkills();
  const { data: allSkills } = useAllSkills();
  const { register } = useFormContext();

  const skillsList =
    userSkills && userSkills.length > 0
      ? userSkills.map((item) => ({ id: item.skill.id, name: item.skill.name }))
      : (allSkills || []).map((skill) => ({ id: skill.id, name: skill.name }));

  if (!skillsList || skillsList.length === 0) {
    return (
      <div className="p-4 border border-yellow-500/30 bg-yellow-500/10 rounded-xl text-yellow-600 dark:text-yellow-400 text-sm">
        Loading technologies...
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {skillsList.map((skill) => {
          return (
            <label
              key={skill.id}
              className="group relative flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border bg-card/60 hover:bg-muted/50 transition-all duration-200 cursor-pointer select-none shadow-sm hover:shadow-md active:scale-[0.98] has-[:checked]:border-primary has-[:checked]:bg-primary/10 dark:has-[:checked]:bg-primary/15"
            >
              <input
                type="checkbox"
                value={skill.id}
                {...register(`skillsIds`)}
                className="h-4 w-4 rounded border-border text-primary accent-primary focus:ring-primary/30 cursor-pointer transition-all"
              />
              <span className="text-sm font-medium text-foreground group-has-[:checked]:text-primary group-has-[:checked]:font-semibold truncate transition-colors">
                {skill.name}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default TecnologiesSelect;