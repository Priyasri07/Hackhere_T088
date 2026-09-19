import React, { useState } from 'react';
import { useQuant } from '../context/QuantContext';
import { ASSET_REGISTRY } from '../data/assets';
import type { AssetId, OHLCV } from '../types';
import { EmptyStateWarning } from '../components/EmptyStateWarning';
import { PerformanceComparisonChart } from '../components/charts/PerformanceComparisonChart';
import { CorrelationHeatmap } from '../components/charts/CorrelationHeatmap';
import { RollingMetricsChart } from '../components/charts/RollingMetricsChart';
import { calculateDailyReturns } from '../engine/quantMath';
import { Bar } from 'react-chartjs-2';
import '../components/charts/ChartSetup';
import {
  Sliders,
} from 'lucide-react';

export const QuantAnalysisPage: React.FC = () => {
  const { selectedAssets, filteredCandles, metricsMap, riskFreeRate, setRiskFreeRate } = useQuant();
  const [activeAssetForDist, setActiveAssetForDist] = useState<AssetId>(selectedAssets[0] || 'GOLD');

  if (selectedAssets.length === 0) {
    return <EmptyStateWarning />;
  }

  // Calculate return distribution histogram for active asset
  const targetAsset: AssetId = selectedAssets.includes(activeAssetForDist) ? activeAssetForDist : selectedAssets[0];
  const candles: OHLCV[] = filteredCandles[targetAsset] || [];
  const closes = candles.map((c: OHLCV) => c.close);
  const returns = calculateDailyReturns(closes).slice(1);

  // Bucket returns into bins from -5% to +5% in 0.5% steps
  const binEdges = [-0.05, -0.04, -0.03, -0.02, -0.01, -0.005, 0, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05];
  const binCounts = new Array(binEdges.length + 1).fill(0);

  for (const r of returns) {
    let placed = false;
    for (let b = 0; b < binEdges.length; b++) {
      if (r < binEdges[b]) {
        binCounts[b]++;
        placed = true;
        break;
      }
    }
    if (!placed) binCounts[binEdges.length]++;
  }

  const binLabels = [
    '< -5%',
    '-5% to -4%',
    '-4% to -3%',
    '-3% to -2%',
    '-2% to -1%',
    '-1% to -0.5%',
    '-0.5% to 0%',
    '0% to +0.5%',
    '+0.5% to +1%',
    '+1% to +2%',
    '+2% to +3%',
    '+3% to +4%',
    '+4% to +5%',
    '> +5%',
  ];

  const distributionChartData = {
    labels: binLabels,
    datasets: [
      {
        label: `${ASSET_REGISTRY[targetAsset]?.name || targetAsset} Daily Return Frequency`,
        data: binCounts,
        backgroundColor: binLabels.map((_, i) => (i < 7 ? 'rgba(239, 68, 68, 0.6)' : 'rgba(16, 185, 129, 0.6)')),
        borderColor: binLabels.map((_, i) => (i < 7 ? '#ef4444' : '#10b981')),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const distributionOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ${context.parsed.y} trading days (${((context.parsed.y / returns.length) * 100).toFixed(1)}%)`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 9, family: "'JetBrains Mono', monospace" } },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { font: { size: 10, family: "'JetBrains Mono', monospace" } },
      },
    },
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="quant-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30">
              Statistical Engine
            </span>
            <span className="text-xs text-slate-400">
              {selectedAssets.length} Selected Assets
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            Quantitative Risk & Statistical Attribution
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Return distributions, annualization, rolling volatility, Sharpe ratios, and return-based Pearson matrices.
          </p>
        </div>

        {/* Risk-Free Rate Config */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
          <Sliders className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-slate-400">Risk-Free Rate (Rf):</span>
          <select
            value={riskFreeRate}
            onChange={e => setRiskFreeRate(Number(e.target.value))}
            className="bg-transparent font-mono text-sky-300 font-bold focus:outline-none cursor-pointer"
          >
            <option value={0.03} className="bg-slate-900 text-slate-200">3.0% (Historic)</option>
            <option value={0.045} className="bg-slate-900 text-slate-200">4.5% (Fed Baseline)</option>
            <option value={0.0525} className="bg-slate-900 text-slate-200">5.25% (Peak Fed Funds)</option>
            <option value={0.0} className="bg-slate-900 text-slate-200">0.0% (Zero Rf)</option>
          </select>
        </div>
      </div>

      {/* Main Quantitative Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cumulative Performance Curves */}
        <div className="lg:col-span-2 quant-card p-5">
          <PerformanceComparisonChart height={300} />
        </div>

        {/* Correlation Heatmap (Adaptive 1 / 2 / 3 assets) */}
        <div className="quant-card p-5 flex flex-col justify-between">
          <CorrelationHeatmap />
        </div>
      </div>

      {/* Dynamic Rolling Analysis */}
      <div className="quant-card p-5">
        <RollingMetricsChart />
      </div>

      {/* Returns Distribution Histogram & Dispersion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 quant-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Daily Return Distribution Frequency
              </h4>
              <p className="text-[11px] text-slate-400">
                Gaussian normality & fat tail observation
              </p>
            </div>

            {/* Asset Selector for Histogram */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              {selectedAssets.map(id => {
                const info = ASSET_REGISTRY[id];
                const isActive = targetAsset === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveAssetForDist(id)}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      isActive ? 'bg-sky-500/20 text-sky-300 font-semibold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {info?.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ height: 240 }}>
            <Bar data={distributionChartData} options={distributionOptions} />
          </div>
        </div>

        {/* Statistical Summary Card */}
        <div className="quant-card p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Distribution Diagnostics ({ASSET_REGISTRY[targetAsset]?.name})
            </h4>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Total Observations:</span>
                <span className="font-bold text-slate-200">{returns.length} days</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Daily Positive Win Rate:</span>
                <span className="font-bold text-emerald-400">
                  {((metricsMap[targetAsset]?.winRate || 0) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Best 1-Day Return:</span>
                <span className="font-bold text-emerald-400">
                  +{((metricsMap[targetAsset]?.bestDay || 0) * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Worst 1-Day Return:</span>
                <span className="font-bold text-rose-400">
                  {((metricsMap[targetAsset]?.worstDay || 0) * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Calmar Ratio:</span>
                <span className="font-bold text-sky-400">
                  {metricsMap[targetAsset]?.calmarRatio.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Current Drawdown:</span>
                <span className="font-bold text-amber-400">
                  {((metricsMap[targetAsset]?.currentDrawdown || 0) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
            Calculated over active analysis window with exact trading session timestamps.
          </div>
        </div>
      </div>
    </div>
  );
};
