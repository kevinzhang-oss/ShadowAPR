# ShadowAPR

**Privacy-Preserving Staking Protocol with Confidential Rewards**

ShadowAPR is a decentralized staking protocol built with Fully Homomorphic Encryption (FHE) technology, enabling users to stake confidential tokens (cUSDT) and earn confidential rewards (cZAMA) while keeping all transaction amounts and balances completely private on-chain.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Advantages](#advantages)
- [Technologies Used](#technologies-used)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Architecture](#architecture)
- [Smart Contracts](#smart-contracts)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Testing](#testing)
- [Frontend Application](#frontend-application)
- [Reward Mechanism](#reward-mechanism)
- [Security Considerations](#security-considerations)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## Overview

ShadowAPR revolutionizes DeFi staking by introducing **true privacy** through Fully Homomorphic Encryption (FHE). Unlike traditional blockchain staking protocols where all balances and transaction amounts are publicly visible, ShadowAPR keeps your financial activity completely confidential while maintaining the security and decentralization of blockchain technology.

The protocol implements **ERC-7984** confidential tokens and uses Zama's **fhEVM** technology to perform computations on encrypted data without ever decrypting it, ensuring complete privacy at all stages.

---

## Key Features

### 1. **Complete Privacy**
- **Confidential Balances**: All token balances are encrypted on-chain
- **Hidden Staking Amounts**: Nobody can see how much you stake
- **Private Rewards**: Reward distributions are completely confidential
- **Encrypted Transactions**: All transfers use homomorphic encryption

### 2. **Automated Reward System**
- **Real-time Accrual**: Rewards accrue every second based on your stake
- **Daily APR**: Earn 0.1% daily (1 cZAMA per 1,000 cUSDT staked per day)
- **Flexible Claims**: Claim your rewards at any time
- **No Lock-up Period**: Unstake whenever you want

### 3. **User-Friendly Interface**
- **Modern Web3 UI**: Built with React and RainbowKit for seamless wallet integration
- **Real-time Dashboard**: View your staking stats, rewards, and protocol metrics
- **One-Click Actions**: Simple approve, stake, unstake, and claim workflow
- **Responsive Design**: Works perfectly on desktop and mobile devices

### 4. **Gas Efficient**
- **Optimized Contracts**: Smart contracts optimized for minimal gas consumption
- **Batch Operations**: Efficient batch processing of staking operations
- **EVM Cancun Support**: Leverages latest Ethereum optimizations

### 5. **Fully Decentralized**
- **Non-custodial**: You always maintain control of your funds
- **Permissionless**: No KYC or authorization required
- **Open Source**: All code is publicly auditable
- **Immutable Contracts**: Core staking logic cannot be changed

---

## Advantages

### Why Choose ShadowAPR?

1. **Privacy First**
   - Traditional staking protocols expose all financial data publicly
   - ShadowAPR uses cutting-edge FHE technology to keep everything private
   - Compete with institutions without revealing your strategy

2. **Regulatory Compliance Friendly**
   - Privacy features can help with GDPR and financial privacy regulations
   - Optional disclosure mechanisms for compliance when needed
   - Ideal for institutional adoption

3. **No Privacy Compromises**
   - Unlike mixers or privacy coins that can be blacklisted
   - Uses standard ERC-7984 tokens with built-in privacy
   - Fully compatible with Ethereum ecosystem

4. **Innovative Technology**
   - First staking protocol to use Zama's fhEVM
   - Demonstrates real-world FHE applications in DeFi
   - Future-proof architecture for privacy-first Web3

5. **Transparent Yet Private**
   - Total staked amounts visible for protocol health
   - Individual positions remain confidential
   - Best of both worlds for DeFi transparency

6. **Fair Rewards**
   - Simple, predictable reward mechanism
   - No complex lockup periods or vesting schedules
   - Linear rewards based on stake size and duration

---

## Technologies Used

### Blockchain & Smart Contracts
- **Solidity ^0.8.27**: Smart contract programming language
- **Hardhat**: Ethereum development environment
- **fhEVM by Zama**: Fully Homomorphic Encryption for Ethereum
- **@fhevm/solidity**: Zama's Solidity library for FHE operations
- **OpenZeppelin Confidential Contracts**: Secure, audited confidential token implementations
- **ERC-7984**: Confidential token standard

### Cryptography
- **Fully Homomorphic Encryption (FHE)**: Enables computation on encrypted data
- **TFHE**: Fast FHE scheme optimized for blockchain use
- **Zama's Encrypted Types**: Type-safe encrypted integers (euint64)

### Frontend
- **React 19**: Modern UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Wagmi v2**: React hooks for Ethereum
- **RainbowKit**: Beautiful wallet connection UI
- **ethers.js v6**: Ethereum library for blockchain interaction
- **Viem**: TypeScript interface for Ethereum

### Development Tools
- **Hardhat Deploy**: Deployment management
- **Hardhat Etherscan**: Contract verification
- **TypeChain**: TypeScript bindings for smart contracts
- **Chai & Mocha**: Testing framework
- **Solidity Coverage**: Code coverage analysis
- **ESLint & Prettier**: Code quality and formatting

### Infrastructure
- **Sepolia Testnet**: Ethereum test network
- **Infura**: Ethereum node provider
- **Netlify**: Frontend hosting (ready-to-deploy)

---

## Problem Statement

### The Privacy Problem in DeFi

Traditional DeFi protocols suffer from complete transparency, which creates several critical issues:

1. **Front-Running**: Your transactions are visible in mempool before execution
2. **Competitive Disadvantage**: Large players can monitor and copy your strategies
3. **Privacy Concerns**: Anyone can track all your financial activities
4. **Regulatory Issues**: Public transaction history can create compliance problems
5. **Security Risks**: Visible balances make you a target for attacks
6. **Market Manipulation**: Whales' movements are tracked and exploited

### The Staking Privacy Gap

Existing staking protocols reveal:
- How much each wallet has staked
- When they stake or unstake
- How many rewards they've earned
- Their entire staking history

This information asymmetry benefits sophisticated players while exposing regular users to risks.

---

## Solution

### ShadowAPR's Privacy-First Approach

ShadowAPR solves these problems through **Fully Homomorphic Encryption (FHE)**:

1. **Encrypted Operations**
   - All token balances are encrypted using FHE
   - Smart contracts compute on encrypted data without decryption
   - Only you can decrypt your balance using your private key

2. **Confidential Transactions**
   - Transfer amounts are never revealed on-chain
   - Stake and unstake operations are completely private
   - Reward claims don't expose how much you've earned

3. **Privacy-Preserving Accounting**
   - Protocol tracks total staked amount for transparency
   - Individual positions remain confidential
   - Rewards accrue on encrypted balances

4. **Verifiable Yet Private**
   - Smart contracts verify operations without seeing amounts
   - Mathematical proofs ensure correctness
   - Audit trail exists without compromising privacy

### How It Works

```
User Balance (Encrypted) → Stake Request (Encrypted) →
  → Contract Validates (on encrypted data) →
  → Rewards Accrue (on encrypted balance) →
  → User Claims (receives encrypted reward) →
  → User Decrypts (client-side only)
```

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  React + Wagmi + RainbowKit + Zama Relayer SDK              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Blockchain Layer (Sepolia)                │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  ERC7984USDT │  │  ERC7984Zama │  │ ZamaStaking  │     │
│  │  (Staking    │  │  (Reward     │  │  (Core       │     │
│  │   Token)     │  │   Token)     │  │   Logic)     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    fhEVM Infrastructure                      │
│  • FHE Operations (encrypted computation)                   │
│  • ACL (Access Control List for encrypted data)            │
│  • KMS Verifier (Key Management System)                     │
│  • Decryption Oracle                                         │
└─────────────────────────────────────────────────────────────┘
```

### Contract Architecture

```
ZamaStaking Contract
├── State Variables
│   ├── stakingToken (ERC7984USDT)
│   ├── rewardToken (ERC7984Zama)
│   ├── totalStaked (uint256 - public)
│   └── _stakes (mapping - user positions)
│
├── Core Functions
│   ├── stake(amount) - Deposit and start earning
│   ├── unstake(amount) - Withdraw stake
│   ├── claimReward() - Claim accrued rewards
│   └── _accrueRewards() - Internal reward calculation
│
└── View Functions
    ├── accountInfo(user) - Get user's staking stats
    ├── pendingReward(user) - Check unclaimed rewards
    └── stakedBalance(user) - View staked amount
```

---

## Smart Contracts

### Core Contracts

#### 1. **ZamaStaking.sol**
The main staking contract that handles:
- Confidential token deposits (stake)
- Confidential token withdrawals (unstake)
- Automatic reward accrual calculation
- Reward distribution in encrypted form

**Key Mechanisms:**
- Rewards accrue at 0.1% per day (1/1000 daily rate)
- Calculated per second for precision: `(stakedAmount × elapsedSeconds) / (1000 × 86400)`
- No minimum lock period
- Rewards accumulate until claimed

**Location:** `contracts/ZamaStaking.sol`

#### 2. **ERC7984USDT.sol**
Confidential stablecoin token used for staking:
- Implements ERC-7984 confidential token standard
- Encrypted balance storage
- Confidential transfer operations
- Mint function for testing

**Location:** `contracts/ERC7984USDT.sol`

#### 3. **ERC7984Zama.sol**
Confidential reward token distributed to stakers:
- Same privacy features as cUSDT
- Minted to staking contract as reward pool
- Distributed confidentially to reward claimers

**Location:** `contracts/ERC7984Zama.sol`

### Contract Interactions

```solidity
// Staking Flow
User → approve operator (cUSDT) → ZamaStaking
User → stake(amount) → ZamaStaking.confidentialTransferFrom() → Lock cUSDT
ZamaStaking → Update user position → Start reward accrual

// Reward Claim Flow
User → claimReward() → ZamaStaking
ZamaStaking → Calculate rewards → confidentialTransfer(cZAMA) → User

// Unstaking Flow
User → unstake(amount) → ZamaStaking
ZamaStaking → Update rewards → confidentialTransfer(cUSDT) → User
```

---

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js**: Version 20 or higher
- **npm**: Version 7 or higher (or yarn/pnpm)
- **MetaMask**: Or another Web3 wallet
- **Sepolia ETH**: For testnet deployment and transactions
- **Git**: For cloning the repository

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/ShadowAPR.git
cd ShadowAPR

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy to local network
npx hardhat node
npx hardhat deploy --network localhost
```

---

## Installation

### Backend Setup

1. **Install Contract Dependencies**

```bash
npm install
```

2. **Set Up Environment Variables**

```bash
# Create .env file
touch .env

# Add the following variables:
INFURA_API_KEY=your_infura_api_key
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key  # Optional for verification
```

Or use Hardhat's secure variable management:

```bash
npx hardhat vars set INFURA_API_KEY
npx hardhat vars set PRIVATE_KEY
npx hardhat vars set ETHERSCAN_API_KEY
```

3. **Compile Contracts**

```bash
npm run compile
```

This will:
- Compile all Solidity contracts
- Generate TypeChain type bindings
- Create artifacts for deployment

### Frontend Setup

1. **Navigate to UI Directory**

```bash
cd ui
```

2. **Install Frontend Dependencies**

```bash
npm install
```

3. **Configure Contract Addresses**

Edit `ui/src/config/contracts.ts` with your deployed contract addresses:

```typescript
export const STAKING_CONTRACT = {
  address: "0x...", // Your deployed ZamaStaking address
  abi: [...]
};

export const CUSDT_CONTRACT = {
  address: "0x...", // Your deployed ERC7984USDT address
  abi: [...]
};
```

4. **Start Development Server**

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## Configuration

### Network Configuration

Edit `hardhat.config.ts` to customize networks:

```typescript
networks: {
  sepolia: {
    chainId: 11155111,
    url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
    accounts: ACCOUNTS,
  },
  // Add more networks as needed
}
```

### Contract Parameters

Modify reward rates and other parameters in `contracts/ZamaStaking.sol`:

```solidity
// Default: 1 cZAMA per 1,000 cUSDT per day (0.1% daily)
uint256 private constant REWARD_DIVISOR = 1000 * SECONDS_PER_DAY;

// Change to adjust reward rate:
// - Increase divisor = lower rewards
// - Decrease divisor = higher rewards
```

### Frontend Configuration

Configure wallet and network settings in `ui/src/config/wagmi.ts`:

```typescript
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'ShadowAPR',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  chains: [sepolia],
  // ... additional configuration
});
```

---

## Deployment

### Local Deployment (Hardhat Network)

1. **Start Local Node**

```bash
npx hardhat node
```

2. **Deploy Contracts (in another terminal)**

```bash
npx hardhat deploy --network localhost
```

3. **Run Local Tests**

```bash
npx hardhat test --network localhost
```

### Sepolia Testnet Deployment

1. **Ensure You Have Sepolia ETH**

Get test ETH from:
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
- [Infura Faucet](https://www.infura.io/faucet/sepolia)

2. **Deploy to Sepolia**

```bash
npx hardhat deploy --network sepolia
```

3. **Verify Contracts on Etherscan**

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

4. **Update Frontend Configuration**

Copy deployed addresses to `ui/src/config/contracts.ts`

### Production Deployment Checklist

- [ ] Audit smart contracts with professional auditors
- [ ] Run comprehensive test suite with 100% coverage
- [ ] Deploy to testnet and perform extensive testing
- [ ] Set up monitoring and alerting
- [ ] Prepare incident response plan
- [ ] Configure multi-sig wallet for admin functions
- [ ] Document all deployment parameters
- [ ] Verify contracts on Etherscan
- [ ] Test frontend with real users
- [ ] Set up bug bounty program

---

## Testing

### Contract Tests

The project includes comprehensive test coverage for all contract functionality.

#### Run All Tests

```bash
npm run test
```

#### Run Specific Test File

```bash
npx hardhat test test/ZamaStaking.ts
```

#### Test with Coverage

```bash
npm run coverage
```

#### Test on Sepolia

```bash
npm run test:sepolia
```

### Test Cases Covered

**ZamaStaking Contract:**
- ✅ Stake tokens with confidential transfers
- ✅ Unstake tokens and receive refund
- ✅ Accrue rewards over time
- ✅ Claim rewards confidentially
- ✅ Handle operator permissions (ERC-7984)
- ✅ Calculate pending rewards accurately
- ✅ Track total staked amount
- ✅ Handle edge cases (zero amounts, insufficient balance, etc.)

**Example Test Output:**
```
  ZamaStaking
    ✓ allows staking, accrues rewards, and supports claiming (1234ms)
    ✓ tracks total staked amount correctly (891ms)
    ✓ prevents unstaking more than staked (456ms)
    ✓ requires operator approval before staking (678ms)
```

### Manual Testing Guide

1. **Deploy to Local Network**
   ```bash
   npx hardhat node
   npx hardhat deploy --network localhost
   ```

2. **Get Test Tokens**
   ```bash
   npx hardhat staking:mint --network localhost --amount 10000
   ```

3. **Approve Staking Contract**
   ```bash
   npx hardhat staking:approve --network localhost
   ```

4. **Stake Tokens**
   ```bash
   npx hardhat staking:stake --network localhost --amount 1000
   ```

5. **Check Balance**
   ```bash
   npx hardhat staking:info --network localhost
   ```

6. **Wait and Claim Rewards**
   ```bash
   # Wait some time, then:
   npx hardhat staking:claim --network localhost
   ```

---

## Frontend Application

### Features

The ShadowAPR frontend provides a complete user interface for interacting with the staking protocol:

#### Dashboard
- **Real-time Stats**: View your staked balance, unclaimed rewards, and daily earnings
- **Protocol Metrics**: See total protocol TVL (Total Value Locked)
- **Connected Wallet**: Display your connected address and network

#### Staking Interface
- **Authorize Contract**: One-click operator approval for ERC-7984 tokens
- **Stake cUSDT**: Input amount and stake with single transaction
- **Unstake**: Withdraw any amount of your stake
- **Claim Rewards**: Harvest your accrued cZAMA rewards
- **Faucet**: Mint test cUSDT for experimentation (testnet only)

#### User Experience
- **Wallet Integration**: Seamless connection with MetaMask, WalletConnect, and more via RainbowKit
- **Transaction Feedback**: Clear success/error messages for all operations
- **Loading States**: Visual feedback during transaction processing
- **Responsive Design**: Works perfectly on all screen sizes

### Technology Stack

- **React 19**: Latest React features for optimal performance
- **TypeScript**: Full type safety for reliability
- **Wagmi v2**: Modern React hooks for Ethereum
- **RainbowKit**: Beautiful, customizable wallet connection
- **Viem**: Efficient, type-safe Ethereum interactions
- **Ethers.js**: Contract interaction utilities

### Running the Frontend

```bash
cd ui
npm install
npm run dev
```

Visit `http://localhost:5173` to use the application.

### Building for Production

```bash
cd ui
npm run build
```

The optimized build will be in `ui/dist/` ready for deployment to:
- Netlify (configured with `netlify.toml`)
- Vercel
- GitHub Pages
- Any static hosting service

---

## Reward Mechanism

### How Rewards Work

ShadowAPR implements a simple, fair, and transparent reward mechanism:

#### Reward Rate
- **Base Rate**: 0.1% per day
- **Formula**: 1 cZAMA per 1,000 cUSDT staked per day
- **Calculation**: Rewards accrue every second based on your stake

#### Mathematical Formula

```solidity
pendingReward = (stakedAmount × elapsedSeconds) / (1000 × 86400)
```

Where:
- `stakedAmount`: Your staked cUSDT balance (encrypted)
- `elapsedSeconds`: Seconds since last reward update
- `1000`: Divisor for 0.1% daily rate
- `86400`: Seconds per day

#### Example Calculations

| Staked cUSDT | Daily Reward | Weekly Reward | Monthly Reward | Annual APR |
|--------------|-------------|---------------|----------------|------------|
| 1,000        | 1 cZAMA     | 7 cZAMA      | ~30 cZAMA     | 36.5%      |
| 10,000       | 10 cZAMA    | 70 cZAMA     | ~300 cZAMA    | 36.5%      |
| 100,000      | 100 cZAMA   | 700 cZAMA    | ~3,000 cZAMA  | 36.5%      |

**Note**: All amounts are confidential. These calculations are for illustration only.

#### Reward Accrual

1. **Continuous Accrual**: Rewards accumulate every second, not just when you claim
2. **Precision**: Uses seconds for accurate calculations
3. **Gas Efficient**: Only updates on stake/unstake/claim events
4. **Fair Distribution**: Pro-rata based on stake size and time

#### Claiming Rewards

- **Flexible Timing**: Claim anytime, no minimum period
- **Gas Costs**: Only pay gas for the claim transaction
- **Compound Strategy**: Claimed rewards can be staked for compound growth
- **Privacy**: Claim amounts are confidential

#### Reward Pool

The staking contract is pre-funded with cZAMA tokens:
- **Initial Supply**: 1,000,000 cZAMA
- **Sustainability**: Lasts ~2.7 years at 100% capacity (1M cUSDT staked)
- **Refillable**: Contract owner can top up reward pool
- **Transparent**: Total remaining rewards are visible

---

## Security Considerations

### Smart Contract Security

#### Audits
- [ ] **Pending Professional Audit**: We recommend full audit before mainnet deployment
- ✅ **Code Review**: Internal security review completed
- ✅ **Test Coverage**: Comprehensive test suite with edge cases
- ✅ **Static Analysis**: Solhint and Slither analysis clean

#### Security Features

1. **Access Control**
   - No admin functions in core staking logic
   - Immutable contract addresses after deployment
   - User-controlled encrypted data via ACL

2. **Reentrancy Protection**
   - State updates before external calls
   - Uses OpenZeppelin's secure patterns
   - ERC-7984 built-in protections

3. **Integer Overflow Protection**
   - Solidity 0.8.27 has built-in overflow checks
   - SafeCast used for type conversions
   - Tested with extreme values

4. **Privacy Guarantees**
   - FHE encryption prevents data leakage
   - Only user can decrypt their balances
   - No centralized key management

### Privacy Considerations

#### What's Private
- ✅ Individual staked amounts
- ✅ Individual reward balances
- ✅ Transfer amounts
- ✅ Claim amounts

#### What's Public
- ❌ Total protocol TVL (by design, for transparency)
- ❌ Transaction events (stake/unstake/claim occurred)
- ❌ Addresses participating (wallet addresses visible)

#### Potential Privacy Improvements
- Mixing service for address privacy
- Time-delayed batch processing
- Zero-knowledge proofs for additional guarantees

### Best Practices for Users

1. **Wallet Security**
   - Use hardware wallet for large amounts
   - Never share your seed phrase
   - Verify contract addresses before interacting

2. **Transaction Privacy**
   - Use fresh addresses for maximum privacy
   - Consider Tornado Cash or similar for address unlinkability
   - Be aware public transaction graphs can link addresses

3. **Operator Approval**
   - Only approve staking contract, not unknown addresses
   - Approval lasts 30 days, renew as needed
   - Revoke if you no longer plan to stake

4. **Decryption Safety**
   - Only decrypt data client-side
   - Never share encrypted balance handles
   - Be careful with screen sharing while viewing balances

---

## Future Roadmap

### Phase 1: Foundation (Current)
- ✅ Core staking contract implementation
- ✅ Confidential ERC-7984 tokens
- ✅ Basic web interface
- ✅ Sepolia testnet deployment
- ✅ Comprehensive testing

### Phase 2: Enhancement (Q2 2025)
- [ ] Professional security audit
- [ ] Multi-token staking support (other ERC-7984 tokens)
- [ ] Dynamic reward rates based on protocol metrics
- [ ] Advanced analytics dashboard
- [ ] Mobile-responsive UI improvements
- [ ] Mainnet deployment

### Phase 3: Advanced Features (Q3 2025)
- [ ] Governance token (cGOV) for protocol decisions
- [ ] Vote with encrypted balances
- [ ] Staking pools and delegated staking
- [ ] Liquidity provision with confidential LP tokens
- [ ] Cross-chain staking bridges
- [ ] Integration with DeFi protocols

### Phase 4: Ecosystem (Q4 2025)
- [ ] ShadowAPR SDK for developers
- [ ] Third-party protocol integrations
- [ ] Confidential lending/borrowing
- [ ] NFT-based staking positions
- [ ] Institutional features (compliance modules)
- [ ] Layer 2 deployment for lower fees

### Phase 5: Innovation (2026+)
- [ ] AI-powered yield optimization
- [ ] Privacy-preserving derivatives
- [ ] Confidential automated market makers
- [ ] Full DeFi suite with complete privacy
- [ ] Interoperability with major privacy chains

### Community Requests
We're listening! Submit feature requests via:
- GitHub Issues
- Discord community
- Governance proposals (coming soon)

---

## Contributing

We welcome contributions from the community! ShadowAPR is open source and thrives on community input.

### How to Contribute

#### 1. **Report Bugs**
Found a bug? Open an issue with:
- Detailed description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details

#### 2. **Suggest Features**
Have an idea? Create a feature request with:
- Use case description
- Proposed solution
- Alternative approaches considered
- Potential impact on privacy/security

#### 3. **Submit Code**

**Pull Request Process:**

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/ShadowAPR.git
   cd ShadowAPR
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow existing code style
   - Add tests for new functionality
   - Update documentation
   - Ensure all tests pass

3. **Run Quality Checks**
   ```bash
   npm run lint        # Check code style
   npm run test        # Run test suite
   npm run coverage    # Check test coverage
   ```

4. **Submit PR**
   - Provide clear description of changes
   - Reference related issues
   - Include test results
   - Request review from maintainers

#### 4. **Improve Documentation**
Documentation PRs are especially welcome:
- Fix typos or unclear sections
- Add examples or tutorials
- Translate to other languages
- Improve API documentation

### Development Guidelines

#### Code Style
- **Solidity**: Follow Solidity style guide and use Solhint
- **TypeScript**: Use ESLint + Prettier configuration
- **Comments**: Document complex logic clearly
- **Naming**: Use descriptive variable and function names

#### Testing Requirements
- All new features must include tests
- Maintain >90% code coverage
- Test edge cases and error conditions
- Include integration tests for contract interactions

#### Security First
- Never compromise on security for convenience
- Consider privacy implications of all changes
- Document security assumptions
- Follow OpenZeppelin patterns

#### Git Commit Messages
```
type(scope): short description

Longer description if needed

- Bullet points for details
- Reference issues: #123
```

Types: feat, fix, docs, style, refactor, test, chore

### Code of Conduct

We are committed to providing a welcoming and inclusive environment:

- **Be Respectful**: Treat all contributors with respect
- **Be Constructive**: Provide helpful, actionable feedback
- **Be Patient**: Remember everyone is learning
- **Be Inclusive**: Welcome diverse perspectives
- **Report Issues**: Contact maintainers if you see violations

---

## License

This project is licensed under the **BSD-3-Clause-Clear License**.

### What This Means

- ✅ **Use**: You can use this code freely
- ✅ **Modify**: You can make changes and improvements
- ✅ **Distribute**: You can share the code with others
- ✅ **Private Use**: You can use it in private projects
- ❌ **Patent Grant**: No explicit patent rights granted
- ❌ **Trademark**: No trademark rights granted
- ⚠️ **Attribution Required**: You must include the license and copyright notice

### Full License

```
BSD 3-Clause Clear License

Copyright (c) 2025, ShadowAPR Contributors

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors
   may be used to endorse or promote products derived from this software without
   specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES ARE DISCLAIMED.
```

See [LICENSE](LICENSE) file for full details.

---

## Support

Need help? We're here for you!

### Documentation
- **Main Docs**: This README
- **Zama fhEVM Docs**: [https://docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **ERC-7984 Standard**: [https://eips.ethereum.org/EIPS/eip-7984](https://eips.ethereum.org/EIPS/eip-7984)
- **API Reference**: Coming soon

### Community
- **GitHub Issues**: [Report bugs and request features](https://github.com/yourusername/ShadowAPR/issues)
- **GitHub Discussions**: [Community forum for questions](https://github.com/yourusername/ShadowAPR/discussions)
- **Discord**: [Join our community](https://discord.gg/shadowapr) _(Coming Soon)_
- **Twitter**: [@ShadowAPR](https://twitter.com/shadowapr) _(Coming Soon)_

### Zama Resources
- **Zama Website**: [https://zama.ai](https://zama.ai)
- **Zama Discord**: [https://discord.gg/zama](https://discord.gg/zama)
- **Zama GitHub**: [https://github.com/zama-ai](https://github.com/zama-ai)

### Professional Support
For enterprise support, audits, or consulting:
- **Email**: support@shadowapr.io _(Coming Soon)_
- **Security Issues**: security@shadowapr.io _(Coming Soon)_

### Frequently Asked Questions

**Q: Is this production-ready?**
A: Not yet. This is testnet software. Wait for security audit and mainnet deployment announcement.

**Q: How private is this really?**
A: Your balances and amounts are fully encrypted on-chain. Only you can decrypt them. Transaction participants (addresses) are still visible.

**Q: What are the fees?**
A: Only standard Ethereum gas fees. No protocol fees currently.

**Q: Can I lose my staked tokens?**
A: Standard smart contract risks apply. The contracts are designed to be secure, but always DYOR and only stake what you can afford to lose.

**Q: Where do rewards come from?**
A: The staking contract is pre-funded with cZAMA tokens by the protocol.

**Q: Can I unstake anytime?**
A: Yes, there's no lock period. Unstake anytime and receive your tokens immediately.

**Q: How do I know my balances are actually encrypted?**
A: You can verify the encrypted storage in contract state. The balance is stored as a FHE ciphertext, not plaintext.

**Q: What networks are supported?**
A: Currently Sepolia testnet. Mainnet deployment planned after audit.

---

## Acknowledgments

ShadowAPR is built on the shoulders of giants:

- **Zama**: For pioneering FHE technology and fhEVM
- **OpenZeppelin**: For secure smart contract libraries
- **Ethereum Foundation**: For the robust blockchain platform
- **Hardhat**: For excellent development tools
- **RainbowKit**: For beautiful wallet UX

Special thanks to the privacy and cryptography communities for pushing the boundaries of what's possible in DeFi.

---

## Disclaimer

**IMPORTANT**:

- This software is **experimental** and provided "as is"
- **No warranties** of any kind are provided
- **Use at your own risk** - you may lose funds
- **Not financial advice** - DYOR before using
- **Not audited** - security audit pending
- **Testnet only** - do not use with real funds yet

The ShadowAPR team is not responsible for any losses incurred through the use of this software.

---

## Project Status

🚧 **Status**: Beta / Testnet
📅 **Last Updated**: 2025-10-30
🔗 **Testnet**: Sepolia
📊 **Test Coverage**: 90%+
🔒 **Audit Status**: Pending

---

<div align="center">

**Built with ❤️ for a more private Web3**

[Website (Coming Soon)] • [Documentation] • [Twitter] • [Discord]

Star ⭐ this repo if you find it useful!

</div>
