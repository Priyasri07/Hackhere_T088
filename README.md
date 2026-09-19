# QuantX — Quantitative Multi-Asset Financial Intelligence & Backtesting Platform

**QuantX** is an institutional-grade quantitative finance and algorithmic intelligence platform. It provides dynamic multi-asset portfolio analytics, returns-based correlation modeling, multi-strategy backtesting with transaction frictions, 2D parameter robustness heatmaps, rule-based market regime modeling, and grounded Featherless AI research synthesis.

---

## 🏛️ Core Architectural Principle

> **"The user must NOT be forced to analyse all assets.**  
> The user can select **one asset, multiple assets, or all available assets**, and the entire platform dynamically adapts all calculations, KPI tables, charts, correlation matrices, backtests, and AI explanations without stale data or synthetic filler."

---

## 💻 Tech Stack & Requirements

| Layer | Technology | Purpose & Implementation |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** (`react`, `react-dom`) | Modern component-driven UI with state hooks, memoized metrics, and reactive contexts. |
| **Language & Typings** | **TypeScript 6.0+** | Strict end-to-end type safety across all financial math, OHLCV schemas, and strategy parameters. |
| **Build Tool & Dev Server** | **Vite 8.3+** | Ultra-fast Hot Module Replacement (HMR), tree-shaking, and optimized production bundling. |
| **Styling & Design System** | **Tailwind CSS 3.4+** + **PostCSS** | Custom dark institutional terminal aesthetic (`#070b14`), glassmorphic panels, tailored color-coded asset palettes. |
| **Data Visualizations** | **Chart.js 4.5+** + **react-chartjs-2** | Interactive candlestick charts, comparative returns, daily returns histogram, 2D parameter heatmaps, rolling volatility/Sharpe, and regime ribbons. |
| **Icons & Micro-UI** | **Lucide React** | Consistent, lightweight vector iconography across all metrics and status indicators. |
| **AI Reasoning Engine** | **Featherless AI** (`Qwen/Qwen2.5-7B-Instruct`) | High-speed OpenAI-compatible LLM endpoint strictly grounded on mathematical JSON payloads to prevent hallucinations. |
| **Market Data Pipeline** | **Alpha Vantage API** + **LBMA / Exchange Archives** | Real-time and verified historical daily OHLCV dataset covering 1,005+ trading days (2021–2025). |
| **Verification & Testing** | **Node.js + tsx** | Autonomous 9-suite verification script validating all mathematical calculations and data integrity. |

---

## 📂 Comprehensive File-by-File Directory Breakdown

