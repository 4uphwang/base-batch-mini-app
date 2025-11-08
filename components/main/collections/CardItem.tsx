"use client";

// CardItem.tsx

import { safeImageURI } from "@/lib/imageUtils"; // 기존 임포트 경로에 따라 조정하세요.
import { Card } from "@/lib/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import CardOverlayInfo from "./CardOverlayInfo";

interface CardItemProps {
    card: Card;
    activeCardId: number | null;
    setCardRef: (id: number, element: HTMLDivElement | null) => void;
    openUrl: (url: string) => void;
}

const CardItem = React.memo(function CardItem({ card, activeCardId, setCardRef, openUrl }: CardItemProps) {
    const router = useRouter();
    const isActive = activeCardId === card.id;
    const isNull = activeCardId === null;
    const cardStyle = {
        opacity: isNull ? 1 : activeCardId === null ? 1 : isActive ? 1 : 0.7,
    };

    const handleCardClick = () => {
        // 카드 상세 페이지로 이동
        router.push(`/card/${card.address}`);
    };

    return (
        <div
            key={card.id}
            ref={(el) => setCardRef(card.id, el)}
            data-card-id={card.id}
            className={`group cursor-pointer transition-all duration-700 ease-in-out shadow-xl rounded-2xl flex w-full mx-auto overflow-hidden ${isActive ? "scale-110 z-20" : "scale-100 z-10"}`}
            style={cardStyle}
            onClick={handleCardClick}
        >
            <div className="relative bg-white " style={{ aspectRatio: "5/3", width: "100%" }}>
                <Image
                    src={
                        safeImageURI(card.imageURI, "/assets/default-profile.png") ||
                        "/assets/default-profile.png"
                    }
                    alt={card.nickname || card.address || "Card image"}
                    fill
                    className="object-contain aspect-[5/3]"
                    // sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                    unoptimized={card.imageURI?.startsWith("data:") || false}
                    onError={(e) => {
                        e.currentTarget.src = "/assets/default-profile.png";
                    }}
                />

                {/* Overlay Info - 중앙 카드에만 표시 (분리된 컴포넌트 사용) */}
                {isActive && <CardOverlayInfo card={card} />}

                {/* Active Indicator */}
                {/* {isActive && (
                    <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                )} */}
            </div>
        </div>
    );
});

export default CardItem;