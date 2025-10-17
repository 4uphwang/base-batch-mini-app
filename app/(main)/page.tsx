"use client";

import CollectionExamSection from "@/components/main/CollectionExamSection";
import MintPromptSection from "@/components/main/MintPromptSection";
// import { useMiniKit, useQuickAuth } from "@coinbase/onchainkit/minikit";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useEffect } from "react";
import { minikitConfig } from "../../minikit.config";

// interface AuthResponse {
//     success: boolean;
//     user?: {
//         fid: number; // FID is the unique identifier for the user
//         issuedAt?: number;
//         expiresAt?: number;
//     };
//     message?: string; // Error messages come as 'message' not 'error'
// }


export default function Home() {
    const { isFrameReady, setFrameReady, context } = useMiniKit();

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

    // const { data: authData, isLoading: isAuthLoading, error: authError } = useQuickAuth<AuthResponse>(
    //     "/api/auth",
    //     { method: "GET" }
    // );


    return (
        <div className="bg-white text-black px-5 py-10">
            <div >

                <h1 >Join {minikitConfig.miniapp.name.toUpperCase()}</h1>


                <div>
                    <h2>Welcome, {context?.user?.displayName || context?.user?.username}</h2>
                    <p>FID: {context?.user?.fid}</p>
                    <p>Username: @{context?.user?.username}</p>
                    {context?.user?.pfpUrl && (
                        <img
                            src={context?.user?.pfpUrl}
                            alt="Profile"
                            width={64}
                            height={64}
                            style={{ borderRadius: '50%' }}
                        />
                    )}
                </div>

                <div className="flex flex-col gap-y-10">
                    <MintPromptSection />
                    <CollectionExamSection />
                </div>
            </div>
        </div>
    );
}
