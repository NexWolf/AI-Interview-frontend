"use client";
import AuthSignForm from "@/component/form/AuthSignForm";
import { signinInput, SigninSchema } from "@/validations/authSchema";
import { forwardRef } from "react";
import { useForm } from "react-hook-form";
import { SigninType } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@/component/ui/Input";
import { FiAlertCircle } from "react-icons/fi";

type props = {
  show?: boolean;
  onConfirm: () => void;
};

export const Signin = forwardRef<HTMLDivElement, props>(
  ({ show, onConfirm }, ref) => {
    const router = useRouter();

    /* form hook options */
    const {
      register: registerData,
      handleSubmit: handleSubmitData,
      formState: { errors },
      reset: resetForm,
    } = useForm<signinInput>({
      resolver: zodResolver(SigninSchema),
    });

    const onRegister = async (data: SigninType) => {
      console.log(data)
    };

    return (
      <div
        className={`absolute h-full inset-0 transition-all duration-500  ${show ? "translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100"}`}
      >
        <div ref={ref} className="h-full">
          <AuthSignForm
            title="Sign In Account"
            onSubmit={handleSubmitData(onRegister)}
            onConfirm={onConfirm}
            haveAccountTitle="Already have an account?sgin up"
          >
            <label>
              <h3 className="text-white/70 text-sm">Email</h3>
              <Input
                {...registerData("email")}
                placeholder="eg. Ahmed@gmail.com"
                className="bg-zinc-800 w-full px-3 py-2 border border-zinc-700 rounded-sm outline-none text-sm"
              />
              {errors.email && (
                <p className="text-xs text-red-400/90 font-medium mt-1 flex items-center gap-1 transition-all">
                  <FiAlertCircle className="text-sm shrink-0" />{" "}
                  <span>{errors.email.message}</span>
                </p>
              )}
            </label>

            <label>
              <h3 className="text-white/70 text-sm">Password</h3>
              <Input
                type="password"
                {...registerData("password")}
                placeholder="Enter your password"
                className="bg-zinc-800 w-full px-3 py-2 border border-zinc-700 rounded-sm outline-none text-sm"
              />
              {errors.password && (
                <p className="text-xs text-red-400/90 font-medium mt-1 flex items-center gap-1 transition-all">
                  <FiAlertCircle className="text-sm shrink-0" />{" "}
                  <span>{errors.password?.message}</span>
                </p>
              )}
            </label>

            <div className="w-full space-y-1 mt-5">
              <button className="w-full bg-zinc-950 border border-gray-800 py-2 rounded-md text-white/70 hover:text-white hover:scale-105 cursor-pointer flex items-center justify-center gap-1">
                Sign In
              </button>
            </div>
          </AuthSignForm>
        </div>
      </div>
    );
  },
);

Signin.displayName = "Signin";
