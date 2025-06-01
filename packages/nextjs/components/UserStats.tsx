"use client";

import { useAccount, useBalance } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { formatEther } from "viem";

export const UserStats = () => {
  const { address } = useAccount();

  const { data: balance } = useBalance({
    address: address,
    chainId: 545,
  });

  const { data: userSpins } = useScaffoldReadContract({
    contractName: "Roulette",
    functionName: "getUserSpins",
    args: [address],
  });

  const { data: timeUntilNextSpin } = useScaffoldReadContract({
    contractName: "Roulette",
    functionName: "getTimeUntilNextSpin",
    args: [address],
  });

  if (!address) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center">
          👤 <span className="ml-2">Your Stats</span>
        </h3>
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-xl">🔗</span>
          </div>
          <p className="text-gray-400 text-xs">Connect wallet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
      <h3 className="text-lg font-bold text-white mb-3 flex items-center">
        👤 <span className="ml-2">Your Stats</span>
      </h3>
      
      <div className="space-y-3">
        {/* Balance */}
        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-purple-400">💰</span>
              <span className="text-white text-sm font-semibold">Balance</span>
            </div>
            <span className="text-purple-400 font-bold text-sm">
              {balance ? `${parseFloat(formatEther(balance.value)).toFixed(2)}` : "0.00"} FLOW
            </span>
          </div>
        </div>

        {/* Discoveries */}
        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">🎯</span>
              <span className="text-white text-sm font-semibold">Discoveries</span>
            </div>
            <span className="text-green-400 font-bold text-lg">{userSpins?.length || 0}</span>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className={Number(timeUntilNextSpin) === 0 ? 'text-green-400' : 'text-yellow-400'}>
                {Number(timeUntilNextSpin) === 0 ? '⚡' : '⏰'}
              </span>
              <span className="text-white text-sm font-semibold">Status</span>
            </div>
            <span className={`font-bold text-sm ${
              Number(timeUntilNextSpin) === 0 ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {Number(timeUntilNextSpin) === 0 ? 'Ready' : 'Cooldown'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
