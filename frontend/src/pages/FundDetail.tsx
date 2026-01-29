import React, { useState } from 'react';
import { Fund } from '../types';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';
import { 
  ArrowDown, BrainCircuit, Zap, MessageSquare, Share2, 
  Terminal, TrendingUp, Clock, Cpu, Shield, Home
} from 'lucide-react';

interface FundDetailProps {
  fund: Fund;
  onBack: () => void;
}

export const FundDetail: React.FC<FundDetailProps> = ({ fund, onBack }) => {
  const [amount, setAmount] = useState('0.5');
  const [tab, setTab] = useState<'buy' | 'sell'>('buy');
  const [chartTimeframe, setChartTimeframe] = useState('15m');

  const receiveAmount = (parseFloat(amount) || 0) / fund.price;

  return (
    <div className="min-h-screen text-white pt-24 font-sans pb-20 relative overflow-hidden">
        
        <main className="max-w-7xl mx-auto px-4 relative z-10">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 mb-6 font-mono text-xs md:text-sm text-gray-500 uppercase tracking-wider select-none">
                <div 
                    onClick={onBack} 
                    className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors group"
                >
                    <Home size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                    <span>Explore</span>
                </div>
                <span className="text-gray-700">/</span>
                <span className="text-primary font-bold">{fund.ticker}</span>
                <span className="text-gray-700">/</span>
                <span className="text-gray-300">Strategy Detail</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Main Content (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    
                    {/* Header Card - Compact & Clean */}
                    <div className="bg-[#1a1a1a] border-4 border-black rounded-xl p-4 relative shadow-hard-cyan group hover:-translate-y-0.5 transition-transform">
                         {/* Decorative Screws - Smaller & Subtler */}
                         <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-[#333] border border-black"></div>
                         <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#333] border border-black"></div>
                         <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-[#333] border border-black"></div>
                         <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-[#333] border border-black"></div>
                         
                         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                {/* Icon - Fixed Size, No Shrink */}
                                <div className="w-14 h-14 flex-shrink-0 bg-black border-2 border-white/20 rounded-lg flex items-center justify-center shadow-lg overflow-hidden relative group-hover:border-primary transition-colors">
                                    <div className="absolute inset-0 bg-primary/10"></div>
                                    <span className="text-2xl animate-bounce-gentle relative z-10">🚀</span>
                                </div>
                                
                                <div className="flex flex-col">
                                    <h1 className="text-2xl md:text-3xl font-display font-black text-white uppercase leading-tight tracking-wide mb-1">
                                        {fund.name}
                                    </h1>
                                    <div className="flex items-center gap-3 font-mono text-xs">
                                        <span className="bg-[#222] text-gray-300 px-1.5 py-0.5 border border-gray-700 rounded">${fund.ticker}</span>
                                        <div className={`flex items-center gap-1 font-bold ${fund.change24h >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                                            <TrendingUp size={12} />
                                            {fund.change24h > 0 ? '+' : ''}{fund.change24h}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Price Section - Right Aligned */}
                            <div className="w-full sm:w-auto flex justify-end">
                                <div className="text-right">
                                    <div className="text-[10px] font-mono text-gray-500 uppercase mb-0.5">Price (USD)</div>
                                    <div className="text-xl md:text-2xl font-mono font-bold text-primary tracking-tight">
                                        ${fund.price}
                                    </div>
                                    <div className="text-[10px] font-mono text-gray-400">
                                        Vol: <span className="text-white">{fund.volume}</span>
                                    </div>
                                </div>
                            </div>
                         </div>
                    </div>

                    {/* Chart Section */}
                    <div className="bg-[#111] border-4 border-black rounded-xl p-1 shadow-hard-white relative">
                        <div className="flex justify-between items-center px-3 py-2 border-b-2 border-black bg-[#222] rounded-t-lg mb-1">
                            <div className="flex items-center gap-2">
                                <TrendingUp size={14} className="text-green-400" />
                                <span className="font-mono font-bold text-xs text-gray-300">PRICE ACTION</span>
                            </div>
                            <div className="flex gap-1">
                                {['1H', '4H', '1D', '1W'].map(tf => (
                                    <button 
                                        key={tf}
                                        onClick={() => setChartTimeframe(tf)}
                                        className={`px-2 py-0.5 text-[10px] font-bold font-mono border border-black rounded shadow-[1px_1px_0px_#000] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none ${chartTimeframe === tf ? 'bg-primary text-black' : 'bg-white text-black'}`}
                                    >
                                        {tf}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-[320px] w-full bg-[#080808] rounded-b-lg border-2 border-black relative overflow-hidden">
                             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                             
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={fund.chartData}>
                                    <defs>
                                    <linearGradient id="colorChart" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                    </linearGradient>
                                    </defs>
                                    <Tooltip 
                                        contentStyle={{backgroundColor: '#000', border: '2px solid #fff', borderRadius: '0px', boxShadow: '4px 4px 0px #06b6d4'}} 
                                        itemStyle={{color: '#fff', fontSize: '12px', fontFamily: 'monospace'}}
                                        labelStyle={{display: 'none'}}
                                        cursor={{stroke: '#fff', strokeWidth: 1, strokeDasharray: '4 4'}}
                                    />
                                    <Area 
                                    type="step" 
                                    dataKey="value" 
                                    stroke="#06b6d4" 
                                    strokeWidth={2}
                                    fillOpacity={1} 
                                    fill="url(#colorChart)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Logic & Workflow "Dossier" */}
                    <div className="bg-[#1a1a1a] border-4 border-black rounded-xl overflow-hidden shadow-hard-yellow">
                        <div className="bg-yellow-400 p-2 px-3 border-b-4 border-black flex items-center justify-between">
                             <div className="flex items-center gap-2 text-black font-black font-mono text-sm uppercase">
                                 <BrainCircuit size={16} />
                                 Strategy Blueprint
                             </div>
                             <div className="flex items-center gap-2">
                                <div className="hidden md:flex items-center gap-1 text-[10px] font-bold text-black/60 uppercase">
                                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></span>
                                    Running
                                </div>
                             </div>
                        </div>
                        
                        <div className="p-0 relative bg-[#111] min-h-[250px] flex flex-col">
                            {/* Workflow Canvas Background */}
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#444_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                            
                            {/* Workflow Nodes Visualizer */}
                            <div className="relative z-10 flex-1 p-6 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 overflow-x-auto">
                                
                                {/* Connection Lines (Desktop) */}
                                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-[#222] -z-10"></div>
                                
                                {/* Start Node */}
                                <div className="relative group min-w-[130px]">
                                    <div className="bg-[#1e1e1e] border-2 border-green-500 rounded-lg p-2.5 shadow-[0_0_15px_rgba(34,197,94,0.15)] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all">
                                        <div className="flex items-center gap-2 border-b border-green-500/30 pb-1.5 mb-1.5">
                                            <Share2 size={12} className="text-green-400" />
                                            <span className="text-[10px] font-bold text-green-400 font-mono uppercase">Trigger</span>
                                        </div>
                                        <div className="text-[10px] font-bold text-white mb-0.5">Oracle Feed</div>
                                        <div className="text-[9px] text-gray-400">Chainlink ETH/USD</div>
                                    </div>
                                    {/* Connector Dot */}
                                    <div className="hidden md:block absolute top-1/2 -right-1.5 w-2 h-2 bg-green-500 rounded-full border border-[#111] translate-x-1/2"></div>
                                    <div className="md:hidden absolute bottom-[-16px] left-1/2 -translate-x-1/2 w-0.5 h-6 bg-green-500/50"></div>
                                </div>

                                {/* Arrow/Line Segment */}
                                <div className="hidden md:block w-8 h-0.5 bg-gradient-to-r from-green-500 to-primary"></div>

                                {/* Logic Node */}
                                <div className="relative group min-w-[150px]">
                                    <div className="bg-[#1e1e1e] border-2 border-primary rounded-lg p-2.5 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all scale-105">
                                        <div className="flex items-center gap-2 border-b border-primary/30 pb-1.5 mb-1.5">
                                            <Cpu size={12} className="text-primary" />
                                            <span className="text-[10px] font-bold text-primary font-mono uppercase">Processing</span>
                                        </div>
                                        <div className="text-[10px] font-bold text-white mb-0.5">Sentiment Analysis</div>
                                        <div className="text-[9px] text-gray-400">GPT-4o Volatility Check</div>
                                    </div>
                                    {/* Connector Dots */}
                                    <div className="hidden md:block absolute top-1/2 -left-1.5 w-2 h-2 bg-primary rounded-full border border-[#111] -translate-x-1/2"></div>
                                    <div className="hidden md:block absolute top-1/2 -right-1.5 w-2 h-2 bg-primary rounded-full border border-[#111] translate-x-1/2"></div>
                                    <div className="md:hidden absolute bottom-[-16px] left-1/2 -translate-x-1/2 w-0.5 h-6 bg-primary/50"></div>
                                </div>

                                {/* Arrow/Line Segment */}
                                <div className="hidden md:block w-8 h-0.5 bg-gradient-to-r from-primary to-purple-500"></div>

                                {/* Execution Node */}
                                <div className="relative group min-w-[130px]">
                                    <div className="bg-[#1e1e1e] border-2 border-purple-500 rounded-lg p-2.5 shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
                                        <div className="flex items-center gap-2 border-b border-purple-500/30 pb-1.5 mb-1.5">
                                            <Zap size={12} className="text-purple-400" />
                                            <span className="text-[10px] font-bold text-purple-400 font-mono uppercase">Action</span>
                                        </div>
                                        <div className="text-[10px] font-bold text-white mb-0.5">Flash Swap</div>
                                        <div className="text-[9px] text-gray-400">Uniswap V3 Pool</div>
                                    </div>
                                    {/* Connector Dot */}
                                    <div className="hidden md:block absolute top-1/2 -left-1.5 w-2 h-2 bg-purple-500 rounded-full border border-[#111] -translate-x-1/2"></div>
                                </div>
                            </div>

                            {/* Code Terminal View */}
                            <div className="border-t border-[#333] bg-black/50 p-3 font-mono text-[10px]">
                                <div className="flex justify-between items-center text-gray-500 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Terminal size={10} />
                                        <span>logic_controller.js</span>
                                    </div>
                                    <span className="flex items-center gap-1 text-[9px]"><Shield size={10}/> Audited</span>
                                </div>
                                <div className="space-y-0.5 opacity-90 text-gray-300">
                                    <p><span className="text-purple-400">async function</span> executeStrategy(data) {'{'}</p>
                                    <p className="pl-4"><span className="text-gray-500">// Check spread condition</span></p>
                                    <p className="pl-4"><span className="text-purple-400">if</span> (data.spread &gt; 1.5 && gas &lt; 40) {'{'}</p>
                                    <p className="pl-8 text-green-400">await flashLoan(data.amount);</p>
                                    <p className="pl-8">return <span className="text-yellow-400">"PROFIT_SECURED"</span>;</p>
                                    <p className="pl-4">{'}'}</p>
                                    <p>{'}'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comments "Board" */}
                    <div className="bg-white text-black border-4 border-black rounded-xl overflow-hidden shadow-hard-purple">
                        <div className="bg-[#bc13fe] p-2 px-3 border-b-4 border-black flex items-center gap-2">
                            <MessageSquare className="text-white" size={16} />
                            <span className="font-black font-display text-white text-sm uppercase">Community Chatter</span>
                        </div>
                        <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
                            {[1,2,3].map(i => (
                                <div key={i} className="flex gap-4 border-b-2 border-gray-200 pb-4 last:border-0 last:pb-0">
                                    <div className={`w-8 h-8 rounded-full border-2 border-black bg-gradient-to-tr from-blue-400 to-green-400 flex-shrink-0`}></div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold font-mono text-xs">0xDegen...{i}</span>
                                            <span className="text-[10px] text-gray-500 bg-gray-100 px-1 border border-black rounded">HOLDER</span>
                                        </div>
                                        <p className="font-medium text-xs">This strategy is actually printing. Just watched the tx history.</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Column: Trading Panel (4 cols) - Sticky */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Trading Card */}
                    <div className="bg-white border-4 border-black rounded-2xl overflow-hidden shadow-[8px_8px_0px_#000] sticky top-24">
                        {/* Header with Timer */}
                        <div className="bg-gray-100 border-b-4 border-black p-4">
                             <h2 className="text-2xl font-black font-display text-black uppercase mb-2">Swap Console</h2>
                             <div className="bg-green-400 border-2 border-black rounded p-2 flex items-center justify-between shadow-sm">
                                 <div className="flex items-center gap-1 font-bold text-xs font-mono text-black">
                                     <Clock size={14} /> REBALANCE
                                 </div>
                                 <div className="font-mono font-black text-black">08d : 23h : 41m</div>
                             </div>
                        </div>

                        <div className="p-5 flex flex-col gap-5">
                            {/* Buy/Sell Toggles */}
                            <div className="flex border-2 border-black rounded-lg overflow-hidden font-bold font-mono text-sm shadow-[4px_4px_0px_#ccc]">
                                <button 
                                    onClick={() => setTab('buy')}
                                    className={`flex-1 py-3 transition-colors ${tab === 'buy' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                                >
                                    BUY
                                </button>
                                <button 
                                    onClick={() => setTab('sell')}
                                    className={`flex-1 py-3 transition-colors border-l-2 border-black ${tab === 'sell' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                                >
                                    SELL
                                </button>
                            </div>

                            {/* Conversion Rate Pill */}
                            <div className="flex justify-center">
                                <span className="bg-[#ffcc00] border-2 border-black rounded-full px-4 py-1 text-xs font-black font-mono text-black shadow-sm transform -rotate-2">
                                    1 ETH = {(1/fund.price).toFixed(2)} {fund.ticker}
                                </span>
                            </div>

                            {/* Inputs */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block font-bold text-xs font-mono text-gray-500 mb-1 uppercase">
                                        You Pay ({tab === 'buy' ? 'ETH' : fund.ticker})
                                    </label>
                                    <div className="flex items-center border-2 border-black rounded-lg overflow-hidden h-12 shadow-sm focus-within:shadow-[4px_4px_0px_#06b6d4] transition-all">
                                        <div className="bg-gray-100 px-3 h-full flex items-center border-r-2 border-black font-bold text-black min-w-[80px] justify-center">
                                            {tab === 'buy' ? 'ETH' : fund.ticker}
                                        </div>
                                        <input 
                                            type="number" 
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full h-full px-4 font-mono font-bold text-black outline-none bg-white text-right"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-center -my-2 relative z-10">
                                    <div className="bg-white border-2 border-black rounded-full p-1 shadow-sm">
                                        <ArrowDown size={16} className="text-black" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-bold text-xs font-mono text-gray-500 mb-1 uppercase">
                                        You Receive ({tab === 'buy' ? fund.ticker : 'ETH'})
                                    </label>
                                    <div className="flex items-center border-2 border-black rounded-lg overflow-hidden h-12 bg-gray-50">
                                        <div className="bg-gray-200 px-3 h-full flex items-center border-r-2 border-black font-bold text-gray-600 min-w-[80px] justify-center">
                                            {tab === 'buy' ? fund.ticker : 'ETH'}
                                        </div>
                                        <input 
                                            type="text" 
                                            readOnly
                                            value={receiveAmount.toLocaleString(undefined, {maximumFractionDigits: 2})}
                                            className="w-full h-full px-4 font-mono font-bold text-gray-500 outline-none bg-transparent text-right"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button className={`
                                w-full py-4 font-black font-display text-xl uppercase rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none transition-all
                                ${tab === 'buy' ? 'bg-green-400 text-black hover:bg-green-300' : 'bg-red-500 text-white hover:bg-red-400'}
                            `}>
                                {tab === 'buy' ? 'APE IN NOW 🦍' : 'DUMP IT 📉'}
                            </button>

                            {/* Details Footer */}
                            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-gray-400">
                                <span>SLIPPAGE: <span className="text-black">0.5%</span></span>
                                <span>GAS: <span className="text-black">~0.002 ETH</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid Small */}
                    <div className="grid grid-cols-2 gap-4">
                         {[
                             { label: "APY", value: "218%", color: "bg-purple-500" },
                             { label: "Vol", value: "$1.2M", color: "bg-cyan-500" },
                             { label: "MCap", value: "$420K", color: "bg-yellow-500" },
                             { label: "Holders", value: "1,204", color: "bg-pink-500" },
                         ].map((stat, i) => (
                             <div key={i} className={`${stat.color} border-2 border-black rounded-xl p-3 shadow-hard-black flex flex-col items-center justify-center text-center transform hover:-translate-y-1 transition-transform`}>
                                 <div className="text-xs font-black font-mono text-black/60 uppercase">{stat.label}</div>
                                 <div className="text-xl font-black text-white text-shadow-sm">{stat.value}</div>
                             </div>
                         ))}
                    </div>

                </div>
            </div>
        </main>
    </div>
  );
};