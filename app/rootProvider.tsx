"use client";

import { ReactNode } from "react";

import ErudaProvider from "@/components/providers/ErudaProvider";
import JotaiClientProvider from "@/components/providers/JotaiProvider";
import UIThemeProvider from "@/components/providers/UIProvider";
import Provider from "@/components/providers/WagmiProvider";

import { isDevelopment } from "@/lib/wagmi";

export function RootProvider({ children }: { children: ReactNode }) {

    return (
        <>
            <ErudaProvider />
            <JotaiClientProvider>
                <UIThemeProvider>
                    <Provider>
                        {children}
                    </Provider>
                </UIThemeProvider>
            </JotaiClientProvider >
        </>
    );
}

export { isDevelopment };
