"use client"

import {ThemeProvider as NextThemesProvider} from "next-themes";
import { ComponentProps } from "react";

type themeProviderProps = ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({children , ...props} : themeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}