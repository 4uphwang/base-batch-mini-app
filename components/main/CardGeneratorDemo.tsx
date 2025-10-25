"use client";

import { useCardGeneration } from "@/hooks/useCardGeneration";
import { useMintBaseCard } from "@/hooks/useMintBaseCard";
import { executeCardMintFlow } from "@/lib/cardMintingFlow";
import { convertFileToBase64DataURL } from "@/lib/imageUtils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function CardGeneratorDemo() {
    const { address: connectedAddress } = useAccount();

    const [nickname, setNickname] = useState("My Nickname");
    const [role, setRole] = useState("Base Developer");
    const [basename, setBasename] = useState("@basename");
    const [bio, setBio] = useState("");
    const [address, setAddress] = useState<string>(connectedAddress || "");

    // 연결된 주소가 변경되면 자동으로 업데이트
    useEffect(() => {
        if (connectedAddress) {
            setAddress(connectedAddress);
        }
    }, [connectedAddress]);
    const [twitter, setTwitter] = useState("");
    const [github, setGithub] = useState("");
    const [farcaster, setFarcaster] = useState("");
    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState("");
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isMinting, setIsMinting] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [mintSuccess, setMintSuccess] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [mintError, setMintError] = useState<string | null>(null);
    const [savedCard, setSavedCard] = useState<{
        id: number;
        nickname: string;
        role: string;
        basename: string;
        address: string;
        bio?: string;
        imageURI: string;
        profileImage?: string;
        skills?: string[];
    } | null>(null);
    const [mintHash, setMintHash] = useState<string | null>(null);

    const {
        generateCard,
        isGenerating,
        error: generationError,
        result,
    } = useCardGeneration();

    const {
        mintCard,
        isPending: isMintPending,
        isConfirming: isMintConfirming,
        isSuccess: isMintSuccess,
        error: useMintError,
    } = useMintBaseCard();

    const generatedSvg = result?.svg || null;

    // Skills 관리 함수
    const addSkill = () => {
        if (
            skillInput.trim() &&
            skills.length < 5 &&
            !skills.includes(skillInput.trim())
        ) {
            setSkills([...skills, skillInput.trim()]);
            setSkillInput("");
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter((skill) => skill !== skillToRemove));
    };

    // DB에 카드 저장하는 함수
    const saveCardToDatabase = async () => {
        if (!profileImageFile) {
            alert("Please generate card with IPFS upload first");
            return;
        }

        if (!address) {
            alert("Please enter wallet address");
            return;
        }

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            // File을 base64 data URL로 변환
            const profileImageDataURL = await convertFileToBase64DataURL(
                profileImageFile
            );

            const response = await fetch("/api/cards", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nickname,
                    role,
                    bio,
                    imageURI: "ipfs://dummyhash",
                    basename,
                    skills,
                    address,
                    profileImage: profileImageDataURL, // data:image/...;base64,... 형식
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save card");
            }

            const savedCardData = await response.json();
            console.log("Card saved successfully:", savedCardData);
            setSavedCard(savedCardData);
            setSaveSuccess(true);
        } catch (error) {
            console.error("Save card error:", error);
            const errorMessage =
                error instanceof Error ? error.message : "Failed to save card";
            setSaveError(errorMessage);
            alert(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    // NFT 민팅 함수 (전체 플로우)
    const mintNFT = async () => {
        if (!profileImageFile) {
            alert("Please select a profile image");
            return;
        }

        if (!address) {
            alert("Please enter wallet address");
            return;
        }

        if (!nickname || !role) {
            alert("Please fill in nickname and role");
            return;
        }

        setIsMinting(true);
        setMintError(null);
        setMintSuccess(false);
        setMintHash(null);

        try {
            const result = await executeCardMintFlow(
                {
                    name: nickname,
                    role,
                    bio,
                    baseName: basename,
                    address,
                    profileImageFile,
                    skills,
                    socials: {
                        twitter,
                        github,
                        farcaster,
                    },
                },
                generateCard,
                mintCard
            );

            if (result.success) {
                console.log("✅ NFT minted successfully!", result.data);
                setMintSuccess(true);
                setMintHash(result.data?.mintHash || null);
                setSavedCard({
                    id: result.data?.cardId || 0,
                    nickname,
                    role,
                    basename,
                    address,
                    bio,
                    imageURI: `ipfs://${result.data?.ipfsCid}`,
                    skills,
                });
            } else {
                throw new Error(result.error || "Minting failed");
            }
        } catch (error) {
            console.error("Mint NFT error:", error);
            const errorMessage =
                error instanceof Error ? error.message : "Failed to mint NFT";
            setMintError(errorMessage);
            alert(errorMessage);
        } finally {
            setIsMinting(false);
        }
    };

    // Contract call만 테스트하는 함수 (Mock 데이터 사용)
    const testContractCall = async () => {
        // 연결된 주소 우선 사용, 없으면 입력된 주소 사용
        const addressToUse = connectedAddress || address;

        if (!addressToUse) {
            alert("Please connect your wallet or enter wallet address");
            return;
        }

        setIsMinting(true);
        setMintError(null);
        setMintSuccess(false);
        setMintHash(null);

        try {
            // Mock 데이터 생성 (컨트랙트 허용 키 사용)
            const mockMintData = {
                imageURI: "ipfs://QmTestMockHash123456789012345678901234567890",
                nickname: "Test User",
                role: "Developer",
                bio: "This is a test mint using mock data",
                basename: "@testuser",
                socials: {
                    x: "@testuser", // ✅ 허용됨
                    github: "testuser", // ✅ 허용됨
                    farcaster: "testuser", // ✅ 허용됨
                },
                ipfsId: "mock-ipfs-id-123",
                userAddress: addressToUse,
            };

            console.log(
                "🧪 Testing contract call with mock data:",
                mockMintData
            );

            const result = await mintCard(mockMintData);

            if (result.success) {
                console.log("✅ Contract call successful!", result);
                setMintSuccess(true);
                setMintHash(result.hash || null);
            } else {
                throw new Error(result.error || "Contract call failed");
            }
        } catch (error) {
            console.error("Contract call error:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to call contract";
            setMintError(errorMessage);
            alert(errorMessage);
        } finally {
            setIsMinting(false);
        }
    };

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
            // Generate card WITH IPFS upload (enabled for DB saving)
            const result = await generateCard(
                {
                    name: nickname,
                    role,
                    baseName: basename,
                    profileImage: profileImageFile,
                },
                false // Enable IPFS for DB saving
            );

            if (result.success) {
                console.log("Card generated successfully:", result);
                if (result.ipfs) {
                    console.log("IPFS CID:", result.ipfs.cid);
                    console.log("IPFS URL:", result.ipfs.url);
                }
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
                    BaseCard Generator & Minting Demo
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                    Create your personalized onchain business card with
                    server-side SVG generation + IPFS + Database + NFT Minting
                </p>
                <p className="text-sm text-blue-600 font-medium mb-1">
                    Test the complete flow: Generate → Upload to IPFS → Save to
                    DB → Mint NFT
                </p>
                <p className="text-sm text-purple-600 font-medium">
                    🎨 NEW: Full minting flow testing available!
                </p>
            </div>

            <div
                className={`grid gap-x-30 ${generatedSvg
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bio
                                </label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell us about yourself..."
                                    rows={3}
                                    maxLength={500}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {bio.length}/500 characters
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Wallet Address* (for DB save & Minting)
                                </label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="0x1234567890123456789012345678901234567890"
                                    pattern="^0x[a-fA-F0-9]{40}$"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {connectedAddress
                                        ? `✅ Connected: ${connectedAddress.slice(
                                            0,
                                            6
                                        )}...${connectedAddress.slice(-4)}`
                                        : "⚠️ Please connect your wallet for minting NFT"}
                                </p>
                                {connectedAddress && (
                                    <p className="text-xs text-green-600 mt-1">
                                        🎯 Will use connected wallet address for
                                        contract calls
                                    </p>
                                )}
                            </div>

                            {/* Social Links */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Social Links (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={twitter}
                                    onChange={(e) => setTwitter(e.target.value)}
                                    placeholder="Twitter / X handle"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                                <input
                                    type="text"
                                    value={github}
                                    onChange={(e) => setGithub(e.target.value)}
                                    placeholder="GitHub username"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                                <input
                                    type="text"
                                    value={farcaster}
                                    onChange={(e) =>
                                        setFarcaster(e.target.value)
                                    }
                                    placeholder="Farcaster username"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Skills (max 5)
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) =>
                                            setSkillInput(e.target.value)
                                        }
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                addSkill();
                                            }
                                        }}
                                        placeholder="Add a skill"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={skills.length >= 5}
                                    />
                                    <button
                                        type="button"
                                        onClick={addSkill}
                                        disabled={skills.length >= 5}
                                        className={`px-4 py-2 rounded-lg font-medium ${skills.length >= 5
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-blue-500 text-white hover:bg-blue-600"
                                            }`}
                                    >
                                        Add
                                    </button>
                                </div>
                                {skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm"
                                            >
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeSkill(skill)
                                                    }
                                                    className="text-blue-700 hover:text-blue-900"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Status Messages */}
                            {generationError && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                                    <p className="text-red-700 text-sm">
                                        ❌ Generation Error: {generationError}
                                    </p>
                                </div>
                            )}

                            {saveError && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                                    <p className="text-red-700 text-sm">
                                        ❌ Save Error: {saveError}
                                    </p>
                                </div>
                            )}

                            {mintError && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                                    <p className="text-red-700 text-sm">
                                        ❌ Mint Error: {mintError}
                                    </p>
                                </div>
                            )}

                            {useMintError && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                                    <p className="text-red-700 text-sm">
                                        ❌ Transaction Error: {useMintError}
                                    </p>
                                </div>
                            )}

                            {result?.success && result.ipfs && (
                                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                                    <p className="text-green-700 text-sm font-medium mb-2">
                                        ✓ Card generated successfully with IPFS!
                                    </p>
                                    <p className="text-green-600 text-xs break-all">
                                        CID: {result.ipfs.cid}
                                    </p>
                                </div>
                            )}

                            {saveSuccess && (
                                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                                    <p className="text-green-700 text-sm font-medium">
                                        ✓ Card saved to database successfully!
                                    </p>
                                </div>
                            )}

                            {mintSuccess && mintHash && (
                                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                                    <p className="text-green-700 text-sm font-medium mb-2">
                                        🎉 NFT minted successfully!
                                    </p>
                                    <p className="text-green-600 text-xs break-all">
                                        Hash: {mintHash}
                                    </p>
                                </div>
                            )}

                            {isMintPending && (
                                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                                    <p className="text-blue-700 text-sm">
                                        ⏳ Preparing transaction...
                                    </p>
                                </div>
                            )}

                            {isMintConfirming && (
                                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                                    <p className="text-blue-700 text-sm">
                                        ⏳ Confirming transaction...
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-2">
                                <button
                                    type="submit"
                                    disabled={isGenerating}
                                    className={`w-full py-3 rounded-lg font-medium transition-colors ${isGenerating
                                        ? "bg-gray-400 text-white cursor-not-allowed"
                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                        }`}
                                >
                                    {isGenerating
                                        ? "Generating & Uploading to IPFS..."
                                        : "Generate Card (with IPFS)"}
                                </button>

                                {result?.success && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={saveCardToDatabase}
                                            disabled={isSaving || !address}
                                            className={`w-full py-3 rounded-lg font-medium transition-colors ${isSaving || !address
                                                ? "bg-gray-400 text-white cursor-not-allowed"
                                                : "bg-green-500 text-white hover:bg-green-600"
                                                }`}
                                        >
                                            {isSaving
                                                ? "Saving to Database..."
                                                : "Save to Database"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={mintNFT}
                                            disabled={
                                                isMinting ||
                                                isMintPending ||
                                                isMintConfirming ||
                                                !address ||
                                                !connectedAddress
                                            }
                                            className={`w-full py-3 rounded-lg font-medium transition-colors ${isMinting ||
                                                isMintPending ||
                                                isMintConfirming ||
                                                !address ||
                                                !connectedAddress
                                                ? "bg-gray-400 text-white cursor-not-allowed"
                                                : "bg-purple-500 text-white hover:bg-purple-600"
                                                }`}
                                        >
                                            {isMinting
                                                ? "Minting NFT (Complete Flow)..."
                                                : isMintPending
                                                    ? "Preparing Transaction..."
                                                    : isMintConfirming
                                                        ? "Confirming..."
                                                        : isMintSuccess
                                                            ? "✓ Minted!"
                                                            : "🎨 Mint NFT (Full Flow)"}
                                        </button>

                                        {!connectedAddress && (
                                            <p className="text-xs text-center text-amber-600">
                                                ⚠️ Please connect your wallet to
                                                mint NFT
                                            </p>
                                        )}
                                    </>
                                )}

                                {/* Contract Call Test Button */}
                                <button
                                    type="button"
                                    onClick={testContractCall}
                                    disabled={
                                        isMinting ||
                                        isMintPending ||
                                        isMintConfirming ||
                                        (!connectedAddress && !address)
                                    }
                                    className={`w-full py-3 rounded-lg font-medium transition-colors ${isMinting ||
                                        isMintPending ||
                                        isMintConfirming ||
                                        (!connectedAddress && !address)
                                        ? "bg-gray-400 text-white cursor-not-allowed"
                                        : "bg-orange-500 text-white hover:bg-orange-600"
                                        }`}
                                >
                                    {isMinting
                                        ? "Testing Contract Call..."
                                        : isMintPending
                                            ? "Preparing Transaction..."
                                            : isMintConfirming
                                                ? "Confirming..."
                                                : connectedAddress
                                                    ? "🧪 Test Contract Call (Connected Wallet)"
                                                    : "🧪 Test Contract Call (Mock Data)"}
                                </button>

                                {!connectedAddress && !address && (
                                    <p className="text-xs text-center text-amber-600">
                                        ⚠️ Please connect your wallet or enter
                                        address to test contract calls
                                    </p>
                                )}
                            </div>
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
                                <span>
                                    Upload your profile image (PNG/JPEG)
                                </span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-semibold text-blue-600">
                                    2.
                                </span>
                                <span>
                                    Fill in all card information (nickname,
                                    role, bio, address, skills, socials)
                                </span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-semibold text-blue-600">
                                    3.
                                </span>
                                <span>
                                    Click &quot;Generate Card&quot; to create
                                    BaseCard and upload to IPFS
                                </span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-semibold text-blue-600">
                                    4a.
                                </span>
                                <span>
                                    (Optional) Click &quot;Save to
                                    Database&quot; to test DB storage only
                                </span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-semibold text-blue-600">
                                    4b.
                                </span>
                                <span>
                                    <strong>
                                        Click &quot;Mint NFT (Full Flow)&quot;
                                    </strong>{" "}
                                    to execute complete flow: Generate → IPFS →
                                    DB → Mint NFT
                                </span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-semibold text-orange-600">
                                    4c.
                                </span>
                                <span>
                                    <strong>
                                        Click &quot;Test Contract Call (Mock
                                        Data)&quot;
                                    </strong>{" "}
                                    to test smart contract interaction only
                                </span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-semibold text-blue-600">
                                    5.
                                </span>
                                <span>
                                    Preview and download your card as SVG or PNG
                                </span>
                            </li>
                        </ol>
                        <div className="mt-4 pt-4 border-t border-blue-200">
                            <p className="text-xs text-blue-700 mb-2">
                                💡 This demo page tests the COMPLETE flow: SVG
                                generation → IPFS upload → DB storage → NFT
                                Minting
                            </p>
                            <p className="text-xs text-blue-700 mb-2">
                                🔑 The profile image is converted to SVG and
                                stored as base64 in the database
                            </p>
                            <p className="text-xs text-purple-700 font-semibold mb-2">
                                🎨 NEW: Test the full minting flow including NFT
                                creation!
                            </p>
                            <p className="text-xs text-orange-700 font-semibold">
                                🧪 NEW: Test smart contract calls with mock
                                data!
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
                            {/* IPFS Info */}
                            {result?.ipfs && (
                                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                    <h3 className="font-semibold text-purple-900 mb-2 text-sm">
                                        📦 IPFS Upload Info
                                    </h3>
                                    <div className="space-y-1 text-xs">
                                        <div>
                                            <span className="font-medium text-purple-700">
                                                CID:{" "}
                                            </span>
                                            <span className="text-gray-700 font-mono break-all">
                                                {result.ipfs.cid}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-purple-700">
                                                URL:{" "}
                                            </span>
                                            <a
                                                href={result.ipfs.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline break-all"
                                            >
                                                {result.ipfs.url}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

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
                {/* Saved Card from Database */}
                {savedCard && (
                    <div className="col-span-1 lg:col-span-2 space-y-4 mt-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Saved Card from Database
                            </h2>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                ✓ Saved
                            </span>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-lg p-6 border-2 border-green-200">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Profile Image from DB */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-800 text-lg">
                                        Profile Image (Base64)
                                    </h3>
                                    <div className="bg-white rounded-lg p-4 shadow-md">
                                        {savedCard.profileImage ? (
                                            <Image
                                                src={savedCard.profileImage}
                                                alt={`${savedCard.nickname}'s profile`}
                                                width={400}
                                                height={400}
                                                className="w-full h-auto rounded-lg"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="text-gray-500 text-center py-8">
                                                No profile image saved
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-gray-100 rounded p-2">
                                        <p className="text-xs text-gray-600 font-mono break-all">
                                            {savedCard.profileImage
                                                ? `${savedCard.profileImage.substring(
                                                    0,
                                                    100
                                                )}...`
                                                : "N/A"}
                                        </p>
                                    </div>
                                </div>

                                {/* Card Data */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-800 text-lg">
                                        Card Data
                                    </h3>
                                    <div className="bg-white rounded-lg p-4 shadow-md space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">
                                                ID
                                            </label>
                                            <p className="text-gray-900 font-mono">
                                                {savedCard.id}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">
                                                Nickname
                                            </label>
                                            <p className="text-gray-900 font-semibold">
                                                {savedCard.nickname}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">
                                                Role
                                            </label>
                                            <p className="text-gray-900">
                                                {savedCard.role}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">
                                                Basename
                                            </label>
                                            <p className="text-gray-900">
                                                {savedCard.basename}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">
                                                Wallet Address
                                            </label>
                                            <p className="text-gray-900 font-mono text-sm break-all">
                                                {savedCard.address}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">
                                                Bio
                                            </label>
                                            <p className="text-gray-700 text-sm">
                                                {savedCard.bio || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">
                                                Image URI (IPFS)
                                            </label>
                                            <p className="text-gray-900 font-mono text-sm break-all">
                                                {savedCard.imageURI}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">
                                                Skills
                                            </label>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {savedCard.skills &&
                                                    savedCard.skills.length > 0 ? (
                                                    savedCard.skills.map(
                                                        (
                                                            skill: string,
                                                            index: number
                                                        ) => (
                                                            <span
                                                                key={index}
                                                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm"
                                                            >
                                                                {skill}
                                                            </span>
                                                        )
                                                    )
                                                ) : (
                                                    <span className="text-gray-500 text-sm">
                                                        No skills
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Success Message */}
                            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                                <p className="text-green-800 text-sm font-medium text-center">
                                    🎉 Card successfully saved to database with
                                    base64 encoded profile image!
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
