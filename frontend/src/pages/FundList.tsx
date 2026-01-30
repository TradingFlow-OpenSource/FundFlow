import React, { useState } from "react";
import { Fund } from "../types";
import { TrendingUp, Activity, Search, Sparkles } from "lucide-react";

interface FundListProps {
  funds: Fund[];
  onSelect: (fund: Fund, address?: `0x${string}`) => void;
}

export const FundList: React.FC<FundListProps> = ({ funds, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("🔥 Trending");

  // Find a "featured" fund
  const featuredFund = funds.find((f) => f.ticker === "WHALE") || funds[0];

  return (
    <div className="min-h-screen bg-[#f0f0f0] text-black font-sans pt-20 relative overflow-x-hidden">
      {/* Background Pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-5 z-0"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>

      {/* Top Ticker Tape (Like the reference image top bar) */}
      <div className="bg-cyber-pink border-y-4 border-black py-2 overflow-hidden whitespace-nowrap relative z-10">
        <div className="animate-marquee inline-block font-black font-mono text-white uppercase tracking-widest text-sm">
          Warning: Degen plays only 💀 • 100x Potential detected in Sector 7 🚀
          • Whale Alert: 500 ETH moved to $PEPE_AI 🐳 • Warning: Degen plays
          only 💀 • 100x Potential detected in Sector 7 🚀
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-display font-black uppercase text-black mb-2 text-outline-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            Explore <span className="text-primary">Alpha</span>
          </h1>
          <p className="font-mono font-bold text-gray-500 uppercase tracking-widest bg-white border-2 border-black inline-block px-4 py-1 rounded-full shadow-[4px_4px_0px_#000]">
            Hunt Gems 💎 • Copy Trades 📜 • Get Rich 💰
          </p>
        </div>

        {/* "King of the Hill" Featured Dashboard */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="bg-[#fff] border-4 border-black rounded-3xl p-6 md:p-8 relative shadow-[12px_12px_0px_#FACC15] transform hover:-translate-y-1 transition-transform duration-300">
            {/* Floating Stickers */}
            <div className="absolute -top-6 -left-4 bg-red-500 text-white font-black px-6 py-2 rotate-[-6deg] border-4 border-black rounded-lg shadow-hard-white z-20 text-xl">
              KING OF THE HILL 👑
            </div>
            <div className="absolute -bottom-6 -right-4 bg-cyber-purple text-white font-black px-6 py-2 rotate-[3deg] border-4 border-black rounded-full shadow-hard-white z-20">
              #1 TRENDING
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Left: Avatar/Visual */}
              <div className="w-full md:w-1/3 flex flex-col gap-4">
                <div
                  className="aspect-square bg-blue-200 border-4 border-black rounded-2xl flex items-center justify-center relative overflow-hidden group cursor-pointer"
                  onClick={() => onSelect(featuredFund)}
                >
                  {/* Retro Sunburst Background */}
                  <div className="absolute inset-0 bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-blue-400 via-blue-200 to-blue-400 opacity-50 animate-spin-slow"></div>
                  <div className="text-9xl relative z-10 transform group-hover:scale-110 transition-transform">
                    🐳
                  </div>
                </div>
                <div className="bg-black text-white font-mono font-bold text-center py-2 rounded-xl border-2 border-black">
                  MCAP: ${(featuredFund.marketCap / 1000).toFixed(1)}K
                </div>
              </div>

              {/* Right: Info & CTA */}
              <div className="flex-1 w-full text-center md:text-left">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                  <h2 className="text-5xl font-black uppercase tracking-tight">
                    {featuredFund.name}
                  </h2>
                  <div className="bg-green-100 border-2 border-black px-3 py-1 rounded-lg font-mono font-bold text-green-600 flex items-center gap-1 mt-2 md:mt-0">
                    <TrendingUp size={16} /> +{featuredFund.change24h}%
                  </div>
                </div>

                <div className="bg-gray-100 border-2 border-black rounded-xl p-4 mb-6 relative">
                  <p className="font-bold text-gray-700 text-lg leading-tight">
                    "{featuredFund.description}"
                  </p>
                  {/* Timer Widget */}
                  <div className="absolute -top-3 -right-3 bg-white border-2 border-black px-2 py-1 text-xs font-mono font-bold shadow-[2px_2px_0px_#000] rotate-2">
                    Ends in 08:22:11
                  </div>
                </div>

                {/* Bonding Curve Progress */}
                <div className="mb-8">
                  <div className="flex justify-between font-black text-xs uppercase mb-1 px-1">
                    <span>Bonding Curve Progress</span>
                    <span>{featuredFund.bondingProgress}%</span>
                  </div>
                  <div className="h-6 w-full bg-white border-2 border-black rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full border border-black relative"
                      style={{ width: `${featuredFund.bondingProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzjIHFBm//79/xkYEAxHEwAAfPsQ/0/2O5cAAAAASUVORK5CYII=')] opacity-30"></div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => onSelect(featuredFund)}
                    className="flex-1 bg-primary text-black font-black text-xl py-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all uppercase"
                  >
                    Buy Now 🚀
                  </button>
                  <button className="bg-white text-black font-bold px-6 rounded-xl border-4 border-black shadow-[4px_4px_0px_#ccc] hover:bg-gray-50 transition-all">
                    <Activity />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {["🔥 Trending", "🆕 New", "💎 Blue Chip", "🐕 Memes"].map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`
                            px-6 py-2 rounded-full font-bold font-mono border-2 border-black transition-all shadow-[3px_3px_0px_#000] active:translate-y-1 active:shadow-none
                            ${activeFilter === filter ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"}
                        `}
                >
                  {filter}
                </button>
              ),
            )}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search Ticker..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 bg-white border-2 border-black rounded-lg px-4 py-2 pl-10 font-mono font-bold focus:outline-none focus:shadow-[4px_4px_0px_#primary]"
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {funds
            .filter((f) =>
              f.name.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((fund, i) => (
              <div
                key={fund.id}
                onClick={() => onSelect(fund, fund.address)}
                className={`bg-white border-4 rounded-2xl overflow-hidden relative group cursor-pointer hover:-translate-y-2 transition-transform duration-200 ${fund.isOnChain ? "border-primary shadow-[12px_12px_0px_#06b6d4]" : "border-black shadow-hard-purple"}`}
              >
                {/* On-Chain Badge */}
                {fund.isOnChain && (
                  <div className="absolute top-3 left-3 bg-primary text-black font-black px-2 py-0.5 text-[10px] rounded shadow-sm z-10 flex items-center gap-1">
                    <Sparkles size={10} /> LIVE ON-CHAIN
                  </div>
                )}

                {/* Header Color Block */}
                <div
                  className={`h-24 border-b-4 border-black flex items-center justify-center relative overflow-hidden ${fund.isOnChain ? "bg-cyan-50" : "bg-gray-50"}`}
                >
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "radial-gradient(#000 2px, transparent 2px)",
                      backgroundSize: "10px 10px",
                    }}
                  ></div>
                  <div className="text-6xl transform group-hover:scale-125 transition-transform duration-300">
                    {fund.isOnChain
                      ? "🚀"
                      : fund.ticker === "ARBIT"
                        ? "🤖"
                        : fund.ticker === "SENTI"
                          ? "🐦"
                          : fund.ticker === "YIELD"
                            ? "🌾"
                            : "🎲"}
                  </div>
                </div>

                {/* Creator Badge */}
                <div className="absolute top-3 right-3 bg-white border-2 border-black px-2 py-0.5 text-[10px] font-black rounded shadow-sm z-10">
                  @
                  {typeof fund.creator === "string" &&
                  fund.creator.startsWith("0x")
                    ? `${fund.creator.slice(0, 6)}...`
                    : fund.creator}
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-black text-2xl uppercase leading-none mb-1">
                        {fund.name}
                      </h3>
                      <div className="font-mono font-bold text-gray-500 text-sm bg-gray-100 px-2 rounded inline-block">
                        ${fund.ticker}
                      </div>
                    </div>
                    <div
                      className={`flex flex-col items-center font-black px-2 py-1 rounded border-2 border-black shadow-[2px_2px_0px_#000] ${fund.change24h >= 0 ? "bg-green-400" : "bg-red-500 text-white"}`}
                    >
                      <span className="text-xs">
                        {fund.change24h > 0 ? "+" : ""}
                        {fund.change24h}%
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm font-medium line-clamp-2 mb-4 h-10 leading-snug">
                    {fund.description}
                  </p>

                  {/* Mini Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-yellow-100 border-2 border-black rounded p-2 text-center">
                      <div className="text-[10px] font-bold text-gray-500 uppercase">
                        Vol
                      </div>
                      <div className="font-black text-sm">{fund.volume}</div>
                    </div>
                    <div className="bg-blue-100 border-2 border-black rounded p-2 text-center">
                      <div className="text-[10px] font-bold text-gray-500 uppercase">
                        Replies
                      </div>
                      <div className="font-black text-sm">{fund.replies}</div>
                    </div>
                  </div>

                  <button
                    className={`w-full font-black py-3 rounded-xl border-2 border-black transition-colors uppercase ${fund.isOnChain ? "bg-primary text-black hover:bg-cyan-300" : "bg-black text-white hover:bg-primary hover:text-black"}`}
                  >
                    {fund.isOnChain ? "🔥 Trade Now" : "View Strategy"}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
};
