import { useSetAtom } from 'jotai';
import { useEffect, useMemo } from "react";
import { Abi, zeroAddress } from "viem";
import { baseSepolia } from "viem/chains";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { chain } from './../app/rootProvider';

import BASECARD_NFT_ABI_FULL from "@/lib/abi/BaseCard.json";
import { updateNftDataAtom } from '@/store/nftstate';

const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_BASECARD_NFT_CONTRACT_ADDRESS! as `0x${string}`;
const abi = BASECARD_NFT_ABI_FULL.abi as Abi;

/**
 * 사용자가 BaseCard 컨트랙트에서 소유한 모든 NFT의 ID를 조회하는 훅
 */
export function useBaseCardNFTs() {
    const { address: userAddress } = useAccount();
    const setNftState = useSetAtom(updateNftDataAtom);

    // ----------------------------------------------------
    // 1단계: 소유한 NFT의 총 개수(Balance) 조회
    // ----------------------------------------------------
    const { data, isLoading, isError } = useReadContract({
        abi: abi,
        address: NFT_CONTRACT_ADDRESS,
        functionName: 'balanceOf',
        args: [userAddress || zeroAddress],
        chainId: baseSepolia.id,
        query: {
            // 사용자 주소가 유효할 때만 쿼리 실행
            enabled: !!userAddress && !!NFT_CONTRACT_ADDRESS,
        }
    });

    // 💡 소유 개수 (data가 BigInt이므로 Number로 변환)
    const nftCount = useMemo(() => {
        if (data === undefined) return 0;
        return Number(data as bigint);
    }, [data]);


    // 조회할 계약 목록을 생성합니다. (0부터 nftCount - 1까지)
    const tokenQueryContracts = useMemo(() => {
        if (nftCount === 0) return [];

        // 0부터 nftCount - 1까지의 인덱스를 배열로 생성합니다.
        const indices = Array.from({ length: nftCount }, (_, i) => BigInt(i));

        return indices.map(index => ({
            abi: abi,
            address: NFT_CONTRACT_ADDRESS,
            functionName: 'tokenOfOwnerByIndex', // 인덱스로 토큰 ID 조회
            args: [userAddress, index],
            chainId: chain.id
        }));
    }, [nftCount, userAddress]);


    // ----------------------------------------------------
    // 2단계: 총 개수만큼 반복하여 각 토큰 ID 조회 (useReadContracts)
    // ----------------------------------------------------
    const { data: tokenIdsData, isLoading: isLoadingTokens, isError: isErrorTokens } = useReadContracts({
        contracts: tokenQueryContracts,
        query: {
            enabled: tokenQueryContracts.length > 0,
        }
    });

    const finalResult = useMemo(() => {
        // ----------------------------------------------------
        // 3단계: 최종 결과 포맷팅 및 반환
        // ----------------------------------------------------
        console.log('tokenIdsData', tokenIdsData)
        const tokenIds = tokenIdsData ? tokenIdsData
            .filter(result => result.status === 'success')
            .map(result => result.result as bigint) : [];

        return {
            tokenIds,
            count: nftCount,
            isLoading: isLoading || isLoadingTokens,
            isError: isError || isErrorTokens,
        };
    }, [data])

    useEffect(() => {
        setNftState({
            ...finalResult,
            isLoading,
            isError,
        });
    }, [finalResult, isLoading, isError]);

}