"use client";

import FooterNav from "@/components/layouts/FooterNav";
import Header from "@/components/layouts/Header";
import { useMiniAppLoader } from "@/hooks/useMiniAppLoader";
import { useIsMobile } from "@/hooks/utils/useIsMobile";
import { ROOT_URL } from "@/minikit.config";
import baseCardTypo from "@/public/baseCardTypo.png";
import BCLogo from "@/public/bc-icon.png";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FaArrowRight } from "react-icons/fa";

const DEEPLINK_ATTEMPT_TIMEOUT = 1000; // 1초 대기
const IOS_STORE_URL = "https://apps.apple.com/kr/app/coinbase-%EC%A7%80%EA%B0%91-nfts-%EC%95%94%ED%98%B8%ED%99%94%ED%8F%90/id1278383455";
const ANDROID_STORE_URL = "https://play.google.com/store/apps/details?id=org.toshi&pcampaignid=web_share";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isInMiniApp, isFinishedLoading } = useMiniAppLoader();
    const { isMobile, isIOS } = useIsMobile();

    const [hasAttemptedDeepLink, setHasAttemptedDeepLink] = useState(false);

    const { deepLinkUrl, appStoreLink, buttonText } = useMemo(() => {
        const deepLink = `cbwallet://miniapp?url=${encodeURIComponent(ROOT_URL)}`;

        let storeLink = ANDROID_STORE_URL;
        let btnText = "Download on Google Play";

        if (isIOS) {
            storeLink = IOS_STORE_URL;
            btnText = "Download on the App Store";
        } else if (!isMobile) {
            // Fallback for Desktop/Unknown OS
            storeLink = IOS_STORE_URL; // Default to iOS store link on desktop for simplicity
            btnText = "Download Base Wallet App";
        }

        return {
            deepLinkUrl: deepLink,
            appStoreLink: storeLink,
            buttonText: btnText
        };
    }, [isIOS, isMobile]);

    useEffect(() => {
        // 미니앱 환경이 아니며, 모바일 브라우저이고, 아직 시도하지 않았을 때만 실행
        if (isFinishedLoading && !isInMiniApp && isMobile && !hasAttemptedDeepLink) {

            // 딥링크 실행 시도 (자동 리디렉션)
            window.location.href = deepLinkUrl;

            // 1초 후에도 앱이 열리지 않으면 (폴백), 시도 상태를 업데이트하여 안내 화면 표시
            const timeoutId = setTimeout(() => {
                setHasAttemptedDeepLink(true);
            }, DEEPLINK_ATTEMPT_TIMEOUT);

            return () => clearTimeout(timeoutId);
        }

        // 데스크톱이거나 미니앱 환경인 경우, 시도 상태를 즉시 true로 설정하여 UI를 보여줍니다.
        if (isFinishedLoading && (!isMobile || isInMiniApp)) {
            setHasAttemptedDeepLink(true);
        }
    }, [isFinishedLoading, isInMiniApp, isMobile, hasAttemptedDeepLink, deepLinkUrl]);

    if (!isFinishedLoading || (isMobile && !hasAttemptedDeepLink)) {
        // 💡 딥링크 시도 중이거나 초기 로딩 중일 때는 로딩 UI를 보여줍니다.
        return (
            <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
                <Image
                    src={BCLogo}
                    alt="splash-logo"
                    className="w-1/4 max-w-40 aspect-square object-contain"
                />
            </div>
        );
    }

    if (!isInMiniApp) {
        // 💡 미니앱 환경이 아닐 때 딥링크 안내를 보여줍니다.
        console.log('isMobile', isMobile)
        if (!isMobile) {
            // 💡 데스크톱 사용자: QR 코드 표시 및 모바일 전환 유도
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6 text-white">
                    <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-sm w-full">

                        <div className="flex justify-center mb-6">
                            <Image src={baseCardTypo} alt="bc-logo" height={100} className="object-contain" />
                        </div>

                        <h2 className="text-2xl font-k2d-bold text-gray-800 mb-3">
                            Launch Your Onchain Card
                        </h2>

                        <p className="text-gray-600 mb-4 text-sm">
                            This feature requires the mobile Base Wallet app. Please download the app to continue.
                        </p>

                        <a
                            // 💡 모바일은 재시도 딥링크, 데스크톱은 스토어 링크
                            href={isMobile ? deepLinkUrl : appStoreLink}
                            className="inline-flex items-center justify-center w-full py-4 px-4 bg-blue-600 text-white font-k2d-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-colors space-x-2"
                            target="_blank"
                            rel="noopener noreferrer"
                            // 데스크톱에서는 바로 다운로드 링크로 이동, 모바일에서는 딥링크 재시도
                            onClick={(e) => {
                                if (!isMobile) {
                                    // 데스크톱에서는 딥링크 실행 없이 바로 스토어로 이동 (기본 동작)
                                    return;
                                }
                                // 모바일에서는 딥링크 실행 (href에 의해 자동 실행됨)
                            }}
                        >
                            <span>{isMobile ? "Open BaseCard in App" : buttonText}</span>
                            <FaArrowRight className="w-4 h-4" />
                        </a>


                        {!isMobile && (
                            <div className="mt-4 text-sm text-gray-500 space-x-4">
                                <a href={IOS_STORE_URL} target="_blank" className="hover:text-blue-600 underline">iOS Download</a>
                                <span>|</span>
                                <a href={ANDROID_STORE_URL} target="_blank" className="hover:text-blue-600 underline">Android Download</a>
                            </div>
                        )}

                    </div>
                </div>
            );
        }

        // 2. 모바일 브라우저 사용자: 딥링크 버튼 표시 (자동 실행 대신 버튼 유지)
        // 모바일 브라우저에서 버튼 클릭을 통해 앱 실행을 유도합니다.
        return (
            <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-gray-900 p-6 overflow-hidden">
                <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full border border-gray-100 transform hover:scale-[1.01] transition-transform duration-300">

                    <div className="flex justify-center mb-6">
                        <Image src={baseCardTypo} alt="bc-logo" height={60} className="object-contain" />
                    </div>

                    <h2 className="text-xl sm:text-2xl font-k2d-bold text-gray-800 mb-3">
                        Launch Your Onchain Card
                    </h2>

                    <p className="text-gray-500 mb-8 text-sm sm:text-base">
                        This feature requires the mobile Base Wallet app. Please press the open button to continue in the app.
                    </p>

                    {/* The Deep Link Button */}
                    <a
                        href={deepLinkUrl}
                        className="inline-flex items-center justify-center w-full py-4 px-4 bg-blue-600 text-white font-k2d-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-colors space-x-2"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span>Open BaseCard in App</span>
                        <FaArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <Header />
            <main className="pb-16 ">{children}</main>
            <FooterNav />
        </div>
    );
}
