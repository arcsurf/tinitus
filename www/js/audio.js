/* Tinitus · Motor de audio (Web Audio API). Genera todos los sonidos en el dispositivo,
 * sin archivos externos: ruidos blanco/rosa/marrón, muesca, banda estrecha, olas, lluvia y tonos. */
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.nodes = [];
    this.freqNodes = [];
    this.playing = false;
    this.mode = null;
    this.volume = 0.35;
    this.pan = 0;
    this.freq = 4000;
    this.buffers = {};
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
      // iOS: reproducir aunque el interruptor de silencio esté activado (Safari 16.4+)
      try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
      if (this.panner) { this.panner.pan.value = this.pan; this.panner.connect(this.master); }
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  get input() { return this.panner || this.master; }

  buffer(type) {
    if (this.buffers[type]) return this.buffers[type];
    const ctx = this.ctx, sr = ctx.sampleRate, len = sr * 10;
    const buf = ctx.createBuffer(2, len, sr);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      if (type === 'white') {
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
      } else if (type === 'pink') {
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < len; i++) {
          const w = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759;
          b2 = 0.96900 * b2 + w * 0.1538520; b3 = 0.86650 * b3 + w * 0.3104856;
          b4 = 0.55000 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.0168980;
          d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.1;
          b6 = w * 0.115926;
        }
      } else if (type === 'brown') {
        let last = 0;
        for (let i = 0; i < len; i++) {
          last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
          d[i] = last * 3.5;
        }
        // eliminar deriva para que el bucle no haga "clic"
        const drift = d[len - 1] - d[0];
        for (let i = 0; i < len; i++) d[i] -= drift * (i / len);
      } else if (type === 'drops') {
        let env = 0;
        for (let i = 0; i < len; i++) {
          if (Math.random() < 0.0009) env = Math.max(env, Math.random() * 0.7 + 0.1);
          env *= 0.993;
          d[i] = (Math.random() * 2 - 1) * env;
        }
      }
    }
    this.buffers[type] = buf;
    return buf;
  }

  _src(type) {
    const s = this.ctx.createBufferSource();
    s.buffer = this.buffer(type);
    s.loop = true;
    // empezar en un punto aleatorio para que cada canal/sesión suene distinto
    s.start(0, Math.random() * 9);
    this.nodes.push(s);
    return s;
  }

  _filter(type, freq, Q, gain) {
    const f = this.ctx.createBiquadFilter();
    f.type = type; f.frequency.value = freq;
    if (Q !== undefined) f.Q.value = Q;
    if (gain !== undefined) f.gain.value = gain;
    this.nodes.push(f);
    return f;
  }

  _gain(v) { const g = this.ctx.createGain(); g.gain.value = v; this.nodes.push(g); return g; }

  _chain(list) { for (let i = 0; i < list.length - 1; i++) list[i].connect(list[i + 1]); return list[list.length - 1]; }

  // Muesca de una octava alrededor de la frecuencia: 4 filtros notch en cascada
  _notchChain() {
    const mults = [Math.pow(2, -0.375), Math.pow(2, -0.125), Math.pow(2, 0.125), Math.pow(2, 0.375)];
    return mults.map(m => {
      const f = this._filter('notch', this.freq * m, 3);
      this.freqNodes.push({ node: f, mult: m });
      return f;
    });
  }

  supportsNotch(mode) { return !['narrowband', 'tone', 'brown', 'ocean'].includes(mode); }

  start(mode, opts = {}) {
    const ctx = this.ensure();
    this._teardown();
    this.mode = mode;
    const out = this._gain(1);
    let tail;

    switch (mode) {
      case 'white': tail = this._src('white'); break;
      case 'pink': case 'notched': tail = this._src('pink'); break;
      case 'brown': tail = this._chain([this._src('brown'), this._gain(0.7)]); break;
      case 'highfreq':
        tail = this._chain([this._src('pink'), this._filter('highshelf', 2000, undefined, 12), this._gain(0.55)]);
        break;
      case 'narrowband': {
        const bp = this._filter('bandpass', this.freq, 4.3);
        this.freqNodes.push({ node: bp, mult: 1 });
        tail = this._chain([this._src('white'), bp, this._gain(3)]);
        break;
      }
      case 'ocean': {
        const lp = this._filter('lowpass', 900, 0.7);
        const mod = this._gain(0.55);
        const lfo = ctx.createOscillator(); lfo.frequency.value = 0.09; this.nodes.push(lfo);
        const depth = this._gain(0.45); lfo.connect(depth); depth.connect(mod.gain); lfo.start();
        tail = this._chain([this._src('brown'), lp, mod]);
        // espuma: ruido rosa agudo que sigue la ola
        const foamMod = this._gain(0.06);
        const foamDepth = this._gain(0.06); lfo.connect(foamDepth); foamDepth.connect(foamMod.gain);
        this._chain([this._src('pink'), this._filter('highpass', 2500, 0.7), foamMod, out]);
        break;
      }
      case 'rain': {
        tail = this._chain([this._src('pink'), this._filter('highpass', 400, 0.7), this._filter('lowpass', 9000, 0.7), this._gain(0.8)]);
        this._chain([this._src('drops'), this._filter('bandpass', 3000, 0.8), this._gain(0.9), out]);
        break;
      }
      case 'tone': {
        const osc = ctx.createOscillator();
        osc.type = 'sine'; osc.frequency.value = this.freq; osc.start();
        this.nodes.push(osc);
        this.freqNodes.push({ node: osc, mult: 1 });
        tail = this._chain([osc, this._gain(0.12)]);
        break;
      }
      default: tail = this._src('pink');
    }

    if (opts.notch && this.supportsNotch(mode) || mode === 'notched') {
      tail = this._chain([tail, ...this._notchChain(), this._gain(1.4)]);
    }
    tail.connect(out);
    out.connect(this.input);
    this.playing = true;
    this._ramp(this._target(), opts.fadeIn ?? 1.5);
  }

  _target() { return Math.pow(this.volume, 2) * 0.9; }

  _ramp(value, secs) {
    const g = this.master.gain, t = this.ctx.currentTime;
    g.cancelScheduledValues(t);
    g.setValueAtTime(g.value, t);
    g.linearRampToValueAtTime(value, t + Math.max(0.02, secs));
  }

  stop(fade = 1) {
    if (!this.ctx || !this.playing) return;
    this.playing = false;
    this._ramp(0, fade);
    const nodes = this.nodes; this.nodes = []; this.freqNodes = [];
    clearTimeout(this._stopT);
    this._stopT = setTimeout(() => this._kill(nodes), fade * 1000 + 100);
  }

  _teardown() { clearTimeout(this._stopT); this._kill(this.nodes); this.nodes = []; this.freqNodes = []; }

  _kill(nodes) {
    nodes.forEach(n => { try { n.stop && n.stop(); } catch (e) {} try { n.disconnect(); } catch (e) {} });
  }

  setVolume(v) { this.volume = v; if (this.ctx && this.playing) this._ramp(this._target(), 0.1); }

  setPan(p) { this.pan = p; if (this.panner) this.panner.pan.setTargetAtTime(p, this.ctx.currentTime, 0.05); }

  setFreq(f) {
    this.freq = f;
    if (!this.ctx) return;
    this.freqNodes.forEach(({ node, mult }) => node.frequency.setTargetAtTime(f * mult, this.ctx.currentTime, 0.02));
  }
}
window.AudioEngine = AudioEngine;
