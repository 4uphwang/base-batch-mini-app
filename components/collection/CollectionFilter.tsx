import { CollectionFilterTag } from "@/lib/collection";
import clsx from "clsx";
import { useMemo } from "react";

interface CollectionFilterProps {
    tags: CollectionFilterTag[];
    selectedTag: CollectionFilterTag;
    onTagChange: (tag: CollectionFilterTag) => void;
}

export function CollectionFilter({ tags, selectedTag, onTagChange }: CollectionFilterProps) {
    const activeIndex = useMemo(() => tags.findIndex((tag) => tag === selectedTag), [tags, selectedTag]);
    const segmentWidthStyle = useMemo(() => `calc(100% / ${Math.max(tags.length, 1)} - 8px)`, [tags.length]);

    return (
        <div className="w-full">
            <div className="relative inline-flex w-full justify-start rounded-full bg-[#F0F0F0] p-1 overflow-hidden">
                {activeIndex >= 0 && (
                    <span
                        className="absolute inset-y-1 rounded-full bg-white shadow-sm transition-all duration-300 ease-out"
                        style={{
                            width: segmentWidthStyle,
                            left: `calc((100% / ${Math.max(tags.length, 1)}) * ${activeIndex} + 4px)`,
                        }}
                        aria-hidden
                    />
                )}

                {tags.map((tag) => {
                    const isSelected = selectedTag === tag;
                    return (
                        <button
                            key={tag}
                            onClick={() => onTagChange(tag)}
                            className={clsx(
                                "relative flex-1 min-w-0 px-4 py-2 text-sm transition-colors duration-200",
                                "rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                                isSelected ? "text-[#0050FF] font-k2d-bold" : "text-black font-k2d-medium"
                            )}
                        >
                            <span className="relative z-10 truncate">{tag}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

