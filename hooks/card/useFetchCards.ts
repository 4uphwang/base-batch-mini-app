import { Card } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';


const fetchCardsData = async (): Promise<Card[]> => {
    const response = await fetch("/api/cards");

    if (!response.ok) {
        throw new Error("Failed to fetch cards");
    }

    return response.json();
};

export function useFetchCards() {
    return useQuery<Card[], Error>({
        queryKey: ['cards'],
        queryFn: fetchCardsData,
    });
}

