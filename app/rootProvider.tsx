"use client";

import { ReactNode } from "react";

import { NetworkChecker } from "@/components/common/NetworkChecker";
import ErudaProvider from "@/components/providers/ErudaProvider";
import { JotaiClientProvider } from "@/components/providers/JotaiProvider";
import Provider from "@/components/providers/WagmiProvider";
import { activeChain, isDevelopment } from "@/lib/wagmi";
import { OnchainKitProvider } from "@coinbase/onchainkit";

export function RootProvider({ children }: { children: ReactNode }) {

    return (
        <JotaiClientProvider>
            <ErudaProvider />
            <Provider>
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
                    {children}
                </OnchainKitProvider>
            </Provider>
        </JotaiClientProvider >
    );
}

export { isDevelopment };
