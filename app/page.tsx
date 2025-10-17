"use client";
import { useMiniKit, useQuickAuth } from "@coinbase/onchainkit/minikit";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { minikitConfig } from "../minikit.config";

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
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    // Initialize the  miniapp
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

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Check authentication first
        if (isAuthLoading) {
            setError("Please wait while we verify your identity...");
            return;
        }

        if (authError || !authData?.success) {
            setError("Please authenticate to join the waitlist");
            return;
        }

        if (!email) {
            setError("Please enter your email address");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        // TODO: Save email to database/API with user FID
        console.log("Valid email submitted:", email);
        console.log("User authenticated:", authData.user);

        // Navigate to success page
        router.push("/success");
    };


    return (
        <div>
            <button className="text-white bg-black " type="button">
                ✕
            </button>

            <div >
                <div >
                    <h1 >Join {minikitConfig.miniapp.name.toUpperCase()}</h1>

                    <p >
                        {context?.user?.displayName || "there"}, Get early access and be the first to experience the future of<br />
                        crypto marketing strategy.
                    </p>

                    <div>
                        <h2>Welcome, {context?.user?.displayName || context?.user?.username}!</h2>
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

                    <form onSubmit={handleSubmit} >
                        <input
                            type="email"
                            placeholder="Your amazing email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            
                        />

                        {error && <p >{error}</p>}

                        <button type="submit" >
                            JOIN WAITLIST
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
