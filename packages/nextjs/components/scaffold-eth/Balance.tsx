"use client";

import { useBalance } from "wagmi";
import { formatEther } from "viem";

interface BalanceProps {
  address?: string;
  className?: string;
}

export const Balance = ({ address, className = "" }: BalanceProps) => {
  const { data: balance, isError, isLoading } = useBalance({
    address: address as `0x${string}`,
    chainId: 545, // Flow EVM Testnet
  });

  if (isLoading) return <span className={className}>Loading...</span>;
  if (isError) return <span className={className}>Error</span>;
  if (!balance) return <span className={className}>0 FLOW</span>;

  return (
    <span className={className}>
      {parseFloat(formatEther(balance.value)).toFixed(4)} FLOW
    </span>
  );
};
