"use client";

import BaseCardLogoTypo from "@/public/baseCardTypo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

// import { userProfileAtom } from "@/store/userProfileState";
// import { useAtom } from "jotai";
// import { FaRegUserCircle } from "react-icons/fa";
import BalanceDisplay from "../token/BalanceDisplay";
import { Wallet } from "@coinbase/onchainkit/wallet";

export default function Header() {
    const router = useRouter();
    // const [userProfile] = useAtom(userProfileAtom);

    const handleLogoClick = () => {
        router.push("/");
    };

    return (
        <div className="h-[60px] w-full flex px-5 justify-between items-center border-b border-b-gray-200 bg-background-light">
            <div
                onClick={handleLogoClick}
                className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
                <Image
                    src={BaseCardLogoTypo}
                    alt="logo typo"
                    width={140}
                    height={40}
                    className="object-contain"
                />
            </div>

            <div className="flex justify-center items-center rounded-full bg-white min-w-20 h-[30px]">
                <BalanceDisplay className="px-2 font-bold flex gap-x-1" />
                <Wallet />
                {/* 
                {userProfile?.pfpUrl ? (
                    <Image
                        src={userProfile.pfpUrl}
                        alt="profile"
                        className="w-[30px] h-[30px] object-contain rounded-full border-2 border-black"
                    />
                ) : (
                    <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center">
                        <FaRegUserCircle size={28} className="text-gray-700" />
                    </div>
                )} */}
            </div>
        </div>
    );
}
