import React from "react";
import { ViewState } from "../types";
import { LayoutGrid, Rocket } from "lucide-react";
import { ConnectButton } from "./ConnectButton";

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="fixed w-full z-50 bg-[#030305]/90 border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate("home")}
          >
            {/* Custom Logo Icon: The "Flow Node F" */}
            <div className="relative">
              {/* Background Shadow Layer */}
              <div className="absolute inset-0 bg-white translate-x-1 translate-y-1 border-2 border-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

              {/* Main Logo Box */}
              <div className="w-10 h-10 bg-primary flex items-center justify-center border-2 border-transparent group-hover:border-black relative z-10 transition-all transform group-hover:-translate-y-0.5 shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:shadow-none">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-black"
                >
                  {/* Vertical Spine */}
                  <rect x="4" y="4" width="4" height="16" fill="currentColor" />
                  {/* Top Bar with Terminal Node */}
                  <rect x="8" y="4" width="8" height="4" fill="currentColor" />
                  <rect
                    x="18"
                    y="4"
                    width="4"
                    height="4"
                    fill="currentColor"
                    className="group-hover:translate-x-0.5 transition-transform duration-300"
                  />
                  {/* Middle Bar with Terminal Node */}
                  <rect x="8" y="12" width="4" height="4" fill="currentColor" />
                  <rect
                    x="14"
                    y="12"
                    width="4"
                    height="4"
                    fill="currentColor"
                    className="group-hover:translate-x-0.5 transition-transform duration-300 delay-75"
                  />
                </svg>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-display font-bold text-2xl tracking-tight text-white leading-none group-hover:text-primary transition-colors">
                FLOW<span className="text-primary">FUND</span>
              </span>
              <span className="text-[10px] font-mono text-gray-400 tracking-widest group-hover:text-white transition-colors">
                MCP_LAUNCHPAD
              </span>
            </div>
          </div>

          {/* Nav Links - Cleaner Tech Style */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => onNavigate("list")}
              className={`
                  flex items-center gap-2 font-mono font-bold text-sm tracking-wider transition-all duration-300 relative group
                  ${currentView === "list" ? "text-primary" : "text-gray-400 hover:text-white"}
                `}
            >
              <LayoutGrid size={18} />
              <span>EXPLORE</span>
              {/* Neon Active/Hover Indicator */}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${currentView === "list" ? "w-full shadow-[0_0_8px_#06b6d4]" : "w-0 group-hover:w-full"}`}
              ></span>
            </button>

            <button
              onClick={() => onNavigate("upload")}
              className={`
                  flex items-center gap-2 font-mono font-bold text-sm tracking-wider transition-all duration-300 relative group
                  ${currentView === "upload" ? "text-primary" : "text-gray-400 hover:text-white"}
                `}
            >
              <Rocket size={18} />
              <span>LAUNCH</span>
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${currentView === "upload" ? "w-full shadow-[0_0_8px_#06b6d4]" : "w-0 group-hover:w-full"}`}
              ></span>
            </button>
          </div>

          {/* Connect Button */}
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
};
