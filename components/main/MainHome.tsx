"use client";

import { ACTION_ADD_CARD } from "@/app/constants/actions";
import { useMiniappParams } from "@/hooks/useMiniappParams";
import { useMyCard } from "@/hooks/useMyCard";
import { walletAddressAtom } from "@/store/walletState";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CardCollectionAdder from "./CardCollectionAdder";
import CollectCardsSection from "./CollectCardsSection";
import HeroSection from "./HeroSection";
import MyCardSection from "./MyCardSection";

const MainSkeleton = () => (<div className="flex flex-col w-full gap-4 px-5">
    {/* 1. Title Skeleton */}
    <div className="flex flex-col mt-5 gap-2">
        <div className="h-12 bg-gray-200 rounded-lg w-full animate-pulse" />
        <div className="h-12 bg-gray-200 rounded-lg w-full animate-pulse" />
    </div>

    {/* 2. Card Image Skeleton (가장 큰 영역) */}
    <div className="w-full rounded-2xl sm:rounded-3xl relative">
        <div className="w-full h-52 bg-gray-200 rounded-2xl animate-pulse drop-shadow-lg" />
    </div>

    <div className="h-12 bg-gray-200 rounded-lg w-full animate-pulse" />

    {/* 3. Buttons Section Skeleton */}
    <div className="w-full flex gap-x-3">
        <div className="py-2 flex-1 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="py-2 flex-1 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="py-2 flex-1 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="py-2 flex-1 h-10 bg-gray-200 rounded-full animate-pulse"></div>
    </div>

    <div className="w-full rounded-2xl sm:rounded-3xl relative">
        <div className="w-full h-52 bg-gray-200 rounded-2xl animate-pulse drop-shadow-lg" />
    </div>

    <div className="w-full rounded-2xl sm:rounded-3xl relative">
        <div className="w-full h-52 bg-gray-200 rounded-2xl animate-pulse drop-shadow-lg" />
    </div>

</div>);

export default function MainHome() {
    const router = useRouter();
    const [address] = useAtom(walletAddressAtom);
    const { data: card, status } = useMyCard(address);
    const [shouldRenderHero, setShouldRenderHero] = useState(false);
    const heroTimerRef = useRef<number | null>(null);

    useEffect(() => {
        if (!address) {
            heroTimerRef.current = window.requestAnimationFrame(() => {
                setShouldRenderHero(true);
                heroTimerRef.current = null;
            });
        } else {
            if (heroTimerRef.current !== null) {
                window.cancelAnimationFrame(heroTimerRef.current);
                heroTimerRef.current = null;
            }
            setShouldRenderHero(false);
        }
        return () => {
            if (heroTimerRef.current !== null) {
                window.cancelAnimationFrame(heroTimerRef.current);
                heroTimerRef.current = null;
            }
        };
    }, [address]);

    // 딥링크 파라미터 추출
    const { action, cardId } = useMiniappParams();

    const handleMintRedirect = () => {
        router.push("/mint");
    };

    const renderHero = () => (
        <div className="flex flex-col flex-1">
            <HeroSection onMintClick={handleMintRedirect} />
            <CollectCardsSection />
        </div>
    );

    if (shouldRenderHero) {
        return <div className="bg-white">{renderHero()}</div>;
    }

    if (status === "pending") {
        return <MainSkeleton />;
    }

    return (
        <div className="bg-white">
            {card ? (
                <div className="flex flex-col flex-1">
                    {action === ACTION_ADD_CARD && cardId && (
                        <CardCollectionAdder collectedCardId={cardId} />
                    )}
                    <MyCardSection />
                    <CollectCardsSection />
                </div>
            ) : (
                renderHero()
            )}
        </div>
    );
}
