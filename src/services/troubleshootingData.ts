/**
 * Troubleshooting Knowledge Base
 * Detailed, safe, step-by-step guidance for common hardware malfunctions.
 */

import { TroubleshootingTopic } from '../types/hardware';

export const TROUBLESHOOTING_TOPICS: TroubleshootingTopic[] = [
  {
    id: 'trouble-overheating',
    title: 'Computer is Overheating / High Fan Noise',
    symptom: 'Fans spinning loudly at maximum RPM even at idle, chassis feels hot to the touch, or CPU throttling alerts triggered.',
    iconName: 'Flame',
    possibleCauses: [
      'Blocked air intake or exhaust vents due to dust or fabric obstruction',
      'Degraded, dry, or cracked thermal interface material (thermal paste)',
      'Failing cooling fan bearing or seized impeller',
      'High ambient room temperature or direct sunlight exposure',
      'Runaway background tasks constantly demanding 100% CPU/GPU cycles'
    ],
    safeTroubleshootingSteps: [
      '1. Place the computer on a firm, flat, non-fabric surface (never on a bed, pillow, or carpet).',
      '2. Inspect air intake vents and cooling grilles for lint or dust buildup. Use a can of compressed air in short bursts to blow outward from vents.',
      '3. Open HardwareScope CPU/GPU monitors to identify if a particular process is keeping utilization elevated.',
      '4. If using a desktop PC, ensure that all intake fans and exhaust fans spin freely when powered on.',
      '5. In Windows/macOS power settings, switch from "High Performance" to "Balanced" or "Standard Power" mode.'
    ],
    recommendedDiagnosticTests: ['test-thermal', 'test-cpu'],
    whenToSeekRepair: [
      'CPU or GPU core temperatures exceed 95°C even after thoroughly cleaning vents and idling.',
      'Cooling fans emit grinding, clicking, or screeching sounds (indicating bearing failure).',
      'Computer shuts down abruptly within minutes of turning on without an operating system error screen.'
    ],
    preventativeTips: [
      'Clean dust filters and fan grilles every 3 to 6 months.',
      'Avoid running laptops inside closed sleeves or tight backpacks while in sleep/standby mode.'
    ]
  },
  {
    id: 'trouble-slowness',
    title: 'Computer is Unusually Slow / Laggy',
    symptom: 'Applications take a long time to launch, cursor stutters, typing lags behind input, or overall system feels sluggish.',
    iconName: 'Clock',
    possibleCauses: [
      'Physical RAM is nearly 100% full, causing heavy disk swapping / virtual memory thrashing',
      'Primary boot drive has less than 10-15% free storage space remaining',
      'Too many startup applications launching automatically on boot',
      'CPU clock frequencies are throttled down to minimum base clock due to heat or power limiter',
      'Drive health degradation or slow mechanical hard drive (HDD) bottleneck'
    ],
    safeTroubleshootingSteps: [
      '1. Check the HardwareScope Memory Monitor: If RAM utilization is above 85%, close background browser tabs and memory-hungry applications.',
      '2. Check HardwareScope Storage Health: Ensure your primary boot drive has at least 20 GB of free space. Run native disk cleanup to remove temporary files.',
      '3. Open Task Manager (Ctrl+Shift+Esc on Windows) or Activity Monitor (Cmd+Space on Mac) and disable unnecessary "Startup" applications.',
      '4. Run a full antivirus or malware scan to eliminate malicious background miners.',
      '5. Restart the computer to clear out stale memory leaks and accumulated paging caches.'
    ],
    recommendedDiagnosticTests: ['test-cpu', 'test-ram', 'test-storage'],
    whenToSeekRepair: [
      'Disk usage remains pinned at 100% constantly even after rebooting and terminating all applications.',
      'Diagnostic reports show recurring SMART read/write or sector errors on the drive.',
      'System experiences erratic freezing accompanied by clicking sounds from internal storage.'
    ],
    preventativeTips: [
      'Keep at least 20% of your SSD storage capacity empty to allow optimal wear leveling and TRIM operations.',
      'Upgrade mechanical HDDs to an NVMe or SATA Solid State Drive for 10x-50x speed improvements.'
    ]
  },
  {
    id: 'trouble-restarts',
    title: 'Computer Restarts or Crashes Unexpectedly',
    symptom: 'Sudden Blue Screen of Death (BSOD), kernel panics, or instant black-screen power resets without warning.',
    iconName: 'AlertOctagon',
    possibleCauses: [
      'Power Supply Unit (PSU) unable to deliver steady voltage during peak current spikes',
      'Severe thermal emergency shutdown triggered by motherboard firmware to prevent chip burnout',
      'Faulty or unstable physical RAM module with bit-flip errors',
      'Corrupt graphics or chipset drivers',
      'Unstable CPU/RAM overclock or XMP/EXPO profile incompatibility'
    ],
    safeTroubleshootingSteps: [
      '1. Run the HardwareScope Memory Diagnostic test to check for buffer allocation patterns.',
      '2. If you have enabled CPU overclocking, undervolting, or high-speed XMP/EXPO profiles in BIOS, reset BIOS settings to "Optimized Defaults".',
      '3. Update your graphics card drivers directly from the manufacturer official website (NVIDIA, AMD, or Intel).',
      '4. Inspect the wall outlet and surge protector to make sure power delivery is stable and not loosely connected.',
      '5. Check Windows Event Viewer ("Kernel-Power Event 41") or macOS Console logs for panic trace codes.'
    ],
    recommendedDiagnosticTests: ['test-ram', 'test-thermal', 'test-system'],
    whenToSeekRepair: [
      'Crashes happen immediately even when entering the BIOS setup screen or safe mode.',
      'Burning smell, capacitor bulge, or audible popping sound came from the power supply unit.',
      'Diagnostic test consistently reports memory parity failure, indicating physical RAM replacement needed.'
    ],
    preventativeTips: [
      'Use a reputable surge protector or Uninterruptible Power Supply (UPS) to protect against voltage spikes.',
      'Never install third-party driver updater utilities from unverified sources.'
    ]
  },
  {
    id: 'trouble-storage-space',
    title: 'Hard Drive is Running Out of Space',
    symptom: 'Windows warns "Low Disk Space", macOS warns "Your disk is almost full", software updates fail to download.',
    iconName: 'HardDrive',
    possibleCauses: [
      'Accumulated Windows update rollback files, crash memory dumps, and browser cache files',
      'Large video recording archives, high-resolution raw photos, or game installations',
      'Unused software suites that remain installed',
      'Hidden system restore points or shadow copies consuming substantial volume quota'
    ],
    safeTroubleshootingSteps: [
      '1. Run native OS disk cleanup (Windows: "Storage Sense" / "Disk Cleanup"; macOS: "Storage Settings").',
      '2. Empty the Recycle Bin / Trash and the "Downloads" directory.',
      '3. Review installed applications in Settings and uninstall games or software programs you haven\'t opened in months.',
      '4. Clear temporary browser cache files and developer package manager caches (npm cache, docker containers, gradle).',
      '5. Relocate personal media libraries (videos, virtual machine images) to an external SSD or cloud backup.'
    ],
    recommendedDiagnosticTests: ['test-storage'],
    whenToSeekRepair: [
      'Drive capacity reports as 0 bytes or partitions mysteriously disappear from Disk Management.',
      'Drive becomes completely write-protected (read-only mode), which often happens when SSD controllers enter emergency lock mode after reaching end of flash life.'
    ],
    preventativeTips: [
      'Enable automated cloud archival or regularly purge downloads and temporary directories.'
    ]
  },
  {
    id: 'trouble-battery',
    title: 'Laptop Battery Drains Quickly or Won\'t Charge',
    symptom: 'Battery drains in less than an hour, battery percentage drops erratically, or laptop only turns on when plugged in.',
    iconName: 'BatteryCharging',
    possibleCauses: [
      'Chemical cell aging after hundreds of charge/discharge cycles',
      'Display brightness set to 100% with high refresh rate enabled',
      'High background CPU/GPU tasks preventing the processor from entering deep C-states',
      'Damaged power adapter cable, loose barrel connector, or worn USB-C charging port'
    ],
    safeTroubleshootingSteps: [
      '1. Check HardwareScope Battery Health: Compare current Full Charge Capacity against Original Design Capacity.',
      '2. If battery health is below 70%, the cells are physically worn and cannot deliver standard runtime.',
      '3. Lower display brightness to 50-60% and toggle dynamic refresh rate in display settings.',
      '4. Try charging using an alternate certified OEM charger and outlet to verify the brick is not failing.',
      '5. Check battery calibration: Charge to 100%, let run on battery until automatic sleep, then recharge uninterrupted to 100%.'
    ],
    recommendedDiagnosticTests: ['test-battery', 'test-thermal'],
    whenToSeekRepair: [
      'The laptop chassis or trackpad area is physically bulging (SWOLLEN BATTERY HAZARD — STOP USING IMMEDIATELY AND DISCONNECT CHARGER).',
      'Battery percentage stays at 0% and shuts off the instant the AC charger is unplugged.',
      'Battery condition is reported as "Replace Soon" or health percentage is under 50%.'
    ],
    preventativeTips: [
      'Avoid leaving the laptop plugged in 24/7 at 100% charge in high-temperature environments.',
      'Use OEM battery threshold charging tools (e.g., ASUS Battery Health, Lenovo Vantage, Dell Power Manager) to cap charging at 80% if mostly used plugged into a desk.'
    ]
  },
  {
    id: 'trouble-freezes',
    title: 'Computer Freezes Frequently / Unresponsive',
    symptom: 'Mouse cursor freezes, spinning beachball / hourglass, audio loops with buzzing sound, hard power reset required.',
    iconName: 'Snowflake',
    possibleCauses: [
      'Driver deadlocks (especially graphics card display driver TDR timeouts)',
      'Storage drive intermittent disconnects or SATA/PCIe bus timing errors',
      'Physical RAM contact oxidation or unstable memory timing',
      'Severe thermal throttling leading to CPU stall'
    ],
    safeTroubleshootingSteps: [
      '1. On Windows, press Ctrl+Win+Shift+B to quickly restart the graphics subsystem driver if display freezes.',
      '2. Inspect HardwareScope Temperature Monitor: Ensure the CPU or GPU isn\'t hitting 95°C+ right before lockups.',
      '3. Run System File Checker (Windows: run `sfc /scannow` in Administrator command prompt).',
      '4. If comfortable opening desktop PC (with power disconnected), re-seat RAM sticks and PCIe graphics card firmly into slots.',
      '5. Check for pending Windows / macOS system updates that contain critical kernel stability patches.'
    ],
    recommendedDiagnosticTests: ['test-cpu', 'test-ram', 'test-gpu'],
    whenToSeekRepair: [
      'System locks up immediately upon boot before reaching the login screen.',
      'Visual artifacts (pink lines, green checkerboard patterns) appear across the screen before each freeze.'
    ],
    preventativeTips: [
      'Keep BIOS/UEFI firmware updated to the latest stable non-beta release provided by your motherboard vendor.'
    ]
  },
  {
    id: 'trouble-gpu',
    title: 'GPU Performance is Poor / Low FPS / Artifacts',
    symptom: 'Low framerates in 3D apps, video stuttering during rendering, screen flickering, or textures failing to load.',
    iconName: 'Tv',
    possibleCauses: [
      'Laptop is running on the slow Integrated CPU GPU instead of the high-speed Dedicated GPU',
      'GPU thermal throttling due to choked intake fans or dried thermal paste',
      'Monitor cable plugged into the motherboard HDMI port instead of the dedicated graphics card port on desktop PCs',
      'Outdated or corrupted graphics drivers'
    ],
    safeTroubleshootingSteps: [
      '1. On Desktop PCs: Verify the monitor HDMI/DisplayPort cable is plugged into the discrete graphics card, NOT the motherboard I/O panel.',
      '2. In Windows Graphics Settings, set your high-performance applications to use "High Performance (Dedicated GPU)".',
      '3. Run the HardwareScope GPU Diagnostic test to benchmark shader pipelines and draw call latency.',
      '4. Perform a clean graphics driver installation using DDU (Display Driver Uninstaller) or the official NVIDIA/AMD clean install option.',
      '5. Check that GPU power cables (PCIe 8-pin / 12VHPWR) are firmly seated without sharp bends.'
    ],
    recommendedDiagnosticTests: ['test-gpu', 'test-thermal'],
    whenToSeekRepair: [
      'Colorful dots, horizontal flickering scanlines, or geometry tearing appear in all 3D applications (VRAM corruption).',
      'Graphics driver constantly crashes and reports "Hardware Error" in device manager.'
    ],
    preventativeTips: [
      'Never daisy-chain single PCIe power cables for high-wattage graphics cards.'
    ]
  },
  {
    id: 'trouble-ram-high',
    title: 'Memory Usage is Unusually High',
    symptom: 'HardwareScope reports >90% RAM utilization even when no heavy programs are intentionally active.',
    iconName: 'Cpu',
    possibleCauses: [
      'Browser with dozens of suspended background tabs consuming GBs of memory',
      'Memory leak in an active background service or updater process',
      'Non-paged pool memory leak caused by a faulty network card or storage driver'
    ],
    safeTroubleshootingSteps: [
      '1. Check HardwareScope RAM Monitor: Identify total installed RAM vs used bytes.',
      '2. In your web browser, enable "Memory Saver" or "Tab Snoozing" to automatically unload idle tabs.',
      '3. Restart third-party apps that have been running continuously for days or weeks.',
      '4. If Non-Paged Pool is consuming several gigabytes (in Task Manager > Performance > Memory), update your motherboard network / Ethernet driver.'
    ],
    recommendedDiagnosticTests: ['test-ram'],
    whenToSeekRepair: [
      'System reports less usable RAM than physically installed (e.g., "8 GB usable of 16 GB installed" indicates a dead RAM stick or bent CPU socket pin).'
    ],
    preventativeTips: [
      'Ensure modern multitasking machines have at least 16 GB to 32 GB of RAM for comfortable headroom.'
    ]
  }
];
