import { http, createConfig, fallback } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// BSC Testnet RPC URLs (multiple for fallback)
const BSC_TESTNET_RPCS = [
  "https://bsc-testnet-rpc.publicnode.com",
  "https://bsc-testnet.public.blastapi.io",
  "https://data-seed-prebsc-1-s1.binance.org:8545/",
  "https://data-seed-prebsc-2-s1.binance.org:8545/",
];

// BSC Testnet configuration
export const config = createConfig({
  chains: [bscTestnet],
  connectors: [
    // Single injected connector that will detect available wallets
    injected(),
  ],
  transports: {
    [bscTestnet.id]: fallback(BSC_TESTNET_RPCS.map((url) => http(url))),
  },
});

// Export chain for easy access
export const defaultChain = bscTestnet;

// Supported wallet configs for UI
export const SUPPORTED_WALLETS = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "/metamask.png",
    checkInstalled: () =>
      typeof window !== "undefined" && !!(window as any).ethereum?.isMetaMask,
  },
  {
    id: "okx",
    name: "OKX Wallet",
    icon: "/okx.png",
    checkInstalled: () =>
      typeof window !== "undefined" && !!(window as any).okxwallet,
  },
];
