"use client";

import BackButton from "@/components/common/BackButton";
import { useMyCard } from "@/hooks/useMyCard";
import { useOpenUrl } from "@coinbase/onchainkit/minikit";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AiOutlineLoading } from "react-icons/ai";
import { useAccount } from "wagmi";

const CardDisplay = ({ card, openUrl, router }: { card: any, openUrl: (url: string) => void, router: any }) => (
    <div
        className="flex-1 relative flex flex-col"
        style={{
            backgroundImage: "url('/assets/mybasecard-background.webp')",
            backgroundSize: "cover",
            backgroundPosition: "60% 50%",
        }}
    >
        <div className="flex-grow-[2] flex flex-col justify-center pb-12 pt-4">
            {/* Header / Back Button */}
            <div className="relative pt-4 pb-6 px-6">
                <div className="flex items-center gap-6">
                    <BackButton size={40} className="text-white hover:bg-white/10 relative left-0 top-0" />
                    <h1 className="font-k2d-bold text-white text-3xl" style={{ letterSpacing: "-0.05em", lineHeight: "0.9", }}>
                        My BaseCard
                    </h1>
                </div>
            </div>
        </div>

        <div className="flex-grow-[5] overflow-y-auto">
            <div className="relative z-10 px-6 pb-6">
                {/* Profile Section */}
                <div className="flex flex-col items-center mb-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 shadow-lg">
                        <Image
                            src={card.profileImage.length > 0 ? card.profileImage : "/assets/default-profile.png"}
                            alt={card.nickname}
                            width={96} height={96} className="w-full h-full object-cover"
                        />
                    </div>
                    <h2 className="font-k2d-bold text-white text-3xl mb-1">{card.nickname}</h2>
                    <p className="font-k2d-regular text-white/90 text-xl mb-4">{card.role}</p>
                    {/* Social Media Icons (생략) */}
                    <div className="flex gap-4 mb-6">{/* ... */}</div>
                </div>

                {/* Bio Section */}
                <div className="bg-white rounded-xl p-6 mb-4 shadow-lg">
                    <p className="font-k2d-regular text-gray-800 text-center text-base leading-relaxed">{card.bio}</p>
                </div>

                {/* Skills Section */}
                <div className="flex flex-wrap gap-3 justify-center mb-6">
                    {card.skills.map((skill: string, index: number) => (
                        <button key={index} className="px-6 py-3 bg-[#0050FF] text-white font-k2d-medium text-base rounded-xl border-2 border-white shadow-md hover:bg-[#0040DD] transition-colors">
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
            </div>
        </div>

        <div className="flex-grow-[3] flex flex-col justify-center">
            <div className="bg-white p-4 shadow-lg">
                {/* My Collection Button */}
                <button
                    onClick={() => router.push("/collection")}
                    className="w-full py-4 bg-[#2D2D2D] text-white font-k2d-semibold text-lg rounded-2xl mb-3 hover:bg-[#1D1D1D] transition-colors shadow-lg"
                >
                    My Collection
                </button>

                {/* Basename Button */}
                <button
                    onClick={() => openUrl(`https://base.org/name/${card.basename}`)}
                    className="w-full py-4 bg-[#0050FF] text-white font-k2d-semibold text-lg rounded-2xl hover:bg-[#0040DD] transition-colors shadow-lg"
                >
                    {card.basename.length > 0 ? card.basename : "No Basename"}
                </button>
            </div>
        </div>
    </div>
);

// Loading State Component
const LoadingState = () => (
    <div className="h-full flex items-center justify-center bg-gradient-to-b from-[#0050FF] to-[#0080FF]">
        <AiOutlineLoading size={40} className="animate-spin text-white" />
    </div>
);

// Error/No Card State Component
const NoCardState = ({ router }: { router: any }) => (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0050FF] to-[#0080FF] px-6 py-8" >
        <div className="flex flex-col items-center text-center gap-6">
            <h1 className="text-5xl sm:text-6xl font-k2d-bold text-white drop-shadow-lg" style={{ letterSpacing: "-0.05em", lineHeight: "0.9", }}>
                No Card Found
            </h1>
            <p className="text-xl sm:text-2xl font-k2d-medium text-white max-w-md drop-shadow-md">
                Create your onchain identity
                <br />
                and start building your story
            </p>
            <button
                onClick={() => router.push("/mint")}
                className="w-full max-w-md py-4 bg-gray-900 hover:bg-gray-800 active:bg-black text-white font-k2d-semibold rounded-xl transition-all duration-300 shadow-xl text-lg transform hover:scale-105 active:scale-95 mt-4"
            >
                Mint Your Card
            </button>
        </div>
    </div>
);

export default function MyCard() {
    const router = useRouter();
    const openUrl = useOpenUrl();
    const { address } = useAccount();
    const { data: card, isLoading, error } = useMyCard(address);

    const rootHeight = {
        height: 'calc(100dvh - var(--header-h, 60px) - var(--bottom-nav-h, 64px))',
    }

    return (
        <div className="w-full flex flex-col overflow-hidden" style={rootHeight}>

            {/* 1. 로딩 상태 */}
            {isLoading && <LoadingState />}

            {/* 2. 에러 또는 카드 없음 상태 */}
            {!isLoading && (error || !card) && <NoCardState router={router} />}

            {/* 3. 카드 데이터 표시 상태 */}
            {!isLoading && card && (
                <CardDisplay card={card} openUrl={openUrl} router={router} />
            )}

        </div>
    );
}
