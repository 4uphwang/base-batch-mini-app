"use client";

import BaseCardLogoTypo from "@/public/baseCardTypo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { userProfileAtom } from "@/store/userProfileState";
import sdk from "@farcaster/miniapp-sdk";
import { useAtom } from "jotai";
import BalanceDisplay from "../token/BalanceDisplay";

export default function Header() {
    const router = useRouter();
    const [userProfile] = useAtom(userProfileAtom);
    const { actions } = sdk;

    const fixedColor1 = getFixedColorForUser(userProfile.fid ? Number(userProfile.fid) : 0, 0);
    const fixedColor2 = getFixedColorForUser(userProfile.fid ? Number(userProfile.fid) : 0, 1);

    const backgroundStyle = `linear-gradient(45deg, ${fixedColor1}, ${fixedColor2})`;
    const initial = (userProfile.displayName || userProfile.fid)?.toString().charAt(0).toUpperCase() || '';

    const handleLogoClick = () => {
        router.push("/");
    };

    return (
        <div className="h-[60px] w-full flex px-4 items-center border-b border-b-gray-200 bg-background-light">
            <div
                onClick={handleLogoClick}
                className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
                <Image
                    src={BaseCardLogoTypo}
                    alt="logo typo"
                    height={40}
                    className="object-contain"
                />
            </div>

            <div className="ml-auto flex justify-center items-center rounded-full bg-white min-w-16 h-8 gap-x-1">
                <BalanceDisplay className="rounded-full pr-1 pl-2 font-bold" />

                <div>
                    {
                        userProfile?.pfpUrl && userProfile?.fid
                            ? <button
                                onClick={() => actions.viewProfile({ fid: userProfile.fid! })}
                                className="flex-shrink-0"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={userProfile.pfpUrl}
                                    alt="Profile"
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                            </button>
                            : <div
                                style={{ background: backgroundStyle }}
                                className="w-8 h-8 rounded-full flex justify-center items-center text-lg font-bold text-white"
                            >
                                {initial}
                            </div>
                    }
                </div>
            </div>
        </div >
    );
}


/**
 * FID (숫자)를 시드로 사용하여 항상 같은 랜덤 값 (0~1)을 반환하는 결정론적 함수
 */
function getDeterministicRandom(seed: number) {
    let x = Math.sin(seed + 1) * 10000;
    return x - Math.floor(x);
}

/**
 * FID와 인덱스를 기반으로 고정된 CSS Hex 색상을 생성합니다.
 */
function getFixedColorForUser(fid: number, index: number) {
    if (!fid) return "#CCCCCC"; // FID가 없으면 기본 회색 반환

    const seed = fid * 10 + index;
    const randomValue = getDeterministicRandom(seed);
    const colorNumber = Math.floor(randomValue * 16777215);

    // Hex 문자열로 변환하고 6자리로 채움
    const hex = colorNumber.toString(16).padStart(6, '0').toUpperCase();

    return `#${hex}`;
}