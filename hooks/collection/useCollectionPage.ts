import { useFetchCollections } from "@/hooks/card/useFetchCollections";
import { useMyCard } from "@/hooks/useMyCard";
import { CollectionFilterTag } from "@/lib/collection";
import { Card } from "@/lib/types";
import { filterCollections } from "@/lib/utils";
import { walletAddressAtom } from "@/store/walletState";
import { useOpenUrl } from "@coinbase/onchainkit/minikit";
import { useAtom } from "jotai";
import { useCallback, useRef, useState } from "react";



/**
 * Collection 페이지의 전체 로직을 통합한 훅
 */
export function useCollectionPage() {
    const [selectedTag, setSelectedTag] = useState<CollectionFilterTag>("All");
    const openUrl = useOpenUrl();
    const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
    const [address] = useAtom(walletAddressAtom);

    // 사용자 카드 정보 조회
    const {
        data: myCard,
        isLoading: isMyCardLoading,
        error: myCardError,
    } = useMyCard(address);

    // 컬렉션 카드 목록 조회
    const { data, isLoading, error } = useFetchCollections(myCard?.id);

    // 필터링된 카드 목록
    const { filteredCards, tags } = filterCollections(data, selectedTag);

    // 카드 ref 설정 함수
    const setCardRef = useCallback((id: number, element: HTMLDivElement | null) => {
        if (element) {
            cardRefs.current.set(id, element);
        } else {
            cardRefs.current.delete(id);
        }
    }, []);

    return {
        selectedTag,
        setSelectedTag,
        tags,
        filteredCards,
        openUrl,
        setCardRef,
        myCard,
        isMyCardLoading,
        myCardError,
        isLoading,
        error,
        allCards: data ?? [],
    };
}


