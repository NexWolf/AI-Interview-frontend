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
      const candidateName = response?.user?.firstName || response?.user?.userName || "";
      const defaultIntroText = isArabic
        ? `أهلاً بك${candidateName ? ` يا ${candidateName}` : ""}! كبداية لمقابلتنا، هل يمكنك أن تعرفنا عن نفسك وعن خلفيتك المهنية، وتحدثنا عن أبرز خبراتك العملية والمشاريع الواقعية التي عملت عليها؟`
        : `Welcome${candidateName ? `, ${candidateName}` : ""}! To kick off our interview, could you please introduce yourself, share an overview of your background, and tell me about your practical experience and key projects?`;

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