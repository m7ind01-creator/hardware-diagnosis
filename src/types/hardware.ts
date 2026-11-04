/**
 * HardwareScope Types & Data Models
 * Defines all hardware representations, telemetry, diagnostic tests, issues, and reports.
 */

export type HardwareDataSource = 
  | 'live-browser'     // Native Web APIs (HardwareConcurrency, DeviceMemory, WebGL, Battery, StorageManager)
  | 'local-agent'      // Local system service on localhost (sensors, WMI, sysfs, smartctl)
  | 'demo-data'        // Explicitly labeled simulated demonstration dataset
  | 'unsupported'      // Hardware or OS does not expose this metric
  | 'unavailable';     // Sensor not present or agent disconnected

export type HealthStatus = 'excellent' | 'good' | 'fair' | 'needs-attention' | 'critical';

export interface SystemInfo {
  computerModel: string;
  manufacturer: string;
  operatingSystem: string;
  osVersion: string;
  architecture: string;
  hostname: string;
  uptimeSeconds: number;
  browserUserAgent: string;
  chassisType: 'Laptop' | 'Desktop' | 'Workstation' | 'Tablet' | 'All-in-One';
  motherboard?: string;
  biosVersion?: string;
  serialNumber?: string;
  dataSource: HardwareDataSource;
  lastUpdated: string;
}

export interface CPUCoreInfo {
  coreId: number;
  utilization: number; // 0 to 100
  frequencyMhz?: number;
  tempC?: number;
}

export interface CPUInfo {
  processorName: string;
  manufacturer: string;
  architecture: string;
  physicalCores: number;
  logicalProcessors: number;
  baseFrequencyGhz: number;
  currentFrequencyGhz: number;
  maxFrequencyGhz?: number;
  utilization: number; // 0 - 100%
  temperatureC: number | null; // null if requires agent
  cores: CPUCoreInfo[];
  loadHistory: number[]; // recent 30-60 points
  dataSource: HardwareDataSource;
}

export interface RAMInfo {
  totalBytes: number;
  usedBytes: number;
  availableBytes: number;
  utilizationPercent: number;
  memoryType?: string; // e.g. DDR5, LPDDR5
  speedMhz?: number;   // e.g. 5600 MHz
  modulesCount?: number;
  jsHeapTotalBytes?: number;
  jsHeapUsedBytes?: number;
  jsHeapLimitBytes?: number;
  history: number[]; // recent utilization points
  dataSource: HardwareDataSource;
}

export interface GPUInfo {
  manufacturer: string;
  model: string;
  vendor: string;
  renderer: string;
  webglVersion: string;
  dedicatedMemoryMB: number | null;
  isDiscrete: boolean;
  utilization: number | null;
  temperatureC: number | null;
  driverVersion?: string;
  supportedAPIs: string[];
  maxTextureSize: number;
  extensionsCount: number;
  dataSource: HardwareDataSource;
}

export interface SmartAttribute {
  id: number;
  name: string;
  value: number;
  worst: number;
  threshold: number;
  raw: string;
  status: 'passed' | 'warning' | 'failed' | 'unsupported';
}

export interface StorageDrive {
  id: string;
  name: string;
  model: string;
  type: 'NVMe SSD' | 'SATA SSD' | 'HDD' | 'External' | 'Browser Storage Pool';
  totalBytes: number;
  usedBytes: number;
  availableBytes: number;
  temperatureC: number | null;
  healthStatus: 'Healthy' | 'Caution' | 'Critical' | 'Unsupported' | 'Unavailable';
  smartAttributes?: SmartAttribute[];
  isSystemDrive: boolean;
  dataSource: HardwareDataSource;
}

export interface ThermalSensor {
  id: string;
  label: string;
  component: 'CPU Core' | 'CPU Package' | 'GPU Die' | 'Storage Drive' | 'Motherboard' | 'Battery';
  currentTempC: number | null;
  minTempC?: number;
  maxTempC?: number;
  warningThresholdC: number;
  criticalThresholdC: number;
  status: 'Normal' | 'Warm' | 'Overheating' | 'Requires Agent' | 'Unsupported';
  dataSource: HardwareDataSource;
}

export interface BatteryInfo {
  supported: boolean;
  charging: boolean;
  levelPercent: number; // 0 - 100
  chargingTimeSec: number | null;
  dischargingTimeSec: number | null;
  designCapacityMWh?: number;
  fullChargeCapacityMWh?: number;
  cycleCount?: number;
  healthPercent?: number; // (fullCharge / design) * 100
  condition: 'Excellent' | 'Good' | 'Degraded' | 'Replace Soon' | 'Unsupported';
  dataSource: HardwareDataSource;
}

