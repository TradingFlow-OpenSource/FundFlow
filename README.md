# FundFlow 🚀

> **AI-Powered Trading Strategies on a Bonding Curve** — Built at ETH Chiang Mai 2026

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![BSC Testnet](https://img.shields.io/badge/Network-BSC%20Testnet-F0B90B)](https://testnet.bscscan.com/)

## Introduction

**FundFlow** (Live on fundflow-lime.vercel.app) is a decentralized platform that tokenizes AI trading strategies using a **Pump.fun-style bonding curve**. Users can:

1. **Upload** their AI trading logic (`.tradingflow` files from TradingFlow)
2. **Deploy** a new strategy token with automatic bonding curve pricing
3. **Buy/Sell** tokens — early believers get better prices, creating FOMO dynamics
4. **Watch prices rise** as more traders ape in!

### The Problem

- AI trading strategies are valuable intellectual property with no easy monetization path
- Traditional hedge funds are gated and inaccessible
- No trustless way to invest in someone's trading alpha

### Our Solution

FundFlow turns every trading strategy into a **tokenized asset** with:

- **Transparent on-chain logic** — Strategy hash stored on IPFS
- **Quadratic bonding curve** — Price = BASE + K × Supply² (early birds win!)
- **Permissionless access** — Anyone can create or invest
- **Real-time price discovery** — Market decides the value

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  React 19 + TypeScript + Vite + Tailwind CSS + wagmi + viem     │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Home    │  │  Launch  │  │ FundList │  │  Detail  │        │
│  │  Page    │  │  (Upload)│  │  Page    │  │  (Trade) │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SMART CONTRACTS                             │
│                   Solidity + Foundry (BSC Testnet)              │
│                                                                  │
│  ┌─────────────────────┐    ┌─────────────────────────────┐    │
│  │  FlowFundFactory    │───▶│  FlowFundBondingCurve       │    │
│  │                     │    │                              │    │
│  │  • createFund()     │    │  • buy() / sell()           │    │
│  │  • getAllFunds()    │    │  • getCurrentPrice()        │    │
│  │  • strategyHashes   │    │  • Quadratic pricing        │    │
│  └─────────────────────┘    │  • 1% creator fee           │    │
│                              └─────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         STORAGE                                  │
│                                                                  │
│  ┌──────────────┐                                               │
│  │    IPFS      │  Strategy files (.tradingflow) stored here   │
│  │  (Mocked)    │  Hash referenced on-chain for transparency   │
│  └──────────────┘                                               │
└─────────────────────────────────────────────────────────────────┘
```

### Smart Contract Details

#### FlowFundFactory.sol

- **Purpose**: Deploy new strategy tokens
- **Key Functions**:
  - `createFund(name, symbol, ipfsHash)` — Creates new bonding curve token
  - `getAllFunds()` — Returns all deployed fund addresses
  - `getStrategyHash(fundAddress)` — Get IPFS hash for verification

#### FlowFundBondingCurve.sol

- **Purpose**: Individual strategy token with bonding curve pricing
- **Pricing Formula**: `Price = 0.0001 + 0.000001 × Supply²`
- **Key Functions**:
  - `buy()` — Purchase tokens with BNB
  - `sell(amount)` — Sell tokens back to curve
  - `getCurrentPrice()` — Get current token price
  - `getFundInfo()` — Get comprehensive fund data

### Bonding Curve Economics

| Supply | Price (BNB) | Multiple |
| ------ | ----------- | -------- |
| 0      | 0.0001      | 1×       |
| 10     | 0.0002      | 2×       |
| 30     | 0.001       | 10×      |
| 100    | 0.0101      | 100×     |

**Early buyers get exponentially better prices!**

---

## Tech Stack

| Layer         | Technology                               |
| ------------- | ---------------------------------------- |
| **Frontend**  | React 19, TypeScript, Vite, Tailwind CSS |
| **Web3**      | wagmi v2, viem, @tanstack/react-query    |
| **Styling**   | Neo-Brutalist UI, Recharts for charts    |
| **Contracts** | Solidity 0.8.20, Foundry                 |
| **Network**   | BNB Smart Chain Testnet (Chain ID: 97)   |
| **Wallets**   | MetaMask, OKX Wallet                     |

---

## Build Instructions

### Prerequisites

- Node.js 18+
- pnpm or npm
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (for contracts)
- MetaMask or OKX Wallet with BSC Testnet configured

### 1. Clone the Repository

```bash
git clone https://github.com/M721ao/fundflow.git
cd fundflow
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Run Frontend Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production

```bash
npm run build
```

### 5. Smart Contract Development (Optional)

```bash
cd contracts

# Install Foundry dependencies
forge install

# Build contracts
forge build

# Run tests
forge test

# Deploy to BSC Testnet
source .env
forge create --rpc-url $BSC_TESTNET_RPC --private-key $PRIVATE_KEY \
  src/FlowFundFactory.sol:FlowFundFactory --broadcast
```

### Environment Setup

Create `contracts/.env`:

```env
PRIVATE_KEY=your_private_key_here
BSC_TESTNET_RPC=https://data-seed-prebsc-1-s1.binance.org:8545/
```

---

## Deployed Contracts (BSC Testnet)

| Contract        | Address                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| FlowFundFactory | [`0x4B1EbbB77439305D171eB919Cb7704AE9a43ac64`](https://testnet.bscscan.com/address/0x4B1EbbB77439305D171eB919Cb7704AE9a43ac64) |

---

## How It Works

### 1. Launch a Strategy

1. Go to **Launch** page
2. Upload your `.tradingflow` file (AI trading logic)
3. Enter fund name and ticker symbol
4. Click **Deploy** — Your strategy is now tokenized!

### 2. Invest in a Strategy

1. Browse **Explore** page to see all funds
2. Click on a fund to view details
3. Enter number of shares to buy
4. Click **Place Buy Order** — You now own strategy tokens!

### 3. Watch Price Rise

- As more people buy, the bonding curve pushes price up
- Early investors profit from later buyers
- Sell anytime back to the curve

---

## Project Structure

```
FundFlow/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/       # Navbar, ConnectButton, etc.
│   │   ├── pages/            # Home, Upload, FundList, FundDetail
│   │   ├── hooks/            # useContracts.ts (wagmi hooks)
│   │   ├── config/           # wagmi.ts, contracts.ts
│   │   └── App.tsx
│   ├── public/               # Static assets
│   └── package.json
│
├── contracts/                # Solidity smart contracts
│   ├── src/
│   │   ├── FlowFundFactory.sol
│   │   └── FlowFundBondingCurve.sol
│   ├── test/                 # Foundry tests
│   ├── script/               # Deploy scripts
│   └── foundry.toml
│
└── README.md
```

---

## Future Roadmap

- [ ] **Real IPFS Integration** — Store strategy files on IPFS/Filecoin
- [ ] **Strategy Execution** — Actually run trading logic on-chain
- [ ] **Multi-chain** — Deploy to Ethereum, Base, Arbitrum
- [ ] **Governance** — Token holders vote on strategy parameters
- [ ] **Performance Tracking** — Show historical returns

---

## License

MIT License — See [LICENSE](./LICENSE) for details.

---

## Acknowledgments

- [TradingFlow](https://tradingflow.com) — AI trading strategy platform

---

<p align="center">
  <b>FundFlow</b> — Where AI Meets DeFi 🤖💰
</p>
