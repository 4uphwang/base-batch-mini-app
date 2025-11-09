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
    isActive: boolean;
    style?: React.CSSProperties;
}

const CardItem = React.memo(function CardItem({ card, isActive, style }: CardItemProps) {
    const router = useRouter();
    const cardStyle = {
        opacity: isActive ? 1 : 0.7,
    };

    const handleCardClick = () => {
        router.push(`/card/${card.address}`);
    };

    return (
        <div
            data-card-id={card.id}
            className={`group cursor-pointer transition-all duration-700 ease-in-out shadow-xl rounded-2xl flex w-full mx-auto overflow-hidden ${isActive ? "scale-110 z-20" : "scale-100 z-10"}`}
            style={{ ...style, ...cardStyle }}
            onClick={handleCardClick}
        >
            <div className="relative bg-white" style={{ aspectRatio: "5/3", width: "100%" }}>
                <Image
                    src={
                        safeImageURI(card.imageURI, "/assets/default-profile.png") ||
                        "/assets/default-profile.png"
                    }
                    alt={card.nickname || card.address || "Card image"}
                    fill
                    className="object-contain aspect-[5/3]"
                    unoptimized={card.imageURI?.startsWith("data:") || false}
                    onError={(e) => {
                        e.currentTarget.src = "/assets/default-profile.png";
                    }}
                />

                {isActive && <CardOverlayInfo card={card} />}
            </div>
        </div>
    );
});

export default CardItem;