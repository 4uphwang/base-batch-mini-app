"use client";
import { Provider as JotaiProvider } from "jotai";
import { ReactNode, useState } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { baseSepolia } from "viem/chains";
import { getConfig } from "./wagmi";
export const isDevelopment = process.env.NODE_ENV === "development";

export function RootProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <JotaiProvider>
            <WagmiProvider config={getConfig()}>
                <QueryClientProvider client={queryClient}>
                    <OnchainKitProvider
                        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
                        chain={baseSepolia}
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
                </QueryClientProvider>
            </WagmiProvider>
        </JotaiProvider>
    );
}
