import { setupInterview } from "@/types/interview/setup";
import {  UseFormRegister } from "react-hook-form"

type PropsTechnologies = {
    register  : UseFormRegister<setupInterview>;
}

export const TecnologiesSelect = ({register} : PropsTechnologies) => {

    const technologies : string[] = ["React" , "TailwindCss" , "Css 5" , "Html" , "Node.js" , "JavaScript" , "Doker" , "AWS"]

    return (
        <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {technologies.map((tec, index) => {
          return (
            <label
              key={index}
              className="flex items-center gap-3 p-4 rounded-md border border-[#1F2937] bg-[#0D121F] cursor-pointer select-none transition-all duration-200 hover:border-gray-700"
            >
              <input
                type="checkbox"
                value={tec}
                {...register("technologies")}
                // تلوين مربع الاختيار الافتراضي باللون البنفسجي عند التحديد
                className="w-4 h-4 rounded border-gray-600 bg-transparent accent-[#6366F1] cursor-pointer"
              />
              <span className="text-sm font-medium text-white truncate">
                {tec}
              </span>
            </label>
          );
        })}
      </div>
    </div>
    )
}

export default TecnologiesSelect