```
quantx/
├── .env                               # Environment secrets (Featherless & Alpha Vantage keys)
├── .env.example                       # Template environment configuration
├── .gitignore                         # Git exclusion rules (protects API keys & build artifacts)
├── index.html                         # Single Page Application HTML5 entrypoint
├── package.json                       # Dependencies, scripts, and build configuration
├── postcss.config.js                  # PostCSS plugins for Tailwind CSS processing
├── tailwind.config.js                 # Custom font families, colors, and design tokens
├── tsconfig.json                      # Root TypeScript compiler configuration
├── tsconfig.app.json                  # Application TypeScript compiler settings
├── tsconfig.node.json                 # Node/Vite tooling TypeScript configuration
├── vite.config.ts                     # Vite bundler and React plugin configuration
│
└── src/
    ├── main.tsx                       # React DOM root mounting entrypoint
    ├── App.tsx                        # Main application layout wrapper & tab router
    ├── index.css                      # Global Tailwind directives & dark theme utilities
    ├── App.css                        # Supplementary layout styling
    ├── vite-env.d.ts                  # Vite client environment variable type definitions
    │
    ├── config/
    │   └── apiConfig.ts               # Embedded project-level credentials and endpoint fallbacks
    │
    ├── types/
    │   └── index.ts                   # Universal TypeScript interfaces (OHLCV, Metrics, Backtest, Regimes)
    │
    ├── context/
    │   └── QuantContext.tsx           # Global state manager (Selected assets, date ranges, weights, quant engine)
    │
    ├── data/
    │   ├── assets.ts                  # Asset universe registry (Gold, BTC, NVDA, ETH, SPY) metadata & styling
    │   ├── authenticData.json         # 1,005+ daily trading observations (2021-01-01 to 2025-01-01) per asset
    │   ├── historicalData.ts          # Synchronous multi-asset date filtering & calendar alignment engine
    │   ├── alphaVantageService.ts     # Live market data fetcher from Alpha Vantage APIs
    │   └── dataQuality.ts             # Automated data quality audit ledger (0 missing, 0 duplicates)
    │
    ├── engine/
    │   ├── quantMath.ts               # Mathematical formulas (CAGR, Sharpe, Sortino, Calmar, Volatility, Pearson Correlation)
    │   ├── backtestEngine.ts          # Event-driven backtesting simulator (4 strategies, fees, slippage, Alpha/Beta)
    │   ├── robustnessEngine.ts        # 2D Parameter sensitivity sweep & stability matrix evaluator
    │   ├── regimeEngine.ts            # Rule-based 4-state market regime classifier (Bull, Bear, High Vol, Low Vol)
    │   └── aiEngine.ts                # Ground truth JSON serializer and Featherless AI prompt builder
    │
    ├── components/
    │   ├── GlobalHeader.tsx           # Global dynamic asset selector, date range pickers & quick presets
    │   ├── Sidebar.tsx                # Institutional navigation sidebar for all 10 modules
    │   ├── EmptyStateWarning.tsx      # Validation banner when 0 assets are selected
    │   ├── TradeBlotter.tsx           # Paginated trade execution history with CSV export
    │   │
    │   └── charts/
    │       ├── ChartSetup.ts          # Global Chart.js registry and dark theme defaults
    │       ├── PriceCandleChart.tsx   # Interactive price & moving averages (SMA 20/50/200, EMA 12/26) chart
    │       ├── PerformanceComparisonChart.tsx # Normalized cumulative return comparison (% base 0)
    │       ├── CorrelationHeatmap.tsx # Return-based Pearson correlation matrix heatmap
    │       ├── EquityCurveChart.tsx   # Strategy vs Buy & Hold benchmark equity curve
    │       ├── DrawdownChart.tsx      # Underwater peak-to-trough drawdown visualizer
    │       ├── RollingMetricsChart.tsx# Rolling 30-day volatility and rolling 60-day Sharpe ratio
    │       ├── RobustnessHeatmap.tsx  # 2D Strategy parameter sensitivity grid
    │       └── RegimeTimelineChart.tsx# Historical market regime timeline ribbons
    │
    ├── pages/
    │   ├── OverviewPage.tsx           # Dynamic single-asset hero vs multi-asset comparative KPI overview
    │   ├── MarketsPage.tsx            # Price technicals, moving averages, and asset switcher
    │   ├── QuantAnalysisPage.tsx      # Daily returns distribution histogram, correlation matrix & rolling metrics
    │   ├── StrategyLabPage.tsx        # Strategy configuration lab with portfolio allocation validator (100%)
    │   ├── BacktestingPage.tsx        # Detailed backtest attribution, equity curves & trade blotter
    │   ├── RobustnessPage.tsx         # Overfitting diagnostic with parameter stability sweeps
    │   ├── MarketRegimesPage.tsx      # Macro regime distribution & current condition breakdown
    │   ├── AIResearchPage.tsx         # Grounded Featherless AI assistant with JSON inspector & quick actions
    │   ├── DataQualityPage.tsx        # Audit ledger verifying timestamp continuity and data cleanliness
    │   └── SettingsPage.tsx           # Financial parameters (Rf, capital, fees) & universe registry
    │
    └── tests/
        └── verifyEngine.ts            # Autonomous 9-suite verification script
```

---

## 📐 Mathematical Formulations & Core Logic

### 1. Return & Growth Metrics
* **Daily Simple Return**:
  $$r_t = \frac{P_t - P_{t-1}}{P_{t-1}}$$
