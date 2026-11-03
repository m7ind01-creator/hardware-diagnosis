import React from 'react';
import { Sparkline } from './ChartComponents';
import { StatusBadge } from './StatusBadge';
import { LucideIcon, ChevronRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  status: string;
  icon: LucideIcon;
  sparklineData?: number[];
  sparklineColor?: string;
  onClick?: () => void;
  className?: string;
  dataSourceLabel?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  subValue,
  status,
  icon: Icon,
  sparklineData = [],
  sparklineColor = '#2563EB',
  onClick,
  className = '',
  dataSourceLabel
}) => {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-4 sm:p-5 shadow-xs transition-all duration-150 hover:border-slate-400 dark:hover:border-slate-700 cursor-pointer ${className}`}
    >
      {/* Top row: Icon + Title + Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex-shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate">
              {title}
            </h3>
            {dataSourceLabel && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                {dataSourceLabel}
              </span>
            )}
          </div>
        </div>

        <StatusBadge status={status} size="sm" />
      </div>

      {/* Middle row: Big metric & sub-metric */}
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {value}
          </span>
          {unit && (
            <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              {unit}
            </span>
          )}
        </div>

        {sparklineData.length > 1 && (
          <div className="ml-auto opacity-75 group-hover:opacity-100 transition-opacity">
            <Sparkline data={sparklineData} color={sparklineColor} />
          </div>
        )}
      </div>

      {/* Bottom row: Sub-info & View details cue */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <span className="truncate max-w-[200px]" title={subValue}>
          {subValue || 'Inspect details'}
        </span>
        <span className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-0.5 transition-transform">
          Details <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </span>
      </div>
    </div>
  );
};

