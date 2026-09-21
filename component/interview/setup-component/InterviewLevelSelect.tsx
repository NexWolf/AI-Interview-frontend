import { setupInterview } from "@/types/interview/setup";
import { UseFormRegister } from "react-hook-form";

type PropsLevel = {
  register: UseFormRegister<setupInterview>;
};

const interviewLevel = [
  { id: 1, title: "Junior", subTitle: "0 - 2 years", value: "junior" },
  { id: 2, title: "Mid-level", subTitle: "2 - 5 years", value: "mid-level" },
  { id: 3, title: "Senior", subTitle: "5+ years", value: "senior" },
];

const InterviewLevelSelect = ({ register }: PropsLevel) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      {interviewLevel.map((level) => {
        return (
          <label
            key={level.id}
            className="flex items-center gap-3.5 p-4 rounded-xl border border-[#1F2937] bg-[#0D121F] cursor-pointer select-none transition-all duration-200 hover:border-gray-700"
          >
            <input
              type="radio"
              value={level.value}
              {...register("interview_level")}
              className="w-4 h-4 border-gray-600 bg-transparent accent-[#6366F1] cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">
                {level.title}
              </span>
              <span className="text-xs text-gray-400">
                {level.subTitle}
              </span>
            </div>
          </label>
        );
      })}
    </div>
  );
};

export default InterviewLevelSelect;