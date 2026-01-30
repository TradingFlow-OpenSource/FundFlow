import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { formatEther, parseEther } from "viem";
import { Fund } from "../types";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowLeft,
  BrainCircuit,
  MessageSquare,
  Terminal,
  Shield,
  Zap,
  Share2,
  Cpu,
  Timer,
  Wallet,
  CreditCard,
  RefreshCw,
  Flame,
  AlertTriangle,
  TrendingUp,
  ExternalLink,
  CheckCircle,
  X,
  Loader2,
} from "lucide-react";
import {
  useFundPrice,
  useBuyTokens,
  useFundBalance,
  useTotalSupply,
  formatPrice,
  formatTokens,
} from "../hooks/useContracts";

interface FundDetailProps {
  fund: Fund;
  fundAddress?: `0x${string}` | null;
  onBack: () => void;
}

// Mock Comments Data
const MOCK_COMMENTS = [
  {
    user: "0xSatoshi",
    text: "Dev is based. Bonding curve moving fast 🚀",
    time: "2m",
    color: "bg-green-300",
  },
  {
    user: "PepeLover",
    text: "Just aped 2 ETH. Don't fade this logic.",
    time: "5m",
    color: "bg-pink-300",
  },
  {
    user: "AlphaHunt",
    text: "Does this check Telegram or just Twitter?",
    time: "12m",
    color: "bg-blue-300",
  },
  {
    user: "RektCity",
    text: "Waiting for a dip... (famous last words)",
    time: "30m",
    color: "bg-red-300",
  },
];

