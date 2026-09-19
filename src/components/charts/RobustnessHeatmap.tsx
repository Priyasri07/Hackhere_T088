import React, { useState } from 'react';
import { RobustnessResult } from '../../types';

interface Props {
  robustness: RobustnessResult;
}

export const RobustnessHeatmap: React.FC<Props> = ({ robustness }) => {
  const [metric, setMetric] = useState<'SHARPE' | 'CAGR' | 'MAX_DD'>('SHARPE');
  const { paramXName, paramYName, paramXValues, paramYValues, grid, summary } = robustness;

  // Function to color cells according to value
  const getCellColor = (point: any) => {
    if (metric === 'SHARPE') {
      const val = point.sharpe;
      if (val >= 1.5) return 'bg-emerald-500/50 text-white font-bold border-emerald-400/60';
      if (val >= 1.0) return 'bg-emerald-500/30 text-emerald-200 border-emerald-500/40';
      if (val >= 0.5) return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20';
      if (val >= 0.0) return 'bg-slate-800 text-slate-300 border-slate-700';
      if (val >= -0.5) return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      return 'bg-rose-500/30 text-rose-200 border-rose-500/40';
    } else if (metric === 'CAGR') {
      const val = point.cagr;
      if (val >= 0.35) return 'bg-sky-500/50 text-white font-bold border-sky-400';
      if (val >= 0.20) return 'bg-sky-500/30 text-sky-200 border-sky-500/40';
      if (val >= 0.10) return 'bg-sky-500/15 text-sky-300 border-sky-500/20';
      if (val >= 0.0) return 'bg-slate-800 text-slate-300 border-slate-700';
      return 'bg-rose-500/30 text-rose-200 border-rose-500/40';
    } else {
      // MAX_DD (lower/less negative is better)
      const val = Math.abs(point.maxDrawdown);
      if (val <= 0.15) return 'bg-emerald-500/30 text-emerald-200 border-emerald-500/40';
      if (val <= 0.25) return 'bg-slate-800 text-slate-300 border-slate-700';
      if (val <= 0.40) return 'bg-amber-500/25 text-amber-300 border-amber-500/30';
      return 'bg-rose-500/35 text-rose-200 border-rose-500/50 font-bold';
    }
  };

  const formatCellValue = (point: any) => {
    if (metric === 'SHARPE') return point.sharpe.toFixed(2);
    if (metric === 'CAGR') return `${(point.cagr * 100).toFixed(1)}%`;
    return `${(point.maxDrawdown * 100).toFixed(1)}%`;
  };

  return (
    <div className="w-full quant-card p-5">
      {/* Header and Metric Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
        <div>
          <h4 className="text-sm font-semibold text-slate-200">
            2D Parameter Sensitivity Heatmap
          </h4>
          <p className="text-xs text-slate-400">
            Sweeping <strong className="text-sky-300">{paramXName}</strong> vs <strong className="text-sky-300">{paramYName}</strong>
          </p>
        </div>

        {/* Metric Selector */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setMetric('SHARPE')}
            className={`px-3 py-1 rounded transition-colors ${
              metric === 'SHARPE' ? 'bg-sky-500/20 text-sky-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sharpe Ratio
          </button>
          <button
            onClick={() => setMetric('CAGR')}
            className={`px-3 py-1 rounded transition-colors ${
              metric === 'CAGR' ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            CAGR Return
          </button>
          <button
            onClick={() => setMetric('MAX_DD')}
            className={`px-3 py-1 rounded transition-colors ${
              metric === 'MAX_DD' ? 'bg-rose-500/20 text-rose-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Max Drawdown
          </button>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="p-2 text-left text-slate-500 font-mono text-[11px] min-w-[120px]">
                {paramYName} ↓ \ {paramXName} →
              </th>
              {paramXValues.map(x => (
                <th key={x} className="p-2 text-center font-mono font-semibold text-slate-300">
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paramYValues.map((yVal, yIdx) => (
              <tr key={yVal} className="border-t border-slate-800/60">
                <td className="p-2 font-mono font-semibold text-slate-300 bg-slate-900/40">
                  {yVal}
                </td>
                {paramXValues.map((xVal, xIdx) => {
                  const point = grid[yIdx]?.[xIdx];
                  if (!point) return <td key={xVal}>-</td>;

                  return (
                    <td key={xVal} className="p-1.5 text-center">
                      <div
                        className={`py-2 px-2.5 rounded-md border font-mono transition-all hover:scale-105 cursor-pointer ${getCellColor(
                          point
                        )}`}
                        title={`Param X (${paramXName}): ${xVal}\nParam Y (${paramYName}): ${yVal}\nSharpe: ${point.sharpe}\nCAGR: ${(
                          point.cagr * 100
                        ).toFixed(1)}%\nMax DD: ${(point.maxDrawdown * 100).toFixed(1)}%\nTrades: ${point.trades}`}
                      >
                        {formatCellValue(point)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary KPI Footnote */}
      <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Median Sharpe</div>
          <div className="text-sm font-mono font-bold text-sky-400 mt-0.5">{summary.medianSharpe}</div>
        </div>
        <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Sharpe Range (IQR)</div>
          <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
            {summary.p25Sharpe} → {summary.p75Sharpe}
          </div>
        </div>
        <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Median Max DD</div>
          <div className="text-sm font-mono font-bold text-rose-400 mt-0.5">
            {(summary.medianDrawdown * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Stable Zone %</div>
          <div className="text-sm font-mono font-bold text-purple-400 mt-0.5">
            {(summary.stableRegionPct * 100).toFixed(0)}% Positive
          </div>
        </div>
      </div>
    </div>
  );
};
