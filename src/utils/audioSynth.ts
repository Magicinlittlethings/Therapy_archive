/**
 * Native Web Audio Synth for Group Therapy Soundboard Monitor
 * Generates an ambient live room / soundboard excerpt stream
 */

class SoundboardAudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public start() {
    if (this.isRunning) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      this.isRunning = true;

      // Sub-bass atmospheric pulse (48Hz)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(48, this.ctx.currentTime);

      // Low pass filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, this.ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(filter);
      filter.connect(this.masterGain);

      oscGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      osc.start();

      // Rhythmic subtle soundboard hi-hat tick every 500ms
      let step = 0;
      this.timerId = window.setInterval(() => {
        if (!this.ctx || !this.masterGain || !this.isRunning) return;
        
        // Gentle beat pulse
        const now = this.ctx.currentTime;
        const tickOsc = this.ctx.createOscillator();
        const tickGain = this.ctx.createGain();
        
        tickOsc.type = step % 4 === 0 ? 'triangle' : 'sine';
        tickOsc.frequency.setValueAtTime(step % 4 === 0 ? 64 : 1800, now);
        
        tickGain.gain.setValueAtTime(step % 4 === 0 ? 0.25 : 0.04, now);
        tickGain.gain.exponentialRampToValueAtTime(0.001, now + (step % 4 === 0 ? 0.15 : 0.05));
        
        tickOsc.connect(tickGain);
        tickGain.connect(this.masterGain);
        
        tickOsc.start(now);
        tickOsc.stop(now + 0.16);
        step = (step + 1) % 16;
      }, 500);

      this.currentOsc = osc;
    } catch (err) {
      console.warn('AudioContext not allowed yet:', err);
    }
  }

  private currentOsc: OscillatorNode | null = null;

  public stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.currentOsc) {
      try {
        this.currentOsc.stop();
        this.currentOsc.disconnect();
      } catch (e) {
        /* noop */
      }
      this.currentOsc = null;
    }
  }
}

export const soundboardEngine = new SoundboardAudioEngine();
