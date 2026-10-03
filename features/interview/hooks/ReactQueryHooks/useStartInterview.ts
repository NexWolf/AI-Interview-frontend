import { useMutation, useQueryClient } from "@tanstack/react-query";
import { interviewService } from "../../services/interview.service";
import { StartInterviewPayload } from "../../types/setup";
import { useInterviewStore } from "../../store/useInterviewStore";
import { formatToQuestionItem } from "../../utils/questionMapper";

export const useStartInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StartInterviewPayload) => interviewService.create(data),

    onSuccess: (response) => {
      const interviewId = response?.interview?.id;
      if (interviewId) {
        // Invalidate interview queries so subsequent room fetches refresh properly
        queryClient.invalidateQueries({ queryKey: ["interview", interviewId] });
      }

      const isArabic = response?.interview?.interviewLanguage === "Arabic";
      const defaultIntroText = isArabic
        ? "تحدث عن نفسك وخلفيتك المهنية."
        : "Tell me about yourself.";

      const currentQ = formatToQuestionItem(response?.introductionQuestion, {
        defaultOrder: 1,
        fallbackText: defaultIntroText,
      });

      const nextQ = formatToQuestionItem(response?.firstTechnicalQuestion, {
        defaultOrder: 2,
      });

      const store = useInterviewStore.getState();
      if (currentQ) {
        store.setCurrentQuestion(currentQ);
        store.addQuestion(currentQ);
      }
      if (nextQ) {
        store.setNextQuestion(nextQ);
        store.addQuestion(nextQ);
      }

      console.log("🎯 [START INTERVIEW] Questions successfully stored in Zustand Store:");
      console.log("👉 currentQuestion (Question 1):", store.currentQuestion);
      console.log("👉 nextQuestion (Question 2):", store.nextQuestion);
      console.log("📋 questionList in store:", store.questionList);
    },
  });
};