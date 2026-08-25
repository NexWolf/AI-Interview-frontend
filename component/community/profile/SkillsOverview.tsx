'use client'
import { Pencil, ArrowRight } from "lucide-react";
import Image from "next/image";

export interface SkillsDataType {
  id: number;
  icon_key: string;
  name: string;
  rate: number;
  status: "weak" | "medium" | "strong" | "good" | "needed";
}

interface SkillOverviewProps {
  skills: SkillsDataType[];
  onEdit?: () => void;
  onViewAll?: () => void;
}

export const SkillOverview = ({ skills, onEdit, onViewAll }: SkillOverviewProps) => {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-800/80 bg-[#0B0F17] p-5 shadow-xl">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-100">Skill Overview</h2>
        <button
          onClick={onEdit}
          className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-slate-100"
          aria-label="Edit Skills"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>

      {/* Skills List */}
      <div className="flex flex-col gap-3.5">
        {skills.map((skill) => (
          <div key={skill.id} className="flex items-center gap-3">
            {/* Icon & Name */}
            <div className="flex w-24 shrink-0 items-center gap-2 sm:w-28">
              {/* ملاحظة: يمكنك استبدال Image بـ SVG أو مكتبة أيقونات بناءً على الـ icon_key */}
              <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-slate-800/50">
                <span className="text-[10px] font-bold text-slate-300">
                  {skill.name.charAt(0)}
                </span>
              </div>
              <span className="truncate text-sm font-medium text-slate-200">
                {skill.name}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800/80 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#8B6B4D] via-[#C6A87D] to-[#E3D3B4] shadow-[0_0_8px_rgba(198,168,125,0.3)] transition-all duration-500"
                style={{ width: `${skill.rate}%` }}
              />
            </div>

            {/* Percentage */}
            <div className="w-8 text-right text-xs font-semibold text-slate-300">
              {skill.rate}%
            </div>

            {/* Status Badge */}
            <div className="flex w-14 shrink-0 items-center justify-center rounded bg-slate-800/40 border border-slate-700/40 py-1 text-[10px] font-medium capitalize text-slate-300">
              {skill.status}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Link */}
      <button
        onClick={onViewAll}
        className="mt-6 flex w-fit items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-slate-200"
      >
        View all skills
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};