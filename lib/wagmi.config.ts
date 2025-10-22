import { baseSepolia } from "wagmi/chains";
import { createConfig, http } from "wagmi";

export function getConfig() {
    return createConfig({
        chains: [baseSepolia],
        ssr: true,
        transports: {
            [baseSepolia.id]: http(),
        },
    });
}

declare module "wagmi" {
    interface Register {
        config: ReturnType<typeof getConfig>;
    }
}
