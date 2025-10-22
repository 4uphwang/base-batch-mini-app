"use client";

import { useState, useCallback } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { baseCardAbi } from "@/lib/abi/abi";

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
    const [mintError, setMintError] = useState<string | null>(null);

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
     * Mint BaseCard NFT
     */
    const mintCard = useCallback(
        async (data: BaseCardMintData): Promise<MintResult> => {
            setMintError(null);

            try {
                // Validate inputs
                if (!data.imageURI || !data.nickname || !data.role) {
                    throw new Error(
                        "Required fields missing: imageURI, nickname, role"
                    );
                }

                // Prepare social links
                const socialKeys: string[] = [];
                const socialValues: string[] = [];

                if (data.socials) {
                    Object.entries(data.socials).forEach(([key, value]) => {
                        if (value) {
                            socialKeys.push(key);
                            socialValues.push(value);
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
                    initialCardData,
                    socialKeys,
                    socialValues,
                });

                // Call smart contract
                writeContract({
                    address: BASECARD_CONTRACT_ADDRESS,
                    abi: baseCardAbi,
                    functionName: "mintBaseCard",
                    args: [initialCardData, socialKeys, socialValues],
                });

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

                // Clean up IPFS file on failure
                if (data.ipfsId) {
                    console.log(
                        `🗑️ Cleaning up IPFS file (ID: ${data.ipfsId}) due to mint failure...`
                    );

                    try {
                        const cleanupResponse = await fetch(
                            `/api/ipfs/delete?id=${data.ipfsId}`,
                            { method: "DELETE" }
                        );

                        if (cleanupResponse.ok) {
                            console.log("✅ IPFS file cleaned up successfully");
                        } else {
                            console.warn(
                                "⚠️ Failed to clean up IPFS file (file may remain pinned)"
                            );
                        }
                    } catch (cleanupError) {
                        console.warn("⚠️ IPFS cleanup error:", cleanupError);
                    }
                }

                setMintError(errorMessage);

                return {
                    success: false,
                    error: errorMessage,
                };
            }
        },
        [writeContract, hash]
    );

    // Combine errors
    const error =
        mintError ||
        (writeError ? writeError.message : null) ||
        (confirmError ? confirmError.message : null);

    return {
        mintCard,
        isPending, // Transaction is being prepared
        isConfirming, // Transaction is being confirmed
        isSuccess, // Transaction confirmed successfully
        hash, // Transaction hash
        error,
    };
}
