"use client";

import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const AddSite = () => {
  const [url, setUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const { writeContractAsync: addSite } = useScaffoldWriteContract("Roulette");

  const handleAddSite = async () => {
    if (!url.trim()) return;

    setIsAdding(true);
    try {
      await addSite({
        functionName: "addSite",
        args: [url.trim()],
      });
      console.log("Site added successfully!");
      setUrl("");
    } catch (error) {
      console.error("Failed to add site:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Add New Site</h2>
        <p className="text-sm opacity-70 mb-4">
          Help others discover amazing websites!
        </p>
        
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Website URL</span>
          </label>
          <input
            type="url"
            placeholder="https://example.com"
            className="input input-bordered w-full"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isAdding}
          />
        </div>
        
        <div className="card-actions justify-end mt-4">
          <button
            onClick={handleAddSite}
            disabled={!url.trim() || isAdding}
            className="btn btn-primary btn-sm"
          >
            {isAdding ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Adding...
              </>
            ) : (
              "Add Site"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
