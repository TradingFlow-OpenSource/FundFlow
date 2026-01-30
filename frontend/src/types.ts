import React from "react";

export interface Fund {
  id: string;
  ticker: string;
  name: string;
  description: string;
  creator: string;
  marketCap: number;
  price: number;
  change24h: number;
  replies: number;
  volume: string;
  bondingProgress: number; // 0 to 100
  chartData: { time: string; value: number }[];
  icon?: React.ReactNode;
  // On-chain fields
  address?: `0x${string}`;
  isOnChain?: boolean;
}

export type ViewState = "home" | "list" | "detail" | "upload";
