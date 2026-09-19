import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import type {
  AssetId,
  AssetMetrics,
  AssetRegimeAnalysis,
  BacktestResult,
  CorrelationMatrixData,
  DataQualityAudit,
  OHLCV,
  RobustnessResult,
  RollingCorrelationSeries,
  StrategyParams
} from '../types';
import { DEFAULT_SELECTED_ASSETS } from '../data/assets';
import { getFilteredDataset } from '../data/historicalData';
import {
  computeAssetMetrics,
  computeCorrelationMatrix,
  computeRollingCorrelations
} from '../engine/quantMath';
import { runBacktest } from '../engine/backtestEngine';
import { runRobustnessSweep } from '../engine/robustnessEngine';
import { classifyAssetRegimes } from '../engine/regimeEngine';
import { auditDataQuality } from '../data/dataQuality';
import { PROJECT_CONFIG } from '../config/apiConfig';

export type NavigationTab =
  | 'overview'
  | 'markets'
  | 'quant'
  | 'strategy'
  | 'backtest'
  | 'robustness'
  | 'regimes'
  | 'ai'
  | 'data_quality'
  | 'settings';

interface QuantContextType {
  // Asset Selection
  selectedAssets: AssetId[];
  toggleAsset: (assetId: AssetId) => void;
  selectAllAssets: () => void;
  selectOnlyAsset: (assetId: AssetId) => void;
  setSelectedAssets: (assets: AssetId[]) => void;

  // Date Range
  startDate: string;
  endDate: string;
  setStartDate: (d: string) => void;
  setEndDate: (d: string) => void;
  setQuickDatePreset: (preset: '1Y' | '2Y' | '3Y' | '4Y' | 'ALL') => void;
  applyAnalysis: () => void;
  actualStartDate: string;
  actualEndDate: string;
  isDateAdjusted: boolean;

  // Navigation
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;

  // Portfolio Weights
  portfolioWeights: Record<AssetId, number>;
  setWeight: (assetId: AssetId, weight: number) => void;
  normalizeWeights: () => void;
  weightsValid: boolean;

  // Strategy & Backtest Parameters
  strategyParams: StrategyParams;
  setStrategyParams: React.Dispatch<React.SetStateAction<StrategyParams>>;
  backtestMode: 'PORTFOLIO' | 'INDIVIDUAL';
  setBacktestMode: (mode: 'PORTFOLIO' | 'INDIVIDUAL') => void;
  targetSingleAsset: AssetId;
  setTargetSingleAsset: (assetId: AssetId) => void;
  runBacktestSimulation: () => void;

  // Computed Quant State
  filteredCandles: Record<AssetId, OHLCV[]>;
  allDates: string[];
  metricsMap: Record<AssetId, AssetMetrics>;
  correlationData?: CorrelationMatrixData;
  rollingCorrelations: RollingCorrelationSeries[];
  backtestResult: BacktestResult | null;
  regimesMap: Record<AssetId, AssetRegimeAnalysis>;
  robustnessResult: RobustnessResult | null;
  dataQualityAudits: DataQualityAudit[];

  // Settings
  riskFreeRate: number;
  setRiskFreeRate: (r: number) => void;
  featherlessApiKey: string;
  setFeatherlessApiKey: (key: string) => void;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  alphaVantageApiKey: string;
  setAlphaVantageApiKey: (key: string) => void;
  defaultCapital: number;
  setDefaultCapital: (c: number) => void;
}

const QuantContext = createContext<QuantContextType | undefined>(undefined);

