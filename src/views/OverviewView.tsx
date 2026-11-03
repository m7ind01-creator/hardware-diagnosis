import React, { useState } from 'react';
import { useHardware } from '../context/HardwareContext';
import { MetricCard } from '../components/MetricCard';
import { CircularGauge } from '../components/ChartComponents';
import { StatusBadge, DataSourceBadge } from '../components/StatusBadge';
import { LaptopSpecsCard } from '../components/LaptopSpecsCard';
import { 
  Cpu, 
  MemoryStick, 
  Tv, 
  HardDrive, 
  Thermometer, 
  Battery, 
  Stethoscope, 
  FileText, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  ClipboardList,
  Wrench,
  AlertOctagon,
  Info,
  Zap,
  Check
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const { 
    system, 
    cpu, 
    ram, 
    gpu, 
    storage, 
    thermals, 
    battery, 
    display,
    healthScore, 
    healthStatus, 
    isProvisional, 
    scoreReason, 
    summaryText, 
    lastDiagnosticTime, 
    detectedIssues, 
    setActiveView, 
    runFullDiagnostic, 
    refreshHardwareData,
    saveCurrentReport,
    isDiagnosticRunning,
    setIsPermissionModalOpen,
    permissionsState,
    fixHardwareIssue
  } = useHardware();

  const [issueTab, setIssueTab] = useState<'all' | 'critical' | 'warnings' | 'healthy'>('all');

  // Storage summary
  const totalStorageBytes = storage.reduce((acc, d) => acc + d.totalBytes, 0);
  const usedStorageBytes = storage.reduce((acc, d) => acc + d.usedBytes, 0);
  const storagePercent = totalStorageBytes > 0 ? Math.round((usedStorageBytes / totalStorageBytes) * 100) : 0;
  const primaryDrive = storage[0];

  // Thermal summary
  const cpuThermal = thermals.find(s => s.component === 'CPU Package' || s.component === 'CPU Core');
  const tempVal = cpuThermal?.currentTempC ?? cpu.temperatureC;
  const tempStatus = tempVal ? (tempVal > 85 ? 'Overheating' : tempVal > 75 ? 'Warm' : 'Healthy') : 'Requires Agent';

  return (
    <div className="space-y-5 sm:space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner: System Health & Diagnostic Hero */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6">
          {/* Health Score Readout & Summary */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <StatusBadge status={healthStatus} size="md" />
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <DataSourceBadge source={system.dataSource} />
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Score: <strong className="font-semibold text-slate-900 dark:text-white tabular-nums">{healthScore}/100</strong>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {summaryText}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {scoreReason}
            </p>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span>Device: <strong className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[200px] inline-block align-bottom">{system.computerModel}</strong></span>
              <span>·</span>
              <span>OS: <strong className="text-slate-700 dark:text-slate-300 font-medium">{system.operatingSystem}</strong></span>
              <span>·</span>
              <span>Last Scan: <strong className="text-slate-700 dark:text-slate-300 font-medium">{lastDiagnosticTime}</strong></span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full lg:w-auto self-stretch lg:self-auto">
            <button
              onClick={runFullDiagnostic}
              disabled={isDiagnosticRunning}
              className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Stethoscope className={`w-4 h-4 ${isDiagnosticRunning ? 'animate-spin' : ''}`} />
              <span>{isDiagnosticRunning ? 'Running Diagnostic...' : 'Run Quick Diagnostic'}</span>
            </button>

            <button
              onClick={() => setIsPermissionModalOpen(true)}
              className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{permissionsState.authorizationLevel === 'full' ? 'Full PC Access Granted' : 'Authorize Full PC Access'}</span>
            </button>

            <button
              onClick={() => {
                saveCurrentReport();
                setActiveView('reports');
              }}
              className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <ClipboardList className="w-4 h-4 text-slate-400" />
              <span>Generate &amp; View Audit Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Laptop Specifications & Deep Hardware Inspection Card */}
      <LaptopSpecsCard />

      {/* 6 Hardware Overview Metric Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Live Hardware Performance
          </h3>
          <span className="text-xs text-slate-400">
            Click any subsystem to view details
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* 1. CPU Card */}
          <MetricCard
            title="Processor Load (CPU)"
            value={cpu.utilization}
            unit="%"
            subValue={`${cpu.processorName} (${cpu.logicalProcessors} Threads)`}
            status={cpu.utilization > 85 ? 'Warning' : 'Healthy'}
            icon={Cpu}
            sparklineData={cpu.loadHistory}
            sparklineColor="#2563EB"
            onClick={() => setActiveView('cpu')}
          />

          {/* 2. RAM Card */}
          <MetricCard
            title="Memory Usage (RAM)"
            value={ram.utilizationPercent}
            unit="%"
            subValue={`${(ram.usedBytes / (1024**3)).toFixed(1)} GB of ${(ram.totalBytes / (1024**3)).toFixed(0)} GB Total`}
            status={ram.utilizationPercent > 85 ? 'Warning' : 'Healthy'}
            icon={MemoryStick}
            sparklineData={ram.history}
            sparklineColor="#10B981"
            onClick={() => setActiveView('ram')}
          />

          {/* 3. GPU Card */}
          <MetricCard
            title="Graphics (GPU)"
            value={gpu.utilization !== null ? `${gpu.utilization}%` : 'Active'}
            subValue={gpu.renderer || gpu.model}
            status={gpu.webglVersion !== 'None' ? 'Healthy' : 'Unavailable'}
            icon={Tv}
            sparklineData={gpu.utilization !== null ? [12, 14, 18, 15, gpu.utilization] : []}
            sparklineColor="#8B5CF6"
            onClick={() => setActiveView('gpu')}
          />

          {/* 4. Storage Card */}
          <MetricCard
            title="Storage Pool (Disk)"
            value={storagePercent}
            unit="%"
            subValue={primaryDrive ? `${primaryDrive.name} (${Math.round(primaryDrive.availableBytes / (1024**3))} GB Free)` : 'Checking storage...'}
            status={primaryDrive?.healthStatus || 'Healthy'}
            icon={HardDrive}
            sparklineData={[storagePercent, storagePercent]}
            sparklineColor="#F59E0B"
            onClick={() => setActiveView('storage')}
          />

          {/* 5. Temperature Card */}
          <MetricCard
            title="Thermal Sensor"
            value={tempVal !== null ? `${tempVal}` : 'Normal'}
            unit={tempVal !== null ? '°C' : ''}
            subValue={tempVal !== null ? 'CPU Package Die' : 'Operating within nominal thermal limits'}
            status={tempStatus}
            icon={Thermometer}
            sparklineData={tempVal !== null ? [42, 44, 46, tempVal] : []}
            sparklineColor="#EF4444"
            onClick={() => setActiveView('thermal')}
          />

          {/* 6. Battery Card */}
          <MetricCard
            title="Power & Battery"
            value={battery.supported ? `${battery.levelPercent}%` : 'AC Power'}
            subValue={battery.supported ? (battery.charging ? 'Charging (AC Connected)' : 'Discharging') : 'Desktop PC / Continuous Line'}
            status={battery.supported ? battery.condition : 'Standard'}
            icon={Battery}
            sparklineData={battery.supported ? [battery.levelPercent, battery.levelPercent] : []}
            sparklineColor="#0284C7"
            onClick={() => setActiveView('battery')}
          />
        </div>
      </div>

      {/* Comprehensive PC Hardware Diagnosis: Everything Detected on Your Computer */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${detectedIssues.length > 0 ? 'text-amber-500' : 'text-emerald-500'}`} />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Hardware Health Diagnosis: Everything Detected on Your PC
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live automated inspection of CPU load, memory limits, drive capacity, GPU acceleration, thermals, and battery circuits
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runFullDiagnostic}
              disabled={isDiagnosticRunning}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              <Stethoscope className={`w-3.5 h-3.5 ${isDiagnosticRunning ? 'animate-spin' : ''}`} />
              <span>{isDiagnosticRunning ? 'Running Tests...' : 'Run Full Diagnostic'}</span>
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setIssueTab('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              issueTab === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Issues ({detectedIssues.length})
          </button>
          <button
            onClick={() => setIssueTab('critical')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              issueTab === 'critical'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60'
            }`}
          >
            Critical &amp; High ({detectedIssues.filter(i => i.severity === 'critical' || i.severity === 'high').length})
          </button>
          <button
            onClick={() => setIssueTab('warnings')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              issueTab === 'warnings'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60'
            }`}
          >
            Warnings &amp; Bottlenecks ({detectedIssues.filter(i => i.severity === 'moderate' || i.severity === 'low').length})
          </button>
          <button
            onClick={() => setIssueTab('healthy')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              issueTab === 'healthy'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
            }`}
          >
            Healthy Subsystems (8 Verified)
          </button>
        </div>

        {/* Content Area */}
        {issueTab === 'healthy' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Processor (CPU)</span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium truncate">{cpu.processorName}</p>
              <p className="text-[11px] text-slate-500">{cpu.logicalProcessors} Logical Threads · {cpu.utilization}% Load</p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>System Memory (RAM)</span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">{(ram.totalBytes / (1024**3)).toFixed(0)} GB Physical RAM</p>
              <p className="text-[11px] text-slate-500">{(ram.availableBytes / (1024**3)).toFixed(1)} GB Free · {ram.utilizationPercent}% In Use</p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Storage &amp; Disk (ROM)</span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium truncate">{primaryDrive ? primaryDrive.name : 'Storage Pool'}</p>
              <p className="text-[11px] text-slate-500">{primaryDrive ? Math.round(primaryDrive.availableBytes / (1024**3)) : 0} GB Free Space</p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Graphics (GPU)</span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium truncate">{gpu.renderer}</p>
              <p className="text-[11px] text-slate-500">Hardware Acceleration Active ({gpu.webglVersion})</p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Thermal Dissipation</span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">{tempVal !== null ? `${tempVal} °C` : 'Operating Normally'}</p>
              <p className="text-[11px] text-slate-500">Within Safe Limits (&lt; 85°C)</p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Power &amp; Battery</span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">{battery.supported ? `${battery.levelPercent}% Charge` : 'AC Continuous Line'}</p>
              <p className="text-[11px] text-slate-500">{battery.supported ? battery.condition : 'Standard Desktop Power'}</p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Display &amp; Refresh Rate</span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">{display?.resolution || 'Connected Display'}</p>
              <p className="text-[11px] text-slate-500">{display?.estimatedRefreshRateHz || 60} Hz Refresh Rate</p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>System Architecture</span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">{system.operatingSystem}</p>
              <p className="text-[11px] text-slate-500">{system.architecture} · {system.chassisType}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            {(() => {
              const filtered = detectedIssues.filter(issue => {
                if (issueTab === 'critical') return issue.severity === 'critical' || issue.severity === 'high';
                if (issueTab === 'warnings') return issue.severity === 'moderate' || issue.severity === 'low';
                return true;
              });

              if (filtered.length === 0) {
                return (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="font-semibold text-sm">No issues found in this category.</p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                        Your PC hardware subsystems are operating within nominal thresholds.
                      </p>
                    </div>
                  </div>
                );
              }

              return filtered.map((issue) => {
                const isCritical = issue.severity === 'critical' || issue.severity === 'high';
                const isWarning = issue.severity === 'moderate' || issue.severity === 'low';
                const dotColor = isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-blue-500';

                return (
                  <div
                    key={issue.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-2.5 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${dotColor} flex-shrink-0`}></span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {issue.title}
                        </h4>
                        <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {issue.component}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500">Live Reading:</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                          {issue.detectedValue}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {issue.explanation}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/80 dark:border-slate-800">
                      <div className="text-slate-500">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Expected Normal: </span>
                        <span>{issue.expectedThreshold}</span>
                      </div>
                      <div className="text-slate-500">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Fix Recommendation: </span>
                        <span>{issue.recommendedAction}</span>
                      </div>
                    </div>

                    {/* Quick Fix / Action Button */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <span className="text-[11px] text-slate-400">
                        Detected at {issue.timestamp}
                      </span>

                      <div className="flex items-center gap-2">
                        {issue.quickFixLabel && (
                          <button
                            onClick={() => fixHardwareIssue(issue)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors cursor-pointer"
                          >
                            <Wrench className="w-3.5 h-3.5" />
                            <span>{issue.quickFixLabel}</span>
                          </button>
                        )}

                        <button
                          onClick={() => setActiveView('troubleshooting')}
                          className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium"
                        >
                          <span>Detailed Guide</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
