import React from 'react';
import {
  Shield,
  UserCheck,
  Server,
  Lock,
  Database,
  RefreshCw,
  Smartphone,
  Tablet,
  Monitor,
  Menu,
  Zap,
} from 'lucide-react';
import { UserRole, UserSession } from '../types';

export type DeviceViewMode = 'laptop' | 'tablet' | 'mobile';

interface HeaderProps {
  currentPageTitle: string;
  session: UserSession;
  onRoleChange: (newRole: UserRole) => void;
  datasetRowsCount: number;
  isSyncing: boolean;
  onRefreshSync: () => void;
  deviceView: DeviceViewMode;
  onDeviceViewChange: (mode: DeviceViewMode) => void;
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPageTitle,
  session,
  onRoleChange,
  datasetRowsCount,
  isSyncing,
  onRefreshSync,
  deviceView,
  onDeviceViewChange,
  onToggleMobileSidebar,
}) => {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#0B1020]/80 backdrop-blur-xl sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-3 text-slate-100">
      {/* Left: Mobile Menu Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors focus:outline-none"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Trail */}
        <div className="flex items-center gap-2.5 text-xs font-medium text-slate-400">
          <span className="hidden sm:inline text-slate-400 font-semibold tracking-wide">INSURANCE INTELLIGENCE</span>
          <span className="hidden sm:inline text-slate-600">/</span>
          <span className="text-white font-bold tracking-tight text-sm truncate max-w-[150px] sm:max-w-none flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {currentPageTitle}
          </span>
        </div>
      </div>

      {/* Middle: Device Viewport Switcher (Laptop / Tablet / Mobile) */}
      <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-medium shrink-0 shadow-inner">
        <button
          onClick={() => onDeviceViewChange('laptop')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
            deviceView === 'laptop'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Laptop View (1440px)"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Laptop</span>
        </button>

        <button
          onClick={() => onDeviceViewChange('tablet')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
            deviceView === 'tablet'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Tablet View (768px)"
        >
          <Tablet className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Tablet</span>
        </button>

        <button
          onClick={() => onDeviceViewChange('mobile')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
            deviceView === 'mobile'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Mobile Phone View (390px)"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Mobile</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Dataset Sync Status */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono tabular-nums font-semibold text-white">{datasetRowsCount.toLocaleString()}</span>
          <span className="text-slate-500">records</span>
          <button
            onClick={onRefreshSync}
            disabled={isSyncing}
            className="ml-1 p-0.5 text-slate-400 hover:text-cyan-400 transition-colors disabled:animate-spin cursor-pointer"
            title="Sync dataset across instances"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Security Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/60 text-emerald-400 rounded-lg text-xs font-semibold border border-emerald-500/30">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>E2E AES-256</span>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-1.5">
          <select
            value={session.role}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="text-xs font-semibold bg-slate-900/90 text-slate-200 py-1.5 px-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all cursor-pointer max-w-[120px] sm:max-w-none truncate"
          >
            <option value="admin">Admin (Lead DS)</option>
            <option value="actuary">Actuary / Analyst</option>
            <option value="underwriter">Underwriter / Agent</option>
          </select>
        </div>
      </div>
    </header>
  );
};