export const QuantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Global Asset Selection (Default: Gold, Bitcoin, NVIDIA)
  const [selectedAssets, setSelectedAssets] = useState<AssetId[]>(DEFAULT_SELECTED_ASSETS);

  // Date Range (Default: 2021-01-01 to 2025-01-01)
  const [startDate, setStartDate] = useState<string>('2021-01-01');
  const [endDate, setEndDate] = useState<string>('2025-01-01');
  const [appliedStartDate, setAppliedStartDate] = useState<string>('2021-01-01');
  const [appliedEndDate, setAppliedEndDate] = useState<string>('2025-01-01');

  // Navigation
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');

  // Portfolio Weights (Default calibrated: Gold 30%, BTC 30%, NVDA 40%)
  const [portfolioWeights, setPortfolioWeights] = useState<Record<AssetId, number>>({
    GOLD: 0.30,
    BTC: 0.30,
    NVDA: 0.40,
    ETH: 0.0,
    SPY: 0.0,
  });

  // Settings
  const [riskFreeRate, setRiskFreeRate] = useState<number>(0.045);
  const [defaultCapital, setDefaultCapital] = useState<number>(100000);
  const [featherlessApiKey, setFeatherlessApiKey] = useState<string>(() => {
    return (
      PROJECT_CONFIG.FEATHERLESS_API_KEY ||
      localStorage.getItem('quantx_featherless_api_key') ||
      ''
    );
  });
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return (
      localStorage.getItem('quantx_gemini_api_key') ||
      (import.meta.env.VITE_GEMINI_API_KEY as string) ||
      ''
    );
  });
  const [alphaVantageApiKey, setAlphaVantageApiKey] = useState<string>(() => {
    return (
      PROJECT_CONFIG.ALPHA_VANTAGE_API_KEY ||
      localStorage.getItem('quantx_alphavantage_api_key') ||
      ''
    );
  });

  useEffect(() => {
    if (featherlessApiKey) {
      localStorage.setItem('quantx_featherless_api_key', featherlessApiKey);
    }
  }, [featherlessApiKey]);

  useEffect(() => {
    if (geminiApiKey) {
      localStorage.setItem('quantx_gemini_api_key', geminiApiKey);
    }
  }, [geminiApiKey]);

  useEffect(() => {
    if (alphaVantageApiKey) {
      localStorage.setItem('quantx_alphavantage_api_key', alphaVantageApiKey);
    }
  }, [alphaVantageApiKey]);

  // Strategy & Backtest State
  const [strategyParams, setStrategyParams] = useState<StrategyParams>({
    type: 'SMA_CROSSOVER',
    shortWindow: 20,
    longWindow: 50,
    momentumLookback: 20,
    momentumThreshold: 1.5,
    mrWindow: 20,
    mrStdDev: 2.0,
    initialCapital: 100000,
    positionSize: 1.0,
    transactionCostBps: 10,
    slippageBps: 5,
    rebalanceFrequency: 'Daily',
  });

  const [backtestMode, setBacktestMode] = useState<'PORTFOLIO' | 'INDIVIDUAL'>('PORTFOLIO');
  const [targetSingleAsset, setTargetSingleAsset] = useState<AssetId>('GOLD');

  // Ensure targetSingleAsset is always valid
  useEffect(() => {
    if (selectedAssets.length > 0 && !selectedAssets.includes(targetSingleAsset)) {
      setTargetSingleAsset(selectedAssets[0]);
    }
  }, [selectedAssets, targetSingleAsset]);

  // Asset Toggling
  const toggleAsset = (assetId: AssetId) => {
    setSelectedAssets(prev => {
      if (prev.includes(assetId)) {
        return prev.filter(id => id !== assetId);
      } else {
        return [...prev, assetId];
      }
    });
  };

  const selectAllAssets = () => {
    setSelectedAssets(['GOLD', 'BTC', 'NVDA']);
  };

  const selectOnlyAsset = (assetId: AssetId) => {
    setSelectedAssets([assetId]);
  };

  // Date Quick Presets
  const setQuickDatePreset = (preset: '1Y' | '2Y' | '3Y' | '4Y' | 'ALL') => {
    const end = '2025-01-01';
    let start = '2021-01-01';
    switch (preset) {
      case '1Y':
        start = '2024-01-01';
        break;
      case '2Y':
        start = '2023-01-01';
        break;
      case '3Y':
        start = '2022-01-01';
        break;
      case '4Y':
      case 'ALL':
        start = '2021-01-01';
        break;
    }
    setStartDate(start);
    setEndDate(end);
    setAppliedStartDate(start);
    setAppliedEndDate(end);
  };

  const applyAnalysis = () => {
    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
  };

  // Weight Management
  const setWeight = (assetId: AssetId, weight: number) => {
    setPortfolioWeights(prev => ({
      ...prev,
      [assetId]: Math.max(0, Math.min(1, weight))
    }));
  };

  const normalizeWeights = () => {
    if (selectedAssets.length === 0) return;
    const equalW = 1 / selectedAssets.length;
    const newW: Record<AssetId, number> = { ...portfolioWeights };
    for (const a of selectedAssets) {
      newW[a] = Number(equalW.toFixed(4));
    }
    setPortfolioWeights(newW);
  };

  // Validate weights total to 100% (+/- 0.01 tolerance)
  const weightsValid = useMemo(() => {
    if (selectedAssets.length === 0) return false;
    if (selectedAssets.length === 1) return true;
    const sum = selectedAssets.reduce((acc, a) => acc + (portfolioWeights[a] || 0), 0);
    return Math.abs(sum - 1.0) <= 0.015;
  }, [selectedAssets, portfolioWeights]);

  // Reactive Data Extraction
  const datasetResult = useMemo(() => {
    return getFilteredDataset(selectedAssets, appliedStartDate, appliedEndDate);
  }, [selectedAssets, appliedStartDate, appliedEndDate]);

  const filteredCandles = datasetResult.data;
  const allDates = datasetResult.dates;
  const actualStartDate = datasetResult.actualStartDate;
  const actualEndDate = datasetResult.actualEndDate;
  const isDateAdjusted = datasetResult.adjustedStart || datasetResult.adjustedEnd;

  // Compute Metrics Map per Selected Asset
  const metricsMap = useMemo(() => {
    const map: Record<AssetId, AssetMetrics> = {} as any;
    for (const asset of selectedAssets) {
      const candles = filteredCandles[asset] || [];
      map[asset] = computeAssetMetrics(asset, candles, riskFreeRate);
    }
    return map;
  }, [selectedAssets, filteredCandles, riskFreeRate]);

  // Compute Correlation Matrix (Only if >= 2 assets)
  const correlationData = useMemo(() => {
    if (selectedAssets.length < 2) return undefined;
    return computeCorrelationMatrix(selectedAssets, filteredCandles);
  }, [selectedAssets, filteredCandles]);

  // Compute Rolling Correlations
  const rollingCorrelations = useMemo(() => {
    if (selectedAssets.length < 2) return [];
    return computeRollingCorrelations(selectedAssets, filteredCandles, 60);
  }, [selectedAssets, filteredCandles]);

  // Backtest Simulation Trigger & Result
  const [backtestTrigger, setBacktestTrigger] = useState(0);

  const runBacktestSimulation = () => {
    setBacktestTrigger(prev => prev + 1);
  };

  const backtestResult = useMemo(() => {
    if (selectedAssets.length === 0 || allDates.length === 0) return null;

    const assetsToRun = (backtestMode === 'INDIVIDUAL' || selectedAssets.length === 1)
      ? [targetSingleAsset || selectedAssets[0]]
      : selectedAssets;

    return runBacktest(
      assetsToRun,
      filteredCandles,
      strategyParams,
      portfolioWeights,
      riskFreeRate
    );
  }, [
    selectedAssets,
    filteredCandles,
    allDates,
    strategyParams,
    backtestMode,
    targetSingleAsset,
    portfolioWeights,
    riskFreeRate,
    backtestTrigger
  ]);

  // Market Regimes Map
  const regimesMap = useMemo(() => {
    const map: Record<AssetId, AssetRegimeAnalysis> = {} as any;
    for (const asset of selectedAssets) {
      const candles = filteredCandles[asset] || [];
      map[asset] = classifyAssetRegimes(asset, candles);
    }
    return map;
  }, [selectedAssets, filteredCandles]);

  // Robustness Result
  const robustnessResult = useMemo(() => {
    if (selectedAssets.length === 0 || allDates.length === 0) return null;
    const target = (backtestMode === 'INDIVIDUAL' || selectedAssets.length === 1)
      ? (targetSingleAsset || selectedAssets[0])
      : 'PORTFOLIO';

    return runRobustnessSweep(
      selectedAssets,
      filteredCandles,
      strategyParams.type,
      target,
      portfolioWeights
    );
  }, [
    selectedAssets,
    filteredCandles,
    allDates,
    strategyParams.type,
    backtestMode,
    targetSingleAsset,
    portfolioWeights
  ]);

  // Data Quality Audit
  const dataQualityAudits = useMemo(() => {
    return auditDataQuality(selectedAssets, filteredCandles, actualStartDate, actualEndDate);
  }, [selectedAssets, filteredCandles, actualStartDate, actualEndDate]);

  return (
    <QuantContext.Provider
      value={{
        selectedAssets,
        toggleAsset,
        selectAllAssets,
        selectOnlyAsset,
        setSelectedAssets,
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        setQuickDatePreset,
        applyAnalysis,
        actualStartDate,
        actualEndDate,
        isDateAdjusted,
        activeTab,
        setActiveTab,
        portfolioWeights,
        setWeight,
        normalizeWeights,
        weightsValid,
        strategyParams,
        setStrategyParams,
        backtestMode,
        setBacktestMode,
        targetSingleAsset,
        setTargetSingleAsset,
        runBacktestSimulation,
        filteredCandles,
        allDates,
        metricsMap,
        correlationData,
        rollingCorrelations,
        backtestResult,
        regimesMap,
        robustnessResult,
        dataQualityAudits,
        riskFreeRate,
        setRiskFreeRate,
        featherlessApiKey,
        setFeatherlessApiKey,
        geminiApiKey,
        setGeminiApiKey,
        alphaVantageApiKey,
        setAlphaVantageApiKey,
        defaultCapital,
        setDefaultCapital,
      }}
    >
      {children}
    </QuantContext.Provider>
  );
};

export function useQuant() {
  const context = useContext(QuantContext);
  if (!context) {
    throw new Error('useQuant must be used within a QuantProvider');
  }
  return context;
}
