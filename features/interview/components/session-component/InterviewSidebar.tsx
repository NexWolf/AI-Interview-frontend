import React from 'react';
import { Award, CheckCircle, ShieldAlert } from 'lucide-react';

interface InterviewSidebarProps {
  RoomData: any;
  questionList: any[];
  currentQuestion: any;
}

export const InterviewSidebar: React.FC<InterviewSidebarProps> = ({
  RoomData,
  questionList,
  currentQuestion,
}) => {
  return (
    <div className="lg:col-span-4 flex flex-col gap-6">
      {/* Skills Assessed */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-card-foreground uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" />
          <span>Assessed Technologies</span>
        </h3>

        <div className="flex flex-wrap gap-2">
          {RoomData?.skills && RoomData.skills.length > 0 ? (
            RoomData.skills.map((skill: any) => (
              <span
                key={skill.id}
                className="px-3 py-1.5 rounded-xl bg-muted border border-border text-xs font-medium text-foreground"
              >
                {skill.name}
              </span>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">General Technical Evaluation</span>
          )}
        </div>
      </div>

      {/* Session Progress */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-card-foreground uppercase tracking-wider">
          Questions History
        </h3>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {questionList.length > 0 ? (
            questionList.map((q, idx) => (
              <div
                key={q.id || idx}
                className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 transition ${
                  currentQuestion?.id === q.id
                    ? "bg-primary/10 border-primary/40 text-primary"
                    : q.isAnswered
                      ? "bg-muted/50 border-border text-muted-foreground"
                      : "bg-card border-border text-foreground"
                }`}
              >
                <span className="mt-0.5">
                  {q.isAnswered ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-primary/50 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </div>
                  )}
                </span>
                <p className="line-clamp-2 leading-relaxed flex-1">{q.question}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground">No questions generated yet.</p>
          )}
        </div>
      </div>

      {/* Proctoring Rules */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-card-foreground uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Proctoring Integrity</span>
        </h3>
        <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
          <li>Stay focused on this window. Tab switching is logged.</li>
          <li>Keep your microphone and webcam active.</li>
          <li>Provide answers in the selected language ({RoomData?.interviewLanguage}).</li>
        </ul>
      </div>
    </div>
  );
};
