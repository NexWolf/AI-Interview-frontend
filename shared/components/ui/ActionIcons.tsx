import { Pencil, Plus } from "lucide-react"

type ActionProps = {
    onAdd ?: () => void;
    onEdit ?: () => void;
}

export const ActionIcons = ({onAdd , onEdit} : ActionProps) => {
    return(
        <div className="flex items-center gap-2">
          {onAdd && (
            <button
              type="button"
              className="bg-gray-500 hover:bg-green-500 hover:scale-105 transform duration-300 w-7 h-7 rounded-full text-white flex items-center justify-center cursor-pointer"
            >
              <Plus width={20} />
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              className="bg-gray-500 hover:bg-blue-500 hover:scale-105 transform duration-300 w-7 h-7 rounded-full text-white flex items-center justify-center cursor-pointer"
            >
              <Pencil width={15} />
            </button>
          )}
        </div>
    )
    
}

export default ActionIcons;