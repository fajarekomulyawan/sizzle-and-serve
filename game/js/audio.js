// Sizzle & Serve — sound: every effect is synthesized with WebAudio,
// no audio files. A tiny kitchen of oscillators and filtered noise.

const Sfx = (() => {
  let ctx = null;
  function ac() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function blip(freq, dur, type = 'square', vol = 0.15, slide = 0) {
    try {
      const a = ac(), o = a.createOscillator(), g = a.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, a.currentTime);
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), a.currentTime + dur);
      g.gain.setValueAtTime(vol, a.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + dur);
      o.connect(g).connect(a.destination);
      o.start(); o.stop(a.currentTime + dur);
    } catch { /* sound is a garnish, never a blocker */ }
  }
  function noise(dur, vol = 0.05, freq = 3000) {
    try {
      const a = ac(), len = Math.floor(a.sampleRate * dur);
      const buf = a.createBuffer(1, len, a.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      const src = a.createBufferSource(); src.buffer = buf;
      const f = a.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = freq;
      const g = a.createGain(); g.gain.value = vol;
      src.connect(f).connect(g).connect(a.destination);
      src.start();
    } catch { /* ignore */ }
  }
  return {
    pop()    { blip(520, 0.08, 'square', 0.12, 240); },
    sizzle() { noise(0.7, 0.06, 2500); },
    ding()   { blip(1046, 0.16, 'sine', 0.2); setTimeout(() => blip(1568, 0.22, 'sine', 0.18), 90); },
    coin()   { blip(988, 0.09, 'square', 0.14); setTimeout(() => blip(1319, 0.2, 'square', 0.14), 80); },
    buzz()   { blip(160, 0.22, 'sawtooth', 0.16, -60); },
    trash()  { blip(300, 0.15, 'triangle', 0.14, -180); },
    bell()   { blip(784, 0.3, 'sine', 0.2); setTimeout(() => blip(784, 0.4, 'sine', 0.16), 160); },
  };
})();
