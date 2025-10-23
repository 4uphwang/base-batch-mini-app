// import { SafeArea } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "@/minikit.config";
import { SafeArea } from "@coinbase/onchainkit/minikit";
import { Metadata, Viewport } from "next";
import { Inter, K2D, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { RootProvider } from "./rootProvider";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
    variable: "--font-source-code-pro",
    subsets: ["latin"],
});

const k2d = K2D({
    variable: "--font-k2d",
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1.0,
    maximumScale: 1.0,
    minimumScale: 1.0,
    userScalable: false,
};


export const metadata: Metadata = {
    title: minikitConfig.miniapp.name,
    openGraph: {
        title: minikitConfig.miniapp.name,
        description: minikitConfig.miniapp.description,
        images: [minikitConfig.miniapp.imageUrl],
        url: minikitConfig.miniapp.homeUrl,
        siteName: minikitConfig.miniapp.name
    },
};


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <RootProvider>
            <html lang="en">
                <body
                    className={`${inter.variable} ${sourceCodePro.variable} ${k2d.variable}`}
                >
                    <SafeArea>{children}</SafeArea>
                </body>
            </html>
        </RootProvider>
    );
}
