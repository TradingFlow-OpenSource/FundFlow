// Contract addresses on BSC Testnet
// New Factory with K = 0.000001 (price changes more visibly!)
export const FACTORY_ADDRESS =
  "0x4B1EbbB77439305D171eB919Cb7704AE9a43ac64" as const;

// FlowFundFactory ABI (only the functions we need)
export const FACTORY_ABI = [
  {
    name: "createFund",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "ipfsHash", type: "string" },
    ],
    outputs: [{ name: "fundAddress", type: "address" }],
  },
  {
    name: "getAllFunds",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address[]" }],
  },
  {
    name: "getTotalFunds",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getRecentFunds",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "count", type: "uint256" }],
    outputs: [{ name: "", type: "address[]" }],
  },
  {
    name: "FundCreated",
    type: "event",
    inputs: [
      { name: "fundAddress", type: "address", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "name", type: "string", indexed: false },
      { name: "symbol", type: "string", indexed: false },
      { name: "ipfsHash", type: "string", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
] as const;

// FlowFundBondingCurve ABI (for individual fund interactions)
export const BONDING_CURVE_ABI = [
  {
    name: "buy",
    type: "function",
    stateMutability: "payable",
    inputs: [],
    outputs: [],
  },
  {
    name: "sell",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    name: "getCurrentPrice",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "name",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "creator",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    name: "ipfsHash",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "virtualMarketCap",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getFundInfo",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "_name", type: "string" },
      { name: "_symbol", type: "string" },
      { name: "_ipfsHash", type: "string" },
      { name: "_creator", type: "address" },
      { name: "_totalSupply", type: "uint256" },
      { name: "_price", type: "uint256" },
      { name: "_marketCap", type: "uint256" },
      { name: "_createdAt", type: "uint256" },
    ],
  },
  {
    name: "Buy",
    type: "event",
    inputs: [
      { name: "buyer", type: "address", indexed: true },
      { name: "ethAmount", type: "uint256", indexed: false },
      { name: "tokenAmount", type: "uint256", indexed: false },
      { name: "newPrice", type: "uint256", indexed: false },
    ],
  },
] as const;
