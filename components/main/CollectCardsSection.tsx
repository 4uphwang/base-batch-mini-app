"use client";

import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import Image from "next/image";

interface CardData {
    id: string;
    name: string;
    address: string;
    role: string;
    avatar: string;
}

const mockCards: CardData[] = [
    {
        id: "1",
        name: "JellyJelly",
        address: "Chorang.base.eth",
        role: "Developer",
        avatar: "/assets/mock-basecard.png",
    },
    {
        id: "2",
        name: "JellyJelly",
        address: "Chorang.base.eth",
        role: "Developer",
        avatar: "/assets/mock-basecard.png",
    },
    {
        id: "3",
        name: "JellyJelly",
        address: "Chorang.base.eth",
        role: "Developer",
        avatar: "/assets/mock-basecard.png",
    },
];

export default function CollectCardsSection() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTag, setSelectedTag] = useState("All");

    const tags = ["All", "Designer", "Developer", "Marketer"];

    const handleSearch = () => {
        console.log(`Searching for: ${searchTerm}`);
    };

    return (
        <div className="bg-white px-4 sm:px-6 py-6 sm:py-8">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-black mb-2">
                    Collect cards
                </h2>
                <p className="text-base sm:text-lg text-gray-500 font-medium">
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
                        className="w-full h-12 px-4 pr-12 bg-white border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 focus:border-[#0050FF] focus:outline-none transition-colors text-base"
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
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                {tags.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors text-base ${
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
                {mockCards.map((card) => (
                    <div
                        key={card.id}
                        className="bg-gradient-to-r from-[#0050FF] to-[#4A90E2] rounded-2xl p-6 shadow-lg"
                    >
                        <div className="flex items-center">
                            {/* Avatar */}
                            <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gray-200 overflow-hidden mr-4">
                                <Image
                                    src={card.avatar}
                                    alt={`${card.name} avatar`}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Card Info */}
                            <div className="flex-1 text-white">
                                <h3 className="text-xl font-bold mb-1">
                                    {card.name}
                                </h3>
                                <p className="text-sm text-white/80 mb-1">
                                    {card.address}
                                </p>
                                <p className="text-base font-semibold">
                                    {card.role}
                                </p>
                            </div>

                            {/* Bottom Right Logo */}
                            <div className="flex items-center">
                                <div className="w-6 h-6 bg-white/20 rounded mr-2"></div>
                                <span className="text-xs text-white/80 font-medium">
                                    BaseCard
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
