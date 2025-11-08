import { useCardGeneration } from "@/hooks/useCardGeneration";
import { useMintBaseCard } from "@/hooks/useMintBaseCard";
import { executeCardMintFlow } from "@/lib/cardMintingFlow";
import { MAX_WEBSITES } from "@/lib/constants/mint";
import type { MintFormData } from "@/lib/schemas/mintFormSchema";
import FALLBACK_PROFILE_IMAGE from "@/public/assets/empty_pfp.png";
import { userProfileAtom } from "@/store/userProfileState";
import { walletAddressAtom } from "@/store/walletState";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useMintForm } from "./useMintForm";

/**
 * Mint 페이지의 전체 로직을 통합한 훅
 */
export function useMintPage() {
    const router = useRouter();
    const [userProfile] = useAtom(userProfileAtom);
    const [address] = useAtom(walletAddressAtom);
    const { status } = useAccount();

    const username = userProfile?.username ?? "";
    const defaultProfileUrl = userProfile.pfpUrl || FALLBACK_PROFILE_IMAGE;
    const isWalletNotReady = status !== 'connected' && status !== 'disconnected';

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
    } = useMintBaseCard();

    // Form state management
    const {
        form,
        fileInputRef,
        handleImageClick,
        handleFileChange,
        toggleSkill,
        handleAddWebsite,
        handleRemoveWebsite,
        watch,
    } = useMintForm();

    const { handleSubmit: formHandleSubmit, setValue, formState } = form;

    // Watch 복잡한 필드들만 (register로 관리되지 않는 필드)
    const role = watch("role");
    const selectedSkills = watch("selectedSkills");
    const websites = watch("websites");
    const profileImageFile = watch("profileImageFile");

    // Temporary field for new website input (not in schema)
    const [newWebsite, setNewWebsite] = useState("");

    // Modal states
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

    const handleCloseSuccessModal = useCallback(() => {
        setShowSuccessModal(false);
        router.push("/mycard");
    }, [router]);

    const handleCloseErrorModal = useCallback(() => {
        setShowErrorModal(false);
    }, []);

    const handleCloseWarningModal = useCallback(() => {
        setShowWarningModal(false);
    }, []);

    const showError = useCallback((title: string, description: string) => {
        setErrorMessage({ title, description });
        setShowErrorModal(true);
    }, []);

    const showWarning = useCallback((title: string, description: string) => {
        setWarningMessage({ title, description });
        setShowWarningModal(true);
    }, []);

    // Form submit handler
    const onSubmit = useCallback(
        async (data: MintFormData) => {
            // Wallet validation
            if (!address) {
                showError(
                    "Wallet Not Connected",
                    "Please connect your wallet to create your card."
                );
                return;
            }

            try {
                const baseName = username.endsWith(".base.eth") ? username : "";

                // Execute complete minting flow
                const result = await executeCardMintFlow(
                    {
                        name: data.name,
                        role: data.role,
                        bio: data.bio || "",
                        baseName,
                        address,
                        profileImageFile: data.profileImageFile || undefined,
                        defaultProfileUrl,
                        skills: data.selectedSkills,
                        socials: {
                            twitter: data.twitter || "",
                            github: data.github || "",
                            farcaster: data.farcaster || "",
                        },
                    },
                    generateCard,
                    mintCard
                );

                if (!result.success) {
                    // Handle errors by step
                    switch (result.step) {
                        case "image":
                            showError(
                                "Image Processing Failed",
                                result.error || "Failed to process your profile image"
                            );
                            break;
                        case "generation":
                            showError(
                                "Card Creation Failed",
                                result.error || "Failed to create your card"
                            );
                            break;
                        case "database":
                            showError(
                                "Save Failed",
                                result.error || "Failed to save your card"
                            );
                            break;
                        case "minting":
                            showError(
                                "Creation Failed",
                                result.error || "Failed to create your card"
                            );
                            break;
                        default:
                            showError(
                                "Something Went Wrong",
                                result.error || "An unexpected error occurred"
                            );
                    }
                }
            } catch (error) {
                console.error("❌ Card minting error:", error);
                showError(
                    "Something Went Wrong",
                    error instanceof Error
                        ? error.message
                        : "An unexpected error occurred"
                );
            }
        },
        [
            address,
            username,
            defaultProfileUrl,
            generateCard,
            mintCard,
            showError,
        ]
    );

    // Wrapper for form submit (with wallet validation)
    const handleSubmit = formHandleSubmit(onSubmit);

    // Toggle skill with warning
    const handleToggleSkill = useCallback(
        (skill: string) => {
            toggleSkill(skill, showWarning);
        },
        [toggleSkill, showWarning]
    );

    // URL 에러 상태 (모달 대신 인라인 메시지로 표시)
    const [urlError, setUrlError] = useState<string | null>(null);

    // Handle add website (with URL validation) - 모달 대신 인라인 에러 표시
    const handleAddWebsiteWithValidation = useCallback(() => {
        const urlToAdd = newWebsite.trim();
        if (!urlToAdd) {
            setUrlError("Please enter a website URL");
            return;
        }

        // URL 유효성 검사
        let isValidUrl = false;
        try {
            new URL(urlToAdd);
            isValidUrl = true;
        } catch {
            setUrlError("Please enter a valid URL (e.g., https://example.com)");
            return;
        }

        // 이미 추가된 URL인지 확인
        const currentWebsites = form.getValues("websites");
        if (currentWebsites.includes(urlToAdd)) {
            setUrlError("This website is already in your list");
            return;
        }

        // 최대 개수 확인
        if (currentWebsites.length >= MAX_WEBSITES) {
            setUrlError(`Maximum ${MAX_WEBSITES} websites allowed`);
            return;
        }

        // 모든 검사 통과 시 추가
        const success = handleAddWebsite(urlToAdd);
        if (success) {
            setNewWebsite("");
            setUrlError(null);
        }
    }, [newWebsite, handleAddWebsite, form, setNewWebsite]);

    // 입력 시 에러 메시지 초기화
    useEffect(() => {
        if (urlError && newWebsite.trim()) {
            // 입력이 변경되면 에러 메시지 제거 (WebsitesInput에서도 처리)
            setUrlError(null);
        }
    }, [newWebsite, urlError]);

    return {
        // Form 객체 - register를 직접 사용할 수 있도록
        form,
        // 복잡한 필드들만 watch (register로 관리되지 않는 필드)
        role,
        setRole: (value: "Developer" | "Designer" | "Marketer") => setValue("role", value),
        selectedSkills,
        websites,
        newWebsite,
        setNewWebsite,
        profileImageFile,
        fileInputRef,
        // Handlers
        handleImageClick,
        handleFileChange,
        toggleSkill: handleToggleSkill,
        handleAddWebsite: handleAddWebsiteWithValidation,
        handleRemoveWebsite,
        handleSubmit,
        // Form state
        formState,
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
    };
}
