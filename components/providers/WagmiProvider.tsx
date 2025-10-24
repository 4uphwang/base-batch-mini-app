"use client";

import { activeChain, getConfig } from "@/lib/wagmi";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { NetworkChecker } from "../common/NetworkChecker";

const queryClient = new QueryClient();

export default function Provider({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={getConfig()}>
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
