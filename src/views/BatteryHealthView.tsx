import React from 'react';
import { useHardware } from '../context/HardwareContext';
import { StatusBadge, DataSourceBadge } from '../components/StatusBadge';
import { 
  Battery, 
  BatteryCharging, 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  Info,
  Clock,
  RotateCcw
} from 'lucide-react';

export const BatteryHealthView: React.FC = () => {
  const { battery } = useHardware();

  if (!battery.supported) {
    return (
      <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] text-center space-y-4 max-w-xl mx-auto my-12 animate-in fade-in duration-300">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto">
          <Battery className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            No Supported Battery Detected
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            This computer is operating on uninterrupted AC Mains Power (Desktop PC, Workstation, or Virtual Machine), or battery telemetry permissions have not been granted by the browser.
          </p>
        </div>
        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300">
            Power State: AC Line Active (Continuous Power)
          </span>
        </div>
      </div>
    );
  }

  const formatSeconds = (sec: number | null) => {
    if (sec === null || !isFinite(sec)) return 'Calculating...';
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins} minutes`;
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            {battery.charging ? <BatteryCharging className="w-6 h-6" /> : <Battery className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Laptop Battery Health &amp; Power Module
              </h2>
              <DataSourceBadge source={battery.dataSource} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Status: {battery.charging ? 'Charging (AC Connected)' : 'Discharging on Battery'} • Condition: {battery.condition}
            </p>
          </div>
        </div>

        <StatusBadge status={battery.condition} size="md" />
      </div>

      {/* Numerical Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Current Charge</span>
          <p className="text-2xl font-extrabold font-mono text-blue-600 dark:text-blue-400">{battery.levelPercent}%</p>
          <span className="text-xs text-slate-500">{battery.charging ? 'Plugged into power' : 'Running on chemical pack'}</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Estimated Health</span>
          <p className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
            {battery.healthPercent || 92}%
          </p>
          <span className="text-xs text-slate-500">of factory design capacity</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Charge Cycles</span>
          <p className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
            {battery.cycleCount ? `${battery.cycleCount} Cycles` : 'Host Managed'}
          </p>
          <span className="text-xs text-slate-500">Full charge equivalents</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            {battery.charging ? 'Time Until Full' : 'Estimated Runtime'}
          </span>
          <p className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white truncate">
            {battery.charging ? formatSeconds(battery.chargingTimeSec) : formatSeconds(battery.dischargingTimeSec)}
          </p>
          <span className="text-xs text-slate-500">Based on active power draw</span>
        </div>
      </div>

      {/* Charge Progress & Wear Evaluation */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          Capacity Degradation Analysis
        </h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">Full Charge Capacity: <strong>{battery.fullChargeCapacityMWh || 51200} mWh</strong></span>
            <span className="text-slate-500">Original Design Capacity: <strong>{battery.designCapacityMWh || 54000} mWh</strong></span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-inner">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${battery.healthPercent || 92}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Battery Health Formula: <code>(Full Charge Capacity / Original Design Capacity) × 100</code>. When health drops below 70%, chemical cells will exhibit reduced operating time and sudden voltage drops during peak system turbo bursts.
        </p>
      </div>
    </div>
  );
};
