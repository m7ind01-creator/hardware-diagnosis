import React, { useState } from 'react';
import { useHardware } from '../context/HardwareContext';
import { DataSourceBadge } from '../components/StatusBadge';
import { LaptopSpecsCard } from '../components/LaptopSpecsCard';
import { 
  Laptop, 
  Cpu, 
  MemoryStick, 
  Tv, 
  HardDrive, 
  Monitor, 
  Wifi, 
  Battery, 
  Copy, 
  Check, 
  Download,
  Share2
} from 'lucide-react';

export const HardwareSpecsView: React.FC = () => {
  const { system, cpu, ram, gpu, storage, battery, display, network } = useHardware();
  const [copied, setCopied] = useState(false);

  const generateSpecsSummaryText = () => {
    return `=== RIGSENTINEL SYSTEM SPECIFICATIONS ===
Export Date: ${new Date().toLocaleString()}
Computer Model: ${system.computerModel}
Manufacturer: ${system.manufacturer}
Operating System: ${system.operatingSystem} (${system.osVersion})
Architecture: ${system.architecture}
Host Name: ${system.hostname}
System Uptime: ${Math.round(system.uptimeSeconds / 3600)} hours

[PROCESSOR / CPU]
Model: ${cpu.processorName}
Manufacturer: ${cpu.manufacturer}
Physical Cores: ${cpu.physicalCores}
Logical Threads: ${cpu.logicalProcessors}
Base Frequency: ${cpu.baseFrequencyGhz} GHz

[SYSTEM MEMORY / RAM]
Total RAM: ${(ram.totalBytes / (1024**3)).toFixed(1)} GB
Used Memory: ${(ram.usedBytes / (1024**3)).toFixed(1)} GB
Available: ${(ram.availableBytes / (1024**3)).toFixed(1)} GB
Memory Speed: ${ram.speedMhz || 3200} MHz

[GRAPHICS / GPU]
Renderer: ${gpu.renderer}
Vendor: ${gpu.vendor}
API: ${gpu.webglVersion}
Dedicated VRAM: ${gpu.dedicatedMemoryMB ? gpu.dedicatedMemoryMB + ' MB' : 'Shared / Dynamic'}
Max Texture Size: ${gpu.maxTextureSize}px

[STORAGE DRIVES]
${storage.map((d, i) => `#${i + 1} ${d.name} (${d.type}): ${Math.round(d.totalBytes / (1024**3))} GB Total, ${Math.round(d.availableBytes / (1024**3))} GB Free [${d.healthStatus}]`).join('\n')}

[DISPLAY & HARDWARE INTERFACES]
Resolution: ${display?.resolution || 'Standard'}
Color Depth: ${display?.colorDepth || 24}-bit
Estimated Refresh Rate: ${display?.estimatedRefreshRateHz || 60} Hz
Battery: ${battery.supported ? `${battery.levelPercent}% (${battery.condition})` : 'Standard AC Power / No Battery'}
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateSpecsSummaryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      system,
      cpu,
      ram,
      gpu,
      storage,
      battery,
      display,
      network
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `hardware-specs-${Date.now()}.json`);
    dl.click();
    dl.remove();
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Hardware Specification Inventory
            </h2>
            <DataSourceBadge source={system.dataSource} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Verified technical inventory of installed processor, memory, storage, graphics, and system interfaces.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopy}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors cursor-pointer min-h-[38px]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Specs!' : 'Copy Summary'}</span>
          </button>
          <button
            onClick={handleDownloadJSON}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer min-h-[38px]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Quick Laptop Specs & Deep Inspection */}
      <LaptopSpecsCard />

      {/* Grid of Spec Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Category 1: System Information */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-3.5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <Laptop className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              System Identification
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Computer Model:</span>
              <span className="font-medium text-slate-900 dark:text-white">{system.computerModel}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Manufacturer:</span>
              <span className="font-medium text-slate-900 dark:text-white">{system.manufacturer}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Operating System:</span>
              <span className="font-medium text-slate-900 dark:text-white">{system.operatingSystem}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">OS Version / Build:</span>
              <span className="font-medium text-slate-900 dark:text-white">{system.osVersion}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">System Architecture:</span>
              <span className="font-medium text-slate-900 dark:text-white">{system.architecture}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">System Uptime:</span>
              <span className="font-medium text-slate-900 dark:text-white tabular-nums">
                {Math.floor(system.uptimeSeconds / 3600)}h {Math.floor((system.uptimeSeconds % 3600) / 60)}m
              </span>
            </div>
          </div>
        </div>

        {/* Category 2: Processor / CPU */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-3.5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              Processor (CPU)
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">CPU Model:</span>
              <span className="font-medium text-slate-900 dark:text-white truncate max-w-[220px]" title={cpu.processorName}>
                {cpu.processorName}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Manufacturer:</span>
              <span className="font-medium text-slate-900 dark:text-white">{cpu.manufacturer}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Physical Cores:</span>
              <span className="font-medium text-slate-900 dark:text-white tabular-nums">{cpu.physicalCores} Cores</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Logical Threads:</span>
              <span className="font-medium text-slate-900 dark:text-white tabular-nums">{cpu.logicalProcessors} Threads</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Base Clock Speed:</span>
              <span className="font-medium text-slate-900 dark:text-white tabular-nums">{cpu.baseFrequencyGhz} GHz</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Instruction Set:</span>
              <span className="font-medium text-slate-900 dark:text-white">64-bit Architecture</span>
            </div>
          </div>
        </div>

        {/* Category 3: Memory / RAM */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-3.5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <MemoryStick className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              System Memory (RAM)
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Total Installed RAM:</span>
              <span className="font-medium text-slate-900 dark:text-white tabular-nums">
                {(ram.totalBytes / (1024**3)).toFixed(1)} GB ({(ram.totalBytes / (1024**3)).toFixed(0)} GB Physical)
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Used Memory:</span>
              <span className="font-medium text-slate-900 dark:text-white tabular-nums">{(ram.usedBytes / (1024**3)).toFixed(2)} GB</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Available Memory:</span>
              <span className="font-medium text-slate-900 dark:text-white tabular-nums">{(ram.availableBytes / (1024**3)).toFixed(2)} GB</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Memory Type / Speed:</span>
              <span className="font-medium text-slate-900 dark:text-white">{ram.memoryType || 'RAM'} @ {ram.speedMhz || 3200} MHz</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Browser Heap Limit:</span>
              <span className="font-medium text-slate-900 dark:text-white tabular-nums">
                {ram.jsHeapLimitBytes ? `${Math.round(ram.jsHeapLimitBytes / (1024**2))} MB Heap Limit` : 'Dynamic Heap'}
              </span>
            </div>
          </div>
        </div>

        {/* Category 4: Graphics / GPU */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-3.5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <Tv className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              Graphics Hardware (GPU)
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">GPU Renderer:</span>
              <span className="font-medium text-slate-900 dark:text-white truncate max-w-[220px]" title={gpu.renderer}>
                {gpu.renderer}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">GPU Vendor:</span>
              <span className="font-medium text-slate-900 dark:text-white">{gpu.vendor}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Dedicated VRAM:</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {gpu.dedicatedMemoryMB ? `${gpu.dedicatedMemoryMB} MB GDDR` : 'Shared / Dynamic'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Max Texture Size:</span>
              <span className="font-medium text-slate-900 dark:text-white tabular-nums">{gpu.maxTextureSize} × {gpu.maxTextureSize} px</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Supported 3D Engine:</span>
              <span className="font-medium text-slate-900 dark:text-white truncate max-w-[200px]">
                {gpu.webglVersion}
              </span>
            </div>
          </div>
        </div>

        {/* Category 5: Storage Drives */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-3.5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <HardDrive className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              Storage Volumes ({storage.length})
            </h3>
          </div>

          <div className="space-y-2.5">
            {storage.map((drive) => (
              <div key={drive.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[220px]">
                    {drive.name}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {drive.type}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500 tabular-nums">
                  <span>Capacity: {Math.round(drive.totalBytes / (1024**3))} GB</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {Math.round(drive.availableBytes / (1024**3))} GB Free
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category 6: Display & External Interfaces */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-3.5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <Monitor className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              Display &amp; Interfaces
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Screen Resolution:</span>
              <span className="font-medium text-slate-900 dark:text-white">{display?.resolution || 'Native Screen'}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Color Depth:</span>
              <span className="font-medium text-slate-900 dark:text-white">{display?.colorDepth || 24}-bit RGB</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Refresh Rate:</span>
              <span className="font-medium text-slate-900 dark:text-white tabular-nums">{display?.estimatedRefreshRateHz || 60} Hz</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Battery Module:</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {battery.supported ? `${battery.levelPercent}% (${battery.condition})` : 'Desktop (Direct AC)'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Network Interface:</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {network?.online ? `Online (${network.downlinkMbps || 100} Mbps ${network.effectiveType || ''})` : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
