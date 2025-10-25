"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { generateCardShareQRCode } from "@/lib/qrCodeGenerator";
import { useMyCard } from "@/hooks/useMyCard";
import { useAccount } from "wagmi";

interface CardShareFloatingProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function CardShareFloating({
    isVisible,
    onClose,
}: CardShareFloatingProps) {
    const { address } = useAccount();
    const { data: card } = useMyCard(address);
    const [qrCodeDataURL, setQrCodeDataURL] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    // IPFS Gateway URL
    const getIPFSUrl = (cid: string) => {
        if (!cid) return "/assets/default-profile.png";
        return `https://ipfs.io/ipfs/${cid.replace("ipfs://", "")}`;
    };

    const generateQRCode = useCallback(async () => {
        if (!card) return;

        setIsLoading(true);
        try {
            const qrCode = await generateCardShareQRCode(
                card.id.toString(),
                card.nickname,
                {
                    width: 200,
                    margin: 2,
                    color: {
                        dark: "#000000",
                        light: "#FFFFFF",
                    },
                }
            );
            setQrCodeDataURL(qrCode);
            // console.log("qrCodeDataURL", qrCodeDataURL);
        } catch (error) {
            console.error("Failed to generate QR code:", error);
        } finally {
            setIsLoading(false);
        }
    }, [card]);

    useEffect(() => {
        if (isVisible && card) {
            generateQRCode();
        }
    }, [isVisible, card, generateQRCode]);

    if (!isVisible || !card) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Floating Card */}
            <div
                className="relative w-80 h-[32rem] bg-[#0050FF] rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-white hover:bg-gray-100 rounded-full transition-colors shadow-lg"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Profile Image - Square with rounded corners */}
                <div className="top-6 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-white shadow-xl">
                        <Image
                            src={card.profileImage || getIPFSUrl(card.imageURI)}
                            alt={`${card.nickname}'s profile`}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Logo and Name Section */}
                <div className="top-28 left-1/2 transform -translate-x-1/2 text-center">
                    {/* Simple B Logo */}
                    <div className="flex items-center justify-center mb-3">
                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center shadow-lg mr-3">
                            <span className="text-[#0050FF] text-lg font-bold">
                                B
                            </span>
                        </div>
                        <span className="text-white text-xl font-bold">
                            BaseCard
                        </span>
                    </div>

                    {/* Role */}
                    <div className="text-white/90 text-sm font-medium">
                        {card.role || "Developer"}
                    </div>
                </div>

                {/* QR Code Section - Stylized */}
                <div className="bottom-8 left-1/2 transform -translate-x-1/2">
                    {isLoading ? (
                        <div className="w-40 h-40 bg-white/20 rounded-xl flex items-center justify-center">
                            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"></div>
                        </div>
                    ) : qrCodeDataURL ? (
                        <div className="w-40 h-40 bg-white rounded-xl p-4 shadow-lg">
                            <Image
                                src={qrCodeDataURL}
                                alt="QR Code for sharing"
                                width={160}
                                height={160}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    ) : (
                        <div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center">
                            {/* Stylized QR Code Placeholder */}
                            <div className="grid grid-cols-2 gap-2 w-24 h-24">
                                <div className="bg-black rounded-sm"></div>
                                <div className="bg-black rounded-sm"></div>
                                <div className="bg-black rounded-sm"></div>
                                <div className="bg-black rounded-sm flex items-center justify-center">
                                    <div className="text-white text-xs font-bold">
                                        5
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
