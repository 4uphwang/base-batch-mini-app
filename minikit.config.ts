const ROOT_URL =
    process.env.NEXT_PUBLIC_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
    accountAssociation: {
        "header": "eyJmaWQiOjEzODEyODcsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhBMjYxNUUzOTg4NEYyREY2MTA1QjY4Rjk1Mjg5RjQyQzNCQTI1MjA1In0",
        "payload": "eyJkb21haW4iOiJiYXNlLWJhdGNoLW1pbmktYXBwLnZlcmNlbC5hcHAifQ",
        "signature": "rXzUB4O8ABseLVyAcy2jbe/suEtNLl8JPo0mdMc0U5VoQDrJR3uGKIa7di51AFSfkwMERdCpCiROcgU0ZWTizRs="
    },
    baseBuilder: {
        allowedAddresses: ["0x50EA81351aE397bCC00D8E552698116677811B91"]
    },
    miniapp: {
        version: "1",
        name: "Cubey",
        subtitle: "Your AI Ad Companion",
        description: "Ads",
        screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
        iconUrl: `${ROOT_URL}/blue-icon.png`,
        splashImageUrl: `${ROOT_URL}/blue-hero.png`,
        splashBackgroundColor: "#000000",
        homeUrl: ROOT_URL,
        webhookUrl: `${ROOT_URL}/api/webhook`,
        primaryCategory: "social",
        tags: ["marketing", "ads", "quickstart", "waitlist"],
        heroImageUrl: `${ROOT_URL}/blue-hero.png`,
        tagline: "",
        ogTitle: "",
        ogDescription: "",
        ogImageUrl: `${ROOT_URL}/blue-hero.png`,
    },
} as const;

