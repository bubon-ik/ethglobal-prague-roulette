"use client";

import { useState } from "react";
import { useConnect, useAccount } from "wagmi";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal = ({ isOpen, onClose }: WalletModalProps) => {
  const { connect, connectors, isPending } = useConnect();
  const { isConnected } = useAccount();

  if (!isOpen || isConnected) return null;

  // Фильтруем ТОЛЬКО MetaMask и Coinbase
  const allowedWallets = [
    {
      name: "MetaMask",
      icon: "🦊",
      connector: connectors.find(c => c.name.toLowerCase().includes('metamask') || c.name.toLowerCase().includes('injected'))
    },
    {
      name: "Coinbase Wallet", 
      icon: "🔵",
      connector: connectors.find(c => c.name.toLowerCase().includes('coinbase'))
    },
    {
      name: "WalletConnect",
      icon: "🔗", 
      connector: connectors.find(c => c.name.toLowerCase().includes('walletconnect'))
    }
  ].filter(wallet => wallet.connector);

  const handleConnect = (connector: any) => {
    connect({ connector });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Connect Wallet</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          {allowedWallets.map((wallet, index) => (
            <button
              key={index}
              onClick={() => handleConnect(wallet.connector)}
              disabled={isPending}
              className="w-full flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
            >
              <div className="text-3xl">{wallet.icon}</div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">{wallet.name}</div>
                <div className="text-sm text-gray-500">
                  {wallet.name === "MetaMask" && "Browser extension"}
                  {wallet.name === "Coinbase Wallet" && "Coinbase wallet"}
                  {wallet.name === "WalletConnect" && "Mobile wallets"}
                </div>
              </div>
              <div className="text-gray-400">→</div>
            </button>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            By connecting, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
};
