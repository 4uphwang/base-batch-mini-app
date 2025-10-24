"use client";

import { Provider as JotaiProvider } from "jotai";
import { ReactNode } from "react";

export default function JotaiClientProvider({ children }: { children: ReactNode }) {
    return <JotaiProvider>{children}</JotaiProvider>;
}