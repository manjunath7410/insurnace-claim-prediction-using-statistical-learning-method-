import React from 'react';
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  BarChart,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { DatasetMeta } from '../../types';

interface DataQualityViewProps {
  dataset: DatasetMeta | null;
}

export const DataQualityView: React.FC<DataQualityViewProps> = ({ dataset }) => {
  if (!dataset) {
    return (
      <div className="p-12 text-center text-slate-500">
        <FileCheck2 className="w-12 h-12 text-slate-700 mx-auto mb-3" />
        <p className="text-sm">Please upload or load a dataset first to perform quality audit.</p>
      </div>
    );
  }

  const numericCols = dataset.columns.filter((c) => c.type === 'numerical');
  const missingCols = dataset.columns.filter((c) => c.missingCount > 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1440px] mx-auto text-slate-100 bg-[#0B1020] min-h-screen">
      <div className="border-b border-slate-800/80 pb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-cyan-400" />
          Data Quality & Leakage Audit
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Automated data validation, missing value profiling, outlier analysis, and target leakage detection.
        </p>
      </div>

      {/* Audit Verdict Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#111827]/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Missing Values Status</span>
            {missingCols.length === 0 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            {dataset.missingTotalCount} missing
          </div>
          <p className="text-xs text-slate-400">
            {missingCols.length === 0
              ? 'Zero missing cells detected across all columns.'
              : `${missingCols.length} columns contain missing values. Median imputation active.`}
          </p>
        </div>

        <div className="bg-[#111827]/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Duplicate Records</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-cyan-400">
            {dataset.duplicateRowsCount} duplicates
          </div>
          <p className="text-xs text-slate-400">
            {dataset.duplicateRowsCount === 0
              ? 'No duplicate policy rows found.'
              : 'Duplicate records flagged for cleaning.'}
          </p>
        </div>

        <div className="bg-[#111827]/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Class Imbalance Ratio</span>
            <ShieldAlert className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-pink-400">
            {dataset.classDistribution.positiveRatio}% Claims
          </div>
          <p className="text-xs text-slate-400">
            Imbalanced classification detected. Stratified splits & class weighting applied.
          </p>
        </div>
      </div>

      {/* Target Leakage Prevention Panel */}
      <div className="bg-gradient-to-r from-violet-950/80 to-slate-900 border border-slate-800 text-white p-6 rounded-2xl space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>Target Leakage Protection Active</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-mono">
          Identifier column <span className="text-cyan-300 font-bold">{dataset.identifierColumn || 'policy_id'}</span> and target-derived features are strictly excluded from predictive models. Preprocessing fits only on training split.
        </p>
      </div>

      {/* Numerical Outlier Audit Table */}
      <div className="bg-[#111827]/90 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">Numerical Features & Outlier Assessment (IQR Bounds)</h3>
        <p className="text-xs text-slate-400">Interquartile Range [Q1 - 1.5*IQR, Q3 + 1.5*IQR] bounds</p>

        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Feature Name</th>
                <th className="px-4 py-3">Mean ± Std</th>
                <th className="px-4 py-3">Median (Q1 - Q3)</th>
                <th className="px-4 py-3">Min - Max</th>
                <th className="px-4 py-3">IQR Outlier Bounds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {numericCols.map((col) => {
                const iqr = (col.q75 || 0) - (col.q25 || 0);
                const lower = Number(((col.q25 || 0) - 1.5 * iqr).toFixed(2));
                const upper = Number(((col.q75 || 0) + 1.5 * iqr).toFixed(2));

                return (
                  <tr key={col.name} className="hover:bg-slate-900/60 transition-colors">
                    <td className="px-4 py-2.5 font-bold text-white">{col.name}</td>
                    <td className="px-4 py-2.5">
                      {col.mean} ± {col.std}
                    </td>
                    <td className="px-4 py-2.5">
                      {col.median} ({col.q25} - {col.q75})
                    </td>
                    <td className="px-4 py-2.5">
                      {col.min} to {col.max}
                    </td>
                    <td className="px-4 py-2.5 text-cyan-400">
                      [{lower}, {upper}]
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
