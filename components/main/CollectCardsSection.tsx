"use client";

import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";

interface CardData {
    id: number;
    nickname: string;
    bio?: string;
    imageURI?: string;
    basename?: string;
    role?: string;
    skills?: string[];
    address: string;
}

export default function CollectCardsSection() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTag, setSelectedTag] = useState("All");
    const [cards, setCards] = useState<CardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const tags = ["All", "Designer", "Developer", "Marketer"];

    // API에서 카드 데이터 가져오기
    useEffect(() => {
        const fetchCards = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/cards");

                if (!response.ok) {
                    throw new Error("Failed to fetch cards");
                }

                const data = await response.json();
                setCards(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching cards:", err);
                setError(
                    err instanceof Error ? err.message : "Failed to fetch cards"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, []);

    const handleSearch = () => {
        console.log(`Searching for: ${searchTerm}`);
    };

    // 필터링된 카드 목록
    const filteredCards = cards.filter((card) => {
        const matchesSearch =
            searchTerm === "" ||
            card.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.skills?.some((skill) =>
                skill.toLowerCase().includes(searchTerm.toLowerCase())
            );

        const matchesTag = selectedTag === "All" || card.role === selectedTag;

        return matchesSearch && matchesTag;
    });

    return (
        <div className="bg-white px-4 sm:px-6 py-6 sm:py-8">
            {/* Header */}
            <div className="text-left mb-6 sm:mb-8 pl-4 sm:pl-6 md:pl-8 lg:pl-12">
                <h2
                    className="text-3xl sm:text-4xl font-k2d-bold text-black mb-2"
                    style={{
                        letterSpacing: "-0.05em",
                    }}
                >
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
                {loading ? (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0050FF]"></div>
                        <p className="mt-2 text-gray-500 font-k2d-regular">
                            Loading cards...
                        </p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8">
                        <p className="text-red-500 font-k2d-regular">
                            Error: {error}
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
                            No cards found
                        </p>
                    </div>
                ) : (
                    filteredCards.map((card) => (
                        <div
                            key={card.id}
                            className="bg-gradient-to-r from-[#0050FF] to-[#4A90E2] rounded-2xl p-6 shadow-lg"
                        >
                            <div className="flex items-center">
                                {/* Card Info */}
                                <div className="flex-1 text-white">
                                    <h3 className="text-xl font-k2d-bold mb-1">
                                        {card.nickname}
                                    </h3>
                                    <p className="text-sm text-white/80 mb-1 font-k2d-regular">
                                        {card.basename || card.address}
                                    </p>
                                    <p className="text-base font-k2d-semibold">
                                        {card.role || "Builder"}
                                    </p>
                                    {card.skills && card.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {card.skills
                                                .slice(0, 3)
                                                .map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-white/20 rounded text-xs font-k2d-regular"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            {card.skills.length > 3 && (
                                                <span className="px-2 py-1 bg-white/20 rounded text-xs font-k2d-regular">
                                                    +{card.skills.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