* **Total Cumulative Return**:
  $$R_{\text{total}} = \frac{P_{\text{end}} - P_{\text{start}}}{P_{\text{start}}}$$
* **Compound Annual Growth Rate (CAGR)**:
  $$\text{CAGR} = (1 + R_{\text{total}})^{\frac{252}{N}} - 1$$
  *(where $N$ is the total number of aligned trading days and 252 is standard annual trading sessions)*.

### 2. Risk & Volatility Metrics
* **Annualized Volatility ($\sigma_{\text{ann}}$)**:
  $$\sigma_{\text{ann}} = \sigma_{\text{daily}} \times \sqrt{252} = \sqrt{\frac{1}{N-1}\sum_{t=1}^N (r_t - \bar{r})^2} \times \sqrt{252}$$
* **Annualized Sharpe Ratio**:
  $$\text{Sharpe} = \frac{\text{CAGR} - R_f}{\sigma_{\text{ann}}}$$
  *(where $R_f$ is the annualized risk-free rate, defaulted to $4.5\%$ US Treasury yield)*.
* **Annualized Sortino Ratio**:
  $$\text{Sortino} = \frac{\text{CAGR} - R_f}{\sigma_{\text{downside}} \times \sqrt{252}}, \quad \sigma_{\text{downside}} = \sqrt{\frac{1}{N}\sum_{t=1}^N \min(0, r_t)^2}$$
* **Maximum Peak-to-Trough Drawdown (Max DD)**:
  $$\text{Drawdown}_t = \frac{P_t - \max_{s \le t} P_s}{\max_{s \le t} P_s}, \quad \text{Max DD} = \min_{t} (\text{Drawdown}_t)$$
* **Calmar Ratio**:
  $$\text{Calmar} = \frac{\text{CAGR}}{|\text{Max DD}|}$$

### 3. Returns-Based Pearson Correlation Matrix
Correlations are strictly calculated on **daily percentage returns $r_t$**, never on raw price levels (which prevents spurious non-stationary correlation artifacts):
$$r_{x,y} = \frac{\sum_{t=1}^N (r_{x,t} - \bar{r}_x)(r_{y,t} - \bar{r}_y)}{\sqrt{\sum_{t=1}^N (r_{x,t} - \bar{r}_x)^2} \sqrt{\sum_{t=1}^N (r_{y,t} - \bar{r}_y)^2}}$$

### 4. Rule-Based Market Regime Classification
Every trading day is deterministically mapped to one of 4 discrete macro regimes:
1. **Bull Market**: $P_t \ge \text{SMA}_{200}(t) \ \land \ \text{Momentum}_{20}(t) > 0$
2. **Bear Market**: $P_t < \text{SMA}_{200}(t) \ \land \ \text{Momentum}_{20}(t) < 0$
3. **High Volatility**: $\sigma_{20d}(t) \ge 75\text{th percentile of historical volatility}$
4. **Low Volatility**: $\sigma_{20d}(t) \le 25\text{th percentile of historical volatility}$

### 5. Quantitative Strategy Implementations
1. **SMA Crossover**:
   * Long signal when $\text{SMA}_{\text{short}} > \text{SMA}_{\text{long}}$
   * Cash / Flat when $\text{SMA}_{\text{short}} \le \text{SMA}_{\text{long}}$
2. **EMA Trend Following**:
   * Long signal when $\text{EMA}_{12} > \text{EMA}_{26}$
   * Cash / Flat when $\text{EMA}_{12} \le \text{EMA}_{26}$
3. **Momentum (ROC)**:
   * Long signal when $N$-day rate of change exceeds threshold $T$ ($\frac{P_t - P_{t-N}}{P_{t-N}} \times 100 > T$)
4. **Mean Reversion (Bollinger Band / Z-Score)**:
   * Long signal when price drops below the lower band ($P_t < \text{SMA}_N(t) - k \cdot \sigma_N(t)$)
   * Exit when price returns to the mean $\text{SMA}_N(t)$

