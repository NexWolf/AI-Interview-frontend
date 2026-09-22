"use client";
import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import InputError from "@/shared/components/ui/InputError";
import LoadingIcon from "@/shared/components/ui/LoadingIcon";
import { Input } from "@/shared/components/ui/Input";
import { API_URL } from "@/constants/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowRight, Mail, MailCheck, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  forgetPasswordSchema,
  ForgotPasswordInput,
} from "@/features/auth/schema/forgotPassword.schema";
import AuthFullCurveCard from "@/features/auth/components/AuthFullCurveCard";

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
    try {
      const response = await AxiosAPI.post(
        `${API_URL}/api/v1/auth/forgot-password`,
        { email: email },
      );
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
      }
    }
  };

  return (
    /* نفس الصورة/العلامة يلي مستخدمة بصفحة Sign in / Sign up — بس هون المنحنى بيعبّي الكارد كامل */
    <AuthFullCurveCard handshakeImage="/login.jpg" brandLabel="AI INTERVIEW">
      {isSent ? (
        <div className="space-y-4 text-center">
          <MailCheck className="mx-auto h-12 w-12" style={{ color: "var(--primary)" }} />
          <h2 className="font-display text-xl font-bold text-white">Check your inbox</h2>
          <p className="text-sm text-white/80">
            We sent a password reset link to{" "}
            <span className="font-medium text-white">{email}</span>.
          </p>
          <Link
            href="/auth"
            className="mx-auto flex w-fit items-center gap-1.5 text-xs font-medium text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </div>
      ) : (
        <div>
          {/* Header Section */}
          <div className="space-y-3 text-center">
            {/* <div className="mb-2 inline-flex items-center justify-center rounded-xl border border-white/30 p-3 text-white">
              <Sparkles className="h-6 w-6" />
            </div> */}
            <h1 className="font-display text-3xl font-bold text-white">Forgot Password?</h1>
            <p className="text-sm leading-relaxed text-white/80">
              Enter your email below to receive an AI-generated magic reset link.
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-white/80">
                Email Address
              </label>
              <div className="relative">
                <Input
                  leading={<Mail className="h-4 w-4" style={{ color: "rgb(118,118,118)" }} />}
                  {...register("email")}
                  placeholder="name@company.com"
                  className="w-full rounded-full border-0 bg-muted text-sm text-foreground outline-none transition placeholder:[color:rgb(118,118,118)] focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              {errors.email?.message && <InputError message={errors.email.message} />}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background:
                  "linear-gradient(135deg, oklch(58% 0.19 290) 0%, oklch(46% 0.22 298) 100%)",
              }}
            >
              {isSubmitting ? (
                <>
                  <LoadingIcon />
                  <span>Sending Instructions...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <Link
            href="/auth"
            className="mx-auto mt-5 flex w-fit items-center gap-1.5 text-xs font-medium text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>

          {/* Footer Accent */}
          <div className="mt-6 border-t border-white/20 pt-4 text-center">
            <p className="text-xs text-white/60">
              AI-Powered Interview Platform &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      )}
    </AuthFullCurveCard>
  );
}