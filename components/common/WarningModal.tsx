import React from "react";

interface WarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    buttonText?: string;
}

export default function WarningModal({
    isOpen,
    onClose,
    title = "Warning",
    description = "Please check your input.",
    buttonText = "OK",
}: WarningModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
            <div
                className="relative w-[320px] min-h-[260px] bg-[#FFFEF9]/95 rounded-lg p-6 flex flex-col justify-between"
                style={{
                    boxShadow: "0px 4px 6px rgba(230, 228, 225, 0.25)",
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
                    {/* Warning Icon */}
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-yellow-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-yellow-600">
                        {title}
                    </h2>

                    <p className="text-gray-600 text-sm leading-relaxed px-2">
                        {description}
                    </p>
                </div>

                {/* OK button */}
                <button
                    onClick={onClose}
                    className="w-full bg-yellow-600 text-white py-3 rounded-xl font-semibold text-base hover:bg-yellow-700 transition-colors"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}
