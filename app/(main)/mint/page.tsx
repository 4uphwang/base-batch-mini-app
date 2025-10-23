"use client";

import { useAtom } from "jotai";
import { useState, useEffect } from "react";

import { userProfileAtom } from "@/store/userProfileState";
import { useCardGeneration } from "@/hooks/useCardGeneration";
import { useMintBaseCard } from "@/hooks/useMintBaseCard";

import BackButton from "@/components/common/BackButton";
import SuccessModal from "@/components/common/SuccessModal";
import ErrorModal from "@/components/common/ErrorModal";
import WarningModal from "@/components/common/WarningModal";
import LoadingModal from "@/components/common/LoadingModal";
import {
    FloatingInput,
    FloatingLabel,
} from "@/components/ui/floating-label-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

const MAX_SKILLS = 8;
const MAX_WEBSITES = 3;
const ALL_SKILLS = [
    "Solidity",
    "Rust",
    "Security",
    "Javascript",
    "Typescript",
    "Go",
    "Game development",
    "Data",
    "UI/UX",
    "Prototyping",
    "Research",
    "Music",
    "Illustration",
    "Writing",
    "Video",
    "Graphic design",
    "Animation",
    "Visual design",
    "Design",
    "Digital art",
    "Photography",
    "Community",
    "Product management",
    "Strategy",
    "Business development",
    "Legal",
    "Marketing",
];

interface SkillTagProps {
    skill: string;
    isSelected: boolean;
    onClick: () => void;
}

const SkillTag = ({ skill, isSelected, onClick }: SkillTagProps) => {
    const baseClasses =
        "py-1 px-3 text-sm rounded-full transition-colors duration-150 flex items-center";
    const selectedClasses =
        "bg-[#DFE9FF] text-primary-1 border border-primary-1";
    const defaultClasses =
        "bg-background-light-2 text-gray-700 hover:bg-gray-200 border border-transparent";

    return (
        <button
            type="button"
            onClick={onClick}
            className={`${baseClasses} ${
                isSelected ? selectedClasses : defaultClasses
            }`}
        >
            <span>{skill}</span>
            <span className="ml-1 text-xs  font-bold w-2">
                {isSelected ? "✕" : "+"}
            </span>
        </button>
    );
};

