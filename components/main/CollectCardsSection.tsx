"use client";

import { useFetchCards } from "@/hooks/card/useFetchCards";
import { CollectionFilterTag } from "@/lib/collection";
import { filterCollections } from "@/lib/utils";
import { useOpenUrl } from "@coinbase/onchainkit/minikit";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { CollectionFilter } from "../collection/CollectionFilter";
import CardItem from "./collections/CardItem";

export default function CollectCardsSection() {
    const openUrl = useOpenUrl();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTag, setSelectedTag] = useState<CollectionFilterTag>("All");
    const [activeCardId, setActiveCardId] = useState<number | null>(null);

    const {
        data: cards = [],
        isLoading,
        isError,
        error
    } = useFetchCards();

    const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

    const handleSearch = useCallback(() => {
        setSearchTerm((current) => current.trim());
    }, []);

    const { filteredCards, tags } = useMemo(
        () => filterCollections(cards, selectedTag, searchTerm),
        [cards, selectedTag, searchTerm]
    );

    // Intersection Observer로 중앙 카드 감지
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // 의미: 카드가 화면에 50% 이상 보일 때 활성화
                    if (entry.isIntersecting && entry.intersectionRatio > 0.9) {
                        const cardId = parseInt(
                            entry.target.getAttribute("data-card-id") || "0"
                        );
                        setActiveCardId(cardId);
                    }
                });
            },
            {
                root: null,

                // 더 넓은 영역 (상하 10%씩 제외 = 80% 감지)
                // rootMargin: "-10% 0px -10% 0px"
                // 더 좁은 영역 (상하 40%씩 제외 = 20% 감지 - 정확히 중앙만)
                // rootMargin: "-40% 0px -40% 0px"
                // 화면 전체 (감지 영역 제한 없음)
                // rootMargin: "0px"
                // 정확히 중앙 한 점 (거의 50% 지점)
                // rootMargin: "-49% 0px -49% 0px"

                rootMargin: "-25% 0px -25% 0px", // 중앙 50% 영역
                threshold: [0, 0.25, 0.5, 0.75, 1],
            }
        );

        // Copy refs to local variable for cleanup
        const currentRefs = Array.from(cardRefs.current.values());

        currentRefs.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            currentRefs.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [filteredCards]);

    const setCardRef = useCallback(
        (id: number, element: HTMLDivElement | null) => {
            if (element) {
                cardRefs.current.set(id, element);
            } else {
                cardRefs.current.delete(id);
            }
        }, []);

    return (
        <div className="bg-white px-4 sm:px-6 py-6 sm:py-8">
            {/* Header */}
            <div className="text-left mb-6">
                <h2 className="text-3xl sm:text-4xl font-k2d-bold text-black mb-2 tracking-tight">
                    Collect cards
                </h2>
                <p className="text-base sm:text-lg text-gray-500 font-k2d-medium">
                    Find your collaborators
                </p>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="designer, dev, marketer, ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-12 px-4 pr-12 bg-white border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 focus:border-[#0050FF] focus:outline-none transition-colors text-base font-k2d-regular"
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#0050FF] transition-colors"
                    >
                        <CiSearch size={24} />
                    </button>
                </div>
            </div>

            {/* Filter Tags */}
            <CollectionFilter
                tags={tags}
                selectedTag={selectedTag}
                onTagChange={setSelectedTag}
            />

            {/* Cards List */}
            <div className="space-y-4 mt-5">
                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0050FF]"></div>
                        <p className="mt-2 text-gray-500 font-k2d-regular">
                            Loading cards...
                        </p>
                    </div>
                ) : isError ? (
                    <div className="text-center py-8">
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 px-4 py-2 bg-[#0050FF] text-white rounded-lg font-k2d-medium hover:bg-[#0040CC] transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : filteredCards.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 font-k2d-regular">
                            No cards found
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col px-5 space-y-1" style={{ paddingBottom: "40vh" }}>
                        {filteredCards.map((card) => (
                            <CardItem
                                key={card.id}
                                card={card}
                                activeCardId={activeCardId}
                                setCardRef={setCardRef}
                                openUrl={openUrl}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
