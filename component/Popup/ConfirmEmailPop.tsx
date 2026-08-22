"use client";
import { AxiosAPI } from "@/app/api/AxiosAPI";
import { API_URL } from "@/constants/routes";
import { useTimerLeft } from "@/hook/ui/useTimerLeft";
import { useState } from "react";

type props = {
  email: string;
  closePopup: () => void;
};

export const ConfirmEmailPop = ({ email, closePopup }: props) => {
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

  const handleResendConfirm = async () => {
    try {
      const response = await AxiosAPI.post(
        `${API_URL}/api/v1/auth/resend-verification`,
      );

      setButtonDisabled(true);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const timeLeft = useTimerLeft({
    time: 60,
    action: (value) => setButtonDisabled(value),
  });

  return (
    <div className="absolute inset-0 z-50 w-screen h-screen ">
      <div className="w-full h-full flex justify-center items-center bg-black/60 z-40" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-5 bg-zinc-800  p-8 shadow-xl  rounded-md">
        <button
          type="button"
          className="absolute top-2 right-2  bg-zinc-600 hover:text-red-500 hover:scale-105 transition p-1 px-3 rounded cursor-pointer"
          onClick={closePopup}
        >
          X
        </button>
        <h2 className="font-bold text-xl">Check your gmail!</h2>
        <span className="text-center text-sm text-gray-300">
          Please click the link in the email we sent to <strong>{email}</strong>{" "}
          to activate your account.
        </span>
        <button
          disabled={buttonDisabled}
          className={`px-3 py-2 rounded transition ${buttonDisabled ? "bg-primary/30" : "bg-primary/80 cursor-pointer hover:scale-105 "}`}
          onClick={handleResendConfirm}
        >
          {buttonDisabled ? `Resend email in  ${timeLeft}` : "Resend email"}
        </button>
      </div>
    </div>
  );
};

export default ConfirmEmailPop;
