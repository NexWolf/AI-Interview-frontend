"use client";

import { ChangeEvent, FormEvent, ReactNode, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "@/constants/routes";

function AuthField({
  icon,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
}: {
  icon: ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
}) {
  return (
    <div
      className="group relative flex h-11 items-center rounded-2xl border-0 px-4 transition-all focus-within:ring-2 focus-within:ring-[#7C3AED]/40"
      style={{ backgroundColor: "#F0F2F5" }}
    >
      <span className="flex shrink-0 items-center text-[#6B7280] transition-colors group-focus-within:text-[#7C3AED]">
        {icon}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="ml-3 w-full bg-transparent text-sm leading-none text-black placeholder:text-gray-500 outline-none"
      />
    </div>
  );
}

function SocialIcon({
  children,
  label,
  onClick,
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{
        color: "#5B21B6",
        borderColor: "#7C3AED",
        borderWidth: "1.5px",
      }}
      className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all hover:bg-purple-100 hover:scale-105 cursor-pointer"
    >
      {children}
    </button>
  );
}

export default function Signin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    let isSuccess = false;
    let isOnboardingDone = false;

    try {
      setLoading(true);
      const response = await axios.post("/api/auth/login", form);
      toast.success(response?.data?.message || "Login successfully");
      isSuccess = true;
      isOnboardingDone = Boolean(response?.data?.data?.user?.onboardingDone);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message || "Login failed!");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }

    if (isSuccess) {
      router.refresh();
      if (isOnboardingDone) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    }
  };

  return (
    <div className="w-full text-center">
      <h1 className="mb-1 font-display text-3xl font-bold text-black">Sign in</h1>
      <p className="mb-7 text-xs text-black font-medium">
        Continue your AI interview journey.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          icon={<Mail className="h-4 w-4" />}
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        <AuthField
          icon={<Lock className="h-4 w-4" />}
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        />
        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-2xl text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          style={{
            background:
              "linear-gradient(135deg, #6366F1 0%, #7C3AED 100%)",
          }}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Signing In...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>
      <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-[#6B7280]">
        <span>Or sign in with</span>
        <span>·</span>
        <Link
          href="/forgot-password"
          className="text-[#6B7280] font-medium hover:text-[#7C3AED] hover:underline transition-colors"
        >
          reset password
        </Link>
      </div>
      <div className="mt-4 flex justify-center gap-3">
        <SocialIcon
          label="Google"
          onClick={() => {
            window.location.href = `${API_URL}/api/v1/auth/google`;
          }}
        >
          <span style={{ color: "#5B21B7", fontWeight: "bold" }}>G</span>
        </SocialIcon>
        <SocialIcon label="Facebook">
          <span style={{ color: "#5B21B6", fontWeight: "bold" }}>f</span>
        </SocialIcon>
        <SocialIcon label="Twitter">
          <span style={{ color: "#5B21B6", fontWeight: "bold" }}>t</span>
        </SocialIcon>
        <SocialIcon label="LinkedIn">
          <span style={{ color: "#5B21B6", fontWeight: "bold" }}>in</span>
        </SocialIcon>
      </div>
    </div>
  );
}