import { resizeAndCompressImage } from "./imageUtils";
import type { BaseCardMintData, MintResult } from "@/hooks/useMintBaseCard";
import type { CardGenerationResult } from "@/hooks/useCardGeneration";

/**
 * Card minting flow data
 */
export interface CardMintFlowData {
    // Basic info
    name: string;
    role: string;
    bio?: string;
    baseName?: string;
    address: string;

    // Image
    profileImageFile?: File;
    defaultProfileUrl?: string | { src: string };

    // Additional data
    skills?: string[];
    socials?: {
        twitter?: string;
        github?: string;
        farcaster?: string;
    };
}

/**
 * Card minting flow result
 */
export interface CardMintFlowResult {
    success: boolean;
    step: "image" | "generation" | "database" | "minting" | "completed";
    error?: string;
    data?: {
        ipfsCid?: string;
        ipfsUrl?: string;
        cardId?: number;
        mintHash?: string;
    };
}

/**
 * Complete card minting flow
 * 1. Process image
 * 2. Generate card with IPFS upload
 * 3. Save to database
 * 4. Mint NFT
 */
export async function executeCardMintFlow(
    data: CardMintFlowData,
    generateCard: (
        data: {
            name: string;
            role: string;
            baseName: string;
            profileImage: File;
        },
        uploadToIpfs: boolean
    ) => Promise<CardGenerationResult>,
    mintCard: (data: BaseCardMintData) => Promise<MintResult>
): Promise<CardMintFlowResult> {
    try {
        // Step 1: Process image
        const imageToUse = await processImage(
            data.profileImageFile,
            data.defaultProfileUrl
        );

        if (!imageToUse) {
            return {
                success: false,
                step: "image",
                error: "Failed to process image",
            };
        }

        // Step 2: Generate card with IPFS upload
        console.log("🎨 Generating card and uploading to IPFS...");
        const generationResult = await generateCard(
            {
                name: data.name,
                role: data.role,
                baseName: data.baseName || "",
                profileImage: imageToUse,
            },
            true // Upload to IPFS
        );

        if (!generationResult.success || !generationResult.ipfs) {
            return {
                success: false,
                step: "generation",
                error:
                    generationResult.error ||
                    "Failed to generate card or upload to IPFS",
            };
        }

        console.log(
            "✅ Card generated successfully. IPFS CID:",
            generationResult.ipfs.cid
        );

        const ipfsImageURI = `ipfs://${generationResult.ipfs.cid}`;

        // Step 3: Save to database
        console.log("💾 Saving card to database...");
        const profileImageDataURL: string = await resizeAndCompressImage(
            imageToUse,
            512,
            512,
            1
        );

        const dbResult = await saveCardToDatabase({
            nickname: data.name,
            role: data.role,
            bio: data.bio || "",
            imageURI: ipfsImageURI,
            basename: data.baseName || "",
            skills: data.skills || [],
            address: data.address,
            profileImage: profileImageDataURL,
        });

        if (!dbResult.success) {
            // Clean up IPFS on DB save failure
            if (generationResult.ipfs.id) {
                await cleanupIPFS(generationResult.ipfs.id);
            }
            return {
                success: false,
                step: "database",
                error: dbResult.error || "Failed to save card to database",
            };
        }

        console.log("✅ Card saved to database. ID:", dbResult.cardId);

        // Step 4: Mint NFT
        console.log("🎨 Minting NFT...");
        const mintResult = await mintCard({
            imageURI: ipfsImageURI,
            nickname: data.name,
            role: data.role,
            bio: data.bio || "",
            basename: data.baseName || "",
            socials: data.socials,
            ipfsId: generationResult.ipfs.id,
            userAddress: data.address,
        });

        if (!mintResult.success) {
            return {
                success: false,
                step: "minting",
                error: mintResult.error || "Failed to mint NFT",
                data: {
                    ipfsCid: generationResult.ipfs.cid,
                    ipfsUrl: generationResult.ipfs.url,
                    cardId: dbResult.cardId,
                },
            };
        }

        console.log("✅ NFT minted successfully. Hash:", mintResult.hash);

        // Success!
        return {
            success: true,
            step: "completed",
            data: {
                ipfsCid: generationResult.ipfs.cid,
                ipfsUrl: generationResult.ipfs.url,
                cardId: dbResult.cardId,
                mintHash: mintResult.hash,
            },
        };
    } catch (error) {
        console.error("❌ Card minting flow error:", error);
        return {
            success: false,
            step: "generation",
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

/**
 * Process image from File or URL
 */
async function processImage(
    profileImageFile?: File,
    defaultProfileUrl?: string | { src: string }
): Promise<File | null> {
    try {
        if (profileImageFile) {
            return profileImageFile;
        }

        if (defaultProfileUrl) {
            const urlString =
                typeof defaultProfileUrl === "object" &&
                "src" in defaultProfileUrl
                    ? defaultProfileUrl.src
                    : String(defaultProfileUrl);

            const response = await fetch(urlString);
            const blob = await response.blob();
            return new File([blob], "profile-image.png", {
                type: blob.type || "image/png",
            });
        }

        return null;
    } catch (error) {
        console.error("Error processing image:", error);
        return null;
    }
}

/**
 * Save card to database
 */
async function saveCardToDatabase(data: {
    nickname: string;
    role: string;
    bio: string;
    imageURI: string;
    basename: string;
    skills: string[];
    address: string;
    profileImage: string;
}): Promise<{ success: boolean; cardId?: number; error?: string }> {
    try {
        const response = await fetch("/api/cards", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to save card");
        }

        const savedCard = await response.json();
        return {
            success: true,
            cardId: savedCard.id,
        };
    } catch (error) {
        console.error("Database save error:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to save to database",
        };
    }
}

/**
 * Clean up IPFS file
 */
async function cleanupIPFS(ipfsId: string): Promise<void> {
    try {
        console.log(`🗑️ Cleaning up IPFS file (ID: ${ipfsId})...`);
        const response = await fetch(`/api/ipfs/delete?id=${ipfsId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            console.log("✅ IPFS file cleaned up successfully");
        } else {
            console.warn("⚠️ Failed to clean up IPFS file");
        }
    } catch (error) {
        console.warn("⚠️ IPFS cleanup error:", error);
    }
}
