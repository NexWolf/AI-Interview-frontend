"use cleint"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react";

 
export function ThemeToggle () {
    const {theme , setTheme} = useTheme();
    const [mounted , setMounted] = useState(false);

    useEffect(() => {
        setMounted(false)
    },[])

    // if(!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light " : "dark")}
            className="p-2 rounded-lg bg-card border border-border"
        >
            {theme === "dark" ? "☀️" :"🌙"}
        </button>
    )
}