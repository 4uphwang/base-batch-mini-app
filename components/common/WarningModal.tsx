import { IoClose, IoWarningOutline } from "react-icons/io5";

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
                    aria-label="Close modal"
                    className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <IoClose size={24} />
                </button>

                {/* Content */}
                <div className="flex flex-col items-center justify-center flex-1 text-center space-y-4 pt-4">
                    {/* Warning Icon */}
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                        <IoWarningOutline className=" text-yellow-400 mb-1" size={48} />
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
                    className="w-full bg-yellow-600 text-white py-3 rounded-xl font-semibold text-base hover:bg-yellow-700 transition-colors mt-2"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}
