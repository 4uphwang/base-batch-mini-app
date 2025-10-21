// Collection relationships - who collects whose cards
export const sampleCollections = [
  // Alice collects Bob and Carol's cards
  { ownerIndex: 0, collectedIndex: 1 }, // Alice collects Bob
  { ownerIndex: 0, collectedIndex: 2 }, // Alice collects Carol

  // Bob collects Alice and David's cards
  { ownerIndex: 1, collectedIndex: 0 }, // Bob collects Alice
  { ownerIndex: 1, collectedIndex: 3 }, // Bob collects David

  // Carol collects Eva and Alice's cards
  { ownerIndex: 2, collectedIndex: 4 }, // Carol collects Eva
  { ownerIndex: 2, collectedIndex: 0 }, // Carol collects Alice

  // David collects Bob and Eva's cards
  { ownerIndex: 3, collectedIndex: 1 }, // David collects Bob
  { ownerIndex: 3, collectedIndex: 4 }, // David collects Eva

  // Eva collects Carol and David's cards
  { ownerIndex: 4, collectedIndex: 2 }, // Eva collects Carol
  { ownerIndex: 4, collectedIndex: 3 }, // Eva collects David

  // Additional cross-collections for more variety
  { ownerIndex: 0, collectedIndex: 3 }, // Alice also collects David
  { ownerIndex: 1, collectedIndex: 2 }, // Bob also collects Carol
  { ownerIndex: 2, collectedIndex: 1 }, // Carol also collects Bob
  { ownerIndex: 3, collectedIndex: 0 }, // David also collects Alice
  { ownerIndex: 4, collectedIndex: 0 }, // Eva also collects Alice
];
