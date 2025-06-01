"use client";

import { useState } from "react";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const AddSite = () => {
  const [url, setUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Добавляем refetch для обновления счетчика сайтов
  const { refetch: refetchSitesCount } = useScaffoldReadContract({
    contractName: "Roulette",
    functionName: "getSitesCount",
  });

  const { writeContractAsync: addSite } = useScaffoldWriteContract("Roulette");

  const handleAddSite = async () => {
    if (!url.trim()) return;

    setIsAdding(true);
    
    try {
      // Выполняем транзакцию
      const result = await addSite({
        functionName: "addSite",
        args: [url.trim()],
      });

      console.log("Add site transaction completed:", result);

      // Очищаем поле
      setUrl("");

      // Ждем немного для майнинга блока, затем обновляем данные
      setTimeout(async () => {
        await refetchSitesCount();
      }, 2000);
      
    } catch (error) {
      console.error("Failed to add site:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
      <h3 className="text-lg font-bold text-white mb-3 flex items-center">
        ➕ <span className="ml-2">Add Website</span>
      </h3>
      
      <div className="space-y-3">
        <input
          type="url"
          placeholder="https://example.com"
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isAdding}
        />
        
        <button
          onClick={handleAddSite}
          disabled={!url.trim() || isAdding}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-2 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 text-sm"
        >
          {isAdding ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
              Adding...
            </div>
          ) : (
            "Add to Roulette"
          )}
        </button>
        
        <p className="text-gray-400 text-xs text-center">
          Help others discover!
        </p>
      </div>
    </div>
  );
};
