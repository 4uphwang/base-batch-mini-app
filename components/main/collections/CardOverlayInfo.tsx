import { Card } from "@/lib/types";

interface CardOverlayInfoProps {
    card: Card;
}

const CardOverlayInfo: React.FC<CardOverlayInfoProps> = ({ card }) => {
    return (
        <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 animate-fade-in"
            style={{ textAlign: 'right' }}>
            {/* <h3 className="font-k2d-bold text-lg text-white truncate">
                {card.nickname}
            </h3>
            <p className="text-sm text-white font-k2d-regular truncate">
                {card.basename || card.address}
            </p>
            {card.role && (
                <p className="text-sm text-blue-300 font-k2d-medium mt-1">
                    {card.role}
                </p>
            )} */}
            {card.skills && card.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2 justify-end">
                    {card.skills.slice(0, 3).map((skill: string, idx: number) => (
                        <span
                            key={idx}
                            className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white rounded text-xs font-k2d-regular"
                        >
                            {skill}
                        </span>
                    ))}
                    {card.skills.length > 3 && (
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white rounded text-xs font-k2d-regular">
                            +{card.skills.length - 3}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default CardOverlayInfo;