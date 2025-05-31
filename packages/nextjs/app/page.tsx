"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RouletteWheel } from "~~/components/RouletteWheel";
import { AddSite } from "~~/components/AddSite";
import { UserStats } from "~~/components/UserStats";
import { HowToStart } from "~~/components/HowToStart";

const Home: NextPage = () => {
  const { address } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: Title & Description */}
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-4">
                🎰 Site Discovery Roulette
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Discover amazing websites through blockchain! Spin once every 12 hours to find new sites.
              </p>
              
              {/* Connection Status */}
              {address ? (
                <div className="bg-green-100 border border-green-400 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-green-800 font-semibold">
                      ✅ Wallet Connected: {address.slice(0, 6)}...{address.slice(-4)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-yellow-800 font-semibold">
                      ⚠️ Connect your wallet to start spinning!
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: VIP Badge */}
            <div className="text-center lg:text-right">
              <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                🏆 ETHGlobal Prague 2025
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Built on Flow EVM Testnet
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Problem & Solution */}
          <div className="space-y-6">
            {/* Problem Section */}
            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-red-800 mb-4">😫 The Problem</h2>
              <ul className="space-y-2 text-red-700">
                <li>• Hard to discover new websites</li>
                <li>• Always visiting the same sites</li>
                <li>• Missing amazing content online</li>
                <li>• No fun way to explore the web</li>
              </ul>
            </div>

            {/* Solution Section */}
            <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-green-800 mb-4">✨ Our Solution</h2>
              <ul className="space-y-2 text-green-700">
                <li>• 🎲 Random website discovery</li>
                <li>• ⏰ Fair 12-hour cooldown</li>
                <li>• 🚫 No duplicate sites</li>
                <li>• 🌐 Community-driven pool</li>
              </ul>
            </div>

            {/* User Stats */}
            <UserStats />
          </div>

          {/* Center Column: Main Roulette */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200">
            <RouletteWheel />
          </div>

          {/* Right Column: How to Start */}
          <div className="space-y-6">
            <HowToStart />
            <AddSite />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg mb-2">🚀 Built for ETHGlobal Prague 2025</p>
          <p className="text-gray-400">Powered by Flow EVM & Scaffold-ETH 2</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
