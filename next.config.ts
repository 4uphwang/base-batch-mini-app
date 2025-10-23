import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack: (config) => {
        config.externals.push("pino-pretty", "lokijs", "encoding");

        // Fix MetaMask SDK React Native imports in web environment
        config.resolve.fallback = {
            ...config.resolve.fallback,
            "@react-native-async-storage/async-storage": false,
            "react-native": false,
        };

        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "gateway.pinata.cloud",
                pathname: "/ipfs/**",
            },
            {
                protocol: "https",
                hostname: "*.mypinata.cloud",
            },
            {
                protocol: "https",
                hostname: "ipfs.io",
                pathname: "/ipfs/**",
            },
            {
                protocol: "https",
                hostname: "cloudflare-ipfs.com",
                pathname: "/ipfs/**",
            },
            {
                protocol: "https",
                hostname: "*.ipfs.dweb.link",
            },
        ],
        dangerouslyAllowSVG: true,
        contentDispositionType: "attachment",
        contentSecurityPolicy:
            "default-src 'self'; script-src 'none'; sandbox;",
    },
};

export default nextConfig;
