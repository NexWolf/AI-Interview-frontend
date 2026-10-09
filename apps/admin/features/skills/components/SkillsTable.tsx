"use client";

import { Loader2 } from "lucide-react";
import { SkillOption } from "@repo/shared";
import { SkillToDelete } from "../types/skills.types";
import { SkillTableRow } from "./SkillTableRow";

interface SkillsTableProps {
  skills: SkillOption[];
  isLoading: boolean;
  busy: boolean;
  onToggleActive: (id: string, current: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (target: SkillToDelete) => void;
}

export function SkillsTable({
  skills,
  isLoading,
  busy,
  onToggleActive,
  onEdit,
  onDelete,
}: SkillsTableProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/40">
            <tr>
              <th className="px-5 py-3.5">Skill Name</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="px-5 py-12 text-center text-muted-foreground text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span>Loading skills catalog...</span>
                  </div>
                </td>
              </tr>
            ) : skills.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-12 text-center text-muted-foreground text-sm">
                  No skills found.
                </td>
              </tr>
            ) : (
              skills.map((skill) => (
                <SkillTableRow
                  key={skill.id}
                  skill={skill}
                  busy={busy}
                  onToggleActive={onToggleActive}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
