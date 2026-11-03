import React, { useState } from 'react';
import { useHardware } from '../context/HardwareContext';
import { StatusBadge, DataSourceBadge } from '../components/StatusBadge';
import { 
  Tv, 
  Activity, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Layers, 
  Gauge,
  Flame,
  Server
} from 'lucide-react';

export const GpuMonitorView: React.FC = () => {
  const { 
    gpu, 
    diagnostics, 
    runSingleDiagnostic, 
    isDiagnosticRunning,
    setIsAgentModalOpen 
  } = useHardware();

  const gpuTest = diagnostics.find(d => d.id === 'test-gpu');

  const handleRunGpuTest = async () => {
    await runSingleDiagnostic('test-gpu');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {gpu.renderer || gpu.model}
              </h2>
              <DataSourceBadge source={gpu.dataSource} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Vendor: {gpu.vendor} • {gpu.isDiscrete ? 'Dedicated Discrete GPU' : 'Integrated Graphics Accelerator'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center">
            <span className="text-slate-400 text-[10px] block">3D ACCELERATION</span>
            <span className="text-base font-bold text-purple-600 dark:text-purple-400">
              {gpu.webglVersion}
            </span>
          </div>
          <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center">
            <span className="text-slate-400 text-[10px] block">GPU DIE TEMP</span>
            <span className={`text-base font-bold ${gpu.temperatureC ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}`}>
              {gpu.temperatureC ? `${gpu.temperatureC} °C` : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* GPU Hardware Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Dedicated Video Memory (VRAM)</span>
          <p className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
            {gpu.dedicatedMemoryMB ? `${gpu.dedicatedMemoryMB} MB` : 'Shared Memory'}
          </p>
          <span className="text-xs text-slate-500">
            {gpu.dedicatedMemoryMB ? `${(gpu.dedicatedMemoryMB / 1024).toFixed(1)} GB GDDR` : 'Dynamically allocated'}
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Max Texture Resolution</span>
          <p className="text-xl font-extrabold font-mono text-purple-600 dark:text-purple-400">
            {gpu.maxTextureSize} × {gpu.maxTextureSize}
          </p>
          <span className="text-xs text-slate-500">Hardware rasterization limit</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Driver Version</span>
          <p className="text-xl font-extrabold font-mono text-slate-900 dark:text-white truncate" title={gpu.driverVersion || 'Native Driver'}>
            {gpu.driverVersion || 'OS Managed'}
          </p>
          <span className="text-xs text-slate-500">{gpu.extensionsCount} extensions loaded</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">GPU Utilization</span>
          <p className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
            {gpu.utilization !== null ? `${gpu.utilization}%` : 'Agent Req.'}
          </p>
          <span className="text-xs text-slate-500">
            {gpu.utilization !== null ? 'Hardware compute load' : 'Requires Local Agent'}
          </span>
        </div>
      </div>

      {/* GPU Shader Pipeline & Render Timing Diagnostic */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span>GPU Shader Pipeline &amp; Draw Call Latency Benchmark</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Compiles GLSL vertex and fragment shaders and tests synchronous off-screen draw call pipeline latency.
            </p>
          </div>

          <StatusBadge status={gpuTest?.status || 'idle'} size="sm" />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handleRunGpuTest}
            disabled={isDiagnosticRunning}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isDiagnosticRunning ? 'Testing Shaders...' : 'Run GPU Benchmark'}</span>
          </button>

          {gpuTest && gpuTest.status !== 'idle' && (
            <div className="text-right text-xs font-mono space-y-0.5">
              <span className="text-slate-500 block">Status: {gpuTest.status.toUpperCase()}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{gpuTest.resultSummary}</span>
            </div>
          )}
        </div>

        {gpuTest?.metricsResult && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs font-mono">
            {Object.entries(gpuTest.metricsResult).map(([k, v]) => (
              <div key={k}>
                <span className="text-slate-400 block text-[10px]">{k}</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Supported APIs list */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Supported Graphics APIs &amp; Acceleration Modules</span>
        </h3>

        <div className="flex flex-wrap gap-2">
          {gpu.supportedAPIs.map((api, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-slate-700 dark:text-slate-300"
            >
              {api}
            </span>
          ))}
        </div>
      </div>

      {/* Advisory for unsupported GPU temperatures in browser */}
      {gpu.temperatureC === null && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
            <Flame className="w-4 h-4 text-slate-400" />
            <span>GPU die temperature and fan tachometer readings require the Local Diagnostic Agent.</span>
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
