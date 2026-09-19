import type { AssetId, AssetInfo } from '../types';

export const ASSET_REGISTRY: Record<AssetId, AssetInfo> = {
  GOLD: {
    id: 'GOLD',
    name: 'Gold (Spot)',
    symbol: 'XAU/USD',
    category: 'Commodity',
    color: '#eab308', // Gold yellow
    lightColor: 'rgba(234, 179, 8, 0.15)',
    currency: 'USD',
    exchange: 'COMEX / LBMA',
    dataSource: 'Alpha Vantage (Commodities / LBMA Fix)',
    decimals: 2,
    description: 'Precious metal monetary reserve, inflation hedge, safe haven asset.',
    iconName: 'Coins'
  },
  BTC: {
    id: 'BTC',
    name: 'Bitcoin',
    symbol: 'BTC/USD',
    category: 'Crypto',
    color: '#f97316', // Orange
    lightColor: 'rgba(249, 115, 22, 0.15)',
    currency: 'USD',
    exchange: 'Coinbase / Binance',
    dataSource: 'Alpha Vantage (Digital Currency Daily)',
    decimals: 2,
    description: 'Decentralized digital currency, high beta store of value.',
    iconName: 'Bitcoin'
  },
  NVDA: {
    id: 'NVDA',
    name: 'NVIDIA Corporation',
    symbol: 'NVDA',
    category: 'Equity',
    color: '#10b981', // Emerald green
    lightColor: 'rgba(16, 185, 129, 0.15)',
    currency: 'USD',
    exchange: 'NASDAQ',
    dataSource: 'Alpha Vantage (Time Series Daily / Equity)',
    decimals: 2,
    description: 'Leading GPU and AI hardware/infrastructure computing titan.',
    iconName: 'Cpu'
  },
  ETH: {
    id: 'ETH',
    name: 'Ethereum',
    symbol: 'ETH/USD',
    category: 'Crypto',
    color: '#8b5cf6', // Violet
    lightColor: 'rgba(139, 92, 246, 0.15)',
    currency: 'USD',
    exchange: 'Coinbase / Kraken',
    dataSource: 'Alpha Vantage (Digital Currency Daily)',
    decimals: 2,
    description: 'Smart contract and decentralized application base protocol.',
    iconName: 'Zap'
  },
  SPY: {
    id: 'SPY',
    name: 'S&P 500 ETF Trust',
    symbol: 'SPY',
    category: 'Index',
    color: '#38bdf8', // Cyan
    lightColor: 'rgba(56, 189, 248, 0.15)',
    currency: 'USD',
    exchange: 'NYSE Arca',
    dataSource: 'Alpha Vantage (Time Series Daily / ETF)',
    decimals: 2,
    description: 'Broad benchmark equity index of 500 leading US corporations.',
    iconName: 'TrendingUp'
  }
};

export const DEFAULT_SELECTED_ASSETS: AssetId[] = ['GOLD', 'BTC', 'NVDA'];
export const AVAILABLE_ASSETS: AssetId[] = ['GOLD', 'BTC', 'NVDA', 'ETH', 'SPY'];
