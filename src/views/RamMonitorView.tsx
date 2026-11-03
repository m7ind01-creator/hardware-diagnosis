import React, { useState } from 'react';
import { useHardware } from '../context/HardwareContext';
import { RealtimeAreaChart, MemoryDistributionBar } from '../components/ChartComponents';
import { StatusBadge, DataSourceBadge } from '../components/StatusBadge';
import { 
  MemoryStick, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  HelpCircle, 
  Activity, 
  Info,
  ExternalLink,
  Laptop
} from 'lucide-react';

export const RamMonitorView: React.FC = () => {
  const { 
    ram, 
    diagnostics, 
    runSingleDiagnostic, 
    isDiagnosticRunning 
  } = useHardware();

  const [showOsGuide, setShowOsGuide] = useState(false);

  const ramTest = diagnostics.find(d => d.id === 'test-ram');
  const totalGb = (ram.totalBytes / (1024**3)).toFixed(1);
  const usedGb = (ram.usedBytes / (1024**3)).toFixed(1);
  const availGb = (ram.availableBytes / (1024**3)).toFixed(1);

  const isPressureHigh = ram.utilizationPercent > 85;

  const handleRunRamCheck = async () => {
    await runSingleDiagnostic('test-ram');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <MemoryStick className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Physical System Memory (RAM)
              </h2>
              <DataSourceBadge source={ram.dataSource} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {ram.memoryType || 'System Memory'} • {ram.speedMhz || 3200} MHz • {ram.modulesCount || 2} Channels
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center">
            <span className="text-slate-400 text-[10px] block">UTILIZATION</span>
            <span className={`text-base font-bold ${isPressureHigh ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {ram.utilizationPercent}%
            </span>
          </div>
          <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center">
            <span className="text-slate-400 text-[10px] block">AVAILABLE</span>
            <span className="text-base font-bold text-slate-700 dark:text-slate-200">{availGb} GB</span>
          </div>
        </div>
      </div>

      {/* Memory Utilization Realtime Chart */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-4">
        <RealtimeAreaChart
          data={ram.history}
          title="Memory Utilization Trend (%)"
          unit="%"
          color="#2563EB"
          height={160}
          maxVal={100}
          minVal={0}
        />

        {/* Stacked Memory Distribution Bar */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Memory Allocation Breakdown
          </span>
          <MemoryDistributionBar
            usedPct={ram.utilizationPercent}
            availablePct={Math.max(0, 100 - ram.utilizationPercent)}
          />
        </div>
      </div>

      {/* Numerical Data Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Installed Capacity</span>
          <p className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">{totalGb} GB</p>
          <span className="text-xs text-slate-500">{ram.totalBytes.toLocaleString()} bytes</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">In-Use Memory</span>
          <p className="text-xl font-extrabold font-mono text-blue-600 dark:text-blue-400">{usedGb} GB</p>
          <span className="text-xs text-slate-500">{ram.utilizationPercent}% of physical RAM</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Available Free</span>
          <p className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">{availGb} GB</p>
          <span className="text-xs text-slate-500">{Math.max(0, 100 - ram.utilizationPercent)}% free headroom</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Browser Heap Quota</span>
          <p className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
            {ram.jsHeapUsedBytes ? `${Math.round(ram.jsHeapUsedBytes / (1024**2))} MB` : 'Dynamic'}
          </p>
          <span className="text-xs text-slate-500">
            {ram.jsHeapLimitBytes ? `of ${Math.round(ram.jsHeapLimitBytes / (1024**2))} MB limit` : 'V8 runtime'}
          </span>
        </div>
      </div>

      {/* Memory Diagnostics & Pattern Test */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Memory Allocation &amp; Pattern Integrity Diagnostic</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Allocates typed memory buffers, writes alternating bitmask patterns, and verifies checksum integrity.
            </p>
          </div>

          <StatusBadge status={ramTest?.status || 'idle'} size="sm" />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handleRunRamCheck}
            disabled={isDiagnosticRunning}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isDiagnosticRunning ? 'Testing Buffer...' : 'Run Memory Check'}</span>
          </button>

          {ramTest && ramTest.status !== 'idle' && (
            <div className="text-right text-xs font-mono space-y-0.5">
              <span className="text-slate-500 block">Status: {ramTest.status.toUpperCase()}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{ramTest.resultSummary}</span>
            </div>
          )}
        </div>

        {ramTest?.metricsResult && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs font-mono">
            {Object.entries(ramTest.metricsResult).map(([k, v]) => (
              <div key={k}>
                <span className="text-slate-400 block text-[10px]">{k}</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deep External OS Memory Diagnostics Guidance */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Deep Physical Hardware RAM Diagnostics (External OS Utilities)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Notice: True low-level physical RAM bit failure detection requires bare-metal boot testing.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowOsGuide(!showOsGuide)}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            {showOsGuide ? 'Hide Instructions' : 'View OS Instructions'}
          </button>
        </div>

        {showOsGuide && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            {/* Windows */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white block">Microsoft Windows</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                1. Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono">Win + R</kbd>.<br />
                2. Type <code className="text-blue-600 font-bold">mdsched.exe</code> and press Enter.<br />
                3. Choose "Restart now and check for problems (recommended)".<br />
                4. The system will boot into the Windows Memory Diagnostic environment and test all physical memory addresses.
              </p>
            </div>

            {/* macOS */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white block">Apple macOS</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                1. Shut down Mac completely.<br />
                2. On Apple Silicon: Press and hold Power button until "Loading startup options" appears, then press <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono">Cmd + D</kbd>.<br />
                3. On Intel Mac: Turn on Mac and immediately hold the <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono">D</kbd> key.<br />
                4. Apple Diagnostics will run full hardware checks.
              </p>
            </div>

            {/* Linux */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white block">Linux (MemTest86+)</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                1. On GRUB boot loader screen, choose "Memory Test (memtest86+)".<br />
                2. If not installed, install package: <code className="text-blue-600 font-bold">sudo apt install memtest86+</code>.<br />
                3. It runs exhaustive address bus, random pattern, and moving inversion stress tests.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
