class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with browser autoplay policies
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playHit(intensity: number = 1) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Pitch variation according to intensity/hit number
    const baseFreq = 160 + Math.random() * 80 + (intensity % 5) * 20;

    // 1. Thump / Punch Body (Oscillator with fast pitch drop)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = Math.random() > 0.4 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(baseFreq * 1.8, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);

    // 2. Cartoon "Squeak" / "Boing" accent
    const squishOsc = ctx.createOscillator();
    const squishGain = ctx.createGain();
    squishOsc.type = 'sine';
    const squishFreq = 380 + Math.random() * 200;
    squishOsc.frequency.setValueAtTime(squishFreq, now);
    squishOsc.frequency.exponentialRampToValueAtTime(squishFreq * 2.2, now + 0.08);

    squishGain.gain.setValueAtTime(0.15, now);
    squishGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    squishOsc.connect(squishGain);
    squishGain.connect(ctx.destination);

    squishOsc.start(now);
    squishOsc.stop(now + 0.09);
  }

  public playShatter() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // 1. Initial explosive crack (Noise burst with highpass)
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.35);
    filter.Q.setValueAtTime(3, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.45, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now);

    // 2. Glass shard tinkles (Multiple randomized sine pings)
    const pitches = [1200, 1540, 1820, 2200, 2600, 3100];
    pitches.forEach((freq, idx) => {
      const delay = 0.05 + idx * 0.04 + Math.random() * 0.05;
      const shardOsc = ctx.createOscillator();
      const shardGain = ctx.createGain();

      shardOsc.type = 'sine';
      shardOsc.frequency.setValueAtTime(freq + (Math.random() * 200 - 100), now + delay);
      shardOsc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + delay + 0.25);

      shardGain.gain.setValueAtTime(0.0001, now);
      shardGain.gain.setValueAtTime(0.12, now + delay);
      shardGain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.25);

      shardOsc.connect(shardGain);
      shardGain.connect(ctx.destination);

      shardOsc.start(now + delay);
      shardOsc.stop(now + delay + 0.26);
    });
  }

  public playWhoosh() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(1600, now + 0.15);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.3);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
  }

  public playChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Warm pentatonic / soothing chord: F#4, A#4, C#5, F5
    const notes = [370.0, 466.16, 554.37, 698.46];

    notes.forEach((freq, idx) => {
      const delay = idx * 0.1;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.setValueAtTime(0.12, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 1.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 1.7);
    });
  }

  public playPop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.05);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }
}

export const soundFx = new SoundSynthesizer();
