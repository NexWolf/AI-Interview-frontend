"use client";
import AuthSignForm from "@/component/form/AuthSignForm";
import { signinInput, SigninSchema } from "@/validations/authSchema";
import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { SigninType } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@/component/ui/Input";
import { FiAlertCircle } from "react-icons/fi";
import { AxiosAPI } from "@/app/API/AxiosAPI";
import { API_URL } from "@/constants/routes";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createSession } from "@/actions/auth";
import axios from "axios";

type props = {
  show?: boolean;
  onConfirm: () => void;
};

export const Signin = forwardRef<HTMLDivElement, props>(
  ({ show, onConfirm }, ref) => {
    const [loading, setLoading] = useState<boolean>(false);
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
      let isSuccess = false;
      try {
        setLoading(true);
        const response = await axios.post("/api/auth/login", data);
        toast.success(response?.data?.message);
        isSuccess = true;
        resetForm();
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Login failed");
        } else {
          toast.error("Something went wrong");
        }
      } finally {
        setLoading(false);
      }

      if (isSuccess) {
        router.push("/interview/setup");
      }
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
              <button
                disabled={loading}
                className="w-full bg-[#CBA07B] border border-gray-800 py-2 rounded-md text-white/70 hover:text-white hover:scale-105 cursor-pointer flex items-center justify-center gap-1 "
              >
                {loading ? (
                  <div className="flex gap-2">
                    <Loader2 className="animate-spin h-5 w-5 text-gray-800" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </div>
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                className="text-sm text-white/50 hover:text-white transition cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
          </AuthSignForm>
        </div>
      </div>
    );
  },
);

Signin.displayName = "Signin";
