"use client";

import { useMemo, useState } from "react";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Search,
  Power,
  Layers,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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

export function AdminSkillsTab() {
  const { data: skills, isLoading } = useAllSkills();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const totalSkills = skills?.length ?? 0;
  const activeSkills = skills?.filter((s) => s.isActive).length ?? 0;

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

  const invalidate = () => queryClient.invalidateQueries({ queryKey: skillsKey.All });

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
      toast.success("Skill deleted");
      invalidate();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search skills by name (En/Ar)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-background/80 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Active: <strong className="text-foreground">{activeSkills}</strong> / {totalSkills}
          </span>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {/* Skills Table */}
      <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/40">
              <tr>
                <th className="px-5 py-3.5">Name (EN / AR)</th>
                <th className="px-5 py-3.5">Level</th>
                <th className="px-5 py-3.5">Description</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground text-sm">
                    Loading skills catalog...
                  </td>
                </tr>
              ) : filteredSkills.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground text-sm">
                    No skills found.
                  </td>
                </tr>
              ) : (
                filteredSkills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-foreground text-sm">{skill.nameEn}</div>
                      <div className="text-xs text-muted-foreground font-arabic" dir="rtl">
                        {skill.nameAr}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-md text-xs font-medium border",
                          difficultyColors[skill.difficultyLevel] || "bg-muted text-muted-foreground",
                        )}
                      >
                        {skill.difficultyLevel}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-xs text-muted-foreground max-w-sm truncate">
                        {skill.descriptionEn || "—"}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5",
                          skill.isActive
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-muted text-muted-foreground border-border/50",
                        )}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {skill.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleActive(skill.id, skill.isActive)}
                          disabled={busy}
                          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                          title={skill.isActive ? "Deactivate" : "Activate"}
                        >
                          <Power className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => openEdit(skill.id)}
                          disabled={busy}
                          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(skill.id)}
                          disabled={busy}
                          className={cn(
                            "p-2 rounded-xl transition-colors cursor-pointer",
                            confirmDeleteId === skill.id
                              ? "bg-rose-500 text-white animate-pulse"
                              : "text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10",
                          )}
                          title={confirmDeleteId === skill.id ? "Click to confirm delete" : "Delete"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Skill Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-50">
          <div className="w-full max-w-lg p-6 rounded-2xl border border-border bg-card shadow-xl space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {editingId ? "Edit Skill" : "Create New Skill"}
            </h3>

            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Name (English)</label>
                  <input
                    type="text"
                    value={form.nameEn}
                    onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                    className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-xl text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Name (Arabic)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={form.nameAr}
                    onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                    className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-xl text-foreground font-arabic"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Difficulty Level</label>
                <select
                  value={form.difficultyLevel}
                  onChange={(e) => setForm({ ...form, difficultyLevel: e.target.value as DifficultyLevelType })}
                  className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-xl text-foreground cursor-pointer"
                >
                  {difficultyOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Description (English)</label>
                <textarea
                  rows={2}
                  value={form.descriptionEn}
                  onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                  className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-xl text-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Description (Arabic)</label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={form.descriptionAr}
                  onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
                  className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-xl text-foreground font-arabic"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {busy ? "Saving..." : editingId ? "Update Skill" : "Create Skill"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
