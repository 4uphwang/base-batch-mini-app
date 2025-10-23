"use client";

import BackButton from "@/components/common/BackButton";
import { useMyCard } from "@/hooks/useMyCard";
import { useAccount } from "wagmi";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function MyCard() {
    const router = useRouter();
    const { address } = useAccount();
    const { data: card, isLoading, error } = useMyCard(address);
    const imageUrl = `https://ipfs.io/ipfs/${card?.imageURI}`;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0050FF] to-[#0080FF]">
                <div className="text-white font-k2d text-xl">Loading...</div>
            </div>
        );
    }

    if (error || !card) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0050FF] to-[#0080FF]">
                <div className="text-white font-k2d text-xl">
                    Card not found
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen relative bg-gradient-to-b from-[#0050FF] to-[#0080FF]"
            style={{
                backgroundImage: "url('/assets/mybasecard-background.svg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Back Button */}
            <div className="relative z-10">
                <BackButton className="text-white hover:bg-white/10" />
            </div>

            {/* Header */}
            <div className="relative z-10 pt-4 pb-6">
                <h1 className="font-k2d-bold text-white text-3xl text-center">
                    My BaseCard
                </h1>
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 px-6 pb-20">
                {/* Profile Section */}
                <div className="flex flex-col items-center mb-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg">
                        <Image
                            src={imageUrl || "/assets/default-profile.png"}
                            alt={card.nickname}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Nickname */}
                    <h2 className="font-k2d-bold text-white text-3xl mb-1">
                        {card.nickname}
                    </h2>

                    {/* Role */}
                    <p className="font-k2d-regular text-white/90 text-xl mb-4">
                        {card.role}
                    </p>

                    {/* Social Media Icons */}
                    <div className="flex gap-4 mb-6">
                        <a
                            href="#"
                            className="w-12 h-12 rounded-full bg-black flex items-center justify-center hover:bg-black/80 transition-colors"
                        >
                            <Image
                                src="/logo/farcaster-logo.png"
                                alt="Farcaster"
                                width={24}
                                height={24}
                            />
                        </a>
                        <a
                            href="#"
                            className="w-12 h-12 rounded-full bg-black flex items-center justify-center hover:bg-black/80 transition-colors"
                        >
                            <Image
                                src="/logo/github-logo.png"
                                alt="GitHub"
                                width={24}
                                height={24}
                            />
                        </a>
                        <a
                            href="#"
                            className="w-12 h-12 rounded-full bg-black flex items-center justify-center hover:bg-black/80 transition-colors"
                        >
                            <Image
                                src="/logo/website-logo.png"
                                alt="Website"
                                width={24}
                                height={24}
                            />
                        </a>
                        <a
                            href="#"
                            className="w-12 h-12 rounded-full bg-black flex items-center justify-center hover:bg-black/80 transition-colors"
                        >
                            <Image
                                src="/logo/x-logo.png"
                                alt="X (Twitter)"
                                width={24}
                                height={24}
                            />
                        </a>
                    </div>
                </div>

                {/* Bio Section */}
                <div className="bg-white rounded-3xl p-6 mb-4 shadow-lg">
                    <p className="font-k2d-regular text-gray-800 text-center text-base leading-relaxed">
                        {card.bio}
                    </p>
                </div>

                {/* Skills Section */}
                <div className="flex flex-wrap gap-3 justify-center mb-6">
                    {card.skills.map((skill, index) => (
                        <button
                            key={index}
                            className="px-6 py-3 bg-[#0050FF] text-white font-k2d-medium text-base rounded-xl border-2 border-white shadow-md hover:bg-[#0040DD] transition-colors"
                        >
                            {skill}
                        </button>
                    ))}
                </div>

                {/* Edit Profile Button */}
                <button
                    onClick={() => router.push("/mint")}
                    className="w-full py-3 mb-3 text-white font-k2d-medium text-lg hover:underline transition-all"
                >
                    Edit Profile
                </button>

                {/* My Collection Button */}
                <button
                    onClick={() => router.push("/collection")}
                    className="w-full py-4 bg-[#2D2D2D] text-white font-k2d-semibold text-lg rounded-2xl mb-3 hover:bg-[#1D1D1D] transition-colors shadow-lg"
                >
                    My Collection
                </button>

                {/* Basename Button */}
                <button
                    onClick={() => {
                        // TODO: Add basename link functionality
                        window.open(
                            `https://base.org/name/${card.basename}`,
                            "_blank"
                        );
                    }}
                    className="w-full py-4 bg-[#0050FF] text-white font-k2d-semibold text-lg rounded-2xl hover:bg-[#0040DD] transition-colors shadow-lg"
                >
                    {card.basename}
                </button>
            </div>
        </div>
    );
}
