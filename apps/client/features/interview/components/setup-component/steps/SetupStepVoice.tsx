import React from "react";
import { Mic } from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";
import VoiceSelect from "../VoiceSelect";
import { SetupStepFooter } from "../SetupNextButton";

interface SetupStepVoiceProps {
  onPrev: () => void;
  onNext: () => void;
}

export const SetupStepVoice: React.FC<SetupStepVoiceProps> = ({
  onPrev,
  onNext,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Voice Selection Framed Card */}
      <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card/60 dark:bg-card/25 backdrop-blur-xs shadow-xs space-y-4 hover:border-primary/30 transition-all">
        <div className="flex flex-col gap-1.5 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Mic className="w-4 h-4 text-primary" />
              {t("setup.voice.title")}
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Live Audio Preview
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("setup.voice.desc")}
          </p>
        </div>

        <VoiceSelect />
      </div>

      {/* Step 2 Actions */}
      <SetupStepFooter onPrev={onPrev} onNext={onNext} />
    </div>
  );
};

export default SetupStepVoice;
