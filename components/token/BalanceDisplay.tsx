"use client";

import { useCardTokenBalance } from "@/hooks/useCardTokenBalance";
import { balanceDataAtom } from "@/store/tokenBalanceState";
import { useAtom } from "jotai";
import { AiOutlineLoading } from "react-icons/ai";
import { cn, pressable, text as dsText } from "@coinbase/onchainkit/theme";

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
            className={cn(
                pressable.default,
                "text-ock-foreground",
                "relative flex w-full items-center justify-between px-4 py-3",
                className
            )}
            disabled
        >
            <div className="flex items-center gap-2">
                <div className="flex h-[1.125rem] w-[1.125rem] items-center justify-center">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            cx="9"
                            cy="9"
                            r="8"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                        <text
                            x="50%"
                            y="50%"
                            dominantBaseline="middle"
                            textAnchor="middle"
                            fill="currentColor"
                            fontSize="10"
                            fontWeight="bold"
                        >
                            BC
                        </text>
                    </svg>
                </div>
                <span className={cn(dsText.body, "font-k2d-bold")}>
                    BaseCard Token
                </span>
            </div>
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
