# FlowFund Smart Contracts

Solidity smart contracts for the FlowFund platform - a Pump.fun style bonding curve system for AI trading strategies.

## Contracts

### 1. FlowFundFactory.sol

- **Purpose**: Entry point for creating new strategy funds
- **Key Functions**:
  - `createFund(name, symbol, ipfsHash)` - Deploy new bonding curve token
  - `getAllFunds()` - Get all fund addresses
  - `getBatchFundInfo()` - Get info for multiple funds (for frontend)

### 2. FlowFundBondingCurve.sol

- **Purpose**: ERC20-like token with bonding curve pricing (Pump.fun style)
- **Pricing Formula**: `Price = BASE_PRICE + (SLOPE * totalSupply)`
- **Key Functions**:
  - `buy()` - Buy tokens with ETH, price increases
  - `sell(amount)` - Sell tokens for ETH, price decreases
  - `getCurrentPrice()` - Get current token price
  - `getFundInfo()` - Get all fund metadata

### 3. StrategyRegistry.sol

- **Purpose**: On-chain registry linking funds to AI strategy configs
- **Key Functions**:
  - `registerStrategy()` - Register IPFS hash for a fund
  - `getIpfsHash()` - Get strategy config location

## Quick Start

```bash
# Build contracts
forge build

# Run tests
forge test -vv

# Deploy (set PRIVATE_KEY in .env first)
forge script script/Deploy.s.sol --rpc-url <RPC_URL> --broadcast
```

## Configuration

Create a `.env` file:

```
PRIVATE_KEY=your_private_key_here
RPC_URL=https://your-rpc-url
```

## Bonding Curve Parameters

| Parameter  | Value         | Description              |
| ---------- | ------------- | ------------------------ |
| BASE_PRICE | 0.00001 ETH   | Starting price           |
| SLOPE      | 0.0000001 ETH | Price increase per token |
| FEE        | 1%            | Fee to fund creator      |

## Demo Flow

1. Creator uploads `.tradingflow` to IPFS → gets hash
2. Creator calls `factory.createFund("AI Alpha", "ALPHA", ipfsHash)`
3. Users call `fund.buy{value: 1 ether}()` → price goes up
4. Early buyers profit as price increases
5. (Future) AI strategy executes trades based on config

## Networks

Deploy to any EVM chain:

- Ethereum Mainnet/Sepolia
- Base
- Arbitrum
- etc.
