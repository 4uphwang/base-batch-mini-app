// Collection relationships - who collects whose cards
// Index mapping: 0=Jihwang, 1=Mozzigom, 2=Soyverse, 3=Tomatocat
export const sampleCollections = [
    // Jihwang (Marketer) collects other cards
    { ownerIndex: 0, collectedIndex: 1 }, // Jihwang collects Mozzigom
    { ownerIndex: 0, collectedIndex: 2 }, // Jihwang collects Soyverse
    { ownerIndex: 0, collectedIndex: 3 }, // Jihwang collects Tomatocat

    // Mozzigom (Developer) collects other cards
    { ownerIndex: 1, collectedIndex: 0 }, // Mozzigom collects Jihwang
    { ownerIndex: 1, collectedIndex: 2 }, // Mozzigom collects Soyverse
    { ownerIndex: 1, collectedIndex: 3 }, // Mozzigom collects Tomatocat

    // Soyverse (Designer) collects other cards
    { ownerIndex: 2, collectedIndex: 0 }, // Soyverse collects Jihwang
    { ownerIndex: 2, collectedIndex: 1 }, // Soyverse collects Mozzigom
    { ownerIndex: 2, collectedIndex: 3 }, // Soyverse collects Tomatocat

    // Tomatocat (Designer) collects other cards
    { ownerIndex: 3, collectedIndex: 0 }, // Tomatocat collects Jihwang
    { ownerIndex: 3, collectedIndex: 1 }, // Tomatocat collects Mozzigom
    { ownerIndex: 3, collectedIndex: 2 }, // Tomatocat collects Soyverse
];
