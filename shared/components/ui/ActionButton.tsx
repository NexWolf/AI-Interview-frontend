import { Pencil, Plus } from "lucide-react";

type ActionProps = {
  onAdd ?: () => void;
  onEdit ?: () => void;
};

const ActionButton = ({ onAdd, onEdit }: ActionProps) => {
  return (
    <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
      {onAdd && (
        <button
          onClick={onAdd}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 transition-colors"
          aria-label="Add"
        >
          <Plus className="h-4 w-4" />
        </button>
      )}

      {onEdit && (
        <button
          onClick={onEdit}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 transition-colors"
          aria-label="Edit Bio"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default ActionButton;
