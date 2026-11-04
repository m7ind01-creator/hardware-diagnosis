/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useHardware } from '../context/HardwareContext';
import { 
  Flame, 
  HardDrive, 
  AlertTriangle, 
  X, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Clock, 
  ShieldAlert 
} from 'lucide-react';

export const InAppAlertBanner: React.FC = () => {
  const { 
    activeAlerts, 
    dismissAlert, 
    snoozeAlert, 
    setActiveView, 
    settings, 
    updateSettings 
  } = useHardware();

  const visibleAlerts = activeAlerts.filter(a => !a.dismissed);

  if (visibleAlerts.length === 0) return null;

  return (
    <div 
      className="fixed top-16 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-md w-[calc(100vw-2rem)] sm:w-96 pointer-events-none"
      role="region"
      aria-live="assertive"
      aria-label="Hardware Critical Alerts"
    >
      {visibleAlerts.map((alert) => {
        const isCritical = alert.severity === 'critical';
        const isThermal = alert.type.startsWith('temperature');

        return (
          <div
            key={alert.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-3 fade-in ${
              isCritical
                ? 'bg-rose-950/90 dark:bg-rose-950/95 border-rose-500/80 text-white shadow-rose-950/40'
                : 'bg-amber-950/90 dark:bg-amber-950/95 border-amber-500/80 text-white shadow-amber-950/40'
            }`}
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  isCritical 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {isThermal ? (
                    <Flame className="w-5 h-5 text-rose-400" />
                  ) : (
                    <HardDrive className="w-5 h-5 text-amber-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-extrabold font-mono tracking-wider px-1.5 py-0.5 rounded uppercase ${
                      isCritical ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-900'
                    }`}>
                      {alert.severity} ALERT
                    </span>
                    <span className="text-[11px] text-slate-300 font-mono">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm tracking-tight text-white mt-0.5">
                    {alert.title}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Audio Mute / Unmute Toggle */}
                <button
                  onClick={() => updateSettings({ audioAlerts: !settings.audioAlerts })}
                  className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                  title={settings.audioAlerts ? "Mute alert audio chimes" : "Enable alert audio chimes"}
                  aria-label="Toggle audio alert chime"
                >
                  {settings.audioAlerts ? (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {/* Dismiss button */}
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                  title="Dismiss alert"
                  aria-label="Dismiss alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description & Readings */}
            <p className="text-xs text-slate-200 mt-2 leading-relaxed">
              {alert.message}
            </p>

            <div className="flex items-center justify-between text-xs font-mono bg-black/30 px-2.5 py-1.5 rounded-lg border border-white/10 mt-2.5">
              <span className="text-slate-300">Live Reading: <strong className={isCritical ? 'text-rose-300 font-bold' : 'text-amber-300 font-bold'}>{alert.currentValue}</strong></span>
              <span className="text-slate-400">Limit: {alert.thresholdValue}</span>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-white/10 text-xs">
              <button
                onClick={() => snoozeAlert(alert.id, 5 * 60 * 1000)}
                className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Snooze (5m)</span>
              </button>

              <button
                onClick={() => {
                  setActiveView(alert.viewTarget);
                  dismissAlert(alert.id);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                  isCritical 
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm' 
                    : 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm'
                }`}
              >
                <span>Inspect {alert.component}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
