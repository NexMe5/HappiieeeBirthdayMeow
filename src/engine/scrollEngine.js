/*
  One requestAnimationFrame loop for the whole site.
  - Scenes: a tall <section> with a sticky 100svh stage. Each frame we compute how far the reader has
    scrolled through it (0..1), ease that value toward the target for a smooth feel, and call the
    scene's render(progress). Renders write styles straight to DOM refs, so React never re-renders per frame.
  - Tickers: anything else that animates every frame (stars, particles, cursor, rail).
*/
import { clamp } from "../lib/math";
import { reducedMotion } from "../lib/heart";

const scenes = new Set();
const tickers = new Set();
const measureHooks = new Set();
export const viewport = { w: window.innerWidth, h: window.innerHeight };

function measureScene(s) {
  if (!s.el || !s.stage) return;
  const r = s.el.getBoundingClientRect();
  s.top = r.top + window.scrollY;
  s.len = Math.max(1, s.el.offsetHeight - s.stage.offsetHeight);
}

export function measure() {
  viewport.w = window.innerWidth;
  viewport.h = window.innerHeight;
  scenes.forEach(measureScene);
  measureHooks.forEach((fn) => fn());
}

export function addScene(scene) {
  Object.assign(scene, { top: 0, len: 1, p: 0, sp: 0 });
  scenes.add(scene);
  measureScene(scene);
  return () => scenes.delete(scene);
}

export function addTicker(fn) {
  tickers.add(fn);
  return () => tickers.delete(fn);
}

export function onMeasure(fn) {
  measureHooks.add(fn);
  return () => measureHooks.delete(fn);
}

let running = false;
let last = 0;
/** One misbehaving animation must never stop the whole loop. */
function safely(fn) {
  try { fn(); } catch (err) { console.warn("[animation]", err); }
}

function loop(now) {
  requestAnimationFrame(loop); // schedule first, so the loop always survives
  const dt = Math.min(64, now - last);
  last = now;
  const y = window.scrollY;
  const vh = viewport.h;
  const smooth = reducedMotion ? 1 : 1 - Math.pow(1 - 0.14, dt / 16.7);

  scenes.forEach((s) => {
    s.p = clamp((y - s.top) / s.len);
    const near = y + vh > s.top - vh * 0.2 && y < s.top + s.len + vh * 1.2;
    if (!near) { s.sp = s.p; return; }
    s.sp += (s.p - s.sp) * smooth;
    if (Math.abs(s.p - s.sp) < 0.0004) s.sp = s.p;
    safely(() => s.render(s.sp, s, now));
  });
  tickers.forEach((fn) => safely(() => fn(now, dt, y)));
}

export function startEngine() {
  if (running) return;
  running = true;
  last = performance.now();
  window.addEventListener("resize", measure);
  window.addEventListener("load", measure);
  document.fonts?.ready.then(measure);
  requestAnimationFrame(loop);
}
