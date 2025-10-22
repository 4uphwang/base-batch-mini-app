// import { SafeArea } from "@coinbase/onchainkit/minikit";
import { Viewport } from "next";
import { Inter, Source_Code_Pro, K2D } from "next/font/google";
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
                    {/* <SafeArea>{children}</SafeArea> */}
                    <>{children}</>
                </body>
            </html>
        </RootProvider>
    );
}
