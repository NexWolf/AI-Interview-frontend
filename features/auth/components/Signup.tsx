"use client";

import { ChangeEvent, FormEvent, ReactNode, useState } from "react";
import { User, Mail, Lock, ShieldCheck } from "lucide-react";

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
    <div className="group relative flex items-center rounded-full border-0 bg-muted px-4 py-3 transition focus-within:ring-2 focus-within:ring-[var(--primary)]">
      <style>{`.auth-gray-input::placeholder { color: rgb(118, 118, 118); opacity: 1; }`}</style>
      <span className="flex shrink-0 items-center text-[rgb(118,118,118)] transition-colors group-hover:text-[var(--primary)]">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="auth-gray-input ml-3 w-full bg-transparent text-sm leading-none outline-none"
        style={{ color: "rgb(118, 118, 118)" }}
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

  const passwordsMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (passwordsMismatch) return;
    console.log("signup", form);
  };

  return (
    <div className="w-full text-center">
      <h1 className="mb-1 font-display text-3xl font-bold text-foreground">Sign up</h1>
      <p className="mb-5 text-sm" style={{ color: "rgb(118, 118, 118)" }}>
        Create your account and start practicing.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
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
          <p className="text-xs text-destructive">Passwords do not match.</p>
        )}
        <button
          type="submit"
          className="w-full rounded-full py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          style={{
            background:
              "linear-gradient(135deg, oklch(58% 0.19 290) 0%, oklch(46% 0.22 298) 100%)",
          }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}