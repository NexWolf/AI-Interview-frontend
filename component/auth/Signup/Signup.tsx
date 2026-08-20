"use client";
import { AxiosAPI } from "@/app/API/AxiosAPI";
import AuthSignForm from "@/component/form/AuthSignForm";
import ConfirmEmailPop from "@/component/Popup/ConfirmEmailPop";
import { Input } from "@/component/ui/Input";
import { API_URL } from "@/constants/routes";
import { SignupType } from "@/types/auth";
import { signupInput, SignupSchema } from "@/validations/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiAlertCircle } from "react-icons/fi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import axios from "axios";

type props = {
  show?: boolean;
  onConfirm: () => void;
};

export const Signup = forwardRef<HTMLDivElement, props>(
  ({ show, onConfirm }, ref) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [showConfirmPop, setShowConfirmPop] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string>("");

    const {
      register: registerData,
      handleSubmit: handleSubmitData,
      formState: { errors },
      reset: resetForm,
    } = useForm<signupInput>({
      resolver: zodResolver(SignupSchema),
    });

    const onSignup = async (data: SignupType) => {
      const FormData = {
        firstName: data.firstname,
        lastName: data.lastname,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        userName: data.username,
      };
      console.log(FormData);
      setLoading(true);
      try {
        const response = await AxiosAPI.post(
          `${API_URL}/api/v1/auth/register`,
          FormData,
        );
        if (response.data.success) {
          const { message, data } = response.data;
          console.log(data.user.isVerified);
          toast.success(message || "welcome");
          resetForm();
          if (!data.user.isVerified) {
            setUserEmail(data.user.email);
            setShowConfirmPop(true);
          }
        }
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          toast.error(
            e?.response?.data?.message || "Failed signup please try later!",
          );
        } else {
          toast.error("Failed signup, please try later!");
        }
      } finally {
        setLoading(false);
      }
      console.log(data);
    };

    useEffect(() => {}, []);

    // useLookScroll(showConfirmPop)

    return (
      <div
        className={`absolute  inset-0 transition-all duration-500  ${show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}`}
      >
        {/* {showConfirmPop && (
            <ConfirmEmailPop
              email={userEmail}
              closePopup={() => setShowConfirmPop(false)}
            />
        )} */}

        <div ref={ref} className="h-full">
          <AuthSignForm
            title="Sign Up Account"
            onSubmit={handleSubmitData(onSignup)}
            onConfirm={onConfirm}
            haveAccountTitle="Dont have an account?sign in"
          >
            <div className="flex justify-between items-center w-full gap-2 ">
              <div className=" w-1/2 ">
                <Input
                  label="First Name"
                  {...registerData("firstname")}
                  placeholder="eg. Ahmed"
                />

                {errors.firstname && (
                  <p className="text-xs text-red-400/90 font-medium mt-1 flex items-center gap-1 transition-all">
                    <FiAlertCircle className="text-sm shrink-0" />
                    <span>{errors.firstname.message}</span>
                  </p>
                )}
              </div>

              <div className="w-1/2 ">
                <Input
                  label="Last Name"
                  {...registerData("lastname")}
                  placeholder="eg. Jheer"
                />

                {errors.lastname && (
                  <p className="text-xs text-red-400/90 font-medium mt-1 flex items-center gap-1 transition-all">
                    <FiAlertCircle className="text-sm shrink-0" />{" "}
                    <span> {errors.lastname.message}</span>
                  </p>
                )}
              </div>
            </div>

            <Input
              label="User name"
              {...registerData("username")}
              placeholder="eg. Ahmed-jheer"
            />
            {errors.username && (
              <p className="text-xs text-red-400/90 font-medium mt-1 flex items-center gap-1 transition-all">
                <FiAlertCircle className="text-sm shrink-0" />{" "}
                {errors.username.message}
              </p>
            )}

            <Input
              label="Email"
              {...registerData("email")}
              placeholder="eg. Ahmed@gmail.com"
            />
            {errors.email && (
              <p className="text-xs text-red-400/90 font-medium mt-1 flex items-center gap-1 transition-all">
                <FiAlertCircle className="text-sm shrink-0" />{" "}
                <span>{errors.email.message}</span>
              </p>
            )}

            <Input
              label="Password"
              type="password"
              {...registerData("password")}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-xs text-red-400/90 font-medium mt-1 flex items-center gap-1 transition-all">
                <FiAlertCircle className="text-sm shrink-0" />{" "}
                <span>{errors.password.message}</span>
              </p>
            )}

            <Input
              label="Confirm password"
              type="password"
              {...registerData("confirmPassword")}
              placeholder="Enter confirm password"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-400/90 font-medium mt-1 flex items-center gap-1 transition-all">
                <FiAlertCircle className="text-sm shrink-0" />{" "}
                <span>{errors.confirmPassword.message}</span>
              </p>
            )}

            <div className="w-full space-y-1 mt-5">
              <button
                disabled={loading}
                className="w-full bg-[#CBA07B] border border-gray-800 py-2 rounded-md text-white/70 hover:text-white hover:scale-105 cursor-pointer flex items-center justify-center gap-1 "
              >
                {loading ? (
                  <div className="flex gap-2">
                    <Loader2 className="animate-spin h-5 w-5 text-gray-800" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <span>Sign Up</span>
                )}
              </button>
            </div>
          </AuthSignForm>
        </div>
      </div>
    );
  },
);

Signup.displayName = "Signup";
