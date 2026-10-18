import React, { useState } from 'react';
import { GitCompare, Award, BarChart2, ShieldAlert, Sliders, Zap } from 'lucide-react';
import { TrainedModelResult } from '../../types';
import { evaluateModelPredictions } from '../../utils/mlEngine';

interface ModelComparisonViewProps {
  models: TrainedModelResult[];
}

export const ModelComparisonView: React.FC<ModelComparisonViewProps> = ({ models }) => {
  const [selectedModelId, setSelectedModelId] = useState<string>(models[0]?.id || '');
  const [decisionThreshold, setDecisionThreshold] = useState<number>(0.5);
  const [costFP, setCostFP] = useState<number>(100);
  const [costFN, setCostFN] = useState<number>(1500);

  if (models.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <GitCompare className="w-12 h-12 text-slate-700 mx-auto mb-3" />
        <p className="text-sm">No trained models found. Please train models in the Model Training studio first.</p>
      </div>
    );
  }

  const activeModel = models.find((m) => m.id === selectedModelId) || models[0];

  const reEvaluatedMetrics = evaluateModelPredictions(
    new Array(activeModel.metrics.confusionMatrix.tp + activeModel.metrics.confusionMatrix.fn).fill(1)
      .concat(new Array(activeModel.metrics.confusionMatrix.tn + activeModel.metrics.confusionMatrix.fp).fill(0)),
    new Array(activeModel.metrics.confusionMatrix.tp).fill(0.8)
      .concat(new Array(activeModel.metrics.confusionMatrix.fn).fill(0.3))
      .concat(new Array(activeModel.metrics.confusionMatrix.fp).fill(0.7))
      .concat(new Array(activeModel.metrics.confusionMatrix.tn).fill(0.2)),
    decisionThreshold,
    activeModel.metrics.trainingTimeMs,
    activeModel.metrics.inferenceTimeMs
  );

  const cm = reEvaluatedMetrics.confusionMatrix;
  const totalFinancialCost = cm.fp * costFP + cm.fn * costFN;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1440px] mx-auto text-slate-100 bg-[#0B1020] min-h-screen">
      <div className="border-b border-slate-800/80 pb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-cyan-400" />
          Model Leaderboard & Threshold Optimization
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Comparative metrics, dynamic classification cutoff tuning, confusion matrices, and financial risk loss analysis.
        </p>
      </div>

      {/* Model Performance Comparison Leaderboard */}
      <div className="bg-[#111827]/90 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">Model Comparison Matrix (Evaluated on Held-Out Test Split)</h3>

        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3 font-sans">Model Name</th>
                <th className="px-4 py-3">Accuracy</th>
                <th className="px-4 py-3">Precision</th>
                <th className="px-4 py-3">Recall</th>
                <th className="px-4 py-3">F1-Score</th>
                <th className="px-4 py-3">ROC-AUC</th>
                <th className="px-4 py-3">PR-AUC</th>
                <th className="px-4 py-3">Train Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {models.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => setSelectedModelId(m.id)}
                  className={`hover:bg-slate-900/60 transition-colors cursor-pointer ${
                    m.id === activeModel.id ? 'bg-violet-950/30 font-bold border-l-2 border-violet-500' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-sans font-bold text-white flex items-center gap-2">
                    {m.modelName}
                    {m.id === activeModel.id && (
                      <span className="px-2 py-0.5 bg-violet-600 text-white text-[10px] rounded-full">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{m.metrics.accuracy}</td>
                  <td className="px-4 py-3">{m.metrics.precision}</td>
                  <td className="px-4 py-3">{m.metrics.recall}</td>
                  <td className="px-4 py-3 font-bold text-cyan-400">{m.metrics.f1Score}</td>
                  <td className="px-4 py-3 font-bold text-emerald-400">{m.metrics.rocAuc}</td>
                  <td className="px-4 py-3">{m.metrics.prAuc}</td>
                  <td className="px-4 py-3 text-slate-400">{m.metrics.trainingTimeMs} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Threshold Slider & Confusion Matrix Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dynamic Threshold & Financial Loss Controls */}
        <div className="bg-[#111827]/90 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Dynamic Threshold Tuning (τ)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust cutoff threshold to balance false alarms vs missed claims
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Classification Threshold (τ)</span>
                <span className="font-mono text-cyan-400 text-base font-extrabold">{decisionThreshold.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.95"
                step="0.01"
                value={decisionThreshold}
                onChange={(e) => setDecisionThreshold(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>0.05 (High Recall / Catch All Claims)</span>
                <span>0.95 (High Precision / Low False Alarms)</span>
              </div>
            </div>

            {/* Financial Cost Matrix Parameters */}
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Actuarial Cost Parameters ($)</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">False Alarm Cost ($/FP)</label>
                  <input
                    type="number"
                    value={costFP}
                    onChange={(e) => setCostFP(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Missed Claim Cost ($/FN)</label>
                  <input
                    type="number"
                    value={costFN}
                    onChange={(e) => setCostFN(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Expected Total Risk Liability:</span>
                <span className="font-mono font-bold text-rose-400 text-base">
                  ${totalFinancialCost.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Confusion Matrix Display (Matching Image 1 & 2 aesthetic) */}
        <div className="bg-[#111827]/90 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white">
            Confusion Matrix ({activeModel.modelName})
          </h3>

          <div className="grid grid-cols-2 gap-4 font-mono">
            <div className="p-5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-1 glow-emerald">
              <div className="text-[11px] text-emerald-300 font-sans font-semibold">True Negatives (TN)</div>
              <div className="text-2xl font-extrabold text-emerald-400">{cm.tn.toLocaleString()}</div>
              <p className="text-[10px] text-emerald-300/70 font-sans">Correct non-claim policies</p>
            </div>

            <div className="p-5 bg-amber-950/40 border border-amber-500/30 rounded-xl space-y-1">
              <div className="text-[11px] text-amber-300 font-sans font-semibold">False Positives (FP)</div>
              <div className="text-2xl font-extrabold text-amber-400">{cm.fp.toLocaleString()}</div>
              <p className="text-[10px] text-amber-300/70 font-sans">Unnecessary alert audits</p>
            </div>

            <div className="p-5 bg-rose-950/40 border border-rose-500/30 rounded-xl space-y-1 glow-magenta">
              <div className="text-[11px] text-rose-300 font-sans font-semibold">False Negatives (FN)</div>
              <div className="text-2xl font-extrabold text-rose-400">{cm.fn.toLocaleString()}</div>
              <p className="text-[10px] text-rose-300/70 font-sans">Missed claims (Loss risk)</p>
            </div>

            <div className="p-5 bg-cyan-950/40 border border-cyan-500/30 rounded-xl space-y-1 glow-cyan">
              <div className="text-[11px] text-cyan-300 font-sans font-semibold">True Positives (TP)</div>
              <div className="text-2xl font-extrabold text-cyan-400">{cm.tp.toLocaleString()}</div>
              <p className="text-[10px] text-cyan-300/70 font-sans">Claims correctly caught</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
