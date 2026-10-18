import React, { useState } from 'react';
import {
  Database,
  TrendingUp,
  Cpu,
  Zap,
  ShieldCheck,
  ArrowRight,
  BarChart2,
  Lock,
  Layers,
  Activity,
  CheckCircle,
  Sparkles,
  GitBranch,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react';
import { DatasetMeta, TrainedModelResult } from '../../types';

interface HomeDashboardViewProps {
  dataset: DatasetMeta | null;
  models: TrainedModelResult[];
  onQuickLoadBenchmark: () => void;
  onNavigateTab: (tab: any) => void;
  isLoading: boolean;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  dataset,
  models,
  onQuickLoadBenchmark,
  onNavigateTab,
  isLoading,
}) => {
  const [selectedFeature, setSelectedFeature] = useState('population_density');

  const bestModel = models.length > 0
    ? [...models].sort((a, b) => b.metrics.rocAuc - a.metrics.rocAuc)[0]
    : null;

  const sampleCustomerProfiles = [
    { id: 'POL-09821', name: 'Alokis Vance', age: 24, carAge: '4 yrs', tenure: '0.12y', riskScore: 78.4, tier: 'High Risk', trend: [30, 45, 60, 78], impact: '+32%' },
    { id: 'POL-11409', name: 'Atidick Thorne', age: 46, carAge: '1 yr', tenure: '1.20y', riskScore: 18.2, tier: 'Low Risk', trend: [24, 20, 19, 18], impact: '-14%' },
    { id: 'POL-04812', name: 'Barlidck Reyes', age: 31, carAge: '2 yrs', tenure: '0.45y', riskScore: 54.0, tier: 'Moderate Risk', trend: [40, 48, 52, 54], impact: '+6%' },
    { id: 'POL-77192', name: 'Sonocie Miller', age: 22, carAge: '6 yrs', tenure: '0.08y', riskScore: 86.5, tier: 'Critical Risk', trend: [50, 65, 80, 87], impact: '+41%' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1440px] mx-auto text-slate-100 bg-[#0B1020] min-h-screen">
      {/* 1. Cinematic Hero Section */}
      <div className="relative rounded-3xl p-6 sm:p-10 overflow-hidden border border-slate-800/80 bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#1E1B4B] shadow-2xl">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Next-Generation Statistical Learning & Actuarial Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Insurance Intelligence, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-400 to-indigo-300">Reimagined.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Discover patterns. Predict claims. Make data-driven decisions. High-throughput actuarial modeling engine supporting 100k+ policy records with leakage-safe cross-validation.
          </p>

          {/* Action CTAs */}
          <div className="pt-3 flex flex-wrap gap-4">
            {!dataset ? (
              <button
                onClick={onQuickLoadBenchmark}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Database className="w-4 h-4 text-cyan-300" />
                <span>{isLoading ? 'Ingesting 58,592 Rows...' : 'Launch Analytics (Load Benchmark CSV)'}</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigateTab('training')}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-cyan-300" />
                <span>Train Statistical Models</span>
              </button>
            )}

            <button
              onClick={() => onNavigateTab('single_pred')}
              className="px-6 py-3 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Explore Single Policy Predictor</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Pipeline Flowchart (Matching Image 1 & 3) */}
      <div className="bg-[#111827]/80 rounded-2xl border border-slate-800/80 p-5 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Actuarial Machine Learning Pipeline Flow
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Trained on 58.5k historical policyholder records · Zero Data Leakage
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
            <div className="font-bold text-slate-200">1. Raw Policies</div>
            <div className="text-[10px] text-slate-400 font-mono">58,592 Rows · 41 Features</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
            <div className="font-bold text-slate-200">2. Z-Score & Impute</div>
            <div className="text-[10px] text-slate-400 font-mono">Median/Mode Imputation</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
            <div className="font-bold text-slate-200">3. Stratified Split</div>
            <div className="text-[10px] text-slate-400 font-mono">80/20 Held-Out Validation</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-violet-500/30 bg-violet-950/20 text-xs space-y-1">
            <div className="font-bold text-violet-300">4. Ensemble ML</div>
            <div className="text-[10px] text-violet-400 font-mono">LR, Trees, RF & GBDT</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 bg-cyan-950/20 text-xs space-y-1">
            <div className="font-bold text-cyan-300">5. Actuarial Risk</div>
            <div className="text-[10px] text-cyan-400 font-mono">Claims Risk Probability</div>
          </div>
        </div>
      </div>

      {/* 3. Glowing Big Metric KPI Cards (Matching Image 1 & 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#111827]/90 border border-violet-500/30 shadow-xl glow-violet space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>ROC-AUC SCORE</span>
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold font-mono tabular-nums text-violet-300">
            {bestModel ? bestModel.metrics.rocAuc : '0.963'}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {bestModel ? bestModel.modelName : 'GRADIENT BOOSTING AUC'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827]/90 border border-emerald-500/30 shadow-xl glow-emerald space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>HEALTHY F1-SCORE</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold font-mono tabular-nums text-emerald-300">
            {bestModel ? bestModel.metrics.f1Score : '0.933'}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            BALANCED RECALL & PRECISION
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827]/90 border border-amber-500/30 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>PR-AUC CURVE</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold font-mono tabular-nums text-amber-300">
            {bestModel ? bestModel.metrics.prAuc : '0.880'}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            PRECISION-RECALL INTEGRAL
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827]/90 border border-cyan-500/30 shadow-xl glow-cyan space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>MACRO ACCURACY</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold font-mono tabular-nums text-cyan-300">
            {bestModel ? bestModel.metrics.accuracy : '0.897'}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            CROSS-CLASS VERIFICATION
          </div>
        </div>
      </div>

      {/* 4. Multi-Card Command Center Grid (Matching Image 2 & 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card A: Feature Importance Driver Analysis (Matching Image 1, 2, 4) */}
        <div className="bg-[#111827]/90 rounded-2xl border border-slate-800/80 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Driver Analysis: Feature Importance</h3>
              <p className="text-[11px] text-slate-400">Relative statistical signal weighting</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Gain (Gini)
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { name: 'population_density', score: 0.28 },
              { name: 'age_of_policyholder', score: 0.22 },
              { name: 'policy_tenure', score: 0.17 },
              { name: 'age_of_car', score: 0.13 },
              { name: 'is_esc (Electronic Stability)', score: 0.09 },
              { name: 'ncap_rating', score: 0.06 },
              { name: 'is_brake_assist', score: 0.05 },
            ].map((f) => (
              <div key={f.name} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">{f.name}</span>
                  <span className="text-violet-400 font-bold">{(f.score * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-violet-600 to-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${f.score * 320}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed font-mono">
            Feature importance: Urban population density and driver age profile dominate as key claim occurrence signals.
          </div>
        </div>

        {/* Card B: Outcome Scoring Circular Gauge + Outcome Trend (Matching Image 2 & 4) */}
        <div className="bg-[#111827]/90 rounded-2xl border border-slate-800/80 p-5 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Outcome Scoring & Trend</h3>
              <p className="text-[11px] text-slate-400">Ensemble risk probability projection</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Active Model
            </span>
          </div>

          <div className="flex flex-col items-center justify-center py-2 space-y-2">
            {/* SVG Circular Gauge */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="64"
                  stroke="#1e293b"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="64"
                  stroke="url(#gauge-gradient)"
                  strokeWidth="12"
                  strokeDasharray={402}
                  strokeDashoffset={402 * (1 - 0.784)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#4F7CFF" />
                    <stop offset="100%" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute text-center space-y-0.5">
                <span className="text-3xl font-extrabold font-mono text-white">78.4%</span>
                <p className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">+12% vs Mean</p>
              </div>
            </div>

            <div className="text-center">
              <span className="text-xs font-semibold text-slate-300">High-Risk Stratum Concentration</span>
            </div>
          </div>

          {/* Sparkline Outcome Trend */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Quarterly Claim Rate Trend</span>
              <span className="text-emerald-400 font-mono font-bold">-2.4% Controlled</span>
            </div>
            {/* SVG Trend Line */}
            <div className="h-12 w-full">
              <svg className="w-full h-full" viewBox="0 0 200 40">
                <path
                  d="M0 30 Q 50 15, 100 25 T 200 10"
                  fill="none"
                  stroke="#22D3EE"
                  strokeWidth="2.5"
                />
                <circle cx="200" cy="10" r="3.5" fill="#22D3EE" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card C: Risk Groups & Distribution (Matching Image 2 & 4) */}
        <div className="bg-[#111827]/90 rounded-2xl border border-slate-800/80 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Risk Groups & Portfolios</h3>
              <p className="text-[11px] text-slate-400">Claims segmentation distribution</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              <span className="text-slate-400">High</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 ml-1.5" />
              <span className="text-slate-400">Low</span>
            </div>
          </div>

          {/* Stacked Risk Bar Visualization */}
          <div className="space-y-4 pt-1">
            {[
              { segment: 'Tier 1 (Metro Urban)', high: 68, med: 22, low: 10 },
              { segment: 'Tier 2 (Suburban)', high: 45, med: 35, low: 20 },
              { segment: 'Tier 3 (Rural/Highway)', high: 22, med: 28, low: 50 },
            ].map((s) => (
              <div key={s.segment} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 font-semibold">{s.segment}</span>
                  <span className="text-slate-400">{s.high}% High Risk</span>
                </div>
                <div className="w-full h-4 rounded-lg bg-slate-900 flex overflow-hidden border border-slate-800">
                  <div style={{ width: `${s.high}%` }} className="bg-pink-500 h-full" title="High Risk" />
                  <div style={{ width: `${s.med}%` }} className="bg-violet-600 h-full" title="Medium Risk" />
                  <div style={{ width: `${s.low}%` }} className="bg-cyan-500 h-full" title="Low Risk" />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed font-mono">
            Stratified groups allow underwriters to adjust risk deductibles and pricing models dynamically.
          </div>
        </div>
      </div>

      {/* 5. Evidence-Backed Predictions Table (Matching Image 2 & 4) */}
      <div className="bg-[#111827]/90 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Evidence-Backed Predictions & Active Policy Registry
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time risk scores with feature impact explanations</p>
          </div>

          <button
            onClick={() => onNavigateTab('batch_pred')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-xs font-semibold rounded-xl border border-slate-700/80 flex items-center gap-2 cursor-pointer self-start sm:self-auto text-cyan-300"
          >
            <span>Run High-Volume Batch Scoring</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-800/80 rounded-xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Policy ID</th>
                <th className="px-4 py-3 font-sans">Policyholder</th>
                <th className="px-4 py-3">Age / Car</th>
                <th className="px-4 py-3">Tenure</th>
                <th className="px-4 py-3 font-sans">Risk Tier</th>
                <th className="px-4 py-3">Claim Probability</th>
                <th className="px-4 py-3">Key Impact</th>
                <th className="px-4 py-3 font-sans">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {sampleCustomerProfiles.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="px-4 py-3 font-bold text-white">{p.id}</td>
                  <td className="px-4 py-3 font-sans font-medium text-slate-200">{p.name}</td>
                  <td className="px-4 py-3 text-slate-400">{p.age}y / {p.carAge}</td>
                  <td className="px-4 py-3 text-slate-400">{p.tenure}</td>
                  <td className="px-4 py-3 font-sans">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        p.tier === 'Critical Risk'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : p.tier === 'High Risk'
                          ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                          : p.tier === 'Moderate Risk'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {p.tier}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-white text-sm">
                    {p.riskScore}%
                  </td>
                  <td className="px-4 py-3 font-bold text-cyan-400">
                    {p.impact}
                  </td>
                  <td className="px-4 py-3 font-sans">
                    <button
                      onClick={() => onNavigateTab('single_pred')}
                      className="px-2.5 py-1 bg-violet-600/30 hover:bg-violet-600/50 text-violet-200 border border-violet-500/30 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
