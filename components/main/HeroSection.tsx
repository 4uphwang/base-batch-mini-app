"use client";

import LandingBG from "@/public/assets/landing-page-backgroud.webp";
import LandingCard from '@/public/assets/landing-page-background-card.webp';
import Image from 'next/image';

interface HeroSectionProps {
    onMintClick: () => void;
}

export default function HeroSection({ onMintClick }: HeroSectionProps) {
    return (
        <div className="relative h-[60vh] overflow-hidden">
            <Image
                src={LandingBG}
                alt="landing-page-background-image"
                className='absolute inset-0 bg-no-repeat responsive-bg object-cover w-full'
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full px-4 sm:px-6 py-4 gap-y-8">
                {/* Title Section */}
                <div className="text-left">
                    <h1
                        className="text-4xl sm:text-6xl md:text-7xl font-k2d-bold text-white mb-2 drop-shadow-lg"
                        style={{
                            letterSpacing: "-0.05em",
                            lineHeight: "0.9",
                        }}
                    >
                        Onchain social
                        <br />
                        business card
                    </h1>
                    <p className="text-l sm:text-2xl font-k2d-medium text-white max-w-2xl drop-shadow-md tracking-normal">
                        Turn your onchain story into
                        <br />
                        opportunity
                    </p>
                </div>

                <div className='h-40 flex justify-center items-center'>
                    <Image
                        src={LandingCard}
                        height={160}
                        alt="landing-page-card"
                        priority
                        className='object-contain z-50'
                    />
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
