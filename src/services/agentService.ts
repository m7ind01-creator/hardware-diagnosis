/**
 * AgentService: Connects to the local agent running on 127.0.0.1
 */

export interface AgentStatus {
  state: 'disconnected' | 'connecting' | 'connected' | 'error';
  lastPingMs?: number;
  agentVersion?: string;
  platform?: string;
  errorMessage?: string;
}

export class AgentService {
  private port: number = 49152;
  private token: string = '';
  private statusListeners: Array<(status: AgentStatus) => void> = [];
  private currentStatus: AgentStatus = { state: 'disconnected' };

  constructor(port = 49152, token = '') {
    this.port = port;
    this.token = token;
  }

  setConfiguration(port: number, token: string) {
    this.port = port;
    this.token = token;
  }

  subscribe(listener: (status: AgentStatus) => void) {
    this.statusListeners.push(listener);
    listener(this.currentStatus);
    return () => {
      this.statusListeners = this.statusListeners.filter(l => l !== listener);
    };
  }

  private notify(status: AgentStatus) {
    this.currentStatus = status;
    this.statusListeners.forEach(listener => listener(status));
  }

  async checkHealth(): Promise<boolean> {
    const startTime = performance.now();
    try {
      this.notify({ state: 'connecting' });
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const headers: Record<string, string> = {};
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const res = await fetch(`http://127.0.0.1:${this.port}/api/health`, {
        signal: controller.signal,
        headers
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const latency = Math.round(performance.now() - startTime);
        this.notify({
          state: 'connected',
          lastPingMs: latency,
          agentVersion: data.version || '1.0.0',
          platform: data.platform
        });
        return true;
      } else {
        this.notify({
          state: 'error',
          errorMessage: `Agent returned HTTP ${res.status} (${res.statusText})`
        });
        return false;
      }
    } catch (err: any) {
      this.notify({
        state: 'disconnected',
        errorMessage: err.name === 'AbortError' ? 'Connection timed out' : 'No local agent service responding on port ' + this.port
      });
      return false;
    }
  }

  async fetchMetrics(): Promise<any | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const headers: Record<string, string> = {};
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const res = await fetch(`http://127.0.0.1:${this.port}/api/metrics`, {
        signal: controller.signal,
        headers
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (err) {
      return null;
    }
  }
}

export const defaultAgentService = new AgentService();
