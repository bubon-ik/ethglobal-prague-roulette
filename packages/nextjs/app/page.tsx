"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RouletteWheel } from "~~/components/RouletteWheel";
import { AddSite } from "~~/components/AddSite";
import { UserStats } from "~~/components/UserStats";

const Home: NextPage = () => {
  const { address } = useAccount();

  return (
    <>
      {/* Hero Section */}
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex items-center flex-col pt-10">
          {/* Header */}
          <div className="px-5 text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="text-8xl animate-bounce">🎰</div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Site Discovery
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Roulette
            </h2>
            
            <p className="text-xl md:text-2xl mb-4 text-gray-200 max-w-3xl mx-auto">
              🌟 Discover amazing websites through the power of blockchain! 🌟
            </p>
            <p className="text-lg md:text-xl opacity-80 mb-8 text-gray-300 max-w-2xl mx-auto">
              Spin once every 12 hours to find your next favorite site. Built on Flow EVM with ❤️
            </p>
            
            {/* Connection Status */}
            {address ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="badge badge-success badge-lg text-lg px-6 py-3">
                  🟢 Connected: {address.slice(0, 6)}...{address.slice(-4)}
                </div>
                <div className="badge badge-outline badge-lg text-white">
                  📍 Contract: 0x4292...8ADf
                </div>
                <div className="badge badge-info badge-lg">
                  ⚡ Flow EVM Testnet
                </div>
              </div>
            ) : (
              <div className="badge badge-warning badge-lg text-lg px-6 py-3 animate-pulse">
                ⚠️ Please connect your wallet to start spinning!
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="w-full max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Roulette Wheel - Main Feature */}
              <div className="xl:col-span-3">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <RouletteWheel />
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="xl:col-span-1 space-y-6">
                {/* User Stats */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl">
                  <UserStats />
                </div>
                
                {/* Add Site */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl">
                  <AddSite />
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="w-full max-w-6xl mx-auto px-4 mt-16 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
                <div className="text-4xl mb-4">🎲</div>
                <h3 className="text-xl font-bold text-white mb-2">Random Discovery</h3>
                <p className="text-gray-300">Find amazing websites you never knew existed</p>
              </div>
              
              <div className="text-center p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="text-xl font-bold text-white mb-2">Fair Cooldown</h3>
                <p className="text-gray-300">12-hour cooldown prevents spam and ensures fairness</p>
              </div>
              
              <div className="text-center p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
                <div className="text-4xl mb-4">🚫</div>
                <h3 className="text-xl font-bold text-white mb-2">No Duplicates</h3>
                <p className="text-gray-300">Never get the same website twice</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-400 pb-8">
            <p className="text-sm">
              Built for ETHGlobal Prague 2025 🏆 | Powered by Flow EVM & Scaffold-ETH 2
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
};

export default Home;
