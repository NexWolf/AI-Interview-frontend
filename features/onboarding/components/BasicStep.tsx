"use client";

import { Input } from "@/shared/components/ui/Input";
import { get, useFormContext } from "react-hook-form";
import "react-phone-number-input/style.css";
import { useEffect } from "react";
import { useUserInfo } from "@/shared/hook/useUserInfo";
import PhoneNumber from "./PhoneNumber";
import FormHeader from "./FormHeader";

type PropsBasics = {
  onNext ?: () => void;
  editMode ?: boolean;
};

const BasicStep = ({ onNext , editMode = false}: PropsBasics) => {
  const { data: userInfo } = useUserInfo();

  const {
    register,
    reset,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  // Extraction of nested errors
  const firstNameError = get(errors, "basicData.firstName");
  const lastNameError = get(errors, "basicData.lastName");
  const userNameError = get(errors, "basicData.userName");
  const emailError = get(errors, "basicData.email");

  useEffect(() => {
    if (userInfo) {
      reset((formValues) => ({
        ...formValues,
        basicData: {
          ...formValues.basicData,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email,
          userName: userInfo.userName,
        },
      }));
    }
  }, [userInfo, reset]);

  return (
    <div className="space-y-6">
      <FormHeader
        leftStep="Step 1 of 4"
        title="Complete Your Profile"
        description="Please fill in the required fields below to personalize your workspace experience."
      />

      <div className="space-y-4">
        {/* First & Last Name Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 w-full">
            <Input
              {...register("basicData.firstName", {
                required: "First name is required",
              })}
              label="First Name"
              placeholder="Ex: Ahmed"
            />
            {firstNameError && (
              <p className="text-destructive text-xs mt-1.5 font-medium">
                {String(firstNameError.message)}
              </p>
            )}
          </div>

          <div className="flex-1 w-full">
            <Input
              {...register("basicData.lastName", {
                required: "Last name is required",
              })}
              label="Last Name"
              placeholder="Ex: Jheer"
            />
            {lastNameError && (
              <p className="text-destructive text-xs mt-1.5 font-medium">
                {String(lastNameError.message)}
              </p>
            )}
          </div>
        </div>

        {/* Username Field */}
        <div className="w-full">
          <Input
            {...register("basicData.userName", {
              required: "Username is required",
            })}
            readOnly
            label="User Name"
            placeholder="Ex: ahmed-jheer"
          />
          {userNameError && (
            <p className="text-destructive text-xs mt-1.5 font-medium">
              {String(userNameError.message)}
            </p>
          )}
        </div>

        {/* Username Field */}
        <div className="w-full">
          <Input
            {...register("basicData.email", {
              required: "Email is required",
            })}
            readOnly
            label="Your Email"
            placeholder="Ex: ahmed@gmail.comr"
          />
          {emailError && (
            <p className="text-destructive text-xs mt-1.5 font-medium">
              {String(emailError.message)}
            </p>
          )}
        </div>

        {/* Phone Number Field Container */}
        <div className="w-full">
          <PhoneNumber />
        </div>
      </div>

      {onNext &&  (
        <div className="flex justify-end pt-4 border-t border-border/40">
        <button
          type="button"
          onClick={onNext}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-xl font-medium text-sm shadow-xs transition-all duration-200 cursor-pointer">
          Next
        </button>
      </div>
      )}
      
    </div>
  );
};

export default BasicStep;
