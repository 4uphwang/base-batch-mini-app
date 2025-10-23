"use client";

import { useCardTokenBalance } from "@/hooks/useCardTokenBalance";
import { balanceDataAtom } from "@/store/tokenBalanceState";
import { cn, text as dsText } from "@coinbase/onchainkit/theme";
import { useAtom } from "jotai";
import { AiOutlineLoading } from "react-icons/ai";

interface BalanceDisplayProps {
    className?: string;
}

export default function BalanceDisplay({ className }: BalanceDisplayProps) {
    useCardTokenBalance();
    const [balanceState] = useAtom(balanceDataAtom);
    const { balance, isLoading } = balanceState;

    return (
        <button
            type="button"
            className={`text-ock-foreground relative flex w-full items-center justify-between ${className} `}
            disabled
        >
            <div className="flex items-center gap-1">
                {isLoading ? (
                    <AiOutlineLoading size={14} className="animate-spin" />
                ) : (
                    <span className={cn(dsText.body, "font-k2d-bold")}>
                        {balance} BC
                    </span>
                )}
            </div>
        </button>
    );
}
