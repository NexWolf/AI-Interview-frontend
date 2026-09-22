"use client";

import { ChangeEvent, FormEvent, ReactNode, useState } from "react";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";

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

function SocialIcon({ children, label }: { children: ReactNode; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-[rgb(118,118,118)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
    >
      {children}
    </button>
  );
}

export default function Signin() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("signin", form);
  };

  return (
    <div className="w-full text-center">
      <h1 className="mb-1 font-display text-3xl font-bold text-foreground">Sign in</h1>
      <p className="mb-7 text-sm" style={{ color: "rgb(118, 118, 118)" }}>Continue your AI interview journey.</p>

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
          className="w-full rounded-full py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          style={{
            background:
              "linear-gradient(135deg, oklch(58% 0.19 290) 0%, oklch(46% 0.22 298) 100%)",
          }}
        >
          Sign In
        </button>
      </form>
      <div className="mt-6 flex items-center justify-center gap-1 text-xs">
        <span style={{ color: "rgb(118, 118, 118)" }}>Or sign in with</span>
        <span style={{ color: "rgb(118, 118, 118)" }}>·</span>
        <Link
          href="/reset-password"
          className="font-medium text-black transition-colors hover:text-[var(--primary)] hover:underline"
          style={{ color: "rgb(118, 118, 118)" }}
        >
          reset password
        </Link>
      </div>
      <div className="mt-4 flex justify-center gap-3">
        <SocialIcon label="Google">
          <span className="text-sm font-bold">G</span>
        </SocialIcon>
        <SocialIcon label="Facebook">
          <span className="text-sm font-bold">f</span>
        </SocialIcon>
        <SocialIcon label="Twitter">
          <span className="text-sm font-bold">t</span>
        </SocialIcon>
        <SocialIcon label="LinkedIn">
          <span className="text-sm font-bold">in</span>
        </SocialIcon>
      </div>
    </div>
  );
}