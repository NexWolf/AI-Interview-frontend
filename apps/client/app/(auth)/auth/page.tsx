import { Suspense } from "react";
import AuthSignForm from "@/features/auth/components/AuthSignForm";

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center bg-[#E2D7FC]" />}>
      <AuthSignForm />
    </Suspense>
  );
}