import React from "react";

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    buttonText?: string;
}

export default function ErrorModal({
    isOpen,
    onClose,
    title = "Error Occurred",
    description = "Something went wrong. Please try again.",
    buttonText = "Close",
}: ErrorModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
            <div
                className="relative w-[320px] min-h-[280px] bg-[#FFF9F9]/95 rounded-lg p-6 flex flex-col justify-between"
                style={{
                    boxShadow: "0px 4px 6px rgba(230, 225, 225, 0.25)",
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
                    {/* Error Icon */}
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-red-600">{title}</h2>

                    <p className="text-gray-600 text-sm leading-relaxed px-2">
                        {description}
                    </p>
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold text-base hover:bg-red-700 transition-colors"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}
