"use client";
import { AxiosAPI } from "@/app/api/AxiosAPI";
import InputError from "@/component/shared/InputError";
import LoadingIcon from "@/component/shared/LoadingIcon";
import { Input } from "@/component/ui/Input";
import { API_URL } from "@/constants/routes";
import {
  ConfirmPasswordInput,
  confirmPasswordSchema,
} from "@/lib/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowRight, KeyRound, ShieldCheck, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default function ResetPassword({ searchParams }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(searchParams);
  const token = resolvedParams?.token;

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmPasswordInput>({
    resolver: zodResolver(confirmPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ConfirmPasswordInput) => {
    let isSuccess: boolean = false;

    if (!token) return;
    console.log(token)

    try {
      const response = await AxiosAPI.post(
        `${API_URL}/api/v1/auth/reset-password`,
        {
          token,
          password : data.password,
          confirmPassword : data.confirmPassword
        }
      );

      toast.success(
        response?.data?.message || "Password updated successfully!",
      );
      reset();
      isSuccess = true;
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        toast.error(e?.response?.data?.message || "Something went wrong!");
      }
    }
    if (isSuccess) {
      router.push(`/auth`);
    }
  };

  if (!token) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center bg-zinc-950 text-zinc-100 overflow-hidden px-4">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative w-full max-w-md p-8 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl shadow-2xl text-center space-y-4">
          <h2 className="text-xl font-bold text-red-400">
            Invalid or Missing Link
          </h2>
          <p className="text-sm text-zinc-400">
            The password reset link is invalid or has expired. Please request a
            new link.
          </p>
          <button
            onClick={() => router.push("/forgot-password")}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-all"
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-zinc-950 text-zinc-100 overflow-hidden px-4">
      {/* Background AI Glow Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container with Glassmorphism */}
      <div className="relative w-full max-w-md p-8 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl shadow-2xl space-y-6">
        <div>
          {/* Header Section */}
          <div className="space-y-3 text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 bg-zinc-800/80 border border-zinc-700/50 rounded-xl mb-2 text-indigo-400">
              <KeyRound className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Set New Password
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Your new password must be different from previously used
              passwords.
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <Input
                  leading={<Lock className="w-4 h-4 text-zinc-400" />}
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-zinc-950/60 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all rounded-lg"
                />
              </div>
              {errors.password?.message && (
                <InputError message={errors.password.message} />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  leading={<ShieldCheck className="w-4 h-4 text-zinc-400" />}
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-zinc-950/60 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all rounded-lg"
                />
              </div>
              {errors.confirmPassword?.message && (
                <InputError message={errors.confirmPassword.message} />
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <LoadingIcon />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Footer Accent */}
          <div className="pt-6 mt-6 text-center border-t border-zinc-800/50">
            <p className="text-xs text-zinc-500">
              AI-Powered Interview Platform &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
