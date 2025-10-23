export const ROOT_URL =
    process.env.NEXT_PUBLIC_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000");

const ACCOUNT_HEADER = process.env.FARCASTER_HEADER || "";
const ACCOUNT_PAYLOAD = process.env.FARCASTER_PAYLOAD || "";
const ACCOUNT_SIGNATURE = process.env.FARCASTER_SIGNATURE || "";
const ALLOWED_ADDRESSES_STRING = process.env.ALLOWED_BUILDER_ADDRESSES || "";

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
    accountAssociation: {
        header: ACCOUNT_HEADER,
        payload: ACCOUNT_PAYLOAD,
        signature: ACCOUNT_SIGNATURE,
    },
    baseBuilder: {
        allowedAddresses: [ALLOWED_ADDRESSES_STRING],
    },
    miniapp: {
        version: "1",
        name: "Base Card",
        subtitle: "Builder Identity on Base",
        description:
            "Stop repeating your pitch. Mint your verified, onchain builder profile card (SBT). Search for talent and connect directly.",
        screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
        iconUrl: `${ROOT_URL}/bc-icon.png`,
        splashImageUrl: `${ROOT_URL}/bc-icon.png`,
        splashBackgroundColor: "#000000",
        homeUrl: ROOT_URL,
        webhookUrl: `${ROOT_URL}/api/webhook`,
        primaryCategory: "social",
        tags: ["onchain-identity", "builder", "networking", "sbt", "base"],
        heroImageUrl: `${ROOT_URL}/blue-hero.png`,
        tagline: "",
        ogTitle: "",
        ogDescription: "",
        ogImageUrl: `${ROOT_URL}/blue-hero.png`,
    },
} as const;
