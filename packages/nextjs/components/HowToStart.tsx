"use client";

import { useAccount } from "wagmi";

export const HowToStart = () => {
  const { address } = useAccount();

  const steps = [
    {
      number: "1",
      title: "Connect Wallet",
      description: "Click 'Connect Wallet' button in the top right",
      icon: "🔗",
      completed: !!address,
    },
    {
      number: "2", 
      title: "Spin the Wheel",
      description: "Click the big spin button to discover a site",
      icon: "🎰",
      completed: false,
    },
    {
      number: "3",
      title: "Visit & Enjoy",
      description: "Explore the website you discovered!",
      icon: "🌐",
      completed: false,
    },
    {
      number: "4",
      title: "Add Sites",
      description: "Help others by adding new sites to discover",
      icon: "➕",
      completed: false,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        🚀 How to Start
      </h2>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`flex items-start p-4 rounded-lg border-2 transition-all ${
              step.completed 
                ? 'bg-green-50 border-green-300' 
                : 'bg-gray-50 border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-4 ${
              step.completed ? 'bg-green-500' : 'bg-blue-500'
            }`}>
              {step.completed ? '✓' : step.number}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <span className="text-2xl mr-2">{step.icon}</span>
                <h3 className={`font-semibold ${
                  step.completed ? 'text-green-800' : 'text-gray-800'
                }`}>
                  {step.title}
                </h3>
              </div>
              <p className={`text-sm ${
                step.completed ? 'text-green-600' : 'text-gray-600'
              }`}>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {!address && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm text-center">
            👆 Start by connecting your wallet to Flow EVM Testnet
          </p>
        </div>
      )}
    </div>
  );
};
