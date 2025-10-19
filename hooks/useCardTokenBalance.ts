"use client";

import { chain } from "@/app/rootProvider";
import CARD_TOKEN_ABI_FULL from "@/lib/abi/CardToken.json";
import { updateBalanceAtom } from "@/store/tokenBalanceState";
import { formatAmount } from "@coinbase/onchainkit/token";
import { useSetAtom } from "jotai";
import { useEffect, useMemo } from "react";
import { Abi, formatUnits } from "viem";
import { useAccount, useReadContract } from "wagmi";

const CARD_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_CARD_TOKEN_ADDRESS! as `0x${string}`;
const CARD_TOKEN_DECIMALS = 18;

const abi = CARD_TOKEN_ABI_FULL.abi as Abi;

/**
 * 연결된 계정의 CARD 토큰 잔액을 조회하고 포맷팅하는 커스텀 훅
 */
export function useCardTokenBalance() {
    const { address: userAddress } = useAccount();
    const setBalanceState = useSetAtom(updateBalanceAtom);

    const { data, isLoading, isError } = useReadContract({
        abi: abi,
        address: CARD_TOKEN_ADDRESS,
        functionName: 'balanceOf',
        args: [userAddress],
        chainId: chain.id,
        query: {
            enabled: !!userAddress && !!CARD_TOKEN_ADDRESS,
        }
    });
    console.log(CARD_TOKEN_ADDRESS,userAddress)
    const formattedResult = useMemo(() => {
        console.log('data', userAddress, data)
        if (data === undefined) {
            return { balance: '0.00', isLoading: isLoading, isError: isError };
        }
        try {
            const amountString = formatUnits(data as bigint, CARD_TOKEN_DECIMALS);
            const balance = formatAmount(amountString, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4
            });
            return { balance, isLoading: false, isError: false };
        } catch (e) {
            console.error("Failed to format token balance:", e);
            return { balance: 'Error', isLoading: false, isError: true };
        }
    }, [data, userAddress]);

    useEffect(() => {
        setBalanceState(formattedResult);
    }, [formattedResult, setBalanceState]);


}