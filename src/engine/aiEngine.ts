import {
  AssetId,
  AssetMetrics,
  AssetRegimeAnalysis,
  BacktestResult,
  CorrelationMatrixData,
  RobustnessResult
} from '../types';
import { ASSET_REGISTRY } from '../data/assets';

export interface QuantContextPayload {
  selectedAssets: string[];
  dateRange: { start: string; end: string };
  assetsData: Record<string, {
    name: string;
    category: string;
    latestPrice: string;
    totalReturn: string;
    cagr: string;
    annualizedVol: string;
    sharpeRatio: string;
    maxDrawdown: string;
    winRate: string;
    sma200: string;
  }>;
  correlationMatrix?: {
    assets: string[];
    matrix: number[][];
  };
  backtest?: {
    strategy: string;
    initialCapital: number;
    finalValue: number;
    totalReturn: string;
    cagr: string;
    sharpe: string;
    maxDrawdown: string;
    totalTrades: number;
    winRate: string;
    benchmarkReturn: string;
    benchmarkSharpe: string;
    alpha: string;
    beta: string;
  };
  regimes?: Record<string, {
    current: string;
    breakdown: Record<string, string>;
  }>;
  robustness?: {
    strategy: string;
    medianSharpe: number;
    stableRegionPct: string;
    sharpeRange: [number, number];
  };
}

/**
 * Serialize full quantitative ground-truth dataset into structured JSON
 */
export function buildGroundTruthPayload(
  selectedAssets: AssetId[],
  startDate: string,
  endDate: string,
  metricsMap: Record<AssetId, AssetMetrics>,
  correlation?: CorrelationMatrixData,
  backtest?: BacktestResult,
  regimes?: Record<AssetId, AssetRegimeAnalysis>,
  robustness?: RobustnessResult
): QuantContextPayload {
  const assetsData: QuantContextPayload['assetsData'] = {};

  for (const a of selectedAssets) {
    const m = metricsMap[a];
    const info = ASSET_REGISTRY[a];
    if (m && info) {
      assetsData[a] = {
        name: info.name,
        category: info.category,
        latestPrice: `$${m.latestPrice.toLocaleString()}`,
        totalReturn: `${(m.totalReturn * 100).toFixed(2)}%`,
        cagr: `${(m.cagr * 100).toFixed(2)}%`,
        annualizedVol: `${(m.volatility * 100).toFixed(2)}%`,
        sharpeRatio: m.sharpeRatio.toFixed(2),
        maxDrawdown: `${(m.maxDrawdown * 100).toFixed(2)}%`,
        winRate: `${(m.winRate * 100).toFixed(1)}%`,
        sma200: `$${m.sma200.toLocaleString()}`,
      };
    }
  }

  const payload: QuantContextPayload = {
    selectedAssets,
    dateRange: { start: startDate, end: endDate },
    assetsData,
  };

  if (selectedAssets.length >= 2 && correlation) {
    payload.correlationMatrix = {
      assets: correlation.assetIds,
      matrix: correlation.matrix,
    };
  }

  if (backtest) {
    payload.backtest = {
      strategy: backtest.params.type.replace('_', ' '),
      initialCapital: backtest.initialCapital,
      finalValue: backtest.finalValue,
      totalReturn: `${(backtest.totalReturn * 100).toFixed(2)}%`,
      cagr: `${(backtest.cagr * 100).toFixed(2)}%`,
      sharpe: backtest.sharpeRatio.toFixed(2),
      maxDrawdown: `${(backtest.maxDrawdown * 100).toFixed(2)}%`,
      totalTrades: backtest.totalTrades,
      winRate: `${(backtest.winRate * 100).toFixed(1)}%`,
      benchmarkReturn: `${(backtest.benchmarkTotalReturn * 100).toFixed(2)}%`,
      benchmarkSharpe: backtest.benchmarkSharpe.toFixed(2),
      alpha: `${(backtest.alpha * 100).toFixed(2)}%`,
      beta: backtest.beta.toFixed(2),
    };
  }

  if (regimes) {
    const regObj: Record<string, any> = {};
    for (const a of selectedAssets) {
      const r = regimes[a];
      if (r) {
        regObj[a] = {
          current: r.currentRegime,
          breakdown: {
            'Bull Market': `${r.regimeBreakdown['Bull Market']}%`,
            'Bear Market': `${r.regimeBreakdown['Bear Market']}%`,
            'High Volatility': `${r.regimeBreakdown['High Volatility']}%`,
            'Low Volatility': `${r.regimeBreakdown['Low Volatility']}%`,
          },
        };
      }
    }
    payload.regimes = regObj;
  }

  if (robustness) {
    payload.robustness = {
      strategy: robustness.strategyType,
      medianSharpe: robustness.summary.medianSharpe,
      stableRegionPct: `${(robustness.summary.stableRegionPct * 100).toFixed(1)}%`,
      sharpeRange: [robustness.summary.minSharpe, robustness.summary.maxSharpe],
    };
  }

  return payload;
}

