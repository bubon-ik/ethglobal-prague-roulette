"use client";

import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const UserStats = () => {
  const { address } = useAccount();

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
      <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Your Stats</h2>
      
      <div className="space-y-4">
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
