import React, { useState } from 'react';
import { useHardware } from '../context/HardwareContext';
import { RealtimeAreaChart } from '../components/ChartComponents';
import { 
  LineChart, 
  Clock, 
  Pause, 
  Play, 
  Trash2, 
  Sliders, 
  Activity,
  Cpu,
  MemoryStick,
  Thermometer,
  Tv
} from 'lucide-react';

export const PerformanceHistoryView: React.FC = () => {
  const { 
    historicalTelemetry, 
    isMonitoringPaused, 
    setMonitoringPaused, 
    clearHistory, 
    settings, 
    updateSettings 
  } = useHardware();

  const [timeWindow, setTimeWindow] = useState<'15m' | '1h' | '24h' | '7d'>('15m');
  const [activeMetric, setActiveMetric] = useState<'cpu' | 'ram' | 'gpu' | 'temp'>('cpu');

  const cpuData = historicalTelemetry.map(p => p.cpuUsage);
  const ramData = historicalTelemetry.map(p => p.ramUsage);
  const gpuData = historicalTelemetry.map(p => p.gpuUsage ?? 15);
  const tempData = historicalTelemetry.map(p => p.cpuTemp ?? 45);

  const getMetricData = () => {
    switch (activeMetric) {
      case 'cpu': return { data: cpuData, title: 'CPU Utilization (%)', unit: '%', color: '#2563EB', max: 100 };
      case 'ram': return { data: ramData, title: 'Memory Usage (%)', unit: '%', color: '#10B981', max: 100 };
      case 'gpu': return { data: gpuData, title: 'GPU Utilization (%)', unit: '%', color: '#8B5CF6', max: 100 };
      case 'temp': return { data: tempData, title: 'CPU Die Temperature (°C)', unit: '°C', color: '#EF4444', max: 100 };
    }
  };

  const currentMetric = getMetricData();
  const validPoints = currentMetric.data.length > 0 ? currentMetric.data : [0];
  const max = Math.max(...validPoints);
  const min = Math.min(...validPoints);
  const avg = Math.round(validPoints.reduce((a, b) => a + b, 0) / validPoints.length);

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex-shrink-0">
            <LineChart className="w-5 sm:w-6 h-5 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              System Performance Telemetry History
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
              {historicalTelemetry.length} stored time-series samples • Sampling interval: {settings.refreshIntervalMs}ms
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Pause / Resume Button */}
          <button
            onClick={() => setMonitoringPaused(!isMonitoringPaused)}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer min-h-[40px] ${
              isMonitoringPaused
                ? 'bg-amber-500 text-white border-amber-500'
                : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
          >
            {isMonitoringPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isMonitoringPaused ? 'Resume Recording' : 'Pause Live Stream'}</span>
          </button>

          <button
            onClick={clearHistory}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer min-h-[40px]"
            title="Clear stored historical telemetry"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Buffer</span>
          </button>
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-2 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveMetric('cpu')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeMetric === 'cpu'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span>Processor (CPU)</span>
          </button>

          <button
            onClick={() => setActiveMetric('ram')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeMetric === 'ram'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MemoryStick className="w-3.5 h-3.5 text-emerald-600" />
            <span>Memory (RAM)</span>
          </button>

          <button
            onClick={() => setActiveMetric('gpu')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeMetric === 'gpu'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Tv className="w-3.5 h-3.5 text-purple-600" />
            <span>Graphics (GPU)</span>
          </button>

          <button
            onClick={() => setActiveMetric('temp')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeMetric === 'temp'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5 text-rose-500" />
            <span>Thermals</span>
          </button>
        </div>

        {/* Time window toggles */}
        <div className="flex items-center gap-1 text-xs font-mono">
          <span className="text-slate-400 mr-1 hidden sm:inline">Window:</span>
          {(['15m', '1h', '24h', '7d'] as const).map((w) => (
            <button
              key={w}
              onClick={() => setTimeWindow(w)}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                timeWindow === w
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Main Historical Chart */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-5">
        <RealtimeAreaChart
          data={currentMetric.data}
          title={currentMetric.title}
          unit={currentMetric.unit}
          color={currentMetric.color}
          height={200}
          maxVal={currentMetric.max}
          minVal={0}
        />

        {/* Statistical Rollup Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center font-mono">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
            <span className="text-[10px] uppercase text-slate-400 block">Minimum Value</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">{min}{currentMetric.unit}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
            <span className="text-[10px] uppercase text-slate-400 block">Average Value</span>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{avg}{currentMetric.unit}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
            <span className="text-[10px] uppercase text-slate-400 block">Peak Recorded</span>
            <span className="text-xl font-bold text-rose-600 dark:text-rose-400">{max}{currentMetric.unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
