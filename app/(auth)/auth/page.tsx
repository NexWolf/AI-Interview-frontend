"use client";
import { Signin } from "@/features/auth/components/Signin";
import { Signup } from "@/features/auth/components/Signup";
import { useState } from "react";
import Image from "next/image";
import { ThemeToggle } from "@/shared/components/ui/ThemeToggle";

export default function Sign() {
  const [showForm, setShowForm] = useState<boolean>(true);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-card-gradient text-[#E5E7EB]">
      {/* الصورة كخلفية كاملة للصفحة */}

      <div className="absolute left-5 right-5 z-50">
        <ThemeToggle />
      </div>

      {/* العنوان فوق الصورة - absolute مش flex item */}
      <div className="relative w-full inset-0 z-10 hidden md:flex items-center justify-center px-8 lg:right-1/2">
        <Image
          src="/login.jpg"
          alt="login"
          fill
          className="object-cover"
          priority
        />

        <div className="bg-black/10 backdrop-blur-md rounded-2xl px-10 py-8 text-center max-w-md border border-white/10">
          <div className="text-center mb-6">
            <h2 className="text-heading text-2xl font-bold">
              {showForm ? "Create a new account" : "Sign in to your account"}
            </h2>
            <p className="mt-2 text-subheading text-sm">
              {showForm
                ? "Fill in your details below to get started for free."
                : "Welcome back! Please enter your details to continue."}
            </p>
          </div>
        </div>
      </div>

      {/* القسم الأيمن: نموذج التسجيل / الدخول */}
      <div className="relative flex w-full lg:w-1/2 h-screen items-center justify-center p-4 sm:p-8 z-20 bg-background overflow-y-auto lg:overflow-hidden ms-auto">
        <div className="w-full h-full max-w-md rounded-2xl bg-card border border-card-border p-6 sm:p-8 shadow-2xl transition-[height] duration-300 overflow-hidden">
          <div className="relative h-full">
            <Signup onConfirm={() => setShowForm(false)} show={showForm} />
            <Signin onConfirm={() => setShowForm(true)} show={showForm} />
          </div>
        </div>
      </div>
    </div>
  );
}
