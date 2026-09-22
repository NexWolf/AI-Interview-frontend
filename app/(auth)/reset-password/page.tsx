"use client";
import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import InputError from "@/shared/components/ui/InputError";
import LoadingIcon from "@/shared/components/ui/LoadingIcon";
import { Input } from "@/shared/components/ui/Input";
import { API_URL } from "@/constants/routes";
import {
  ConfirmPasswordInput,
  confirmPasswordSchema,
} from "@/features/auth/schema/confirmPassword.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowRight, ShieldCheck, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import AuthFullCurveCard from "@/features/auth/components/AuthFullCurveCard";

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

    try {
      const response = await AxiosAPI.post(
        `${API_URL}/api/v1/auth/reset-password`,
        {
          token,
          password: data.password,
          confirmPassword: data.confirmPassword,
        },
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

  // حالة: التوكن مفقود أو غير صالح
  if (!token) {
    return (
      <AuthFullCurveCard handshakeImage="/login.jpg" brandLabel="AI INTERVIEW">
        <div className="space-y-4 text-center">
          <h2 className="font-display text-xl font-bold text-white">
            Invalid or Missing Link
          </h2>
          <p className="text-sm text-white/80">
            The password reset link is invalid or has expired. Please request
            a new link.
          </p>
          <button
            onClick={() => router.push("/forgot-password")}
            className="group relative flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            style={{
              background:
                "linear-gradient(135deg, oklch(58% 0.19 290) 0%, oklch(46% 0.22 298) 100%)",
            }}
          >
            <span>Request New Link</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <Link
            href="/auth"
            className="mx-auto flex w-fit items-center gap-1.5 text-xs font-medium text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </div>
      </AuthFullCurveCard>
    );
  }

  return (
    <AuthFullCurveCard handshakeImage="/login.jpg" brandLabel="AI INTERVIEW">
      <div>
        {/* Header Section */}
        <div className="space-y-3 text-center">
          <h1 className="font-display text-3xl font-bold text-white">
            Set New Password
          </h1>
          <p className="text-sm leading-relaxed text-white/80">
            Your new password must be different from previously used
            passwords.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-white/80">
              New Password
            </label>
            <div className="relative">
              <Input
                leading={<Lock className="h-4 w-4" style={{ color: "rgb(118,118,118)" }} />}
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-full border-0 bg-muted text-sm text-foreground outline-none transition placeholder:[color:rgb(118,118,118)] focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
            {errors.password?.message && (
              <InputError message={errors.password.message} />
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-white/80">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                leading={<ShieldCheck className="h-4 w-4" style={{ color: "rgb(118,118,118)" }} />}
                {...register("confirmPassword")}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-full border-0 bg-muted text-sm text-foreground outline-none transition placeholder:[color:rgb(118,118,118)] focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
            {errors.confirmPassword?.message && (
              <InputError message={errors.confirmPassword.message} />
            )}
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
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <span>Reset Password</span>
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
    </AuthFullCurveCard>
  );
}