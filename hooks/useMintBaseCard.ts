"use client";

import { baseCardAbi } from "@/lib/abi/abi";
import { activeChain } from "@/lib/wagmi";
import { useCallback, useState } from "react";
import {
    useAccount,
    useChainId,
    useReadContract,
    useWaitForTransactionReceipt,
    useWriteContract,
} from "wagmi";

const BASECARD_CONTRACT_ADDRESS = process.env
    .NEXT_PUBLIC_BASECARD_NFT_CONTRACT_ADDRESS! as `0x${string}`;

/**
 * BaseCard 민팅 데이터 타입
 */
export interface BaseCardMintData {
    imageURI: string; // IPFS URL (ipfs://...)
    nickname: string;
    role: string;
    bio: string;
    basename: string;
    socials?: {
        [key: string]: string; // e.g., { twitter: "@username", github: "username" }
    };
    ipfsId?: string; // Optional: ID for cleanup on failure
    userAddress?: string; // User wallet address for DB cleanup
}

/**
 * BaseCard 민팅 결과
 */
export interface MintResult {
    success: boolean;
    hash?: string;
    tokenId?: bigint;
    error?: string;
}

/**
 * BaseCard NFT 민팅을 위한 Hook
 *
 * @example
 * ```tsx
 * const { mintCard, isPending, isConfirming, isSuccess, error } = useMintBaseCard();
 *
 * const handleMint = async () => {
 *   const result = await mintCard({
 *     imageURI: "ipfs://QmXXX",
 *     nickname: "John Doe",
 *     role: "Developer",
 *     bio: "Full-stack developer",
 *     basename: "@johndoe",
 *     socials: { twitter: "@johndoe", github: "johndoe" }
 *   });
 *
 *   if (result.success) {
 *     console.log("Minted! Token ID:", result.tokenId);
 *   }
 * };
 * ```
 */
