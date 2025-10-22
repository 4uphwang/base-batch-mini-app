import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { baseSepolia } from "viem/chains";
import { baseAccount, coinbaseWallet, metaMask } from "wagmi/connectors";

import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import { METADATA } from "@/lib/metadata";

export function getConfig() {
    return createConfig({
        chains: [baseSepolia],
        connectors: [
            farcasterMiniApp(),
            baseAccount({
                appName: METADATA.name,
                appLogoUrl: METADATA.iconImageUrl,
            }),
            coinbaseWallet({
                appName: METADATA.name,
                preference: "smartWalletOnly",
                version: "4",
            }),
            metaMask(), // Add additional connectors
        ],
        storage: createStorage({
            storage: cookieStorage,
        }),
        ssr: true,
        transports: {
            [baseSepolia.id]: http(),
        },
    });
}
