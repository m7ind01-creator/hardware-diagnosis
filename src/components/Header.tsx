import React, { useState } from 'react';
import { useHardware } from '../context/HardwareContext';
import { 
  RefreshCw, 
  Pause, 
  Play, 
  Bell, 
  Sun, 
  Moon, 
  Radio, 
  HardDrive, 
  Stethoscope, 
  CheckCircle2, 
  AlertTriangle,
  Server,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Menu
} from 'lucide-react';

interface HeaderProps {
  viewTitle: string;
}

export const Header: React.FC<HeaderProps> = ({ viewTitle }) => {
  const { 
    settings, 
    updateSettings, 
    healthScore, 
    healthStatus, 
    isProvisional, 
    agentStatus, 
    refreshHardwareData, 
    isMonitoringPaused, 
    setMonitoringPaused, 
    detectedIssues, 
    setIsAgentModalOpen, 
    setIsNotificationCenterOpen,
    runFullDiagnostic,
    isDiagnosticRunning,
    permissionsState,
    setIsPermissionModalOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    activeAlerts
  } = useHardware();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshHardwareData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  let scoreColor = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
  if (healthScore < 50) scoreColor = 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  else if (healthScore < 85) scoreColor = 'text-amber-500 bg-amber-500/10 border-amber-500/20';

  const authLevel = permissionsState.authorizationLevel;

  return (
    <div className="flex flex-col border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] flex-shrink-0 z-10">
      {/* Top Advisory Banner if in Sandbox mode */}
      {authLevel === 'sandbox' && !settings.demoMode && (
        <div className="px-3 sm:px-6 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 min-w-0">
            <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span className="truncate sm:whitespace-normal">
              <strong>Hardware Access:</strong> Running with standard browser permissions. Authorize full access to detect your exact hardware model, storage, and graphics specifications.
            </span>
          </div>
          <button
            onClick={() => setIsPermissionModalOpen(true)}
            className="inline-flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex-shrink-0 self-start sm:self-auto text-xs"
          >
            <span>Allow Full PC Access</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      )}

      {/* Main Header bar */}
      <header className="h-14 sm:h-16 px-3 sm:px-6 flex items-center justify-between gap-2">
        {/* Left Side: Mobile Menu Button + Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Hamburger Menu Toggle on Mobile/Tablet */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Title & View Context */}
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate max-w-[130px] xs:max-w-[180px] sm:max-w-xs md:max-w-md lg:max-w-none">
              {viewTitle}
            </h1>
          </div>

          {/* Demo Mode Notice */}
          {settings.demoMode && (
            <span className="hidden xl:inline-flex items-center gap-1.5 px-2 py-0.5 text-xs text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 rounded bg-purple-50 dark:bg-purple-950/40">
              <Radio className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              <span>Simulation Demo</span>
            </span>
          )}
        </div>

        {/* Right Side: Action Controls & Subsystem Statuses */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Hardware Access Authorization Button */}
          <button
            onClick={() => setIsPermissionModalOpen(true)}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
              authLevel === 'full'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                : authLevel === 'enhanced'
                ? 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
                : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 hover:bg-amber-100'
            }`}
            title="Manage Hardware Permissions"
          >
            <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden md:inline">Hardware Access:</span>
            <span className="capitalize text-[11px] sm:text-xs">
              {authLevel === 'full' ? 'Full Access' : authLevel === 'enhanced' ? 'Enhanced' : 'Authorize Access'}
            </span>
          </button>

          {/* Health score indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300">
            <span className={`w-2 h-2 rounded-full ${
              healthScore >= 85 ? 'bg-emerald-500' : healthScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
            }`} />
            <span className="tabular-nums font-semibold">{healthScore}% Health</span>
            {isProvisional && (
              <span className="text-[11px] text-slate-400" title="Provisional score from browser sensors.">
                (Standard)
              </span>
            )}
          </div>

          {/* Quick Diagnostic Button (visible on md+) */}
          <button
            onClick={runFullDiagnostic}
            disabled={isDiagnosticRunning}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Stethoscope className={`w-3.5 h-3.5 ${isDiagnosticRunning ? 'animate-spin' : ''}`} />
            <span>{isDiagnosticRunning ? 'Diagnosing...' : 'Run Diagnostics'}</span>
          </button>

          {/* Pause/Resume Live Polling */}
          <button
            onClick={() => setMonitoringPaused(!isMonitoringPaused)}
            className={`p-1.5 sm:p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
              isMonitoringPaused
                ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700'
                : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isMonitoringPaused ? 'Resume Live Telemetry' : 'Pause Live Telemetry'}
            aria-label={isMonitoringPaused ? 'Resume Live Telemetry' : 'Pause Live Telemetry'}
          >
            {isMonitoringPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Manual Refresh */}
          <button
            onClick={handleManualRefresh}
            className="p-1.5 sm:p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Refresh All Hardware Telemetry"
            aria-label="Refresh All Hardware Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setIsNotificationCenterOpen(true)}
            className={`relative p-1.5 sm:p-2 rounded-lg border transition-colors cursor-pointer ${
              activeAlerts.length > 0
                ? 'border-rose-500 bg-rose-50/20 text-rose-600 dark:text-rose-400 animate-pulse'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Notifications & Active Hardware Alerts"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {(activeAlerts.length > 0 || detectedIssues.length > 0) && (
              <span className={`absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                activeAlerts.length > 0 ? 'bg-rose-600 animate-bounce' : 'bg-blue-600'
              }`}>
                {activeAlerts.length || detectedIssues.length}
              </span>
            )}
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title={`Switch to ${settings.theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </header>
    </div>
  );
};
