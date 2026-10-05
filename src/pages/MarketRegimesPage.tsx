import React from 'react';
import { useQuant } from '../context/QuantContext';
import { EmptyStateWarning } from '../components/EmptyStateWarning';
import { RegimeTimelineChart } from '../components/charts/RegimeTimelineChart';

export const MarketRegimesPage: React.FC = () => {
  const { selectedAssets, regimesMap } = useQuant();

  if (selectedAssets.length === 0) {
    return <EmptyStateWarning />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="quant-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#D4AF37]/25 bg-gradient-to-r from-[#111111] via-[#14120c] to-[#111111]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#D4AF37]/15 text-[#FFD700] border border-[#D4AF37]/30">
              Macro Regime Classifier
            </span>
            <span className="text-xs text-[#A39985] font-mono">
              {selectedAssets.length} Selected Assets
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            Rule-Based Market Regime Modeling
          </h2>
          <p className="text-xs text-[#A39985] mt-0.5">
            Transparent four-state market segmentation: Bull, Bear, High Volatility, and Low Volatility.
          </p>
        </div>
      </div>

      {/* Rule Definition Reference Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="quant-card p-3.5 border-l-4 border-l-emerald-500 border border-[#222222] bg-[#111111]">
          <div className="text-xs font-bold text-emerald-400 uppercase">Bull Market</div>
          <div className="text-[11px] text-[#F5E6C8] font-mono mt-1">
            Price ≥ SMA 200 & 20D Momentum &gt; 0
          </div>
          <p className="text-[10px] text-[#A39985] mt-1">
            Sustained positive trend regime with institutional momentum.
          </p>
        </div>

        <div className="quant-card p-3.5 border-l-4 border-l-rose-500 border border-[#222222] bg-[#111111]">
          <div className="text-xs font-bold text-rose-400 uppercase">Bear Market</div>
          <div className="text-[11px] text-[#F5E6C8] font-mono mt-1">
            Price &lt; SMA 200 & 20D Momentum &lt; 0
          </div>
          <p className="text-[10px] text-[#A39985] mt-1">
            Macro downtrend regime with capital flight and weakness.
          </p>
        </div>

        <div className="quant-card p-3.5 border-l-4 border-l-amber-500 border border-[#222222] bg-[#111111]">
          <div className="text-xs font-bold text-amber-400 uppercase">High Volatility</div>
          <div className="text-[11px] text-[#F5E6C8] font-mono mt-1">
            Realized 20D Vol ≥ 75th Percentile
          </div>
          <p className="text-[10px] text-[#A39985] mt-1">
            Turbulent macro stress, large directional swings, tail risk.
          </p>
        </div>

        <div className="quant-card p-3.5 border-l-4 border-l-teal-500 border border-[#222222] bg-[#111111]">
          <div className="text-xs font-bold text-teal-400 uppercase">Low Volatility</div>
          <div className="text-[11px] text-[#F5E6C8] font-mono mt-1">
            Realized 20D Vol ≤ 25th Percentile
          </div>
          <p className="text-[10px] text-[#A39985] mt-1">
            Consolidation, ranging price action, and trend compression.
          </p>
        </div>
      </div>

      {/* Regime Cards for Selected Assets */}
      <div className="space-y-6">
        {selectedAssets.map(assetId => {
          const analysis = regimesMap[assetId];
          if (!analysis) return null;
          return <RegimeTimelineChart key={assetId} analysis={analysis} />;
        })}
      </div>
    </div>
  );
};

