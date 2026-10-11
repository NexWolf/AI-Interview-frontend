"use client";

import { useState, useEffect } from "react";
import { Save, Globe, Moon, Sun, Building2, Bell } from "lucide-react";
import { toast } from "sonner";
import { useLanguage, ThemeToggle, LanguageToggle } from "@/shared";
import { useTheme } from "next-themes";
import { useCompanyProfile } from "@repo/shared";

export function CompanySettingsTab() {
  const { t, isArabic, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { data: profile } = useCompanyProfile();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");

  useEffect(() => {
    if (profile) {
      if (profile.company?.name) setName(profile.company.name);
      if (profile.company?.slug) setSlug(profile.company.slug);
      if (profile.user?.email) setEmail(profile.user.email);
    }
  }, [profile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      isArabic
        ? "تم حفظ إعدادات مساحة العمل بنجاح"
        : "Company settings updated successfully",
    );
  };

  return (
    <div className="space-y-6 max-w-2xl animate-in fade-in-50 duration-300">
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          {t("settings.title")}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t("settings.subtitle")}
        </p>
      </div>

      {/* Appearance & Language Preferences */}
      <div className="p-6 rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md space-y-4 shadow-sm transition-colors duration-200">
        <h4 className="text-sm font-bold text-foreground">
          {isArabic ? "المظهر ولغة الواجهة" : "Appearance & Display Language"}
        </h4>
        <p className="text-xs text-muted-foreground">
          {isArabic
            ? "اختر الوضع اللوني المفضل ولغة العرض التي تناسب فريق التوظيف لديك."
            : "Select your preferred color theme and display language for the employer workspace."}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Theme Selector */}
          <div className="p-4 rounded-xl border border-border/60 bg-background/70 space-y-2">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-500 dark:hidden" />
              <Moon className="w-3.5 h-3.5 text-purple-400 hidden dark:block" />
              {isArabic ? "وضع العرض (Theme)" : "Theme Mode"}
            </span>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  theme === "light"
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-muted/60 text-muted-foreground border-border hover:bg-muted"
                }`}
              >
                {isArabic ? "فاتح (Light)" : "Light"}
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  theme === "dark"
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-muted/60 text-muted-foreground border-border hover:bg-muted"
                }`}
              >
                {isArabic ? "داكن (Dark)" : "Dark"}
              </button>
            </div>
          </div>

          {/* Language Selector */}
          <div className="p-4 rounded-xl border border-border/60 bg-background/70 space-y-2">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-primary" />
              {isArabic ? "لغة الواجهة (Language)" : "Interface Language"}
            </span>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  language === "en"
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-muted/60 text-muted-foreground border-border hover:bg-muted"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage("ar")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  language === "ar"
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-muted/60 text-muted-foreground border-border hover:bg-muted"
                }`}
              >
                العربية
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Organization Details Form */}
      <form
        onSubmit={handleSave}
        className="p-6 rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md space-y-5 shadow-sm transition-colors duration-200"
      >
        <h4 className="text-sm font-bold text-foreground">
          {isArabic ? "بيانات المؤسسة والاتصال" : "Organization Profile"}
        </h4>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            {t("settings.companyName")}
          </label>
          <input
            type="text"
            placeholder={isArabic ? "اسم المؤسسة..." : "Company Name..."}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-background border border-border/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            {t("settings.companySlug")}
          </label>
          <input
            type="text"
            placeholder="e.g. acme-corp"
            value={slug}
            disabled
            className="w-full px-3.5 py-2 text-sm bg-muted/60 border border-border/70 rounded-xl text-muted-foreground font-mono text-xs cursor-not-allowed"
          />
          <p className="text-[11px] text-muted-foreground">
            {isArabic
              ? "معرّف ثابت يُدار من قِبل إدارة النظام."
              : "Unique identifier managed by system administrators."}
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            {isArabic ? "البريد الإلكتروني الأساسي للتوظيف" : "Primary Contact Email"}
          </label>
          <input
            type="email"
            placeholder="recruiter@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-background border border-border/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            {isArabic
              ? "رابط استقبال نتائج الـ Webhook (ATS Callback)"
              : "ATS Webhook Callback URL"}
          </label>
          <input
            type="url"
            placeholder="https://your-ats.com/api/webhooks/candidate-result"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-background border border-border/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground font-mono text-xs"
          />
          <p className="text-[11px] text-muted-foreground">
            {isArabic
              ? "سيتم إرسال إشعار فوري (POST) إلى هذا الرابط بمجرد إتمام المرشح للمقابلة وتقييم الذكاء الاصطناعي."
              : "We will send a POST notification here whenever a candidate completes their assessment."}
          </p>
        </div>

        <div className="pt-3 border-t border-border/50 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            {t("settings.save")}
          </button>
        </div>
      </form>
    </div>
  );
}
