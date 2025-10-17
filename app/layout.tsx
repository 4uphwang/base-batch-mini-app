import { SafeArea } from "@coinbase/onchainkit/minikit";
import { Viewport } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
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

export const viewport: Viewport = {
    width: 'device-width',
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
                <body className={`${inter.variable} ${sourceCodePro.variable}`}>
                    <SafeArea>{children}</SafeArea>
                </body>
            </html>
        </RootProvider>
    );
}
