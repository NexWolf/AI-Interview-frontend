"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AuthSwitch from "@/components/ui/auth-switch";
import Signup from "./Signup";
import Signin from "./Signin";

export default function AuthSignForm() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || searchParams.get("tab");
  const [isSigninActive, setIsSigninActive] = useState(
    mode === "signin" || mode === "login"
  );

  useEffect(() => {
    if (mode === "signin" || mode === "login") {
      setIsSigninActive(true);
    } else if (mode === "signup" || mode === "register") {
      setIsSigninActive(false);
    }
  }, [mode]);

  return (
    <AuthSwitch
      isSigninActive={isSigninActive}
      onSwitch={setIsSigninActive}
      signUpSlot={<Signup onSwitchToSignin={() => setIsSigninActive(true)} />}
      signInSlot={<Signin onSwitchToSignup={() => setIsSigninActive(false)} />}
      handshakeImage="/login.jpg"
    />
  );
}