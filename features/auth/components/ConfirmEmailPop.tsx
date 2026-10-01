"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { MailCheck, X, RotateCcw, Clock } from "lucide-react";
import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import { useTimerLeft } from "@/shared/hook/useTimerLeft";

type Props = {
  email: string;
  closePopup: () => void;
};

export const ConfirmEmailPop = ({ email, closePopup }: Props) => {
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [isResending, setIsResending] = useState<boolean>(false);

  const timeLeft = useTimerLeft({
    time: 60,
    action: (value) => setButtonDisabled(value),
  });

  const handleResendConfirm = async () => {
    setIsResending(true);
    try {
      const response = await AxiosAPI.post(`/api/v1/auth/resend-verification`, { email });
      toast.success(response?.data?.message || "Verification email resent successfully!");
      setButtonDisabled(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message || "Failed to resend verification email");
      } else {
        toast.error("Failed to resend verification email");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Soft light overlay with subtle frosted blur instead of heavy dark black */}
      <div
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={closePopup}
      />

      {/* Elegant White Card matching AuthSwitch design */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-[0_25px_60px_-15px_rgba(124,58,237,0.22)] border border-purple-100/80 flex flex-col items-center text-center z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={closePopup}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mail Icon with soft purple gradient/ring */}
        <div className="w-16 h-16 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center mb-4 ring-8 ring-purple-50/60 shadow-sm">
          <MailCheck className="w-8 h-8" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
          Check your email!
        </h2>

        {/* Description & Email */}
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          We&apos;ve sent a verification link to
          <br />
          <span className="font-semibold text-gray-900 bg-purple-50/80 border border-purple-100 text-xs px-2.5 py-1 rounded-lg inline-block my-1.5 break-all">
            {email}
          </span>
          <br />
          Please click the link in your email to activate your account.
        </p>

        {/* Resend Action Button */}
        <button
          disabled={buttonDisabled || isResending}
          onClick={handleResendConfirm}
          className={`w-full py-3 px-4 rounded-2xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            buttonDisabled || isResending
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-md shadow-purple-500/25 hover:shadow-purple-500/35 cursor-pointer active:scale-[0.99]"
          }`}
        >
          {isResending ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>Sending...</span>
            </>
          ) : buttonDisabled ? (
            <>
              <Clock className="w-4 h-4 text-gray-400" />
              <span>Resend email in {timeLeft}s</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-4 h-4" />
              <span>Resend email</span>
            </>
          )}
        </button>

        {/* Back Link */}
        <button
          type="button"
          onClick={closePopup}
          className="mt-4 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          Back to registration
        </button>
      </div>
    </div>
  );
};

export default ConfirmEmailPop;
