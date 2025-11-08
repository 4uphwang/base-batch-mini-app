"use client";

import { AppConnectionRequired } from "@/components/common/AppConnectionRequired";
import BackButton from "@/components/common/BackButton";
import { MintButton } from "@/components/mint/MintButton";
import { MintErrorMessages } from "@/components/mint/MintErrorMessages";
import { MintHeader } from "@/components/mint/MintHeader";
import ProfileImagePreview from "@/components/mint/ProfileImagePreview";
import { RoleSelector } from "@/components/mint/RoleSelector";
import { SkillsSelector } from "@/components/mint/SkillsSelector";
import { SocialsInput } from "@/components/mint/SocialsInput";
import { WebsitesInput } from "@/components/mint/WebsitesInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMintPage } from "@/hooks/mint/useMintPage";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// 모달 컴포넌트들을 lazy loading으로 처리 (필요할 때만 로드)
const ErrorModal = dynamic(() => import("@/components/common/ErrorModal").then(mod => ({ default: mod.default })), {
    ssr: false,
});

const LoadingModal = dynamic(() => import("@/components/common/LoadingModal").then(mod => ({ default: mod.default })), {
    ssr: false,
});

const SuccessModal = dynamic(() => import("@/components/common/SuccessModal").then(mod => ({ default: mod.default })), {
    ssr: false,
});

const WarningModal = dynamic(() => import("@/components/common/WarningModal").then(mod => ({ default: mod.default })), {
    ssr: false,
});

