# 🎴 BaseCard Smart Contracts

> **EVM Security Sentinel & TDD Architect**  
> Building secure, gas-optimized smart contracts with test-driven development.

This project implements the smart contracts for the BaseCard MVP, a system where users can mint an NFT representing their profile card and earn tokens for certain actions.

Built with [Foundry](https://book.getfoundry.sh/) — the blazing fast, modern toolkit for Ethereum development.

---

## 📋 Table of Contents

-   [Core Features](#-core-features)
-   [Contract Architecture](#-contract-architecture)
-   [Getting Started](#-getting-started)
-   [Development Workflow](#-development-workflow)
-   [Deployment Guide](#-deployment-guide)
-   [Contract Interaction](#-contract-interaction)
-   [Security Considerations](#-security-considerations)

---

## 🎯 Core Features

| Feature                | Description                                                                           | Reward          |
| ---------------------- | ------------------------------------------------------------------------------------- | --------------- |
| **Mint-to-Earn**       | Users receive `CARD` tokens when they mint their first `BaseCard` NFT                 | ✅ Token Reward |
| **Link-to-Earn**       | Users receive `CARD` tokens when linking social profiles (X/Twitter, Farcaster, etc.) | ✅ Token Reward |
| **Profile Management** | Update nickname, bio, image, basename, and social links                               | -               |
| **Social Integration** | Connect multiple social accounts to your BaseCard                                     | -               |

### Token Economics

-   **ERC721 `BaseCard` NFT**: Non-fungible token representing user's identity card
-   **ERC20 `CARD` Token**: Fungible reward token for ecosystem participation

---

## 🏗️ Contract Architecture

```
contracts/
├── src/
│   ├── BaseCard.sol      # Main ERC721 NFT contract (Profile Cards)
│   └── CardToken.sol     # ERC20 reward token contract
├── test/
│   └── BaseCard.t.sol    # Comprehensive test suite (TDD)
├── script/
│   └── DeployBaseCard.s.sol  # Deployment script
└── Makefile              # Simplified command interface
```

### Security Features

-   ✅ **OpenZeppelin Contracts**: Battle-tested, audited implementations
-   ✅ **Access Control**: Owner-only administrative functions
-   ✅ **Reentrancy Protection**: Secure state management patterns
-   ✅ **Input Validation**: Comprehensive parameter checking
-   ✅ **Gas Optimizations**: Custom errors, immutable variables, efficient data structures

---

## 🚀 Getting Started

### Prerequisites

1. **Install Foundry**:

    ```bash
    curl -L https://foundry.paradigm.xyz | bash
    foundryup
    ```

2. **Install Dependencies**:
    ```bash
    # Install jq for JSON parsing (needed for batch minting)
    brew install jq  # macOS
    # or
    sudo apt install jq  # Linux
    ```

### Initial Setup

Follow these steps to set up your development environment:

```bash
# 1. Navigate to contracts directory
cd contracts

# 2. Create mnemonic file (your 12/24 word seed phrase)
touch .mn
# Add your mnemonic phrase to .mn file

# 3. Create password file for keystore encryption
touch .password
# Add your password to .password file

# 4. Copy and configure environment variables
cp .env.example .env
# Edit .env with your configuration (see below)

# 5. Import deployer wallet into Foundry keystore
make wallet-import

# 6. Verify wallet import
make wallet-list
```

### Environment Configuration

Edit `.env` with your configuration:

```bash
# Network RPC URLs
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_MAINNET_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key_here
NETWORK=base_sepolia

# Foundry Configuration
ETH_FROM=your_deployer_address          # Your wallet address
ETH_KEYSTORE_ACCOUNT=deployer           # Keystore account name
ETH_PASSWORD=.password                  # Password file path

# Deployed Contract Addresses (will be filled after deployment)
CARD_TOKEN_ADDRESS=deployed_card_token_contract
BASE_CARD_ADDRESS=deployed_basecard_contract
```

---

## 🛠️ Development Workflow

### Build

Compile the smart contracts:

```bash
forge build
```

### Test (TDD Approach)

Run the comprehensive test suite:

```bash
# Run all tests
forge test

# Run with verbosity
forge test -vvv

# Run specific test
forge test --match-test testMintBaseCard

# Generate gas report
forge test --gas-report

# Check test coverage
forge coverage
```

### Format

Format code following Solidity style guide:

```bash
forge fmt
```

### Static Analysis

```bash
# Run Slither (install: pip3 install slither-analyzer)
slither .

# Run Mythril
myth analyze src/BaseCard.sol
```

---

## 🚀 Deployment Guide

### Step 1: Deploy Contracts

Deploy `CardToken` and `BaseCard` contracts:

```bash
make deploy
```

**Expected Output**:

```
🚀 Deploying contracts to base_sepolia...
✅ CardToken deployed to: 0x...
✅ BaseCard deployed to: 0x...
✅ Deployment successful!
```

### Step 2: Update Environment Variables

After successful deployment, update your `.env` file with the deployed addresses:

```bash
CARD_TOKEN_ADDRESS=0x...  # Address from deployment output
BASE_CARD_ADDRESS=0x...   # Address from deployment output
```

### Step 3: Verify Contracts (Optional)

```bash
# Verify on Basescan
forge verify-contract \
    --chain-id 84532 \
    --num-of-optimizations 200 \
    --constructor-args $(cast abi-encode "constructor(address)" $CARD_TOKEN_ADDRESS) \
    $BASE_CARD_ADDRESS \
    src/BaseCard.sol:BaseCard
```

---

## 🎮 Contract Interaction

### Batch Minting (Recommended for Initial Setup)

Use the provided script to mint multiple BaseCards from a template:

```bash
# 1. Configure template.json with card data
# See template.json for format

# 2. Run batch mint script
./mint_from_template.sh

# 3. Verify minted cards
cat onchain_nft_outputs.json
```

**Template Format** (`template.json`):

```json
[
    {
        "address": "0x...",
        "nickname": "Alice",
        "role": "Developer",
        "bio": "Building the future",
        "image": "ipfs://...",
        "basename": "alice.base.eth",
        "social": {
            "x": "@alice",
            "farcaster": "alice.farcaster.eth"
        }
    }
]
```

### Individual Operations

#### Read Functions (No Gas Required)

```bash
# Get token metadata URI
make token-uri TOKEN_ID=1

# Check if address has minted
make check-has-minted ADDRESS=0x...

# Get social link value
make get-social TOKEN_ID=1 KEY="x"

# Check if social key is allowed
make is-allowed-social-key KEY="x"

# Get token decimals
make get-token-decimals
```

#### Write Functions (Gas Required)

```bash
# Link social account (Link-to-Earn rewards)
make link-social TOKEN_ID=1 KEY="x" VALUE="@yourhandle"

# Update profile information
make update-nickname TOKEN_ID=1 NICKNAME="New Name"
make update-bio TOKEN_ID=1 BIO="Updated bio text"
make update-image-uri TOKEN_ID=1 IMAGE_URI="ipfs://..."
make update-basename TOKEN_ID=1 BASENAME="newname.base.eth"
```

#### Owner-Only Functions

```bash
# Manage allowed social keys
make set-allowed-social-key KEY="linkedin" IS_ALLOWED=true
```

---

## 🔒 Security Considerations

### Best Practices Implemented

1. **Access Control**

    - Owner-only functions protected with `onlyOwner` modifier
    - One-time minting per address enforced

2. **Input Validation**

    - All user inputs validated before processing
    - Social keys must be in allowed list

3. **Gas Optimization**

    - Custom errors instead of revert strings (saves ~50 gas per error)
    - `immutable` and `constant` variables where applicable
    - Efficient data structures (mappings over arrays)

4. **Reentrancy Protection**

    - State changes before external calls (Checks-Effects-Interactions pattern)
    - No external calls in critical sections

5. **Testing**
    - 100% function coverage
    - Edge case testing
    - Fuzz testing for critical functions

### Audit Checklist

-   ✅ OpenZeppelin contracts used
-   ✅ No delegatecall to user-supplied addresses
-   ✅ No timestamp dependencies
-   ✅ No unchecked external calls
-   ✅ Proper event emissions
-   ✅ Access control on all admin functions

---

## 📚 Additional Resources

-   [Foundry Book](https://book.getfoundry.sh/)
-   [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
-   [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
-   [Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)

---

## 🤝 Contributing

When contributing to the smart contracts:

1. **Follow TDD**: Write failing tests first, then implement
2. **Security First**: Consider security implications of all changes
3. **Gas Efficiency**: Optimize for gas costs
4. **Documentation**: Use NatSpec comments (Korean for internal docs)
5. **Testing**: Maintain 100% test coverage

---

**Built with ❤️ by the BaseCard Team**

## Teams 👬 🇰🇷

-   Leader & UX/UI Designer(LuckyJerry): https://base.app/profile/0x41d1f13ea5Ce358559268c8c5D1695D8549ac37B?tab=posts
-   UX/UI Designer(Chorang): https://base.app/profile/0x41d1f13ea5Ce358559268c8c5D1695D8549ac37B?tab=posts
-   Developer(Jeongseup): https://base.app/profile/0x1b8902178e313aEC2Dee0e2B707de71E3B85d632?tab=posts
-   Developer(Jihwang):
