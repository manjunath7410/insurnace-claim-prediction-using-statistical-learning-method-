import React, { useState } from 'react';
import { BarChart3, Grid, Layers, ArrowUpRight, Sparkles } from 'lucide-react';
import { DatasetMeta } from '../../types';
import { calculateCorrelationMatrix } from '../../utils/statEngine';
import { safeDisplay, safeInt, safeNum } from '../../utils/formatters';

interface EDAViewProps {
  dataset: DatasetMeta | null;
  rawRecords: Record<string, any>[];
}

export const EDAView: React.FC<EDAViewProps> = ({ dataset, rawRecords }) => {
  if (!dataset || rawRecords.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <BarChart3 className="w-12 h-12 text-slate-700 mx-auto mb-3" />
        <p className="text-sm">Please upload or load a dataset first to view Exploratory Analytics.</p>
      </div>
    );
  }

  const [selectedNumCol, setSelectedNumCol] = useState<string>(
    dataset.columns.find((c) => c.type === 'numerical')?.name || 'age_of_policyholder'
  );
  const [selectedCatCol, setSelectedCatCol] = useState<string>(
    dataset.columns.find((c) => c.type === 'categorical')?.name || 'area_cluster'
  );

  const numCols = dataset.columns.filter((c) => c.type === 'numerical').map((c) => c.name);
  const catCols = dataset.columns.filter((c) => c.type === 'categorical').map((c) => c.name);

  // Compute correlation matrix for top numerical features
  const topNumCols = numCols.slice(0, 8);
  const corrData = calculateCorrelationMatrix(rawRecords.slice(0, 5000), topNumCols);

  const selectedCatMeta = dataset.columns.find((c) => c.name === selectedCatCol);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1440px] mx-auto text-slate-100 bg-[#0B1020] min-h-screen">
      <div className="border-b border-slate-800/80 pb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-violet-400" />
          Exploratory Data Analysis (EDA)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Feature distributions, category frequency breakdowns, and Pearson correlation matrices.
        </p>
      </div>

      {/* Grid: Categorical Frequencies & Feature vs Target */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categorical Distribution Chart */}
        <div className="bg-[#111827]/90 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-bold text-white">Categorical Feature Distribution</h3>
            <select
              value={selectedCatCol}
              onChange={(e) => setSelectedCatCol(e.target.value)}
              className="text-xs font-semibold bg-slate-900 text-slate-200 py-1.5 px-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {catCols.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3 pt-2">
            {selectedCatMeta?.categories?.slice(0, 8).map((cat) => (
              <div key={cat.value} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-slate-200">{cat.value}</span>
                  <span className="text-cyan-400">
                    {safeInt(cat.count)} ({safeNum(cat.pct, 1)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, cat.pct * 2.5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Numerical Feature Summary */}
        <div className="bg-[#111827]/90 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-bold text-white">Numerical Variable Statistics</h3>
            <select
              value={selectedNumCol}
              onChange={(e) => setSelectedNumCol(e.target.value)}
              className="text-xs font-semibold bg-slate-900 text-slate-200 py-1.5 px-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {numCols.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {(() => {
            const meta = dataset.columns.find((c) => c.name === selectedNumCol);
            return (
              <div className="grid grid-cols-2 gap-4 pt-2 font-mono">
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-sans uppercase">Mean Value</div>
                  <div className="text-xl font-bold text-white mt-1">{safeNum(meta?.mean, 2)}</div>
                </div>
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-sans uppercase">Standard Deviation</div>
                  <div className="text-xl font-bold text-cyan-400 mt-1">{safeNum(meta?.std, 2)}</div>
                </div>
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-sans uppercase">Median (Q2)</div>
                  <div className="text-xl font-bold text-violet-400 mt-1">{safeNum(meta?.median, 2)}</div>
                </div>
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-sans uppercase">Min - Max Range</div>
                  <div className="text-base font-bold text-slate-300 mt-1">{safeNum(meta?.min, 2)} to {safeNum(meta?.max, 2)}</div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Pearson Correlation Heatmap Table (Matching Image 2 & 4) */}
      <div className="bg-[#111827]/90 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">Pearson Correlation Matrix (Numerical Features)</h3>
        <p className="text-xs text-slate-400">Pairwise correlation r ranging from -1.0 (inverse) to +1.0 (positive)</p>

        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-center text-xs font-mono">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-3 py-2.5 text-left">Feature</th>
                {corrData.columns.map((c) => (
                  <th key={c} className="px-3 py-2.5 truncate max-w-[100px]">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {corrData.matrix.map((row, rIdx) => (
                <tr key={corrData.columns[rIdx]}>
                  <td className="px-3 py-2 text-left font-bold text-white truncate max-w-[120px]">
                    {corrData.columns[rIdx]}
                  </td>
                  {row.map((val, cIdx) => {
                    const isSelf = rIdx === cIdx;
                    return (
                      <td
                        key={cIdx}
                        className={`px-3 py-2 font-bold ${
                          isSelf
                            ? 'bg-slate-900 text-slate-500'
                            : val > 0.3
                            ? 'bg-violet-950/60 text-violet-300'
                            : val < -0.3
                            ? 'bg-rose-950/60 text-rose-300'
                            : 'text-slate-400'
                        }`}
                      >
                        {safeNum(val, 2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
