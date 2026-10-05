import { useEffect } from "react"

type UseInterviewProtectionProps = {
    isEnabled: boolean,
    onTabSwitch?: () => void,
}

export const useInterviewProtection = ({
    isEnabled,
    onTabSwitch,
}: UseInterviewProtectionProps) => {


    useEffect(() => {
        if (!isEnabled) return;

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        }

        const handleCopyPaste = (e: ClipboardEvent) => {
            e.preventDefault();
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === "F12" || (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")) ||
                (e.ctrlKey && (e.key === "u" || e.key === "U" || e.key === "c" || e.key === "C" || e.key === "v" || e.key === "V"))) 
                e.preventDefault();
            }

            const handleBeforeUnload = (e: BeforeUnloadEvent) => {
                e.preventDefault();
                e.returnValue = "";
            }

            const handleVisibilityChange = () => {
                if (document.hidden && onTabSwitch) {
                    onTabSwitch();
                }
            }

            document.addEventListener("contextmenu", handleContextMenu);
            document.addEventListener("copy", handleCopyPaste);
            document.addEventListener("paste", handleCopyPaste);
            document.addEventListener("cut", handleCopyPaste);
            document.addEventListener("keydown", handleKeyDown);
            window.addEventListener("beforeunload", handleBeforeUnload);
            document.addEventListener("visibilitychange", handleVisibilityChange);

            return () => {
                document.removeEventListener("contextmenu", handleContextMenu);
                document.removeEventListener("copy", handleCopyPaste);
                document.removeEventListener("paste", handleCopyPaste);
                document.removeEventListener("cut", handleCopyPaste);
                document.removeEventListener("keydown", handleKeyDown);
                window.removeEventListener("beforeunload", handleBeforeUnload);
                document.removeEventListener("visibilitychange", handleVisibilityChange);
            };
        
    }, [isEnabled, onTabSwitch])
}