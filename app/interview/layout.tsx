"use client";

import { useInterviewProtection } from "@/features/interview/hooks/useInterviewProtection";
import { MediaStreamProvider } from "@/shared/components/provider/MediaStermProvider";
import { ReactNode } from "react";

export default function InterviewLayout({ children }: { children: ReactNode }) {
  // تفعيل حماية البيئة المغلقة على جميع صفحات المقابلة
  //   useInterviewProtection({
  //     isEnabled: true,
  //     onTabSwitch: () => {
  //       console.warn("تنبيه: تم اكتشاف محاولة خروج من تبويب المقابلة!");
  //     },
  //   });

  return (
    <MediaStreamProvider>
      {/* محتوى الصفحات الفرعية (Setup / Session) */}
      <main className="flex-1 flex flex-col justify-center items-center p-4 md:p-6">
        {children}
      </main>
    </MediaStreamProvider>
  );
}
