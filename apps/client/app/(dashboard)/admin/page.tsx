"use client";

import { useMemo, useState } from "react";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Search,
  ShieldAlert,
  AlertTriangle,
  Check,
  X,
  Power,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUserInfo } from "@/shared/hook/useUserInfo";
import { useAllSkills } from "@/shared/hook/useAllSkills";
import { skillsKey } from "@/shared/constants/query-key";
import { skillsService } from "@/shared/services/skills.service";
import { DifficultyLevelType } from "@/shared/types/allSkills";
import { cn } from "@/shared/lib/utils";

const difficultyOptions: DifficultyLevelType[] = ["Beginner", "Intermediate", "Advanced"];

const difficultyColors: Record<DifficultyLevelType, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Advanced: "bg-rose-500/10 text-rose-400 border-rose-500/30",
};

const emptyForm = {
  nameEn: "",
  nameAr: "",
  difficultyLevel: "Beginner" as DifficultyLevelType,
  descriptionEn: "",
  descriptionAr: "",
  isActive: true,
};

export default function AdminPage() {
  const { data: user, isLoading: userLoading } = useUserInfo();
  const { data: skills, isLoading: skillsLoading } = useAllSkills();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const totalSkills = skills?.length ?? 0;
  const activeSkills = skills?.filter((s) => s.isActive).length ?? 0;
  const inactiveSkills = totalSkills - activeSkills;

  const filteredSkills = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return skills ?? [];
    return (skills ?? []).filter(
      (s) =>
        s.nameEn?.toLowerCase().includes(q) ||
        s.nameAr?.toLowerCase().includes(q) ||
        s.difficultyLevel?.toLowerCase().includes(q),
    );
  }, [skills, search]);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: skillsKey.All });

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (id: string) => {
    const skill = skills?.find((s) => s.id === id);
    if (!skill) return;
    setEditingId(id);
    setForm({
      nameEn: skill.nameEn ?? "",
      nameAr: skill.nameAr ?? "",
      difficultyLevel: skill.difficultyLevel,
      descriptionEn: skill.descriptionEn ?? "",
      descriptionAr: skill.descriptionAr ?? "",
      isActive: skill.isActive,
    });
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.nameEn.trim() || !form.nameAr.trim()) {
      toast.error("English and Arabic names are required");
      return;
    }
    setBusy(true);
    try {
      if (editingId) {
        await skillsService.update(editingId, {
          nameEn: form.nameEn.trim(),
          nameAr: form.nameAr.trim(),
          difficultyLevel: form.difficultyLevel,
          descriptionEn: form.descriptionEn.trim(),
          descriptionAr: form.descriptionAr.trim(),
        });
        toast.success("Skill updated successfully");
      } else {
        await skillsService.create({
          nameEn: form.nameEn.trim(),
          nameAr: form.nameAr.trim(),
          difficultyLevel: form.difficultyLevel,
          descriptionEn: form.descriptionEn.trim(),
          descriptionAr: form.descriptionAr.trim(),
        });
        toast.success("Skill created successfully");
      }
      setFormOpen(false);
      invalidate();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Operation failed");
    } finally {
      setBusy(false);
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    setBusy(true);
    try {
      await skillsService.update(id, { isActive: !current } as never);
      toast.success(current ? "Skill deactivated" : "Skill activated");
      invalidate();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Action failed");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }
    setConfirmDeleteId(null);
    setBusy(true);
    try {
      await skillsService.delete(id);
      toast.success("Skill deactivated");
      invalidate();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center py-32 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-20 rounded-2xl border border-border bg-card/60 p-8 text-center">
        <ShieldAlert className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h1 className="text-lg font-bold">Access Denied</h1>
        <p className="text-sm text-muted-foreground mt-2">
          You need an ADMIN role to manage the skills bank.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Skills Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Maintain the skills bank used to power AI interviews.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Skill
        </button>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Skills", value: totalSkills, dot: "bg-primary" },
          { label: "Active", value: activeSkills, dot: "bg-emerald-500" },
          { label: "Inactive", value: inactiveSkills, dot: "bg-muted" },
        ].map(({ label, value, dot }) => (
          <div
            key={label}
            className="rounded-2xl border border-border/70 bg-card/70 p-4 flex items-center justify-between"
          >
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <div className="flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full", dot)} />
              <span className="text-xl font-bold">{value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or level..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Skill list */}
      {skillsLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-10">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading skills...
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="py-16 text-center space-y-2">
          <AlertTriangle className="w-8 h-8 text-muted-foreground/50 mx-auto" />
          <p className="text-sm text-muted-foreground">No skills found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className={cn(
                "rounded-2xl border p-5 space-y-3 transition-colors bg-card/60",
                skill.isActive ? "border-border/70" : "border-border/50 opacity-60",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{skill.nameEn}</p>
                  <p className="text-xs text-muted-foreground truncate" dir="rtl">
                    {skill.nameAr}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-[10px] px-2.5 py-0.5 rounded-full border font-semibold shrink-0",
                    difficultyColors[skill.difficultyLevel] || "bg-muted text-muted-foreground border-border",
                  )}
                >
                  {skill.difficultyLevel}
                </span>
              </div>

              {skill.descriptionEn && (
                <p className="text-xs text-muted-foreground line-clamp-2">{skill.descriptionEn}</p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Power className={cn("w-3.5 h-3.5", skill.isActive ? "text-emerald-500" : "text-muted-foreground")} />
                  {skill.isActive ? "Active" : "Inactive"}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleActive(skill.id, skill.isActive)}
                    disabled={busy}
                    title={skill.isActive ? "Deactivate" : "Activate"}
                    className="p-2 rounded-lg text-muted-foreground hover:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Power className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEdit(skill.id)}
                    disabled={busy}
                    className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    disabled={busy}
                    className={cn(
                      "p-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50",
                      confirmDeleteId === skill.id
                        ? "bg-rose-600 text-white hover:bg-rose-500"
                        : "text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10",
                    )}
                    title={confirmDeleteId === skill.id ? "Click again to confirm" : "Deactivate"}
                  >
                    {confirmDeleteId === skill.id ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">{editingId ? "Edit Skill" : "Create Skill"}</h2>
              <button
                onClick={() => setFormOpen(false)}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">English Name *</label>
                  <input
                    value={form.nameEn}
                    onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                    placeholder="Ex: JavaScript"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Arabic Name *</label>
                  <input
                    value={form.nameAr}
                    onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                    placeholder="مثال: جافا سكريبت"
                    dir="rtl"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Difficulty Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {difficultyOptions.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setForm({ ...form, difficultyLevel: level })}
                      className={cn(
                        "px-3 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer",
                        form.difficultyLevel === level
                          ? "bg-primary/10 text-primary border-primary/40"
                          : "border-border text-muted-foreground hover:border-border",
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">English Description</label>
                  <textarea
                    value={form.descriptionEn}
                    onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Arabic Description</label>
                  <textarea
                    value={form.descriptionAr}
                    onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
                    rows={3}
                    dir="rtl"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setFormOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted/60 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={busy}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-60"
              >
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? "Save Changes" : "Create Skill"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}