import React, { useState } from 'react';
import { useQuant } from '../context/QuantContext';
import { ASSET_REGISTRY } from '../data/assets';
import type { AssetId, StrategyType } from '../types';
import { EmptyStateWarning } from '../components/EmptyStateWarning';
import { RobustnessHeatmap } from '../components/charts/RobustnessHeatmap';
import {
  HelpCircle,
  Layers,
} from 'lucide-react';

export const RobustnessPage: React.FC = () => {
  const {
    selectedAssets,
    strategyParams,
    setStrategyParams,
    robustnessResult,
  } = useQuant();

  const [selectedTarget, setSelectedTarget] = useState<AssetId | 'PORTFOLIO'>('PORTFOLIO');

  if (selectedAssets.length === 0) {
    return <EmptyStateWarning />;
  }

  const isSingle = selectedAssets.length === 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="quant-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">
              Parameter Sensitivity Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Strategy: <strong>{strategyParams.type.replace('_', ' ')}</strong>
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            Strategy Parameter Robustness & Overfitting Audit
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            2D sensitivity matrix testing stability neighborhoods across window lookbacks and threshold bounds.
          </p>
        </div>

        {/* Strategy Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-lg text-xs">
          <span className="text-slate-400">Strategy:</span>
          <select
            value={strategyParams.type}
            onChange={e => setStrategyParams(p => ({ ...p, type: e.target.value as StrategyType }))}
            className="bg-transparent font-semibold text-sky-400 focus:outline-none cursor-pointer"
          >
            <option value="SMA_CROSSOVER" className="bg-slate-900 text-slate-200">SMA Crossover</option>
            <option value="EMA_TREND" className="bg-slate-900 text-slate-200">EMA Trend</option>
            <option value="MOMENTUM" className="bg-slate-900 text-slate-200">Momentum</option>
            <option value="MEAN_REVERSION" className="bg-slate-900 text-slate-200">Mean Reversion</option>
          </select>
        </div>
      </div>

      {/* Target Asset Selector if Multi-Asset */}
      {!isSingle && (
        <div className="quant-card p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              Sweep Target:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedTarget('PORTFOLIO')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedTarget === 'PORTFOLIO'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                Multi-Asset Portfolio
              </button>

              {selectedAssets.map(assetId => {
                const info = ASSET_REGISTRY[assetId];
                const isActive = selectedTarget === assetId;
                return (
                  <button
                    key={assetId}
                    onClick={() => setSelectedTarget(assetId)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-800 text-white border shadow-sm'
                        : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                    style={{
                      borderColor: isActive ? info?.color : undefined,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: info?.color }}
                    />
                    <span>{info?.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Testing 36 Parameter Combinations (6×6 Matrix)
          </div>
        </div>
      )}

      {/* 2D Heatmap Component */}
      {robustnessResult && <RobustnessHeatmap robustness={robustnessResult} />}

      {/* Philosophy Callout */}
      <div className="quant-card p-5 border-l-4 border-l-purple-500 bg-purple-500/5">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
              QuantX Overfitting & Parameter Stability Philosophy
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              We deliberately do not label a single isolated parameter combination as "best". In quantitative research, single parameter peaks often suffer from data snooping and curve fitting. The true objective is verifying whether the strategy exhibits a <strong>broad plateau of profitability and positive Sharpe ratios</strong> across neighboring parameters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
