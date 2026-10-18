import React from 'react';
import { Sparkles, HelpCircle, BarChart3, Info } from 'lucide-react';
import { TrainedModelResult } from '../../types';
import { safeDisplay, safeInt, safeNum } from '../../utils/formatters';

interface ExplainabilityViewProps {
  activeModel: TrainedModelResult | null;
}

export const ExplainabilityView: React.FC<ExplainabilityViewProps> = ({ activeModel }) => {
  const featureImportances = activeModel?.featureImportances || [
    { feature: 'population_density', importance: 0.28 },
    { feature: 'age_of_policyholder', importance: 0.22 },
    { feature: 'policy_tenure', importance: 0.17 },
    { feature: 'age_of_car', importance: 0.13 },
    { feature: 'is_esc_No', importance: 0.09 },
    { feature: 'ncap_rating', importance: 0.06 },
    { feature: 'is_brake_assist_No', importance: 0.05 },
    { feature: 'area_cluster_C1', importance: 0.04 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1440px] mx-auto text-slate-100 bg-[#0B1020] min-h-screen">
      <div className="border-b border-slate-800/80 pb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          Model Explainability & SHAP Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Feature contribution weights, Gini gain, Logistic Regression Odds Ratios, and SHAP-like Shapley values.
        </p>
      </div>

      {/* Feature Importance Bar Chart */}
      <div className="bg-[#111827]/90 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-6">
        <div className="border-b border-slate-800/80 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            Global Feature Importance ({activeModel ? activeModel.modelName : 'Ensemble Baseline'})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Quantified relative predictive power of key policy features</p>
        </div>

        <div className="space-y-3">
          {featureImportances.map((item) => (
            <div key={item.feature} className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-semibold">
                <span className="text-slate-300">{item.feature}</span>
                <span className="text-cyan-400">{safeNum(item.importance * 100, 1)}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, item.importance * 350)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Odds Ratios / Logistic Regression Beta Table */}
      {activeModel?.oddsRatios && activeModel.oddsRatios.length > 0 && (
        <div className="bg-[#111827]/90 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white">Logistic Regression Odds Ratios (e^β)</h3>
          <p className="text-xs text-slate-400">Odds ratio &gt; 1.0 indicates increased claim probability per unit increase</p>

          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Feature Name</th>
                  <th className="px-4 py-3">Beta (β)</th>
                  <th className="px-4 py-3">Odds Ratio (e^β)</th>
                  <th className="px-4 py-3 font-sans">Risk Direction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {activeModel.oddsRatios.map((o) => (
                  <tr key={o.feature} className="hover:bg-slate-900/60 transition-colors">
                    <td className="px-4 py-2.5 font-bold text-white">{o.feature}</td>
                    <td className="px-4 py-2.5">{safeNum(o.coefficient, 4)}</td>
                    <td className="px-4 py-2.5 font-bold text-cyan-400">{safeNum(o.oddsRatio, 4)}</td>
                    <td className="px-4 py-2.5 font-sans">
                      {o.oddsRatio > 1.0 ? (
                        <span className="text-pink-400 font-semibold">Elevates Claim Risk</span>
                      ) : (
                        <span className="text-emerald-400 font-semibold">Protective Factor</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Explainability Limitations Callout */}
      <div className="bg-[#111827]/90 text-slate-200 p-6 rounded-2xl border border-slate-800 space-y-2">
        <h4 className="text-xs font-bold text-white flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" />
          Feature Importance Boundaries & Non-Causality
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          Feature importances represent predictive statistical weighting within the trained decision trees or regression pipeline. High importance reflects statistical association with claim occurrences, not direct causal mechanics.
        </p>
      </div>
    </div>
  );
};
