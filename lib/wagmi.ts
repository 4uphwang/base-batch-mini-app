import { base, baseSepolia } from "viem/chains";
import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { baseAccount, coinbaseWallet, metaMask } from "wagmi/connectors";

import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import { METADATA } from "./utils";

// Use custom env variable for network selection
// NEXT_PUBLIC_USE_TESTNET=true -> Base Sepolia (testnet)
// NEXT_PUBLIC_USE_TESTNET=false or undefined -> Base Mainnet (production)
export const isDevelopment = process.env.NEXT_PUBLIC_USE_TESTNET === "true";
export function getConfig() {
    return createConfig({
        chains: isDevelopment ? [baseSepolia] : [base],
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
            [base.id]: http(),
            [baseSepolia.id]: http(),
        },
    });
}

export const activeChain = isDevelopment ? baseSepolia : base;
