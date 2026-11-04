import React, { useState } from 'react';
import { useHardware } from '../context/HardwareContext';
import { 
  Settings, 
  Moon, 
  Sun, 
  Clock, 
  Thermometer, 
  HardDrive, 
  MemoryStick, 
  Cpu, 
  Server, 
  Radio, 
  ShieldCheck, 
  Trash2, 
  Check, 
  Info,
  Laptop,
  Volume2,
  VolumeX,
  Bell,
  Flame,
  Play
} from 'lucide-react';
import { soundAlertService } from '../services/soundAlertService';

export const SettingsView: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    clearHistory, 
    agentStatus, 
    testAgentConnection,
    setIsAgentModalOpen,
    triggerSimulatedAlert
  } = useHardware();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [localPort, setLocalPort] = useState(String(settings.agentPort || 49152));
  const [localToken, setLocalToken] = useState(settings.agentAuthToken || '');
  const [systemName, setSystemName] = useState(settings.systemNameOverride || '');

  const handleSaveSettings = () => {
    updateSettings({
      agentPort: parseInt(localPort, 10) || 49152,
      agentAuthToken: localToken,
      systemNameOverride: systemName
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 animate-in fade-in duration-300 max-w-4xl">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex-shrink-0">
            <Settings className="w-5 sm:w-6 h-5 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Application Settings &amp; Thresholds
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize diagnostic thresholds, agent connectivity, refresh timings, and visual theme
            </p>
          </div>
        </div>

        {savedSuccess && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold font-mono animate-in fade-in self-start sm:self-auto">
            <Check className="w-3.5 h-3.5" />
            <span>Saved Preferences</span>
          </span>
        )}
      </div>

      {/* Section 1: Appearance & Branding */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
          Appearance &amp; Branding
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Color Theme
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateSettings({ theme: 'dark' })}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                  settings.theme === 'dark'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark Mode</span>
              </button>

              <button
                onClick={() => updateSettings({ theme: 'light' })}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                  settings.theme === 'light'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light Mode</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Product Brand Name Override
            </label>
            <input
              type="text"
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              placeholder="RigSentinel"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Monitoring & Sampling Frequency */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Telemetry Sampling Intervals</span>
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Sensor Refresh Interval
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[1000, 2000, 3000, 5000].map((interval) => (
              <button
                key={interval}
                onClick={() => updateSettings({ refreshIntervalMs: interval })}
                className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-colors cursor-pointer ${
                  settings.refreshIntervalMs === interval
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {interval / 1000}s ({interval}ms)
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Recommended: 2000ms for continuous monitoring without background CPU overhead.
          </p>
        </div>
      </div>

      {/* Section 3: In-App Alert Notifications & Sound Chimes */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Hardware Critical Alerts &amp; Audio Notifications
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Real-Time Threshold Monitors
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Audio Chimes Toggle */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.audioAlerts ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                <span className="font-semibold text-slate-900 dark:text-white">Synthesized Audio Alerts</span>
              </div>
              <button
                onClick={() => updateSettings({ audioAlerts: !settings.audioAlerts })}
                className={`px-3 py-1 rounded-md text-xs font-bold font-mono transition-colors cursor-pointer ${
                  settings.audioAlerts
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {settings.audioAlerts ? 'ACTIVE' : 'MUTED'}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Plays a dual-frequency synthesized warning tone via Web Audio API whenever die temperatures exceed critical limits or storage health drops.
            </p>
            <button
              onClick={() => soundAlertService.playCriticalAlertSound()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Test Chime Sound</span>
            </button>
          </div>

          {/* Desktop Notifications Toggle */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-slate-900 dark:text-white">Browser Desktop Notifications</span>
              </div>
              <button
                onClick={async () => {
                  if (!settings.desktopNotifications) {
                    const granted = await soundAlertService.requestDesktopNotificationPermission();
                    updateSettings({ desktopNotifications: granted });
                  } else {
                    updateSettings({ desktopNotifications: false });
                  }
                }}
                className={`px-3 py-1 rounded-md text-xs font-bold font-mono transition-colors cursor-pointer ${
                  settings.desktopNotifications
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {settings.desktopNotifications ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Dispatches system notifications to your desktop even when RigSentinel runs in background browser tabs.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => triggerSimulatedAlert('thermal')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-[11px] font-medium hover:bg-rose-100 cursor-pointer"
              >
                <Flame className="w-3 h-3 text-rose-500" />
                <span>Simulate Overheat Alert</span>
              </button>
              <button
                onClick={() => triggerSimulatedAlert('storage')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] font-medium hover:bg-amber-100 cursor-pointer"
              >
                <HardDrive className="w-3 h-3 text-amber-500" />
                <span>Simulate Storage Alert</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Diagnostic Warning & Critical Thresholds */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
          Intelligent Anomaly Detection Thresholds
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
              <span>CPU Temperature Warning</span>
              <span className="font-mono text-amber-500 font-bold">{settings.tempWarningThresholdC}°C</span>
            </label>
            <input
              type="range"
              min="65"
              max="90"
              value={settings.tempWarningThresholdC}
              onChange={(e) => updateSettings({ tempWarningThresholdC: Number(e.target.value) })}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
              <span>CPU Temperature Critical Overheat</span>
              <span className="font-mono text-rose-500 font-bold">{settings.tempCriticalThresholdC}°C</span>
            </label>
            <input
              type="range"
              min="85"
              max="105"
              value={settings.tempCriticalThresholdC}
              onChange={(e) => updateSettings({ tempCriticalThresholdC: Number(e.target.value) })}
              className="w-full accent-rose-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
              <span>RAM Pressure Warning</span>
              <span className="font-mono text-amber-500 font-bold">{settings.memWarningThresholdPercent}%</span>
            </label>
            <input
              type="range"
              min="70"
              max="95"
              value={settings.memWarningThresholdPercent}
              onChange={(e) => updateSettings({ memWarningThresholdPercent: Number(e.target.value) })}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
              <span>Storage Low Space Warning</span>
              <span className="font-mono text-amber-500 font-bold">&lt; {settings.storageWarningThresholdPercent}% Free</span>
            </label>
            <input
              type="range"
              min="5"
              max="25"
              value={settings.storageWarningThresholdPercent}
              onChange={(e) => updateSettings({ storageWarningThresholdPercent: Number(e.target.value) })}
              className="w-full accent-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Local Diagnostic Agent Connection */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Local Diagnostic Daemon Bridge (127.0.0.1)
            </h3>
          </div>
          <button
            onClick={() => setIsAgentModalOpen(true)}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Agent Setup Modal →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Port
            </label>
            <input
              type="number"
              value={localPort}
              onChange={(e) => setLocalPort(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Authorization Token
            </label>
            <input
              type="text"
              value={localToken}
              onChange={(e) => setLocalToken(e.target.value)}
              placeholder="Leave blank if unset"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-mono text-slate-400">
            Agent Status: <strong className={agentStatus.state === 'connected' ? 'text-emerald-500' : 'text-slate-500'}>{agentStatus.state.toUpperCase()}</strong>
          </span>
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Apply &amp; Test Connection
          </button>
        </div>
      </div>

      {/* Section 5: Demonstration Mode & Privacy */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
          Data Privacy &amp; Simulation Controls
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/40 dark:bg-purple-950/20">
          <div>
            <h4 className="font-bold text-xs text-purple-900 dark:text-purple-200">
              Demonstration Mode (Simulated Enterprise Hardware Profile)
            </h4>
            <p className="text-xs text-purple-800/80 dark:text-purple-300/80 mt-0.5">
              Generates authentic simulated workstation hardware metrics (Intel Core i9-13900HX, RTX 4080, Samsung 990 PRO NVMe with SMART records) for testing.
            </p>
          </div>
          <button
            onClick={() => updateSettings({ demoMode: !settings.demoMode })}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-colors ${
              settings.demoMode
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300'
            }`}
          >
            {settings.demoMode ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
              Clear Saved Telemetry History
            </span>
            <span className="text-xs text-slate-400">
              Removes all locally stored time-series telemetry points from browser storage.
            </span>
          </div>
          <button
            onClick={clearHistory}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-300 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold text-rose-600 dark:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge Telemetry</span>
          </button>
        </div>
      </div>
    </div>
  );
};
