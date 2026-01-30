import React, { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { Zap, LogOut, ChevronDown, X } from "lucide-react";

// BSC Testnet network params for adding to wallet
const BSC_TESTNET_PARAMS = {
  chainId: "0x61", // 97 in hex
  chainName: "BNB Smart Chain Testnet",
  nativeCurrency: {
    name: "tBNB",
    symbol: "tBNB",
    decimals: 18,
  },
  rpcUrls: ["https://bsc-testnet-rpc.publicnode.com"],
  blockExplorerUrls: ["https://testnet.bscscan.com"],
};

// Wallet configurations
const WALLETS = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "/metamask.png",
    getProvider: () => {
      if (typeof window === "undefined") return null;
      const ethereum = (window as any).ethereum;
      // Handle multiple wallets - find MetaMask specifically
      if (ethereum?.providers) {
        return ethereum.providers.find((p: any) => p.isMetaMask);
      }
      return ethereum?.isMetaMask ? ethereum : null;
    },
  },
  {
    id: "okx",
    name: "OKX Wallet",
    icon: "/okx.png",
    getProvider: () => {
      if (typeof window === "undefined") return null;
      return (window as any).okxwallet || null;
    },
  },
];

// Helper to add/switch network
async function addAndSwitchNetwork(provider: any) {
  try {
    // Try to switch to BSC Testnet
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BSC_TESTNET_PARAMS.chainId }],
    });
  } catch (switchError: any) {
    // If network not found, add it
    if (switchError.code === 4902 || switchError.code === -32603) {
      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [BSC_TESTNET_PARAMS],
        });
      } catch (addError) {
        console.error("Failed to add network:", addError);
        throw addError;
      }
    } else {
      throw switchError;
    }
  }
}

export const ConnectButton: React.FC = () => {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending, error, reset } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [showMenu, setShowMenu] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Reset connecting state when error occurs or connection completes
  useEffect(() => {
    if (error) {
      setConnectingWallet(null);
      setConnectionError(error.message || "Connection failed");
      // Auto reset error after showing
      const timer = setTimeout(() => {
        reset();
        setConnectionError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, reset]);

  useEffect(() => {
    if (isConnected) {
      setConnectingWallet(null);
      setShowMenu(false);
      setConnectionError(null);
    }
  }, [isConnected]);

  // Reset when isPending changes to false (user cancelled or completed)
  useEffect(() => {
    if (!isPending && connectingWallet) {
      // Small delay to check if actually connected
      const timer = setTimeout(() => {
        if (!isConnected) {
          setConnectingWallet(null);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isPending, connectingWallet, isConnected]);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async (walletId: string) => {
    const wallet = WALLETS.find((w) => w.id === walletId);
    if (!wallet) return;

    const provider = wallet.getProvider();
    if (!provider) {
      alert(`${wallet.name} is not installed. Please install it first.`);
      return;
    }

    setConnectingWallet(walletId);
    setShowMenu(false);
    setConnectionError(null);

    try {
      // First, try to add/switch to BSC Testnet
      await addAndSwitchNetwork(provider);

      // Then connect using wagmi
      const injectedConnector = connectors.find((c) => c.id === "injected");
      if (injectedConnector) {
        connect({ connector: injectedConnector });
      }
    } catch (err: any) {
      console.error("Connection error:", err);
      setConnectingWallet(null);
      setConnectionError(err.message || "Failed to connect");
    }
  };

  const handleCancel = () => {
    setConnectingWallet(null);
    setConnectionError(null);
    reset();
  };

  // Check if on wrong network
  const isWrongNetwork = isConnected && chain?.id !== bscTestnet.id;

  // Handle network switch
  const handleSwitchNetwork = () => {
    switchChain({ chainId: bscTestnet.id });
  };

  // Check which wallets are installed
  const getInstalledWallets = () => {
    return WALLETS.map((wallet) => ({
      ...wallet,
      installed: wallet.getProvider() !== null,
    }));
  };

  // Wrong network warning
  if (isConnected && isWrongNetwork) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleSwitchNetwork}
          className="brutal-btn bg-orange-500 hover:bg-orange-400 text-black px-4 py-2 font-bold font-mono text-sm border-2 border-black shadow-[3px_3px_0px_#000] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
        >
          ⚠️ Switch to BSC Testnet
        </button>
        <button
          onClick={() => disconnect()}
          className="brutal-btn bg-gray-200 hover:bg-gray-300 text-black px-3 py-2.5 font-bold font-mono text-sm uppercase border-2 border-black shadow-[3px_3px_0px_#000] active:translate-y-1 active:shadow-none transition-all"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        {/* Connected Address Display */}
        <div className="brutal-btn bg-white text-black px-4 py-2 font-bold font-mono text-sm border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>{formatAddress(address)}</span>
        </div>
        {/* Disconnect Button */}
        <button
          onClick={() => disconnect()}
          className="brutal-btn bg-red-500 hover:bg-red-400 text-white px-3 py-2.5 font-bold font-mono text-sm uppercase border-2 border-black shadow-[3px_3px_0px_#000] active:translate-y-1 active:shadow-none transition-all flex items-center gap-1"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  // Show connecting state
  if (connectingWallet) {
    const wallet = WALLETS.find((w) => w.id === connectingWallet);
    return (
      <div className="flex items-center gap-2">
        <div className="brutal-btn bg-yellow-400 text-black px-4 py-2 font-bold font-mono text-sm border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-2 animate-pulse">
          <img src={wallet?.icon} alt={wallet?.name} className="w-5 h-5" />
          <span>Connecting...</span>
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

  const wallets = getInstalledWallets();

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
          className={`transition-transform ${showMenu ? "rotate-180" : ""}`}
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
                  ? "hover:bg-primary/20 cursor-pointer"
                  : "opacity-50 cursor-not-allowed bg-gray-50"
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <img src={wallet.icon} alt={wallet.name} className="w-6 h-6" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-bold text-black">{wallet.name}</span>
                <span className="text-[10px] font-mono text-gray-400">
                  {wallet.installed ? "Detected" : "Not Installed"}
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
