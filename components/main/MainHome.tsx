"use client";

import { useRouter } from "next/navigation";

import { useBaseCardNFTs } from "@/hooks/useBaseCardNFTs";

import { useMiniappParams } from "@/hooks/useMiniappParams";
import { useMyCard } from "@/hooks/useMyCard";
import CardCollectionAdder from "./CardCollectionAdder";
import CollectCardsSection from "./CollectCardsSection";
import HeroSection from "./HeroSection";
import MyCardSection from "./MyCardSection";

const ACTION_ADD_CARD = "addCardCollection";

export default function MainHome() {
    const router = useRouter();
    useBaseCardNFTs();
    const { data: card } = useMyCard();

    // 1. 딥링크 파라미터 추출
    const { action, cardId } = useMiniappParams();

    const handleMintRedirect = () => {
        router.push("/mint");
    };

    return (
        <div className="min-h-screen bg-white">
            {
                action === ACTION_ADD_CARD && cardId &&
                <CardCollectionAdder collectedCardId={cardId} />
            }
            {card ? (
                <div className="flex flex-col">
                    <MyCardSection />
                    <CollectCardsSection />
                </div>
            ) : (
                <div className="flex flex-col">
                    <HeroSection onMintClick={handleMintRedirect} />
                    <CollectCardsSection />
                </div>
            )}
        </div>
    );
}