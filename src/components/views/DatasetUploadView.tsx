import React, { useState } from 'react';
import Papa from 'papaparse';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  Database,
  Search,
  Filter,
  Download,
  Info,
  Sparkles,
} from 'lucide-react';
import { DatasetMeta } from '../../types';
import { analyzeDataset } from '../../utils/statEngine';

interface DatasetUploadViewProps {
  dataset: DatasetMeta | null;
  onDatasetLoaded: (dataset: DatasetMeta, rawRecords: Record<string, any>[]) => void;
  onQuickLoadBenchmark: () => void;
  isLoading: boolean;
}

export const DatasetUploadView: React.FC<DatasetUploadViewProps> = ({
  dataset,
  onDatasetLoaded,
  onQuickLoadBenchmark,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const handleFileUpload = (file: File) => {
    setUploadError(null);
    if (!file.name.endsWith('.csv')) {
      setUploadError('Please upload a valid .csv file.');
      return;
    }

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const records = results.data as Record<string, any>[];
          if (!records || records.length === 0) {
            setUploadError('Uploaded CSV is empty.');
            return;
          }
          const meta = analyzeDataset(records, file.name);
          onDatasetLoaded(meta, records);
        } catch (err: any) {
          setUploadError(`Failed to process dataset: ${err.message}`);
        }
      },
      error: (err) => {
        setUploadError(`CSV Parse Error: ${err.message}`);
      },
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const filteredColumns = dataset
    ? dataset.columns.filter((col) =>
        col.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const totalPages = dataset ? Math.ceil(dataset.previewRows.length / pageSize) : 1;
  const paginatedRows = dataset
    ? dataset.previewRows.slice((page - 1) * pageSize, page * pageSize)
    : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1440px] mx-auto text-slate-100 bg-[#0B1020] min-h-screen">
      {/* Title & Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-cyan-400" />
            Dataset Upload & Schema Ingestion
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload custom CSV dataset or load standard 58,592 row benchmark for immediate training and exploratory analysis.
          </p>
        </div>

        <button
          onClick={onQuickLoadBenchmark}
          disabled={isLoading}
          className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2 self-start cursor-pointer disabled:opacity-50"
        >
          <Database className="w-4 h-4 text-cyan-300" />
          <span>{isLoading ? 'Ingesting 58,592 Rows...' : 'Load Standard Benchmark CSV'}</span>
        </button>
      </div>

      {/* Upload Drag & Drop Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all bg-[#111827]/80 backdrop-blur-md shadow-2xl ${
          dragActive
            ? 'border-cyan-400 bg-cyan-950/20 glow-cyan'
            : 'border-slate-800 hover:border-violet-500/50'
        }`}
      >
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-0.5 shadow-lg shadow-violet-500/30 mx-auto">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-cyan-400">
              <UploadCloud className="w-8 h-8" />
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-white">
              Drag and drop your insurance claims CSV file
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Supports full dataset processing up to 100,000+ rows without random downsampling.
            </p>
          </div>

          <label className="inline-block px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-violet-600/25">
            <span>Browse CSV File</span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
              }}
            />
          </label>

          {uploadError && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs rounded-xl flex items-center gap-2 justify-center">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Dataset Summary & Schema Cards */}
      {dataset && (
        <div className="space-y-8">
          {/* Status Alert Banner */}
          <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-2xl p-5 flex items-start gap-3 shadow-lg">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white">
                Dataset Active: {dataset.name}
              </h4>
              <p className="text-xs text-emerald-300/80 font-mono">
                Ingested <span className="font-bold text-emerald-300">{dataset.totalRows.toLocaleString()}</span> rows and <span className="font-bold text-emerald-300">{dataset.totalCols}</span> columns. Target column: <span className="font-bold text-cyan-300">{dataset.targetColumn || 'claim_status'}</span>.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#111827]/90 p-4 rounded-2xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium uppercase">Total Records</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
                {dataset.totalRows.toLocaleString()}
              </div>
            </div>

            <div className="bg-[#111827]/90 p-4 rounded-2xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium uppercase">Features Count</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-cyan-400 mt-1">
                {dataset.totalCols}
              </div>
            </div>

            <div className="bg-[#111827]/90 p-4 rounded-2xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium uppercase">Missing Values</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
                {dataset.missingTotalCount}
              </div>
            </div>

            <div className="bg-[#111827]/90 p-4 rounded-2xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium uppercase">Claim Rate (Target=1)</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-pink-400 mt-1">
                {dataset.classDistribution.positiveRatio}%
              </div>
            </div>
          </div>

          {/* Schema Columns Table */}
          <div className="bg-[#111827]/90 rounded-2xl border border-slate-800/80 shadow-xl overflow-hidden space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white">Columns Schema & Inferenced Types</h3>
                <p className="text-xs text-slate-400 mt-0.5">Automated numerical, categorical, and target classification</p>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search column..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Column Name</th>
                    <th className="px-4 py-3">Inferred Role</th>
                    <th className="px-4 py-3">Unique Values</th>
                    <th className="px-4 py-3">Missing Pct</th>
                    <th className="px-4 py-3">Mean / Mode</th>
                    <th className="px-4 py-3">Min - Max</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredColumns.map((col) => (
                    <tr key={col.name} className="hover:bg-slate-900/60 transition-colors">
                      <td className="px-4 py-2.5 font-bold text-white">
                        {col.name}
                      </td>
                      <td className="px-4 py-2.5 font-sans">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            col.type === 'target'
                              ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                              : col.type === 'identifier'
                              ? 'bg-slate-800 text-slate-400'
                              : col.type === 'numerical'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                          }`}
                        >
                          {col.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 tabular-nums">
                        {col.uniqueCount.toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5 tabular-nums">
                        {col.missingPct}%
                      </td>
                      <td className="px-4 py-2.5 truncate max-w-[150px]">
                        {col.type === 'numerical' ? col.mean ?? '-' : col.mode ?? '-'}
                      </td>
                      <td className="px-4 py-2.5 text-slate-400">
                        {col.type === 'numerical' ? `${col.min} to ${col.max}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
