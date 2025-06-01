"use client";

import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { WalletModal } from "./WalletModal";

export const CustomConnectButton = () => {
  const [showModal, setShowModal] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-3">
        <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-semibold">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <button
          onClick={() => disconnect()}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
      >
        Connect Wallet
      </button>
      
      <WalletModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
};
