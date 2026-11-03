import React, { useState } from 'react';
import { useHardware } from '../context/HardwareContext';
import { StatusBadge, DataSourceBadge } from '../components/StatusBadge';
import { 
  HardDrive, 
  Activity, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Disc, 
  Server,
  Database,
  Info,
  FolderOpen
} from 'lucide-react';

export const StorageHealthView: React.FC = () => {
  const { 
    storage, 
    diagnostics, 
    runSingleDiagnostic, 
    isDiagnosticRunning,
    setIsAgentModalOpen,
    authorizeFileSystemAccess,
    permissionsState 
  } = useHardware();

  const [selectedDriveId, setSelectedDriveId] = useState<string>(storage[0]?.id || 'drive-0');

  const storageTest = diagnostics.find(d => d.id === 'test-storage');
  const activeDrive = storage.find(d => d.id === selectedDriveId) || storage[0];

  const handleRunStorageTest = async () => {
    await runSingleDiagnostic('test-storage');
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex-shrink-0">
            <HardDrive className="w-5 sm:w-6 h-5 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Storage Health &amp; S.M.A.R.T. Monitor
              </h2>
              <DataSourceBadge source={activeDrive?.dataSource || 'live-browser'} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
              {storage.length} Storage {storage.length === 1 ? 'Volume' : 'Volumes'} Detected • Solid State &amp; Mechanical Drive Health
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {storage.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDriveId(d.id)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                (activeDrive?.id === d.id)
                  ? 'bg-amber-500 text-white border-amber-500 font-bold'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-amber-400'
              }`}
            >
              {d.name.slice(0, 18)}
            </button>
          ))}

          <button
            onClick={authorizeFileSystemAccess}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/60 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 text-xs font-medium transition-colors cursor-pointer"
            title="Authorize real drive/folder access via File System Access API"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Authorize Drive / Folder</span>
          </button>
        </div>
      </div>

      {/* Selected Drive Capacity Card */}
      {activeDrive && (
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-3.5 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {activeDrive.name}
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Model: {activeDrive.model} • Type: {activeDrive.type}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={activeDrive.healthStatus} size="md" />
              {activeDrive.temperatureC && (
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {activeDrive.temperatureC} °C
                </span>
              )}
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between text-xs font-mono gap-1">
              <span className="text-slate-500">
                Used: <strong className="text-slate-800 dark:text-slate-200">{Math.round(activeDrive.usedBytes / (1024**3))} GB</strong> ({Math.round((activeDrive.usedBytes / (activeDrive.totalBytes || 1)) * 100)}%)
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                Available: {Math.round(activeDrive.availableBytes / (1024**3))} GB Free
              </span>
              <span className="text-slate-400">
                Total: {Math.round(activeDrive.totalBytes / (1024**3))} GB
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-inner">
              <div
                className="h-full bg-amber-500 transition-all duration-500"
                style={{ width: `${Math.round((activeDrive.usedBytes / (activeDrive.totalBytes || 1)) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* SMART Health Attributes Table */}
      <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-3.5 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              S.M.A.R.T. Health Status &amp; Telemetry Registers
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Self-Monitoring, Analysis and Reporting Technology
          </span>
        </div>

        {activeDrive?.smartAttributes && activeDrive.smartAttributes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Attribute Description</th>
                  <th className="py-2.5 px-3">Normalized</th>
                  <th className="py-2.5 px-3">Worst</th>
                  <th className="py-2.5 px-3">Threshold</th>
                  <th className="py-2.5 px-3">Raw Value / Data</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {activeDrive.smartAttributes.map((attr) => (
                  <tr key={attr.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="py-2.5 px-3 text-slate-400">0x{attr.id.toString(16).padStart(2, '0').toUpperCase()}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">{attr.name}</td>
                    <td className="py-2.5 px-3">{attr.value}</td>
                    <td className="py-2.5 px-3 text-slate-400">{attr.worst}</td>
                    <td className="py-2.5 px-3 text-slate-400">{attr.threshold}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-700 dark:text-slate-300">{attr.raw}</td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={attr.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
            <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Direct Host S.M.A.R.T. Registers Not Exposed via Browser Sandbox
              </p>
              <p className="leading-relaxed">
                Modern web browsers do not permit direct physical drive controller access for security reasons. Connect the <strong>Local Diagnostic Agent</strong> to query physical drive firmware registers, reallocated sector counts, and NAND wear life.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Storage I/O Read/Write Diagnostic Runner */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-500" />
              <span>Storage I/O Read/Write &amp; Quota Throughput Benchmark</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Measures transaction throughput and verifies origin volume quota allocations.
            </p>
          </div>

          <StatusBadge status={storageTest?.status || 'idle'} size="sm" />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handleRunStorageTest}
            disabled={isDiagnosticRunning}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isDiagnosticRunning ? 'Testing Storage...' : 'Run Storage Benchmark'}</span>
          </button>

          {storageTest && storageTest.status !== 'idle' && (
            <div className="text-right text-xs font-mono space-y-0.5">
              <span className="text-slate-500 block">Status: {storageTest.status.toUpperCase()}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{storageTest.resultSummary}</span>
            </div>
          )}
        </div>

        {storageTest?.metricsResult && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs font-mono">
            {Object.entries(storageTest.metricsResult).map(([k, v]) => (
              <div key={k}>
                <span className="text-slate-400 block text-[10px]">{k}</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
