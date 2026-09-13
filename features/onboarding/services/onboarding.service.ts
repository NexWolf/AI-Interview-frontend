import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import { OnboardingForm } from "../types/onboarding.types";

export const onboardingService = {
  create: async (data: OnboardingForm) => {
    const payload = toFormData(data);
    const response = await AxiosAPI.post('/api/v1/users/me/setup-profile', payload);
    return response.data; // إرجاع data مباشرة لـ React Query
  }
};

function toFormData(data: OnboardingForm): FormData {
  const formData = new FormData();
  const avatar: File | null = data.bioData.avatar;

  if (data.basicData?.phoneNumber) {
    formData.append("phoneNumber", data.basicData.phoneNumber);
  }
  if (data.bioData?.bio) {
    formData.append("bio", data.bioData.bio);
  }
  if (avatar) {
    formData.append("avatar", avatar);
  }

  // Filter valid URLs for social links
  const socialLinks = (data.bioData?.socialLinks || [])
    .map((s) => s.value?.trim())
    .filter((url) => Boolean(url && (url.startsWith("http://") || url.startsWith("https://"))));
  if (socialLinks.length > 0) {
    formData.append("socialLinks", JSON.stringify(socialLinks));
  }

  // Skills payload
  const skillsPayload = (data.skills || []).map((skillId) => ({
    skillId: Number(skillId),
    proficiencyLevel: "Intermediate",
  }));
  if (skillsPayload.length > 0) {
    formData.append("skills", JSON.stringify(skillsPayload));
  }

  // Educations payload
  const educationPayload = (data.educations || []).map((edu) => ({
    institution: edu.institution,
    degree: edu.degree || null,
    fieldOfStudy: edu.fieldOfStudy || null,
    startDate: edu.startDate,
    endDate: edu.isCurrent ? null : edu.endDate || null,
    isCurrent: Boolean(edu.isCurrent),
    description: edu.description || null,
  }));
  if (educationPayload.length > 0) {
    formData.append("education", JSON.stringify(educationPayload));
  }

  return formData;
}