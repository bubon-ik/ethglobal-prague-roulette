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
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Your Stats</h2>
          <p className="text-center text-gray-500">Connect wallet to see stats</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Your Stats</h2>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Sites Discovered:</span>
            <span className="font-bold">{userSpins?.length || 0}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Can Spin:</span>
            <span className={`font-bold ${Number(timeUntilNextSpin) === 0 ? 'text-success' : 'text-warning'}`}>
              {Number(timeUntilNextSpin) === 0 ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Wallet:</span>
            <span className="font-mono text-xs">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </div>
        </div>

        {userSpins && userSpins.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold mb-2">Recent Discoveries:</h3>
            <div className="text-xs space-y-1">
              {userSpins.slice(-3).reverse().map((spinId, index) => (
                <div key={index} className="badge badge-outline badge-sm">
                  Site #{spinId.toString()}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