export function useMintBaseCard() {
    const { address: userAddress } = useAccount();
    const [mintError, setMintError] = useState<string | null>(null);
    const [lastMintData, setLastMintData] = useState<BaseCardMintData | null>(
        null
    );

    // Get current chain ID
    const chainId = useChainId();
    const isCorrectChain = chainId === activeChain.id;

    // Check if user has already minted
    const { data: hasMinted } = useReadContract({
        address: BASECARD_CONTRACT_ADDRESS,
        abi: baseCardAbi,
        functionName: "hasMinted",
        args: userAddress ? [userAddress] : undefined,
    });

    // writeContract hook for sending transaction
    const {
        data: hash,
        writeContract,
        isPending,
        error: writeError,
    } = useWriteContract();

    // Wait for transaction confirmation
    const {
        isLoading: isConfirming,
        isSuccess,
        error: confirmError,
    } = useWaitForTransactionReceipt({
        hash,
    });

    /**
     * Clean up IPFS and DB data on mint failure or cancellation
     */
    const cleanupMintData = useCallback(async (data: BaseCardMintData) => {
        const cleanupTasks: Promise<void>[] = [];

        // Clean up IPFS
        if (data.ipfsId) {
            console.log(`🗑️ Cleaning up IPFS file (ID: ${data.ipfsId})...`);
            cleanupTasks.push(
                fetch(`/api/ipfs/delete?id=${data.ipfsId}`, {
                    method: "DELETE",
                })
                    .then((response) => {
                        if (response.ok) {
                            console.log("✅ IPFS file cleaned up successfully");
                        } else {
                            console.warn("⚠️ Failed to clean up IPFS file");
                        }
                    })
                    .catch((error) => {
                        console.warn("⚠️ IPFS cleanup error:", error);
                    })
            );
        }

        // Clean up DB
        if (data.userAddress) {
            console.log(
                `🗑️ Cleaning up DB card (Address: ${data.userAddress})...`
            );
            cleanupTasks.push(
                fetch(`/api/card/${data.userAddress}`, {
                    method: "DELETE",
                })
                    .then((response) => {
                        if (response.ok) {
                            console.log("✅ DB card cleaned up successfully");
                        } else {
                            console.warn("⚠️ Failed to clean up DB card");
                        }
                    })
                    .catch((error) => {
                        console.warn("⚠️ DB cleanup error:", error);
                    })
            );
        }

        // Wait for all cleanup tasks
        await Promise.all(cleanupTasks);
    }, []);

    /**
     * Mint BaseCard NFT
     */
    const mintCard = async (data: BaseCardMintData): Promise<MintResult> => {
        setMintError(null);
        setLastMintData(data);
        console.log('userAddress', userAddress)
        try {
            // Check if on correct chain first
            if (!isCorrectChain) {
                throw new Error(
                    `Please switch to ${activeChain.name} network to mint your BaseCard`
                );
            }

            // Check if user has already minted
            if (hasMinted) {
                throw new Error(
                    "You have already minted a BaseCard. Each address can only mint once."
                );
            }

            // Validate inputs
            if (!data.imageURI || !data.nickname || !data.role) {
                throw new Error(
                    "Required fields missing: imageURI, nickname, role"
                );
            }

            // Prepare social links
            // Note: Contract expects specific social keys (x, farcaster, github, etc.)
            // "twitter" should be converted to "x" as per contract whitelist
            const socialKeys: string[] = [];
            const socialValues: string[] = [];

            if (data.socials) {
                Object.entries(data.socials).forEach(([key, value]) => {
                    if (value && value.trim() !== "") {
                        // Convert "twitter" to "x" for contract compatibility
                        const contractKey = key === "twitter" ? "x" : key;
                        socialKeys.push(contractKey);
                        socialValues.push(value.trim());
                    }
                });
            }

            // Prepare card data tuple
            const initialCardData = {
                imageURI: data.imageURI,
                nickname: data.nickname,
                role: data.role,
                bio: data.bio || "",
                basename: data.basename || "",
            };

            console.log("🎨 Minting BaseCard with data:", {
                contractAddress: BASECARD_CONTRACT_ADDRESS,
                initialCardData,
                socialKeys,
                socialValues,
                userAddress: data.userAddress,
            });

            // Validate contract address
            if (
                !BASECARD_CONTRACT_ADDRESS ||
                BASECARD_CONTRACT_ADDRESS === "0x"
            ) {
                throw new Error("Contract address not configured");
            }

            // Call smart contract
            // writeContract({
            //     address: BASECARD_CONTRACT_ADDRESS,
            //     abi: baseCardAbi,
            //     functionName: "mintBaseCard",
            //     args: [initialCardData, socialKeys, socialValues],
            // });

            // Note: We can't wait here because writeContract is async but doesn't return the receipt
            // The transaction hash will be available in the `hash` state
            // The confirmation status will be available in `isConfirming` and `isSuccess`

            return {
                success: true,
                hash: hash,
            };
        } catch (error) {
            console.error("❌ Mint error:", error);

            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to mint BaseCard";

            // Check if user rejected the transaction
            const isUserRejection =
                error instanceof Error &&
                (error.message.includes("User rejected") ||
                    error.message.includes("User denied") ||
                    error.message.includes("user rejected") ||
                    error.message.includes("rejected"));

            if (isUserRejection) {
                console.log(
                    "🚫 User cancelled transaction, cleaning up..."
                );
            }

            // Clean up IPFS and DB data on failure or cancellation
            await cleanupMintData(data);

            setMintError(errorMessage);

            return {
                success: false,
                error: errorMessage,
            };
        }
    };

    // Combine errors
    const error =
        mintError ||
        (writeError ? writeError.message : null) ||
        (confirmError ? confirmError.message : null);

    return {
        mintCard,
        cleanupMintData, // Manual cleanup function
        isPending, // Transaction is being prepared
        isConfirming, // Transaction is being confirmed
        isSuccess, // Transaction confirmed successfully
        hash, // Transaction hash
        error,
        lastMintData, // Last mint data for cleanup
        hasMinted, // Check if user has already minted
        isCorrectChain, // Check if on correct chain
        chainId, // Current chain ID
        requiredChainId: activeChain.id, // Required chain ID
        chainName: activeChain.name, // Chain name for display
    };
}
