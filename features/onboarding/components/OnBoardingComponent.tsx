"use client";

import { useEffect, useState } from "react";
import BasicStep from "./BasicStep";
import { FieldPath, FormProvider, useForm } from "react-hook-form";
import { profileSetup } from "@/types/community/onboarding";
import { dbStore } from "@/shared/lib/dbStore";
import EducationStep from "./Educations";
import SkillsStep from "./SkillsStep";
import { useRouter } from "next/navigation";
import { BioStep } from "./BioStep";
import { OnboardingForm } from "../types/onboarding.types";
import { useCreateProfile } from "../hooks/useCreateProfile";
import { Loader } from "lucide-react";

type stepKey = "basicData" | "bioData" | "skills" | "education";

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
  { key: "skills", fields: ["skills"] as FieldPath<OnboardingForm>[] },
    { key: "education", fields: ["education"] as FieldPath<OnboardingForm>[] },
];

const OnBoardingComponent = () => {
  const [step, setStep] = useState<number>(1);
  const [isDbLoaded, setIsDbLoaded] = useState<boolean>(false);
  const totalStep = 4;
  const router = useRouter();
  const { mutate, isPending, isError, error } = useCreateProfile();

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
        socialLink: "",
      },
      education: [
        {
          institution: "",
          degree: null,
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

  const { watch, reset, trigger, getValues, handleSubmit } = methods;

  useEffect(() => {
    async function loadSaveData() {
      try {
        const savedData =
          await dbStore.get<Partial<profileSetup>>("onboarding_form");
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

  const handleBackStep = async (currentStep: number) => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      await dbStore.save("onboarding_step", prevStep);
      setStep((prev) => prev - 1);

    }
  };

  if (!isDbLoaded) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const onSubmit = async (data: OnboardingForm) => {
    const formData = new FormData();

    formData.append("firstName", data.basicData.firstName);
    formData.append("lastName", data.basicData.lastName);
    data.skills.forEach((skill) => {
      formData.append("skills", skill);
    });
    if (data.basicData.phoneNumber)
      formData.append("phoneNumber", data.basicData.phoneNumber);
    if (data.bioData.avatar) formData.append("avatar", data.bioData.avatar);
    if (data.bioData.bio) formData.append("bio", data.bioData.bio);
    if (data.bioData.socialLink)
      formData.append("socialLink", data.bioData.socialLink);
    if (data.education && data.education.length > 0) {
      data.education.forEach((info, index) => {
        if (info.institution)
          formData.append(`education[${index}][institution]`, info.institution);
        if (info.degree)
          formData.append(`education[${index}][degree]`, String(info.degree));
        if (info.fieldOfStudy)
          formData.append(
            `education[${index}][fieldOfStudy]`,
            info.fieldOfStudy,
          );
        if (info.startDate)
          formData.append(`education[${index}][startDate]`, info.startDate);
        if (info.endDate)
          formData.append(`education[${index}][endDate]`, info.endDate);
        if (info.isCurrent)
          formData.append(
            `education[${index}][isCurrent]`,
            String(info.isCurrent),
          );
        if (info.description)
          formData.append(`education[${index}][description]`, info.description);
      });
    }

    mutate(formData, {
      onSuccess: async () => {
        await dbStore.clear();
        router.push("/profile");
      },
    });
    console.log(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Step Indicator Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Step {step} of {totalStep}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {Math.round((step / totalStep) * 100)}% Completed
          </span>
        </div>
        <div className="w-full h-2 bg-secondary/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${(step / totalStep) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Form Container */}
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-card text-card-foreground p-6 sm:p-8 rounded-2xl border border-border/40 shadow-xs transition-all"
        >
          {step === 1 && <BasicStep onNext={() => handleNextStep(1)} />}

          {step === 2 && (
            <BioStep
              onNext={() => handleNextStep(2)}
              onBack={() => handleBackStep(2)}
            />
          )}

          {step === 3 && (
            <SkillsStep
              onNext={() => handleNextStep(3)}
              onBack={() => handleBackStep(3)}
            />
          )}

          {step === 4 && <EducationStep onBack={() => handleBackStep(4)} />}

          {isError && <p className="text-red-500">Something went wrong: {error.message}</p>}

          {totalStep === step && (
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-xl font-medium text-sm shadow-xs transition-all duration-200 cursor-pointer"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader className="animate-spin w-5 h-5 bg-accent-foreground" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  );
};

export default OnBoardingComponent;
