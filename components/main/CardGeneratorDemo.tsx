"use client";

import { useState } from "react";
import { useCardGeneration } from "@/hooks/useCardGeneration";
import Image from "next/image";

export default function CardGeneratorDemo() {
    const [nickname, setNickname] = useState("My Nickname");
    const [role, setRole] = useState("Base Developer");
    const [basename, setBasename] = useState("@basename");
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

    const {
        generateCard,
        isGenerating,
        error: generationError,
        result,
    } = useCardGeneration();

    const generatedSvg = result?.svg || null;

    // SVG 다운로드 함수
    const downloadSvg = () => {
        if (!generatedSvg) return;

        const blob = new Blob([generatedSvg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `basecard-${nickname
            .replace(/\s+/g, "-")
            .toLowerCase()}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // PNG로 변환 및 다운로드 함수
    const downloadPng = () => {
        if (!generatedSvg) return;

        const blob = new Blob([generatedSvg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const img = document.createElement("img");

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");

            if (ctx) {
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const pngUrl = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = pngUrl;
                        link.download = `basecard-${nickname
                            .replace(/\s+/g, "-")
                            .toLowerCase()}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(pngUrl);
                    }
                }, "image/png");
            }
            URL.revokeObjectURL(url);
        };

        img.src = url;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!profileImageFile) {
            alert("Please select a profile image");
            return;
        }

        if (!nickname || !role) {
            alert("Please fill in all required fields");
            return;
        }

        try {
            // Generate card without IPFS upload (demo mode)
            const result = await generateCard(
                {
                    name: nickname,
                    role,
                    baseName: basename,
                    profileImage: profileImageFile,
                },
                false // Disable IPFS for demo
            );

            if (result.success) {
                console.log("Card generated successfully:", result);
            } else {
                throw new Error(result.error || "Failed to generate card");
            }
        } catch (error) {
            console.error("Card generation error:", error);
            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to generate card"
            );
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    BaseCard Generator
                </h1>
                <p className="text-lg text-gray-600">
                    Create your personalized onchain business card with
                    server-side SVG generation
                </p>
            </div>

            <div
                className={`grid gap-x-30 ${
                    generatedSvg
                        ? "grid-cols-1 lg:grid-cols-2"
                        : "grid-cols-1 lg:grid-cols-2"
                }`}
            >
                {" "}
                {/* Form Controls */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                            Card Information
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Profile Image with Preview */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Profile Image*
                                </label>
                                <div className="flex items-center gap-4">
                                    {profileImageFile && (
                                        <div className="w-20 h-20 rounded-lg border overflow-hidden">
                                            <Image
                                                src={URL.createObjectURL(
                                                    profileImageFile
                                                )}
                                                alt="profile preview"
                                                width={80}
                                                height={80}
                                                className="w-20 h-20 object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg"
                                            onChange={(e) =>
                                                setProfileImageFile(
                                                    e.target.files?.[0] || null
                                                )
                                            }
                                            required
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            PNG, JPEG (max 5MB)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Input fields for text data */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nickname*
                                </label>
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={(e) =>
                                        setNickname(e.target.value)
                                    }
                                    placeholder="Enter your nickname"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role*
                                </label>
                                <input
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder="Your professional role"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Base Name*
                                </label>
                                <input
                                    type="text"
                                    value={basename}
                                    onChange={(e) =>
                                        setBasename(e.target.value)
                                    }
                                    placeholder="@yourname.base"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Status Messages */}
                            {generationError && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                                    <p className="text-red-700 text-sm">
                                        {generationError}
                                    </p>
                                </div>
                            )}

                            {result?.success && !result.ipfs && (
                                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                                    <p className="text-green-700 text-sm">
                                        ✓ Card generated successfully!
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isGenerating}
                                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                                    isGenerating
                                        ? "bg-gray-400 text-white cursor-not-allowed"
                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                            >
                                {isGenerating
                                    ? "Generating..."
                                    : "Generate Card"}
                            </button>
                        </form>
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            How it works:
                        </h3>
                        <ol className="space-y-2 text-sm text-gray-700">
                            <li className="flex gap-2">
                                <span className="font-semibold text-blue-600">
                                    1.
                                </span>
                                <span>Upload your profile image</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-semibold text-blue-600">
                                    2.
                                </span>
                                <span>Fill in your card information</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-semibold text-blue-600">
                                    3.
                                </span>
                                <span>
                                    Click &quot;Generate Card&quot; to create
                                    your BaseCard
                                </span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-semibold text-blue-600">
                                    4.
                                </span>
                                <span>
                                    Preview and download your card as SVG or PNG
                                </span>
                            </li>
                        </ol>
                        <div className="mt-4 pt-4 border-t border-blue-200">
                            <p className="text-xs text-blue-700">
                                💡 This is a demo page. For production minting
                                with IPFS, use the main mint page.
                            </p>
                        </div>
                    </div>
                </div>
                {/* Card Preview */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Generated Card Preview
                    </h2>
                    {generatedSvg ? (
                        <>
                            <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: generatedSvg,
                                    }}
                                    className="w-full h-auto"
                                />
                            </div>

                            {/* Download Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={downloadSvg}
                                    className="flex-1 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                        />
                                    </svg>
                                    Download SVG
                                </button>
                                <button
                                    onClick={downloadPng}
                                    className="flex-1 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                        />
                                    </svg>
                                    Download PNG
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
                            <p>Generate a card to see the preview</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
