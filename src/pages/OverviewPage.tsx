import React from 'react';
import { useQuant } from '../context/QuantContext';
import { ASSET_REGISTRY } from '../data/assets';
import { EmptyStateWarning } from '../components/EmptyStateWarning';
import { PerformanceComparisonChart } from '../components/charts/PerformanceComparisonChart';
import { PriceCandleChart } from '../components/charts/PriceCandleChart';
import { DrawdownChart } from '../components/charts/DrawdownChart';
import { CorrelationHeatmap } from '../components/charts/CorrelationHeatmap';
import {
  TrendingUp,
  Activity,
  ShieldAlert,
  Sparkles,
  DollarSign,
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const { selectedAssets, metricsMap, filteredCandles, setActiveTab } = useQuant();

  if (selectedAssets.length === 0) {
    return <EmptyStateWarning />;
  }

  const isSingleAsset = selectedAssets.length === 1;
  const singleAssetId = selectedAssets[0];
  const singleMetrics = metricsMap[singleAssetId];
  const singleInfo = ASSET_REGISTRY[singleAssetId];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Hero */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-[#0d1527] via-[#111c33] to-[#0d1527] p-6 rounded-2xl border border-white/10 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30">
              Quantitative Intelligence Dashboard
            </span>
            <span className="text-xs text-slate-400">
              {isSingleAsset ? 'Single Asset Deep Dive' : `Multi-Asset Portfolio Analysis (${selectedAssets.length} Assets)`}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            {isSingleAsset
              ? `${singleInfo?.name} Analysis Overview`
              : 'Multi-Asset Market & Quantitative Overview'}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {isSingleAsset
              ? `Real-time statistical breakdown, return distribution, drawdown profile, and strategy performance for ${singleInfo?.name}.`
              : 'Dynamic multi-asset performance matrix, cross-asset correlation, risk attribution, and portfolio optimization metrics.'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveTab('strategy')}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-sky-500/20 transition-all cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Launch Strategy Lab</span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Research</span>
          </button>
        </div>
      </div>

      {/* SECTION A: SINGLE ASSET VIEW */}
      {isSingleAsset && singleMetrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="quant-card p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Latest Spot Price</span>
                <DollarSign className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-xl lg:text-2xl font-bold text-white font-mono">
                ${singleMetrics.latestPrice.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-xs mt-1 font-mono">
                <span className={singleMetrics.dailyReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {singleMetrics.dailyReturn >= 0 ? '+' : ''}
                  {(singleMetrics.dailyReturn * 100).toFixed(2)}%
                </span>
                <span className="text-slate-500">1D Return</span>
              </div>
            </div>

            <div className="quant-card p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Total Return</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl lg:text-2xl font-bold text-emerald-400 font-mono">
                {singleMetrics.totalReturn >= 0 ? '+' : ''}
                {(singleMetrics.totalReturn * 100).toFixed(2)}%
              </div>
              <div className="text-xs text-slate-400 mt-1 font-mono">
                CAGR: <strong>{(singleMetrics.cagr * 100).toFixed(2)}%</strong>
              </div>
            </div>

            <div className="quant-card p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Annualized Volatility</span>
                <Activity className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl lg:text-2xl font-bold text-amber-400 font-mono">
                {(singleMetrics.volatility * 100).toFixed(2)}%
              </div>
              <div className="text-xs text-slate-400 mt-1 font-mono">
                Sharpe: <strong className="text-sky-400">{singleMetrics.sharpeRatio.toFixed(2)}</strong> (Rf 4.5%)
              </div>
            </div>

            <div className="quant-card p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Maximum Drawdown</span>
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-xl lg:text-2xl font-bold text-rose-400 font-mono">
                {(singleMetrics.maxDrawdown * 100).toFixed(2)}%
              </div>
              <div className="text-xs text-slate-400 mt-1 font-mono">
                Sortino: <strong className="text-slate-300">{singleMetrics.sortinoRatio.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <div className="quant-card p-5">
            <PriceCandleChart assetId={singleAssetId} candles={filteredCandles[singleAssetId] || []} height={340} />
          </div>

          <div className="quant-card p-5">
            <DrawdownChart height={220} />
          </div>
        </div>
      )}

      {/* SECTION B: MULTIPLE ASSETS VIEW */}
      {!isSingleAsset && (
        <div className="space-y-6">
          <div className="quant-card p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">
                  Selected Assets Quantitative Comparison
                </h3>
                <p className="text-xs text-slate-400">
                  Dynamic cross-asset statistical benchmarks
                </p>
              </div>
              <span className="text-[11px] font-mono text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded border border-sky-500/20">
                {selectedAssets.length} Active Columns
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="py-2.5 text-left font-semibold">Financial Metric</th>
                    {selectedAssets.map(id => {
                      const info = ASSET_REGISTRY[id];
                      return (
                        <th key={id} className="py-2.5 px-4 text-right font-semibold text-slate-200">
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: info?.color }} />
                            <span>{info?.name}</span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 font-sans font-medium text-slate-300">Latest Price</td>
                    {selectedAssets.map(id => (
                      <td key={id} className="py-3 px-4 text-right font-bold text-white">
                        ${metricsMap[id]?.latestPrice.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 font-sans font-medium text-slate-300">Total Return</td>
                    {selectedAssets.map(id => {
                      const ret = metricsMap[id]?.totalReturn || 0;
                      return (
                        <td
                          key={id}
                          className={`py-3 px-4 text-right font-bold ${
                            ret >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {ret >= 0 ? '+' : ''}
                          {(ret * 100).toFixed(2)}%
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 font-sans font-medium text-slate-300">Annualized Return (CAGR)</td>
                    {selectedAssets.map(id => {
                      const cagr = metricsMap[id]?.cagr || 0;
                      return (
                        <td
                          key={id}
                          className={`py-3 px-4 text-right font-semibold ${
                            cagr >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {cagr >= 0 ? '+' : ''}
                          {(cagr * 100).toFixed(2)}%
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 font-sans font-medium text-slate-300">Annualized Volatility</td>
                    {selectedAssets.map(id => (
                      <td key={id} className="py-3 px-4 text-right text-amber-400 font-semibold">
                        {((metricsMap[id]?.volatility || 0) * 100).toFixed(2)}%
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 font-sans font-medium text-slate-300">Sharpe Ratio (Rf 4.5%)</td>
                    {selectedAssets.map(id => (
                      <td key={id} className="py-3 px-4 text-right font-bold text-sky-400">
                        {metricsMap[id]?.sharpeRatio.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 font-sans font-medium text-slate-300">Sortino Ratio</td>
                    {selectedAssets.map(id => (
                      <td key={id} className="py-3 px-4 text-right text-slate-300">
                        {metricsMap[id]?.sortinoRatio.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 font-sans font-medium text-slate-300">Maximum Drawdown</td>
                    {selectedAssets.map(id => (
                      <td key={id} className="py-3 px-4 text-right font-bold text-rose-400">
                        {((metricsMap[id]?.maxDrawdown || 0) * 100).toFixed(2)}%
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 font-sans font-medium text-slate-300">Daily Win Rate</td>
                    {selectedAssets.map(id => (
                      <td key={id} className="py-3 px-4 text-right text-slate-300">
                        {((metricsMap[id]?.winRate || 0) * 100).toFixed(1)}%
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 quant-card p-5">
              <PerformanceComparisonChart height={320} />
            </div>

            <div className="quant-card p-5 flex flex-col justify-between">
              <CorrelationHeatmap />
            </div>
          </div>

          <div className="quant-card p-5">
            <DrawdownChart height={220} />
          </div>
        </div>
      )}
    </div>
  );
};
