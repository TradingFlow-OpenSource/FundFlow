import React, { useState } from 'react';
import { Fund } from '../types';
import { UploadCloud, FileJson, Cpu, Zap, Activity, Code2, AlertTriangle, Terminal } from 'lucide-react';

interface UploadProps {
  onUpload: (newFund: Fund) => void;
}

export const Upload: React.FC<UploadProps> = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleLaunch = () => {
    if (!name || !ticker || !file) return;
    const newFund: Fund = {
      id: Date.now().toString(),
      name: name,
      ticker: ticker.toUpperCase(),
      description: 'New high-alpha strategy deployed via FlowFund. AI-verified logic.',
      creator: 'You',
      marketCap: 1000,
      price: 0.0001,
      change24h: 0,
      replies: 0,
      volume: '0 ETH',
      bondingProgress: 0,
      chartData: [{ time: '0', value: 0.0001 }]
    };
    onUpload(newFund);
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] text-black font-sans pt-24 pb-12 relative overflow-hidden">
      
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0" 
           style={{backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        {/* Header Area */}
        <div className="text-center mb-10">
          <div className="inline-block bg-yellow-400 border-2 border-black px-4 py-1 font-mono font-bold text-sm mb-4 rounded-full shadow-[4px_4px_0px_#000]">
            🚀 LAUNCHPAD v2.0 READY
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black text-black uppercase mb-4 text-outline-white">
            Deploy <span className="text-primary">Strategy</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input Console */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* Main Panel */}
            <div className="bg-white border-4 border-black rounded-3xl p-6 md:p-8 shadow-[12px_12px_0px_#bc13fe] relative">
               
               {/* Decorative Screws */}
               <div className="absolute top-4 left-4 w-3 h-3 bg-gray-300 rounded-full border border-black flex items-center justify-center"><div className="w-2 h-0.5 bg-gray-500 rotate-45"></div></div>
               <div className="absolute top-4 right-4 w-3 h-3 bg-gray-300 rounded-full border border-black flex items-center justify-center"><div className="w-2 h-0.5 bg-gray-500 rotate-45"></div></div>

                <div className="flex items-center gap-3 mb-8 border-b-4 border-black pb-4">
                    <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-lg">
                        <Code2 />
                    </div>
                    <h2 className="font-black text-2xl uppercase">Configuration</h2>
                </div>

                <div className="space-y-6">
                    {/* Drag Drop Zone */}
                    <div 
                        className={`
                            relative border-4 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group bg-gray-50
                            ${dragActive 
                            ? 'border-primary bg-blue-50 scale-[1.01]' 
                            : 'border-gray-300 hover:border-black'
                            }
                        `}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input id="file-upload" type="file" className="hidden" accept=".json,.tradingflow" onChange={handleChange} />
                        <label htmlFor="file-upload" className="flex flex-col items-center justify-center relative z-10 cursor-pointer w-full h-full">
                            <div className={`
                                w-16 h-16 rounded-xl border-2 border-black flex items-center justify-center mb-4 transition-all duration-300 shadow-[4px_4px_0px_#000]
                                ${file ? 'bg-green-400 rotate-[-3deg]' : 'bg-white group-hover:rotate-3'}
                            `}>
                                {file ? <FileJson className="text-black" /> : <UploadCloud className="text-black" />}
                            </div>
                            <h3 className="text-xl font-black uppercase mb-1">
                                {file ? file.name : 'Drop Logic File'}
                            </h3>
                            <p className="font-mono text-xs text-gray-500 font-bold bg-white px-2 rounded border border-gray-300">
                                {file ? 'READY TO DEPLOY' : '.JSON / .FLOW'}
                            </p>
                        </label>
                    </div>

                    {/* Inputs */}
                    <div>
                        <label className="block font-black text-sm uppercase mb-2">Strategy Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white border-2 border-black rounded-xl px-4 py-3 font-bold text-lg focus:outline-none focus:shadow-[4px_4px_0px_#06b6d4] transition-all"
                            placeholder="e.g. MOON BOT V1"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-black text-sm uppercase mb-2">Ticker Symbol</label>
                            <input 
                                type="text" 
                                value={ticker}
                                onChange={(e) => setTicker(e.target.value)}
                                className="w-full bg-white border-2 border-black rounded-xl px-4 py-3 font-mono font-bold text-lg uppercase focus:outline-none focus:shadow-[4px_4px_0px_#06b6d4] transition-all"
                                placeholder="$ALPHA"
                            />
                        </div>
                        <div>
                            <label className="block font-black text-sm uppercase mb-2">Initial Buy (ETH)</label>
                            <input 
                                type="number" 
                                placeholder="0.5"
                                className="w-full bg-white border-2 border-black rounded-xl px-4 py-3 font-mono font-bold text-lg focus:outline-none focus:shadow-[4px_4px_0px_#06b6d4] transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t-4 border-black">
                     <button 
                        onClick={handleLaunch}
                        disabled={!name || !ticker || !file}
                        className={`
                            w-full py-4 rounded-xl border-2 border-black font-black text-xl uppercase shadow-[6px_6px_0px_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3
                            ${(!name || !ticker || !file) 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-green-400 text-black hover:bg-green-300'
                            }
                        `}
                    >
                        <Zap size={24} fill="currentColor" />
                        Initiate Launch
                    </button>
                </div>
            </div>

            {/* Warning Banner */}
            <div className="bg-yellow-100 border-2 border-black rounded-xl p-4 flex gap-4 items-start">
                <AlertTriangle className="text-orange-500 shrink-0" />
                <p className="text-xs font-mono font-bold text-gray-700 leading-relaxed">
                    DISCLAIMER: Logic is verified by AI but market conditions are volatile. 
                    Ensure your n8n workflow handles error states. Degen responsibly.
                </p>
            </div>

          </div>

          {/* Right Column: Visualizer Console */}
          <div className="lg:col-span-5">
             <div className="bg-[#222] border-4 border-black rounded-3xl overflow-hidden shadow-[12px_12px_0px_#06b6d4] flex flex-col h-full min-h-[500px]">
                
                {/* Monitor Header */}
                <div className="bg-[#333] p-3 flex items-center justify-between border-b-4 border-black">
                   <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 border border-black"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500 border border-black"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500 border border-black"></div>
                   </div>
                   <div className="font-mono text-[10px] text-gray-400 font-bold">TERMINAL_PREVIEW.EXE</div>
                </div>

                {/* CRT Screen */}
                <div className="flex-grow p-6 relative bg-black font-mono text-xs overflow-hidden">
                   {/* Scanlines */}
                   <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]"></div>
                   
                   <div className="relative z-10 space-y-4">
                      <div className="text-green-500 font-bold mb-4">
                        {'>'} SYSTEM_READY...<br/>
                        {'>'} WAITING_FOR_INPUT...
                      </div>

                      {/* Visual Flow Representation */}
                      <div className="flex flex-col gap-2 items-center opacity-80">
                         <div className="w-40 border-2 border-green-500 p-2 rounded text-center text-green-500 font-bold shadow-[0_0_10px_rgba(34,197,94,0.4)] bg-black">
                            START NODE
                         </div>
                         <div className="h-4 w-0.5 bg-gray-600"></div>
                         <div className={`w-40 border-2 p-2 rounded text-center font-bold bg-black transition-all ${file ? 'border-primary text-primary shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'border-gray-700 text-gray-700'}`}>
                            {file ? 'LOGIC DETECTED' : 'NO LOGIC'}
                         </div>
                         <div className="h-4 w-0.5 bg-gray-600"></div>
                         <div className="w-40 border-2 border-purple-500 p-2 rounded text-center text-purple-500 font-bold bg-black">
                            EXECUTE TRADE
                         </div>
                      </div>
                      
                      {file && (
                        <div className="mt-8 border-t border-gray-800 pt-4 space-y-1">
                            <div className="flex justify-between text-gray-400">
                                <span>File Size:</span>
                                <span>{(file.size / 1024).toFixed(2)} KB</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Complexity:</span>
                                <span className="text-yellow-400">MEDIUM</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Audit Status:</span>
                                <span className="text-green-500 animate-pulse">VERIFIED</span>
                            </div>
                        </div>
                      )}

                      {!file && (
                          <div className="absolute bottom-10 left-0 w-full text-center text-gray-600 animate-pulse">
                              _ INSERT DISK TO CONTINUE
                          </div>
                      )}
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};