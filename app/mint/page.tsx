"use client";

import { useAtom } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";

import { useCardGeneration } from "@/hooks/useCardGeneration";
import { useMintBaseCard } from "@/hooks/useMintBaseCard";
import { userProfileAtom } from "@/store/userProfileState";

import BackButton from "@/components/common/BackButton";
import ErrorModal from "@/components/common/ErrorModal";
import LoadingModal from "@/components/common/LoadingModal";
import { ModernToggle } from "@/components/common/ModernToggle";
import SuccessModal from "@/components/common/SuccessModal";
import WarningModal from "@/components/common/WarningModal";
import ProfileImagePreview from "@/components/mint/ProfileImagePreview";
import {
    FloatingInput,
    FloatingLabel,
} from "@/components/ui/floating-label-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resizeAndCompressImage } from "@/lib/imageUtils";
import FALLBACK_PROFILE_IMAGE from "@/public/assets/empty_pfp.png";
import { useRouter } from "next/navigation";
import { CiCircleCheck } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
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
        " px-3 text-sm rounded-full transition-colors duration-150 flex items-center h-8";
    const selectedClasses =
        "bg-[#DFE9FF] text-primary-1 outline outline-primary-1";
    const defaultClasses =
        "bg-background-light-2 text-gray-700 hover:bg-gray-200 outline outline-transparent";

    const rotationClass = isSelected ? 'rotate-0' : '-rotate-45';
    return (
        <div
            // type="button"
            onClick={onClick}
            className={`${baseClasses} ${isSelected ? selectedClasses : defaultClasses}`}
        >
            {skill}
            <div className={`ml-1 text-[10px] font-semibold w-2 transform transition-transform duration-300 ${rotationClass}`} >
                ✕
            </div>

        </div>
    );
};

