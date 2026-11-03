/* A soft music-box "Happy Birthday" synthesised with WebAudio: no audio files needed. */
const NOTES = { C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 };
const MELODY = [
  ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2],
  ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2],
  ["G4", 0.75], ["G4", 0.25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 2],
  ["F5", 0.75], ["F5", 0.25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 3],
];
const BASS = [[1, "C4"], [4, "G4"], [7, "G4"], [10, "C4"], [13, "C4"], [16, "F4"], [19, "C4"], [22, "G4"], [25, "C4"]];
const BEAT = 0.46;

const listeners = new Set();
let ctx = null, out = null, timer = null;
let on = false;

function init() {
  if (ctx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  out = ctx.createGain(); out.gain.value = 0;
  const delay = ctx.createDelay(); delay.delayTime.value = 0.31;
  const fb = ctx.createGain(); fb.gain.value = 0.3;
  const wet = ctx.createGain(); wet.gain.value = 0.28;
  const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3800;
  out.connect(lp); lp.connect(ctx.destination);
  lp.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(ctx.destination);
}

function tone(f, t, vol = 0.2, len = 1.8) {
  [[1, 1], [2, 0.22], [3.98, 0.08]].forEach(([m, g]) => {
    const o = ctx.createOscillator(), v = ctx.createGain();
    o.type = "sine"; o.frequency.value = f * m;
    v.gain.setValueAtTime(0, t);
    v.gain.linearRampToValueAtTime(vol * g, t + 0.008);
    v.gain.exponentialRampToValueAtTime(0.0001, t + len / m);
    o.connect(v); v.connect(out); o.start(t); o.stop(t + len + 0.1);
  });
}

function playOnce() {
  const t0 = ctx.currentTime + 0.1;
  let t = t0;
  MELODY.forEach(([n, d]) => { tone(NOTES[n] * 2, t, 0.16); t += d * BEAT; });
  BASS.forEach(([b, n]) => tone(NOTES[n] / 2, t0 + b * BEAT, 0.07, 2.6));
  timer = setTimeout(() => { if (on) playOnce(); }, (t - t0 + 2.6) * 1000);
}

const notify = () => listeners.forEach((fn) => fn(on));

export const music = {
  isOn: () => on,
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  start() {
    init(); if (!ctx) return;
    ctx.resume(); on = true; clearTimeout(timer);
    out.gain.cancelScheduledValues(ctx.currentTime);
    out.gain.setTargetAtTime(0.9, ctx.currentTime, 0.4);
    playOnce(); notify();
  },
  stop() {
    if (!ctx) return;
    on = false; clearTimeout(timer);
    out.gain.setTargetAtTime(0, ctx.currentTime, 0.15); notify();
  },
  toggle() { on ? music.stop() : music.start(); },
  /** short balloon pop, only while music is playing */
  pop() {
    if (!ctx || !on) return;
    const len = 0.12, buf = ctx.createBuffer(1, ctx.sampleRate * len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 4);
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = "bandpass"; f.frequency.value = 1400; g.gain.value = 0.5;
    s.buffer = buf; s.connect(f); f.connect(g); g.connect(ctx.destination); s.start();
  },
};
