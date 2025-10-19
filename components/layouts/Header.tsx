"use client";

import BaseCardLogoTypo from "@/public/baseCardTypo.png";
import Image from "next/image";

import { userProfileAtom } from "@/store/userProfileState";
import { useAtom } from "jotai";
import BalanceDisplay from "../token/BalanceDisplay";

export default function Header() {
    const [userProfile] = useAtom(userProfileAtom)

    return (
        <div className="h-[60px] w-full flex px-5 justify-between items-center border-b border-b-gray-200">
            <Image
                src={BaseCardLogoTypo}
                alt="logo typo"
                width={140}
                height={40}
                className="object-contain"
            />

            <div className="flex gap-x-2 justify-center items-center">
                <BalanceDisplay />
                {userProfile?.pfpUrl &&
                    <Image
                        src={userProfile.pfpUrl}
                        alt="profile"
                        className="w-[30px] h-[30px] object-contain rounded-full border-2 border-black"
                    />
                }
            </div>

        </div>
    );
}