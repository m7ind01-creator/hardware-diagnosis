import React, { useState } from 'react';
import { useHardware } from '../context/HardwareContext';
import { IssueSeverity, HardwareIssue } from '../types/hardware';
import { 
  X, 
  Bell, 
  AlertTriangle, 
  AlertOctagon, 
  Info, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const { 
    isNotificationCenterOpen, 
    setIsNotificationCenterOpen, 
    detectedIssues, 
    setActiveView 
  } = useHardware();

  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [selectedIssue, setSelectedIssue] = useState<HardwareIssue | null>(null);

  if (!isNotificationCenterOpen) return null;

  const filteredIssues = detectedIssues.filter(i => {
    if (filterSeverity === 'all') return true;
    return i.severity === filterSeverity;
  });

  const getSeverityBadge = (sev: IssueSeverity) => {
    switch (sev) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">Critical</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">High</span>;
      case 'moderate':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Moderate</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">Low</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">Info</span>;
    }
  };

  const handleNavigateToComponent = (component: string) => {
    setIsNotificationCenterOpen(false);
    switch (component.toLowerCase()) {
      case 'cpu':
        setActiveView('cpu');
        break;
      case 'ram':
        setActiveView('ram');
        break;
      case 'gpu':
        setActiveView('gpu');
        break;
      case 'storage':
        setActiveView('storage');
        break;
      case 'temperature':
        setActiveView('thermal');
        break;
      case 'battery':
        setActiveView('battery');
        break;
      default:
        setActiveView('troubleshooting');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex items-center justify-center w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex-shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Notification &amp; Anomaly Center
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Rule-based intelligent hardware issue detection and alerts
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNotificationCenterOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-2.5 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 text-xs overflow-x-auto">
          <span className="text-slate-500 font-medium mr-1 flex-shrink-0">Filter:</span>
          {['all', 'critical', 'high', 'moderate', 'low'].map(s => (
            <button
              key={s}
              onClick={() => setFilterSeverity(s)}
              className={`px-2.5 sm:px-3 py-1 rounded-md capitalize font-medium transition-colors flex-shrink-0 cursor-pointer ${
                filterSeverity === s
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {s}
            </button>
          ))}
          <span className="ml-auto font-mono text-slate-400 flex-shrink-0 pl-2">
            {filteredIssues.length} {filteredIssues.length === 1 ? 'alert' : 'alerts'}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-3.5 sm:space-y-4">
          {filteredIssues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                No active anomalies detected
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                All inspected hardware sensors and resource thresholds are operating within safe tolerances.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 bg-white dark:bg-slate-900 transition-all space-y-2.5 sm:space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 sm:gap-3">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      {getSeverityBadge(issue.severity)}
                      <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                        [{issue.component}]
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {issue.title}
                      </h4>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 flex-shrink-0">
                      {issue.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {issue.explanation}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400">Detected: </span>
                      <strong className="text-rose-600 dark:text-rose-400">{issue.detectedValue}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Threshold: </span>
                      <strong className="text-slate-700 dark:text-slate-300">{issue.expectedThreshold}</strong>
                    </div>
                  </div>

                  {issue.potentialCauses.length > 0 && (
                    <div className="text-xs space-y-1">
                      <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                        Potential Causes:
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400">
                        {issue.potentialCauses.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-blue-700 dark:text-blue-400 font-medium">
                      Action: {issue.recommendedAction}
                    </span>
                    <button
                      onClick={() => handleNavigateToComponent(issue.component)}
                      className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors"
                    >
                      <span>Inspect {issue.component}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={() => {
              setIsNotificationCenterOpen(false);
              setActiveView('troubleshooting');
            }}
            className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            Open Troubleshooting Assistant →
          </button>
          <button
            onClick={() => setIsNotificationCenterOpen(false)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 transition-opacity"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
