"use client";

import { useFetchCards } from "@/hooks/card/useFetchCards";
import { CollectionFilterTag } from "@/lib/collection";
import { filterCollections } from "@/lib/utils";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useDeferredValue, useLayoutEffect, useMemo, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { CollectionFilter } from "../collection/CollectionFilter";
import CardItem from "./collections/CardItem";

export default function CollectCardsSection() {
    const [searchInput, setSearchInput] = useState("");
    const deferredSearchTerm = useDeferredValue(searchInput);
    const [selectedTag, setSelectedTag] = useState<CollectionFilterTag>("All");
    const listContainerRef = useRef<HTMLDivElement | null>(null);
    const [listOffsetTop, setListOffsetTop] = useState(0);
    const [viewportHeight, setViewportHeight] = useState(0);

    const {
        data: cards = [],
        isLoading,
        isError,
        error
    } = useFetchCards();

    const { filteredCards, tags } = useMemo(
        () => filterCollections(cards, selectedTag, deferredSearchTerm),
        [cards, selectedTag, deferredSearchTerm]
    );

    const rowVirtualizer = useWindowVirtualizer({
        count: filteredCards.length,
        estimateSize: () => 360,
        overscan: 8,
        paddingEnd: Math.max(viewportHeight / 2, 0),
    });

    useLayoutEffect(() => {
        const updateMeasurements = () => {
            const element = listContainerRef.current;
            if (!element) {
                setListOffsetTop(0);
                setViewportHeight(typeof window !== "undefined" ? window.innerHeight : 0);
                return;
            }

            let offset = 0;
            let current: HTMLElement | null = element;

            while (current) {
                offset += current.offsetTop;
                current = current.offsetParent as HTMLElement | null;
            }

            setListOffsetTop(offset);
            setViewportHeight(typeof window !== "undefined" ? window.innerHeight : 0);
        };

        updateMeasurements();
        window.addEventListener("resize", updateMeasurements);

        return () => {
            window.removeEventListener("resize", updateMeasurements);
        };
    }, [filteredCards.length]);

    const virtualItems = rowVirtualizer.getVirtualItems();

    const activeCardId = useMemo(() => {
        if (filteredCards.length === 0 || virtualItems.length === 0) {
            return null;
        }

        const scrollOffset = rowVirtualizer.scrollOffset ?? 0;
        const viewportCenter = scrollOffset + viewportHeight / 2;

        let closestItem = null;
        let smallestDistance = Number.POSITIVE_INFINITY;

        for (const item of virtualItems) {
            const itemMiddle =
                listOffsetTop + item.start + item.size / 2;
            const distance = Math.abs(itemMiddle - viewportCenter);

            if (distance < smallestDistance) {
                smallestDistance = distance;
                closestItem = item;
            }
        }

        if (closestItem) {
            const clampedIndex = Math.min(
                Math.max(closestItem.index, 0),
                filteredCards.length - 1
            );

            return filteredCards[clampedIndex]?.id ?? null;
        }

        const totalHeight = rowVirtualizer.getTotalSize();
        const averageItemSize =
            totalHeight > 0 && filteredCards.length > 0
                ? totalHeight / filteredCards.length
                : 1;
        const relativeCenter = viewportCenter - listOffsetTop;
        const approximateIndex = Math.round(relativeCenter / averageItemSize);

        const clampedIndex = Math.min(
            Math.max(approximateIndex, 0),
            filteredCards.length - 1
        );

        return filteredCards[clampedIndex]?.id ?? null;
    }, [filteredCards, virtualItems, listOffsetTop, viewportHeight]);

    return (
        <div className="bg-white px-4 sm:px-6 pt-6">
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
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full h-12 px-4 pr-12 bg-white border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 focus:border-[#0050FF] focus:outline-none transition-colors text-base font-k2d-regular"
                    />
                    <button
                        onClick={() => setSearchInput((value) => value.trim())}
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
                    <div ref={listContainerRef} className="relative flex-1">
                        <div
                            style={{
                                height: `${rowVirtualizer.getTotalSize()}px`,
                                position: "relative",
                            }}
                        >
                            {virtualItems.map((virtualItem) => {
                                const card = filteredCards[virtualItem.index];

                                if (!card) {
                                    return null;
                                }

                                return (
                                    <div
                                        key={card.id}
                                        ref={(element) => {
                                            if (element) {
                                                rowVirtualizer.measureElement(element);
                                            }
                                        }}
                                        data-index={virtualItem.index}
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            transform: `translateY(${virtualItem.start}px)`,
                                            zIndex: card.id === activeCardId ? 9999 : 10,
                                        }}
                                    >
                                        <CardItem
                                            card={card}
                                            isActive={card.id === activeCardId}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
