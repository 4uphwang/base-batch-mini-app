export const ROOT_URL =
    process.env.NEXT_PUBLIC_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000");

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
    accountAssociation: {
        header: "eyJmaWQiOjEzODEyODcsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhBMjYxNUUzOTg4NEYyREY2MTA1QjY4Rjk1Mjg5RjQyQzNCQTI1MjA1In0",
        payload: "eyJkb21haW4iOiJiYXNlY2FyZC52ZXJjZWwuYXBwIn0",
        signature:
            "7pE6trAuE5Ldb9sJM9ybnBBUQ5aMTMgKHBJPrTy+mxEx9x8EqaUXzq4eaOWndvDKeqQ+fEKg30EQw9ISADrNGBs=",
    },
    baseBuilder: {
        allowedAddresses: ["0x50EA81351aE397bCC00D8E552698116677811B91"],
    },
    miniapp: {
        version: "1",
        name: "Base Card",
        subtitle: "Builder Identity on Base",
        description:
            "Stop repeating your pitch. Mint your verified, onchain builder profile card (SBT). Search for talent & connect directly.",
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
