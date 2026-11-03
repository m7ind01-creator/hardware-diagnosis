import React from 'react';
import { useHardware } from '../context/HardwareContext';
import { 
  LayoutDashboard, 
  FileText, 
  Cpu, 
  MemoryStick, 
  Menu,
  Stethoscope
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeView, setActiveView, setIsMobileMenuOpen, isDiagnosticRunning, detectedIssues } = useHardware();

  const primaryTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'specs', label: 'Specs', icon: FileText },
    { id: 'cpu', label: 'CPU', icon: Cpu },
    { id: 'ram', label: 'RAM', icon: MemoryStick },
    { 
      id: 'diagnostic', 
      label: 'Diagnostics', 
      icon: Stethoscope,
      badge: isDiagnosticRunning ? '•' : undefined
    }
  ];

  return (
    <nav 
      className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-slate-800 shadow-md"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around h-14 px-1 max-w-lg mx-auto">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors relative cursor-pointer min-h-[44px] ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-current'}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 rounded-t-full bg-blue-600 dark:bg-blue-400" />
              )}
            </button>
          );
        })}

        {/* 'More' Button to trigger full drawer menu */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex-1 flex flex-col items-center justify-center py-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors relative cursor-pointer min-h-[44px]"
          aria-label="Open Full Navigation Menu"
        >
          <div className="relative">
            <Menu className="w-5 h-5" />
            {detectedIssues.length > 0 && (
              <span className="absolute -top-1 -right-1.5 flex h-3.5 min-w-[14px] px-0.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                {detectedIssues.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">
            More
          </span>
        </button>
      </div>
    </nav>
  );
};
