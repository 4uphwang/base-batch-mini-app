"use client";

import { updateProfileAtom } from "@/store/userProfileState";
import { sdk } from "@farcaster/miniapp-sdk";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { isDevelopment } from './../app/rootProvider';

interface MiniAppLoaderResult {
    isInMiniApp: boolean;
    isFinishedLoading: boolean;
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
                // setIsInMiniApp(miniAppStatus);
                setIsInMiniApp(isDevelopment ? true : miniAppStatus);

                if (miniAppStatus) {
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
                setIsInMiniApp(false);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserData();
    }, [setProfile]);

    return {
        isInMiniApp,
        isFinishedLoading: !isLoading
    };
}