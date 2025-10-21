"use client";
import { Provider as JotaiProvider } from "jotai";
import { ReactNode } from "react";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { baseSepolia } from "wagmi/chains";

export const isDevelopment = process.env.NODE_ENV === "development";
// export const chain = isDevelopment ? baseSepolia : base;
export const chain = baseSepolia;

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
                    enabled: false,
                    autoConnect: false, // NOTE: for development, we don't want to auto connect to the wallet
                    notificationProxyUrl: undefined,
                }}
            >
                {children}
            </OnchainKitProvider>
        </JotaiProvider>
    );
}
