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
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 text-center">
          <h1 className="text-5xl font-bold mb-4">
            🎰 Site Discovery Roulette
          </h1>
          <p className="text-xl mb-2 text-primary">
            Discover amazing websites through the power of chance!
          </p>
          <p className="text-lg opacity-70 mb-8">
            Spin once every 12 hours to find your next favorite site
          </p>
          
          {address ? (
  <div className="space-y-2">
    <div className="badge badge-success">
      Connected: {address.slice(0, 6)}...{address.slice(-4)}
    </div>
    <div className="badge badge-outline">
      Contract: 0x4292...8ADf
    </div>
  </div>
) : (
  <div className="badge badge-warning mb-4">
    Please connect your wallet to start
  </div>
)}

        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <RouletteWheel />
              </div>
              
              <div className="lg:col-span-1 space-y-6">
                <UserStats />
                <AddSite />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
