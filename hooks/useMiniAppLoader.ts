"use client";

import { updateProfileAtom } from "@/store/userProfileState";
import { sdk } from "@farcaster/miniapp-sdk";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { isDevelopment } from './../app/rootProvider';

interface MiniAppLoaderResult {
    isInMiniApp: boolean;
    isFinishedLoading: boolean; // 로딩 완료 여부
}

export function useMiniAppLoader(): MiniAppLoaderResult {
    const setProfile = useSetAtom(updateProfileAtom);
    const [isInMiniApp, setIsInMiniApp] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadUserData = async () => {
            setIsLoading(true);

            try {
                const miniAppStatus = await sdk.isInMiniApp();
                setIsInMiniApp(miniAppStatus);
                // setIsInMiniApp(isDevelopment ? true : miniAppStatus);

                if (miniAppStatus) {
                    const context = await sdk.context;
                    const userData = context.user;

                    // 💡 전역 상태(Jotai)에 사용자 정보만 저장
                    setProfile({
                        fid: userData.fid || null,
                        username: userData.username || null,
                        displayName: userData.displayName || null,
                        pfpUrl: userData.pfpUrl || null,
                    });
                }
            } catch (error) {
                console.error("Error loading Mini App data:", error);
                setIsInMiniApp(false); // 오류 시 미니앱 환경이 아니라고 가정
            } finally {
                setIsLoading(false); // 💡 로딩 완료
            }
        };

        loadUserData();
    }, [setProfile]);

    return {
        isInMiniApp,
        isFinishedLoading: !isLoading
    };
}