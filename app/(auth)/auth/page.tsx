"use client";
import { Signin } from "@/component/auth/Signin/Signin";
import { Signup } from "@/component/auth/Signup/Signup";
import {  useState } from "react";
import Image from "next/image";

export default function Sign() {
  const [showForm, setShowForm] = useState<boolean>(true);


  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#0B0E11] text-[#E5E7EB]">
      
      {/* القسم الأيسر: الصورة والشعار والعبارة الترحيبية */}
      <div className="relative hidden lg:flex w-[80%] h-full flex-col justify-between  p-12 overflow-hidden">
        
        {/* خلفية الصورة مع Overlay داكن */}
        <Image
          alt="NEXWOLF_IMAGE"
          src="/signBG.jpeg"
          fill
          priority
          className="object-cover object-center z-0 opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11] via-transparent to-black/40 z-10"/>

        {/* الشعار Top Left */}
        <div className="relative z-20">
          <Image
            alt="logo"
            src="/logo.png"
            width={160}
            height={48}
            className="object-contain"
          />
        </div>

        {/* العناوين والوصف */}
        <div className="relative z-20 max-w-md space-y-3">
          <h2 className="text-4xl font-bold tracking-tight text-white">
            {showForm ? "Build the future." : "Welcome"}{" "}
            <span className="text-[#B38861] ">
              {showForm ? "Create impact." : "back!"}
            </span>
          </h2>
          <p className="text-base text-[#9DA5B4] leading-relaxed">
            {showForm
              ? "Join Nexwolf and start your journey towards growth and excellence."
              : "Sign in to continue your journey and achieve more with Nexwolf."}
          </p>
        </div>

        <div className="relative z-20 grid grid-cols-4 gap-4 pt-6 border-t border-[#232B34]/60 text-xs text-[#9DA5B4]">
          <div>Innovative Solutions</div>
          <div>Quality Focused</div>
          <div>Scalable Products</div>
          <div>Impact Driven</div>
        </div>
      </div>

      {/* القسم الأيمن: نموذج التسجيل / الدخول */}
      <div className="relative flex w-full lg:w-1/2 h-screen items-center justify-center p-4 sm:p-8 z-20 bg-[#0B0E11] overflow-y-auto lg:overflow-hidden">
        <div
          className="w-full h-full max-w-md rounded-2xl bg-[#11161B] border border-[#232B34] p-6 sm:p-8 shadow-2xl transition-[height] duration-300 overflow-hidden"
        >
          <div className="relative h-full">
            <Signup
              onConfirm={() => setShowForm(false)}
              show={showForm}
            />
            <Signin
              onConfirm={() => setShowForm(true)}
              show={showForm}
            />
          </div>
        </div>
      </div>

    </div>
  );
}