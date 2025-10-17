"use client";

import CollectionExamSection from "@/components/main/CollectionExamSection";
import MintPromptSection from "@/components/main/MintPromptSection";
import { useMiniKit, useQuickAuth } from "@coinbase/onchainkit/minikit";
// import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useAddress } from "@coinbase/onchainkit/identity";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useEffect } from "react";
import { base } from "viem/chains";
import { minikitConfig } from "../../minikit.config";
import { AiOutlineLoading } from "react-icons/ai";

interface AuthResponse {
    success: boolean;
    user?: {
        fid: number; // FID is the unique identifier for the user
        issuedAt?: number;
        expiresAt?: number;
    };
    message?: string; // Error messages come as 'message' not 'error'
}


export default function Home() {
    const { isFrameReady, setFrameReady, context } = useMiniKit();
    const username = context?.user?.username;

    const { data: address, isLoading: isAddressLoading } = useAddress({
        name: username || '',
        chain: base
    });

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
    //   userFid: string;
    // }>("/api/auth");

    const { data: authData, isLoading: isAuthLoading, error: authError } = useQuickAuth<AuthResponse>(
        "/api/auth",
        { method: "GET" }
    );

    const authDataJson = authData ? JSON.stringify(authData, null, 2) : 'No authentication data loaded.';


    return (
        <div className="bg-white text-black px-5 py-10">
            <div >

                <h1 >Join {minikitConfig.miniapp.name.toUpperCase()}</h1>


                <div>
                    <h2>Welcome, {context?.user?.displayName || username}</h2>
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
                    <p>address: {isAddressLoading ? <AiOutlineLoading className="animate-spin" /> : address ? address : 'None'}</p>
                </div>

                {/* 2. authData JSON 출력 (디버그 섹션) */}
                <div className="mt-6 p-4 border rounded-lg bg-gray-100 shadow-inner">
                    <h2 className="text-lg font-semibold mb-2 text-blue-800">API Auth Data (Debug)</h2>
                    {isAuthLoading && <div className="p-8 text-center text-black">인증 데이터 로딩 중...</div>}

                    <pre className="whitespace-pre-wrap text-xs text-gray-700 font-mono">
                        {authDataJson}
                    </pre>

                    {authError && <div className="p-8 text-center text-red-600">인증 중 오류 발생: {authError.message}</div>}
                </div>

                <Wallet />

                <div className="flex flex-col gap-y-10">
                    <MintPromptSection />
                    <CollectionExamSection />
                </div>
            </div>
        </div>
    );
}
