import { Card } from "@/lib/types";
import CardItem from "@/components/main/collections/CardItem";
import { useOpenUrl } from "@coinbase/onchainkit/minikit";

interface CollectionListProps {
    cards: Card[];
    openUrl: (url: string) => void;
    setCardRef: (id: number, element: HTMLDivElement | null) => void;
}

export function CollectionList({ cards, openUrl, setCardRef }: CollectionListProps) {
    if (cards.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-3">
            {cards.map((card) => (
                <CardItem
                    key={card.id}
                    activeCardId={card.id}
                    card={card}
                    openUrl={openUrl}
                    setCardRef={setCardRef}
                />
            ))}
        </div>
    );
}

