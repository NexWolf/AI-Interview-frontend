import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export const LoadingIcon = ({ className }: { className?: string }) => {
  return <Loader2 className={cn("w-4 h-4 animate-spin", className)} />;
};

export default LoadingIcon;
