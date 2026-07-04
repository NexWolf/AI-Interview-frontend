import React from "react";
import { FaGoogle } from "react-icons/fa";
import { FiGithub } from "react-icons/fi";

type AuthFormProps = {
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  onConfirm : () => void;
  haveAccountTitle : string
};

export const AuthSignForm = ({ title, children, onSubmit , onConfirm , haveAccountTitle }: AuthFormProps) => {
  return (
    <>
      <div className="flex flex-col gap-5 items-center justify-center ">
        <div className="text-center space-y-3">
          <h2 className="font-semibold text-2xl ">{title}</h2>

          <p className="text-center px-3 text-sm text-white/70 ">
            Enter your personal email and password
          </p>
        </div>
        <div className="w-full flex justify-around gap-5 ">
          <button className="w-1/2 bg-zinc-950 border border-gray-800 py-2 rounded-md text-white/70 hover:text-white hover:scale-105 cursor-pointer flex items-center justify-center gap-1">
            <span>
              <FaGoogle />
            </span>
            <span>Google</span>
          </button>

          <button className="w-1/2 bg-zinc-950 border border-gray-800 py-2 rounded-md text-white/70 hover:text-white hover:scale-105 cursor-pointer flex items-center justify-center gap-1">
            <span>
              <FiGithub />
            </span>
            <span>Github</span>
          </button>
        </div>

        <p className="py-3">Or</p>

        <form
            onSubmit={onSubmit}
            className="w-full"
            >{children}</form>

        <button
          type="button"
          onClick={onConfirm}
          className="text-xs flex text-white/70 ml-4 underline cursor-pointer "
        >
          {haveAccountTitle}
        </button>
      </div>
    </>
  );
};

export default AuthSignForm;
