import React, { useState } from 'react';
import { useHardware } from '../context/HardwareContext';
import { 
  Laptop, 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Tv, 
  Battery, 
  BatteryCharging, 
  ShieldCheck, 
  RefreshCw, 
  Check, 
  Sparkles, 
  Layers, 
  Monitor,
  Zap,
  Server
} from 'lucide-react';

export const LaptopSpecsCard: React.FC = () => {
  const { 
    system, 
    cpu, 
    ram, 
    gpu, 
    storage, 
    battery, 
    display, 
    refreshHardwareData, 
    requestAllHardwareAccess,
    permissionsState 
  } = useHardware();

  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const handleScanSpecs = async () => {
    setIsScanning(true);
    setScanSuccess(false);

    try {
      // 1. Request client hints and permissions
      await requestAllHardwareAccess();
      // 2. Refresh telemetry
      await refreshHardwareData();
    } catch {}

    setIsScanning(false);
    setScanSuccess(true);
    setTimeout(() => setScanSuccess(false), 2500);
  };

  // Compute total ROM / Storage across all drives
  const totalRomBytes = storage.reduce((acc, d) => acc + d.totalBytes, 0);
  const usedRomBytes = storage.reduce((acc, d) => acc + d.usedBytes, 0);
  const freeRomBytes = totalRomBytes - usedRomBytes;
  const romPercent = totalRomBytes > 0 ? Math.round((usedRomBytes / totalRomBytes) * 100) : 0;
  const totalRomGB = Math.round(totalRomBytes / (1024 * 1024 * 1024));
  const freeRomGB = Math.round(freeRomBytes / (1024 * 1024 * 1024));

  const ramTotalGB = (ram.totalBytes / (1024**3)).toFixed(0);
  const ramUsedGB = (ram.usedBytes / (1024**3)).toFixed(1);
  const ramFreeGB = (ram.availableBytes / (1024**3)).toFixed(1);

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-4 sm:p-6 shadow-xs space-y-5">
      {/* Top Header: Device Model + Form Factor + Scan Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex-shrink-0">
            <Laptop className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {system.chassisType || 'Computer'}
              </span>
              <span>·</span>
              <span className="truncate">
                {system.manufacturer}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate" title={system.computerModel}>
              {system.computerModel}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
          {scanSuccess && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <Check className="w-4 h-4" />
              <span>Verified</span>
            </span>
          )}

          <button
            onClick={handleScanSpecs}
            disabled={isScanning}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
            title="Read and verify live hardware specifications"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Hardware...' : 'Scan & Verify Specs'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Key Laptop Specifications: CPU, RAM, ROM, GPU, Battery, Screen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* 1. Processor (CPU) Card */}
        <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Processor (CPU)</span>
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-medium tabular-nums">{cpu.utilization}% Load</span>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate" title={cpu.processorName}>
              {cpu.processorName}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {cpu.physicalCores} Cores · {cpu.logicalProcessors} Threads
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex justify-between">
            <span>Clock: <strong className="text-slate-700 dark:text-slate-300 font-medium">{cpu.currentFrequencyGhz} GHz</strong></span>
            <span>Arch: <strong className="text-slate-700 dark:text-slate-300 font-medium">{cpu.architecture}</strong></span>
          </div>
        </div>

        {/* 2. RAM (Installed Memory) Card */}
        <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <MemoryStick className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Memory (RAM)</span>
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-medium tabular-nums">{ram.utilizationPercent}% Used</span>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white tabular-nums">
              {ramTotalGB} GB Total Memory
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
              {ramUsedGB} GB in use · {ramFreeGB} GB free
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex justify-between">
            <span>Type: <strong className="text-slate-700 dark:text-slate-300 font-medium">{ram.memoryType || 'RAM'}</strong></span>
            <span>Speed: <strong className="text-slate-700 dark:text-slate-300 font-medium">{ram.speedMhz || 3200} MHz</strong></span>
          </div>
        </div>

        {/* 3. ROM (Storage Capacity) Card */}
        <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <HardDrive className="w-4 h-4 text-amber-500" />
              <span>Storage (Disk / ROM)</span>
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-medium tabular-nums">{freeRomGB} GB Free</span>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white tabular-nums">
              {totalRomGB > 0 ? `${totalRomGB} GB Capacity` : 'System Storage Drive'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {storage[0]?.type || 'Solid State Drive (SSD)'}
            </p>
          </div>

          <div className="space-y-1 pt-1">
            <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${romPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
              <span>{romPercent}% Used</span>
              <span>{freeRomGB} GB Available</span>
            </div>
          </div>
        </div>

        {/* 4. Graphics Card (GPU) Card */}
        <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <Tv className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Graphics (GPU)</span>
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              {gpu.isDiscrete ? 'Dedicated' : 'Integrated'}
            </span>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate" title={gpu.renderer || gpu.model}>
              {gpu.renderer || gpu.model}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Vendor: {gpu.vendor}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex justify-between">
            <span>3D Engine: <strong className="text-slate-700 dark:text-slate-300 font-medium">{gpu.webglVersion}</strong></span>
            <span>Max Texture: <strong className="text-slate-700 dark:text-slate-300 font-medium">{gpu.maxTextureSize}px</strong></span>
          </div>
        </div>

        {/* 5. Battery & Power Subsystem Card */}
        <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              {battery.charging ? (
                <BatteryCharging className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Battery className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              )}
              <span>Power &amp; Battery</span>
            </span>
            <span className="font-medium text-slate-600 dark:text-slate-400 tabular-nums">
              {battery.supported ? `${battery.levelPercent}%` : 'AC Power'}
            </span>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
              {battery.supported 
                ? (battery.charging ? 'Charging (AC Connected)' : 'Running on Battery') 
                : 'Desktop / Continuous AC Line'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Status: {battery.condition}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex justify-between">
            <span>Health: <strong className="text-slate-700 dark:text-slate-300 font-medium">{battery.supported ? 'Normal' : 'Direct Power'}</strong></span>
            <span>Mode: <strong className="text-slate-700 dark:text-slate-300 font-medium">{battery.supported ? 'Portable' : 'Stationary'}</strong></span>
          </div>
        </div>

        {/* 6. Display & Operating System Card */}
        <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <Monitor className="w-4 h-4 text-blue-500" />
              <span>Display &amp; Screen</span>
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-medium tabular-nums">{display?.estimatedRefreshRateHz || 60} Hz</span>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate" title={system.operatingSystem}>
              {system.operatingSystem}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {system.architecture} · {display?.resolution || 'Native Display'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex justify-between">
            <span>Pixel Ratio: <strong className="text-slate-700 dark:text-slate-300 font-medium">{display?.pixelRatio || 1}x</strong></span>
            <span>Color: <strong className="text-slate-700 dark:text-slate-300 font-medium">{display?.colorDepth || 24}-bit</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
