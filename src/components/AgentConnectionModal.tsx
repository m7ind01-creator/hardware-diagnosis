import React, { useState } from 'react';
import { useHardware } from '../context/HardwareContext';
import { 
  X, 
  Server, 
  Terminal, 
  Download, 
  Copy, 
  Check, 
  Wifi, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { AGENT_SCRIPT_CODE, downloadAgentScriptFile } from '../services/agentScriptSource';

export const AgentConnectionModal: React.FC = () => {
  const { 
    isAgentModalOpen, 
    setIsAgentModalOpen, 
    agentStatus, 
    settings, 
    updateSettings, 
    testAgentConnection 
  } = useHardware();

  const [copied, setCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [port, setPort] = useState(String(settings.agentPort || 49152));
  const [token, setToken] = useState(settings.agentAuthToken || '');

  if (!isAgentModalOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(AGENT_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    updateSettings({
      agentPort: parseInt(port, 10) || 49152,
      agentAuthToken: token
    });

    const success = await testAgentConnection();
    setIsTesting(false);
    if (success) {
      setTestResult({ ok: true, msg: 'Connected successfully to Local Diagnostic Agent on 127.0.0.1!' });
    } else {
      setTestResult({
        ok: false,
        msg: 'Could not connect. Ensure `node rigsentinel-agent.mjs` is actively running in your terminal.'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 flex-shrink-0">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Local Hardware Agent (Optional)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Unlock direct CPU/GPU temperature sensors and storage SMART registers
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAgentModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Security & Architecture Notice */}
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex gap-2.5">
            <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 dark:text-blue-200 space-y-1">
              <p className="font-semibold">Why is a local agent required for die thermals?</p>
              <p className="opacity-90 leading-relaxed text-xs">
                Web browsers operate inside an isolated security sandbox that restricts ring-0 direct hardware queries. The agent is a lightweight, zero-dependency Node.js script running only on <code>127.0.0.1</code> (localhost) to inspect hardware sensors without uploading any data.
              </p>
            </div>
          </div>

          {/* Current Connection Status */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${agentStatus.state === 'connected' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              <span>
                Status: <strong className={agentStatus.state === 'connected' ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-600 dark:text-slate-400'}>
                  {agentStatus.state === 'connected' ? 'Connected' : 'Offline'}
                </strong>
              </span>
            </div>
            {agentStatus.lastPingMs && (
              <span className="text-slate-500 tabular-nums">Latency: {agentStatus.lastPingMs} ms</span>
            )}
          </div>

          {/* Quick Setup Steps */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Quick 2-Step Setup
            </h3>

            {/* Step 1 */}
            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-medium text-xs text-slate-800 dark:text-slate-200">
                  Step 1: Download or copy the standalone agent script
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadAgentScriptFile}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .mjs</span>
                  </button>
                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Script'}</span>
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Requires Node.js 18+. No external npm packages needed.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="font-medium text-xs text-slate-800 dark:text-slate-200">
                Step 2: Run in your terminal
              </span>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto gap-2">
                <code className="text-blue-300">node rigsentinel-agent.mjs</code>
                <Terminal className="w-4 h-4 text-slate-400 ml-2 flex-shrink-0" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The agent will start on <code>http://127.0.0.1:49152</code> and begin reading hardware counters.
              </p>
            </div>
          </div>

          {/* Connection Settings */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Connection Settings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Localhost Port
                </label>
                <input
                  type="number"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  placeholder="49152"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Auth Token (Optional)
                </label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  placeholder="Leave empty if unset"
                />
              </div>
            </div>

            {testResult && (
              <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                testResult.ok
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
              }`}>
                {testResult.ok ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                <span>{testResult.msg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <button
            onClick={() => setIsAgentModalOpen(false)}
            className="w-full sm:w-auto px-4 py-2 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Wifi className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Testing Handshake...' : 'Connect to Agent'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
