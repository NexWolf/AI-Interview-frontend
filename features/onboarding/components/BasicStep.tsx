"use client";

import { useEffect } from "react";
import { get, useFormContext } from "react-hook-form";
import { Input } from "@/shared/components/ui/Input";
import { useUserInfo } from "@/shared/hook/useUserInfo";
import PhoneNumber from "./PhoneNumber";
import { ArrowRight, ShieldCheck } from "lucide-react";
import "react-phone-number-input/style.css";

type PropsBasics = {
  onNext?: () => void;
  editMode?: boolean;
};

const BasicStep = ({ onNext, editMode = false }: PropsBasics) => {
  const { data: userInfo } = useUserInfo();

  const {
    register,
    reset,
    formState: { errors },
  } = useFormContext();

  // استخراج أخطاء الحقول
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
      {/* 1. شارة توضيحية لبيانات الحساب الموثقة */}
      {!editMode && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-secondary/60 dark:bg-secondary/30 border border-border/60 dark:border-border/40 text-xs text-muted-foreground backdrop-blur-xs">
          <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
          <span>
            Basic details are automatically synced from your verified account credentials.
          </span>
        </div>
      )}

      {/* 2. شبكة الحقول الأساسية */}
      <div className="space-y-4">
        {/* صف الاسم الأول والأخير بنظام Grid متجاوب */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Input
              {...register("basicData.firstName", {
                required: "First name is required",
              })}
              label="First Name"
              placeholder="Ex: Ahmed"
              readOnly={!editMode}
            />
            {firstNameError && (
              <p className="text-destructive text-xs font-medium px-1">
                {String(firstNameError.message)}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Input
              {...register("basicData.lastName", {
                required: "Last name is required",
              })}
              label="Last Name"
              placeholder="Ex: Jheer"
              readOnly={!editMode}
            />
            {lastNameError && (
              <p className="text-destructive text-xs font-medium px-1">
                {String(lastNameError.message)}
              </p>
            )}
          </div>
        </div>

        {/* حقل اسم المستخدم (Username) */}
        <div className="space-y-1">
          <Input
            {...register("basicData.userName", {
              required: "Username is required",
            })}
            label="User Name"
            placeholder="Ex: ahmed-jheer"
            readOnly={!editMode}
          />
          {userNameError && (
            <p className="text-destructive text-xs font-medium px-1">
              {String(userNameError.message)}
            </p>
          )}
        </div>

        {/* حقل البريد الإلكتروني (Email) */}
        <div className="space-y-1">
          <Input
            {...register("basicData.email", {
              required: "Email is required",
            })}
            label="Your Email"
            placeholder="Ex: ahmed@gmail.com"
            readOnly={!editMode}
          />
          {emailError && (
            <p className="text-destructive text-xs font-medium px-1">
              {String(emailError.message)}
            </p>
          )}
        </div>

        {/* حقل رقم الهاتف */}
        <div className="space-y-1 pt-1">
          <PhoneNumber />
        </div>
      </div>

      {/* 3. زر الانتقال للخطوة التالية (Next Button) */}
      {onNext && (
        <div className="flex justify-end pt-6 border-t border-border/50 dark:border-border/30">
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-7 py-2.5 rounded-xl font-medium text-sm shadow-md hover:shadow-lg dark:shadow-none transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BasicStep;