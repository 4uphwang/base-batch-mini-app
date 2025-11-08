"use client";

import { ACTION_ADD_CARD } from "@/app/constants/actions";
import { useMiniappParams } from "@/hooks/useMiniappParams";
import { useMyCard } from "@/hooks/useMyCard";
import { walletAddressAtom } from "@/store/walletState";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
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
    const { data: card, isLoading, isFetched, isError } = useMyCard(address);

    // 딥링크 파라미터 추출
    const { action, cardId } = useMiniappParams();

    const handleMintRedirect = () => {
        router.push("/mint");
    };

    // 로딩 상태 처리
    // - address가 없으면 로딩하지 않음 (즉시 HeroSection 표시)
    // - address가 있고 쿼리가 아직 실행 중이면 로딩 표시
    // - address가 있지만 아직 fetch가 완료되지 않았고 로딩 중이면 스켈레톤 표시
    if (address && isLoading && !isFetched) {
        return <MainSkeleton />
    }

    // 에러 발생 시에도 스켈레톤 대신 에러 처리 가능하지만, 일단은 기본 UI 표시
    // if (address && isError) {
    //     return <MainSkeleton />
    // }

    return (
        <div className="bg-white">
            {card ? (
                <div className="flex flex-col">
                    {action === ACTION_ADD_CARD && cardId && (
                        <CardCollectionAdder collectedCardId={cardId} />
                    )}
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
