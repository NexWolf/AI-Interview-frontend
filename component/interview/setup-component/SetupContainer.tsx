"use client";
import CameraPreview from "@/component/interview/setup-component/CameraPreview";
import MicorphoneTest from "@/component/interview/setup-component/MicorphoneTest";
import { useForm } from "react-hook-form";
import { setupInterview } from "@/types/interview/setup";
import LanguageSelect from "./LanguageSelect";
import TecnologiesSelect from "./TechnologiesSelect";
import InterviewLevelSelect from "./InterviewLevelSelect";
import { ThemeToggle } from "@/component/shared/ThemeToggle";
import { useRouter } from "next/navigation";
import { Input } from "@/component/ui/Input";

const setupDefultData: setupInterview = {
  language: "ar",
  technologies: ["React", "Next", "TypeScript", "javaScript"],
  interview_level: "junior",
};


export const SetupContainer = () => {
  const router = useRouter();


  const methods = useForm<setupInterview>({
    defaultValues: setupDefultData,
  });


  const { register, handleSubmit , watch} = methods;

  const OnSubmit = async (data: setupInterview) => {
    console.log(data);
  };

  const handleOpenInterview = () => {
    router.push("/interview/session")
  }  

  return (
  <div className="w-full min-h-screen bg-[#11161B] p-4 sm:p-8 flex justify-center items-center">

    
      <div className="flex justify-end mb-4  bg-white z-50 cursor-pointer">
        <ThemeToggle />
      </div>
  <form
    className="w-full max-w-4xl rounded-2xl border border-[#1F2937] bg-[#0B0F19] p-6 sm:p-10 flex flex-col gap-8"
    onSubmit={handleSubmit(OnSubmit)}
  >
    {/* Header */}
    <div className="border-b border-[#1F2937] pb-6">
      <h1 className="text-2xl font-bold text-white tracking-tight">
        Interview Setup
      </h1>
      <p className="text-sm text-gray-400 mt-1">
        Let{"'"}s make sure everything is working before your interview begins.
      </p>
    </div>

    {/* Section 1 */}
    <div className="flex flex-col gap-3">
      <div>

        <Input  label="input your email"/>

        

        <h3 className="text-base font-semibold text-white">
          1. Choose Language
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Select the language for the interview:
        </p>
      </div>
      <LanguageSelect register={register} watch={watch} />
    </div>

    {/* Section 2 */}
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-base font-semibold text-white">
          2. Select Technologies
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Choose the technologies you want to include in the interview:
        </p>
      </div>
      <TecnologiesSelect register={register} />
    </div>

    {/* Section 3 */}
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-base font-semibold text-white">
          3. Interview Level
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Select the experience level for the interview:
        </p>
      </div>
      <InterviewLevelSelect register={register} />
    </div>

    {/* Section 4 */}
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-base font-semibold text-white">
          4. Hardware Check
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Ensure your camera and microphone are properly functioning:
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-stretch gap-6 w-full mt-1">
        <CameraPreview />
        <MicorphoneTest language={watch("language")} />
      </div>
    </div>

    {/* Submit */}
    <div className="pt-4 border-t border-[#1F2937]">
      <button
        type="button"
        onClick={handleOpenInterview}
        className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-[#6366F1] hover:bg-[#4F46E5] active:scale-[0.99] transition-all duration-200 cursor-pointer text-base shadow-lg shadow-[#6366F1]/20"
      >
        Start Interview
      </button>
    </div>
  </form>
</div>
  );
};

export default SetupContainer;
