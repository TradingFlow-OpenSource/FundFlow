import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import {
  FACTORY_ADDRESS,
  FACTORY_ABI,
  BONDING_CURVE_ABI,
} from "../config/contracts";

// ============ Factory Hooks ============

export function useAllFunds() {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: "getAllFunds",
  });
}

export function useTotalFunds() {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: "getTotalFunds",
  });
}

export function useCreateFund() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createFund = async (name: string, symbol: string, ipfsHash: string) => {
    return writeContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: "createFund",
      args: [name, symbol, ipfsHash],
    });
  };

  return {
    createFund,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

// ============ BondingCurve Hooks ============

export function useFundInfo(fundAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: fundAddress,
    abi: BONDING_CURVE_ABI,
    functionName: "getFundInfo",
    query: {
      enabled: !!fundAddress,
    },
  });
}

export function useFundPrice(fundAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: fundAddress,
    abi: BONDING_CURVE_ABI,
    functionName: "getCurrentPrice",
    query: {
      enabled: !!fundAddress,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  });
}

export function useTotalSupply(fundAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: fundAddress,
    abi: BONDING_CURVE_ABI,
    functionName: "totalSupply",
    query: {
      enabled: !!fundAddress,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  });
}

export function useFundBalance(
  fundAddress: `0x${string}` | undefined,
  userAddress: `0x${string}` | undefined,
) {
  return useReadContract({
    address: fundAddress,
    abi: BONDING_CURVE_ABI,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!fundAddress && !!userAddress,
    },
  });
}

export function useBuyTokens(fundAddress: `0x${string}` | undefined) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const buy = async (ethAmount: string) => {
    if (!fundAddress) return;

    return writeContract({
      address: fundAddress,
      abi: BONDING_CURVE_ABI,
      functionName: "buy",
      value: parseEther(ethAmount),
    });
  };

  return {
    buy,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useSellTokens(fundAddress: `0x${string}` | undefined) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const sell = async (tokenAmount: bigint) => {
    if (!fundAddress) return;

    return writeContract({
      address: fundAddress,
      abi: BONDING_CURVE_ABI,
      functionName: "sell",
      args: [tokenAmount],
    });
  };

  return {
    sell,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

// ============ Utility Functions ============

export const formatPrice = (priceWei: bigint | undefined): string => {
  if (!priceWei) return "0";
  return parseFloat(formatEther(priceWei)).toFixed(6);
};

export const formatTokens = (tokens: bigint | undefined): string => {
  if (!tokens) return "0";
  return parseFloat(formatEther(tokens)).toFixed(2);
};
