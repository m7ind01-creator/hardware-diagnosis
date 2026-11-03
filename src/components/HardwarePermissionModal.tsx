import React, { useState } from 'react';
import { useHardware } from '../context/HardwareContext';
import { 
  X, 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  Usb, 
  Terminal, 
  Check, 
  Copy, 
  AlertCircle, 
  Download,
  FolderOpen,
  CheckCircle2,
  Lock,
  Radio,
  Zap,
  Server
} from 'lucide-react';

export const HardwarePermissionModal: React.FC = () => {
  const { 
    isPermissionModalOpen, 
    setIsPermissionModalOpen, 
    permissionsState, 
    requestAllHardwareAccess,
    authorizeFileSystemAccess,
    authorizeWebHIDDevice,
    authorizeStorageQuota,
    agentStatus 
  } = useHardware();

  const [copiedCmd, setCopiedCmd] = useState(false);
  const [isAuthorizingAll, setIsAuthorizingAll] = useState(false);

  if (!isPermissionModalOpen) return null;

  const agentCommand = `curl -s ${window.location.origin}/agent.mjs | node`;

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(agentCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleAuthorizeAll = async () => {
    setIsAuthorizingAll(true);
    await requestAllHardwareAccess();
    setIsAuthorizingAll(false);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Hardware Access Permissions
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Allow browser hardware access to accurately detect your PC specifications
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPermissionModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs">
          {/* Privacy & Authorization Assurance */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>
                <strong>100% Private &amp; Local:</strong> All hardware detection runs directly in your browser. No personal data is collected or sent anywhere.
              </span>
            </div>
          </div>

          {/* Permission Item 1: High Entropy Hardware Architecture */}
          <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="font-semibold text-slate-900 dark:text-white text-xs">
                  1. High-Entropy Processor Architecture &amp; System Model
                </span>
              </div>
              {permissionsState.highEntropyQueried ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Authorized</span>
                </span>
              ) : (
                <button
                  onClick={requestAllHardwareAccess}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors cursor-pointer text-xs"
                >
                  Allow System Model
                </button>
              )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-xs">
              Allows the browser to read true 64-bit architecture, CPU instruction sets, exact operating system build, and hardware computer model.
            </p>
          </div>

          {/* Permission Item 2: Real Local Storage & Directory Inspection (File System Access API) */}
          <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="font-semibold text-slate-900 dark:text-white text-xs">
                  2. Local Drive &amp; Storage Inspection (File System Access)
                </span>
              </div>
              <button
                onClick={authorizeFileSystemAccess}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium transition-colors cursor-pointer text-xs"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>{permissionsState.fileSystemDirectoryGranted ? 'Change Folder' : 'Select Folder to Inspect'}</span>
              </button>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-xs">
              Uses the standard File System Access API to inspect your local storage drive, measure disk access latency, and verify disk volume integrity.
            </p>

            {/* Display scanned directory stats if available */}
            {permissionsState.fileSystemStats && (
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1 mt-2">
                <div className="flex flex-col sm:flex-row sm:justify-between font-medium text-slate-800 dark:text-slate-200 gap-1">
                  <span className="truncate">Folder: {permissionsState.fileSystemDirectoryName}</span>
                  <span className="tabular-nums">{permissionsState.fileSystemStats.scanDurationMs} ms latency</span>
                </div>
                <div className="text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row sm:justify-between gap-1 tabular-nums">
                  <span>Files: {permissionsState.fileSystemStats.filesCount} · Subfolders: {permissionsState.fileSystemStats.directoriesCount}</span>
                  <span>Scanned: {formatBytes(permissionsState.fileSystemStats.totalSizeBytes)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Permission Item 3: Hardware Bus Controllers (WebHID/WebUSB) */}
          <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Usb className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span className="font-semibold text-slate-900 dark:text-white text-xs">
                  3. Hardware Bus &amp; Controller Devices (WebHID)
                </span>
              </div>
              {permissionsState.webHidGranted ? (
                <span className="inline-flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{permissionsState.webHidDeviceName}</span>
                </span>
              ) : (
                <button
                  onClick={authorizeWebHIDDevice}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium transition-colors cursor-pointer text-xs"
                >
                  Scan Hardware Bus
                </button>
              )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-xs">
              Enables communication with external hardware monitoring hubs, fan controllers, or diagnostic USB devices.
            </p>
          </div>

          {/* Permission Item 4: Ring-0 Kernel Telemetry (Optional) */}
          <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                <span className="font-semibold text-slate-900 dark:text-white text-xs">
                  4. Direct Die Temperatures &amp; Physical NVMe S.M.A.R.T. (Optional)
                </span>
              </div>
              <span className={`text-xs font-medium ${
                agentStatus.state === 'connected'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500'
              }`}>
                {agentStatus.state === 'connected' ? 'Agent Connected' : 'Optional Helper'}
              </span>
            </div>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
              Modern web browsers sandbox direct CPU die thermistors and NVMe S.M.A.R.T. registers for security. If you need exact die temperatures, you can run this zero-dependency command in your terminal:
            </p>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto gap-2">
              <code className="text-blue-300 select-all break-all sm:break-normal text-[11px]">{agentCommand}</code>
              <button
                onClick={handleCopyCommand}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer flex-shrink-0"
                title="Copy Terminal Command"
              >
                {copiedCmd ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Starts a lightweight local agent on <code>127.0.0.1:49152</code>. The web app auto-connects in seconds.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5 px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <button
            onClick={handleAuthorizeAll}
            disabled={isAuthorizingAll}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Grant All Browser Permissions</span>
          </button>

          <button
            onClick={() => setIsPermissionModalOpen(false)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
