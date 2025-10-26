"use client";

import { isDevelopment } from "@/lib/utils";
import { updateProfileAtom } from "@/store/userProfileState";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { sdk } from "@farcaster/miniapp-sdk";
import { useSetAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

interface MiniAppLoaderResult {
    isInMiniApp: boolean;
    isFinishedLoading: boolean;
}

export function useMiniAppLoader(): MiniAppLoaderResult {
    const setProfile = useSetAtom(updateProfileAtom);
    const [isInMiniApp, setIsInMiniApp] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isEnvironmentChecked, setIsEnvironmentChecked] = useState<boolean>(false);

    const { isMiniAppReady, setMiniAppReady } = useMiniKit();

    // 1. 환경 확인 로직만 수행 
    const checkEnvironment = useCallback(async () => {
        try {
            // A. 환경 확인: 실제 Mini App 환경인지 확인 (개발 모드에서는 강제 true)
            const miniAppStatus = isDevelopment ? true : await sdk.isInMiniApp();
            setIsInMiniApp(miniAppStatus);
        } catch (error) {
            console.error("Error checking Mini App status:", error);
            setIsInMiniApp(false);
        } finally {
            // 환경 확인 로직이 끝났음을 표시
            setIsEnvironmentChecked(true);
        }
    }, []);

    // 2. 사용자 데이터 로딩 및 Ready 신호 전송 로직 (결합)
    const loadUserDataAndSetReady = useCallback(async () => {
        try {
            if (isInMiniApp) {
                // A. 필수 데이터 로딩 (sdk.context)
                const context = await sdk.context;
                if (!context) return;

                const userData = context.user;

                setProfile({
                    fid: userData.fid || null,
                    username: userData.username || null,
                    displayName: userData.displayName || null,
                    pfpUrl: userData.pfpUrl || null,
                });

                // B. 데이터 로딩이 완료된 후, 그리고 아직 신호를 보내지 않았을 때만 setMiniAppReady 호출
                if (!isMiniAppReady) {
                    setMiniAppReady();
                }
            }
        } catch (error) {
            console.error("Error loading Mini App data:", error);
        } finally {
            setIsLoading(false); // 로딩 종료
        }
    }, [isInMiniApp, isMiniAppReady, setMiniAppReady, setProfile]);


    // 3. 환경 확인 실행: 앱 마운트 시점에 한 번 실행
    useEffect(() => {
        checkEnvironment();
    }, [checkEnvironment]);


    // 4. 데이터 로딩 및 Ready 신호 발송 실행
    useEffect(() => {
        if (isEnvironmentChecked) {
            if (!isInMiniApp) {
                setIsLoading(false);
            } else {
                loadUserDataAndSetReady();
            }
        }
    }, [isEnvironmentChecked, isInMiniApp, loadUserDataAndSetReady]);

    return {
        isInMiniApp,
        isFinishedLoading: !isLoading,
    };
}