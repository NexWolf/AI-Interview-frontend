"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Lock, Building2, Eye, EyeOff, Sparkles } from "lucide-react";
import { FormTag, Input, InputError } from "@repo/shared";
import { loginSchema, LoginFormData } from "../schema/loginSchema";
import { useLanguage } from "../../../shared/context/LanguageContext";

export function CompanyLoginForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    register,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(result.message || "Failed to sign in. Please check your credentials.");
        return;
      }

      const companyName = result?.data?.user?.company?.name || "Company Workspace";
      toast.success(`${t("login.welcomeBack")} ${companyName}...`);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative z-10">
      <div className="rounded-3xl border border-border/80 bg-card/85 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl shadow-primary/5 transition-colors duration-200">
        {/* Brand & Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
            <Building2 className="w-7 h-7 text-primary-foreground" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-medium text-primary mb-3">
            <Sparkles className="w-3 h-3" />
            <span>{t("login.badge")}</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t("login.title")}
          </h1>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-xs mx-auto leading-relaxed">
            {t("login.subtitle")}
          </p>
        </div>

        {/* Shared FormTag from @repo/shared */}
        <FormTag<LoginFormData>
          methods={methods}
          onSubmit={onSubmit}
          loading={loading}
          button_title={t("login.submit")}
          loading_title={t("login.loading")}
        >
          {/* Email Field from @repo/shared */}
          <div className="space-y-1">
            <Input
              label={t("login.emailLabel")}
              id="email"
              type="email"
              placeholder="company@gmail.com"
              autoComplete="email"
              leading={<Mail className="w-4 h-4 text-muted-foreground" />}
              {...register("email")}
            />
            <InputError message={errors.email?.message} />
          </div>

          {/* Password Field from @repo/shared with eye toggle */}
          <div className="space-y-1">
            <div className="relative">
              <Input
                label={t("login.passwordLabel")}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                autoComplete="current-password"
                leading={<Lock className="w-4 h-4 text-muted-foreground" />}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                {...register("password")}
              />
            </div>
            <InputError message={errors.password?.message} />
          </div>
        </FormTag>

        {/* Security Notice */}
        <div className="mt-8 pt-6 border-t border-border/50 text-center">
          <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>{t("login.securityNote")}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
