"use client";

import FooterNav from "@/components/layouts/FooterNav";
import Header from "@/components/layouts/Header";
import { useMiniAppLoader } from "@/hooks/useMiniAppLoader";
// import { ROOT_URL } from "@/minikit.config";
import BCLogo from "@/public/bc-icon.png";
import Image from "next/image";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isInMiniApp, isFinishedLoading } = useMiniAppLoader();

    if (!isFinishedLoading) {
        // 💡 로딩 중일 때는 메인 콘텐츠 렌더링을 막습니다.
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

    // if (!isInMiniApp) {
    //     // 💡 미니앱 환경이 아닐 때 딥링크 안내를 보여줍니다.
    //     const deepLinkUrl = `cbwallet://miniapp?url=${encodeURIComponent(
    //         ROOT_URL
    //     )}`;

    //     return (
    //         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
    //             <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm">
    //                 <h2 className="text-2xl font-bold text-red-600 mb-4">
    //                     ⚠️ Not a Base Mini App
    //                 </h2>
    //                 <p className="text-gray-700 mb-6">
    //                     This feature requires execution within the{" "}
    //                     <span className="font-semibold">Base Wallet app</span>{" "}
    //                     for secure and seamless operation.
    //                 </p>

    //                 {/* The Deep Link Button */}
    //                 <a
    //                     href={deepLinkUrl}
    //                     className="inline-flex items-center justify-center w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
    //                     target="_blank"
    //                     rel="noopener noreferrer"
    //                 >
    //                     Launch Mini App in Base 🚀
    //                 </a>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div>
            <Header />
            <main className="pb-16 ">{children}</main>
            <FooterNav />
        </div>
    );
}
