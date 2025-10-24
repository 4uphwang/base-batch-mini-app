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
        // remotePatterns: [
        //     {
        //         protocol: "https",
        //         hostname: "gateway.pinata.cloud",
        //         pathname: "/ipfs/**",
        //     },
        //     {
        //         protocol: "https",
        //         hostname: "*.mypinata.cloud",
        //     },
        //     {
        //         protocol: "https",
        //         hostname: "ipfs.io",
        //         pathname: "/ipfs/**",
        //     },
        //     {
        //         protocol: "https",
        //         hostname: "cloudflare-ipfs.com",
        //         pathname: "/ipfs/**",
        //     },
        //     {
        //         protocol: "https",
        //         hostname: "*.ipfs.dweb.link",
        //     },
        // ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**', // 모든 HTTPS 도메인 허용
                port: '',
                pathname: '/**',
            },
        ],
        dangerouslyAllowSVG: true,
        contentDispositionType: "attachment",
        contentSecurityPolicy:
            "default-src 'self'; script-src 'none'; sandbox;",
    },
    async redirects() {
        return [
            {
                source: "/.well-known/farcaster.json",
                destination: process.env.FARCASTER_REDIRECT_URL || "",
                permanent: true
            }
        ]
    },
    allowedDevOrigins: [
        '*.ngrok-free.app',
        'https://basecard-git-dev1-4uphwangs-projects.vercel.app/',
    ],
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: "frame-ancestors *"
                    },
                    {
                        key: "X-Frame-Options",
                        value: "SAMEORIGIN"
                    },
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*"
                    }
                ]
            }
        ];
    }
};

export default nextConfig;
