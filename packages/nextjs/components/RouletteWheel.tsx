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
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body items-center text-center">
        <div className="mb-8">
          <div className={`w-64 h-64 border-8 border-primary rounded-full flex items-center justify-center mb-6 transition-all duration-1000 ${
            isSpinning ? 'animate-spin border-secondary' : ''
          }`}>
            <div className="text-6xl">🎰</div>
          </div>
          
          {canSpin ? (
            <button
              onClick={handleSpin}
              className="btn btn-primary btn-lg w-48 text-xl"
            >
              SPIN THE WHEEL!
            </button>
          ) : (
            <div className="text-center">
              <div className="btn btn-disabled btn-lg w-48 text-xl mb-2">
                {!address ? "CONNECT WALLET" : isSpinning ? "SPINNING..." : "COOLDOWN"}
              </div>
              {timeLeft > 0 && (
                <div>
                  <div className="text-2xl font-mono text-warning font-bold">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm opacity-70">
                    Next spin available in
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="stats stats-vertical lg:stats-horizontal shadow">
          <div className="stat">
            <div className="stat-title">Total Sites</div>
            <div className="stat-value text-primary">{sitesCount?.toString() || "0"}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Your Discoveries</div>
            <div className="stat-value text-secondary">{userSpins?.length || 0}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Status</div>
            <div className="stat-value text-sm">
              {canSpin ? (
                <span className="text-success">Ready!</span>
              ) : timeLeft > 0 ? (
                <span className="text-warning">Cooldown</span>
              ) : (
                <span className="text-info">Connect</span>
              )}
            </div>
          </div>
        </div>

        {lastSiteUrl && (
          <div className="alert alert-success mt-6">
            <div>
              <h3 className="font-bold">🎉 Latest Discovery!</h3>
              <div className="text-xs break-all">{lastSiteUrl}</div>
              <div className="mt-2">
                <a 
                  href={lastSiteUrl.startsWith('http') ? lastSiteUrl : `https://${lastSiteUrl}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-primary"
                >
                  Visit Site
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="alert alert-info mt-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Spin the roulette to discover new websites! You can spin once every 12 hours.</span>
        </div>
      </div>
    </div>
  );
};
