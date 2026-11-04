import React, { useState, useEffect } from 'react';
import { useHardware } from '../context/HardwareContext';
import { 
  LayoutDashboard, 
  FileText, 
  Cpu, 
  MemoryStick, 
  Tv, 
  HardDrive, 
  Thermometer, 
  Battery, 
  Stethoscope, 
  LineChart, 
  HelpCircle, 
  ClipboardCheck, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Radio, 
  AlertTriangle,
  Server,
  X
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    agentStatus, 
    settings, 
    toggleDemoMode, 
    setIsAgentModalOpen, 
    detectedIssues,
    isDiagnosticRunning,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useHardware();

  const [collapsed, setCollapsed] = useState(false);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'specs', label: 'Hardware Specifications', icon: FileText },
    { id: 'cpu', label: 'CPU Monitor', icon: Cpu },
    { id: 'ram', label: 'Memory Monitor', icon: MemoryStick },
    { id: 'gpu', label: 'GPU Monitor', icon: Tv },
    { id: 'storage', label: 'Storage Health', icon: HardDrive },
    { id: 'thermal', label: 'Temperature Monitor', icon: Thermometer },
    { id: 'battery', label: 'Battery Health', icon: Battery },
    { 
      id: 'diagnostic', 
      label: 'Diagnostic Center', 
      icon: Stethoscope,
      badge: isDiagnosticRunning ? 'Running' : undefined,
      badgeType: 'blue'
    },
    { id: 'history', label: 'Performance History', icon: LineChart },
    { 
      id: 'troubleshooting', 
      label: 'Troubleshooting', 
      icon: HelpCircle,
      badge: detectedIssues.length > 0 ? String(detectedIssues.length) : undefined,
      badgeType: 'amber'
    },
    { id: 'reports', label: 'Diagnostic Reports', icon: ClipboardCheck },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (id: string) => {
    setActiveView(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* 1. Desktop & Large Laptop Collapsible Sidebar */}
      <aside 
        className={`hidden lg:flex relative flex-col flex-shrink-0 transition-all duration-300 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] z-20 ${
          collapsed ? 'w-18' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800">
          {!collapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white truncate">
                  {settings.systemNameOverride || 'RigSentinel'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Hardware &amp; System Sentinel
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
          )}

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                } ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`} />
                
                {!collapsed && (
                  <span className="truncate text-left flex-1">
                    {item.label}
                  </span>
                )}

                {!collapsed && item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    item.badgeType === 'amber'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {/* Collapsed active dot indicator */}
                {collapsed && isActive && (
                  <span className="absolute right-1 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Connection & Demo Controls */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          {/* Agent connection button */}
          <button
            onClick={() => setIsAgentModalOpen(true)}
            className={`w-full flex items-center gap-2 p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
              agentStatus.state === 'connected'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700 hover:border-slate-400'
            } ${collapsed ? 'justify-center' : ''}`}
            title={agentStatus.state === 'connected' ? 'Local Agent Connected' : 'Connect Local Agent'}
          >
            <Server className="w-3.5 h-3.5 flex-shrink-0 text-current" />
            {!collapsed && (
              <div className="flex flex-col text-left truncate flex-1">
                <span className="font-semibold text-[11px] truncate">
                  {agentStatus.state === 'connected' ? 'Agent: Connected' : 'Local Agent: Offline'}
                </span>
                <span className="text-[10px] opacity-75">
                  {agentStatus.state === 'connected' ? 'Die thermals enabled' : 'Optional die sensor helper'}
                </span>
              </div>
            )}
          </button>

          {/* Demo Mode Toggle */}
          <button
            onClick={toggleDemoMode}
            className={`w-full flex items-center gap-2 p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
              settings.demoMode
                ? 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800'
                : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700 hover:text-slate-900'
            } ${collapsed ? 'justify-center' : ''}`}
            title="Toggle Simulation / Demo Mode"
          >
            <Radio className="w-3.5 h-3.5 flex-shrink-0 text-current" />
            {!collapsed && (
              <div className="flex items-center justify-between w-full text-[11px]">
                <span className="font-medium">Simulation Mode</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  settings.demoMode ? 'bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 font-bold' : 'bg-slate-200 dark:bg-slate-700'
                }`}>
                  {settings.demoMode ? 'Active' : 'Off'}
                </span>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* 2. Mobile & Tablet Drawer (Active when isMobileMenuOpen is true) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div 
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] flex flex-col bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out transform lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
      >
        {/* Drawer Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
                {settings.systemNameOverride || 'RigSentinel'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Hardware &amp; System Sentinel
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group relative cursor-pointer min-h-[42px] ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`} />
                
                <span className="truncate text-left flex-1">
                  {item.label}
                </span>

                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    item.badgeType === 'amber'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Drawer Footer Controls */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <button
            onClick={() => {
              setIsAgentModalOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2 p-2.5 rounded-lg border text-xs transition-colors cursor-pointer min-h-[44px] ${
              agentStatus.state === 'connected'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700 hover:border-slate-400'
            }`}
          >
            <Server className="w-4 h-4 flex-shrink-0 text-current" />
            <div className="flex flex-col text-left truncate flex-1">
              <span className="font-semibold text-xs truncate">
                {agentStatus.state === 'connected' ? 'Agent: Connected' : 'Local Agent: Offline'}
              </span>
              <span className="text-[10px] opacity-75">
                {agentStatus.state === 'connected' ? 'Hardware die thermals enabled' : 'Optional ring-0 thermal helper'}
              </span>
            </div>
          </button>

          <button
            onClick={toggleDemoMode}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs transition-colors cursor-pointer min-h-[44px] ${
              settings.demoMode
                ? 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800'
                : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-current" />
              <span className="font-medium">Simulation Mode</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded ${
              settings.demoMode ? 'bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 font-bold' : 'bg-slate-200 dark:bg-slate-700'
            }`}>
              {settings.demoMode ? 'Active' : 'Off'}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
