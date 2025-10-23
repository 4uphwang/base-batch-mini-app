"use client";

import { Provider as JotaiProvider } from "jotai";
import { ReactNode } from "react";

export function JotaiClientProvider({ children }: { children: ReactNode }) {
    return <JotaiProvider>{children}</JotaiProvider>;
}