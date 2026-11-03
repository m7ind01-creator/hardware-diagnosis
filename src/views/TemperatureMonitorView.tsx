import React from 'react';
import { useHardware } from '../context/HardwareContext';
import { RealtimeAreaChart } from '../components/ChartComponents';
import { StatusBadge, DataSourceBadge } from '../components/StatusBadge';
import { 
  Thermometer, 
  Flame, 
  ShieldCheck, 
  AlertTriangle, 
  Server, 
  Settings as SettingsIcon,
  HelpCircle,
  Activity
} from 'lucide-react';

export const TemperatureMonitorView: React.FC = () => {
  const { 
    thermals, 
    settings, 
    historicalTelemetry, 
    setIsAgentModalOpen, 
    setActiveView 
  } = useHardware();

  // Extract CPU temp history if available
  const tempHistory = historicalTelemetry
    .map(p => p.cpuTemp)
    .filter((t): t is number => t !== null);

  const fallbackTempHistory = tempHistory.length > 0 ? tempHistory : [42, 43, 44, 45];

  const activeSensors = thermals.filter(s => s.currentTempC !== null);
  const unavailableSensors = thermals.filter(s => s.currentTempC === null);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <Thermometer className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Hardware Thermal Sensor Matrix
              </h2>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {activeSensors.length} Active / {thermals.length} Registered
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Component-specific thermal envelopes • Warning limit: {settings.tempWarningThresholdC}°C • Critical limit: {settings.tempCriticalThresholdC}°C
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('settings')}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
        >
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>Configure Thresholds</span>
        </button>
      </div>

      {/* Notice if sensors are unavailable without agent */}
      {activeSensors.length === 0 && (
        <div className="p-5 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/20 space-y-3">
          <div className="flex items-start gap-3">
            <Server className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-blue-900 dark:text-blue-200">
                Temperature monitoring requires the local diagnostic agent and compatible hardware sensors.
              </h3>
              <p className="text-xs text-blue-800/80 dark:text-blue-300/80 leading-relaxed max-w-2xl">
                Web browsers run in an isolated operating environment that cannot read hardware thermistors or ACPI thermal zones directly. Running the lightweight, zero-dependency Local Agent on localhost immediately unlocks live temperature feeds.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => setIsAgentModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Server className="w-3.5 h-3.5" />
              <span>Connect Local Agent (127.0.0.1)</span>
            </button>
          </div>
        </div>
      )}

      {/* Thermal Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {thermals.map((sensor) => {
          const hasVal = sensor.currentTempC !== null;
          let tempColor = 'text-emerald-500';
          if (hasVal && sensor.currentTempC! >= sensor.criticalThresholdC) {
            tempColor = 'text-rose-500';
          } else if (hasVal && sensor.currentTempC! >= sensor.warningThresholdC) {
            tempColor = 'text-amber-500';
          }

          return (
            <div
              key={sensor.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  {sensor.component}
                </span>
                <StatusBadge status={sensor.status} size="sm" />
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate" title={sensor.label}>
                  {sensor.label}
                </h4>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className={`text-3xl font-extrabold font-mono tracking-tight ${hasVal ? tempColor : 'text-slate-400'}`}>
                    {hasVal ? sensor.currentTempC : 'N/A'}
                  </span>
                  {hasVal && (
                    <span className="text-sm font-bold text-slate-400 font-mono">°C</span>
                  )}
                </div>
              </div>

              {hasVal ? (
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Min: {sensor.minTempC || sensor.currentTempC}°C</span>
                    <span>Max: {sensor.maxTempC || sensor.currentTempC}°C</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full ${sensor.currentTempC! > sensor.warningThresholdC ? 'bg-rose-500' : 'bg-emerald-500'} transition-all`}
                      style={{ width: `${Math.min(100, Math.max(10, (sensor.currentTempC! / 100) * 100))}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>Safe (&lt;{sensor.warningThresholdC}°C)</span>
                    <span>Critical (&gt;{sensor.criticalThresholdC}°C)</span>
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 font-mono">
                  <span>Reading unavailable in browser sandbox</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Temperature History Chart if data points exist */}
      {tempHistory.length > 1 && (
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-4">
          <RealtimeAreaChart
            data={tempHistory}
            title="CPU Package Thermal Trend (°C)"
            unit="°C"
            color="#DF5555"
            height={160}
            maxVal={105}
            minVal={25}
          />
        </div>
      )}
    </div>
  );
};
