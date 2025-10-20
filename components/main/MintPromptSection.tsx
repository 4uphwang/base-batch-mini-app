"use client";

interface MintPromptSectionProps {
    onMintClick: () => void;
}

export default function MintPromptSection({ onMintClick }: MintPromptSectionProps) {

    return (
        <div className="bg-white  text-black flex flex-col justify-center items-center p-5">
            <h2 className="font-semibold text-3xl">Onchain Social<br />Business Card</h2>
            <div className="w-full px-5 py-5">
                <div className="w-full aspect-video bg-gray-400 rounded-2xl">

                </div>
            </div>
            <button onClick={onMintClick} className="w-full py-3 bg-button-1 rounded-lg text-white">Mint your Card</button>
        </div>
    )
}