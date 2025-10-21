"use client";

import Image from "next/image";

interface HeroSectionProps {
    onMintClick: () => void;
}

export default function HeroSection({ onMintClick }: HeroSectionProps) {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Main Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/assets/landing-page-background.png"
                    alt="BaseCard Landing Background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-20">
                {/* Title Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-k2d-bold text-white mb-6 leading-tight drop-shadow-lg">
                        Onchain social
                        <br />
                        business card
                    </h1>
                    <p className="text-xl sm:text-2xl font-k2d-medium text-white max-w-2xl mx-auto drop-shadow-md">
                        Turn your onchain story into opportunity
                    </p>
                </div>

                {/* Mint Button */}
                <button
                    onClick={onMintClick}
                    className="w-full max-w-md py-4 bg-gray-900 hover:bg-gray-800 active:bg-black text-white font-k2d-semibold rounded-xl transition-all duration-300 shadow-xl text-lg transform hover:scale-105 active:scale-95"
                >
                    Mint Your Card
                </button>
            </div>
        </div>
    );
}
