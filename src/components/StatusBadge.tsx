import React from 'react';
import { HardwareDataSource } from '../types/hardware';
import { CheckCircle2, AlertTriangle, AlertOctagon, HelpCircle, HardDrive, Cpu, Radio } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md', 
  showIcon = true,
  className = '' 
}) => {
  const norm = status.toLowerCase();

  let dotColor = 'bg-slate-400';
  let textColor = 'text-slate-600 dark:text-slate-300';
  let Icon = HelpCircle;

  if (norm.includes('healthy') || norm.includes('passed') || norm.includes('excellent') || norm.includes('good') || norm.includes('normal') || norm.includes('connected')) {
    dotColor = 'bg-emerald-500';
    textColor = 'text-emerald-700 dark:text-emerald-400 font-medium';
    Icon = CheckCircle2;
  } else if (norm.includes('warning') || norm.includes('warm') || norm.includes('caution') || norm.includes('fair') || norm.includes('moderate') || norm.includes('needs attention') || norm.includes('provisional') || norm.includes('degraded')) {
    dotColor = 'bg-amber-500';
    textColor = 'text-amber-700 dark:text-amber-400 font-medium';
    Icon = AlertTriangle;
  } else if (norm.includes('critical') || norm.includes('failed') || norm.includes('overheating') || norm.includes('danger') || norm.includes('replace soon') || norm.includes('error')) {
    dotColor = 'bg-rose-500';
    textColor = 'text-rose-700 dark:text-rose-400 font-medium';
    Icon = AlertOctagon;
  } else if (norm.includes('demo')) {
    dotColor = 'bg-purple-500';
    textColor = 'text-purple-700 dark:text-purple-300 font-medium';
    Icon = Radio;
  } else if (norm.includes('agent') || norm.includes('requires agent')) {
    dotColor = 'bg-slate-400';
    textColor = 'text-slate-500 dark:text-slate-400';
    Icon = HardDrive;
  } else if (norm.includes('running')) {
    dotColor = 'bg-blue-500';
    textColor = 'text-blue-700 dark:text-blue-400 font-medium';
    Icon = Cpu;
  }

  const textSizes = {
    sm: 'text-[11px] gap-1.5',
    md: 'text-xs gap-1.5',
    lg: 'text-sm gap-2'
  }[size];

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  }[size];

  return (
    <span className={`inline-flex items-center ${textSizes} ${textColor} ${className}`}>
      <span className={`rounded-full shrink-0 ${dotSizes} ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
};

export const DataSourceBadge: React.FC<{ source: HardwareDataSource; className?: string }> = ({ source, className = '' }) => {
  if (source === 'demo-data') {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs text-purple-700 dark:text-purple-400 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
        <span className="font-medium">Demo Mode</span>
      </span>
    );
  }

  if (source === 'local-agent') {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span className="font-medium">Local Agent Connected</span>
      </span>
    );
  }

  if (source === 'live-browser') {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
        <span className="font-medium">Live System Telemetry</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
      <span>Hardware Access Required</span>
    </span>
  );
};

