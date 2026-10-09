"use client";

import { Pencil, Trash2, Power } from "lucide-react";
import { SkillOption, cn } from "@repo/shared";
import { SkillToDelete } from "../types/skills.types";
import { getSkillStatusBadgeClass } from "../utils/skillHelpers";

interface SkillTableRowProps {
  skill: SkillOption;
  busy: boolean;
  onToggleActive: (id: string, current: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (target: SkillToDelete) => void;
}

export function SkillTableRow({
  skill,
  busy,
  onToggleActive,
  onEdit,
  onDelete,
}: SkillTableRowProps) {
  const displayName = skill.nameEn || skill.name;

  return (
    <tr className="hover:bg-muted/30 transition-colors">
      <td className="px-5 py-4">
        <div className="font-semibold text-foreground text-sm">{displayName}</div>
      </td>

      <td className="px-5 py-4">
        <span
          className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5",
            getSkillStatusBadgeClass(skill.isActive),
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {skill.isActive ? "Active" : "Inactive"}
        </span>
      </td>

      <td className="px-5 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onToggleActive(skill.id, skill.isActive)}
            disabled={busy}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer disabled:opacity-50"
            title={skill.isActive ? "Deactivate" : "Activate"}
          >
            <Power className="w-4 h-4" />
          </button>

          <button
            onClick={() => onEdit(skill.id)}
            disabled={busy}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer disabled:opacity-50"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete({ id: skill.id, name: displayName })}
            disabled={busy}
            className="p-2 rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
            title="Delete skill"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
