import React, { useState, useRef, useEffect } from 'react';
import { useQuant } from '../context/QuantContext';
import { EmptyStateWarning } from '../components/EmptyStateWarning';
import { buildGroundTruthPayload, queryQuantAI } from '../engine/aiEngine';
import type { ChatMessage } from '../types';
import {
  Sparkles,
  Send,
  Code2,
  CheckCircle2,
  Bot,
  User,
  ArrowRight,
  Zap,
} from 'lucide-react';

export const AIResearchPage: React.FC = () => {
  const {
    selectedAssets,
    actualStartDate,
    actualEndDate,
    metricsMap,
    correlationData,
    backtestResult,
    regimesMap,
    robustnessResult,
    featherlessApiKey,
  } = useQuant();

  const isSingle = selectedAssets.length === 1;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      sender: 'assistant',
      content: `Hello! I am **QuantX AI Research Assistant**. 
I provide grounded qualitative synthesis and risk diagnosis strictly derived from the platform's verified mathematical engine.

**Current Active Universe**: \`[${selectedAssets.join(', ')}]\` (${actualStartDate} → ${actualEndDate}).

Select one of the Quick Actions below or type any qualitative question regarding your quantitative portfolio.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showJsonInspector, setShowJsonInspector] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (selectedAssets.length === 0) {
    return <EmptyStateWarning />;
  }

  // Build grounded JSON payload
  const currentPayload = buildGroundTruthPayload(
    selectedAssets,
    actualStartDate,
    actualEndDate,
    metricsMap,
    correlationData,
    backtestResult || undefined,
    regimesMap,
    robustnessResult || undefined
  );

  const handleSend = async (actionText?: string, promptText?: string) => {
    const query = promptText || inputQuery;
    const action = actionText || 'User Query';
    if (!query && !actionText) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: query || actionText || '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickAction: actionText,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const aiResponse = await queryQuantAI(action, query, currentPayload, featherlessApiKey);
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metricsPayload: currentPayload,
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        content: 'An error occurred while generating the quantitative explanation.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const QUICK_ACTIONS: { label: string; disabled?: boolean; tooltip?: string }[] = [
    { label: 'Summarize Analysis' },
    { label: 'Explain Performance' },
    { label: 'Explain Risk' },
    {
      label: 'Compare Selected Assets',
      disabled: isSingle,
      tooltip: isSingle ? 'Select at least 2 assets to enable comparison' : undefined,
    },
    {
      label: 'Explain Correlation',
      disabled: isSingle,
      tooltip: isSingle ? 'Select at least 2 assets to calculate correlation' : undefined,
    },
    { label: 'Explain Drawdown' },
    { label: 'Explain Backtest' },
    { label: 'Explain Robustness' },
    { label: 'Explain Market Regimes' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="quant-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Featherless AI Research Assistant
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Grounded on QuantX Calculations
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            Quantitative Research & Qualitative Explanation
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict ground-truth AI analysis: All metrics are derived from validated backend math without hallucinations.
          </p>
        </div>

        <button
          onClick={() => setShowJsonInspector(!showJsonInspector)}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
        >
          <Code2 className="w-3.5 h-3.5 text-sky-400" />
          <span>{showJsonInspector ? 'Hide Ground Truth JSON' : 'Inspect Ground Truth JSON'}</span>
        </button>
      </div>

      {showJsonInspector && (
        <div className="quant-card p-4 bg-[#070b14] border-sky-500/30 animate-in fade-in">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
            <div className="text-xs font-semibold text-sky-400 font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Grounded Truth JSON Payload Sent to LLM
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              {Object.keys(currentPayload.assetsData).length} Assets Serialized
            </span>
          </div>
          <pre className="text-[11px] font-mono text-emerald-300/90 overflow-x-auto p-3 bg-black/50 rounded-lg max-h-60">
            {JSON.stringify(currentPayload, null, 2)}
          </pre>
        </div>
      )}

      <div className="quant-card p-4">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          Quantitative Quick Actions:
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map(qa => (
            <button
              key={qa.label}
              disabled={qa.disabled || isLoading}
              onClick={() => handleSend(qa.label)}
              title={qa.tooltip}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                qa.disabled
                  ? 'bg-slate-900/40 text-slate-600 border border-slate-800/40 cursor-not-allowed'
                  : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:border-purple-500/50 cursor-pointer active:scale-95'
              }`}
            >
              <span>{qa.label}</span>
              <ArrowRight className="w-3 h-3 opacity-60" />
            </button>
          ))}
        </div>
      </div>

      <div className="quant-card p-5 flex flex-col min-h-[420px] max-h-[600px]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0 text-purple-400">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/10'
                      : 'bg-[#11192e] border border-white/10 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-70">
                    <span className="font-semibold">{isUser ? 'You' : 'QuantX Featherless Assistant'}</span>
                    <span className="font-mono">{msg.timestamp}</span>
                  </div>

                  <div className="prose prose-invert prose-xs max-w-none whitespace-pre-line">
                    {msg.content}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center shrink-0 text-sky-400">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center text-xs text-purple-400 animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>Synthesizing mathematical context and ground-truth insights...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask a question about performance, drawdowns, correlation, or backtests..."
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend(undefined, inputQuery)}
            disabled={isLoading}
            className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
          />
          <button
            onClick={() => handleSend(undefined, inputQuery)}
            disabled={isLoading || !inputQuery.trim()}
            className="p-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-xl shadow-md transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
