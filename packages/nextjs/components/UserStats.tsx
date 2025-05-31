"use client";

import { useAccount, useBalance } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { formatEther } from "viem";
import { useEffect, useState } from "react";

export const UserStats = () => {
  const { address } = useAccount();
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: balance, refetch: refetchBalance } = useBalance({
    address: address,
    chainId: 545,
    query: {
      refetchInterval: 5000, // Обновляем каждые 5 секунд
      enabled: !!address,
    },
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

  // Принудительное обновление баланса
  const handleRefreshBalance = () => {
    refetchBalance();
    setRefreshKey(prev => prev + 1);
  };

  if (!address) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Your Stats</h2>
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-4">🔗</div>
          <p>Connect wallet to see your stats</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">📊 Your Stats</h2>
        <button
          onClick={handleRefreshBalance}
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          🔄 Refresh
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
          <span className="text-gray-700">💰 Balance:</span>
          <div className="text-right">
            <span className="font-bold text-purple-600 text-lg block">
              {balance ? `${parseFloat(formatEther(balance.value)).toFixed(4)} FLOW` : "Loading..."}
            </span>
            <button
              onClick={handleRefreshBalance}
              className="text-xs text-purple-500 hover:text-purple-700"
            >
              Click to refresh
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-gray-700">🎯 Sites Discovered:</span>
          <span className="font-bold text-blue-600 text-xl">{userSpins?.length || 0}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
          <span className="text-gray-700">⚡ Can Spin:</span>
          <span className={`font-bold text-lg ${Number(timeUntilNextSpin) === 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Number(timeUntilNextSpin) === 0 ? '✅ Yes' : '❌ No'}
          </span>
        </div>
        
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-gray-700 text-sm mb-1">💳 Your Wallet:</div>
          <div className="font-mono text-xs text-gray-600 break-all">
            {address}
          </div>
        </div>

        {/* Диагностическая информация */}
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-yellow-800 text-xs">
            <div>🔍 Debug Info:</div>
            <div>Chain ID: 545 (Flow EVM Testnet)</div>
            <div>Balance Raw: {balance?.value?.toString() || "undefined"}</div>
            <div>Refresh Key: {refreshKey}</div>
          </div>
        </div>
      </div>

      {userSpins && userSpins.length > 0 && (
        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
          <h3 className="font-bold text-purple-800 text-sm mb-2">🏆 Recent Discoveries:</h3>
          <div className="flex flex-wrap gap-1">
            {userSpins.slice(-5).reverse().map((spinId, index) => (
              <span key={index} className="inline-block bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded">
                #{spinId.toString()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
