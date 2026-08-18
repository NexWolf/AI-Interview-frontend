"use client";
import AuthSignForm from "@/component/form/AuthSignForm";
import ConfirmEmailPop from "@/component/Popup/ConfirmEmailPop";
import { Input } from "@/component/ui/Input";
import { SignupType } from "@/types/auth";
import { signupInput, SignupSchema } from "@/validations/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FiAlertCircle } from "react-icons/fi";

type props = {
  show?: boolean;
  onConfirm: () => void;
};

type userData = {
  id: number | null;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
};

export const Signup = forwardRef<HTMLDivElement, props>(
  ({ show, onConfirm }, ref) => {
    // const [showConfirmPop , setShowConfirmPop] = useState<boolean>(false)
    // const [userData , setUserData] = useState<userData>({
    //   id: null,
    //   firstname : "",
    //   lastname : "",
    //   username : "",
    //   email : ""
    // })

    const {
      register: registerData,
      handleSubmit: handleSubmitData,
      formState: { errors },
      reset: resetForm,
    } = useForm<signupInput>({
      resolver: zodResolver(SignupSchema),
    });

    const onSignup = async (data: SignupType) => {
      console.log(data)
    };

    // useLookScroll(showConfirmPop)

    return (
      <div
        className={`absolute  inset-0 transition-all duration-500  ${show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}`}
      >
        {/* {showConfirmPop && <ConfirmEmailPop  
          email = {userData.email}
          closePopup={() => setShowConfirmPop(false)}
          />} */}

        <div ref={ref} className="h-full">
          <AuthSignForm
            title="Sign Up Account"
            onSubmit={handleSubmitData(onSignup)}
            onConfirm={onConfirm}
            haveAccountTitle="Dont have an account?sign in"
          >
            <div className="flex justify-between items-center w-full gap-2 ">
              <label className=" w-1/2 ">
                <h3 className="text-white/70 text-sm">First Name</h3>
                <Input {...registerData("firstname")} placeholder="eg. Ahmed" />

                {errors.firstname && (
                  <p className="text-xs text-red-400/90 font-medium mt-1 flex items-center gap-1 transition-all">
                    <FiAlertCircle className="text-sm shrink-0" />
                    <span>{errors.firstname.message}</span>
                  </p>
                )}
              </label>

              <label className="w-1/2 ">
                <h3 className="text-white/70 text-sm">Last Name</h3>
                <Input {...registerData("lastname")} placeholder="eg. Jheer" />

                {errors.lastname && (
                  <p className="text-xs text-red-400/90 font-medium mt-1 flex items-center gap-1 transition-all">
                    <FiAlertCircle className="text-sm shrink-0" />{" "}
                    <span> {errors.lastname.message}</span>
                  </p>
                )}
              </label>
            </div>

            <label>
              <h3 className="text-white/70 text-sm">User name</h3>
              <Input
                {...registerData("username")}
                placeholder="eg. Ahmed-jheer"
              />
              {errors.username && (
                <p className="text-xs text-red-400/90 font-medium mt-1 flex items-center gap-1 transition-all">
                  <FiAlertCircle className="text-sm shrink-0" />{" "}
                  {errors.username.message}
                </p>
              )}
            </label>

            <label>
              <h3 className="text-white/70 text-sm">Email</h3>
              <Input
                {...registerData("email")}
                placeholder="eg. Ahmed@gmail.com"
              />
              {errors.email && (
                <p className="text-xs text-red-400/90 font-medium mt-1 flex items-center gap-1 transition-all">
                  <FiAlertCircle className="text-sm shrink-0" />{" "}
                  <span>{errors.email.message}</span>
                </p>
              )}
            </label>

            <label>
              <h3 className="text-white/70 text-sm">Password</h3>
              <Input
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
            </label>

            <div className="w-full space-y-1 mt-5">
              <button className="w-full bg-[#CBA07B] border border-gray-800 py-2 rounded-md text-white/70 hover:text-white hover:scale-105 cursor-pointer flex items-center justify-center gap-1">
                Sign Up
              </button>
            </div>
          </AuthSignForm>
        </div>
      </div>
    );
  },
);

Signup.displayName = "Signup";
