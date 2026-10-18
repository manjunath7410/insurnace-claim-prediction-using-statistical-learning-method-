import React, { useState, useEffect } from 'react';
import { Binary, CheckCircle2, AlertCircle, Info, RefreshCw, Sparkles } from 'lucide-react';
import { DatasetMeta, StatisticalTestResult } from '../../types';
import {
  runChiSquareTest,
  runWelchTTest,
  runMannWhitneyUTest,
  applyFDRCorrection,
} from '../../utils/statEngine';

interface StatisticalTestsViewProps {
  dataset: DatasetMeta | null;
  rawRecords: Record<string, any>[];
}

export const StatisticalTestsView: React.FC<StatisticalTestsViewProps> = ({
  dataset,
  rawRecords,
}) => {
  const [useFDR, setUseFDR] = useState<boolean>(true);
  const [testResults, setTestResults] = useState<StatisticalTestResult[]>([]);
  const [isComputing, setIsComputing] = useState<boolean>(false);

  useEffect(() => {
    if (dataset && rawRecords.length > 0 && dataset.targetColumn) {
      computeAllTests();
    }
  }, [dataset, rawRecords, useFDR]);

  const computeAllTests = () => {
    if (!dataset || !dataset.targetColumn) return;
    setIsComputing(true);

    setTimeout(() => {
      const sample = rawRecords.slice(0, 10000);
      const targetCol = dataset.targetColumn!;

      const results: StatisticalTestResult[] = [];

      // Run tests for categorical features
      const catCols = dataset.columns
        .filter((c) => c.type === 'categorical')
        .slice(0, 10);

      for (const col of catCols) {
        results.push(runChiSquareTest(sample, col.name, targetCol));
      }

      // Run tests for numerical features
      const numCols = dataset.columns
        .filter((c) => c.type === 'numerical')
        .slice(0, 10);

      for (const col of numCols) {
        results.push(runWelchTTest(sample, col.name, targetCol));
        results.push(runMannWhitneyUTest(sample, col.name, targetCol));
      }

      const finalResults = useFDR ? applyFDRCorrection(results) : results;
      setTestResults(finalResults);
      setIsComputing(false);
    }, 50);
  };

  if (!dataset) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Binary className="w-12 h-12 text-slate-700 mx-auto mb-3" />
        <p className="text-sm">Please upload or load a dataset first to execute Statistical Hypothesis Tests.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1440px] mx-auto text-slate-100 bg-[#0B1020] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Binary className="w-5 h-5 text-cyan-400" />
            Statistical Hypothesis Testing Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Rigorous significance testing (Chi-Square, Welch t-test, Mann-Whitney U) with p-values and effect sizes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer bg-slate-900/90 py-2 px-3 rounded-xl border border-slate-700">
            <input
              type="checkbox"
              checked={useFDR}
              onChange={(e) => setUseFDR(e.target.checked)}
              className="rounded accent-violet-600"
            />
            <span>Benjamini-Hochberg FDR Control (α = 0.05)</span>
          </label>

          <button
            onClick={computeAllTests}
            disabled={isComputing}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isComputing ? 'animate-spin' : ''}`} />
            <span>Re-compute Tests</span>
          </button>
        </div>
      </div>

      {/* Non-Causality & Methodology Warning */}
      <div className="bg-amber-950/40 border border-amber-500/30 text-amber-300 p-4 rounded-2xl flex items-start gap-3 text-xs shadow-lg">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-white">Statistical Inference Standards:</span>
          <p className="text-amber-200/80 leading-relaxed">
            Statistically significant associations indicate predictive value for classification algorithms but <span className="font-semibold underline">do not establish causation</span>. P-values are adjusted for multiplicity via False Discovery Rate (FDR) control.
          </p>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-[#111827]/90 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">
          Hypothesis Testing Matrix ({testResults.length} Tests Computed)
        </h3>

        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Feature Name</th>
                <th className="px-4 py-3 font-sans">Test Conducted</th>
                <th className="px-4 py-3">Test Statistic</th>
                <th className="px-4 py-3">Raw p-value</th>
                {useFDR && <th className="px-4 py-3">FDR Adj. p-value</th>}
                <th className="px-4 py-3">Effect Size</th>
                <th className="px-4 py-3 font-sans">Conclusion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {testResults.map((res, idx) => (
                <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                  <td className="px-4 py-3 font-bold text-white">{res.featureName}</td>
                  <td className="px-4 py-3 text-slate-300 font-sans">{res.statisticName}</td>
                  <td className="px-4 py-3">{res.statisticValue}</td>
                  <td className="px-4 py-3">{res.pValue}</td>
                  {useFDR && (
                    <td className="px-4 py-3 font-bold text-cyan-400">
                      {res.adjustedPValue}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <span className="font-bold text-white">{res.effectSizeValue}</span>{' '}
                    <span className="text-slate-400 font-sans text-[11px]">({res.effectInterpretation})</span>
                  </td>
                  <td className="px-4 py-3 font-sans text-[11px]">
                    {res.significant ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        Significant (p &lt; 0.05)
                      </span>
                    ) : (
                      <span className="text-slate-500">Not Significant</span>
                    )}
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
