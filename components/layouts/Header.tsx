"use client";

import BaseCardLogoTypo from "@/public/baseCardTypo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

// import { userProfileAtom } from "@/store/userProfileState";
// import { useAtom } from "jotai";
// import { FaRegUserCircle } from "react-icons/fa";
import BalanceDisplay from "../token/BalanceDisplay";
import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletDropdownBasename,
    WalletDropdownFundLink,
    WalletDropdownLink,
    WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
    Address,
    Avatar,
    Name,
    Identity,
    EthBalance,
} from "@coinbase/onchainkit/identity";

export default function Header() {
    const router = useRouter();
    // const [userProfile] = useAtom(userProfileAtom);

    const handleLogoClick = () => {
        router.push("/");
    };

    return (
        <div className="h-[50px] w-full flex px-4 items-center border-b border-b-gray-200 bg-background-light">
            <div
                onClick={handleLogoClick}
                className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
                <Image
                    src={BaseCardLogoTypo}
                    alt="logo typo"
                    width={110}
                    height={32}
                    className="object-contain"
                />
            </div>

            <div className="ml-auto flex justify-center items-center rounded-full bg-white min-w-16 h-[28px] gap-x-1">
                <div className="scale-75 origin-right">
                    <Wallet>
                        {/* 커넥트 전 표시  */}
                        <ConnectWallet>
                            <Avatar className="h-6 w-6" />
                            <Name />
                        </ConnectWallet>
                        <WalletDropdown>
                            <Identity
                                className="px-4 pt-3 pb-2 font-k2d-bold"
                                hasCopyAddressOnClick
                            >
                                {/* TODO: 여기에 basename pfp */}
                                <Avatar />
                                <Name />
                                <Address />
                                <EthBalance className="text-xl font-k2d-bold" />
                            </Identity>

                            {/* BASECARD TOKEN BALANCE */}
                            <BalanceDisplay className="text-xl font-k2d-bold" />
                            <WalletDropdownDisconnect className="text-xl font-k2d-bold" />
                        </WalletDropdown>
                    </Wallet>
                </div>
            </div>
        </div>
    );
}
