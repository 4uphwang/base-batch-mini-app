"use client";

import { useQuery } from "@tanstack/react-query";

export interface Card {
    id: number;
    nickname: string;
    role: string;
    bio: string;
    imageURI: string;
    profileImage: string;
    basename: string;
    skills: string[];
    address: string;
}

/**
 * Fetch card data by wallet address
 */
async function fetchCardByAddress(address: string): Promise<Card> {
    const response = await fetch(`/api/card/${address}`);
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Card not found");
        }
        throw new Error("Failed to fetch card");
    }

    const data = await response.json();
    return data;
}

/**
 * Custom hook to get user's card data
 */
export function useMyCard(address?: string) {
    return useQuery({
        queryKey: ["card", address],
        queryFn: () => fetchCardByAddress(address!),
        enabled: !!address, // Only fetch if address exists
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
    });
}
