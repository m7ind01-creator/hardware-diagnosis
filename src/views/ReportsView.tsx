import React, { useState } from 'react';
import { useHardware } from '../context/HardwareContext';
import { exportReportJSON, exportReportCSV, printReportPreview } from '../services/reportGenerator';
import { DiagnosticReport } from '../types/hardware';
import { StatusBadge } from '../components/StatusBadge';
import { 
  ClipboardCheck, 
  Download, 
  Printer, 
  Trash2, 
  Eye, 
  Plus, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon,
  Clock,
  Laptop
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { 
    savedReports, 
    saveCurrentReport, 
    deleteReport, 
    selectedReportForPreview, 
    setSelectedReportForPreview 
  } = useHardware();

  const [technicianNotes, setTechnicianNotes] = useState('');

  const handleGenerateNew = () => {
    const rep = saveCurrentReport(technicianNotes || undefined);
    setSelectedReportForPreview(rep);
    setTechnicianNotes('');
  };

  const activeReport: DiagnosticReport | null = selectedReportForPreview || savedReports[0] || null;

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 flex-shrink-0">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Hardware Diagnostic Reports
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generate, store, review, and export formal technical hardware audit reports (PDF, JSON, CSV)
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Technician notes (e.g. Pre-repair inspection, Client ticket #104)..."
            value={technicianNotes}
            onChange={(e) => setTechnicianNotes(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-72"
          />
          <button
            onClick={handleGenerateNew}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer min-h-[38px] flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Main Two Column Layout: Saved Reports List on Left, Active Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column: Reports List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 px-1">
            Saved Reports ({savedReports.length})
          </h3>

          {savedReports.length === 0 ? (
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] text-center space-y-3 shadow-xs">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500">No saved diagnostic reports yet.</p>
              <button
                onClick={handleGenerateNew}
                className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Create First Report
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {savedReports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReportForPreview(report)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-colors ${
                    activeReport?.id === report.id
                      ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/30 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                      {report.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                      {report.healthScore}/100
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{report.createdAt}</span>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteReport(report.id);
                      }}
                      className="p-1 hover:text-rose-600 transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Full Report Preview with Print / Export Controls */}
        <div className="lg:col-span-2">
          {activeReport ? (
            <div className="p-4 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-4 sm:space-y-6 shadow-xs print:border-none print:shadow-none print:p-0">
              {/* Report Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 border-b border-slate-200 dark:border-slate-800 print:hidden">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-xs font-mono text-slate-500">Export:</span>
                  <button
                    onClick={() => printReportPreview()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / PDF</span>
                  </button>
                  <button
                    onClick={() => exportReportJSON(activeReport)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>JSON</span>
                  </button>
                  <button
                    onClick={() => exportReportCSV(activeReport)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                </div>

                <span className="text-xs font-mono text-slate-400">
                  ID: {activeReport.id.slice(0, 12)}
                </span>
              </div>

              {/* Formal Report Printable Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                      HardwareScope
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 font-bold uppercase">
                      Official Hardware Audit
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {activeReport.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Generated on {activeReport.createdAt} • System: {activeReport.systemSummary.computerModel}
                  </p>
                </div>

                <div className="text-right">
                  <div className="inline-flex flex-col items-end">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Health Score
                    </span>
                    <span className={`text-3xl font-extrabold ${
                      activeReport.healthScore >= 85 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'
                    }`}>
                      {activeReport.healthScore}/100
                    </span>
                    {activeReport.isProvisional && (
                      <span className="text-[10px] text-amber-600">Provisional (Browser Telemetry)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* System Specs Snapshot */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Hardware Specifications Snapshot
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Processor:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                      {activeReport.hardwareSnapshot.cpu.processorName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Cores / Threads:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {activeReport.hardwareSnapshot.cpu.physicalCores}C / {activeReport.hardwareSnapshot.cpu.logicalProcessors}T
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">System Memory:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {Math.round(activeReport.hardwareSnapshot.ram.totalBytes / (1024**3))} GB Physical
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Graphics Adapter:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                      {activeReport.hardwareSnapshot.gpu.renderer}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Operating System:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                      {activeReport.systemSummary.operatingSystem}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Storage Volumes:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {activeReport.hardwareSnapshot.storage.length} Volume{activeReport.hardwareSnapshot.storage.length > 1 ? 's' : ''} Connected
                    </span>
                  </div>
                </div>
              </div>

              {/* Diagnostic Test Matrix */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Diagnostic Procedure Matrix
                  </h4>
                  <span className="text-xs text-slate-400">
                    {activeReport.testsPassed} Passed / {activeReport.testsWarning} Warnings / {activeReport.testsFailed} Failed
                  </span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  {activeReport.diagnostics.map((test) => (
                    <div key={test.id} className="p-3 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block">
                          {test.name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {test.resultSummary || 'Test completed'}
                        </span>
                      </div>
                      <StatusBadge status={test.status} size="sm" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Detected Anomalies */}
              {activeReport.detectedIssues.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Identified Problems &amp; Action Items ({activeReport.detectedIssues.length})
                  </h4>
                  <div className="space-y-2">
                    {activeReport.detectedIssues.map((issue) => (
                      <div key={issue.id} className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                          <span>{issue.title} ({issue.severity.toUpperCase()})</span>
                          <span className="text-slate-400">{issue.detectedValue}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">{issue.explanation}</p>
                        <p className="text-blue-700 dark:text-blue-400 font-semibold pt-1">Recommended Action: {issue.recommendedAction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conclusion Assessment */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-semibold">
                  Diagnostic Conclusion &amp; Assessment
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
                  {activeReport.conclusion}
                </p>
                {activeReport.technicianNotes && (
                  <p className="text-xs text-slate-500 italic pt-1 border-t border-slate-200/60 dark:border-slate-800">
                    Technician Notes: {activeReport.technicianNotes}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              Select a report from the left or generate a new audit snapshot.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
