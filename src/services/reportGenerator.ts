/**
 * ReportGenerator Service
 * Generates professional diagnostic reports, printable views (PDF via browser print),
 * JSON telemetry snapshots, and CSV inventory sheets.
 */

import { DiagnosticReport, DiagnosticTest, HardwareIssue, SystemInfo, CPUInfo, RAMInfo, GPUInfo, StorageDrive, ThermalSensor, BatteryInfo } from '../types/hardware';

export function createDiagnosticReport(
  title: string,
  systemSummary: SystemInfo,
  healthScore: number,
  isProvisional: boolean,
  scoreReason: string,
  diagnostics: DiagnosticTest[],
  detectedIssues: HardwareIssue[],
  hardwareSnapshot: {
    cpu: CPUInfo;
    ram: RAMInfo;
    gpu: GPUInfo;
    storage: StorageDrive[];
    battery: BatteryInfo;
    thermals: ThermalSensor[];
  },
  technicianNotes?: string
): DiagnosticReport {
  const testsCompleted = diagnostics.filter(d => d.status !== 'idle').length;
  const testsPassed = diagnostics.filter(d => d.status === 'passed').length;
  const testsWarning = diagnostics.filter(d => d.status === 'warning').length;
  const testsFailed = diagnostics.filter(d => d.status === 'failed').length;
  const testsSkipped = diagnostics.filter(d => d.status === 'skipped').length;
  const testsUnsupported = diagnostics.filter(d => d.status === 'unsupported').length;

  let conclusion = 'Based on available hardware diagnostics, all inspected subsystems are operating within acceptable parameters.';
  if (testsFailed > 0 || detectedIssues.some(i => i.severity === 'critical')) {
    conclusion = 'CRITICAL ATTENTION REQUIRED: One or more critical hardware anomalies or test failures were identified. Immediate technical inspection and data backup are strongly advised.';
  } else if (testsWarning > 0 || detectedIssues.length > 0) {
    conclusion = 'MODERATE ATTENTION ADVISED: Several non-critical warnings or elevated resource thresholds were detected. Review the recommended actions to prevent system degradation.';
  }

  return {
    id: 'report-' + Date.now(),
    title: title || `RigSentinel Diagnostic Audit (${new Date().toLocaleDateString()})`,
    createdAt: new Date().toLocaleString(),
    systemSummary,
    healthScore,
    isProvisional,
    scoreReason,
    testsCompleted,
    testsPassed,
    testsWarning,
    testsFailed,
    testsSkipped,
    testsUnsupported,
    diagnostics,
    detectedIssues,
    hardwareSnapshot,
    conclusion,
    technicianNotes
  };
}

export function exportReportJSON(report: DiagnosticReport) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `rigsentinel-report-${report.id}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportReportCSV(report: DiagnosticReport) {
  const rows: string[][] = [
    ['RigSentinel Diagnostic Audit Export'],
    ['Report ID', report.id],
    ['Date & Time', report.createdAt],
    ['Overall Health Score', `${report.healthScore}/100`],
    ['Provisional Status', report.isProvisional ? 'Yes (Browser Telemetry)' : 'No (Direct Agent Telemetry)'],
    [''],
    ['--- SYSTEM SPECIFICATIONS ---'],
    ['Computer Model', report.systemSummary.computerModel],
    ['Operating System', report.systemSummary.operatingSystem],
    ['Architecture', report.systemSummary.architecture],
    ['Data Source', report.systemSummary.dataSource],
    [''],
    ['--- HARDWARE SUBSYSTEMS ---'],
    ['CPU Model', report.hardwareSnapshot.cpu.processorName],
    ['Physical Cores', String(report.hardwareSnapshot.cpu.physicalCores)],
    ['Logical Threads', String(report.hardwareSnapshot.cpu.logicalProcessors)],
    ['Current CPU Load', `${report.hardwareSnapshot.cpu.utilization}%`],
    ['Total System RAM', `${Math.round(report.hardwareSnapshot.ram.totalBytes / (1024**3))} GB`],
    ['RAM Utilization', `${report.hardwareSnapshot.ram.utilizationPercent}%`],
    ['Primary GPU', report.hardwareSnapshot.gpu.renderer || report.hardwareSnapshot.gpu.model],
    ['GPU Dedicated VRAM', report.hardwareSnapshot.gpu.dedicatedMemoryMB ? `${report.hardwareSnapshot.gpu.dedicatedMemoryMB} MB` : 'Dynamic / Shared'],
    ['Storage Drives Count', String(report.hardwareSnapshot.storage.length)],
    ['Battery Supported', report.hardwareSnapshot.battery.supported ? `Yes (${report.hardwareSnapshot.battery.levelPercent}%)` : 'No / Desktop'],
    [''],
    ['--- DIAGNOSTIC TESTS ---'],
    ['Test ID', 'Category', 'Test Name', 'Status', 'Summary']
  ];

  report.diagnostics.forEach(test => {
    rows.push([test.id, test.category, `"${test.name}"`, test.status.toUpperCase(), `"${test.resultSummary || ''}"`]);
  });

  rows.push(['']);
  rows.push(['--- DETECTED ISSUES & ANOMALIES ---']);
  rows.push(['Component', 'Severity', 'Problem Title', 'Detected Value', 'Expected Threshold', 'Recommended Action']);

  report.detectedIssues.forEach(issue => {
    rows.push([
      issue.component,
      issue.severity.toUpperCase(),
      `"${issue.title}"`,
      `"${issue.detectedValue}"`,
      `"${issue.expectedThreshold}"`,
      `"${issue.recommendedAction}"`
    ]);
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(r => r.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `rigsentinel-report-${report.id}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function printReportPreview() {
  window.print();
}
