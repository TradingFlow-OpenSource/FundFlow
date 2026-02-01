import { http, createConfig, fallback } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// BSC Testnet RPC URLs (multiple for fallback) - using more reliable endpoints
const BSC_TESTNET_RPCS = [
  'https://bsc-testnet-rpc.publicnode.com',
  'https://bsc-testnet.public.blastapi.io',
  'https://endpoints.omniatech.io/v1/bsc/testnet/public',
  'https://bsc-testnet.blockpi.network/v1/rpc/public',
];

// Create separate connectors for each wallet
const metamaskConnector = injected({
  target: {
    id: 'metaMask',
    name: 'MetaMask',
    provider: (window) => {
      const ethereum = (window as any).ethereum;
      if (ethereum?.providers) {
        return ethereum.providers.find((p: any) => p.isMetaMask);
      }
      return ethereum?.isMetaMask ? ethereum : undefined;
    },
  },
});

const okxConnector = injected({
  target: {
    id: 'okxWallet',
    name: 'OKX Wallet',
    provider: (window) => (window as any).okxwallet,
  },
});

// BSC Testnet configuration
export const config = createConfig({
  chains: [bscTestnet],
  connectors: [
    metamaskConnector,
    okxConnector,
  ],
  transports: {
    [bscTestnet.id]: fallback(
      BSC_TESTNET_RPCS.map(url => http(url, { timeout: 10000 }))
    ),
  },
});

// Export chain for easy access
export const defaultChain = bscTestnet;

// Supported wallet configs for UI
export const SUPPORTED_WALLETS = [
  {
    id: 'metaMask',
    name: 'MetaMask',
    icon: '/metamask.png',
    checkInstalled: () =>
      typeof window !== 'undefined' && !!(window as any).ethereum?.isMetaMask,
  },
  {
    id: 'okxWallet',
    name: 'OKX Wallet',
    icon: '/okx.png',
    checkInstalled: () =>
      typeof window !== 'undefined' && !!(window as any).okxwallet,
  },
];
