import { atom } from "jotai";

interface TokenBalanceState {
    balance: string;
    isLoading: boolean;
    isError: boolean;
}

const initialBalanceState: TokenBalanceState = {
    balance: "0.00",
    isLoading: true,
    isError: false,
};

export const balanceDataAtom = atom<TokenBalanceState>(initialBalanceState);

export const updateBalanceAtom = atom(
    null,
    (get, set, update: TokenBalanceState) => {
        set(balanceDataAtom, update);
    }
);
