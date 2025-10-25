"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { WagmiProvider } from "wagmi";

import { activeChain, getConfig } from "@/lib/wagmi";

import { NetworkChecker } from "../common/NetworkChecker";

const wagmiConfig = getConfig();

export default function Provider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <WagmiProvider config={wagmiConfig}>
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
                    autoConnect: true,
                    notificationProxyUrl: undefined,
                }}
            >
                <NetworkChecker />
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </OnchainKitProvider>
        </WagmiProvider>
    );
}
