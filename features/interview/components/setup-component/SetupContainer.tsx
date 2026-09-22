"use client";
import CameraPreview from "@/features/interview/components/setup-component/CameraPreview";
import MicorphoneTest from "@/features/interview/components/setup-component/MicorphoneTest";
import { useForm } from "react-hook-form";
import { setupInterview, StartInterviewPayload } from "@/features/interview/types/setup";
import LanguageSelect from "./LanguageSelect";
import TecnologiesSelect from "./TechnologiesSelect";
import InterviewLevelSelect from "./InterviewLevelSelect";
import { ThemeToggle } from "@/shared/components/ui/ThemeToggle";
import { useRouter } from "next/navigation";
import FormTag from "@/shared/components/form/FormTag";
import { useEffect, useState, useMemo } from "react";
import { useUserInfo } from "@/shared/hook/useUserInfo";
import { useAllSkills } from "@/shared/hook/useAllSkills";
import { useStartInterview } from "../../hooks/ReactQueryHooks/useStartInterview";

const setupDefaultData: setupInterview = {
  interviewLanguage: "Arabic",
  mode: "skills_only",
  job_description: "",
  skillsIds: [],
  duration: 20,
  difficultyLevel: "Beginner",
};

export const SetupContainer = () => {
  const { data: userData } = useUserInfo();
  const { mutate: startInterview, isPending } = useStartInterview();
  const router = useRouter();

  const [hasJobDescription, setHasJobDescription] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");

  // Hardware readiness states
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);
  const [isAudioReady, setIsAudioReady] = useState<boolean>(false);

  // Anti-cheating and guidelines acceptance checklist
  const [rulesAgreed, setRulesAgreed] = useState<{
    quietPlace: boolean;
    noTabSwitch: boolean;
    noExternalAI: boolean;
    faceVisible: boolean;
  }>({
    quietPlace: false,
    noTabSwitch: false,
    noExternalAI: false,
    faceVisible: false,
  });

  useEffect(() => {
    if (!userData?.userName) return;
    setUserName(userData.userName);
  }, [userData]);

  const methods = useForm<setupInterview>({
    defaultValues: setupDefaultData,
  });

  const { register, watch } = methods;

  // Validate that all guidelines have been accepted
  const allRulesAccepted = useMemo(() => {
    return Object.values(rulesAgreed).every(Boolean);
  }, [rulesAgreed]);

  // Unified condition to enable the submit button:
  // 1. Camera verified
  // 2. Microphone verified
  // 3. All guidelines checked
  // 4. Mutation is not pending
  const isReadyToStart = isVideoReady && isAudioReady && allRulesAccepted && !isPending;

  const toggleRule = (key: keyof typeof rulesAgreed) => {
    setRulesAgreed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectAllRules = () => {
    const newState = !allRulesAccepted;
    setRulesAgreed({
      quietPlace: newState,
      noTabSwitch: newState,
      noExternalAI: newState,
      faceVisible: newState,
    });
  };

  const OnSubmit = async (data: setupInterview) => {
    document.documentElement.requestFullscreen().catch((e) => {
      console.error("full screen request failed", e)
    })
    if (!isReadyToStart) {
      alert("Please ensure your camera and microphone are tested, and accept all honor code guidelines before starting.");
      return;
    }

    if (!data.skillsIds || data.skillsIds.length === 0) {
      alert("Please select at least one technology/skill to evaluate.");
      return;
    }

    const payload: StartInterviewPayload = {
      difficultyLevel: data.difficultyLevel,
      interviewLanguage: data.interviewLanguage,
      mode: hasJobDescription ? "job_description" : "skills_only",
      job_description: hasJobDescription ? data.job_description : undefined,
      duration: 20,
      skillIds: data.skillsIds,
    };

    startInterview(payload, {
      onSuccess: (response) => {
        const interviewId = response?.interview?.id;
        if (interviewId) {
          router.push(`/interview/${interviewId}`);
        } else {
          console.error("Interview ID not found in response", response);
        }
      },
      onError: (error) => {
        console.error("Failed to start interview", error);
      },
    });
  };

  return (
    <div className="relative w-full min-h-screen bg-background text-foreground p-4 sm:p-8 flex flex-col justify-center items-center transition-colors duration-200">
      {/* Theme Toggle in top corner */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <FormTag
          onSubmit={OnSubmit}
          methods={methods}
          button_title={isPending ? "Starting Interview..." : "Start Interview"}
          disabeld={!isReadyToStart}
        >
          {/* Header */}
          <div className="border-b border-border pb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Interview Setup
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome {userName || "Candidate"}, let{"'"}s make sure your hardware is working and review the interview rules before beginning.
            </p>
          </div>

          {/* Section 1: Language */}
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                1. Choose Language
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Select the primary spoken and written language for the interview:
              </p>
            </div>
            <LanguageSelect />
          </div>

          {/* Job Description Optional Toggle */}
          <div className="p-4 rounded-xl border border-border bg-card/50 flex flex-col gap-3 my-3">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasJobDescription}
                onChange={(e) => setHasJobDescription(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-foreground">
                Interview for a specific Job Description (Optional)
              </span>
            </label>

            {hasJobDescription && (
              <div className="my-3">
                <textarea
                  {...register("job_description")}
                  placeholder="Paste the job requirements and description here..."
                  rows={4}
                  className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
          </div>

          {/* Section 2: Technologies */}
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                2. Select Technologies
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose the technologies you want to be evaluated on:
              </p>
            </div>
            <TecnologiesSelect />
          </div>

          {/* Section 3: Interview Level */}
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                3. Interview Level
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Select your expected experience level for this session:
              </p>
            </div>
            <InterviewLevelSelect />
          </div>

          {/* Section 4: Hardware Check */}
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                4. Hardware Check
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Ensure your camera and microphone are properly functioning:
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-stretch gap-6 w-full mt-1">
              <CameraPreview onReady={(value: boolean) => setIsVideoReady(value)} />
              <MicorphoneTest
                language={watch("interviewLanguage")}
                onReady={(value: boolean) => setIsAudioReady(value)}
              />
            </div>

            {/* Quick manual verification checkboxes */}
            {/* <div className="flex flex-wrap gap-4 pt-2">
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVideoReady}
                  onChange={(e) => setIsVideoReady(e.target.checked)}
                  className="rounded border-border text-primary"
                />
                <span>Camera feed is working and clearly visible</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAudioReady}
                  onChange={(e) => setIsAudioReady(e.target.checked)}
                  className="rounded border-border text-primary"
                />
                <span>Microphone detected audio input successfully</span>
              </label>
            </div> */}
          </div>

          {/* Section 5: Honor Code & Anti-Cheating Guidelines */}
          <div className="flex flex-col gap-4 border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/10 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-foreground">
                  5. Honor Code & Anti-Cheating Guidelines
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  To ensure a fair evaluation, this session is monitored by AI proctoring (tracking eye gaze, browser tab focus, and ambient voices). Any detected violation will be flagged as cheating and may result in immediate disqualification.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSelectAllRules}
                className="text-xs text-primary hover:underline font-medium"
              >
                {allRulesAccepted ? "Deselect All" : "Accept All"}
              </button>
            </div>

            {/* Individual Rule Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-border bg-background hover:bg-muted/50 cursor-pointer transition text-xs">
                <input
                  type="checkbox"
                  checked={rulesAgreed.quietPlace}
                  onChange={() => toggleRule("quietPlace")}
                  className="mt-0.5 w-4 h-4 rounded text-primary"
                />
                <span>
                  <strong className="block text-foreground mb-0.5">Quiet & Well-Lit Room:</strong>
                  I agree to remain alone in a quiet and well-lit environment throughout the session.
                </span>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-border bg-background hover:bg-muted/50 cursor-pointer transition text-xs">
                <input
                  type="checkbox"
                  checked={rulesAgreed.noTabSwitch}
                  onChange={() => toggleRule("noTabSwitch")}
                  className="mt-0.5 w-4 h-4 rounded text-primary"
                />
                <span>
                  <strong className="block text-foreground mb-0.5">Stay on This Page:</strong>
                  I will not switch browser tabs, minimize the window, or launch external applications.
                </span>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-border bg-background hover:bg-muted/50 cursor-pointer transition text-xs">
                <input
                  type="checkbox"
                  checked={rulesAgreed.noExternalAI}
                  onChange={() => toggleRule("noExternalAI")}
                  className="mt-0.5 w-4 h-4 rounded text-primary"
                />
                <span>
                  <strong className="block text-foreground mb-0.5">No External AI / Assistance:</strong>
                  I will not use ChatGPT, Copilot, search engines, notes, or receive help from others.
                </span>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-border bg-background hover:bg-muted/50 cursor-pointer transition text-xs">
                <input
                  type="checkbox"
                  checked={rulesAgreed.faceVisible}
                  onChange={() => toggleRule("faceVisible")}
                  className="mt-0.5 w-4 h-4 rounded text-primary"
                />
                <span>
                  <strong className="block text-foreground mb-0.5">Face Visibility & Recording:</strong>
                  I consent to continuous camera and audio recording, keeping my face visible at all times.
                </span>
              </label>
            </div>
          </div>

          {/* Prerequisite status checklist banner before submit */}
          {!isReadyToStart && (
            <div className="p-3.5 rounded-xl bg-muted/60 border border-border text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-medium text-foreground">Required to unlock Start button:</span>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className={`px-2 py-0.5 rounded-md ${isVideoReady ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                  {isVideoReady ? '✓ Camera ready' : '✗ Camera unverified'}
                </span>
                <span className={`px-2 py-0.5 rounded-md ${isAudioReady ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                  {isAudioReady ? '✓ Microphone ready' : '✗ Microphone unverified'}
                </span>
                <span className={`px-2 py-0.5 rounded-md ${allRulesAccepted ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                  {allRulesAccepted ? '✓ Guidelines accepted' : '✗ Accept 4 rules'}
                </span>
              </div>
            </div>
          )}

        </FormTag>
      </div>
    </div>
  );
};

export default SetupContainer;