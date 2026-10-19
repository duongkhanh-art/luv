// Self-contained Web Audio API synthesizer for Kawaii sound effects and background melodies

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmInterval: number | null = null;
  private isBgmPlaying = false;
  private volume = 0.4;
  private muted = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (muted && this.isBgmPlaying) {
      this.stopBgm();
    }
  }

  public isMute(): boolean {
    return this.muted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  // Play a soft sweet note
  private playTone(freq: number, type: OscillatorType, duration: number, gainMultiplier = 1, delay = 0) {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    const startTime = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(this.volume * gainMultiplier * 0.3, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  // Comical gentle tap / boop sound
  public playTap() {
    if (this.muted) return;
    this.initContext();
    this.playTone(520, 'sine', 0.08, 1.2);
    this.playTone(390, 'triangle', 0.08, 0.9, 0.03);
  }

  // Sweat drop pop
  public playSweatDrop() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);
    gain.gain.setValueAtTime(this.volume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  // Girl pouting cute squeak
  public playPout() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(440, now + 0.1);
    gain.gain.setValueAtTime(this.volume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  // Magical sparkles
  public playSparkle() {
    if (this.muted) return;
    const notes = [659.25, 783.99, 987.77, 1318.51, 1567.98];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.25, 0.5, idx * 0.05);
    });
  }

  // Sweet warm heart sound
  public playHeart() {
    if (this.muted) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.35, 0.6, idx * 0.08);
    });
  }

  // Queen miniature royal fanfare
  public playQueenFanfare() {
    if (this.muted) return;
    const fanfare = [
      { f: 523.25, d: 0.15, t: 0 },
      { f: 659.25, d: 0.15, t: 0.12 },
      { f: 783.99, d: 0.15, t: 0.24 },
      { f: 1046.5, d: 0.45, t: 0.38 },
      { f: 1318.51, d: 0.6, t: 0.55 },
    ];
    fanfare.forEach((n) => {
      this.playTone(n.f, 'triangle', n.d, 0.8, n.t);
      this.playTone(n.f * 1.5, 'sine', n.d * 0.8, 0.3, n.t);
    });
  }

  // Cute Lo-Fi / Kawaii Chime Background Melody
  public startBgm() {
    if (this.isBgmPlaying || this.muted) return;
    this.initContext();
    this.isBgmPlaying = true;

    const melody = [
      523.25, 587.33, 659.25, 783.99,
      659.25, 587.33, 523.25, 392.00,
      440.00, 523.25, 659.25, 587.33,
      523.25, 392.00, 440.00, 523.25
    ];
    let noteIdx = 0;

    this.bgmInterval = window.setInterval(() => {
      if (this.muted || !this.isBgmPlaying) return;
      const note = melody[noteIdx % melody.length];
      this.playTone(note, 'sine', 0.4, 0.22);
      // subtle bass accompaniment
      if (noteIdx % 4 === 0) {
        this.playTone(note / 2, 'triangle', 0.5, 0.18);
      }
      noteIdx++;
    }, 450);
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public toggleBgm(): boolean {
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  public getBgmState(): boolean {
    return this.isBgmPlaying;
  }
}

export const soundEngine = new SoundEngine();
