import React, { useState, useEffect } from 'react';
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';
import { Zap, LogOut, ChevronDown, X } from 'lucide-react';

// BSC Testnet network params for adding to wallet
const BSC_TESTNET_PARAMS = {
  chainId: '0x61', // 97 in hex
  chainName: 'BNB Smart Chain Testnet',
  nativeCurrency: {
    name: 'tBNB',
    symbol: 'tBNB',
    decimals: 18,
  },
  rpcUrls: ['https://bsc-testnet-rpc.publicnode.com'],
  blockExplorerUrls: ['https://testnet.bscscan.com'],
};

// Debug helper - logs to console with prefix
const debug = (msg: string, data?: any) => {
  console.log(`[FundFlow Wallet] ${msg}`, data || '');
};

// Wallet configurations with explicit provider detection
const WALLETS = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '/metamask.png',
    getProvider: () => {
      if (typeof window === 'undefined') return null;
      const ethereum = (window as any).ethereum;
      
      debug('Checking MetaMask...', {
        hasEthereum: !!ethereum,
        isMetaMask: ethereum?.isMetaMask,
        isOKExWallet: ethereum?.isOKExWallet,
        hasProviders: !!ethereum?.providers,
        providersCount: ethereum?.providers?.length,
      });
      
      // If multiple providers exist, find MetaMask specifically
      if (ethereum?.providers) {
        const mm = ethereum.providers.find((p: any) => p.isMetaMask && !p.isOKExWallet);
        debug('Found MetaMask in providers array:', !!mm);
        return mm || null;
      }
      
      // Single provider - check if it's MetaMask (and not OKX pretending)
      if (ethereum?.isMetaMask && !ethereum?.isOKExWallet) {
        debug('Found MetaMask as single provider');
        return ethereum;
      }
      
      return null;
    },
  },
  {
    id: 'okx',
    name: 'OKX Wallet',
    icon: '/okx.png',
    getProvider: () => {
      if (typeof window === 'undefined') return null;
      
      const okxwallet = (window as any).okxwallet;
      debug('Checking OKX Wallet...', {
        hasOkxwallet: !!okxwallet,
        isOKExWallet: okxwallet?.isOKExWallet,
      });
      
      if (okxwallet) {
        debug('Found OKX Wallet at window.okxwallet');
        return okxwallet;
      }
      
      return null;
    },
  },
];

// Helper to add/switch network on a specific provider
async function addAndSwitchNetwork(provider: any, walletName: string) {
  debug(`Adding/switching network on ${walletName}...`);
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BSC_TESTNET_PARAMS.chainId }],
    });
    debug(`Network switched successfully on ${walletName}`);
  } catch (switchError: any) {
    debug(`Switch error on ${walletName}:`, switchError);
    if (switchError.code === 4902 || switchError.code === -32603) {
      debug(`Adding BSC Testnet to ${walletName}...`);
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [BSC_TESTNET_PARAMS],
      });
      debug(`Network added to ${walletName}`);
    } else {
      throw switchError;
    }
  }
}

// Store the active provider globally so other components can use it
let activeProvider: any = null;
let activeWalletId: string | null = null;

export function getActiveProvider() {
  return activeProvider;
}

export function getActiveWalletId() {
  return activeWalletId;
}

