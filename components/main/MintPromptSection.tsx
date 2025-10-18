"use client";

interface MintPromptSectionProps {
    onMintClick: () => void;
}

export default function MintPromptSection({ onMintClick }: MintPromptSectionProps) {

    return (
        <div className="bg-white  text-black flex flex-col justify-center items-center p-5">
            <h2 className="font-semibold text-3xl">Mint Your BaseCard</h2>
            <p className="text-lg font-medium text-gray-400">Everyone can be a builder</p>
            <div className="w-full px-5 py-5">
                <div className="w-full aspect-video bg-gray-400">
                    card
                </div>
            </div>
            <button onClick={onMintClick} className="w-full py-3 bg-gray-800 rounded-lg text-white">Mint your Card</button>
        </div>
    )
}