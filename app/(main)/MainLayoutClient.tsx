"use client";

import FooterNav from "@/components/layouts/FooterNav";
import Header from "@/components/layouts/Header";
import { useMiniAppLoader } from "@/hooks/useMiniAppLoader";
import { useIsMobile } from "@/hooks/utils/useIsMobile";
import BCLogo from "@/public/bc-icon.png";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function MainLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isFinishedLoading } = useMiniAppLoader();
    const { isMobile } = useIsMobile();
    const [hasAttemptedDeepLink, setHasAttemptedDeepLink] = useState(false);

    useEffect(() => {
        // 로딩이 완료되면 UI 표시 허용
        if (isFinishedLoading) {
            setHasAttemptedDeepLink(true);
        }
    }, [isFinishedLoading]);

    if (!isFinishedLoading || (isMobile && !hasAttemptedDeepLink)) {
        // 💡 초기 로딩 중일 때는 로딩 UI를 보여줍니다.
        return (
            <div className="fixed inset-0 z-50 bg-white flex items-center justify-center w-full h-full">
                <Image
                    src={BCLogo}
                    alt="splash-logo"
                    className="w-1/4 max-w-40 aspect-square object-contain"
                />
            </div>
        );
    }

    // 💡 미니앱이 아닐 때도 접근 가능하도록 변경
    // 대신 특정 기능에서 앱 연결이 필요하다는 안내는 각 컴포넌트에서 처리

    return (
        <div className="w-full flex flex-col h-dvh overflow-hidden">
            <Header />
            <main className="scroll-container pt-[var(--header-h,60px)] pb-[var(--bottom-nav-h,64px)]">
                {children}
            </main>
            <FooterNav />
        </div>
    );
}