export interface DisplayInfo {
  resolution: string;
  availResolution: string;
  colorDepth: number;
  pixelRatio: number;
  estimatedRefreshRateHz: number;
}

export interface NetworkInfo {
  online: boolean;
  effectiveType?: string;
  downlinkMbps?: number;
  rttMs?: number;
  saveData?: boolean;
}

export type DiagnosticTestStatus = 
  | 'idle' 
  | 'running' 
  | 'passed' 
  | 'warning' 
  | 'failed' 
  | 'skipped' 
  | 'unsupported';

export interface DiagnosticTest {
  id: string;
  name: string;
  category: 'CPU' | 'Memory' | 'Storage' | 'GPU' | 'Thermal' | 'Battery' | 'System Specs';
  description: string;
  durationSec: number;
  status: DiagnosticTestStatus;
  progressPercent: number; // 0 - 100
  resultSummary?: string;
  metricsResult?: Record<string, string | number>;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
}

export type IssueSeverity = 'informational' | 'low' | 'moderate' | 'high' | 'critical';

export interface HardwareIssue {
  id: string;
  title: string;
  severity: IssueSeverity;
  component: 'CPU' | 'RAM' | 'GPU' | 'Storage' | 'Temperature' | 'Battery' | 'System';
  detectedValue: string;
  expectedThreshold: string;
  explanation: string;
  potentialCauses: string[];
  recommendedAction: string;
  timestamp: string;
  fixActionType?: 'test-cpu' | 'test-ram' | 'test-storage' | 'test-gpu' | 'permission-modal' | 'clear-heap' | 'agent-modal' | 'view-specs' | 'view-troubleshooting';
  quickFixLabel?: string;
}

export interface DiagnosticReport {
  id: string;
  title: string;
  createdAt: string;
  systemSummary: SystemInfo;
  healthScore: number;
  isProvisional: boolean;
  scoreReason: string;
  testsCompleted: number;
  testsPassed: number;
  testsWarning: number;
  testsFailed: number;
  testsSkipped: number;
  testsUnsupported: number;
  diagnostics: DiagnosticTest[];
  detectedIssues: HardwareIssue[];
  hardwareSnapshot: {
    cpu: CPUInfo;
    ram: RAMInfo;
    gpu: GPUInfo;
    storage: StorageDrive[];
    battery: BatteryInfo;
    thermals: ThermalSensor[];
  };
  conclusion: string;
  technicianNotes?: string;
}

export interface TroubleshootingTopic {
  id: string;
  title: string;
  symptom: string;
  iconName: string;
  possibleCauses: string[];
  safeTroubleshootingSteps: string[];
  recommendedDiagnosticTests: string[];
  whenToSeekRepair: string[];
  preventativeTips: string[];
}

export interface ActiveHardwareAlert {
  id: string;
  type: 'temperature_critical' | 'temperature_warning' | 'storage_health_drop' | 'storage_low_space';
  title: string;
  message: string;
  component: string;
  currentValue: string;
  thresholdValue: string;
  severity: 'critical' | 'warning';
  timestamp: number;
  viewTarget: 'temperature' | 'storage' | 'troubleshooting';
  dismissed?: boolean;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  refreshIntervalMs: number;
  tempWarningThresholdC: number;
  tempCriticalThresholdC: number;
  memWarningThresholdPercent: number;
  storageWarningThresholdPercent: number;
  cpuWarningThresholdPercent: number;
  agentPort: number;
  agentAuthToken: string;
  demoMode: boolean;
  audioAlerts: boolean;
  desktopNotifications: boolean;
  systemNameOverride?: string;
}

export interface TelemetryPoint {
  timestamp: number;
  cpuUsage: number;
  ramUsage: number;
  gpuUsage: number | null;
  cpuTemp: number | null;
  batteryLevel: number | null;
}

export interface HardwarePermissionsState {
  highEntropyQueried: boolean;
  storageQuotaGranted: boolean;
  fileSystemDirectoryGranted: boolean;
  fileSystemDirectoryName?: string;
  fileSystemStats?: {
    filesCount: number;
    directoriesCount: number;
    totalSizeBytes: number;
    scanDurationMs: number;
    largestFiles: Array<{ name: string; sizeBytes: number }>;
  };
  computePressureActive: boolean;
  computePressureState?: 'nominal' | 'fair' | 'serious' | 'critical';
  webHidGranted: boolean;
  webHidDeviceName?: string;
  localAgentConnected: boolean;
  authorizationLevel: 'sandbox' | 'enhanced' | 'full';
}

