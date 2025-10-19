"use client";

import { balanceDataAtom } from '@/store/tokenBalanceState'; // 💡 읽기 전용 아톰 임포트
import { useAtom } from 'jotai';
import { AiOutlineLoading } from "react-icons/ai";

interface BalanceDisplayProps {
    className?: string;
}

export default function BalanceDisplay({ className }: BalanceDisplayProps) {
    // 💡 아톰에서 잔액 데이터를 읽어옵니다.
    const [balanceState] = useAtom(balanceDataAtom);
    const { balance, isLoading } = balanceState;

    if (isLoading) return <AiOutlineLoading size={24} className='animate-spin' />
    // if (isError) return <p className="text-red-500">잔액 조회 실패</p>;

    return (
        <div className={className}>
            {balance}  <span className='font-semibold'>BC</span>
        </div>
    )
}