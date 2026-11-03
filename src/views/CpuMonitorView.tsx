import React, { useState } from 'react';
import { useHardware } from '../context/HardwareContext';
import { RealtimeAreaChart, CoreActivityGrid } from '../components/ChartComponents';
import { StatusBadge, DataSourceBadge } from '../components/StatusBadge';
import { 
  Cpu, 
  Flame, 
  Activity, 
  Play, 
  Square, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Info,
  Server
} from 'lucide-react';

export const CpuMonitorView: React.FC = () => {
  const { 
    cpu, 
    thermals, 
    runSingleDiagnostic, 
    diagnostics, 
    isDiagnosticRunning, 
    cancelDiagnostic,
    setIsAgentModalOpen 
  } = useHardware();

  const [benchmarkConfirmed, setBenchmarkConfirmed] = useState(false);

  // Find CPU diagnostic test results
  const cpuTest = diagnostics.find(d => d.id === 'test-cpu');

  const cpuThermal = thermals.find(s => s.component === 'CPU Package' || s.component === 'CPU Core');
  const tempVal = cpuThermal?.currentTempC ?? cpu.temperatureC;

  const handleStartBenchmark = async () => {
    await runSingleDiagnostic('test-cpu');
    setBenchmarkConfirmed(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Info Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {cpu.processorName}
              </h2>
              <DataSourceBadge source={cpu.dataSource} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {cpu.physicalCores} Physical Cores • {cpu.logicalProcessors} Logical Threads • {cpu.architecture}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center">
            <span className="text-slate-400 text-[10px] block">UTILIZATION</span>
            <span className="text-base font-bold text-blue-600 dark:text-blue-400">{cpu.utilization}%</span>
          </div>
          <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center">
            <span className="text-slate-400 text-[10px] block">TEMPERATURE</span>
            <span className={`text-base font-bold ${tempVal ? (tempVal > 85 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-200') : 'text-slate-400'}`}>
              {tempVal ? `${tempVal} °C` : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Real-time CPU Utilization Area Chart */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-4">
        <RealtimeAreaChart
          data={cpu.loadHistory}
          title="CPU Core Utilization History (Real-Time)"
          unit="%"
          color="#2563EB"
          height={160}
          maxVal={100}
          minVal={0}
        />
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>Clock: <strong className="text-slate-800 dark:text-slate-200">{cpu.currentFrequencyGhz} GHz</strong></span>
          <span>Base Clock: <strong className="text-slate-800 dark:text-slate-200">{cpu.baseFrequencyGhz} GHz</strong></span>
          {cpu.maxFrequencyGhz && <span>Max Boost: <strong className="text-slate-800 dark:text-slate-200">{cpu.maxFrequencyGhz} GHz</strong></span>}
          <span>Sampling Interval: <strong>2000 ms</strong></span>
        </div>
      </div>

      {/* Logical Cores / Schedulable Threads Activity Grid */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>Logical Thread Heatmap ({cpu.cores.length} Schedulable Threads)</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Per-thread compute distribution
          </span>
        </div>

        <CoreActivityGrid cores={cpu.cores} />
      </div>

      {/* CPU Benchmark & Diagnostic Section */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Safe CPU Computational Benchmark &amp; Thermal Drift Test</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Runs mathematical matrix transformations to measure instruction throughput and observe potential thermal throttling.
            </p>
          </div>

          <StatusBadge status={cpuTest?.status || 'idle'} size="sm" />
        </div>

        {/* Safety Warning & Disclaimer */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex gap-3 text-xs text-amber-900 dark:text-amber-200">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
          <div className="space-y-1">
            <p className="font-semibold">Benchmark Safety Protocol:</p>
            <p className="opacity-90 leading-relaxed">
              This benchmark temporarily elevates CPU computation for 4 seconds. You may cancel at any time. Notice: A successful benchmark indicates normal instruction execution and thermal stability under brief load, but does not definitively prove the processor is 100% free of intermittent defects.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {!benchmarkConfirmed && !isDiagnosticRunning ? (
            <button
              onClick={() => setBenchmarkConfirmed(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Initiate CPU Benchmark</span>
            </button>
          ) : isDiagnosticRunning ? (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                <span>Benchmarking CPU ({cpuTest?.progressPercent || 0}%)...</span>
              </div>
              <button
                onClick={cancelDiagnostic}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-medium hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Cancel</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Ready to start 4-second load pass?
              </span>
              <button
                onClick={handleStartBenchmark}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Confirm &amp; Run Test</span>
              </button>
              <button
                onClick={() => setBenchmarkConfirmed(false)}
                className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Test results readout */}
          {cpuTest && cpuTest.status !== 'idle' && (
            <div className="text-right text-xs font-mono space-y-1">
              <span className="text-slate-500 block">Completed at {cpuTest.completedAt || 'Recently'}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{cpuTest.resultSummary}</span>
            </div>
          )}
        </div>

        {/* Metrics result details */}
        {cpuTest?.metricsResult && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs font-mono">
            {Object.entries(cpuTest.metricsResult).map(([k, v]) => (
              <div key={k}>
                <span className="text-slate-400 block text-[10px]">{k}</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Agent connection advisory for thermal readings */}
      {cpu.temperatureC === null && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
            <Flame className="w-4 h-4 text-slate-400" />
            <span>CPU package die temperature requires the Local Diagnostic Agent (native ring-0 sensor access).</span>
          </div>
          <button
            onClick={() => setIsAgentModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-500 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
          >
            <Server className="w-3.5 h-3.5" />
            <span>Setup Local Agent</span>
          </button>
        </div>
      )}
    </div>
  );
};