export default function Mint() {
    const router = useRouter();
    const [userProfile] = useAtom(userProfileAtom);
    const username = userProfile.username;

    const { address } = useAccount();

    // Card generation hook
    const {
        generateCard,
        isGenerating,
        error: generationError,
    } = useCardGeneration();

    // NFT minting hook
    const {
        mintCard,
        isPending: isMintPending,
        isConfirming: isMintConfirming,
        isSuccess: isMintSuccess,
        hash: mintHash,
        error: mintError,
        hasMinted,
    } = useMintBaseCard(address);

    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [bio, setBio] = useState("");
    const [github, setGithub] = useState("");
    const [facaster, setFacaster] = useState("");
    const [twitter, setTwitter] = useState("");
    const [websites, setWebsites] = useState<string[]>([]);
    const [newWebsite, setNewWebsite] = useState("");
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [isBaseNameIncluded, setIsBaseNameIncluded] = useState(false);
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        title: "Error Occurred",
        description: "Something went wrong. Please try again.",
    });
    const [warningMessage, setWarningMessage] = useState({
        title: "Warning",
        description: "Please check your input.",
    });

    // Show success modal when minting is successful
    useEffect(() => {
        if (isMintSuccess) {
            setShowSuccessModal(true);
        }
    }, [isMintSuccess]);

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        router.push("/mycard");
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };

    const handleCloseWarningModal = () => {
        setShowWarningModal(false);
    };

    const showError = (title: string, description: string) => {
        setErrorMessage({ title, description });
        setShowErrorModal(true);
    };

    const showWarning = (title: string, description: string) => {
        setWarningMessage({ title, description });
        setShowWarningModal(true);
    };

    const toggleSkill = (skill: string) => {
        setSelectedSkills((prev) => {
            if (prev.includes(skill)) {
                // 이미 선택된 경우 제거
                return prev.filter((s) => s !== skill);
            } else {
                // 선택되지 않은 경우 추가 (최대 개수 확인)
                if (prev.length >= MAX_SKILLS) {
                    // 사용자에게 명확히 알림
                    showWarning(
                        "Maximum Skills Reached",
                        `You can select up to ${MAX_SKILLS} skills. Please deselect a skill to add a new one.`
                    );
                    return prev; // 추가하지 않고 기존 배열 반환
                }
                return [...prev, skill];
            }
        });
    };

    const handleAddWebsite = () => {
        const urlToAdd = newWebsite.trim();
        if (!urlToAdd) return;
        if (websites.includes(urlToAdd)) return;
        if (websites.length < MAX_WEBSITES) {
            setWebsites((prev) => [...prev, urlToAdd]);
            setNewWebsite("");
        }
    };

    const handleRemoveWebsite = (urlToRemove: string) => {
        setWebsites((prev) => prev.filter((url) => url !== urlToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!profileImageFile) {
            showError(
                "Profile Image Required",
                "Please upload a profile image to continue."
            );
            return;
        }

        if (!name || !role) {
            showError(
                "Required Fields Missing",
                "Please fill in your name and role to continue."
            );
            return;
        }

        try {
            // Generate card with IPFS upload enabled
            const result = await generateCard(
                {
                    name,
                    role,
                    baseName:
                        isBaseNameIncluded && username ? username : "@basename",
                    profileImage: profileImageFile,
                },
                true // uploadToIpfs = true
            );

            if (result.success) {
                console.log("✅ Card generated: ", result.success);

                // IPFS 업로드 결과 확인 (새로운 타입 시스템)
                if (result.ipfs && result.ipfs.cid && result.ipfs.url) {
                    console.log("✅ IPFS Upload successful:");
                    console.log("  - ID:", result.ipfs.id);
                    console.log("  - CID:", result.ipfs.cid);
                    console.log("  - URL:", result.ipfs.url);

                    // 먼저 디비에 카드 정보를 저장한다.
                    try {
                        const saveResponse = await fetch("/api/cards", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                nickname: name,
                                role: role,
                                bio: bio || "",
                                imageURI: result.ipfs.cid,
                                basename:
                                    isBaseNameIncluded && username
                                        ? username
                                        : "@basename",
                                skills: selectedSkills,
                                address: address,
                            }),
                        });

                        if (!saveResponse.ok) {
                            throw new Error("Failed to save card to database");
                        }

                        const savedCard = await saveResponse.json();
                        console.log("✅ Card saved to database:", savedCard);
                    } catch (dbError) {
                        console.error("❌ Database save error:", dbError);
                        // DB 저장 실패 시 IPFS 파일 삭제
                        if (result.ipfs.id) {
                            try {
                                await fetch(
                                    `/api/ipfs/delete?id=${result.ipfs.id}`,
                                    { method: "DELETE" }
                                );
                                console.log("🗑️ IPFS file cleaned up");
                            } catch (cleanupError) {
                                console.error(
                                    "⚠️ IPFS cleanup error:",
                                    cleanupError
                                );
                            }
                        }
                        throw dbError;
                    }

                    const uri = `ipfs://${result.ipfs.cid}`;
                    // Smart contract mint function 호출
                    const mintResult = await mintCard({
                        imageURI: uri,
                        nickname: name,
                        role: role,
                        bio: bio || "",
                        basename:
                            isBaseNameIncluded && username ? username : "",
                        socials: {
                            twitter: twitter || "",
                            github: github || "",
                            farcaster: facaster || "",
                        },
                        ipfsId: result.ipfs.id, // CID for cleanup on failure
                        userAddress: address, // User wallet address for DB cleanup
                    });

                    if (mintResult.success) {
                        console.log("🎉 NFT Minting initiated!");
                        console.log("  - Transaction hash:", mintResult.hash);
                        // UI will show confirmation status via isMintConfirming/isMintSuccess
                    } else {
                        throw new Error(
                            mintResult.error || "Failed to mint NFT"
                        );
                    }
                } else {
                    console.log("⚠️ Card generated but IPFS upload failed");
                    showError(
                        "IPFS Upload Failed",
                        "Card generated but IPFS upload failed. Cannot mint NFT without IPFS URL."
                    );
                }
            } else {
                throw new Error(result.error || "Failed to generate card");
            }
        } catch (error) {
            console.error("❌ Card generation error:", error);
            showError(
                "Card Generation Failed",
                error instanceof Error
                    ? error.message
                    : "Failed to generate card. Please try again."
            );
        }
    };

    return (
        <div className="bg-white text-black">
            <div className="relative">
                <BackButton />
            </div>
            <div className="flex flex-col pt-14 px-5 ">
                <h1 className="text-3xl font-semibold">Mint Your BaseCard</h1>
                <p className="text-lg font-medium text-gray-400">
                    Everyone can be a builder
                </p>
                {hasMinted === true && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                            ⚠️ You have already minted a BaseCard. Each address
                            can only mint once.
                        </p>
                    </div>
                )}
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col justify-center items-start px-5 py-4 gap-y-6"
            >
                {/* 프로필 이미지 영역 */}
                <div className="w-full space-y-3">
                    <Label className="text-lg font-medium">
                        Profile Image*
                    </Label>
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-xl border overflow-hidden relative">
                            {profileImageFile ? (
                                <Image
                                    src={URL.createObjectURL(profileImageFile)}
                                    alt="profile preview"
                                    fill
                                    sizes="96px"
                                    className="object-cover"
                                />
                            ) : userProfile?.pfpUrl ? (
                                <Image
                                    src={userProfile.pfpUrl}
                                    alt="profile_mintpage"
                                    fill
                                    sizes="96px"
                                    className="object-contain"
                                />
                            ) : (
                                <Image
                                    src="/assets/default-profile.png"
                                    alt="default profile"
                                    fill
                                    sizes="96px"
                                    className="object-cover"
                                />
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setProfileImageFile(file);
                                    }
                                }}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Supported: PNG, JPEG (max 5MB)
                            </p>
                        </div>
                    </div>
                </div>

                {/* 1. 이름 입력 */}
                <div className="w-full space-y-2">
                    <Label htmlFor="name" className="text-lg font-medium">
                        Your Name*
                    </Label>
                    <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="h-12 text-lg border border-gray-300"
                    />
                </div>

                {/* 2. 역할 선택 (카드 스타일) */}
                <div className="w-full space-y-2">
                    <Label htmlFor="role" className="text-lg font-medium">
                        Your Role*
                    </Label>
                    <div className="grid grid-cols-1 gap-3">
                        {["Developer", "Designer", "Marketer"].map(
                            (roleOption) => (
                                <button
                                    key={roleOption}
                                    type="button"
                                    onClick={() => setRole(roleOption)}
                                    className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                                        role === roleOption
                                            ? "bg-gradient-to-r from-[#0050FF] to-[#4A90E2] text-white border-transparent shadow-lg"
                                            : "bg-white text-black border-gray-200 hover:border-[#0050FF] hover:shadow-md"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-k2d-bold mb-1">
                                                {roleOption}
                                            </h3>
                                            <p className="text-sm opacity-80 font-k2d-regular">
                                                {roleOption === "Developer" &&
                                                    "Build amazing applications and smart contracts"}
                                                {roleOption === "Designer" &&
                                                    "Create beautiful and user-friendly interfaces"}
                                                {roleOption === "Marketer" &&
                                                    "Promote and grow communities and products"}
                                            </p>
                                        </div>
                                        {role === roleOption && (
                                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm">
                                                    ✓
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* 3. 스킬 선택 영역 */}
                {/**TODO: 드롭다운으로 변경예정 */}
                <div className="w-full">
                    <h3 className="text-lg font-medium mb-3">Skills*</h3>
                    <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg">
                        {ALL_SKILLS.map((skill) => {
                            const isSelected = selectedSkills.includes(skill);
                            // const isDisabled = !isSelected && selectedSkills.length >= MAX_SKILLS;

                            return (
                                <SkillTag
                                    key={skill}
                                    skill={skill}
                                    isSelected={isSelected}
                                    onClick={() => toggleSkill(skill)}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* 추가 선택 영역 4. Socials 그룹을 위한 공간 */}
                <div className="flex flex-col w-full gap-y-2">
                    <h3 className="text-lg font-medium">Socials</h3>

                    <div className="relative w-full">
                        <FloatingInput
                            id="twitter/x"
                            type="text"
                            value={twitter}
                            onChange={(e) => setTwitter(e.target.value)}
                            className="p-3 text-lg h-12 border border-gray-300"
                        />
                        <FloatingLabel htmlFor="twitter/x">
                            Twitter / X
                        </FloatingLabel>
                    </div>

                    <div className="relative w-full">
                        <FloatingInput
                            id="github"
                            type="text"
                            value={github}
                            onChange={(e) => setGithub(e.target.value)}
                            className="p-3 text-lg h-12 border border-gray-300"
                        />
                        <FloatingLabel htmlFor="github">GitHub</FloatingLabel>
                    </div>

                    <div className="relative w-full">
                        <FloatingInput
                            id="github"
                            type="text"
                            value={facaster}
                            onChange={(e) => setFacaster(e.target.value)}
                            className="p-3 text-lg h-12 border border-gray-300"
                        />
                        <FloatingLabel htmlFor="github">Facaster</FloatingLabel>
                    </div>
                </div>

                {/* 5. 웹사이트 목록 */}
                <div className="w-full">
                    <h3 className="text-lg font-medium mb-3">
                        Websites ({websites.length}/{MAX_WEBSITES})
                    </h3>

                    {/* 웹사이트 추가 입력 필드 */}
                    <div className="flex gap-2 mb-3">
                        <FloatingInput
                            id="new-website"
                            type="url"
                            value={newWebsite}
                            onChange={(e) => setNewWebsite(e.target.value)}
                            className="flex-1 p-3 text-base h-12 border border-gray-300"
                            placeholder="https://your-site.com"
                            disabled={websites.length >= MAX_WEBSITES}
                        />
                        <button
                            type="button"
                            onClick={handleAddWebsite}
                            disabled={
                                !newWebsite.trim() ||
                                websites.length >= MAX_WEBSITES
                            }
                            // 🚨 w-12 h-12로 크기를 Input과 동일하게 고정
                            className={`w-12 h-12 flex items-center justify-center rounded-lg font-medium text-white transition-colors ${
                                !newWebsite.trim() ||
                                websites.length >= MAX_WEBSITES
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {/* 아이콘 크기를 조정하고, flex-center로 중앙 정렬 */}
                            <FaPlus size={18} />
                        </button>
                    </div>

                    {/* 현재 웹사이트 목록 */}
                    {websites.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg min-h-[40px]">
                            {websites.map((url) => (
                                <div
                                    key={url}
                                    className="py-1 px-3 text-sm rounded-full bg-background-light-2 text-gray-800 flex items-center"
                                >
                                    <span className="truncate max-w-[150px]">
                                        {url}
                                    </span>
                                    <button
                                        type="button"
                                        className="ml-1 text-red-400 hover:text-red-600 font-bold text-base transition-colors "
                                        onClick={() => handleRemoveWebsite(url)}
                                        aria-label={`${url} Delete`}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="w-full space-y-2">
                    {" "}
                    {/* 💡 전체 필드를 위한 간격 확보 */}
                    <Label
                        htmlFor="base_name_input"
                        className="text-lg font-medium"
                    >
                        Base Name
                    </Label>
                    <div className="flex gap-x-2 items-center">
                        <div className="relative flex-1">
                            <input
                                id="base_name_input"
                                type="text"
                                value={username || undefined}
                                disabled
                                className="w-full p-3 text-lg h-12 border border-gray-400 rounded-lg bg-gray-100 text-gray-700 cursor-default"
                            />
                        </div>

                        <Switch
                            id="include-base-name"
                            disabled={!username}
                            checked={isBaseNameIncluded}
                            onCheckedChange={setIsBaseNameIncluded}
                        />
                    </div>
                </div>

                {/* 7. 자기소개 텍스트 영역 */}
                <div className="w-full space-y-2">
                    <Label htmlFor="bio" className="text-lg font-medium">
                        About Yourself
                    </Label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base resize-none"
                        rows={4}
                        placeholder="Summarize your experience and goals."
                    />
                </div>

                {/* Error Messages Only */}
                {generationError && (
                    <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">
                            ❌ {generationError}
                        </p>
                    </div>
                )}

                {mintError && (
                    <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">
                            ❌ Mint Error: {mintError}
                        </p>
                    </div>
                )}

                {/* 민팅 버튼 */}
                <button
                    type="submit"
                    disabled={isGenerating || isMintPending || isMintConfirming}
                    className={`w-full py-3 mt-6 text-lg font-bold rounded-lg text-white transition-colors ${
                        isGenerating || isMintPending || isMintConfirming
                            ? "bg-gray-400 cursor-not-allowed"
                            : isMintSuccess
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {isGenerating
                        ? "GENERATING..."
                        : isMintPending
                        ? "PREPARING..."
                        : isMintConfirming
                        ? "CONFIRMING..."
                        : isMintSuccess
                        ? "✓ MINTED!"
                        : "MINT YOUR BASECARD"}
                </button>
            </form>

            {/* Loading Modal - Card Generation */}
            <LoadingModal
                isOpen={isGenerating}
                title="Generating Card..."
                description="Creating your BaseCard design and uploading to IPFS"
            />

            {/* Loading Modal - Preparing Transaction */}
            <LoadingModal
                isOpen={isMintPending && !isGenerating}
                title="Preparing Transaction..."
                description="Please approve the transaction in your wallet"
            />

            {/* Loading Modal - Confirming Transaction */}
            <LoadingModal
                isOpen={isMintConfirming}
                title="Confirming Transaction..."
                description="Waiting for blockchain confirmation"
            />

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={handleCloseSuccessModal}
                transactionHash={mintHash}
            />

            {/* Error Modal */}
            <ErrorModal
                isOpen={showErrorModal}
                onClose={handleCloseErrorModal}
                title={errorMessage.title}
                description={errorMessage.description}
            />

            {/* Warning Modal */}
            <WarningModal
                isOpen={showWarningModal}
                onClose={handleCloseWarningModal}
                title={warningMessage.title}
                description={warningMessage.description}
            />
        </div>
    );
}
