/**
 * HardwarePermissionService
 * Manages real browser hardware permissions, File System Access API,
 * High-Entropy User-Agent Client Hints, WebHID/WebUSB controllers,
 * and Persistent Storage Quotas.
 */

import { HardwarePermissionsState } from '../types/hardware';

export class HardwarePermissionService {
  private pressureObserver: any = null;

  // 1. High Entropy Hardware & CPU Architecture Query
  async requestHighEntropyHardware(): Promise<{
    architecture?: string;
    bitness?: string;
    model?: string;
    platform?: string;
    platformVersion?: string;
  }> {
    try {
      if ((navigator as any).userAgentData?.getHighEntropyValues) {
        const hints = await (navigator as any).userAgentData.getHighEntropyValues([
          'architecture',
          'bitness',
          'model',
          'platform',
          'platformVersion',
          'fullVersionList',
          'wow64'
        ]);
        return {
          architecture: hints.architecture,
          bitness: hints.bitness,
          model: hints.model,
          platform: hints.platform,
          platformVersion: hints.platformVersion
        };
      }
    } catch (e) {
      // User or browser declined or not supported
    }
    return {};
  }

  // 2. Persistent Storage Permission
  async requestPersistentStorage(): Promise<boolean> {
    try {
      if (navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persist();
        return isPersisted;
      }
    } catch {}
    return false;
  }

  // 3. File System Access API: Directory & Disk Scanner
  // Prompts user to select a drive or folder, then reads metadata safely
  async requestDirectoryAccess(maxScanFiles = 300): Promise<{
    name: string;
    filesCount: number;
    directoriesCount: number;
    totalSizeBytes: number;
    scanDurationMs: number;
    largestFiles: Array<{ name: string; sizeBytes: number }>;
  } | null> {
    if (typeof (window as any).showDirectoryPicker !== 'function') {
      throw new Error('File System Access API is not supported in this browser. Please use Chrome, Edge, or an updated Chromium browser.');
    }

    const dirHandle = await (window as any).showDirectoryPicker({
      mode: 'read',
      startIn: 'desktop'
    });

    const startTime = performance.now();
    let filesCount = 0;
    let directoriesCount = 0;
    let totalSizeBytes = 0;
    const fileList: Array<{ name: string; sizeBytes: number }> = [];

    // Traverse directory tree up to maxScanFiles
    async function traverse(handle: any, depth = 0) {
      if (depth > 4 || filesCount >= maxScanFiles) return;

      try {
        for await (const entry of handle.values()) {
          if (filesCount >= maxScanFiles) break;

          if (entry.kind === 'file') {
            filesCount++;
            try {
              const file = await entry.getFile();
              totalSizeBytes += file.size;
              fileList.push({ name: file.name, sizeBytes: file.size });
            } catch {}
          } else if (entry.kind === 'directory') {
            directoriesCount++;
            await traverse(entry, depth + 1);
          }
        }
      } catch {}
    }

    await traverse(dirHandle);

    const scanDurationMs = Math.round(performance.now() - startTime);

    // Sort largest files
    fileList.sort((a, b) => b.sizeBytes - a.sizeBytes);
    const largestFiles = fileList.slice(0, 5);

    return {
      name: dirHandle.name || 'Selected System Directory',
      filesCount,
      directoriesCount,
      totalSizeBytes,
      scanDurationMs,
      largestFiles
    };
  }

  // 4. WebHID Hardware Bus Device Scanner
  async requestWebHIDDevice(): Promise<{ productName: string; vendorId: number; productId: number } | null> {
    if (typeof (navigator as any).hid === 'undefined') {
      throw new Error('WebHID API is not supported in this browser or is restricted.');
    }

    const devices = await (navigator as any).hid.requestDevice({ filters: [] });
    if (devices && devices.length > 0) {
      const dev = devices[0];
      return {
        productName: dev.productName || 'Hardware Controller Interface',
        vendorId: dev.vendorId,
        productId: dev.productId
      };
    }
    return null;
  }

  // 5. Compute Pressure API (CPU thermal and compute pressure)
  startPressureObserver(onPressureChange: (state: 'nominal' | 'fair' | 'serious' | 'critical') => void): boolean {
    try {
      if (typeof (window as any).PressureObserver !== 'undefined') {
        const observer = new (window as any).PressureObserver((records: any[]) => {
          if (records && records.length > 0) {
            const last = records[records.length - 1];
            onPressureChange(last.state);
          }
        });
        this.pressureObserver = observer;

        try {
          const res = observer.observe('cpu', { sampleInterval: 2000 });
          if (res && typeof res.catch === 'function') {
            res.catch(() => {
              // Gracefully handle Disallowed by permissions policy (e.g. iframes)
              this.stopPressureObserver();
            });
          }
          return true;
        } catch {
          // Synchronous throw when disallowed by permissions policy
          this.stopPressureObserver();
          return false;
        }
      }
    } catch {
      this.stopPressureObserver();
    }
    return false;
  }

  stopPressureObserver() {
    try {
      if (this.pressureObserver) {
        this.pressureObserver.disconnect();
        this.pressureObserver = null;
      }
    } catch {}
  }
}

export const hardwarePermissionService = new HardwarePermissionService();
