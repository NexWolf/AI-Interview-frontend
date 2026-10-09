"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { clearCachedAccessToken } from "@/shared/lib/AxiosAPI";

export function useLogout(onSuccess?: () => void) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      clearCachedAccessToken();
      onSuccess?.();
      router.push("/auth");
      router.refresh();
    } catch {
      toast.error("Failed to log out");
    } finally {
      setLoggingOut(false);
    }
  };

  return { handleLogout, loggingOut };
}
