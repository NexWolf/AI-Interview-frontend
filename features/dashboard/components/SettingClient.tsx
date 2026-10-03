"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  KeyRound,
  Loader2,
  ShieldCheck,
  Trash2,
  User as UserIcon,
  Mail,
  AtSign,
  CheckCircle2,
  Sun,
  Moon,
  Laptop,
  Globe,
  Palette,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/shared/context/LanguageContext";
import { useUserInfo } from "@/shared/hook/useUserInfo";
import { AxiosAPI, clearCachedAccessToken } from "@/shared/lib/AxiosAPI";
import { cn } from "@/shared/lib/utils";

export default function SettingClient() {
  const router = useRouter();
  const { data: user } = useUserInfo();
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChanging, setIsChanging] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(language === "ar" ? "يرجى تعبئة كافة حقول كلمة المرور" : "Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(language === "ar" ? "كلمة المرور الجديدة وتأكيدها غير متطابقين" : "New password and confirmation do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error(language === "ar" ? "يجب أن تكون كلمة المرور 8 خانات على الأقل" : "Password must be at least 8 characters");
      return;
    }
    setIsChanging(true);
    try {
      await AxiosAPI.put("/api/v1/auth/update-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      toast.success(language === "ar" ? "تم تحديث كلمة المرور بنجاح." : "Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || (language === "ar" ? "فشل تحديث كلمة المرور" : "Failed to update password"));
    } finally {
      setIsChanging(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmEmail !== user?.email) {
      toast.error(language === "ar" ? "اكتب بريدك الإلكتروني تماماً لتأكيد الحذف" : "Type your email exactly to confirm deletion.");
      return;
    }
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setConfirmDelete(false);
    setIsDeleting(true);
    try {
      await AxiosAPI.delete("/api/v1/users/me");
      await fetch("/api/auth/logout", { method: "POST" });
      clearCachedAccessToken();
      toast.success(language === "ar" ? "تم حذف الحساب." : "Account deleted.");
      router.push("/auth");
      router.refresh();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || (language === "ar" ? "فشل حذف الحساب" : "Failed to delete account"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("settings.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("settings.subtitle")}
        </p>
      </div>

      {/* Appearance & Language Card */}
      <div className="rounded-2xl border border-border/70 bg-card/70 p-6 space-y-6">
        <div>
          <h2 className="font-bold text-base flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            {t("settings.appearance.title")}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {t("settings.appearance.desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Theme Selector */}
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
                {t("settings.appearance.theme")}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("settings.appearance.themeDesc")}
              </p>
            </div>

            {mounted ? (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "light", label: t("common.light"), icon: Sun },
                  { id: "dark", label: t("common.dark"), icon: Moon },
                  { id: "system", label: t("common.system"), icon: Laptop },
                ].map(({ id, label, icon: Icon }) => {
                  const isActive = theme === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setTheme(id)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer select-none",
                        isActive
                          ? "border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary/30"
                          : "border-border/70 bg-background/60 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      )}
                    >
                      <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="h-16 rounded-xl bg-muted/40 animate-pulse" />
            )}
          </div>

          {/* Language Selector */}
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-primary" />
                {t("settings.appearance.lang")}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("settings.appearance.langDesc")}
              </p>
            </div>

            {mounted ? (
              <div className="grid grid-cols-2 gap-2">
                {[
                  { code: "en" as const, title: "English", subtitle: "English (US)" },
                  { code: "ar" as const, title: "العربية", subtitle: "Arabic" },
                ].map(({ code, title, subtitle }) => {
                  const isActive = language === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setLanguage(code)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1 p-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer select-none",
                        isActive
                          ? "border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary/30"
                          : "border-border/70 bg-background/60 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      )}
                    >
                      <span className="text-sm font-bold">{title}</span>
                      <span className="text-[10px] text-muted-foreground">{subtitle}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="h-16 rounded-xl bg-muted/40 animate-pulse" />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account info */}
        <div className="rounded-2xl border border-border/70 bg-card/70 p-6 space-y-4 h-fit">
          <h2 className="font-bold text-sm flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-primary" />
            {t("settings.accountInfo")}
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {language === "ar" ? "البريد الإلكتروني:" : "Email:"}
              </span>
              <span className="font-medium">{user?.email}</span>
              {user?.isVerified && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              )}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <AtSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {language === "ar" ? "اسم المستخدم:" : "Username:"}
              </span>
              <span className="font-medium">@{user?.userName}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <ShieldCheck className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {language === "ar" ? "الدور / الصلاحية:" : "Role:"}
              </span>
              <span className="font-medium">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="rounded-2xl border border-border/70 bg-card/70 p-6 space-y-4">
          <h2 className="font-bold text-sm flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-primary" />
            {t("settings.password.title")}
          </h2>
          <div className="space-y-3">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder={t("settings.password.current")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t("settings.password.new")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t("settings.password.confirm")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={handleChangePassword}
              disabled={isChanging}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-60"
            >
              {isChanging && <Loader2 className="w-4 h-4 animate-spin" />}
              {isChanging ? t("settings.password.updating") : t("settings.password.update")}
            </button>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 space-y-4">
        <h2 className="font-bold text-sm text-rose-400 flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          {t("settings.delete.title")}
        </h2>
        <p className="text-xs text-muted-foreground">
          {t("settings.delete.desc")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            placeholder={
              language === "ar"
                ? `اكتب ${user?.email || "بريدك الإلكتروني"} للتأكيد`
                : `Type ${user?.email || "your email"} to confirm`
            }
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-rose-500/30 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30"
          />
          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className={cn(
              "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60",
              confirmDelete
                ? "bg-rose-600 text-white hover:bg-rose-500"
                : "bg-rose-600/10 text-rose-500 border border-rose-500/30 hover:bg-rose-600 hover:text-white",
            )}
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmDelete ? t("settings.delete.confirm") : t("settings.delete.btn")}
          </button>
        </div>
      </div>
    </div>
  );
}
