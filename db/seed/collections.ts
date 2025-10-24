// Collection relationships - who collects whose cards
// Index mapping: 0=JellyJelly, 1=Jeongseup, 2=Sam, 3=Peter
export const sampleCollections = [
    // JellyJelly (Designer) collects other cards
    { ownerIndex: 0, collectedIndex: 1 }, // JellyJelly collects Jeongseup
    { ownerIndex: 0, collectedIndex: 2 }, // JellyJelly collects Sam
    { ownerIndex: 0, collectedIndex: 3 }, // JellyJelly collects Peter

    // Jeongseup (Developer) collects other cards
    { ownerIndex: 1, collectedIndex: 0 }, // Jeongseup collects JellyJelly
    { ownerIndex: 1, collectedIndex: 2 }, // Jeongseup collects Sam
    { ownerIndex: 1, collectedIndex: 3 }, // Jeongseup collects Peter

    // Sam (Designer) collects other cards
    { ownerIndex: 2, collectedIndex: 0 }, // Sam collects JellyJelly
    { ownerIndex: 2, collectedIndex: 1 }, // Sam collects Jeongseup
    { ownerIndex: 2, collectedIndex: 3 }, // Sam collects Peter

    // Peter (Marketer) collects other cards
    { ownerIndex: 3, collectedIndex: 0 }, // Peter collects JellyJelly
    { ownerIndex: 3, collectedIndex: 1 }, // Peter collects Jeongseup
    { ownerIndex: 3, collectedIndex: 2 }, // Peter collects Sam

    // Additional cross-collections for more variety
    { ownerIndex: 0, collectedIndex: 1 }, // JellyJelly also collects Jeongseup (duplicate for more activity)
    { ownerIndex: 1, collectedIndex: 0 }, // Jeongseup also collects JellyJelly (duplicate for more activity)
    { ownerIndex: 2, collectedIndex: 1 }, // Sam also collects Jeongseup (duplicate for more activity)
    { ownerIndex: 3, collectedIndex: 0 }, // Peter also collects JellyJelly (duplicate for more activity)
];
