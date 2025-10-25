#!/bin/bash
#
# Mints a BaseCard NFT using mock data for testing purposes.
#
# Usage:
# 1. Make this script executable: chmod +x mint-mock-token.sh
# 2. Set environment variables:
#    export BASE_CARD_ADDRESS="0x..."
#    export NETWORK="https://sepolia.base.org"
#    export PRIVATE_KEY="0x..."
# 3. Run the script: ./mint-mock-token.sh

source .env 

# Exit immediately if a command fails, if variables are unset, or if a pipe fails
set -euo pipefail

# --- Configuration ---
# Mock data from the provided example
NICKNAME="Test User"
ROLE="Developer"
BIO="This is a test mint using mock data"
IMAGE_URI="ipfs://QmTestMockHash123456789012345678901234567890"
BASENAME="@testuser"
# Use single quotes for arrays to pass them as literal strings
SOCIAL_KEYS='["x","github","farcaster"]'
SOCIAL_VALUES='["@testuser","testuser","testuser"]'

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
echo "⛏️ Minting NFT with mock data on $NETWORK..."

# The struct must be passed as a single string, with escaped quotes inside.
CARD_DATA_TUPLE="(\"$IMAGE_URI\", \"$NICKNAME\", \"$ROLE\", \"$BIO\", \"$BASENAME\")"
echo "CARD_DATA_TUPLE: $CARD_DATA_TUPLE"
echo "SOCIAL_KEYS: $SOCIAL_KEYS"
echo "SOCIAL_VALUES: $SOCIAL_VALUES"

# Execute the cast send command
cast send "$BASE_CARD_ADDRESS" \
    "mintBaseCard((string,string,string,string,string),string[],string[])" \
    "$CARD_DATA_TUPLE" \
    "$SOCIAL_KEYS" \
    "$SOCIAL_VALUES" \
    --rpc-url "$NETWORK" \
    -vvvv

echo "✅ Mock NFT Minted!"
