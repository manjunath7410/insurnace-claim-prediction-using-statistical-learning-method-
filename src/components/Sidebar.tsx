import React from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  FileCheck2,
  BarChart3,
  Binary,
  Cpu,
  GitCompare,
  Target,
  Layers,
  Sparkles,
  Download,
  ShieldCheck,
  Building2,
  X,
  Zap,
} from 'lucide-react';

export type ViewTab =
  | 'home'
  | 'upload'
  | 'quality'
  | 'eda'
  | 'stat_tests'
  | 'training'
  | 'comparison'
  | 'single_pred'
  | 'batch_pred'
  | 'explain'
  | 'reports'
  | 'security';

interface SidebarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  datasetLoaded: boolean;
  modelsCount: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  datasetLoaded,
  modelsCount,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const navItems: { id: ViewTab; label: string; icon: React.ReactNode; requiresData?: boolean; countBadge?: string | number }[] = [
    { id: 'home', label: 'Command Center', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'upload', label: 'Dataset Upload', icon: <UploadCloud className="w-4 h-4" /> },
    { id: 'quality', label: 'Data Quality Audit', icon: <FileCheck2 className="w-4 h-4" />, requiresData: true },
    { id: 'eda', label: 'Exploratory EDA', icon: <BarChart3 className="w-4 h-4" />, requiresData: true },
    { id: 'stat_tests', label: 'Statistical Tests', icon: <Binary className="w-4 h-4" />, requiresData: true },
    { id: 'training', label: 'Model Training', icon: <Cpu className="w-4 h-4" />, requiresData: true },
    { id: 'comparison', label: 'Model Comparison', icon: <GitCompare className="w-4 h-4" />, countBadge: modelsCount > 0 ? modelsCount : undefined },
    { id: 'single_pred', label: 'Claim Prediction', icon: <Target className="w-4 h-4" /> },
    { id: 'batch_pred', label: 'Batch Inference', icon: <Layers className="w-4 h-4" /> },
    { id: 'explain', label: 'Explainability & SHAP', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports & Artifacts', icon: <Download className="w-4 h-4" /> },
    { id: 'security', label: 'Security & Audit', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const sidebarContent = (
    <div className="w-64 bg-[#0B1020] text-slate-300 flex flex-col h-full border-r border-slate-800/80 shadow-2xl">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              ClaimPredict <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30">AI</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">STATISTICAL RISK SUITE</p>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 tracking-wider">
          INTELLIGENCE MODULES
        </div>
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const isDisabled = item.requiresData && !datasetLoaded;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (!isDisabled) {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }
              }}
              disabled={isDisabled}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30'
                  : isDisabled
                  ? 'text-slate-600 cursor-not-allowed opacity-40'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3 whitespace-nowrap truncate">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.countBadge !== undefined && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-400/20 text-violet-300 border border-violet-400/30 font-mono">
                  {item.countBadge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Dataset Status */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 text-xs shrink-0 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Dataset Memory</span>
          <span className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>
        <div className="font-semibold text-slate-200 truncate text-xs">
          {datasetLoaded ? 'Insurance claims data.csv' : 'No dataset loaded'}
        </div>
        <p className="text-[11px] text-slate-400 font-mono">
          {datasetLoaded ? '58,592 records · 41 features' : 'Upload or load benchmark'}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 shrink-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 h-full shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