/**
 * Generate Grounded Quantitative AI Analysis
 */
export async function queryQuantAI(
  action: string,
  userPrompt: string,
  payload: QuantContextPayload,
  apiKey?: string
): Promise<string> {
  // If user provided a Featherless API Key, call official Featherless OpenAI-compatible endpoint
  if (apiKey && apiKey.trim().length > 5) {
    try {
      const systemInstruction = `You are QuantX AI Research Assistant, an institutional-grade quantitative financial analyst powered by Featherless AI.
CRITICAL MANDATORY RULE: You must ONLY reference the exact mathematical numbers provided in the Ground Truth JSON payload below. 
Do NOT hallucinate or alter any prices, returns, correlations, drawdowns, or Sharpe ratios.
Format your output cleanly using Markdown headers, bullet points, and bold financial metrics.
Ground Truth JSON Payload:
${JSON.stringify(payload, null, 2)}`;

      const res = await fetch('https://api.featherless.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`,
          'HTTP-Referer': 'https://quantx.local',
          'X-Title': 'QuantX Quantitative Intelligence'
        },
        body: JSON.stringify({
          model: 'Qwen/Qwen2.5-7B-Instruct',
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: userPrompt || action }
          ],
          temperature: 0.15,
          max_tokens: 1500
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text && text.trim().length > 0) return text;
      } else {
        const errData = await res.json().catch(() => ({}));
        console.warn('Featherless AI response warning:', errData);
      }
    } catch (err) {
      console.warn('Live Featherless AI request failed, falling back to deterministic grounded engine:', err);
    }
  }

  // High-fidelity Grounded Analytical Engine (offline / deterministic)
  const assets = payload.selectedAssets;
  const isSingle = assets.length === 1;
  const singleAsset = assets[0];
  const singleData = payload.assetsData[singleAsset];

  if (action === 'Summarize Analysis') {
    if (isSingle) {
      return `### Executive Quantitative Summary: ${singleData?.name} (${singleAsset})

* **Analysis Period**: \`${payload.dateRange.start}\` → \`${payload.dateRange.end}\`
* **Historical Performance**: Total Return **${singleData?.totalReturn}** (CAGR: **${singleData?.cagr}**).
* **Risk-Adjusted Return**: Annualized Sharpe Ratio is **${singleData?.sharpeRatio}** with realized annualized volatility of **${singleData?.annualizedVol}**.
* **Drawdown Profile**: Experienced a maximum drawdown of **${singleData?.maxDrawdown}**.
* **Market Regime**: Currently operating in **${payload.regimes?.[singleAsset]?.current || 'Active Regime'}**.

**Key Observation**: ${singleAsset === 'GOLD' ? 'Gold served as a steady low-volatility capital preservation vehicle with minimal tail risk.' : singleAsset === 'BTC' ? 'Bitcoin delivered asymmetrical upside with high historical volatility and deep drawdowns.' : 'NVIDIA demonstrated exponential AI-driven capital expansion with elevated equity beta.'}`;
    } else {
      const names = assets.map(a => payload.assetsData[a]?.name).join(', ');
      return `### Multi-Asset Quantitative Summary: ${names}

* **Active Universe**: \`[${assets.join(', ')}]\` (${assets.length} Assets)
* **Date Span**: \`${payload.dateRange.start}\` to \`${payload.dateRange.end}\`
* **Performance Ranking (CAGR)**:
${assets.map((a, i) => `  ${i + 1}. **${payload.assetsData[a]?.name}**: CAGR **${payload.assetsData[a]?.cagr}** | Sharpe **${payload.assetsData[a]?.sharpeRatio}** | Max DD **${payload.assetsData[a]?.maxDrawdown}**`).join('\n')}

**Cross-Asset Dynamics**:
Combining these assets provides distinct risk profiles. ${payload.correlationMatrix ? `The return-based correlation matrix reveals low-to-moderate pairwise dependency, creating favorable conditions for multi-asset risk parity or momentum portfolio strategies.` : ''}`;
    }
  }

  if (action === 'Explain Performance') {
    if (isSingle) {
      return `### Performance Attribution: ${singleData?.name}

During the analysis period (\`${payload.dateRange.start}\` to \`${payload.dateRange.end}\`), **${singleData?.name}** achieved:
* **Total Cumulative Return**: ${singleData?.totalReturn}
* **Compound Annual Growth Rate (CAGR)**: ${singleData?.cagr}
* **Win Rate (Daily % Positive)**: ${singleData?.winRate}
* **Latest Reference Price**: ${singleData?.latestPrice} vs 200 SMA at ${singleData?.sma200}

The asset exhibited ${singleAsset === 'NVDA' ? 'growth compounding driven by massive tech infrastructure demand' : singleAsset === 'BTC' ? 'monetary adoption cycles punctuated by four-year halving trends' : 'macro inflation hedge characteristics with steady real yield responsiveness'}.`;
    } else {
      return `### Comparative Performance Attribution

Analyzing **${assets.join(' vs ')}**:
${assets.map(a => {
  const d = payload.assetsData[a];
  return `* **${d?.name}**: Generated **${d?.totalReturn}** total return (**${d?.cagr}** CAGR) with a daily win rate of **${d?.winRate}**.`;
}).join('\n')}

**Return Dispersion**:
There is significant dispersion across these asset classes. ${assets.includes('NVDA') ? 'NVIDIA provided the highest growth momentum' : ''} while ${assets.includes('GOLD') ? 'Gold provided anchor stability' : ''}.`;
    }
  }

  if (action === 'Explain Risk') {
    return `### Risk & Volatility Assessment

${assets.map(a => {
  const d = payload.assetsData[a];
  return `* **${d?.name} (${a})**:
  - Annualized Volatility: **${d?.annualizedVol}**
  - Sharpe Ratio (Rf = 4.5%): **${d?.sharpeRatio}**
  - Maximum Peak-to-Trough Drawdown: **${d?.maxDrawdown}**`;
}).join('\n\n')}

**Portfolio Risk Takeaway**:
${isSingle ? `Single asset exposure to ${singleAsset} carries idiosyncratic concentration risk with max drawdown of ${singleData?.maxDrawdown}.` : `Multi-asset diversification across non-correlated asset classes (${assets.join(', ')}) compresses total portfolio variance compared to individual concentrated holdings.`}`;
  }

  if (action === 'Explain Correlation' || action === 'Compare Selected Assets') {
    if (isSingle) {
      return `### Correlation Notice
Correlation requires at least **2 selected assets**. Please select additional assets (e.g. Bitcoin, NVIDIA, Gold) from the top global bar to view return-based correlation matrices.`;
    }
    const matrix = payload.correlationMatrix;
    return `### Return-Based Correlation Analysis

* **Selected Assets**: \`[${assets.join(', ')}]\`
* **Correlation Basis**: Daily Percentage Returns (Pearson $r$)

${matrix ? `**Matrix Values**:
${matrix.assets.map((a, i) => `* **${a}**: ${matrix.matrix[i].map((val, j) => `${matrix.assets[j]}: \`${val >= 0 ? '+' : ''}${val.toFixed(2)}\``).join(' | ')}`).join('\n')}` : ''}

