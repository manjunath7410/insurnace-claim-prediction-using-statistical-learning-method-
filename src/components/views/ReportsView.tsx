import React from 'react';
import Papa from 'papaparse';
import { Download, FileText, CheckCircle2, FileSpreadsheet, Sparkles } from 'lucide-react';
import { DatasetMeta, TrainedModelResult } from '../../types';
import { safeInt, safeNum } from '../../utils/formatters';

interface ReportsViewProps {
  dataset: DatasetMeta | null;
  rawRecords: Record<string, any>[];
  models: TrainedModelResult[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ dataset, rawRecords, models }) => {
  const downloadJSON = (data: any, filename: string) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadCSV = (rows: any[], filename: string) => {
    const csvStr = Papa.unparse(rows);
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1440px] mx-auto text-slate-100 bg-[#0B1020] min-h-screen">
      <div className="border-b border-slate-800/80 pb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Download className="w-5 h-5 text-cyan-400" />
          Reports & Downloadable Artifacts
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Export validated datasets, EDA statistical summaries, model evaluation matrices, and serialized pipelines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Report 1: Cleaned Dataset */}
        <div className="bg-[#111827]/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-violet-950/60 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Cleaned Dataset CSV</h3>
            <p className="text-xs text-slate-400 mt-1">
              Full dataset with imputed values and validated schema.
            </p>
          </div>
          <button
            onClick={() => rawRecords.length > 0 && downloadCSV(rawRecords, `Cleaned_Insurance_Dataset_${Date.now()}.csv`)}
            disabled={!dataset}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV ({safeInt(rawRecords.length)} rows)</span>
          </button>
        </div>

        {/* Report 2: EDA Summary */}
        <div className="bg-[#111827]/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Exploratory Analysis Summary</h3>
            <p className="text-xs text-slate-400 mt-1">
              Descriptive statistics, missing counts, and column profiles in JSON.
            </p>
          </div>
          <button
            onClick={() => dataset && downloadJSON(dataset, `EDA_Summary_${Date.now()}.json`)}
            disabled={!dataset}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export EDA JSON Report</span>
          </button>
        </div>

        {/* Report 3: Model Comparison Matrix */}
        <div className="bg-[#111827]/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Model Leaderboard CSV</h3>
            <p className="text-xs text-slate-400 mt-1">
              ROC-AUC, Precision, Recall, F1, Log Loss, and training speeds.
            </p>
          </div>
          <button
            onClick={() => {
              if (models.length === 0) return;
              const rows = models.map((m) => ({
                model_name: m.modelName,
                roc_auc: m.metrics.rocAuc,
                f1_score: m.metrics.f1Score,
                precision: m.metrics.precision,
                recall: m.metrics.recall,
                accuracy: m.metrics.accuracy,
                log_loss: m.metrics.logLoss,
                training_time_ms: m.metrics.trainingTimeMs,
              }));
              downloadCSV(rows, `Model_Leaderboard_${Date.now()}.csv`);
            }}
            disabled={models.length === 0}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Download Leaderboard CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
