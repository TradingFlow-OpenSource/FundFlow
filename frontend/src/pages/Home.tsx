import React from "react";
import { ViewState } from "../types";
import { UploadCloud, Activity, Coins } from "lucide-react";

interface HomeProps {
  onNavigate: (view: ViewState) => void;
}

// Marquee items
const TICKER_ITEMS = [
  "🐸 PEPE_AI: +420%",
  "🚀 ELON_BOT: +69%",
  "💎 DIAMOND_HANDS: +1000%",
  "🐕 DOGE_LOGIC: +88%",
  "🧠 GIGA_BRAIN: +200%",
  "🔥 BURN_IT_ALL: +666%",
];

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen text-white font-sans pt-20 overflow-hidden">
      {/* Fun Background Elements - Glows only, emojis handled by MemeBackground */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-secondary/10 to-transparent"></div>
      </div>

      {/* Marquee Banner - Caution Tape Style */}
      <div className="relative z-40 bg-yellow-400 border-y-4 border-black py-2 transform -rotate-1 shadow-lg scale-105">
        <div className="flex animate-marquee whitespace-nowrap gap-12 items-center text-black font-black font-mono text-lg">
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              {item} <span className="text-xl">★</span>
            </span>
          ))}
          {TICKER_ITEMS.map((item, i) => (
            <span key={`dup-${i}`} className="flex items-center gap-2">
              {item} <span className="text-xl">★</span>
            </span>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            <div className="inline-block bg-white text-black font-bold px-4 py-2 rounded-lg border-2 border-black shadow-hard-purple mb-6 rotate-[-2deg]">
              🎉 WELCOME TO THE DEGEN AI ERA
            </div>

            <h1 className="text-6xl md:text-8xl font-display font-black leading-none mb-6 text-outline">
              TOKENIZE <br />
              <span className="text-primary">YOUR ALPHA</span>
            </h1>

            <p className="text-xl text-gray-400 font-mono font-bold mb-8 max-w-xl mx-auto lg:mx-0">
              Don't just trade.{" "}
              <span className="text-white bg-secondary/50 px-1">
                Create the meta.
              </span>
              Turn your n8n workflows into tradeable bonding curve tokens
              instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => onNavigate("upload")}
                className="brutal-btn bg-primary text-black text-xl font-black px-8 py-4 rounded-xl border-2 border-black shadow-hard-purple hover:bg-white transition-transform hover:-translate-y-1"
              >
                MINT STRATEGY 🚀
              </button>
              <button
                onClick={() => onNavigate("list")}
                className="brutal-btn bg-[#222] text-white text-xl font-bold px-8 py-4 rounded-xl border-2 border-black shadow-hard-white hover:bg-[#333] transition-transform hover:-translate-y-1"
              >
                APE IN 🦍
              </button>
            </div>
          </div>

          {/* Right: The "Car" Graphic Replacement - A Fun Dashboard */}
          <div className="relative">
            {/* The "Cardboard" Container */}
            <div className="relative bg-white text-black rounded-3xl border-4 border-black shadow-hard-cyan p-6 transform rotate-2 transition-transform hover:rotate-0 duration-300">
              {/* Fake Browser Header */}
              <div className="bg-gray-200 border-2 border-black rounded-full h-10 flex items-center px-4 gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500 border border-black"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 border border-black"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 border border-black"></div>
                <div className="ml-auto font-mono text-xs font-bold">
                  fundflow.os
                </div>
              </div>

              {/* Main Content Area */}
              <div className="bg-gray-100 border-2 border-black rounded-xl p-4 flex flex-col gap-4">
                {/* Top Row: Pepe & Stats */}
                <div className="flex gap-4">
                  <div className="w-1/3 bg-primary/20 border-2 border-black rounded-lg p-2 flex items-center justify-center">
                    <span className="text-5xl filter drop-shadow-md">🐸</span>
                  </div>
                  <div className="w-2/3 flex flex-col gap-2">
                    <div className="bg-white border-2 border-black rounded p-2 flex justify-between items-center">
                      <span className="font-bold text-xs">HOLDERS</span>
                      <span className="font-mono font-bold text-green-600">
                        4,206
                      </span>
                    </div>
                    <div className="bg-white border-2 border-black rounded p-2 flex justify-between items-center">
                      <span className="font-bold text-xs">PRICE</span>
                      <span className="font-mono font-bold text-green-600">
                        UP ONLY 📈
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle: Logic Visualizer (Simplified & Fun) */}
                <div className="bg-black rounded-lg p-3 border-2 border-gray-800 relative overflow-hidden">
                  <div className="text-[10px] text-green-400 font-mono mb-2">
                    Executing Logic...
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl animate-pulse">📄</div>
                    <div className="h-1 flex-1 bg-gray-800 mx-2 overflow-hidden rounded">
                      <div className="h-full bg-green-500 w-2/3 animate-pulse"></div>
                    </div>
                    <div className="text-2xl animate-spin-slow">⚙️</div>
                    <div className="h-1 flex-1 bg-gray-800 mx-2 overflow-hidden rounded">
                      <div className="h-full bg-green-500 w-1/3 animate-pulse"></div>
                    </div>
                    <div className="text-2xl animate-bounce">💰</div>
                  </div>
                </div>

                {/* Bottom: Action Button */}
                <div className="bg-secondary text-white font-black text-center py-3 rounded-lg border-2 border-black shadow-sm cursor-pointer hover:bg-secondary/90">
                  CONFIRM SWAP (NO GAS)
                </div>
              </div>

              {/* Decorative Stickers */}
              <div className="absolute -top-6 -right-6 transform rotate-12 bg-yellow-400 text-black font-black p-2 border-2 border-black shadow-hard-white rounded-lg z-20">
                100X SOON!
              </div>
              <div className="absolute -bottom-4 -left-4 transform -rotate-12 bg-white text-black font-bold p-1 border-2 border-black rounded z-20 text-xs">
                Verified ✅
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - "The Road to Moon" */}
      <section className="py-20 bg-primary relative border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-black uppercase text-outline-white mb-4">
              How to Moon?
            </h2>
            <p className="text-black font-bold font-mono">
              Three simple steps to financial freedom (maybe)
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "1. DROP LOGIC",
                desc: "Upload your n8n workflow file. Don't know code? Who cares! Just drag and drop.",
                icon: <UploadCloud size={40} />,
                color: "bg-white",
                shadow: "shadow-hard-purple",
              },
              {
                title: "2. BONDING CURVE",
                desc: "We deploy a smart contract. No pre-sale scams. Pure mathematical fairness.",
                icon: <Activity size={40} />,
                color: "bg-yellow-300",
                shadow: "shadow-hard-white",
              },
              {
                title: "3. PROFIT",
                desc: "AI trades for you. NAV goes up. You dump on pampers. Simple as.",
                icon: <Coins size={40} />,
                color: "bg-green-300",
                shadow: "shadow-hard-purple",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className={`
                ${step.color} border-4 border-black rounded-2xl p-8 relative ${step.shadow} 
                transform transition-transform hover:-translate-y-2 text-black
              `}
              >
                <div className="absolute -top-6 left-6 bg-black text-white w-12 h-12 flex items-center justify-center rounded-full font-black text-xl border-2 border-white">
                  {idx + 1}
                </div>
                <div className="mb-4 mt-2">{step.icon}</div>
                <h3 className="text-2xl font-black mb-2 uppercase">
                  {step.title}
                </h3>
                <p className="font-bold leading-tight opacity-80">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