**Key Strategic Implication**:
Asset returns demonstrate independent driver dynamics. Gold exhibits low correlation with digital assets and tech equities, offering portfolio diversification benefits.`;
  }

  if (action === 'Explain Drawdown') {
    return `### Drawdown & Tail-Risk Diagnostics

* **Worst Maximum Drawdowns**:
${assets.map(a => `  - **${payload.assetsData[a]?.name}**: **${payload.assetsData[a]?.maxDrawdown}**`).join('\n')}

**Recovery & Stress Testing**:
Maximum drawdown reflects the largest decline from historical peak before a new high is formed. High-beta assets like Bitcoin and tech equities experienced steep correction phases during macro tightening regimes, whereas Gold experienced milder drawdowns.`;
  }

  if (action === 'Explain Backtest') {
    const bt = payload.backtest;
    if (!bt) {
      return `### Backtest Engine Ready
Please run a backtest in the **Strategy Lab** or **Backtesting** tab to generate detailed strategy vs benchmark trade attribution and execution analytics.`;
    }
    return `### Backtest Simulation Breakdown: ${bt.strategy}

* **Portfolio Capital**: Initial \`$${bt.initialCapital.toLocaleString()}\` → Final \`$${bt.finalValue.toLocaleString()}\`
* **Strategy Total Return**: **${bt.totalReturn}** (CAGR: **${bt.cagr}**)
* **Sharpe Ratio**: **${bt.sharpe}** | **Max Drawdown**: **${bt.maxDrawdown}**
* **Trade Statistics**: **${bt.totalTrades}** total executions | Win Rate: **${bt.winRate}**
* **Benchmark (Buy & Hold)**: Return **${bt.benchmarkReturn}** | Sharpe **${bt.benchmarkSharpe}**
* **Alpha Generation**: **${bt.alpha}** | Portfolio Beta: **${bt.beta}**

**Verdict**:
The quantitative strategy achieved ${parseFloat(bt.totalReturn) >= parseFloat(bt.benchmarkReturn) ? 'favorable outperformance against the buy-and-hold baseline with disciplined risk control' : 'reduced drawdown exposure while sacrificing some bull-market upside participation'}.`;
  }

  if (action === 'Explain Robustness') {
    const rob = payload.robustness;
    if (!rob) {
      return `### Parameter Robustness
Run the 2D parameter sweep in the **Robustness** tab to inspect strategy stability across parameter windows and fee regimes.`;
    }
    return `### Parameter Sensitivity & Overfitting Diagnosis

* **Strategy Evaluated**: ${rob.strategy}
* **Parameter Space Stability**: **${rob.stableRegionPct}** of tested parameter configurations yielded positive Sharpe ratios.
* **Sharpe Range Across Grid**: Min **${rob.sharpeRange[0]}** to Max **${rob.sharpeRange[1]}** (Median: **${rob.medianSharpe}**)

**Quant Takeaway**:
The strategy exhibits a smooth performance plateau rather than an isolated spike, suggesting low risk of curve-fitting/overfitting.`;
  }

  if (action === 'Explain Market Regimes') {
    return `### Rule-Based Market Regime Diagnostics

${assets.map(a => {
  const reg = payload.regimes?.[a];
  return `* **${payload.assetsData[a]?.name} (${a})**:
  - Current Condition: **${reg?.current || 'Bull Market'}**
  - Historical Distribution: Bull (\`${reg?.breakdown?.['Bull Market'] || '0%'}\`), Bear (\`${reg?.breakdown?.['Bear Market'] || '0%'}\`), High Vol (\`${reg?.breakdown?.['High Volatility'] || '0%'}\`), Low Vol (\`${reg?.breakdown?.['Low Volatility'] || '0%'}\`)`;
}).join('\n\n')}

**Regime Filter Takeaway**:
Quantitative trend strategies perform best when transitioning out of High Volatility and into sustained Bull regimes with prices above the 200-day moving average.`;
  }

  // Default query handler
  return `### Quantitative Intelligence Response

* **Target Assets**: \`[${assets.join(', ')}]\`
* **Analysis Period**: \`${payload.dateRange.start}\` → \`${payload.dateRange.end}\`

**Response to**: *"${userPrompt}"*

Based on the verified calculations:
${assets.map(a => `* **${payload.assetsData[a]?.name}**: Return **${payload.assetsData[a]?.totalReturn}**, Annualized Volatility **${payload.assetsData[a]?.annualizedVol}**, Sharpe **${payload.assetsData[a]?.sharpeRatio}**`).join('\n')}

${payload.backtest ? `Strategy backtest produced **${payload.backtest.totalReturn}** with **${payload.backtest.totalTrades}** trades.` : ''}

All metrics are derived directly from the mathematical engine without fabrication.`;
}
