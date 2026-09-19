import React, { useState } from 'react';
import './ChartSetup';
import { Line, Bar } from 'react-chartjs-2';
import { AssetId, OHLCV } from '../../types';
import { ASSET_REGISTRY } from '../../data/assets';
import { calculateEMA, calculateSMA } from '../../engine/quantMath';

interface Props {
  assetId: AssetId;
  candles: OHLCV[];
  height?: number;
}

export const PriceCandleChart: React.FC<Props> = ({ assetId, candles, height = 340 }) => {
  const info = ASSET_REGISTRY[assetId];
  const [showSMA20, setShowSMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(true);
  const [showSMA200, setShowSMA200] = useState(false);
  const [showEMA12, setShowEMA12] = useState(false);

  if (!candles || candles.length === 0) return null;

  const dates = candles.map(c => c.date);
  const closes = candles.map(c => c.close);
  const volumes = candles.map(c => c.volume);

  const sma20 = showSMA20 ? calculateSMA(closes, 20) : [];
  const sma50 = showSMA50 ? calculateSMA(closes, 50) : [];
  const sma200 = showSMA200 ? calculateSMA(closes, 200) : [];
  const ema12 = showEMA12 ? calculateEMA(closes, 12) : [];

  // Downsample for clean display if many candles
  const step = Math.max(1, Math.floor(dates.length / 250));
  const sampledDates = dates.filter((_, i) => i % step === 0 || i === dates.length - 1);
  const sampledCloses = closes.filter((_, i) => i % step === 0 || i === closes.length - 1);

  const datasets: any[] = [
    {
      label: `${info?.name || assetId} Price`,
      data: sampledCloses,
      borderColor: info?.color || '#38bdf8',
      backgroundColor: `${info?.color || '#38bdf8'}10`,
      fill: true,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0.1,
      yAxisID: 'y',
    },
  ];

  if (showSMA20) {
    datasets.push({
      label: 'SMA 20',
      data: sma20.filter((_, i) => i % step === 0 || i === sma20.length - 1),
      borderColor: '#38bdf8',
      borderWidth: 1.5,
      borderDash: [3, 3],
      pointRadius: 0,
      fill: false,
      tension: 0.1,
      yAxisID: 'y',
    });
  }

  if (showSMA50) {
    datasets.push({
      label: 'SMA 50',
      data: sma50.filter((_, i) => i % step === 0 || i === sma50.length - 1),
      borderColor: '#eab308',
      borderWidth: 1.5,
      pointRadius: 0,
      fill: false,
      tension: 0.1,
      yAxisID: 'y',
    });
  }

  if (showSMA200) {
    datasets.push({
      label: 'SMA 200',
      data: sma200.filter((_, i) => i % step === 0 || i === sma200.length - 1),
      borderColor: '#ec4899',
      borderWidth: 1.5,
      pointRadius: 0,
      fill: false,
      tension: 0.1,
      yAxisID: 'y',
    });
  }

  if (showEMA12) {
    datasets.push({
      label: 'EMA 12',
      data: ema12.filter((_, i) => i % step === 0 || i === ema12.length - 1),
      borderColor: '#a855f7',
      borderWidth: 1.5,
      pointRadius: 0,
      fill: false,
      tension: 0.1,
      yAxisID: 'y',
    });
  }

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          font: { size: 10 },
          color: '#94a3b8',
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ${context.dataset.label}: $${Number(context.parsed.y).toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          maxTicksLimit: 7,
          font: { size: 10, family: "'JetBrains Mono', monospace" },
        },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: {
          callback: (value: any) => `$${Number(value).toLocaleString()}`,
          font: { size: 10, family: "'JetBrains Mono', monospace" },
        },
      },
    },
  };

  return (
    <div className="w-full">
      {/* Indicator Toggles Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            {info?.name} Price Action
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            {info?.exchange}
          </span>
        </div>

        {/* Indicator Checkboxes */}
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-slate-500 font-medium">Overlays:</span>
          <button
            onClick={() => setShowSMA20(!showSMA20)}
            className={`px-2 py-0.5 rounded border transition-colors ${
              showSMA20 ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-medium' : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            SMA 20
          </button>
          <button
            onClick={() => setShowSMA50(!showSMA50)}
            className={`px-2 py-0.5 rounded border transition-colors ${
              showSMA50 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-medium' : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            SMA 50
          </button>
          <button
            onClick={() => setShowSMA200(!showSMA200)}
            className={`px-2 py-0.5 rounded border transition-colors ${
              showSMA200 ? 'bg-pink-500/20 text-pink-300 border-pink-500/40 font-medium' : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            SMA 200
          </button>
          <button
            onClick={() => setShowEMA12(!showEMA12)}
            className={`px-2 py-0.5 rounded border transition-colors ${
              showEMA12 ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-medium' : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            EMA 12
          </button>
        </div>
      </div>

      <div style={{ height }}>
        <Line data={{ labels: sampledDates, datasets }} options={options} />
      </div>
    </div>
  );
};
