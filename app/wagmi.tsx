import { baseSepolia } from "viem/chains";
import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { baseAccount, coinbaseWallet, metaMask } from "wagmi/connectors";

import { METADATA } from "@/lib/utils";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";

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
