"use client";

import { useEffect, useState } from "react";
import { FieldPath, useForm } from "react-hook-form";
import { dbStore } from "@/shared/lib/dbStore";
import { useRouter } from "next/navigation";
import { IndexedDBType, OnboardingForm } from "../types/onboarding.types";
import { useCreateProfile } from "../hooks/useCreateProfile";
import OnboardingFormComp from "./OnboardingFormComp";
import OnboardingSidebar from "./OnboardingSidebar";

type stepKey = "basicData" | "bioData" | "skills" | "education";

/* STEP ARRAY */
const steps: { key: stepKey; fields: FieldPath<OnboardingForm>[] }[] = [
  {
    key: "basicData",
    fields: [
      "basicData.firstName",
      "basicData.lastName",
      "basicData.userName",
      "basicData.phoneNumber",
    ],
  },
  {
    key: "bioData",
    fields: ["bioData.avatar", "bioData.bio", "bioData.socialLink"],
  },
  { key: "skills", fields: ["skills"] },
  { key: "education", fields: ["education"] },
];

const OnBoardingComponent = () => {
  const [step, setStep] = useState<number>(1);
  const [isDbLoaded, setIsDbLoaded] = useState<boolean>(false);

  /* TOTAL STEP COUNT */
  const totalStep = 4;

  /* ROUTER TO  NEXT PUSH PAGE */
  const router = useRouter();

  /* TANSTAK FOR FETCH DATA */
  const { mutateAsync, isPending, isError, error } = useCreateProfile();

  /* REACT HOOK FORM METHODS  */
  const methods = useForm<OnboardingForm>({
    defaultValues: {
      basicData: {
        email: "",
        firstName: "",
        lastName: "",
        userName: "",
        phoneNumber: "",
      },
      bioData: {
        bio: "",
        avatar: null,
        socialLink: [],
      },
      education: [
        {
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
          description: "",
        },
      ],
      skills: [],
    },
    mode: "onBlur",
  });

  const { reset, trigger, getValues } = methods;

  /* HERE WE SAVE DATA AND STEP NUMBER IN INDEXEDDB */
  useEffect(() => {
    async function loadSaveData() {
      try {
        const savedData =
          await dbStore.get<Partial<IndexedDBType>>("onboarding_form");
        const savedStep = await dbStore.get<number>("onboarding_step");

        if (savedData) {
          reset((prev) => ({ ...prev, ...savedData }));
        }

        if (savedStep) {
          setStep(savedStep);
        }
      } catch (error) {
        console.error("Failed to load IndexedDB data", error);
      } finally {
        setIsDbLoaded(true);
      }
    }

    loadSaveData();
  }, [reset]);

  /*  */
  useEffect(() => {
    if (!isDbLoaded) return;
    const subscription = methods.watch((value, { name }) => {
      // التأكد أن التغيير حدث داخل مصفوفة التعليم
      if (name && name.startsWith("education")) {
        const currentFullForm = methods.getValues();
        dbStore.save("onboarding_form", currentFullForm);
      }
    });

    return () => subscription.unsubscribe();
  }, [methods.watch, methods.getValues]);

  const handleNextStep = async (currentStepIndex: number) => {
    const currentStepConfig = steps[currentStepIndex - 1];
    const isStepValid = await trigger(currentStepConfig.fields);

    if (isStepValid) {
      const fullFormData = getValues();
      const nextStep = currentStepIndex + 1;

      await dbStore.save("onboarding_form", fullFormData);
      await dbStore.save("onboarding_step", nextStep);
      setStep(nextStep);
    }
  };

  useEffect(() => {
    console.log(step)
  },[step])

  const handleBackStep = async (currentStep: number) => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      await dbStore.save("onboarding_step", prevStep);
      setStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: OnboardingForm) => {


      await mutateAsync(data);
      await dbStore.clear();
      router.push("/profile");
  };

  if (!isDbLoaded) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center gap-3 bg-background text-foreground">
        <div className="relative flex items-center justify-center">
          <div className="h-10 w-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        </div>
        <p className="text-xs sm:text-sm font-medium text-muted-foreground animate-pulse">
          Loading your onboarding progress...
        </p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-8">
          <OnboardingSidebar currentStep={step} totalSteps={totalStep} />
        </div>

        <div className="lg:col-span-7">
          <OnboardingFormComp
            methods={methods}
            OnSubmit={onSubmit}
            error={error}
            isError={isError}
            isPending={isPending}
            step={step}
            onNext={handleNextStep}
            onBack={handleBackStep}
            totalSteps={totalStep}
          />
        </div>
      </div>
    </div>
  );
};

export default OnBoardingComponent;
