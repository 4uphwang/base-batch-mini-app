"use client";

import CollectionExamSection from "@/components/main/CollectionExamSection";
import MintPromptSection from "@/components/main/MintPromptSection";
import MyCardSection from "@/components/main/MyCardSection";
import { useBaseCardNFTs } from "@/hooks/useBaseCardNFTs";
import { nftDataAtom } from "@/store/nftstate";
// import { useMiniKit, useQuickAuth } from "@coinbase/onchainkit/minikit";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useAtom } from "jotai";
// import { NFTCard } from '@coinbase/onchainkit/nft';
// import {
//     NFTLastSoldPrice,
//     NFTMedia,
//     NFTNetwork,
//     NFTOwner,
//     NFTTitle,
// } from '@coinbase/onchainkit/nft/view';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// interface AuthResponse {
//     success: boolean;
//     user?: {
//         fid: number; // FID is the unique identifier for the user
//         issuedAt?: number;
//         expiresAt?: number;
//     };
//     message?: string; // Error messages come as 'message' not 'error'
// }


export default function Main() {
    const { isFrameReady, setFrameReady } = useMiniKit();
    const router = useRouter();
    useBaseCardNFTs();
    const [nftData] = useAtom(nftDataAtom);
    const { count } = nftData;
    const hasNFT = count !== 0;

    useEffect(() => {
        if (!isFrameReady) {
            setFrameReady();
        }
    }, [setFrameReady, isFrameReady]);

    // If you need to verify the user's identity, you can use the useQuickAuth hook.
    // This hook will verify the user's signature and return the user's FID. You can update
    // this to meet your needs. See the /app/api/auth/route.ts file for more details.
    // Note: If you don't need to verify the user's identity, you can get their FID and other user data
    // via `context.user.fid`.
    // const { data, isLoading, error } = useQuickAuth<{
    //     userFid: string;
    // }>("/api/auth");

    // const { data: authData, isLoading: isAuthLoading, error: authError } = useQuickAuth<AuthResponse>(
    //     "/api/auth",
    //     { method: "GET" }
    // );

    // const authDataJson = authData ? JSON.stringify(authData, null, 2) : 'No authentication data loaded.';
    const handleMintRedirect = () => {
        router.push('/mint');
    };

    return (
        <div className="bg-white text-black py-10">
            <div >
                <div>
                    {/* <NFTCard
                        contractAddress='0x9c574048C5e9aB81C185BF1EDE2484F06D44dCeA'
                        tokenId='1'
                    >
                        <NFTMedia />
                        <NFTTitle />
                        <NFTOwner />
                        <NFTLastSoldPrice />
                        <NFTNetwork />
                    </NFTCard> */}
                    {/* <h2>Welcome, {context?.user?.displayName || username}</h2>
                    <p>FID: {context?.user?.fid}</p>
                    <p>Username: @{username}</p>
                    {context?.user?.pfpUrl && (
                        <img
                            src={context?.user?.pfpUrl}
                            alt="Profile"
                            width={64}
                            height={64}
                            style={{ borderRadius: '50%' }}
                        />
                    )}
                    <p>address: {isAddressLoading ? <AiOutlineLoading className="animate-spin" /> : address ? address : 'None'}</p> */}
                </div>

                {!hasNFT ? <div className="flex flex-col gap-y-10">
                    <MyCardSection />
                </div> : <div className="flex flex-col gap-y-10">
                    <MintPromptSection onMintClick={handleMintRedirect} />
                    <CollectionExamSection />
                </div>}
            </div>
        </div>
    );
}
