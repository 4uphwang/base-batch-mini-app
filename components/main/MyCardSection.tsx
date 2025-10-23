"use client";

import { useAccount } from "wagmi";
import { useMyCard } from "@/hooks/useMyCard";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function MyCardSection() {
    const router = useRouter();
    const { address } = useAccount();
    const { data: card, isLoading, error } = useMyCard(address);

    // IPFS Gateway URL
    const getIPFSUrl = (cid: string) => {
        if (!cid) return "/assets/default-profile.png";
        return `https://ipfs.io/ipfs/${cid}`;
    };

    const handleMyCardClick = () => {
        router.push("/mycard");
    };

    const handleShareClick = () => {
        if (card) {
            // TODO: Implement share functionality
            console.log("Share card:", card);
        }
    };

    return (
        <div className="relative min-h-[60vh] sm:min-h-[65vh] md:min-h-[70vh] w-full px-4 sm:px-6 md:px-8 flex flex-col justify-center items-center py-3 sm:py-4 gap-4 sm:gap-6">
            {/* Title Section */}
            <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-k2d-bold text-left"
                style={{
                    letterSpacing: "-0.05em",
                    lineHeight: "0.9",
                }}
            >
                Onchain social
                <br />
                Business Card
            </h1>

            {/* Card Image Section - Takes up remaining space */}
            <div className="w-full max-w-4xl min-h-[300px] sm:min-h-[350px] md:min-h-[400px] rounded-2xl sm:rounded-3xl border-2 border-gray-300 overflow-hidden relative shadow-xl">
                {isLoading ? (
                    // Loading state
                    <div className="flex items-center justify-center w-full h-full min-h-[300px]">
                        <div className="animate-pulse text-gray-400 text-lg">
                            Loading your card...
                        </div>
                    </div>
                ) : error ? (
                    // Error state - No card found
                    <div className="flex flex-col items-center justify-center w-full h-full min-h-[300px] gap-3">
                        <p className="text-gray-500 text-base">
                            No BaseCard yet
                        </p>
                    </div>
                ) : card ? (
                    // Card found - Display image (clickable)
                    <div
                        onClick={handleMyCardClick}
                        className="cursor-pointer w-full h-full min-h-[300px] relative group"
                    >
                        {/* Image with drop shadow effect */}
                        <div className="absolute inset-2 sm:inset-4 md:inset-6 transition-all duration-300 group-hover:inset-1 group-hover:sm:inset-3 group-hover:md:inset-5 group-active:inset-3 group-active:sm:inset-5 group-active:md:inset-7">
                            <div className="relative w-full h-full drop-shadow-2xl">
                                <Image
                                    src={getIPFSUrl(card.imageURI)}
                                    alt={`${card.nickname}'s BaseCard`}
                                    fill
                                    className="object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.3)] group-hover:drop-shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all duration-300"
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 60vw"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Subtle hover indicator */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                ) : (
                    // No wallet connected
                    <div className="flex items-center justify-center w-full h-full min-h-[300px]">
                        <p className="text-gray-500 text-base">
                            Connect wallet to view your card
                        </p>
                    </div>
                )}
            </div>

            {/* Buttons Section */}
            <div className="w-full max-w-4xl flex gap-x-3">
                <button
                    onClick={handleShareClick}
                    disabled={!card}
                    className={`flex flex-1 h-11 sm:h-12 md:h-14 rounded-xl justify-center items-center text-white font-semibold text-sm sm:text-base md:text-lg transition-all shadow-md ${
                        card
                            ? "bg-button-1 hover:bg-blue-700 hover:shadow-lg active:scale-95"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                    Share
                </button>
            </div>
        </div>
    );
}
