import React, { useState } from 'react';
import { useHardware } from '../context/HardwareContext';
import { TROUBLESHOOTING_TOPICS } from '../services/troubleshootingData';
import { TroubleshootingTopic } from '../types/hardware';
import { 
  HelpCircle, 
  Flame, 
  Clock, 
  AlertOctagon, 
  HardDrive, 
  BatteryCharging, 
  Snowflake, 
  Tv, 
  Cpu, 
  ChevronRight, 
  ShieldAlert, 
  Play, 
  Wrench, 
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const TroubleshootingView: React.FC = () => {
  const { 
    detectedIssues, 
    runSingleDiagnostic, 
    diagnostics, 
    setActiveView,
    fixHardwareIssue 
  } = useHardware();

  const [selectedTopicId, setSelectedTopicId] = useState<string>(TROUBLESHOOTING_TOPICS[0].id);

  const activeTopic = TROUBLESHOOTING_TOPICS.find(t => t.id === selectedTopicId) || TROUBLESHOOTING_TOPICS[0];

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return Flame;
      case 'Clock': return Clock;
      case 'AlertOctagon': return AlertOctagon;
      case 'HardDrive': return HardDrive;
      case 'BatteryCharging': return BatteryCharging;
      case 'Snowflake': return Snowflake;
      case 'Tv': return Tv;
      default: return Cpu;
    }
  };

  const handleLaunchRecommendedTest = async (testId: string) => {
    await runSingleDiagnostic(testId);
    setActiveView('diagnostic');
  };

  return (
    <div className="space-y-5 sm:space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 flex-shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Hardware Troubleshooting &amp; Problem Resolution
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Correlated solutions and step-by-step guides for everything detected on your computer
            </p>
          </div>
        </div>

        {detectedIssues.length > 0 ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-xs font-semibold self-start md:self-auto">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-500" />
            <span>{detectedIssues.length} Correlated Problem{detectedIssues.length > 1 ? 's' : ''} Identified</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 text-xs font-semibold self-start md:self-auto">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
            <span>0 Hardware Defects Active</span>
          </div>
        )}
      </div>

      {/* Live Detected Issues Section (If Any) */}
      {detectedIssues.length > 0 && (
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Active Hardware Problems Requiring Attention
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Showing {detectedIssues.length} live issues
            </span>
          </div>

          <div className="space-y-3">
            {detectedIssues.map((issue) => {
              const isCritical = issue.severity === 'critical' || issue.severity === 'high';
              const dotColor = isCritical ? 'bg-rose-500' : 'bg-amber-500';

              return (
                <div
                  key={issue.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dotColor} flex-shrink-0`}></span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {issue.title}
                      </h4>
                      <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {issue.component}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500">Live Metric:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {issue.detectedValue}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {issue.explanation}
                  </p>

                  <div className="p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                    <span className="font-semibold text-blue-700 dark:text-blue-300">How to Fix: </span>
                    <span>{issue.recommendedAction}</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                    <span className="text-slate-400 text-[11px]">
                      Expected threshold: {issue.expectedThreshold}
                    </span>

                    {issue.quickFixLabel && (
                      <button
                        onClick={() => fixHardwareIssue(issue)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>{issue.quickFixLabel}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Two Column Layout: Topics on Left, Guide on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column: Topics List */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 px-1">
            Common Hardware Scenarios
          </h3>

          <div className="space-y-1.5">
            {TROUBLESHOOTING_TOPICS.map((topic) => {
              const Icon = getTopicIcon(topic.iconName);
              const isSelected = selectedTopicId === topic.id;

              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/30 text-blue-900 dark:text-white border-blue-200 dark:border-blue-900 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold truncate">
                      {topic.title}
                    </span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Step-by-Step Guide for Active Topic */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-xs space-y-5">
            {/* Header */}
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Resolution Guide
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {activeTopic.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                <strong>Symptoms:</strong> {activeTopic.symptom}
              </p>
            </div>

            {/* Possible Causes */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Potential Causes
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {activeTopic.possibleCauses.map((cause, idx) => (
                  <li key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safe Step-by-Step Instructions */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Safe User Troubleshooting Steps</span>
              </h4>
              <div className="space-y-2">
                {activeTopic.safeTroubleshootingSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans"
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Diagnostics */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Recommended Verification Diagnostics
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeTopic.recommendedDiagnosticTests.map((testId) => {
                  const test = diagnostics.find(d => d.id === testId);
                  return (
                    <button
                      key={testId}
                      onClick={() => handleLaunchRecommendedTest(testId)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Run {test?.name || testId}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* When to Seek Professional Repair */}
            <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 space-y-2">
              <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>When to Seek Professional Authorized Repair</span>
              </h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-rose-800 dark:text-rose-300">
                {activeTopic.whenToSeekRepair.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

