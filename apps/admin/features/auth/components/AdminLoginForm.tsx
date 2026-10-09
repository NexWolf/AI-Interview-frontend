"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Lock, Shield, Eye, EyeOff, Sparkles } from "lucide-react";
import { FormTag, Input, InputError } from "@repo/shared";
import { loginSchema, LoginFormData } from "../schema/loginSchema";

export function AdminLoginForm() {
  const router = useRouter();
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
        toast.error(result.message || "Failed to sign in. Please verify your credentials.");
        return;
      }

      toast.success("Welcome back, Administrator!");
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
      <div className="rounded-3xl border border-border/80 bg-card/80 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl shadow-primary/5">
        {/* Brand & Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
            <Shield className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Admin Portal
          </h1>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-xs mx-auto">
            Sign in with your administrator email and password to access the command center.
          </p>
        </div>

        {/* Generic FormTag from @repo/shared */}
        <FormTag<LoginFormData>
          methods={methods}
          onSubmit={onSubmit}
          loading={loading}
          button_title="Sign In to Admin Console"
          loading_title="Verifying credentials..."
        >
          {/* Email Field from @repo/shared */}
          <div className="space-y-1">
            <Input
              label="Administrator Email"
              id="email"
              type="email"
              placeholder="admin@nexwolf.ai"
              autoComplete="email"
              leading={<Mail className="w-4 h-4 text-muted-foreground" />}
              {...register("email")}
            />
            <InputError message={errors.email?.message} />
          </div>

          {/* Password Field from @repo/shared */}
          <div className="space-y-1">
            <div className="relative">
              <Input
                label="Password"
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
            <span>Protected by NexWolf Enterprise Security</span>
          </p>
        </div>
      </div>
    </div>
  );
}
