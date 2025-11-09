"use client";

// CardItem.tsx

import { safeImageURI } from "@/lib/imageUtils";
import { Card } from "@/lib/types";
import clsx from "clsx";
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
        zIndex: isActive ? 9999 : 10,
    };

    const handleCardClick = () => {
        router.push(`/card/${card.address}`);
    };

    return (
        <div
            data-card-id={card.id}
            className={clsx(
                "group relative cursor-pointer transition-all duration-700 ease-in-out rounded-2xl flex w-full mx-auto px-5",
                isActive ? "scale-110 overflow-visible" : "scale-100 overflow-hidden"
            )}
            style={{ ...style, ...cardStyle }}
            onClick={handleCardClick}
        >
            <div className="relative overflow-hidden" style={{ aspectRatio: "5/3", width: "100%" }}>
                <Image
                    src={
                        safeImageURI(card.imageURI, "/assets/default-profile.png") ||
                        "/assets/default-profile.png"
                    }
                    alt={card.nickname || card.address || "Card image"}
                    style={{ objectFit: "cover" }}
                    className="object-cover aspect-[5/3]"
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