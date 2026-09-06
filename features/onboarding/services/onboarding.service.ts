import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import { OnboardingForm } from "../types/onboarding.types";

export const onboardingService = {
  create: async (data: OnboardingForm) => {
    const payload = toFormData(data);
    const response = await AxiosAPI.post('/api/v1/users/me/setup-profile', payload);
    return response.data; // إرجاع data مباشرة لـ React Query
  }
};

function toFormData(data: OnboardingForm): FormData  {
  const formData = new FormData();

  if (data.basicData.phoneNumber) formData.append("phoneNumber", data.basicData.phoneNumber);
  if (data.bioData.bio) formData.append("bio", data.bioData.bio);
  if (data.bioData.avatar instanceof File) {
    formData.append("avatarUrl", data.bioData.avatar);
  }
  if (data.bioData.socialLink) formData.append("socialLinks", data.bioData.socialLink);

  // الأنواع المعقدة (arrays/objects) لازم تتحول لـ JSON string
  data.skills.forEach((skill) => {
    formData.append("skills[]" , skill)
  })
  data.education.forEach((education, index) => {
  formData.append(`education[${index}][institution]`, education.institution);
  formData.append(`education[${index}][degree]`, education.degree ?? '');
  formData.append(`education[${index}][fieldOfStudy]`, education.fieldOfStudy);
  formData.append(`education[${index}][startDate]`, education.startDate);
  if (education.endDate) formData.append(`education[${index}][endDate]`, education.endDate);
  formData.append(`education[${index}][isCurrent]`, String(education.isCurrent));
  if (education.description) formData.append(`education[${index}][description]`, education.description);
});

  formData.forEach((value , key) => {
    console.log(key, ":", value )
  })

  return formData;
}