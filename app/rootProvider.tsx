"use client";
import { Provider as JotaiProvider } from "jotai";
import { ReactNode, useState } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { activeChain, getConfig, isDevelopment } from "@/lib/wagmi";
import { NetworkChecker } from "@/components/common/NetworkChecker";

export function RootProvider({ children }: { children: ReactNode }) {
    const [config] = useState(() => getConfig());
    const [queryClient] = useState(() => new QueryClient());

    return (
        <JotaiProvider>
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <OnchainKitProvider
                        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
                        chain={activeChain}
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
                            autoConnect: false, // NOTE: for development, we don't want to auto connect to the wallet
                            notificationProxyUrl: undefined,
                        }}
                    >
                        <NetworkChecker />
                        {children}
                    </OnchainKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </JotaiProvider>
    );
}

export { isDevelopment };
