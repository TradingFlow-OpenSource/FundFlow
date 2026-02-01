import React, { useState, useEffect } from "react";
import { WagmiProvider, useReadContract } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./config/wagmi";
import { Navbar } from "./components/Navbar";
import { MemeBackground } from "./components/MemeBackground";
import { Home } from "./pages/Home";
import { FundList } from "./pages/FundList";
import { FundDetail } from "./pages/FundDetail";
import { Upload } from "./pages/Upload";
import { Fund, ViewState } from "./types";
import { MOCK_FUNDS } from "./constants";
import {
  FACTORY_ADDRESS,
  FACTORY_ABI,
  BONDING_CURVE_ABI,
} from "./config/contracts";
import { useReadContracts } from "wagmi";

const queryClient = new QueryClient();

// Parse URL hash to get initial state
const getInitialView = (): ViewState => {
  const hash = window.location.hash.slice(1); // Remove #
  if (hash === "list" || hash === "upload") return hash;
  if (hash.startsWith("fund/")) return "detail";
  return "home";
};

const getInitialFundAddress = (): `0x${string}` | null => {
  const hash = window.location.hash.slice(1);
  if (hash.startsWith("fund/0x")) {
    return hash.replace("fund/", "") as `0x${string}`;
  }
  return null;
};

// Inner app component
const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(getInitialView());
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [selectedFundAddress, setSelectedFundAddress] = useState<
    `0x${string}` | null
  >(getInitialFundAddress());
  const [onChainFunds, setOnChainFunds] = useState<Fund[]>([]);

  // Read all fund addresses from factory
  const { data: fundAddresses, refetch: refetchFunds } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: "getAllFunds",
  });

  // Create contracts config for reading fund info
  const fundInfoContracts = ((fundAddresses as `0x${string}`[]) || []).map(
    (addr) => ({
      address: addr,
      abi: BONDING_CURVE_ABI,
      functionName: "getFundInfo",
    }),
  );

  // Read fund info for all funds
  const { data: fundInfos } = useReadContracts({
    contracts: fundInfoContracts,
    query: {
      enabled: fundAddresses && (fundAddresses as `0x${string}`[]).length > 0,
    },
  });

  // Convert on-chain data to Fund objects
  useEffect(() => {
    if (fundAddresses && fundInfos) {
      const addresses = fundAddresses as `0x${string}`[];
      const funds: Fund[] = addresses
        .map((addr, index) => {
          const info = fundInfos[index];
          if (info.status === "success" && info.result) {
            const [name, symbol, , , , creator] = info.result as [
              string,
              string,
              bigint,
              bigint,
              bigint,
              `0x${string}`,
            ];
            const creatorStr = String(creator);
            return {
              id: addr,
              ticker: symbol,
              name: name,
              description: `On-chain fund deployed at ${addr.slice(0, 10)}...`,
              creator: creatorStr.slice(0, 10) + "...",
              marketCap: 0,
              price: 0.0001, // Base price
              change24h: 0,
              replies: 0,
              volume: "NEW",
              bondingProgress: 0,
              chartData: [
                { time: "0", value: 0.0001 },
                { time: "1", value: 0.0001 },
              ],
              address: addr,
              isOnChain: true,
            };
          }
          return null;
        })
        .filter((f): f is Fund => f !== null);

      setOnChainFunds(funds);
    }
  }, [fundAddresses, fundInfos]);

  const handleNavigate = (view: ViewState) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentView(view);
    // Update URL hash
    if (view === "home") {
      window.location.hash = "";
    } else if (view === "list" || view === "upload") {
      window.location.hash = view;
    }
    // Refetch funds when navigating to list
    if (view === "list") {
      refetchFunds();
    }
  };

  const handleSelectFund = (fund: Fund, address?: `0x${string}`) => {
    const fundAddr = address || fund.address || null;
    setSelectedFund(fund);
    setSelectedFundAddress(fundAddr);
    setCurrentView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Update URL hash with fund address
    if (fundAddr) {
      window.location.hash = `fund/${fundAddr}`;
    }
  };

  const handleUpload = (newFund: Fund) => {
    // Refetch from chain to get updated list
    refetchFunds();
    handleNavigate("list");
  };

  // Combine on-chain funds with mock funds (on-chain first)
  const allFunds = [...onChainFunds, ...MOCK_FUNDS];

  // Restore fund detail page from URL hash
  useEffect(() => {
    if (currentView === "detail" && selectedFundAddress && !selectedFund) {
      // Try to find the fund in our list
      const fund = allFunds.find(
        (f) =>
          f.address === selectedFundAddress || f.id === selectedFundAddress,
      );
      if (fund) {
        setSelectedFund(fund);
      } else if (onChainFunds.length > 0) {
        // Fund not in list but we have on-chain funds loaded, create a placeholder
        const placeholderFund: Fund = {
          id: selectedFundAddress,
          ticker: "...",
          name: "Loading...",
          description: "Loading fund data...",
          creator: "...",
          marketCap: 0,
          price: 0.0001,
          change24h: 0,
          replies: 0,
          volume: "NEW",
          bondingProgress: 0,
          chartData: [{ time: "0", value: 0.0001 }],
          address: selectedFundAddress,
          isOnChain: true,
        };
        setSelectedFund(placeholderFund);
      }
    }
  }, [currentView, selectedFundAddress, selectedFund, allFunds, onChainFunds]);

  // Simple router
  const renderView = () => {
    switch (currentView) {
      case "home":
        return <Home onNavigate={handleNavigate} />;
      case "list":
        return <FundList funds={allFunds} onSelect={handleSelectFund} />;
      case "detail":
        return selectedFund ? (
          <FundDetail
            fund={selectedFund}
            fundAddress={selectedFundAddress}
            onBack={() => handleNavigate("list")}
          />
        ) : (
          <FundList funds={allFunds} onSelect={handleSelectFund} />
        );
      case "upload":
        return <Upload onUpload={handleUpload} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  const isHome = currentView === "home";

  return (
    <div className="min-h-screen bg-[#030305] text-white font-sans selection:bg-primary selection:text-black flex flex-col relative">
      {/* MemeBackground only visible on non-home pages */}
      {!isHome && <MemeBackground />}

      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      <main className="animate-fade-in flex-grow relative z-10">
        {renderView()}
      </main>

      {/* Footer - Dynamic based on page */}
      {isHome ? (
        // High Visibility Neo-Brutalist Footer for Home
        <footer className="border-t-4 border-black bg-primary py-8 mt-auto shadow-[0_-4px_0px_#000] relative z-50">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-black font-black font-mono text-sm uppercase">
            <div className="flex items-center gap-3 bg-white px-3 py-1 rounded border-2 border-black shadow-[2px_2px_0px_#000]">
              <span className="w-3 h-3 bg-green-500 border-2 border-black animate-pulse"></span>
              <span>SYSTEM ONLINE // ETH_CHIANGMAI 2026</span>
            </div>

            <div className="flex gap-6 text-black/80">
              <span className="cursor-pointer hover:text-white hover:underline decoration-2 decoration-black transition-colors">
                Twitter
              </span>
              <span className="cursor-pointer hover:text-white hover:underline decoration-2 decoration-black transition-colors">
                Telegram
              </span>
              <span className="cursor-pointer hover:text-white hover:underline decoration-2 decoration-black transition-colors">
                Docs
              </span>
            </div>

            <div className="text-xs font-bold opacity-80">
              © 2026 FUNDFLOW. DEGEN MODE ACTIVE.
            </div>
          </div>
        </footer>
      ) : (
        // Minimal Low-Profile Footer for App Pages
        <footer className="border-t border-white/10 bg-[#08080a] py-4 mt-auto relative z-50">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-gray-500 font-mono text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>v1.0.4 stable</span>
            </div>
            <div className="flex gap-4">
              <span className="hover:text-primary cursor-pointer transition-colors">
                Help
              </span>
              <span className="hover:text-primary cursor-pointer transition-colors">
                Terms
              </span>
              <span>© FUNDFLOW</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

// Main App with providers
const App: React.FC = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
