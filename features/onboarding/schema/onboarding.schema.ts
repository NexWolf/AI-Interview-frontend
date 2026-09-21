import { z } from "zod";

// 1. Basic Data Schema (كلها اختيارية أو قادمة مسبقاً، الهاتف اختياري)
export const basicApiSchema = z.object({
  email: z.string().email().optional().or(z.literal("")),
  firstName: z.string().optional().or(z.literal("")),
  lastName: z.string().optional().or(z.literal("")),
  userName: z.string().optional().or(z.literal("")),
  phoneNumber: z.string().nullable().optional(),
});

// 2. Bio Data Schema (اختيارية بالكامل)
export const bioApiSchema = z.object({
  avatar: z.custom<File>().nullable().optional(),
  bio: z.string().nullable().optional(),
  socialLink: z
    .string()
    .url("Please enter a valid URL")
    .nullable()
    .optional()
    .or(z.literal("")),
});

// 3. Education Schema (اختياري ككائن، ولكن لو قُرّر تعبئته نتحقق من منطق التواريخ)
export const educationApiSchema = z
  .object({
    institution: z.string().optional().or(z.literal("")),
    degree: z.number().nullable().optional(),
    fieldOfStudy: z.string().optional().or(z.literal("")),
    startDate: z.string().optional().or(z.literal("")),
    endDate: z.string().optional().or(z.literal("")),
    isCurrent: z.boolean().default(false),
    description: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      // إذا أدخل تاريخ بداية وتاريخ نهاية ولم يكن يدرس حالياً، نتحقق أن النهاية بعد البداية
      if (!data.isCurrent && data.startDate && data.endDate) {
        return new Date(data.endDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: "End date cannot be earlier than start date",
      path: ["endDate"],
    }
  );

// 4. Complete Profile Setup Schema
export const profileSetupSchema = z.object({
  basicData: basicApiSchema,
  bioData: bioApiSchema,
  education: z.array(educationApiSchema).optional().default([]),
  // الـ Skills هي الحقل الوحيد المطلوب (على الأقل مهارة واحدة)
  skills: z
    .array(z.string().min(1, "Skill name cannot be empty"))
    .min(1, "Please add at least one skill"),
});

// استخراج الـ Type مباشرة من الـ Schema للمطابقة
export type ProfileSetupSchemaType = z.infer<typeof profileSetupSchema>;