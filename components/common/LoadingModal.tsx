import React from "react";

interface LoadingModalProps {
    isOpen: boolean;
    title?: string;
    description?: string;
    showSpinner?: boolean;
}

export default function LoadingModal({
    isOpen,
    title = "Processing...",
    description = "Please wait while we process your transaction",
    showSpinner = true,
}: LoadingModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
            <div
                className="relative w-[320px] h-[300px] bg-[#F9F9FF]/95 rounded-lg p-6 flex flex-col justify-center items-center"
                style={{
                    boxShadow: "0px 4px 6px rgba(225, 228, 230, 0.25)",
                }}
            >
                {/* Content */}
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                    {/* Spinner */}
                    {showSpinner && (
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-[#0050FF]/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-transparent border-t-[#0050FF] rounded-full animate-spin"></div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold text-[#0050FF]">
                            {title}
                        </h2>

                        <p className="text-gray-600 text-sm leading-relaxed px-2">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
