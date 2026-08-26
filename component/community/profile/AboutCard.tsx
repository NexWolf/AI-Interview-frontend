import { Pencil } from 'lucide-react';

interface AboutCardProps {
  bio?: string;
  onEdit?: () => void;
}

export default function AboutCard({ bio, onEdit }: AboutCardProps) {
  return (
    <div className="w-full max-w-2xl rounded-xl border border-slate-800 bg-[#0d1117] p-5 shadow-lg text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-slate-100">About Me</h3>
        <button
          onClick={onEdit}
          aria-label="Edit bio"
          className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 rounded-lg transition-colors"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <p className="text-sm leading-relaxed text-slate-400 font-normal">
        {bio || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. First do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
      </p>
    </div>
  );
}