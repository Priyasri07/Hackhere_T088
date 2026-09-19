import React from 'react';
import { useQuant } from '../context/QuantContext';
import { Layers, AlertCircle, Sparkles } from 'lucide-react';
import { ASSET_REGISTRY } from '../data/assets';
import { AssetId } from '../types';

export const EmptyStateWarning: React.FC = () => {
  const { toggleAsset, selectAllAssets } = useQuant();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
        <AlertCircle className="w-8 h-8" />
      </div>

      <h2 className="text-xl font-bold text-white mb-2 font-display">
        Please select at least one asset to continue.
      </h2>
      <p className="text-sm text-slate-400 max-w-md mb-6">
        QuantX is an asset-driven quantitative analytics system. Select one, two, or all assets from the global header or click below to launch immediate analysis.
      </p>

      {/* Quick Select Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {(['GOLD', 'BTC', 'NVDA'] as AssetId[]).map(assetId => {
          const info = ASSET_REGISTRY[assetId];
          return (
            <button
              key={assetId}
              onClick={() => toggleAsset(assetId)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-600 text-sm font-medium text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: info.color }}
              />
              <span>Select {info.name}</span>
            </button>
          );
        })}

        <button
          onClick={selectAllAssets}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-sm font-semibold text-white transition-all cursor-pointer shadow-lg shadow-sky-600/25"
        >
          <Sparkles className="w-4 h-4" />
          <span>Select All 3 Assets</span>
        </button>
      </div>
    </div>
  );
};
