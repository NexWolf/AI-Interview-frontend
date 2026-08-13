import { setupInterview } from "@/types/interview/setup";
import { Globe } from "lucide-react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";

type PropsLanguage = {
  register: UseFormRegister<setupInterview>;
  watch: UseFormWatch<setupInterview>;
};

const language_ui_data = [
  {
    id: 1,
    value: "ar",
    mainTitle: "العربية",
    subTitle: "Arabic",
  },
  {
    id: 2,
    value: "en",
    mainTitle: "English",
    subTitle: "English",
  },
] as const;

export const LanguageSelect = ({ register, watch }: PropsLanguage) => {
  const selectedLanguage = watch("language");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      {language_ui_data.map((lan) => {
        const isSelected = selectedLanguage === lan.value;

        return (
          <label
            key={lan.id}
            className={`relative flex items-center justify-between p-4 rounded-md border transition-all duration-200 cursor-pointer select-none ${
              isSelected
                ? "border-[#4F46E5] bg-[#0B0F19] ring-1 ring-[#4F46E5]"
                : "border-[#1F2937] bg-[#0D121F] hover:border-gray-700"
            }`}
          >
            <div className="flex items-center gap-3.5">
              {/* Radio Circle Container */}
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  value={lan.value}
                  {...register("language")}
                  className="peer sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-[#6366F1] bg-[#6366F1]"
                      : "border-gray-600 bg-transparent"
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>

              {/* Labels */}
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">
                  {lan.mainTitle}
                </span>
                <span className="text-xs text-gray-400">
                  {lan.subTitle}
                </span>
              </div>
            </div>

            {/* Icon */}
            <Globe
              className={`w-5 h-5 transition-colors ${
                isSelected ? "text-[#6366F1]" : "text-gray-500"
              }`}
            />
          </label>
        );
      })}
    </div>
  );
};

export default LanguageSelect;