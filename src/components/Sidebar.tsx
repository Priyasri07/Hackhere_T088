import React from 'react';
import { useQuant, NavigationTab } from '../context/QuantContext';
import { ASSET_REGISTRY } from '../data/assets';
import {
  LayoutDashboard,
  CandlestickChart,
  LineChart,
  FlaskConical,
  History,
  ShieldCheck,
  Compass,
  Sparkles,
  Database,
  Settings,
  Activity,
  Layers,
} from 'lucide-react';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'markets', label: 'Markets', icon: CandlestickChart },
  { id: 'quant', label: 'Quant Analysis', icon: LineChart },
  { id: 'strategy', label: 'Strategy Lab', icon: FlaskConical },
  { id: 'backtest', label: 'Backtesting', icon: History },
  { id: 'robustness', label: 'Robustness', icon: ShieldCheck },
  { id: 'regimes', label: 'Market Regimes', icon: Compass },
  { id: 'ai', label: 'AI Research', icon: Sparkles, badge: 'Featherless' },
  { id: 'data_quality', label: 'Data Quality', icon: Database },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, selectedAssets } = useQuant();

  return (
    <aside className="w-64 bg-[#0a0f1d] border-r border-white/10 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      {/* Top Branding */}
      <div>
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Activity className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="font-display font-extrabold tracking-tight text-lg text-white flex items-center gap-1">
                <span>QUANT</span>
                <span className="text-sky-400">X</span>
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                Multi-Asset Quant Engine
              </div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-sm shadow-sky-500/10 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Selection Status Pill */}
      <div className="p-4 border-t border-white/10 bg-[#070b14]/50">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            Active Universe
          </span>
          <span className="font-mono text-xs text-sky-400 font-bold">
            {selectedAssets.length} / 3
          </span>
        </div>

        {selectedAssets.length === 0 ? (
          <div className="text-[11px] text-rose-400 bg-rose-500/10 p-2 rounded border border-rose-500/20">
            No assets selected
          </div>
        ) : (
          <div className="space-y-1.5">
            {selectedAssets.map(assetId => {
              const info = ASSET_REGISTRY[assetId];
              return (
                <div
                  key={assetId}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded bg-slate-900/80 border border-slate-800/80 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shadow-sm"
                      style={{ backgroundColor: info?.color || '#38bdf8' }}
                    />
                    <span className="font-medium text-slate-200">{info?.name.split(' ')[0]}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{info?.symbol}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
