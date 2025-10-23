import { baseSepolia } from "viem/chains";
import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { baseAccount, coinbaseWallet, metaMask } from "wagmi/connectors";

import { minikitConfig } from "@/minikit.config";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";

export function getConfig() {
    return createConfig({
        chains: [baseSepolia],
        connectors: [
            farcasterMiniApp(),
            baseAccount({
                appName: minikitConfig.miniapp.name,
                appLogoUrl: minikitConfig.miniapp.iconUrl,
            }),
            coinbaseWallet({
                appName: minikitConfig.miniapp.name,
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
