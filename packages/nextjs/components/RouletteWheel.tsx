"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useNotification } from '@blockscout/app-sdk';

export const RouletteWheel = () => {
  const { address } = useAccount();
  const [isSpinning, setIsSpinning] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  // Только уведомления Blockscout
  const { showNotification } = useNotification();

  const { data: sitesCount } = useScaffoldReadContract({
    contractName: "Roulette",
    functionName: "getSitesCount",
  });

  const { data: timeUntilNextSpin } = useScaffoldReadContract({
    contractName: "Roulette",
    functionName: "getTimeUntilNextSpin",
    args: [address],
    watch: true,
  });

  const { data: userSpins } = useScaffoldReadContract({
    contractName: "Roulette",
    functionName: "getUserSpins",
    args: [address],
    watch: true,
  });

  const { data: lastSiteUrl } = useScaffoldReadContract({
    contractName: "Roulette",
    functionName: "getSite",
    args: [userSpins && userSpins.length > 0 ? userSpins[userSpins.length - 1] : BigInt(0)],
    enabled: !!(userSpins && userSpins.length > 0),
    watch: true,
  });

  const { writeContractAsync: spin } = useScaffoldWriteContract("Roulette");

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeUntilNextSpin && Number(timeUntilNextSpin) > 0) {
        setTimeLeft(Number(timeUntilNextSpin));
      } else {
        setTimeLeft(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeUntilNextSpin]);

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds} sec`;
    }
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSpin = async () => {
    if (!address || isSpinning || timeLeft > 0) return;

    setIsSpinning(true);
    
    try {
      showNotification({
        type: 'pending',
        title: '🎰 Spinning the Roulette!',
        description: 'Your transaction is being processed...',
      });

      await spin({
        functionName: "spin",
        args: [],
      });

      showNotification({
        type: 'success',
        title: '🎉 Spin Successful!',
        description: 'You discovered a new website! Check below.',
      });
      
    } catch (error) {
      console.error("Spin failed:", error);
      
      showNotification({
        type: 'error',
        title: '❌ Spin Failed',
        description: 'Transaction failed. Please try again.',
      });
    } finally {
      setIsSpinning(false);
    }
  };

  const canSpin = address && timeLeft === 0 && !isSpinning;

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">🎰 Spin the Roulette!</h2>
      
      {/* Roulette Wheel */}
      <div className="mb-8">
        <div className={`relative mx-auto w-64 h-64 transition-all duration-1000 ${
          isSpinning ? 'animate-spin' : ''
        }`}>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 p-3 shadow-2xl">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center border-4 border-gray-200 shadow-inner">
              <div className="text-6xl filter drop-shadow-lg">🎰</div>
            </div>
          </div>
          
          {/* Indicator Arrow */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500 drop-shadow-lg"></div>
          
          {/* Decorative dots */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-green-400 rounded-full"></div>
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-400 rounded-full"></div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full"></div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 shadow-sm">
          <div className="text-3xl mb-1">🌐</div>
          <div className="text-2xl font-bold text-blue-600">{sitesCount?.toString() || "0"}</div>
          <div className="text-sm text-blue-800">Total Sites</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 shadow-sm">
          <div className="text-3xl mb-1">🎯</div>
          <div className="text-2xl font-bold text-green-600">{userSpins?.length || 0}</div>
          <div className="text-sm text-green-800">Your Discoveries</div>
        </div>
      </div>

      {/* Spin Button */}
      <div className="mb-6">
        {canSpin ? (
          <button
            onClick={handleSpin}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-transparent hover:border-white/20"
          >
            🎰 SPIN NOW! 🎰
          </button>
        ) : (
          <div>
            <div className="w-full bg-gray-400 text-white font-bold py-4 px-8 rounded-xl text-xl mb-4 cursor-not-allowed opacity-75">
              {!address ? "🔗 Connect Wallet First" : isSpinning ? "🌀 Spinning..." : "⏰ Cooldown Active"}
            </div>
            {timeLeft > 0 && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-mono text-yellow-600 font-bold mb-1">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm text-yellow-800">
                  ⏰ Next spin available in
                </div>
                <div className="mt-2 w-full bg-yellow-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.max(0, 100 - (timeLeft / 10) * 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Latest Discovery */}
      {lastSiteUrl && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6 shadow-sm">
          <h3 className="font-bold text-green-800 mb-3 text-lg">🎉 Your Latest Discovery!</h3>
          <div className="text-sm text-gray-700 break-all mb-4 bg-white rounded-lg p-3 border border-gray-200 font-mono">
            {lastSiteUrl}
          </div>
          <div className="flex gap-3 justify-center">
            <a 
              href={lastSiteUrl.startsWith('http') ? lastSiteUrl : `https://${lastSiteUrl}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              🚀 Visit Site
            </a>
            <a
              href={`https://evm-testnet.flowscan.io/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              📊 View on FlowScan
            </a>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-sm text-gray-600">
          💡 <strong>How it works:</strong> Spin to discover new websites! You can spin once every <strong>10 seconds</strong>.
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Built on Flow EVM Testnet • ETHGlobal Prague 2025 • Powered by Blockscout
        </div>
      </div>
    </div>
  );
};
