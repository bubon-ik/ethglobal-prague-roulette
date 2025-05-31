"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const RouletteWheel = () => {
  const { address } = useAccount();
  const [isSpinning, setIsSpinning] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

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
  });

  const { data: lastSiteUrl } = useScaffoldReadContract({
    contractName: "Roulette",
    functionName: "getSite",
    args: [userSpins && userSpins.length > 0 ? userSpins[userSpins.length - 1] : BigInt(0)],
    enabled: !!(userSpins && userSpins.length > 0),
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
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSpin = async () => {
    if (!address || isSpinning || timeLeft > 0) return;

    setIsSpinning(true);
    try {
      await spin({
        functionName: "spin",
        args: [],
      });
      setIsSpinning(false);
    } catch (error) {
      console.error("Spin failed:", error);
      setIsSpinning(false);
    }
  };

  const canSpin = address && timeLeft === 0 && !isSpinning;

  return (
    <div className="text-center">
      {/* Roulette Wheel */}
      <div className="mb-12">
        <div className={`relative mx-auto w-80 h-80 transition-all duration-1000 ${
          isSpinning ? 'animate-spin' : ''
        }`}>
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 p-2">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-4">
              <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-lg border-4 border-white/30 flex items-center justify-center">
                <div className="text-8xl filter drop-shadow-lg">🎰</div>
              </div>
            </div>
          </div>
          
          {/* Spinning indicator dots */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full shadow-lg"></div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-400 rounded-full shadow-lg"></div>
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-400 rounded-full shadow-lg"></div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-green-400 rounded-full shadow-lg"></div>
        </div>
      </div>

      {/* Spin Button */}
      <div className="mb-8">
        {canSpin ? (
          <button
            onClick={handleSpin}
            className="btn btn-lg px-12 py-4 text-2xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 border-0 text-white hover:scale-105 transform transition-all duration-200 shadow-2xl"
          >
            🎰 SPIN THE WHEEL! 🎰
          </button>
        ) : (
          <div className="text-center">
            <div className="btn btn-disabled btn-lg px-12 py-4 text-xl mb-4">
              {!address ? "🔗 CONNECT WALLET" : isSpinning ? "🌀 SPINNING..." : "⏰ COOLDOWN"}
            </div>
            {timeLeft > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-mono text-yellow-400 font-bold mb-2">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-lg text-gray-300">
                  ⏰ Next spin available in
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          <div className="text-3xl mb-2">🌐</div>
          <div className="text-2xl font-bold text-yellow-400">{sitesCount?.toString() || "0"}</div>
          <div className="text-sm text-gray-300">Total Sites</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-2xl font-bold text-blue-400">{userSpins?.length || 0}</div>
          <div className="text-sm text-gray-300">Your Discoveries</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          <div className="text-3xl mb-2">
            {canSpin ? "🟢" : timeLeft > 0 ? "🟡" : "🔴"}
          </div>
          <div className="text-lg font-bold text-white">
            {canSpin ? "Ready!" : timeLeft > 0 ? "Cooldown" : "Connect"}
          </div>
          <div className="text-sm text-gray-300">Status</div>
        </div>
      </div>

      {/* Latest Discovery */}
      {lastSiteUrl && (
        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30">
          <div className="text-2xl mb-3">🎉 Latest Discovery!</div>
          <div className="text-sm text-gray-300 break-all mb-4 bg-black/20 rounded-lg p-3">
            {lastSiteUrl}
          </div>
          <a 
            href={lastSiteUrl.startsWith('http') ? lastSiteUrl : `https://${lastSiteUrl}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-success btn-sm"
          >
            🚀 Visit Site
          </a>
        </div>
      )}
    </div>
  );
};
