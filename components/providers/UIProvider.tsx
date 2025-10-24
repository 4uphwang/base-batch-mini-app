"use client";

import { ReactNode } from "react";

import { ThemeProvider } from "@material-tailwind/react";

export default function UIThemeProvider({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            {children}
        </ThemeProvider>
    );
}