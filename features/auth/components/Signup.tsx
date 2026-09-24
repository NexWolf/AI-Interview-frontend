"use client";

import { ChangeEvent, FormEvent, ReactNode, useState } from "react";
import { User, Mail, Lock, ShieldCheck, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import ConfirmEmailPop from "@/features/auth/components/ConfirmEmailPop";

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
      className="group relative flex h-11 min-w-0 items-center rounded-2xl border-0 px-3.5 transition-all focus-within:ring-2 focus-within:ring-[#7C3AED]/40"
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
        className="ml-2.5 min-w-0 w-full bg-transparent text-sm leading-none text-black placeholder:text-gray-500 outline-none"
      />
    </div>
  );
}

export default function Signup() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showConfirmPop, setShowConfirmPop] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const passwordsMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordsMismatch) {
      toast.error("Passwords do not match");
      return;
    }

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (!/[A-Z]/.test(form.password)) {
      toast.error("Password must contain at least one uppercase letter");
      return;
    }
    if (!/[a-z]/.test(form.password)) {
      toast.error("Password must contain at least one lowercase letter");
      return;
    }
    if (!/[0-9]/.test(form.password)) {
      toast.error("Password must contain at least one number");
      return;
    }

    const baseUsername = `${form.firstName}_${form.lastName}`
      .replace(/[^a-zA-Z0-9_]/g, "")
      .toLowerCase();
    const finalUsername = (
      baseUsername.length >= 3
        ? baseUsername
        : `user_${baseUsername}_${Math.floor(100 + Math.random() * 900)}`
    ).slice(0, 20);

    const formData = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      userName: finalUsername,
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
    };

    setLoading(true);
    try {
      const response = await AxiosAPI.post(`/api/v1/auth/register`, formData);
      if (response.data.success) {
        const { message, data: resData } = response.data;
        toast.success(message || "Welcome! Account created successfully");
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        if (!resData?.user?.isVerified) {
          setUserEmail(resData?.user?.email || form.email);
          setShowConfirmPop(true);
        }
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(
          err?.response?.data?.message || "Failed signup, please try again later!",
        );
      } else {
        toast.error("Failed signup, please try again later!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-center">
      {showConfirmPop && (
        <ConfirmEmailPop
          email={userEmail}
          closePopup={() => setShowConfirmPop(false)}
        />
      )}

      <h1 className="mb-1 font-display text-3xl font-bold text-black">Sign up</h1>
      <p className="mb-5 text-xs text-black font-medium">
        Create your account and start practicing.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-2.5 min-w-0">
          <AuthField
            icon={<User className="h-4 w-4" />}
            type="text"
            placeholder="First name"
            value={form.firstName}
            onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
          />
          <AuthField
            icon={<User className="h-4 w-4" />}
            type="text"
            placeholder="Last name"
            value={form.lastName}
            onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
          />
        </div>
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
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        />
        <AuthField
          icon={<ShieldCheck className="h-4 w-4" />}
          type="password"
          placeholder="Confirm password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
        />
        {passwordsMismatch && (
          <p className="text-xs text-red-500 font-medium">Passwords do not match.</p>
        )}
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
              <span>Signing Up...</span>
            </>
          ) : (
            <span>Sign Up</span>
          )}
        </button>
      </form>
    </div>
  );
}