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


    // 1. 환경 확인 및 Mini App Ready 호출 로직
    const checkEnvironmentAndSetReady = useCallback(async () => {
        try {
            // A. 환경 확인: 실제 Mini App 환경인지 확인 (개발 모드에서는 강제 true)
            const miniAppStatus = isDevelopment ? true : await sdk.isInMiniApp();
            setIsInMiniApp(miniAppStatus);

            // B. Mini App 환경일 경우에만 Frame Ready 신호 전송
            if (miniAppStatus && !isMiniAppReady) {
                setMiniAppReady();
            }
        } catch (error) {
            console.error("Error checking Mini App status:", error);
            setIsInMiniApp(false);
        } finally {
            // 환경 확인 로직이 끝났음을 표시
            setIsEnvironmentChecked(true);
        }
    }, [isMiniAppReady, setMiniAppReady]);

    // 2. 환경 확인 로직은 앱 마운트 시점에 한 번 실행
    useEffect(() => {
        checkEnvironmentAndSetReady();
    }, [checkEnvironmentAndSetReady]);


    // 3. 사용자 데이터 로딩 로직
    const loadUserData = useCallback(async () => {
        try {
            // Mini App 환경이고, isMiniAppReady(Frame Ready) 신호가 완료되었는지 확인
            if (isInMiniApp) {
                const context = await sdk.context;
                const userData = context.user;

                setProfile({
                    fid: userData.fid || null,
                    username: userData.username || null,
                    displayName: userData.displayName || null,
                    pfpUrl: userData.pfpUrl || null,
                });
            }
        } catch (error) {
            console.error("Error loading Mini App data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [isInMiniApp, setProfile]);

    // 4. 데이터 로딩 실행 useEffect:
    // 환경 확인이 완료되었고 (isEnvironmentChecked),
    // Frame Ready 신호가 완료되었거나 (isMiniAppReady),
    // Mini App 환경이 아닐 때 (isInMiniApp이 false일 때) 실행합니다.
    useEffect(() => {
        if (isEnvironmentChecked) {
            if (!isInMiniApp) {
                // Mini App이 아니면, 데이터 로딩 없이 즉시 완료 (isLoading: false)
                setIsLoading(false);
            } else if (isMiniAppReady) {
                // Mini App이 맞고, Frame Ready 신호가 완료되면 데이터 로딩 시작
                loadUserData();
            }
        }
    }, [isEnvironmentChecked, isInMiniApp, isMiniAppReady, loadUserData]);

    return {
        isInMiniApp,
        isFinishedLoading: !isLoading,
    };
}
