"use client";

import { useState, type FormEvent } from "react";

export default function CardGeneratorDemo() {
    const [nickname, setNickname] = useState("My Nickname");
    const [role, setRole] = useState("Base Developer");
    const [basename, setBasename] = useState("@basename");
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

    const [status, setStatus] = useState("");
    const [generatedSvg, setGeneratedSvg] = useState<string | null>(null);

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
        const img = new Image();

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

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!profileImageFile) {
            setStatus("Please select a profile image.");
            return;
        }

        setStatus("Generating SVG on the server...");
        setGeneratedSvg(null);

        // FormData를 사용해 파일과 텍스트를 함께 보냅니다.
        const formData = new FormData();
        formData.append("nickname", nickname);
        formData.append("role", role);
        formData.append("basename", basename);
        formData.append("profileImage", profileImageFile);

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                body: formData, // JSON.stringify가 아님!
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to generate SVG.");
            }

            // 서버로부터 완성된 SVG 문자열을 받습니다.
            const svgString = await response.text();
            setGeneratedSvg(svgString);
            setStatus("SVG generated successfully!");
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred";
            setStatus(`Error: ${errorMessage}`);
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
                            {/* Input fields for text data */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nickname
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
                                    Role
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
                                    Base Name
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

                            {/* File input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Profile Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    onChange={(e) =>
                                        setProfileImageFile(
                                            e.target.files?.[0] || null
                                        )
                                    }
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Supported formats: PNG, JPEG
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                            >
                                Generate Card
                            </button>
                        </form>

                        {/* Status */}
                        {status && (
                            <div
                                className={`mt-4 p-3 rounded-lg ${
                                    status.includes("Error")
                                        ? "bg-red-100 text-red-700"
                                        : status.includes("successfully")
                                        ? "bg-green-100 text-green-700"
                                        : "bg-blue-100 text-blue-700"
                                }`}
                            >
                                {status}
                            </div>
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-800 mb-3">
                            How it works:
                        </h3>
                        <ol className="space-y-2 text-sm text-gray-600">
                            <li>1. Fill in your card information</li>
                            <li>2. Upload a profile image</li>
                            <li>
                                3. Click &quot;Generate Card&quot; to create
                                your BaseCard
                            </li>
                            <li>
                                4. The server will generate a custom SVG using
                                the basecard-base.svg template
                            </li>
                            <li>
                                5. Your personalized card will appear in the
                                preview
                            </li>
                            <li>6. Download your card as SVG or PNG format</li>
                        </ol>
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
