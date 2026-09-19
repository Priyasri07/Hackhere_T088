import React from 'react';
import { AssetRegimeAnalysis, MarketRegime } from '../../types';
import { ASSET_REGISTRY } from '../../data/assets';

interface Props {
  analysis: AssetRegimeAnalysis;
}

export const RegimeTimelineChart: React.FC<Props> = ({ analysis }) => {
  const info = ASSET_REGISTRY[analysis.assetId];
  const { timeline, regimeBreakdown, regimeReturns, currentRegime } = analysis;

  if (!timeline || timeline.length === 0) return null;

  const getRegimeColor = (regime: MarketRegime) => {
    switch (regime) {
      case 'Bull Market':
        return '#10b981'; // Emerald
      case 'Bear Market':
        return '#ef4444'; // Rose
      case 'High Volatility':
        return '#f59e0b'; // Amber
      case 'Low Volatility':
        return '#38bdf8'; // Cyan
    }
  };

  const getRegimeBadge = (regime: MarketRegime) => {
    switch (regime) {
      case 'Bull Market':
        return 'badge-bull';
      case 'Bear Market':
        return 'badge-bear';
      case 'High Volatility':
        return 'badge-high-vol';
      case 'Low Volatility':
        return 'badge-low-vol';
    }
  };

  return (
    <div className="quant-card p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: info?.color }}
          />
          <h4 className="text-sm font-semibold text-slate-200">
            {info?.name} Regime Modeling
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Current Status:</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getRegimeBadge(currentRegime)}`}>
            {currentRegime}
          </span>
        </div>
      </div>

      {/* Regime Timeline Color Strip */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
          <span>Historical Regime Timeline ({timeline[0]?.date} → {timeline[timeline.length - 1]?.date})</span>
          <span className="font-mono text-slate-500">{timeline.length} Trading Days</span>
        </div>

        <div className="h-6 w-full rounded-lg overflow-hidden flex shadow-inner bg-slate-900 border border-slate-800">
          {timeline.map((obs, idx) => (
            <div
              key={idx}
              className="h-full flex-1 hover:opacity-80 transition-opacity cursor-pointer"
              style={{ backgroundColor: getRegimeColor(obs.regime) }}
              title={`Date: ${obs.date}\nRegime: ${obs.regime}\nPrice: $${obs.price.toLocaleString()}\n200 SMA: $${obs.sma200.toLocaleString()}\n20D Vol: ${(
                obs.volatility20d * 100
              ).toFixed(1)}%`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Bull ({regimeBreakdown['Bull Market']}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-500" /> Bear ({regimeBreakdown['Bear Market']}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500" /> High Vol ({regimeBreakdown['High Volatility']}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-sky-500" /> Low Vol ({regimeBreakdown['Low Volatility']}%)
          </span>
        </div>
      </div>

      {/* Regime Conditional Performance Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500 font-mono text-[11px]">
              <th className="py-2 text-left">Regime State</th>
              <th className="py-2 text-center">Days</th>
              <th className="py-2 text-center">Distribution</th>
              <th className="py-2 text-right">Annualized Return</th>
              <th className="py-2 text-right">Annualized Vol</th>
              <th className="py-2 text-right">Sharpe Ratio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {(['Bull Market', 'Bear Market', 'High Volatility', 'Low Volatility'] as MarketRegime[]).map(reg => {
              const stat = regimeReturns[reg];
              const pct = regimeBreakdown[reg];

              return (
                <tr key={reg} className="hover:bg-slate-900/40">
                  <td className="py-2.5 flex items-center gap-2 font-sans font-medium text-slate-200">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getRegimeColor(reg) }} />
                    <span>{reg}</span>
                  </td>
                  <td className="py-2.5 text-center text-slate-400">{stat.daysCount}</td>
                  <td className="py-2.5 text-center text-slate-300">{pct}%</td>
                  <td className={`py-2.5 text-right font-semibold ${stat.annualizedReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {stat.annualizedReturn >= 0 ? '+' : ''}{(stat.annualizedReturn * 100).toFixed(1)}%
                  </td>
                  <td className="py-2.5 text-right text-slate-300">
                    {(stat.annualizedVol * 100).toFixed(1)}%
                  </td>
                  <td className="py-2.5 text-right font-bold text-sky-400">
                    {stat.sharpe}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
