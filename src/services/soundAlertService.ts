/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * SoundAlertService provides synthesized Web Audio API sound chimes
 * and optional desktop Web Notifications without external asset dependencies.
 */
class SoundAlertService {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.audioCtx) {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtxClass) {
          this.audioCtx = new AudioCtxClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  /**
   * Play urgent alert sound for critical temperature spikes or drive failures
   */
  public playCriticalAlertSound(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Tone 1: High alert (880 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.14);
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.16);

      // Tone 2: Echo alert pulse (1174.66 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(1174.66, now + 0.18);
      gain2.gain.setValueAtTime(0.18, now + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.36);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.18);
      osc2.stop(now + 0.36);
    } catch (e) {
      console.warn('Audio alert playback suppressed:', e);
    }
  }

  /**
   * Play warning alert sound for thermal warning or low storage
   */
  public playWarningAlertSound(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.18); // E5

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch (e) {
      console.warn('Warning alert audio suppressed:', e);
    }
  }

  /**
   * Request browser desktop notification permission
   */
  public async requestDesktopNotificationPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    try {
      if (Notification.permission === 'granted') return true;
      if (Notification.permission !== 'denied') {
        const result = await Notification.requestPermission();
        return result === 'granted';
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Dispatch desktop system notification if permission granted
   */
  public showDesktopNotification(title: string, body: string, tag?: string): void {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    try {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body,
          tag: tag || 'rigsentinel-alert',
          silent: true // sound is synthesized via Web Audio API to avoid dual sounds
        });
      }
    } catch (e) {
      console.warn('Desktop notification dispatch failed:', e);
    }
  }
}

export const soundAlertService = new SoundAlertService();