export default function Mint() {
    const {
        // Form - register를 직접 사용할 수 있도록
        form,
        // 복잡한 필드들 (register로 관리되지 않는 필드)
        role,
        setRole,
        selectedSkills,
        websites,
        newWebsite,
        setNewWebsite,
        profileImageFile,
        fileInputRef,
        // Handlers
        handleImageClick,
        handleFileChange,
        toggleSkill,
        handleAddWebsite,
        handleRemoveWebsite,
        handleSubmit,
        // Form state
        formState: { errors },
        // URL error state
        urlError,
        // User data
        username,
        defaultProfileUrl,
        address,
        isWalletNotReady,
        // Card generation
        isGenerating,
        generationError,
        // Minting
        isMintPending,
        isMintConfirming,
        isMintSuccess,
        mintHash,
        mintError,
        hasMinted,
        // Modals
        showSuccessModal,
        showErrorModal,
        showWarningModal,
        errorMessage,
        warningMessage,
        handleCloseSuccessModal,
        handleCloseErrorModal,
        handleCloseWarningModal,
    } = useMintPage();

    const { register } = form;

    // 앱 연결이 필요한 경우 안내 화면 표시
    if (!address) {
        return (
            <div className="bg-white text-black">
                <div className="relative">
                    <BackButton />
                </div>
                <AppConnectionRequired
                    title="Wallet Connection Required"
                    description="Please connect your Base Wallet to mint your card. This feature requires an active wallet connection."
                />
            </div>
        );
    }

    return (
        <div className="bg-white text-black">
            <div className="relative">
                <BackButton />
            </div>
            <MintHeader hasMinted={hasMinted === true} />

            <form
                onSubmit={handleSubmit}
                className="flex flex-col justify-center items-start px-5 py-4 gap-y-6"
            >
                {/* 프로필 이미지 영역 */}
                <ProfileImagePreview
                    profileImageFile={profileImageFile || null}
                    defaultProfileUrl={defaultProfileUrl}
                    fileInputRef={fileInputRef}
                    handleFileChange={handleFileChange}
                    handleImageClick={handleImageClick}
                />

                {/* 이름 입력 */}
                <div className="w-full space-y-2">
                    <Label htmlFor="name" className="text-lg font-semibold text-gray-900">
                        Your Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="name"
                        type="text"
                        {...register("name")}
                        placeholder="Enter your name"
                        className={`h-12 text-base rounded-xl border-2 transition-all duration-300 ${errors.name
                            ? "border-red-500 focus:border-red-600 focus:ring-red-500/20"
                            : "border-gray-200 focus:border-[#0050FF] focus:ring-[#0050FF]/20 hover:border-gray-300"
                            }`}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <span>⚠</span> {errors.name.message}
                        </p>
                    )}
                </div>

                {/* 역할 선택 */}
                <RoleSelector selectedRole={role} onRoleChange={setRole} />

                {/* 스킬 선택 */}
                <SkillsSelector
                    selectedSkills={selectedSkills}
                    onToggleSkill={toggleSkill}
                />

                {/* 소셜 링크 입력 */}
                <SocialsInput
                    twitterRegister={register("twitter")}
                    githubRegister={register("github")}
                    farcasterRegister={register("farcaster")}
                    errors={{
                        twitter: errors.twitter,
                        github: errors.github,
                        farcaster: errors.farcaster,
                    }}
                />

                {/* 웹사이트 입력 */}
                <WebsitesInput
                    websites={websites}
                    newWebsite={newWebsite}
                    onNewWebsiteChange={setNewWebsite}
                    onAddWebsite={handleAddWebsite}
                    onRemoveWebsite={handleRemoveWebsite}
                    urlError={urlError}
                />

                {/* Base Name */}
                <div className="w-full space-y-2">
                    <Label htmlFor="base_name_input" className="text-lg font-semibold text-gray-900">
                        Base Name
                    </Label>
                    <Input
                        id="base_name_input"
                        type="text"
                        value={username || ""}
                        disabled
                        placeholder="Auto-filled from your wallet"
                        className="h-12 text-base rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                    <p className="text-sm text-gray-500 italic">Automatically synced from your Base wallet</p>
                </div>

                {/* 자기소개 */}
                <div className="w-full space-y-2">
                    <Label htmlFor="bio" className="text-lg font-semibold text-gray-900">
                        About Yourself
                    </Label>
                    <textarea
                        id="bio"
                        {...register("bio")}
                        className={`w-full p-4 text-base rounded-xl border-2 transition-all duration-300 resize-none placeholder:text-sm placeholder:text-gray-400 ${errors.bio
                            ? "border-red-500 focus:border-red-600 focus:ring-red-500/20"
                            : "border-gray-200 focus:border-[#0050FF] focus:ring-[#0050FF]/20 hover:border-gray-300"
                            }`}
                        rows={4}
                        placeholder="Tell us about yourself, your experience, and goals..."
                    />
                    {errors.bio && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <span>⚠</span> {errors.bio.message}
                        </p>
                    )}
                    <p className="text-sm text-gray-500 italic">Optional - Share more about yourself</p>
                </div>

                {/* 에러 메시지 */}
                <MintErrorMessages
                    generationError={generationError}
                    mintError={mintError}
                />

                {/* 민팅 버튼 */}
                <MintButton
                    isGenerating={isGenerating}
                    isMintPending={isMintPending}
                    isMintConfirming={isMintConfirming}
                    isMintSuccess={isMintSuccess}
                    isWalletNotReady={isWalletNotReady}
                    hasAddress={!!address}
                    onSubmit={handleSubmit}
                />
            </form>

            {/* Loading Modal - Card Generation */}
            {isGenerating && (
                <Suspense fallback={null}>
                    <LoadingModal
                        isOpen={isGenerating}
                        title="Creating Your Card..."
                        description="We're designing your unique BaseCard"
                    />
                </Suspense>
            )}

            {/* Loading Modal - Preparing Transaction */}
            {isMintPending && !isGenerating && (
                <Suspense fallback={null}>
                    <LoadingModal
                        isOpen={isMintPending && !isGenerating}
                        title="Almost There..."
                        description="Please approve in your wallet"
                    />
                </Suspense>
            )}

            {/* Loading Modal - Confirming Transaction */}
            {isMintConfirming && (
                <Suspense fallback={null}>
                    <LoadingModal
                        isOpen={isMintConfirming}
                        title="Final Step..."
                        description="This will just take a moment"
                    />
                </Suspense>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <Suspense fallback={null}>
                    <SuccessModal
                        isOpen={showSuccessModal}
                        onClose={handleCloseSuccessModal}
                        transactionHash={mintHash}
                    />
                </Suspense>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <Suspense fallback={null}>
                    <ErrorModal
                        isOpen={showErrorModal}
                        onClose={handleCloseErrorModal}
                        title={errorMessage.title}
                        description={errorMessage.description}
                    />
                </Suspense>
            )}

            {/* Warning Modal */}
            {showWarningModal && (
                <Suspense fallback={null}>
                    <WarningModal
                        isOpen={showWarningModal}
                        onClose={handleCloseWarningModal}
                        title={warningMessage.title}
                        description={warningMessage.description}
                    />
                </Suspense>
            )}
        </div>
    );
}
