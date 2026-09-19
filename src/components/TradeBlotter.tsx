import React, { useState } from 'react';
import { TradeRecord } from '../types';
import { ASSET_REGISTRY } from '../data/assets';
import { Download, Search, Filter } from 'lucide-react';

interface Props {
  trades: TradeRecord[];
}

export const TradeBlotter: React.FC<Props> = ({ trades }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredTrades = trades.filter(trade => {
    const matchesSearch =
      trade.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.date.includes(searchTerm);

    const matchesType = filterType === 'ALL' || trade.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.max(1, Math.ceil(filteredTrades.length / pageSize));
  const displayedTrades = filteredTrades.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const exportCSV = () => {
    const headers = ['ID', 'Date', 'Asset', 'Type', 'Price', 'Shares', 'Notional', 'Fee', 'PnL', 'PnL%'];
    const rows = trades.map(t => [
      t.id,
      t.date,
      t.assetId,
      t.type,
      t.price,
      t.shares,
      t.notional,
      t.fee,
      t.pnl ?? '',
      t.pnlPct ? `${(t.pnlPct * 100).toFixed(2)}%` : '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `quantx_trade_blotter_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full quant-card p-5">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
        <div>
          <h4 className="text-sm font-semibold text-slate-200">
            Execution Trade Blotter
          </h4>
          <p className="text-xs text-slate-400">
            Total Executed Orders: <strong className="font-mono text-sky-400">{trades.length}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-xs">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search date or asset..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-slate-200 text-xs focus:outline-none w-36"
            />
          </div>

          {/* Filter Type */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
            {(['ALL', 'BUY', 'SELL'] as const).map(t => (
              <button
                key={t}
                onClick={() => {
                  setFilterType(t);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterType === t ? 'bg-sky-500/20 text-sky-400 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Trades Table */}
      {displayedTrades.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-500">
          No trade records match the current filter.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 font-mono text-[11px]">
                <th className="py-2.5 px-3">Trade ID</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Asset</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3 text-right">Execution Price</th>
                <th className="py-2.5 px-3 text-right">Shares / Units</th>
                <th className="py-2.5 px-3 text-right">Notional Value</th>
                <th className="py-2.5 px-3 text-right">Fee (10 bps)</th>
                <th className="py-2.5 px-3 text-right">Realized PnL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-mono">
              {displayedTrades.map(trade => {
                const info = ASSET_REGISTRY[trade.assetId];
                const isBuy = trade.type === 'BUY';
                const hasPnl = trade.pnl !== undefined;
                const isProfitable = (trade.pnl || 0) > 0;

                return (
                  <tr key={trade.id} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-3 text-slate-400 font-bold">{trade.id}</td>
                    <td className="py-2.5 px-3 text-slate-300">{trade.date}</td>
                    <td className="py-2.5 px-3 font-sans">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: info?.color }} />
                        <span className="font-semibold text-slate-200">{trade.assetId}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isBuy ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {trade.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-200">
                      ${trade.price.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400">
                      {trade.shares.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-200">
                      ${trade.notional.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500">
                      ${trade.fee.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {hasPnl ? (
                        <span
                          className={`font-semibold ${
                            isProfitable ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isProfitable ? '+' : ''}${trade.pnl?.toFixed(2)} ({isProfitable ? '+' : ''}
                          {((trade.pnlPct || 0) * 100).toFixed(1)}%)
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredTrades.length)} of {filteredTrades.length} trades
          </span>
          <div className="flex items-center gap-1 font-mono">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 hover:bg-slate-800"
            >
              Prev
            </button>
            <span className="px-2 py-1 text-slate-200">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 hover:bg-slate-800"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
