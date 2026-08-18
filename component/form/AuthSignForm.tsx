import React from "react";
import { FaGoogle } from "react-icons/fa";
import { FiGithub } from "react-icons/fi";

type AuthFormProps = {
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  onConfirm: () => void;
  haveAccountTitle: string;
};

export const AuthSignForm = ({
  title,
  children,
  onSubmit,
  onConfirm,
  haveAccountTitle,
}: AuthFormProps) => {
  return (
    <>
      <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
        <div className="text-center space-y-1.5">
          <h2 className="font-bold text-xl sm:text-2xl text-white tracking-tight">
            {title}
          </h2>

          <p className="text-center text-xs sm:text-sm text-[#9DA5B4]">
            Enter your details below to continue
          </p>
        </div>

        <div className="w-full flex justify-between gap-3 pt-2">
          <button
            type="button"
            className="w-1/2 bg-[#161C22] border border-[#232B34] hover:bg-[#232B34] py-2.5 rounded-lg text-xs sm:text-sm text-[#9DA5B4] hover:text-white transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <FaGoogle className="text-base" />
            <span>Google</span>
          </button>

          <button
            type="button"
            className="w-1/2 bg-[#161C22] border border-[#232B34] hover:bg-[#232B34] py-2.5 rounded-lg text-xs sm:text-sm text-[#9DA5B4] hover:text-white transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <FiGithub className="text-base" />
            <span>Github</span>
          </button>
        </div>

        <div className="relative w-full flex items-center justify-center my-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#232B34]"></div>
          </div>
          <span className="relative bg-[#11161B] px-3 text-xs text-[#9DA5B4] uppercase tracking-wider">
            Or continue with
          </span>
        </div>

        <form onSubmit={onSubmit} className="w-full">
          {children}
        </form>

        <button
          type="button"
          onClick={onConfirm}
          className="text-xs text-[#9DA5B4] hover:text-[#CBA07B] transition-colors cursor-pointer mt-2"
        >
          {haveAccountTitle}
        </button>
      </div>
    </>
  );
};

export default AuthSignForm;