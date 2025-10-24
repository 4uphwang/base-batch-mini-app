"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import BackButton from "@/components/common/BackButton";
import { useAccount } from "wagmi";
import { useMyCard } from "@/hooks/useMyCard";
import type { Card, CollectionResponse } from "@/lib/types";

export default function Collection() {
    const [selectedTag, setSelectedTag] = useState("All");
    const [collectedCards, setCollectedCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const tags = ["All", "Designer", "Developer", "Marketer"];

    const { address } = useAccount();

    // useMyCard hook을 사용하여 사용자 정보 가져오기
    const {
        data: myCard,
        isLoading: isMyCardLoading,
        error: myCardError,
    } = useMyCard(address);

    // 수집한 카드 데이터 가져오기
    useEffect(() => {
        if (!myCard?.id) return;

        console.log("myCard:", myCard); // id

        const fetchCollectedCards = async () => {
            try {
                setLoading(true);

                // 수집 관계 가져오기
                const collectionsResponse = await fetch(
                    `/api/collections?id=${myCard.id}`
                );

                if (!collectionsResponse.ok) {
                    throw new Error("Failed to fetch collections");
                }

                const collections: CollectionResponse[] =
                    await collectionsResponse.json();
                console.log("collected cards:", collections.length);

                // collectedCard 정보를 추출하여 카드 데이터로 변환
                const collectedCardsData: Card[] = collections.map(
                    (collection) => ({
                        id: collection.collectedCard.id,
                        nickname: collection.collectedCard.nickname,
                        bio: collection.collectedCard.bio,
                        role: collection.collectedCard.role,
                        imageURI: collection.collectedCard.imageURI,
                        address: collection.collectedCard.address,
                        basename:
                            collection.collectedCard.basename ||
                            "default.base.name",
                        skills: collection.collectedCard.skills,
                    })
                );

                setCollectedCards(collectedCardsData);
                setError(null);
            } catch (err) {
                console.error("Error fetching collected cards:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch collected cards"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCollectedCards();
    }, [myCard]);

    // 필터링된 카드 목록
    const filteredCards = collectedCards.filter((card) => {
        const matchesTag = selectedTag === "All" || card.role === selectedTag;
        return matchesTag;
    });

    return (
        <div className="relative">
            <div className="bg-white px-4 sm:px-6 py-6 sm:py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6 sm:mb-8 pl-4 sm:pl-6 md:pl-8 lg:pl-12">
                    <BackButton size={40} className="relative left-0 top-0" />
                    <div className="text-left">
                        <h2
                            className="text-3xl sm:text-4xl font-k2d-bold text-black mb-2"
                            style={{
                                letterSpacing: "-0.05em",
                            }}
                        >
                            My Collection
                        </h2>
                        <p className="text-base sm:text-lg text-gray-500 font-k2d-medium">
                            Cards I&apos;ve collected
                        </p>
                    </div>
                </div>

                {/* Filter Tags */}
                <div className="flex gap-2 mb-8 pb-2 justify-start flex-wrap">
                    {tags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={`px-3 py-1.5 rounded-full font-k2d-medium transition-colors text-xs flex-1 min-w-0 ${
                                selectedTag === tag
                                    ? "bg-[#0050FF] text-white"
                                    : "bg-white text-black border border-gray-200 hover:border-[#0050FF]"
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* Cards List */}
                <div className="space-y-4">
                    {isMyCardLoading || loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0050FF]"></div>
                            <p className="mt-2 text-gray-500 font-k2d-regular">
                                Loading collection...
                            </p>
                        </div>
                    ) : myCardError || error ? (
                        <div className="text-center py-8">
                            <p className="text-red-500 font-k2d-regular">
                                Error: {myCardError?.message || error}
                            </p>
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
                                {collectedCards.length === 0
                                    ? "No cards collected yet"
                                    : "No cards match your search"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-3">
                            {filteredCards.map((card) => (
                                <div
                                    key={card.id}
                                    className="group cursor-pointer"
                                    onClick={() => {
                                        window.open(
                                            `https://base.app/profile/${card.address}`,
                                            "_blank"
                                        );
                                    }}
                                >
                                    <div className="relative w-full h-48 sm:h-52 md:h-56 lg:h-60 shadow-md transition-transform group-hover:scale-105">
                                        <Image
                                            src={
                                                `https://ipfs.io/ipfs/${card.imageURI?.replace(
                                                    "ipfs://",
                                                    ""
                                                )}` ||
                                                "/assets/default-profile.png"
                                            }
                                            alt={card.address}
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                            onError={(e) => {
                                                // 이미지 로드 실패 시 기본 이미지로 대체
                                                e.currentTarget.src =
                                                    "/assets/default-profile.png";
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
