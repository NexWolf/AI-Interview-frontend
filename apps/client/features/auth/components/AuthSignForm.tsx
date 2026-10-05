"use client";

import { useState } from "react";
import AuthSwitch from "@/components/ui/auth-switch";
import Signup from "./Signup";
import Signin from "./Signin";

export default function AuthSignForm() {
  const [isSigninActive, setIsSigninActive] = useState(false);

  return (
    <AuthSwitch
      isSigninActive={isSigninActive}
      onSwitch={setIsSigninActive}
      signUpSlot={<Signup />}
      signInSlot={<Signin />}
      handshakeImage="/login.jpg"
      
    />
  );
}