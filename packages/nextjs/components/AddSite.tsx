"use client";

import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useNotification } from '@blockscout/app-sdk';

export const AddSite = () => {
  const [url, setUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { showNotification } = useNotification();

  const { writeContractAsync: addSite } = useScaffoldWriteContract("Roulette");

  const handleAddSite = async () => {
    if (!url.trim()) return;

    setIsAdding(true);
    
    try {
      showNotification({
        type: 'pending',
        title: '📝 Adding Site',
        description: 'Adding your website to the roulette...',
      });

      await addSite({
        functionName: "addSite",
        args: [url.trim()],
      });

      showNotification({
        type: 'success',
        title: '✅ Site Added!',
        description: `${url.trim()} has been added to the roulette!`,
      });

      setUrl("");
    } catch (error) {
      console.error("Failed to add site:", error);
      
      showNotification({
        type: 'error',
        title: '❌ Failed to Add Site',
        description: 'Please try again.',
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">➕ Add New Site</h2>
      <p className="text-sm text-gray-600 mb-4">
        Help others discover amazing websites!
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website URL
          </label>
          <input
            type="url"
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isAdding}
          />
        </div>
        
        <button
          onClick={handleAddSite}
          disabled={!url.trim() || isAdding}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          {isAdding ? "Adding..." : "Add Site"}
        </button>
      </div>
    </div>
  );
};
