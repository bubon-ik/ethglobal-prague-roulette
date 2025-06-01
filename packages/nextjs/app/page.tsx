"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RouletteWheel } from "~~/components/RouletteWheel";
import { AddSite } from "~~/components/AddSite";
import { UserStats } from "~~/components/UserStats";

const Home: NextPage = () => {
  const { address } = useAccount();

  return (
    <div className="min-h-screen max-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      </div>

      <div className="relative z-10 h-screen flex flex-col">
        {/* Compact Header */}
        <div className="text-center py-6">
          <h1 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            🎰 Site Discovery Roulette
          </h1>
          <p className="text-lg text-gray-300">
            Discover amazing websites every <span className="text-yellow-400 font-bold">10 seconds</span>!
          </p>
        </div>

        {/* Main Content Grid - Fits in viewport */}
        <div className="flex-1 container mx-auto px-4 pb-4">
          <div className="grid grid-cols-12 gap-4 h-full max-w-7xl mx-auto">
            
            {/* Left Column: Problem & Solution */}
            <div className="col-span-3 space-y-3">
              {/* Problem */}
              <div className="bg-red-500/10 backdrop-blur-xl rounded-2xl p-4 border border-red-400/20">
                <h3 className="text-lg font-bold text-red-300 mb-3 flex items-center">
                  😫 <span className="ml-2">The Problem</span>
                </h3>
                <ul className="space-y-1 text-red-200 text-sm">
                  <li>• Hard to discover new websites</li>
                  <li>• Always visiting same sites</li>
                  <li>• Missing amazing content</li>
                  <li>• No fun way to explore</li>
                </ul>
              </div>

              {/* Solution */}
              <div className="bg-green-500/10 backdrop-blur-xl rounded-2xl p-4 border border-green-400/20">
                <h3 className="text-lg font-bold text-green-300 mb-3 flex items-center">
                  ✨ <span className="ml-2">Our Solution</span>
                </h3>
                <ul className="space-y-1 text-green-200 text-sm">
                  <li>• 🎲 Random discovery</li>
                  <li>• ⏰ Fair 10s cooldown</li>
                  <li>• 🚫 No duplicates</li>
                  <li>• 🌐 Community driven</li>
                </ul>
              </div>

              {/* User Stats */}
              <UserStats />
            </div>
            
            {/* Center Column: Main Roulette */}
            <div className="col-span-6">
              <RouletteWheel />
            </div>
            
            {/* Right Column: Features & Add Site */}
            <div className="col-span-3 space-y-3">
              {/* Features */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                  ⚡ <span className="ml-2">Features</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-300 text-sm">10s quick spins</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400">✓</span>
                    <span className="text-gray-300 text-sm">No duplicates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-400">✓</span>
                    <span className="text-gray-300 text-sm">Web3 powered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400">✓</span>
                    <span className="text-gray-300 text-sm">Community sites</span>
                  </div>
                </div>
              </div>

              {/* How It Works */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                  🎯 <span className="ml-2">How It Works</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                    <span className="text-gray-300 text-sm">Connect wallet</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                    <span className="text-gray-300 text-sm">Spin roulette</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                    <span className="text-gray-300 text-sm">Discover sites</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
                    <span className="text-gray-300 text-sm">Add favorites</span>
                  </div>
                </div>
              </div>

              {/* Add Site */}
              <AddSite />
            </div>
          </div>
        </div>

        {/* Compact Footer */}
        <div className="text-center py-2">
          <p className="text-gray-500 text-xs">
            Built on Flow EVM • ETHGlobal Prague 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
