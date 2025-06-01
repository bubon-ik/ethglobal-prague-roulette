"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const RouletteWheel = () => {
  const { address } = useAccount();
  const [isSpinning, setIsSpinning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: sitesCount, refetch: refetchSitesCount } = useScaffoldReadContract({
    contractName: "Roulette",
    functionName: "getSitesCount",
    watch: true,
  });

  const { data: userSpins, refetch: refetchUserSpins } = useScaffoldReadContract({
    contractName: "Roulette",
    functionName: "getUserSpins",
    args: [address],
    watch: true,
  });

  const { data: lastSiteUrl, refetch: refetchLastSite } = useScaffoldReadContract({
    contractName: "Roulette",
    functionName: "getSite",
    args: [userSpins && userSpins.length > 0 ? userSpins[userSpins.length - 1] : BigInt(0)],
    enabled: !!(userSpins && userSpins.length > 0),
    watch: true,
  });

  const { writeContractAsync: spin } = useScaffoldWriteContract("Roulette");

  const refreshAllData = async () => {
    try {
      await Promise.all([
        refetchSitesCount(),
        refetchUserSpins(),
        refetchLastSite(),
      ]);
    } catch (error) {
      console.log("Error refreshing data:", error);
    }
  };

  const handleSpin = async () => {
    if (!address || isSpinning) return;

    setIsSpinning(true);
    setErrorMessage(null);
    
    try {
      const result = await spin({
        functionName: "spin",
        args: [],
      });

      console.log("Spin transaction completed:", result);

      setTimeout(async () => {
        await refreshAllData();
        setIsSpinning(false);
      }, 2000);
      
    } catch (error: any) {
      console.error("Spin failed:", error);
      setIsSpinning(false);
      
      const errorMessage = error?.message || error?.reason || error?.toString() || "";
      
      if (errorMessage.includes("No new sites available") || 
          errorMessage.includes("No sites available")) {
        setErrorMessage("all-discovered");
        return;
      } else if (errorMessage.includes("Cooldown period not finished")) {
        setErrorMessage("cooldown");
        return;
      } else if (errorMessage.includes("insufficient funds")) {
        setErrorMessage("no-funds");
        return;
      } else {
        setErrorMessage("general");
        return;
      }
    }
  };

  const renderErrorMessage = () => {
    if (!errorMessage) return null;

    const errorMessages = {
      "all-discovered": {
        title: "🎉 Incredible Explorer!",
        message: "Wow! You've discovered every single website in our collection!",
        subtitle: "You're a true digital pioneer! 🌟 Wait for new sites to be added or become a contributor by adding your own amazing discoveries!",
        bgColor: "from-purple-500/20 to-pink-500/20",
        borderColor: "border-purple-400/30",
        textColor: "text-purple-300",
        buttonText: "I'm Amazing! 🚀"
      },
      "cooldown": {
        title: "⏰ Almost Ready!",
        message: "Just a few more seconds until your next adventure!",
        subtitle: "Great things come to those who wait! 😊",
        bgColor: "from-yellow-500/20 to-orange-500/20",
        borderColor: "border-yellow-400/30",
        textColor: "text-yellow-300"
      },
      "no-funds": {
        title: "💰 Need Some FLOW",
        message: "You need a small amount of FLOW tokens for gas fees",
        subtitle: "Get free testnet FLOW from the faucet to continue exploring!",
        bgColor: "from-blue-500/20 to-cyan-500/20",
        borderColor: "border-blue-400/30",
        textColor: "text-blue-300"
      },
      "general": {
        title: "🤔 Oops! Something Happened",
        message: "Don't worry, even the best explorers hit bumps!",
        subtitle: "Try again in a moment or refresh the page",
        bgColor: "from-gray-500/20 to-gray-600/20",
        borderColor: "border-gray-400/30",
        textColor: "text-gray-300"
      }
    };

    const error = errorMessages[errorMessage as keyof typeof errorMessages];

    return (
      <div className={`bg-gradient-to-r ${error.bgColor} backdrop-blur-xl border ${error.borderColor} rounded-2xl p-4 animate-fadeIn mb-4`}>
        <div className="text-center">
          <h4 className={`font-bold ${error.textColor} text-lg mb-2`}>{error.title}</h4>
          <p className="text-gray-300 text-sm mb-2">{error.message}</p>
          <p className="text-gray-400 text-xs leading-relaxed">{error.subtitle}</p>
          
          {errorMessage === "all-discovered" && (
            <div className="mt-4 space-y-3">
              <div className="flex justify-center space-x-1 mb-2">
                <span className="text-yellow-400">🎉</span>
                <span className="text-blue-400">✨</span>
                <span className="text-green-400">🌟</span>
                <span className="text-purple-400">🎊</span>
                <span className="text-pink-400">🏆</span>
              </div>
              
              <button
                onClick={() => setErrorMessage(null)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-6 rounded-xl text-sm transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                {error.buttonText}
              </button>
              
              <div className="flex justify-center space-x-2 text-xs">
                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-400/30">
                  🏆 Master Explorer
                </span>
                <span className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full border border-pink-400/30">
                  🌟 100% Complete
                </span>
              </div>
              
              <p className="text-purple-200 text-xs italic">
                "Not all who wander are lost, but you've found everything!" ✨
              </p>
            </div>
          )}
          
          {errorMessage === "no-funds" && (
            <div className="mt-3">
              <a
                href="https://testnet-faucet.onflow.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-200 transform hover:scale-105"
              >
                Get Free FLOW 🚰
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  const canSpin = address && !isSpinning;

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 h-full flex flex-col">
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center border border-white/20">
          <div className="text-2xl mb-1">🌐</div>
          <div className="text-xl font-bold text-yellow-400">{sitesCount?.toString() || "0"}</div>
          <div className="text-xs text-gray-300">Total Sites</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center border border-white/20">
          <div className="text-2xl mb-1">🎯</div>
          <div className="text-xl font-bold text-green-400">{userSpins?.length || 0}</div>
          <div className="text-xs text-gray-300">Your Discoveries</div>
        </div>
      </div>

      {/* Compact Roulette Wheel */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className={`relative w-48 h-48 transition-all duration-1000 ${
            isSpinning ? 'animate-spin' : ''
          }`}>
            {/* Outer glow */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-30 blur-xl animate-pulse"></div>
            
            {/* Main wheel */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-white/20 shadow-xl">
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
                <div className="text-5xl filter drop-shadow-xl">🎰</div>
              </div>
              
              {/* Decorative dots */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-red-400 rounded-full"></div>
              <div className="absolute right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
            </div>
            
            {/* Pointer */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-6 border-l-transparent border-r-transparent border-b-yellow-400"></div>
          </div>
        </div>
      </div>

      {/* Spin Button */}
      <div className="mb-4">
        {canSpin ? (
          <button
            onClick={handleSpin}
            className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            {isSpinning ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Spinning...
              </div>
            ) : (
              "🎰 Spin Now!"
            )}
          </button>
        ) : (
          <div className="w-full bg-slate-700 text-gray-300 font-bold py-3 px-6 rounded-xl text-lg cursor-not-allowed opacity-75 text-center">
            {!address ? "🔗 Connect Wallet" : isSpinning ? "🌀 Spinning..." : "⏰ Please wait..."}
          </div>
        )}
      </div>

      {/* Error Message */}
      {renderErrorMessage()}

      {/* Result Display */}
      {lastSiteUrl && !errorMessage && !isSpinning && (
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur border border-green-400/30 rounded-2xl p-4 animate-fadeIn">
          <div className="text-center">
            <div className="text-2xl mb-2">🎉</div>
            <h4 className="font-bold text-green-300 text-lg mb-3">Latest Discovery!</h4>
            <div className="bg-black/30 rounded-xl p-3 mb-4 border border-green-400/20">
              <div className="text-gray-300 break-all font-mono text-sm">
                {lastSiteUrl}
              </div>
            </div>
            <div className="flex gap-2 justify-center">
              <a 
                href={lastSiteUrl.startsWith('http') ? lastSiteUrl : `https://${lastSiteUrl}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-200 transform hover:scale-105"
              >
                🚀 Visit
              </a>
              <a
                href={`https://evm-testnet.flowscan.io/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-200 transform hover:scale-105"
              >
                📊 Explorer
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
