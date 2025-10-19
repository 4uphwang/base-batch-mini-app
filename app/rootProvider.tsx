"use client";
import { Provider as JotaiProvider } from 'jotai';
import { ReactNode } from "react";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base, baseSepolia } from "wagmi/chains";

export const isDevelopment = process.env.NODE_ENV === 'development';
export const chain = isDevelopment ? baseSepolia : base;

export function RootProvider({ children }: { children: ReactNode }) {
    return (
        <JotaiProvider>
            <OnchainKitProvider
                apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
                chain={chain}
                config={{
                    appearance: {
                        mode: "auto",
                    },
                    wallet: {
                        display: "modal",
                        preference: "all",
                    },
                }}
                miniKit={{
                    enabled: true,
                    autoConnect: true,
                    notificationProxyUrl: undefined,
                }}
            >
                {children}
            </OnchainKitProvider>
        </JotaiProvider>
    );
}