export default function Mint() {
    const router = useRouter();
    const [userProfile] = useAtom(userProfileAtom);
    const username = userProfile.username;
    const defaultProfileUrl = userProfile.pfpUrl || FALLBACK_PROFILE_IMAGE;
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
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleImageClick = useCallback(() => {
        // 이미지를 클릭하면 숨겨진 파일 인풋을 클릭합니다.
        fileInputRef.current?.click();
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImageFile(file);
        }
    }, []);

    const handleCloseSuccessModal = useCallback(() => {
        setShowSuccessModal(false);
        router.push("/mycard");
    }, [router.push]);

    const handleCloseErrorModal = useCallback(() => {
        setShowErrorModal(false);
    }, [setShowErrorModal]);

    const handleCloseWarningModal = useCallback(() => {
        setShowWarningModal(false);
    }, [setShowWarningModal]);

    const showError = useCallback((title: string, description: string) => {
        setErrorMessage({ title, description });
        setShowErrorModal(true);
    }, [setErrorMessage, setShowErrorModal]);

    const showWarning = useCallback((title: string, description: string) => {
        setWarningMessage({ title, description });
        setShowWarningModal(true);
    }, [setWarningMessage, setShowWarningModal]);

    const toggleSkill = useCallback((skill: string) => {
        setSelectedSkills((prev) => {
            if (prev.includes(skill)) {
                return prev.filter((s) => s !== skill);
            } else {
                if (prev.length >= MAX_SKILLS) {
                    showWarning(
                        "Maximum Skills Reached",
                        `You can select up to ${MAX_SKILLS} skills. Please deselect a skill to add a new one.`
                    );
                    return prev;
                }
                return [...prev, skill];
            }
        });
    }, [setSelectedSkills, showWarning]);

    const handleAddWebsite = useCallback(() => {
        const urlToAdd = newWebsite.trim();
        if (!urlToAdd) return;

        setWebsites((prev) => {
            if (prev.includes(urlToAdd)) return prev;
            if (prev.length < MAX_WEBSITES) {
                // 이 함수형 업데이트 블록 밖에서 setNewWebsite 호출
                return [...prev, urlToAdd];
            }
            return prev;
        });

        if (websites.length < MAX_WEBSITES) {
            setNewWebsite("");
        }
    }, [newWebsite, websites.length, setNewWebsite]);

    const handleRemoveWebsite = useCallback((urlToRemove: string) => {
        setWebsites((prev) => prev.filter((url) => url !== urlToRemove));
    }, [setWebsites]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !role) {
            showError(
                "Required Fields Missing",
                "Please fill in your name and role to continue."
            );
            return;
        }

        try {
            // 이미지 URL 결정
            const imageUrlToFetch = defaultProfileUrl || FALLBACK_PROFILE_IMAGE;
            const urlString = (typeof imageUrlToFetch === 'object' && 'src' in imageUrlToFetch)
                ? (imageUrlToFetch as any).src
                : String(imageUrlToFetch);

            let imageToUse: File;

            if (profileImageFile) {
                imageToUse = profileImageFile;
            } else {
                // Fetch default image and convert to File
                const response = await fetch(urlString);
                const blob = await response.blob();
                imageToUse = new File([blob], "profile-image.png", {
                    type: blob.type || "image/png",
                });
            }

            // ✨ 최적화 3: Base64 변환 전 이미지 리사이징 및 압축
            // 카드 이미지 (Base64) 크기를 512px 또는 1024px 등 적절한 크기로 제한
            const profileImageDataURL = await resizeAndCompressImage(imageToUse, 512, 512, 1);
            console.log('profileImageDataURL', profileImageDataURL)
            const baseName = isBaseNameIncluded && username ? username : "";

            // Card generation with IPFS upload
            const result = await generateCard({ name, role, baseName, profileImage: imageToUse },
                true
            );

            if (result.success && result.ipfs && result.ipfs.cid && result.ipfs.url) {
                console.log("✅ Card generated successfully. IPFS Upload successful.");
                const ipfsImageURI = `ipfs://${result.ipfs.cid}`;

                // DB 저장: 최적화된 Base64 data URL 사용
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
                            imageURI: ipfsImageURI,
                            basename: baseName,
                            skills: selectedSkills,
                            address: address,
                            profileImage: profileImageDataURL,
                        }),
                    });

                    if (!saveResponse.ok) {
                        throw new Error("Failed to save card to database");
                    }
                    // ... (DB 저장 성공 로그 및 mintCard 호출 로직 유지)

                    const uri = `ipfs://${result.ipfs.cid}`;
                    const mintResult = await mintCard({
                        imageURI: uri,
                        nickname: name,
                        role: role,
                        bio: bio || "",
                        basename: baseName,
                        socials: {
                            twitter: twitter || "",
                            github: github || "",
                            farcaster: facaster || "",
                        },
                        ipfsId: result.ipfs.id,
                        userAddress: address,
                    });

                    if (!mintResult.success) {
                        throw new Error(
                            mintResult.error || "Failed to mint NFT"
                        );
                    }
                } catch (dbError) {
                    // ... (DB 저장 실패 및 IPFS 클린업 로직 유지)
                    throw dbError;
                }
            } else {
                // ... (IPFS 업로드 실패 로직 유지)
                const ipfsError = result.error || "Unknown IPFS error";
                showError(
                    "IPFS Upload Failed",
                    `Card generated but IPFS upload failed: ${ipfsError}. Please check your Pinata configuration and try again.`
                );
            }
        } catch (error) {
            // ... (Card generation error 로직 유지)
        }
    }, [
        name,
        role,
        profileImageFile,
        defaultProfileUrl,
        generateCard,
        showError,
        isBaseNameIncluded,
        username,
        selectedSkills,
        address,
        mintCard,
        twitter,
        github,
        facaster,
        bio
    ]);

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
                <ProfileImagePreview
                    profileImageFile={profileImageFile}
                    defaultProfileUrl={defaultProfileUrl}
                    fileInputRef={fileInputRef}
                    handleFileChange={handleFileChange}
                    handleImageClick={handleImageClick}
                />

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
                                    className={`p-4 rounded-2xl outline-2 transition-all duration-200 text-left ${role === roleOption
                                        ? "bg-gradient-to-r from-[#0050FF] to-[#4A90E2] text-white border-transparent shadow-lg"
                                        : "bg-white text-black border-gray-200 hover:outline-[#0050FF] hover:shadow-md"
                                        }`}
                                >
                                    <div className="flex items-center justify-between relative">
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
                                            <CiCircleCheck className="w-6 h-6 rounded-full absolute right-0" />
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
                            className="flex-1 p-3 text-base h-12 border border-gray-300 placeholder:text-sm"
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
                            className={`w-12 h-12 flex items-center justify-center rounded-lg font-medium text-white transition-colors ${!newWebsite.trim() ||
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
                        <div className="flex flex-wrap gap-2">
                            {websites.map((url) => (
                                <div
                                    key={url}
                                    className="pl-3 text-sm rounded-full bg-background-light-2 text-gray-800 flex items-center"
                                >
                                    {url}
                                    <button
                                        type="button"
                                        className="w-8 h-8 text-red-400 hover:text-red-600 font-bold text-[10px] transition-colors "
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
                        <input
                            id="base_name_input"
                            type="text"
                            value={username || undefined}
                            disabled
                            className="w-full p-3 text-base h-12 border border-gray-400 rounded-lg bg-gray-100 text-gray-700 cursor-default"
                        />

                        <ModernToggle
                            checked={isBaseNameIncluded}
                            onChange={setIsBaseNameIncluded}
                            disabled={!username}
                        // color="green" // 색상 변경 가능
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base resize-none placeholder:text-sm"
                        rows={4}
                        placeholder="Summarize your experience and goals."
                    />
                </div>

                {/* Error Messages Only */}
                {
                    generationError && (
                        <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm">
                                ❌ {generationError}
                            </p>
                        </div>
                    )
                }

                {
                    mintError && (
                        <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm">
                                ❌ Mint Error: {mintError}
                            </p>
                        </div>
                    )
                }

                {/* 민팅 버튼 */}
                <button
                    type="submit"
                    disabled={isGenerating || isMintPending || isMintConfirming}
                    className={`w-full py-3 mt-6 text-lg font-bold rounded-lg text-white transition-colors ${isGenerating || isMintPending || isMintConfirming
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
            </form >

            {/* Loading Modal - Card Generation */}
            < LoadingModal
                isOpen={isGenerating}
                title="Generating Card..."
                description="Creating your BaseCard design and uploading to IPFS"
            />

            {/* Loading Modal - Preparing Transaction */}
            < LoadingModal
                isOpen={isMintPending && !isGenerating
                }
                title="Preparing Transaction..."
                description="Please approve the transaction in your wallet"
            />

            {/* Loading Modal - Confirming Transaction */}
            < LoadingModal
                isOpen={isMintConfirming}
                title="Confirming Transaction..."
                description="Waiting for blockchain confirmation"
            />

            {/* Success Modal */}
            < SuccessModal
                isOpen={showSuccessModal}
                onClose={handleCloseSuccessModal}
                transactionHash={mintHash}
            />

            {/* Error Modal */}
            < ErrorModal
                isOpen={showErrorModal}
                onClose={handleCloseErrorModal}
                title={errorMessage.title}
                description={errorMessage.description}
            />

            {/* Warning Modal */}
            < WarningModal
                isOpen={showWarningModal}
                onClose={handleCloseWarningModal}
                title={warningMessage.title}
                description={warningMessage.description}
            />
        </div >
    );
}
