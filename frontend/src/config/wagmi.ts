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

// BSC Testnet configuration
export const config = createConfig({
  chains: [bscTestnet],
  connectors: [
    injected(),
  ],
  transports: {
    [bscTestnet.id]: fallback(
      BSC_TESTNET_RPCS.map(url => http(url, { timeout: 15000 }))
    ),
  },
});

// Export chain for easy access
export const defaultChain = bscTestnet;
