import React from "react";

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    transactionHash?: string;
    buttonText?: string;
}

export default function SuccessModal({
    isOpen,
    onClose,
    title = "Successfully Minted",
    description = "For now you can check your Base Card and transaction data",
    transactionHash,
    buttonText = "Okay",
}: SuccessModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
            <div
                className="relative w-[320px] h-[300px] bg-[#F9F9FF]/95 rounded-lg p-6 flex flex-col justify-between"
                style={{
                    boxShadow: "0px 4px 6px rgba(225, 228, 230, 0.25)",
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close modal"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                {/* Content */}
                <div className="flex flex-col items-center justify-center flex-1 text-center space-y-4 pt-4">
                    <h2 className="text-2xl font-bold text-[#0050FF]">
                        {title}
                    </h2>

                    <p className="text-gray-600 text-sm leading-relaxed px-2">
                        {description}
                    </p>

                    {/* View link */}
                    {transactionHash && (
                        <a
                            href={`https://basescan.org/tx/${transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#0050FF] hover:underline text-sm font-medium"
                        >
                            Open viewer
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                            >
                                <path
                                    d="M6 12l4-4-4-4"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </a>
                    )}
                </div>

                {/* Okay button */}
                <button
                    onClick={onClose}
                    className="w-full bg-black text-white py-3 rounded-xl font-semibold text-base hover:bg-gray-800 transition-colors"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}
