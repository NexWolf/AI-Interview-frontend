"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAllSkills, skillsKey, skillsService, DeleteConfirmModal } from "@repo/shared";
import { EMPTY_SKILL_FORM } from "../constants/skills.constants";
import { SkillFormState, SkillToDelete } from "../types/skills.types";
import { filterSkills } from "../utils/skillHelpers";
import { SkillsToolbar } from "./SkillsToolbar";
import { SkillsTable } from "./SkillsTable";
import { SkillFormModal } from "./SkillFormModal";

export function AdminSkillsTab() {
  const { data: skills, isLoading } = useAllSkills();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SkillFormState>(EMPTY_SKILL_FORM);
  const [busy, setBusy] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<SkillToDelete | null>(null);

  const totalSkills = skills?.length ?? 0;
  const activeSkills = skills?.filter((s) => s.isActive).length ?? 0;

  const filteredSkills = useMemo(() => {
    return filterSkills(skills, search);
  }, [skills, search]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: skillsKey.All });

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_SKILL_FORM);
    setFormOpen(true);
  };

  const openEdit = (id: string) => {
    const skill = skills?.find((s) => s.id === id);
    if (!skill) return;
    setEditingId(id);
    setForm({
      nameEn: skill.nameEn || skill.name || "",
      isActive: skill.isActive,
    });
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.nameEn.trim()) {
      toast.error("Skill name is required");
      return;
    }
    setBusy(true);
    try {
      if (editingId) {
        await skillsService.update(editingId, {
          nameEn: form.nameEn.trim(),
        });
        toast.success("Skill updated successfully");
      } else {
        await skillsService.create({
          nameEn: form.nameEn.trim(),
          difficultyLevel: "Beginner",
          descriptionEn: "",
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

  const handleConfirmDelete = async () => {
    if (!skillToDelete) return;
    setBusy(true);
    try {
      await skillsService.delete(skillToDelete.id);
      toast.success("Skill deleted successfully");
      invalidate();
      setSkillToDelete(null);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search, Stats & Add Action */}
      <SkillsToolbar
        search={search}
        onSearchChange={setSearch}
        activeCount={activeSkills}
        totalCount={totalSkills}
        onOpenCreate={openCreate}
      />

      {/* Skills Data Table */}
      <SkillsTable
        skills={filteredSkills}
        isLoading={isLoading}
        busy={busy}
        onToggleActive={handleToggleActive}
        onEdit={openEdit}
        onDelete={setSkillToDelete}
      />

      {/* Create / Edit Modal */}
      <SkillFormModal
        isOpen={formOpen}
        isEditing={!!editingId}
        form={form}
        busy={busy}
        onChange={setForm}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!skillToDelete}
        onClose={() => setSkillToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Skill"
        itemType="skill"
        itemName={skillToDelete?.name}
        isLoading={busy}
      />
    </div>
  );
}
