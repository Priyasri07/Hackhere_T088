import React from 'react';
import { useQuant } from '../context/QuantContext';
import { ASSET_REGISTRY, AVAILABLE_ASSETS } from '../data/assets';
import { AssetId } from '../types';
import {
  Calendar,
  Layers,
  CheckSquare,
  Square,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  ChevronDown
} from 'lucide-react';

export const GlobalHeader: React.FC = () => {
  const {
    selectedAssets,
    toggleAsset,
    selectAllAssets,
    setSelectedAssets,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    setQuickDatePreset,
    applyAnalysis,
    actualStartDate,
    actualEndDate,
    isDateAdjusted,
  } = useQuant();

  const [showUniverseMenu, setShowUniverseMenu] = React.useState(false);

  // Check if primary initial assets are all selected
  const isAllPrimarySelected = ['GOLD', 'BTC', 'NVDA'].every(id => selectedAssets.includes(id as AssetId));

  return (
    <header className="sticky top-0 z-30 bg-[#080d1a]/95 backdrop-blur-md border-b border-white/10 px-4 lg:px-6 py-3">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        
        {/* Left: Global Asset Selection Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2.5 py-1.5 rounded-md border border-sky-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span>ANALYSE ASSETS</span>
            <span className="ml-1 px-1.5 py-0.2 bg-sky-500/30 text-sky-200 rounded text-[10px] font-mono font-bold">
              {selectedAssets.length} Active
            </span>
          </div>

          {/* Asset Checkbox Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {(['GOLD', 'BTC', 'NVDA'] as AssetId[]).map(assetId => {
              const info = ASSET_REGISTRY[assetId];
              const isSelected = selectedAssets.includes(assetId);

              return (
                <button
                  key={assetId}
                  onClick={() => toggleAsset(assetId)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-slate-800 text-white border shadow-sm'
                      : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-300'
                  }`}
                  style={{
                    borderColor: isSelected ? info.color : undefined,
                    boxShadow: isSelected ? `0 0 12px -3px ${info.color}40` : undefined
                  }}
                  title={info.description}
                >
                  {isSelected ? (
                    <CheckSquare className="w-3.5 h-3.5" style={{ color: info.color }} />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-500" />
                  )}
                  <span className="font-semibold">{info.name.split(' ')[0]}</span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: info.color }}
                  />
                </button>
              );
            })}

            {/* Additional Universe Dropdown (ETH, SPY) */}
            <div className="relative">
              <button
                onClick={() => setShowUniverseMenu(!showUniverseMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-600 transition-colors"
                title="Expand Asset Universe"
              >
                <span>+ More Assets</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showUniverseMenu && (
                <div className="absolute left-0 mt-1.5 w-52 bg-[#0d1527] border border-white/10 rounded-lg shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                    Extended Universe
                  </div>
                  {(['ETH', 'SPY'] as AssetId[]).map(assetId => {
                    const info = ASSET_REGISTRY[assetId];
                    const isSelected = selectedAssets.includes(assetId);
                    return (
                      <button
                        key={assetId}
                        onClick={() => {
                          toggleAsset(assetId);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs text-left hover:bg-slate-800/70 transition-colors text-slate-200"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: info.color }}
                          />
                          <span>{info.name}</span>
                        </div>
                        {isSelected && <span className="text-sky-400 text-xs font-bold">✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Universe Presets */}
            <div className="hidden md:flex items-center gap-1 border-l border-white/10 pl-2">
              <button
                onClick={selectAllAssets}
                className={`text-[11px] px-2 py-1 rounded transition-colors ${
                  isAllPrimarySelected ? 'text-sky-400 font-semibold bg-sky-500/10' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Select Gold, Bitcoin, and NVIDIA"
              >
                Select All 3
              </button>
              <button
                onClick={() => setSelectedAssets(['GOLD'])}
                className={`text-[11px] px-2 py-1 rounded transition-colors ${
                  selectedAssets.length === 1 && selectedAssets[0] === 'GOLD'
                    ? 'text-yellow-400 font-semibold bg-yellow-500/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Gold Only
              </button>
            </div>
          </div>
        </div>

        {/* Right: Date Range & Execution Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Quick Date Presets */}
          <div className="flex items-center bg-slate-900/80 p-0.5 rounded-lg border border-slate-800 text-[11px] font-medium text-slate-400">
            {(['1Y', '2Y', '3Y', 'ALL'] as const).map(p => (
              <button
                key={p}
                onClick={() => setQuickDatePreset(p === 'ALL' ? '4Y' : p)}
                className="px-2 py-1 rounded hover:text-white hover:bg-slate-800 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Date Pickers */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-lg text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <input
              type="date"
              value={startDate}
              min="2021-01-01"
              max="2024-12-30"
              onChange={e => setStartDate(e.target.value)}
              className="bg-transparent text-slate-200 font-mono text-xs focus:outline-none cursor-pointer"
            />
            <span className="text-slate-500 font-bold">→</span>
            <input
              type="date"
              value={endDate}
              min="2021-01-05"
              max="2025-01-01"
              onChange={e => setEndDate(e.target.value)}
              className="bg-transparent text-slate-200 font-mono text-xs focus:outline-none cursor-pointer"
            />
          </div>

          {/* Apply Button */}
          <button
            onClick={applyAnalysis}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-sky-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Apply Analysis</span>
          </button>
        </div>
      </div>

      {/* Date Adjustment Notice if dates fell on holidays or non-trading days */}
      {isDateAdjusted && selectedAssets.length > 0 && (
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-amber-400/90 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>
            Non-trading day observed. Analysis aligned to exact market observations: <strong className="font-mono text-amber-300">{actualStartDate}</strong> to <strong className="font-mono text-amber-300">{actualEndDate}</strong>.
          </span>
        </div>
      )}
    </header>
  );
};
