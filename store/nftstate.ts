import { atom } from 'jotai';

interface NFTState {
    tokenIds: bigint[];
    count: number;
    isLoading: boolean;
    isError: boolean;
}


const initialNFTState: NFTState = {
    tokenIds: [],
    count: 0,
    isLoading: true,
    isError: false,
};

export const nftDataAtom = atom(initialNFTState);

export const updateNftDataAtom = atom(
    null,
    (get, set, update: NFTState) => {
        set(nftDataAtom, update);
    }
);