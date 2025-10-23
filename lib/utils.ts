import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const METADATA = {
    name: "BaseCard",
    description:
        "Stop repeating your pitch. Mint your verified, onchain builder profile card (SBT). Search for talent and connect directly",
    bannerImageUrl: "https://i.imgur.com/2bsV8mV.png",
    iconImageUrl: "https://i.imgur.com/brcnijg.png",
    homeUrl:
        process.env.NEXT_PUBLIC_URL ?? "https://fulldemo-minikit.vercel.app",
    splashBackgroundColor: "#FFFFFF",
};

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// 🚨 Next.js API Route로 데이터를 전송하는 함수입니다.
interface LogPayload {
    message: string;
    data?: unknown;
    path?: string; // 어떤 경로에서 로그를 보냈는지 기록
}

/**
 * 클라이언트 로그를 Next.js API Route로 전송하여 서버 콘솔에 기록합니다.
 */
export async function remoteLog(payload: LogPayload) {
    // 로컬 개발 시에는 console.log도 함께 실행합니다.
    if (process.env.NODE_ENV === "development") {
        console.log("REMOTE LOG (Local Only):", payload);
    }

    try {
        await fetch("/api/debug", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...payload,
            }),
            // 🚨 백그라운드에서 실행되도록 fetch 옵션을 설정합니다.
            cache: "no-store",
        });
    } catch (error) {
        // API 호출 자체에 실패했을 경우 (네트워크 오류 등)
        console.error("Failed to send remote log:", error);
    }
}