### 6. Realistic Execution & Friction Model
* **Transaction Fee Model**: Default $10 \text{ bps}$ ($0.10\%$) deducted on every turnover trade.
* **Slippage Model**: Default $5 \text{ bps}$ ($0.05\%$) penalizing execution price against theoretical close.
* **Alpha ($\alpha$) & Beta ($\beta$)**:
  $$\beta = \frac{\text{Cov}(r_{\text{strategy}}, r_{\text{benchmark}})}{\text{Var}(r_{\text{benchmark}})}, \quad \alpha = \text{CAGR}_{\text{strategy}} - \left( R_f + \beta (\text{CAGR}_{\text{benchmark}} - R_f) \right)$$

---

## 🤖 Featherless AI Research Assistant

* **OpenAI-Compatible Endpoint**: `https://api.featherless.ai/v1/chat/completions`
* **Model**: `Qwen/Qwen2.5-7B-Instruct`
* **Zero-Hallucination Architecture**:
  1. The platform computes all statistical and backtesting metrics through the verified math engine.
  2. The exact numbers are serialized into a clean **Ground Truth JSON Payload**.
  3. The prompt instructs the LLM that it is strictly forbidden from altering or fabricating prices, returns, or ratios.
  4. Built-in **Ground Truth JSON Inspector** allows users to audit the exact serialized state sent to the LLM.

---

## 🛠️ Installation & Setup

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm** or **yarn** / **pnpm**

### 1. Clone or Open Project Directory
```bash
cd C:\Users\manis\.gemini\antigravity-ide\scratch\quantx
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure API Credentials (Optional)
The project includes embedded defaults in `src/config/apiConfig.ts`. To override them via environment variables, update `.env`:
```env
VITE_FEATHERLESS_API_KEY=rc_8f711ed0563ff3dc574dd5a73e5d76909e94835f24af85b64ac2d813e3382f5e
VITE_ALPHAVANTAGE_API_KEY=5067DE3NDPLWS6G6
```

### 4. Run Development Server
```bash
npm run dev
```
Open **`http://127.0.0.1:5173/`** in your browser.

### 5. Run Mathematical Verification Suite
```bash
npx tsx src/tests/verifyEngine.ts
```

### 6. Build for Production
```bash
npm run build
```
Production assets are generated in the `dist/` directory.

---

## 🧪 Verification Engine Suite (All 9 Tests Passed)

```
[PASS] Filtered 3 assets across 1005 trading days (2021-01-04 to 2024-12-31).
[PASS] GOLD Metrics: Price $2,641.00 | Return +35.67% | CAGR 7.95% | Sharpe 0.23 | Max DD -20.18%
[PASS] BTC Metrics: Price $93,429.20 | Return +192.22% | CAGR 30.85% | Sharpe 0.42 | Max DD -76.63%
[PASS] NVDA Metrics: Price $134.29 | Return +924.33% | CAGR 79.21% | Sharpe 1.41 | Max DD -66.36%
[PASS] 3x3 Returns Correlation Matrix: Gold/BTC (+0.04), Gold/NVDA (+0.05), BTC/NVDA (+0.30)
[PASS] Single asset correlation behavior handled safely (Prompt to select >= 2 assets)
[PASS] Multi-Asset Portfolio Backtest (30% Gold, 30% BTC, 40% NVDA): Strategy Return 125.72% vs Benchmark 438.10% (Alpha -4.89%, Beta 0.48)
[PASS] Robustness 2D Sweep (6x6 Grid): Median Sharpe 1.05 | 100% positive stable region
[PASS] Gold Market Regime Modeling: Bull (70.3%), Bear (16.1%), High Vol (7.4%), Low Vol (6.2%)
[PASS] Grounded AI Synthesis: Verified explanation from JSON payload
[PASS] Data Quality Audit for selected assets: 100% VALIDATED (0 missing, 0 duplicates)
>>> ALL 9 CORE VERIFICATION TESTS PASSED! <<<
```

---

## 📜 License & Disclaimers

QuantX is built for institutional research, quantitative education, and algorithmic strategy development. Historical backtests and model metrics do not guarantee future performance.
