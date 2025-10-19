"use client";

import CollectionExamSection from "@/components/main/CollectionExamSection";
import MintPromptSection from "@/components/main/MintPromptSection";
import { remoteLog } from "@/lib/utils";
// import { useMiniKit, useQuickAuth } from "@coinbase/onchainkit/minikit";
import { getTokens } from '@coinbase/onchainkit/api';
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { Token } from "@coinbase/onchainkit/token";
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

    // const username = context?.user?.username;

    useEffect(() => {
        if (!isFrameReady) {
            setFrameReady();
        }
    }, [setFrameReady, isFrameReady]);

    useEffect(() => {
        const getBaseCardTokens = async () => {
            // 💡 2. 비동기 함수 시작 로그: API 호출 시작 직전
            console.log('getBaseCardTokens: Initiating token API call with limit=1, search=CARD.');

            try {
                const tokens = await getTokens({ search: 'BaseCard' });

                // 💡 2. 데이터 로드 완료 로그: API 응답 수신 확인
                console.log('getBaseCardTokens: API response received.');

                // 💡 3. 데이터 내용 상세 로그: 실제 데이터 객체 출력 및 서버 로깅
                if (tokens) {
                    console.log('SUCCESS: BaseCard tokens found.', tokens);

                    remoteLog({
                        message: 'TOKEN_FETCH_SUCCESS',
                        data: { tokenCount: (tokens as Token[]).length, tokens: tokens }
                    });

                } else {
                    console.log('INFO: No tokens found matching the criteria.', tokens);
                    remoteLog({ message: 'TOKEN_FETCH_INFO', data: 'No tokens found' });
                }

            } catch (error: any) {
                // 💡 4. 오류 로그: API 호출 중 문제 발생 시
                console.error('ERROR: Failed to fetch BaseCard tokens.', error);

                // 💡 서버 로깅 추가: 오류 상세 내용 전송
                remoteLog({
                    message: 'TOKEN_FETCH_ERROR',
                    data: { error: error.message || 'Unknown error' }
                });
            }
        }

        getBaseCardTokens();
    }, [])


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

    // const authDataJson = authData ? JSON.stringify(authData, null, 2) : 'No authentication data loaded.';
    const handleMintRedirect = () => {
        router.push('/mint');
    };

    return (
        <div className="bg-white text-black py-10">
            <div >
                <div>
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

                {/* 2. authData JSON 출력 (디버그 섹션) */}
                {/* <div className="mt-6 p-4 border rounded-lg bg-gray-100 shadow-inner">
                    <h2 className="text-lg font-semibold mb-2 text-blue-800">API Auth Data (Debug)</h2>
                    {isAuthLoading && <div className="p-8 text-center text-black">인증 데이터 로딩 중...</div>}

                    <pre className="whitespace-pre-wrap text-xs text-gray-700 font-mono">
                        {authDataJson}
                    </pre>

                    {authError && <div className="p-8 text-center text-red-600">인증 중 오류 발생: {authError.message}</div>}
                </div> */}

                <div className="flex flex-col gap-y-10">
                    <MintPromptSection onMintClick={handleMintRedirect} />
                    <CollectionExamSection />
                </div>
            </div>
        </div>
    );
}
