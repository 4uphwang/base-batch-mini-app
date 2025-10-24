#!/bin/bash
#
# Mints a BaseCard NFT for a specific recipient.
#
# Usage:
# 1. Make this script executable: chmod +x mint-nft-for.sh
# 2. Set environment variables:
#    export BASE_CARD_ADDRESS="0x..."
#    export NETWORK="https://sepolia.base.org"
#    export PRIVATE_KEY="0x..."
# 3. Run the script: ./mint-nft-for.sh

source .env 

# Exit immediately if a command fails, if variables are unset, or if a pipe fails
set -euo pipefail

# --- Configuration ---
# Hardcoded variables from your example
RECIPIENT="0x1234567890123456789012345678901234567896"
NICKNAME="Jeongseup"
ROLE="Developer"
BIO='I am Jeongseup, a blockchain developer passionate about decentralized technologies.'
IMAGE_URI="ipfs://bafybeihsyxzgalb6y4jsqvo4675htm6itxhkbypw6nipukw56biquiuiuu"
BASENAME="jeongseup.base.eth"
# Use single quotes for arrays to pass them as literal strings
SOCIAL_KEYS='["x","farcaster"]'
SOCIAL_VALUES='["jeongseup","cosmoseup.farcaster.eth"]'

# --- Environment Checks ---
# Check for required environment variables
if [ -z "${BASE_CARD_ADDRESS:-}" ]; then
  echo "Error: BASE_CARD_ADDRESS environment variable is not set." >&2
  exit 1
fi
if [ -z "${NETWORK:-}" ]; then
  echo "Error: NETWORK environment variable is not set." >&2
  exit 1
fi

# --- Main Script ---
echo "⛏️ Minting NFT for $RECIPIENT on $NETWORK..."

# The struct must be passed as a single string, with escaped quotes inside.
CARD_DATA_TUPLE="(\"$IMAGE_URI\", \"$NICKNAME\", \"$ROLE\", \"$BIO\", \"$BASENAME\")"
echo "CARD_DATA_TUPLE: $CARD_DATA_TUPLE"
echo "SOCIAL_KEYS: $SOCIAL_KEYS"
echo "SOCIAL_VALUES: $SOCIAL_VALUES"
# Execute the cast send command
cast send "$BASE_CARD_ADDRESS" \
    "mintBaseCardFor(address,(string,string,string,string,string),string[],string[])" \
    "$RECIPIENT" \
    "$CARD_DATA_TUPLE" \
    "$SOCIAL_KEYS" \
    "$SOCIAL_VALUES" \
    --rpc-url "$NETWORK" \
    -vvvv

echo "✅ NFT Minted for $RECIPIENT!"