import React from 'react';
import { useHardware } from '../context/HardwareContext';
import { StatusBadge } from '../components/StatusBadge';
import { 
  Stethoscope, 
  Play, 
  Square, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Save, 
  Download, 
  ClipboardCheck,
  Cpu,
  MemoryStick,
  HardDrive,
  Tv,
  Thermometer,
  Battery,
  Laptop
} from 'lucide-react';

export const DiagnosticCenterView: React.FC = () => {
  const { 
    diagnostics, 
    runFullDiagnostic, 
    runSingleDiagnostic, 
    cancelDiagnostic, 
    isDiagnosticRunning, 
    activeDiagnosticTestId, 
    overallDiagnosticProgress,
    saveCurrentReport,
    setActiveView 
  } = useHardware();

  const passedCount = diagnostics.filter(d => d.status === 'passed').length;
  const warningCount = diagnostics.filter(d => d.status === 'warning').length;
  const failedCount = diagnostics.filter(d => d.status === 'failed').length;
  const skippedCount = diagnostics.filter(d => d.status === 'skipped').length;
  const unsupportedCount = diagnostics.filter(d => d.status === 'unsupported').length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'CPU': return Cpu;
      case 'Memory': return MemoryStick;
      case 'Storage': return HardDrive;
      case 'GPU': return Tv;
      case 'Thermal': return Thermometer;
      case 'Battery': return Battery;
      default: return Laptop;
    }
  };

  const handleSaveAndReview = () => {
    const report = saveCurrentReport();
    setActiveView('reports');
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner & Full Diagnostic Trigger */}
      <div className="p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-xs space-y-4 sm:space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 flex-shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Hardware Diagnostic Test Suite
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Execute safe, comprehensive hardware verification routines across all major subsystems
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
            {isDiagnosticRunning ? (
              <button
                onClick={cancelDiagnostic}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors cursor-pointer min-h-[38px]"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Cancel Tests</span>
              </button>
            ) : (
              <button
                onClick={runFullDiagnostic}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer min-h-[38px]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Full Diagnostic Scan</span>
              </button>
            )}

            <button
              onClick={handleSaveAndReview}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors cursor-pointer min-h-[38px]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Report</span>
            </button>
          </div>
        </div>

        {/* Live Progress Bar when Running */}
        {isDiagnosticRunning && (
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                <span>Testing Subsystem: {diagnostics.find(d => d.id === activeDiagnosticTestId)?.name || 'Initializing...'}</span>
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                {overallDiagnosticProgress}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-inner">
              <div
                className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                style={{ width: `${overallDiagnosticProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Test Outcome Breakdown Chips */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-mono">
          <span className="text-slate-400">Diagnostic Summary:</span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold">
            {passedCount} Passed
          </span>
          <span className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 font-semibold">
            {warningCount} Warnings
          </span>
          <span className="px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-semibold">
            {failedCount} Failed
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            {skippedCount} Skipped (Requires Agent)
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            {unsupportedCount} Unsupported
          </span>
        </div>
      </div>

      {/* Individual Diagnostic Test Cards */}
      <div className="space-y-3">
        {diagnostics.map((test) => {
          const CategoryIcon = getCategoryIcon(test.category);
          const isCurrentActive = activeDiagnosticTestId === test.id;

          return (
            <div
              key={test.id}
              className={`p-4 sm:p-5 rounded-xl border transition-colors ${
                isCurrentActive
                  ? 'border-blue-500 shadow-sm bg-blue-50/20 dark:bg-blue-950/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <CategoryIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        [{test.category}]
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {test.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {test.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <StatusBadge status={test.status} size="sm" />
                  <button
                    onClick={() => runSingleDiagnostic(test.id)}
                    disabled={isDiagnosticRunning}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Run</span>
                  </button>
                </div>
              </div>

              {/* Progress bar if active */}
              {isCurrentActive && (
                <div className="my-2.5 space-y-1">
                  <div className="flex justify-between text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                    <span>Executing test pass...</span>
                    <span className="tabular-nums">{test.progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-200 rounded-full"
                      style={{ width: `${test.progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Result Summary */}
              {test.resultSummary && (
                <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between font-mono text-slate-500">
                    <span>Outcome: <strong className="text-slate-800 dark:text-slate-200">{test.resultSummary}</strong></span>
                    {test.completedAt && <span className="text-[10px]">{test.completedAt}</span>}
                  </div>

                  {test.metricsResult && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-800 text-[11px] font-mono">
                      {Object.entries(test.metricsResult).map(([k, v]) => (
                        <div key={k}>
                          <span className="text-slate-400 block text-[9px] uppercase">{k}</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
