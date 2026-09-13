"use client";

import { useState } from "react";
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
} from "lucide-react";
import { useUserInfo } from "@/shared/hook/useUserInfo";
import { AxiosAPI } from "@/shared/lib/AxiosAPI";

export default function SettingPage() {
  const router = useRouter();
  const { data: user } = useUserInfo();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChanging, setIsChanging] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setIsChanging(true);
    try {
      await AxiosAPI.put("/api/v1/auth/update-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      toast.success("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to update password");
    } finally {
      setIsChanging(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmEmail !== user?.email) {
      toast.error("Type your email exactly to confirm deletion.");
      return;
    }
    if (!window.confirm("This will permanently deactivate your account. Continue?")) return;
    setIsDeleting(true);
    try {
      await AxiosAPI.delete("/api/v1/users/me");
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Account deleted.");
      router.push("/auth");
      router.refresh();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account security and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account info */}
        <div className="rounded-2xl border border-border/70 bg-card/70 p-6 space-y-4 h-fit">
          <h2 className="font-bold text-sm flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-primary" />
            Account Information
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{user?.email}</span>
              {user?.isVerified && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              )}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <AtSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Username:</span>
              <span className="font-medium">@{user?.userName}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <ShieldCheck className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Role:</span>
              <span className="font-medium">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="rounded-2xl border border-border/70 bg-card/70 p-6 space-y-4">
          <h2 className="font-bold text-sm flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-primary" />
            Change Password
          </h2>
          <div className="space-y-3">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min 8 chars, upper+lower+digit)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={handleChangePassword}
              disabled={isChanging}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-60"
            >
              {isChanging && <Loader2 className="w-4 h-4 animate-spin" />}
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 space-y-4">
        <h2 className="font-bold text-sm text-rose-400 flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Danger Zone
        </h2>
        <p className="text-xs text-muted-foreground">
          Deleting your account permanently deactivates it and removes access to all interviews,
          reports and profiles. This action cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            placeholder={`Type ${user?.email || "your email"} to confirm`}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-rose-500/30 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30"
          />
          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-2 bg-rose-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-500 transition-colors cursor-pointer disabled:opacity-60"
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
}