export const FundDetail: React.FC<FundDetailProps> = ({
  fund,
  fundAddress,
  onBack,
}) => {
  const { address: userAddress, isConnected } = useAccount();
  const [shareAmount, setShareAmount] = useState<string>("");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [currency, setCurrency] = useState<"ETH" | "USDT">("ETH");
  const [chartTimeframe, setChartTimeframe] = useState("15m");
  const [comment, setComment] = useState("");
  const [chartData, setChartData] = useState(fund.chartData);
  const [chartInitialized, setChartInitialized] = useState(false);

  // Transaction State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastTxHash, setLastTxHash] = useState("");

  // On-chain hooks (only if we have an address)
  const { data: onChainPrice, refetch: refetchPrice } = useFundPrice(
    fundAddress as `0x${string}` | undefined,
  );
  const { data: totalSupply, refetch: refetchSupply } = useTotalSupply(
    fundAddress as `0x${string}` | undefined,
  );
  const { data: userBalance } = useFundBalance(
    fundAddress as `0x${string}` | undefined,
    userAddress,
  );
  const { buy, hash, isPending, isConfirming, isSuccess, error } = useBuyTokens(
    fundAddress as `0x${string}` | undefined,
  );

  const isOnChain = !!fundAddress && fund.isOnChain;

  // Calculate bonding progress from on-chain data
  // Target: 100 tokens for demo (easy to see progress!)
  const TARGET_SUPPLY = BigInt(100) * BigInt(10 ** 18);
  const onChainProgress =
    isOnChain && totalSupply
      ? Math.min(100, Number((totalSupply * BigInt(100)) / TARGET_SUPPLY))
      : fund.bondingProgress;

  // Current price (on-chain or mock)
  const currentPrice =
    isOnChain && onChainPrice
      ? parseFloat(formatEther(onChainPrice))
      : fund.price;

  // Initialize chart with on-chain price (simulated history based on bonding curve)
  useEffect(() => {
    if (isOnChain && onChainPrice && !chartInitialized) {
      const price = parseFloat(formatEther(onChainPrice));
      const basePrice = 0.0001; // BASE_PRICE from contract

      // Generate a smooth curve with just a few key points
      // Shows: start -> gradual growth -> current price
      const newChartData = [
        { time: "Start", value: basePrice },
        { time: "T1", value: basePrice + (price - basePrice) * 0.1 },
        { time: "T2", value: basePrice + (price - basePrice) * 0.4 },
        { time: "T3", value: basePrice + (price - basePrice) * 0.7 },
        { time: "Now", value: price },
      ];
      setChartData(newChartData);
      setChartInitialized(true);
    }
  }, [isOnChain, onChainPrice, chartInitialized]);

  // Logic: User inputs Number of Shares -> Calculates Cost
  const priceInEth = currentPrice;
  const priceInUsdt = currentPrice * 3000;

  const estimatedCost = shareAmount
    ? isOnChain
      ? (parseFloat(shareAmount) * priceInEth).toFixed(6)
      : (
          parseFloat(shareAmount) *
          (currency === "ETH" ? priceInEth : priceInUsdt)
        ).toFixed(6)
    : "0.000000";

  // Handle successful transaction
  useEffect(() => {
    if (isSuccess && hash) {
      setLastTxHash(hash);
      setShowSuccessModal(true);
      setShareAmount("");
      // Refetch price and supply after successful buy
      setTimeout(() => {
        refetchPrice();
        refetchSupply();
      }, 2000);
      // Update chart with new price
      setTimeout(() => {
        if (onChainPrice) {
          const newDataPoint = {
            time: new Date().toLocaleTimeString(),
            value: parseFloat(formatEther(onChainPrice)),
          };
          setChartData((prev) => [...prev.slice(-19), newDataPoint]);
        }
      }, 3000);
    }
  }, [isSuccess, hash, onChainPrice, refetchPrice, refetchSupply]);

  const handleTrade = async () => {
    if (!shareAmount || parseFloat(shareAmount) <= 0) return;

    if (isOnChain && tradeType === "buy") {
      // Real on-chain transaction
      try {
        const ethCost = (parseFloat(shareAmount) * priceInEth).toFixed(6);
        await buy(ethCost);
      } catch (err) {
        console.error("Buy failed:", err);
      }
    } else {
      // Mock transaction for demo
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const mockHash =
        "0x" +
        Array(64)
          .fill(0)
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join("");
      setLastTxHash(mockHash);
      setShowSuccessModal(true);
      setShareAmount("");
    }
  };

  const isTrading = isPending || isConfirming;

  return (
    <div className="min-h-screen bg-[#E0E7FF] text-black pt-24 pb-20 relative overflow-x-hidden font-sans selection:bg-yellow-400">
      {/* Background Pattern - Light Degen Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-10 z-0"
        style={{
          backgroundImage: "radial-gradient(#000 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      ></div>

      {/* Random Floating Decor */}
      <div className="fixed top-20 right-10 text-6xl opacity-20 pointer-events-none rotate-12">
        🐸
      </div>
      <div className="fixed bottom-20 left-10 text-6xl opacity-20 pointer-events-none -rotate-12">
        🚀
      </div>

      <main className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Top Navigation Bar - Retro Style */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-white border-2 border-black px-4 py-2 rounded-lg shadow-[4px_4px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all font-bold uppercase"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2">
            {isOnChain && (
              <div className="bg-green-400 border-2 border-black px-4 py-2 rounded-lg shadow-[4px_4px_0px_#000] font-mono font-bold text-sm flex items-center gap-2">
                <span className="w-3 h-3 bg-green-700 rounded-full animate-pulse border border-black"></span>
                LIVE ON BSC
              </div>
            )}
            <div className="bg-yellow-300 border-2 border-black px-4 py-2 rounded-lg shadow-[4px_4px_0px_#000] font-mono font-bold text-sm flex items-center gap-2 rotate-1">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse border border-black"></span>
              LIVE ORACLE FEED
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT COLUMN: Visuals & Logic (8 Cols) ================= */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. CHART WINDOW */}
            <div className="bg-white border-4 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0px_#bc13fe]">
              {/* Retro Window Header */}
              <div className="bg-[#e0e0e0] border-b-4 border-black p-3 flex justify-between items-center px-4">
                <div className="flex gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-black"></div>
                  <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-black"></div>
                  <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-black"></div>
                </div>
                <div className="font-bold font-mono text-sm tracking-widest text-gray-500">
                  {isOnChain ? "BONDING_CURVE.EXE" : "MARKET_DATA.EXE"}
                </div>
              </div>

              <div className="p-6 relative">
                {/* Header Info */}
                <div className="flex justify-between items-end mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center text-4xl border-4 border-black shadow-sm">
                      {isOnChain
                        ? "⚡"
                        : fund.ticker === "ARBIT"
                          ? "🤖"
                          : fund.ticker === "SENTI"
                            ? "🐦"
                            : "🐳"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-4xl font-black font-display uppercase leading-none mb-1 text-outline-white drop-shadow-sm">
                          {fund.name}
                        </h1>
                        {isOnChain && (
                          <span className="bg-green-500 text-black text-[10px] font-bold px-2 py-1 rounded border-2 border-black">
                            ON-CHAIN
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 font-mono font-bold">
                        <span className="bg-gray-200 px-2 py-0.5 rounded border border-black text-sm">
                          ${fund.ticker}
                        </span>
                        <span className="text-gray-500">@{fund.creator}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-5xl font-black tracking-tighter mb-1">
                      {isOnChain ? currentPrice.toFixed(6) : `$${currentPrice}`}
                      {isOnChain && <span className="text-lg ml-1">BNB</span>}
                    </div>
                    <div
                      className={`text-sm font-bold bg-black text-white px-2 py-1 inline-block rounded ${fund.change24h >= 0 ? "bg-green-500 text-black" : "bg-red-500 text-white"}`}
                    >
                      {fund.change24h > 0 ? "▲" : "▼"}{" "}
                      {Math.abs(fund.change24h)}% (24H)
                    </div>
                  </div>
                </div>

                {/* On-chain contract info */}
                {isOnChain && fundAddress && (
                  <div className="mb-4 flex items-center justify-between bg-gray-100 border-2 border-black rounded-lg px-4 py-2">
                    <span className="font-mono text-xs text-gray-600">
                      Contract: {fundAddress.slice(0, 14)}...
                      {fundAddress.slice(-10)}
                    </span>
                    <a
                      href={`https://testnet.bscscan.com/address/${fundAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      View on BSCScan <ExternalLink size={12} />
                    </a>
                  </div>
                )}

                {/* Chart Container */}
                <div className="h-[400px] w-full bg-[#080808] border-4 border-black rounded-xl relative overflow-hidden">
                  {/* Timeframe Toggles Overlay */}
                  <div className="absolute top-4 right-4 z-20 flex gap-2">
                    {["1H", "4H", "1D", "1W"].map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setChartTimeframe(tf)}
                        className={`px-3 py-1 text-xs font-bold font-mono rounded border-2 transition-all ${chartTimeframe === tf ? "bg-primary border-black text-black shadow-[2px_2px_0px_#000]" : "bg-black/50 border-transparent text-white hover:bg-black"}`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>

                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorChart"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#bc13fe"
                            stopOpacity={0.6}
                          />
                          <stop
                            offset="95%"
                            stopColor="#bc13fe"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" hide />
                      <YAxis hide domain={["auto", "auto"]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "3px solid #000",
                          borderRadius: "0px",
                          boxShadow: "4px 4px 0px #000",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                        itemStyle={{ color: "#000", fontFamily: "monospace" }}
                        labelStyle={{ display: "none" }}
                        cursor={{
                          stroke: "#fff",
                          strokeWidth: 1,
                          strokeDasharray: "4 4",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#bc13fe"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorChart)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 2. LOGIC WINDOW (Strategy Blueprint) */}
            <div className="bg-black border-4 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0px_#FACC15]">
              {/* Header Bar */}
              <div className="bg-[#FACC15] p-3 border-b-4 border-black flex justify-between items-center px-6">
                <div className="flex items-center gap-3 text-black">
                  <BrainCircuit className="w-6 h-6" />
                  <h2 className="font-black font-display text-xl tracking-wider uppercase">
                    Strategy Blueprint
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-green-600 rounded-full animate-pulse border border-black"></div>
                  <span className="font-mono font-bold text-black text-xs tracking-wider">
                    RUNNING
                  </span>
                </div>
              </div>

              {/* Diagram Container */}
              <div className="p-8 md:p-12 relative bg-[#0c0e16]">
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(#fff 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                ></div>

                {/* Flow Diagram */}
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
                  {/* TRIGGER NODE */}
                  <div className="group relative">
                    <div className="w-56 border-2 border-green-500 rounded-xl bg-[#111] p-4 shadow-[0_0_15px_rgba(34,197,94,0.15)] relative z-10">
                      <div className="flex items-center gap-2 text-green-500 mb-3 pb-2 border-b border-green-500/30">
                        <Share2 size={14} />
                        <span className="text-xs font-black uppercase tracking-wider">
                          Trigger
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-white font-bold text-sm">
                          Oracle Feed
                        </div>
                        <div className="text-gray-500 text-xs font-mono">
                          Chainlink ETH/USD
                        </div>
                      </div>
                    </div>
                    <div className="md:hidden h-8 w-0.5 bg-gray-700 mx-auto"></div>
                  </div>

                  {/* CONNECTOR 1 */}
                  <div className="hidden md:flex flex-1 items-center px-2 relative">
                    <div className="h-0.5 w-full bg-gray-700 relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-full w-1/3 bg-green-500 animate-beam"></div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] absolute right-0 top-1/2 -translate-y-1/2"></div>
                  </div>

                  {/* PROCESSING NODE */}
                  <div className="group relative">
                    <div className="w-56 border-2 border-primary rounded-xl bg-[#111] p-4 shadow-[0_0_15px_rgba(6,182,212,0.15)] relative z-10">
                      <div className="flex items-center gap-2 text-primary mb-3 pb-2 border-b border-primary/30">
                        <Cpu size={14} />
                        <span className="text-xs font-black uppercase tracking-wider">
                          Processing
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-white font-bold text-sm">
                          Sentiment Analysis
                        </div>
                        <div className="text-gray-500 text-xs font-mono">
                          GPT-4o Volatility Check
                        </div>
                      </div>
                    </div>
                    <div className="md:hidden h-8 w-0.5 bg-gray-700 mx-auto"></div>
                  </div>

                  {/* CONNECTOR 2 */}
                  <div className="hidden md:flex flex-1 items-center px-2 relative">
                    <div className="h-0.5 w-full bg-gray-700 relative overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full w-1/3 bg-primary animate-beam"
                        style={{ animationDelay: "0.3s" }}
                      ></div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#06b6d4] absolute right-0 top-1/2 -translate-y-1/2"></div>
                  </div>

                  {/* ACTION NODE */}
                  <div className="group relative">
                    <div className="w-56 border-2 border-purple-500 rounded-xl bg-[#111] p-4 shadow-[0_0_15px_rgba(168,85,247,0.15)] relative z-10">
                      <div className="flex items-center gap-2 text-purple-500 mb-3 pb-2 border-b border-purple-500/30">
                        <Zap size={14} />
                        <span className="text-xs font-black uppercase tracking-wider">
                          Action
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-white font-bold text-sm">
                          Flash Swap
                        </div>
                        <div className="text-gray-500 text-xs font-mono">
                          Uniswap V3 Pool
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Viewer Panel */}
              <div className="border-t-2 border-gray-700 bg-[#050505] p-5 font-mono text-xs md:text-sm text-gray-300">
                <div className="flex justify-between items-center mb-4 text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">{">_"}</span>
                    <span>logic_controller.js</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs border border-gray-700 rounded px-2 py-0.5 text-gray-400">
                    <Shield size={10} />
                    <span>Audited</span>
                  </div>
                </div>
                <div className="space-y-1 leading-relaxed pl-2 border-l-2 border-gray-800">
                  <div>
                    <span className="text-purple-400">async function</span>{" "}
                    <span className="text-yellow-200">executeStrategy</span>
                    (data) {"{"}
                  </div>
                  <div className="pl-4 text-gray-500">
                    {"// Check spread condition"}
                  </div>
                  <div className="pl-4">
                    <span className="text-purple-400">if</span> (data.spread{" "}
                    {">"} <span className="text-orange-400">1.5</span> {"&&"}{" "}
                    gas {"<"} <span className="text-orange-400">40</span>) {"{"}
                  </div>
                  <div className="pl-8">
                    <span className="text-purple-400">await</span>{" "}
                    <span className="text-blue-400">flashLoan</span>
                    (data.amount);
                  </div>
                  <div className="pl-8">
                    <span className="text-purple-400">return</span>{" "}
                    <span className="text-green-400">"PROFIT_SECURED"</span>;
                  </div>
                  <div className="pl-4">{"}"}</div>
                  <div>{"}"}</div>
                </div>
              </div>
            </div>

            {/* 3. TROLLBOX CHAT */}
            <div className="bg-white border-4 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0px_#06b6d4]">
              <div className="bg-[#222] px-4 py-3 border-b-4 border-black flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} />
                  <h3 className="font-black font-display uppercase tracking-wider">
                    Trollbox
                  </h3>
                </div>
                <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white">
                  420 ONLINE
                </div>
              </div>

              <div className="p-6 bg-gray-50">
                <div className="flex flex-col gap-3 mb-6 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {MOCK_COMMENTS.map((c, i) => (
                    <div
                      key={i}
                      className="flex gap-3 items-start p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200"
                    >
                      <div
                        className={`w-8 h-8 rounded border-2 border-black shrink-0 ${c.color} flex items-center justify-center text-[10px] font-black text-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,0.2)]`}
                      >
                        {c.user.substring(0, 2)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-xs text-black">
                            {c.user}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">
                            {c.time} ago
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 font-medium leading-tight mt-0.5">
                          {c.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write something degen..."
                    className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-sm focus:outline-none focus:shadow-[4px_4px_0px_#000] transition-all font-bold placeholder-gray-400"
                  />
                  <button className="p-3 bg-black text-white border-2 border-black rounded-lg hover:bg-primary hover:text-black transition-all shadow-[4px_4px_0px_#ccc] active:translate-y-1 active:shadow-none">
                    <Terminal size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: SUPER TERMINAL (Sticky) ================= */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-24">
              {/* THE BUY CARD */}
              <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[12px_12px_0px_#000] relative overflow-hidden transform hover:-translate-y-1 transition-transform">
                {/* Header Section */}
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-3xl font-black uppercase leading-none">
                      {isOnChain ? "Trade Live" : "Buy Now"}
                    </h2>
                    <div className="bg-green-300 border-2 border-black px-3 py-1 rounded-lg font-mono font-bold text-sm shadow-[2px_2px_0px_#000] rotate-2 flex items-center gap-1">
                      <Timer size={14} /> {isOnChain ? "LIVE" : "08d:23h:41m"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-500 text-sm">
                      Price per share:
                    </span>
                    <span className="font-black text-xl text-black bg-yellow-200 px-1 border border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                      {isOnChain
                        ? `${currentPrice.toFixed(6)} BNB`
                        : currency === "ETH"
                          ? `$${priceInEth.toFixed(4)}`
                          : `$${priceInUsdt.toFixed(2)}`}
                    </span>
                    <span className="text-[10px] font-black text-green-600 bg-green-100 px-1 rounded border border-green-600">
                      +5%
                    </span>
                  </div>
                </div>

                {/* User Balance (if on-chain and connected) */}
                {/* {isOnChain && isConnected && userBalance !== undefined && (
                  <div className="mb-4 p-3 bg-gray-100 border-2 border-black rounded-xl">
                    <div className="text-[10px] font-black uppercase text-gray-500 mb-1">
                      Your Balance
                    </div>
                    <div className="font-mono font-bold text-lg">
                      {formatTokens(userBalance)} {fund.ticker}
                    </div>
                  </div>
                )} */}

                {/* URGENT BONDING CURVE */}
                <div className="mb-8 p-3 bg-yellow-50 border-2 border-dashed border-red-500 rounded-xl relative shadow-sm">
                  {/* Flashing Badge */}
                  <div className="absolute -top-3 -right-3 z-20">
                    <span className="relative flex h-6 w-6">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 border-2 border-black items-center justify-center text-white text-[10px] font-bold">
                        !
                      </span>
                    </span>
                  </div>

                  <div className="flex justify-between text-xs font-black uppercase mb-1.5 items-center relative z-10">
                    <span className="flex items-center gap-1 text-red-600 animate-pulse">
                      <Flame size={14} fill="currentColor" />
                      {isOnChain ? "BONDING CURVE ACTIVE" : "SELLING OUT FAST"}
                    </span>
                    <span className="text-red-600">
                      {onChainProgress}% FILLED
                    </span>
                  </div>

                  <div className="h-6 w-full bg-gray-300 border-2 border-black rounded-full overflow-hidden relative shadow-inner z-10">
                    {/* Urgent Gradient + Stripes */}
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 border-r-2 border-black relative transition-all duration-1000 ease-out"
                      style={{ width: `${onChainProgress}%` }}
                    >
                      <div
                        className="absolute inset-0 opacity-30"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(45deg, #000 0, #000 4px, transparent 4px, transparent 8px)",
                        }}
                      ></div>
                      <div className="absolute top-0 right-0 bottom-0 w-0.5 bg-white/50"></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2 relative z-10">
                    <div className="text-[9px] font-bold text-gray-500 font-mono">
                      {isOnChain && totalSupply
                        ? `${(Number(totalSupply) / 1e18).toFixed(2)} / 100 TOKENS`
                        : "6.3M / 10M SHARES"}
                    </div>
                    <div className="text-[9px] font-black text-red-500 uppercase flex items-center gap-1">
                      <Zap size={10} fill="currentColor" /> High Volume
                    </div>
                  </div>
                </div>

                {/* Trading Interface */}
                <div className="bg-[#f8f8f8] border-2 border-black rounded-xl p-4 mb-6 relative">
                  {/* Buy / Sell Tabs */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button
                      onClick={() => setTradeType("buy")}
                      className={`py-2 rounded-lg font-black text-xs uppercase border-2 transition-all ${tradeType === "buy" ? "bg-green-400 border-black shadow-[2px_2px_0px_#000]" : "bg-transparent border-transparent text-gray-400 hover:bg-gray-200"}`}
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => setTradeType("sell")}
                      disabled={isOnChain}
                      className={`py-2 rounded-lg font-black text-xs uppercase border-2 transition-all ${tradeType === "sell" ? "bg-red-400 border-black shadow-[2px_2px_0px_#000]" : "bg-transparent border-transparent text-gray-400 hover:bg-gray-200"} ${isOnChain ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Sell {isOnChain && "(Soon)"}
                    </button>
                  </div>

                  {/* Currency Selector (only for mock) */}
                  {!isOnChain && (
                    <div className="flex justify-center gap-4 mb-4 text-[10px] font-bold uppercase">
                      <button
                        onClick={() => setCurrency("ETH")}
                        className={`flex items-center gap-1 ${currency === "ETH" ? "text-black underline decoration-2" : "text-gray-400"}`}
                      >
                        <Wallet size={12} /> Pay with ETH
                      </button>
                      <button
                        onClick={() => setCurrency("USDT")}
                        className={`flex items-center gap-1 ${currency === "USDT" ? "text-black underline decoration-2" : "text-gray-400"}`}
                      >
                        <RefreshCw size={12} /> Pay with USDT
                      </button>
                    </div>
                  )}

                  {/* Main Inputs */}
                  <div className="space-y-4">
                    {/* SHARES INPUT (Primary) */}
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-500 mb-1 block ml-1">
                        Amount (Shares)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={shareAmount}
                          onChange={(e) => setShareAmount(e.target.value)}
                          className="w-full border-2 border-black rounded-lg py-3 pl-3 pr-16 font-black text-lg focus:outline-none transition-colors bg-white shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="0"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 font-black text-xs bg-black text-white px-2 py-1 rounded">
                          SHARES
                        </div>
                      </div>
                    </div>

                    {/* COST OUTPUT (Read Only) */}
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-500 mb-1 block ml-1">
                        Estimated Cost
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          readOnly
                          value={estimatedCost}
                          className="w-full border-2 border-gray-300 rounded-lg py-2 pl-3 pr-16 font-mono font-bold bg-gray-100 text-gray-600 focus:outline-none"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 font-black text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">
                          {isOnChain ? "BNB" : currency}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Status (for on-chain) */}
                {isOnChain && error && (
                  <div className="mb-4 p-3 bg-red-100 border-2 border-red-500 rounded-xl">
                    <p className="text-xs font-mono text-red-600">
                      Transaction failed. Please try again.
                    </p>
                  </div>
                )}

                {/* CTA Button */}
                <button
                  onClick={handleTrade}
                  disabled={
                    isTrading || !shareAmount || (isOnChain && !isConnected)
                  }
                  className={`
                                    w-full text-black border-2 border-black rounded-xl py-4 font-black text-xl uppercase shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none transition-all mb-4 flex items-center justify-center gap-2
                                    ${tradeType === "buy" ? "bg-[#86EFAC] hover:bg-[#4ade80]" : "bg-red-400 hover:bg-red-500"}
                                    ${isTrading || !shareAmount || (isOnChain && !isConnected) ? "opacity-50 cursor-not-allowed" : ""}
                                `}
                >
                  {isTrading ? (
                    <>
                      <Loader2 className="animate-spin" />
                      {isPending ? "Approve in Wallet..." : "Confirming..."}
                    </>
                  ) : !isConnected && isOnChain ? (
                    "Connect Wallet First"
                  ) : tradeType === "buy" ? (
                    "Place Buy Order"
                  ) : (
                    "Place Sell Order"
                  )}
                </button>

                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase px-2">
                  <span className="hover:underline cursor-pointer flex items-center gap-1">
                    <Shield size={10} /> Slippage: Auto
                  </span>
                  <span className="hover:underline cursor-pointer">
                    Network Fee: ~{isOnChain ? "0.002 BNB" : "$4"}
                  </span>
                </div>

                {/* Meme Decoration at Bottom */}
                <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-300 relative h-16 overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full animate-marquee whitespace-nowrap">
                    <span className="text-4xl inline-block mr-10">🏎️💨</span>
                    <span className="text-4xl inline-block mr-10">🐕</span>
                    <span className="text-4xl inline-block mr-10">🌕</span>
                    <span className="text-4xl inline-block mr-10">💎🙌</span>
                  </div>
                </div>
              </div>

              {/* Audited Badge */}
              <div className="mt-4 text-center">
                <span className="inline-flex items-center gap-1 bg-white border-2 border-black px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
                  <Shield size={10} className="text-green-600" /> CONTRACT
                  AUDITED
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ================= SUCCESS MODAL ================= */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_#00FF94] max-w-md w-full relative overflow-hidden">
            {/* Window Header */}
            <div className="bg-black text-white px-3 py-2 font-mono font-bold text-xs flex justify-between items-center select-none">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span>TX_SUCCESS.EXE</span>
              </div>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="hover:text-red-400"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-8 text-center relative">
              {/* Confetti / Decor */}
              <div
                className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(#00FF94 2px, transparent 2px)",
                  backgroundSize: "20px 20px",
                }}
              ></div>

              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full border-4 border-black mb-6 shadow-[4px_4px_0px_#000]">
                <CheckCircle size={48} className="text-green-500" />
              </div>

              <h2 className="text-3xl font-black uppercase mb-2">
                {tradeType === "buy" ? "APED IN!" : "PAPER HANDS!"}
              </h2>
              <p className="font-bold text-gray-600 mb-6">
                Transaction confirmed successfully. <br />
                {tradeType === "buy"
                  ? "Welcome to the bag."
                  : "Hope you took profits."}
              </p>

              <div className="bg-gray-100 border-2 border-black rounded-lg p-3 mb-6 font-mono text-xs text-gray-500 break-all">
                Tx: {lastTxHash}
              </div>

              <a
                href={`https://testnet.bscscan.com/tx/${lastTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#F3BA2F] hover:bg-[#F3BA2F]/90 text-black font-black py-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none transition-all uppercase mb-3"
              >
                <img src="/bscscan.png" alt="BSC" className="w-5 h-5" />
                View on BscScan
              </a>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="text-gray-500 font-bold text-xs uppercase hover:underline"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
