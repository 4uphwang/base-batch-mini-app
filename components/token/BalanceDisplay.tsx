"use client";

import { useCardTokenBalance } from "@/hooks/useCardTokenBalance";
import { balanceDataAtom } from "@/store/tokenBalanceState";
import { useAtom } from "jotai";
import { AiOutlineLoading } from "react-icons/ai";

interface BalanceDisplayProps {
    className?: string;
}

export default function BalanceDisplay({ className }: BalanceDisplayProps) {
    useCardTokenBalance();
    const [balanceState] = useAtom(balanceDataAtom);
    const { balance, isLoading } = balanceState;

    // if (isError) return <p className="text-red-500">잔액 조회 실패</p>;

    return (
        <div className={className}>
            {isLoading ? (
                <AiOutlineLoading size={20} className="animate-spin min-w-12" />
            ) : (
                balance
            )}
            <span className="font-bold">BC</span>
        </div>
    );
}
