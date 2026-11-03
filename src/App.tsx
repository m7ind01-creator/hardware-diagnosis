/**
 * HardwareScope: Computer Hardware Diagnostic & Monitoring System
 */

import React from 'react';
import { HardwareProvider, useHardware } from './context/HardwareContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AgentConnectionModal } from './components/AgentConnectionModal';
import { NotificationCenter } from './components/NotificationCenter';
import { HardwarePermissionModal } from './components/HardwarePermissionModal';

// Views
import { OverviewView } from './views/OverviewView';
import { HardwareSpecsView } from './views/HardwareSpecsView';
import { CpuMonitorView } from './views/CpuMonitorView';
import { RamMonitorView } from './views/RamMonitorView';
import { GpuMonitorView } from './views/GpuMonitorView';
import { StorageHealthView } from './views/StorageHealthView';
import { TemperatureMonitorView } from './views/TemperatureMonitorView';
import { BatteryHealthView } from './views/BatteryHealthView';
import { DiagnosticCenterView } from './views/DiagnosticCenterView';
import { PerformanceHistoryView } from './views/PerformanceHistoryView';
import { TroubleshootingView } from './views/TroubleshootingView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';

const VIEW_TITLES: Record<string, string> = {
  overview: 'System Overview & Status',
  specs: 'Hardware Specifications',
  cpu: 'Processor (CPU)',
  ram: 'Memory (RAM)',
  gpu: 'Graphics (GPU)',
  storage: 'Storage & Drives',
  thermal: 'Temperatures & Cooling',
  battery: 'Battery & Power',
  diagnostic: 'Hardware Diagnostics',
  history: 'Performance History',
  troubleshooting: 'Troubleshooting & Solutions',
  reports: 'Diagnostic Reports',
  settings: 'Preferences & Settings'
};

const MainContent: React.FC = () => {
  const { activeView } = useHardware();

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview': return <OverviewView />;
      case 'specs': return <HardwareSpecsView />;
      case 'cpu': return <CpuMonitorView />;
      case 'ram': return <RamMonitorView />;
      case 'gpu': return <GpuMonitorView />;
      case 'storage': return <StorageHealthView />;
      case 'thermal': return <TemperatureMonitorView />;
      case 'battery': return <BatteryHealthView />;
      case 'diagnostic': return <DiagnosticCenterView />;
      case 'history': return <PerformanceHistoryView />;
      case 'troubleshooting': return <TroubleshootingView />;
      case 'reports': return <ReportsView />;
      case 'settings': return <SettingsView />;
      default: return <OverviewView />;
    }
  };

  const title = VIEW_TITLES[activeView] || 'PC Diagnostics';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Collapsible Left Sidebar */}
      <Sidebar />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Sticky Header */}
        <Header viewTitle={title} />

        {/* Scrollable View Container with responsive padding for mobile/tablet/desktop */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 pb-20 md:pb-6 min-h-0">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>

        {/* Mobile Bottom Navigation (Smartphones only) */}
        <MobileBottomNav />
      </div>

      {/* Global Modals */}
      <HardwarePermissionModal />
      <AgentConnectionModal />
      <NotificationCenter />
    </div>
  );
};

export default function App() {
  return (
    <HardwareProvider>
      <MainContent />
    </HardwareProvider>
  );
}
