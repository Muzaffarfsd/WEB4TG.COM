import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';

const STORAGE_KEY = 'web4tg-sound-muted';

class SoundManager {
  private ctx: AudioContext | null = null;
  private _muted: boolean = true;

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY);
    this._muted = stored === null ? true : stored === '1';
  }

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  get muted() {
    return this._muted;
  }

  setMuted(v: boolean) {
    this._muted = v;
    localStorage.setItem(STORAGE_KEY, v ? '1' : '0');
  }

  playHoverClick() {
    if (this._muted) return;
    try {
      const ctx = this.getCtx();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.06);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  playWhoosh() {
    if (this._muted) return;
    try {
      const ctx = this.getCtx();
      const now = ctx.currentTime;

      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(2000, now);
      bandpass.frequency.exponentialRampToValueAtTime(600, now + 0.12);
      bandpass.Q.value = 2;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.03, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.15);
    } catch {}
  }

  playToggle(on: boolean) {
    if (this._muted && !on) return;
    try {
      const ctx = this.getCtx();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      if (on) {
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.1);
      } else {
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(500, now + 0.1);
      }

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }
}

const soundManager = new SoundManager();

interface SoundContextValue {
  muted: boolean;
  toggleMute: () => void;
  playHover: () => void;
  playWhoosh: () => void;
}

const SoundContext = createContext<SoundContextValue>({
  muted: true,
  toggleMute: () => {},
  playHover: () => {},
  playWhoosh: () => {},
});

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(soundManager.muted);
  const lastHoverRef = useRef(0);

  const toggleMute = useCallback(() => {
    const next = !muted;
    soundManager.setMuted(next);
    setMuted(next);
    soundManager.playToggle(!next);
  }, [muted]);

  const playHover = useCallback(() => {
    const now = Date.now();
    if (now - lastHoverRef.current < 80) return;
    lastHoverRef.current = now;
    soundManager.playHoverClick();
  }, []);

  const playWhoosh = useCallback(() => {
    soundManager.playWhoosh();
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target?.closest?.('.btn-primary, .btn-secondary')) {
        soundManager.playHoverClick();
      }
    };

    document.addEventListener('mouseenter', handler, true);
    return () => document.removeEventListener('mouseenter', handler, true);
  }, []);

  return (
    <SoundContext.Provider value={{ muted, toggleMute, playHover, playWhoosh }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}
