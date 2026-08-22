"use client";
import { AxiosAPI } from "@/app/api/AxiosAPI";
import InputError from "@/component/shared/InputError";
import LoadingIcon from "@/component/shared/LoadingIcon";
import { Input } from "@/component/ui/Input";
import { API_URL } from "@/constants/routes";
import {
  ForgotPasswordInput,
  forgetPasswordSchema,
} from "@/lib/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowRight, Loader2, Mail, MailCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [isSent, setIsSent] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async ({ email }: { email: string }) => {
    const formData = new FormData();
    formData.append("email", email);
    console.log(formData);
    try {
      const response = await AxiosAPI.post(
        `${API_URL}/api/v1/auth/forgot-password`,
        { email: email  ,     withCredentials: true
},
      );
      console.log(response);
      toast.success(response?.data?.message || "Reset link sent successfully!");
      reset();
      setIsSent(true);
      setEmail(email);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        toast.error(
          e?.response?.data?.message ||
            "Somthing went wrong. please try again.",
        );
        console.log("Foorget password Error", e);
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-zinc-950 text-zinc-100 overflow-hidden px-4">
      {/* Background AI Glow Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container with Glassmorphism */}
      <div className="relative w-full max-w-md p-8 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl shadow-2xl space-y-6">
        {isSent ? (
          <div className="text-center space-y-4">
            <MailCheck className="w-12 h-12 text-indigo-400 mx-auto animate-bounce" />
            <h2 className="text-xl font-bold">Check your inbox</h2>
            <p className="text-sm text-zinc-400">
              We sent a password reset link to{" "}
              <span className="text-white font-medium">{email}</span>.
            </p>
          </div>
        ) : (
          <div>
            {/* Header Section */}
            <div className="space-y-3 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-zinc-800/80 border border-zinc-700/50 rounded-xl mb-2 text-indigo-400">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Forgot Password?
              </h1>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Enter your email below to receive an AI-generated magic reset
                link.
              </p>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    leading={<Mail className="w-4 h-4 text-zinc-400" />}
                    {...register("email")}
                    placeholder="name@company.com"
                    className="w-full bg-zinc-950/60 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all rounded-lg"
                  />
                </div>
                {errors.email?.message && (
                  <InputError message={errors.email.message} />
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
                    <span>Sending Instructions...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Accent */}
            <div className="pt-2 text-center border-t border-zinc-800/50">
              <p className="text-xs text-zinc-500">
                AI-Powered Interview Platform &copy; {new Date().getFullYear()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
