import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import { OnboardingForm } from "../types/onboarding.types";

export const onboardingService = {
  create: async (data: OnboardingForm) => {
    const payload = toFormData(data);

    // DEBUG: log what we're sending
    console.log("=== DEBUG FormData ===");
    for (const [key, value] of payload.entries()) {
      console.log(`  ${key}:`, typeof value === "string" ? value : value);
    }
    console.log("=== END DEBUG ===");

    try {
      const response = await AxiosAPI.post('/api/v1/users/me/setup-profile', payload);
      return response.data;
    } catch (err: any) {
      console.error("=== SETUP PROFILE ERROR RESPONSE ===");
      console.error(JSON.stringify(err?.response?.data, null, 2));
      console.error("=== END ERROR ===");
      throw err;
    }
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

  // Educations payload - filter out empty entries
  const educationPayload = (data.educations || [])
    .filter((edu) => edu.institution && edu.institution.trim().length >= 2)
    .map((edu) => ({
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