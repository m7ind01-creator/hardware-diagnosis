import React from 'react';
import { CPUCoreInfo } from '../types/hardware';

interface RealtimeAreaChartProps {
  data: number[];
  color?: string; // hex or tailwind class
  title?: string;
  unit?: string;
  height?: number;
  maxVal?: number;
  minVal?: number;
  showMinMax?: boolean;
}

export const RealtimeAreaChart: React.FC<RealtimeAreaChartProps> = ({
  data,
  color = '#2563EB',
  title,
  unit = '%',
  height = 140,
  maxVal = 100,
  minVal = 0,
  showMinMax = true
}) => {
  const points = data.length > 0 ? data : [0];
  const current = points[points.length - 1];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const avg = Math.round(points.reduce((a, b) => a + b, 0) / points.length);

  // SVG coordinate calculations
  const width = 500;
  const paddingBottom = 20;
  const paddingTop = 15;
  const chartHeight = height - paddingBottom - paddingTop;

  const getX = (index: number) => {
    if (points.length <= 1) return 0;
    return (index / (points.length - 1)) * width;
  };

  const getY = (val: number) => {
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    const ratio = (clamped - minVal) / (maxVal - minVal || 1);
    return height - paddingBottom - ratio * chartHeight;
  };

  // Build SVG path
  let pathD = `M 0,${getY(points[0])}`;
  for (let i = 1; i < points.length; i++) {
    const x0 = getX(i - 1);
    const y0 = getY(points[i - 1]);
    const x1 = getX(i);
    const y1 = getY(points[i]);
    const cpX1 = x0 + (x1 - x0) * 0.5;
    const cpX2 = cpX1;
    pathD += ` C ${cpX1},${y0} ${cpX2},${y1} ${x1},${y1}`;
  }

  const fillD = `${pathD} L ${width},${height - paddingBottom} L 0,${height - paddingBottom} Z`;

  return (
    <div className="w-full flex flex-col">
      {title && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </span>
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-mono">
            <span className="text-slate-500 dark:text-slate-400">Avg: <strong className="text-slate-700 dark:text-slate-200">{avg}{unit}</strong></span>
            <span className="text-slate-500 dark:text-slate-400">Peak: <strong className="text-slate-700 dark:text-slate-200">{max}{unit}</strong></span>
            <span className="font-bold text-sm" style={{ color }}>{current}{unit}</span>
          </div>
        </div>
      )}

      <div className="relative w-full overflow-hidden rounded-lg bg-slate-50/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800" style={{ height }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full preserve-3d"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`chart-grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1={getY(maxVal)} x2={width} y2={getY(maxVal)} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
          <line x1="0" y1={getY((maxVal + minVal) / 2)} x2={width} y2={getY((maxVal + minVal) / 2)} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
          <line x1="0" y1={getY(minVal)} x2={width} y2={getY(minVal)} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />

          {/* Area Fill */}
          <path d={fillD} fill={`url(#chart-grad-${color.replace('#', '')})`} />

          {/* Stroke Line */}
          <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />

          {/* Live indicator dot at tip */}
          {points.length > 0 && (
            <circle
              cx={getX(points.length - 1)}
              cy={getY(current)}
              r="4.5"
              fill={color}
              className="animate-pulse"
            />
          )}
        </svg>

        {showMinMax && (
          <div className="absolute right-2 top-1.5 flex flex-col items-end text-[10px] font-mono text-slate-400 dark:text-slate-500 pointer-events-none">
            <span>{maxVal}{unit}</span>
            <span className="mt-auto">{minVal}{unit}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const Sparkline: React.FC<{ data: number[]; color?: string; height?: number; width?: number }> = ({
  data,
  color = '#2563EB',
  height = 34,
  width = 110
}) => {
  const points = data.length > 0 ? data : [0, 0];
  const max = Math.max(...points, 100);
  const min = 0;

  const getX = (i: number) => (i / (points.length - 1)) * width;
  const getY = (val: number) => height - 3 - ((val - min) / (max - min || 1)) * (height - 6);

  let pathD = `M 0,${getY(points[0])}`;
  for (let i = 1; i < points.length; i++) {
    pathD += ` L ${getX(i)},${getY(points[i])}`;
  }

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={getX(points.length - 1)} cy={getY(points[points.length - 1])} r="3" fill={color} />
    </svg>
  );
};

export const CircularGauge: React.FC<{
  value: number; // 0 - 100
  title?: string;
  subtitle?: string;
  size?: number;
  strokeWidth?: number;
}> = ({
  value,
  title,
  subtitle,
  size = 180,
  strokeWidth = 14
}) => {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use a 270-degree arc
  const arcLength = circumference * 0.75;
  const offset = arcLength - (clamped / 100) * arcLength;

  let color = '#20A66A'; // Success
  if (clamped < 50) color = '#DF5555'; // Danger
  else if (clamped < 85) color = '#E8A23B'; // Warning

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform rotate-135">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Value stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold font-mono tracking-tighter" style={{ color }}>
            {clamped}
          </span>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
            / 100
          </span>
        </div>
      </div>

      {title && (
        <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-2">
          {title}
        </span>
      )}
      {subtitle && (
        <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 text-center max-w-[200px]">
          {subtitle}
        </span>
      )}
    </div>
  );
};

export const CoreActivityGrid: React.FC<{ cores: CPUCoreInfo[] }> = ({ cores }) => {
  return (
    <div className="grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 w-full">
      {cores.map((core) => {
        const util = Math.min(100, Math.max(0, core.utilization));
        
        let heatBg = 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300';
        if (util > 85) {
          heatBg = 'bg-rose-500/20 border-rose-500/40 text-rose-700 dark:text-rose-300';
        } else if (util > 60) {
          heatBg = 'bg-amber-500/20 border-amber-500/40 text-amber-700 dark:text-amber-300';
        } else if (util > 30) {
          heatBg = 'bg-blue-500/15 border-blue-500/30 text-blue-700 dark:text-blue-300';
        }

        return (
          <div
            key={core.coreId}
            className={`flex flex-col p-2 rounded-lg border text-center transition-all duration-300 ${heatBg}`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono opacity-80 mb-1">
              <span>T{core.coreId}</span>
              {core.tempC && <span>{core.tempC}°</span>}
            </div>
            <div className="text-sm font-bold font-mono tracking-tight">
              {util}%
            </div>
            {/* Visual micro-bar */}
            <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-current rounded-full transition-all duration-500"
                style={{ width: `${util}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const MemoryDistributionBar: React.FC<{
  usedPct: number;
  availablePct: number;
  cachedPct?: number;
}> = ({ usedPct, availablePct, cachedPct = 0 }) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md overflow-hidden flex shadow-inner">
        <div
          className="bg-primary transition-all duration-500"
          style={{ width: `${usedPct}%`, backgroundColor: '#2563EB' }}
          title={`Active Memory: ${usedPct}%`}
        />
        {cachedPct > 0 && (
          <div
            className="bg-amber-500/70 transition-all duration-500"
            style={{ width: `${cachedPct}%` }}
            title={`Cached/Standby: ${cachedPct}%`}
          />
        )}
        <div
          className="bg-emerald-500/60 transition-all duration-500"
          style={{ width: `${availablePct}%` }}
          title={`Free/Available: ${availablePct}%`}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono gap-1.5">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#2563EB' }}></span>
          <span>In Use ({usedPct}%)</span>
        </div>
        {cachedPct > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/70"></span>
            <span>Standby ({cachedPct}%)</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/60"></span>
          <span>Free ({availablePct}%)</span>
        </div>
      </div>
    </div>
  );
};