export const ConnectButton: React.FC = () => {
  const { address: wagmiAddress, isConnected: wagmiConnected, chain } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  
  const [showMenu, setShowMenu] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Manual connection state (independent of wagmi)
  const [manualAddress, setManualAddress] = useState<string | null>(null);
  const [manualConnected, setManualConnected] = useState(false);
  const [connectedWalletId, setConnectedWalletId] = useState<string | null>(null);

  // Log initial state
  useEffect(() => {
    debug('Component mounted. Checking wallet availability...');
    debug('window.ethereum:', typeof window !== 'undefined' ? (window as any).ethereum : 'N/A');
    debug('window.okxwallet:', typeof window !== 'undefined' ? (window as any).okxwallet : 'N/A');
    
    // Check all wallets
    WALLETS.forEach(w => {
      const provider = w.getProvider();
      debug(`${w.name} available:`, !!provider);
    });
  }, []);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async (walletId: string) => {
    debug(`User clicked connect for: ${walletId}`);
    
    const wallet = WALLETS.find(w => w.id === walletId);
    if (!wallet) {
      debug('Wallet config not found!');
      return;
    }

    const provider = wallet.getProvider();
    debug(`Got provider for ${wallet.name}:`, {
      hasProvider: !!provider,
      providerType: typeof provider,
      isMetaMask: provider?.isMetaMask,
      isOKExWallet: provider?.isOKExWallet,
    });
    
    if (!provider) {
      alert(`${wallet.name} is not installed. Please install it first.`);
      return;
    }

    setConnectingWallet(walletId);
    setShowMenu(false);
    setConnectionError(null);

    try {
      // Step 1: Add/switch network
      await addAndSwitchNetwork(provider, wallet.name);

      // Step 2: Request accounts directly from this specific provider
      debug(`Requesting accounts from ${wallet.name}...`);
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });
      debug(`Got accounts from ${wallet.name}:`, accounts);
      
      if (accounts && accounts.length > 0) {
        // Store the active provider and wallet
        activeProvider = provider;
        activeWalletId = walletId;
        
        // Update state
        setManualAddress(accounts[0]);
        setManualConnected(true);
        setConnectedWalletId(walletId);
        setConnectingWallet(null);
        
        debug(`Successfully connected to ${wallet.name} with address: ${accounts[0]}`);
      }
    } catch (err: any) {
      debug(`Connection error for ${wallet.name}:`, err);
      setConnectingWallet(null);
      setConnectionError(err.message || 'Failed to connect');
      activeProvider = null;
      activeWalletId = null;
    }
  };

  const handleCancel = () => {
    setConnectingWallet(null);
    setConnectionError(null);
  };

  const handleDisconnect = () => {
    debug('Disconnecting...');
    wagmiDisconnect();
    setManualAddress(null);
    setManualConnected(false);
    setConnectedWalletId(null);
    activeProvider = null;
    activeWalletId = null;
  };

  // Use manual connection state primarily
  const displayAddress = manualAddress || wagmiAddress;
  const isDisplayConnected = manualConnected || wagmiConnected;
  
  // Check if on wrong network
  const isWrongNetwork = isDisplayConnected && chain?.id !== bscTestnet.id;

  // Handle network switch
  const handleSwitchNetwork = async () => {
    if (activeProvider) {
      try {
        await addAndSwitchNetwork(activeProvider, connectedWalletId || 'wallet');
      } catch (err) {
        debug('Failed to switch network:', err);
      }
    } else {
      switchChain({ chainId: bscTestnet.id });
    }
  };

  // Get installed wallets
  const getWalletsWithStatus = () => {
    return WALLETS.map(wallet => ({
      ...wallet,
      installed: wallet.getProvider() !== null,
    }));
  };

  // Wrong network warning
  if (isDisplayConnected && isWrongNetwork) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleSwitchNetwork}
          className="brutal-btn bg-orange-500 hover:bg-orange-400 text-black px-4 py-2 font-bold font-mono text-sm border-2 border-black shadow-[3px_3px_0px_#000] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
        >
          ⚠️ Switch to BSC Testnet
        </button>
        <button
          onClick={handleDisconnect}
          className="brutal-btn bg-gray-200 hover:bg-gray-300 text-black px-3 py-2.5 font-bold font-mono text-sm uppercase border-2 border-black shadow-[3px_3px_0px_#000] active:translate-y-1 active:shadow-none transition-all"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  if (isDisplayConnected && displayAddress) {
    const connectedWallet = WALLETS.find(w => w.id === connectedWalletId);
    return (
      <div className="flex items-center gap-2">
        <div className="brutal-btn bg-white text-black px-4 py-2 font-bold font-mono text-sm border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-2">
          {connectedWallet && (
            <img src={connectedWallet.icon} alt={connectedWallet.name} className="w-4 h-4" />
          )}
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>{formatAddress(displayAddress)}</span>
        </div>
        <button
          onClick={handleDisconnect}
          className="brutal-btn bg-red-500 hover:bg-red-400 text-white px-3 py-2.5 font-bold font-mono text-sm uppercase border-2 border-black shadow-[3px_3px_0px_#000] active:translate-y-1 active:shadow-none transition-all flex items-center gap-1"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  // Show connecting state
  if (connectingWallet) {
    const wallet = WALLETS.find(w => w.id === connectingWallet);
    return (
      <div className="flex items-center gap-2">
        <div className="brutal-btn bg-yellow-400 text-black px-4 py-2 font-bold font-mono text-sm border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-2 animate-pulse">
          <img src={wallet?.icon} alt={wallet?.name} className="w-5 h-5" />
          <span>Connecting to {wallet?.name}...</span>
        </div>
        <button
          onClick={handleCancel}
          className="brutal-btn bg-gray-200 hover:bg-gray-300 text-black px-3 py-2.5 font-bold font-mono text-sm uppercase border-2 border-black shadow-[3px_3px_0px_#000] active:translate-y-1 active:shadow-none transition-all"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  const wallets = getWalletsWithStatus();

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="brutal-btn bg-primary hover:bg-white text-black px-6 py-2.5 font-bold font-mono text-sm uppercase border-2 border-black shadow-[4px_4px_0px_#bc13fe] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
      >
        <Zap size={18} fill="currentColor" />
        Connect Wallet
        <ChevronDown
          size={14}
          className={`transition-transform ${showMenu ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Wallet Selection Dropdown */}
      {showMenu && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border-4 border-black rounded-xl shadow-[6px_6px_0px_#000] overflow-hidden z-50">
          <div className="p-3 bg-gray-100 border-b-2 border-black">
            <span className="font-mono text-xs text-gray-500 uppercase font-bold">
              Select Wallet
            </span>
          </div>
          
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleConnect(wallet.id)}
              disabled={!wallet.installed}
              className={`w-full px-4 py-3 flex items-center gap-3 transition-colors border-b border-gray-200 last:border-b-0 ${
                wallet.installed 
                  ? 'hover:bg-primary/20 cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed bg-gray-50'
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <img src={wallet.icon} alt={wallet.name} className="w-6 h-6" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-bold text-black">{wallet.name}</span>
                <span className="text-[10px] font-mono text-gray-400">
                  {wallet.installed ? 'Detected' : 'Not Installed'}
                </span>
              </div>
              {wallet.installed && (
                <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </button>
          ))}

          {/* Error message */}
          {connectionError && (
            <div className="p-3 bg-red-100 border-t-2 border-red-300">
              <p className="text-xs font-mono text-red-600 break-words">
                {connectionError.slice(0, 100)}
              </p>
            </div>
          )}

          {/* Network info */}
          <div className="p-2 bg-cyan-50 border-t-2 border-cyan-200">
            <p className="text-[10px] font-mono text-cyan-700 text-center">
              Connecting to BSC Testnet (Chain ID: 97)
            </p>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};
