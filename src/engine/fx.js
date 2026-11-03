/* Full-screen particle layer: hearts, confetti, balloon shards and fireworks, drawn on one canvas. */
import { HEART, PALETTE, reducedMotion } from "../lib/heart";
import { viewport } from "./scrollEngine";

const parts = [];
let ctx = null;
let heartPath = null;

/** Shared flags other parts of the app read (e.g. taps make fireworks at the finale). */
export const fxState = { finaleOn: false };

export function attachFx(canvas) {
  ctx = canvas.getContext("2d");
  heartPath = new Path2D(HEART);
}

function spawn(o) {
  parts.push({ x: 0, y: 0, vx: 0, vy: 0, g: 0.12, drag: 0.985, life: 0, max: 80, size: 4, color: "#fff", type: "dot", rot: 0, vr: 0, ...o });
}

export function burstHearts(x, y, n = 8) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * 6.283, s = Math.random() * 3 + 1.5;
    spawn({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 2, g: 0.06, type: "heart", size: Math.random() * 0.5 + 0.45,
      color: PALETTE[i % 5], max: 70 + Math.random() * 30, rot: Math.random() - 0.5, vr: (Math.random() - 0.5) * 0.1 });
  }
}

export function confetti(x, y, n = 120, spread = 1) {
  if (reducedMotion) n = Math.round(n / 3);
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4 * spread, s = Math.random() * 9 + 4;
    spawn({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: 0.18, drag: 0.975, type: "conf", size: Math.random() * 6 + 4,
      color: PALETTE[i % PALETTE.length], max: 140 + Math.random() * 60, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3 });
  }
}

export function shards(x, y, color) {
  for (let i = 0; i < 16; i++) {
    const a = Math.random() * 6.283, s = Math.random() * 6 + 3;
    spawn({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: 0.16, drag: 0.96, type: "conf", size: Math.random() * 7 + 4, color, max: 60,
      rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4 });
  }
  for (let i = 0; i < 18; i++) {
    const a = Math.random() * 6.283, s = Math.random() * 4 + 1;
    spawn({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: 0, drag: 0.94, type: "dot", size: Math.random() * 2 + 1, color: "#fff3d6", max: 40 });
  }
}

export function firework(x, y) {
  const H = viewport.h, W = viewport.w;
  const col = PALETTE[Math.floor(Math.random() * 5)], col2 = PALETTE[Math.floor(Math.random() * 5)];
  spawn({ x, y: H + 10, vx: (x - W / 2) * 0.004, vy: -Math.sqrt(2 * 0.16 * (H + 10 - y)), g: 0.16, drag: 1, type: "rocket", size: 2.2,
    color: "#fff3d6", max: 400, tx: y, col, col2 });
}

function explode(x, y, col, col2) {
  const n = reducedMotion ? 30 : 70, heart = Math.random() < 0.35;
  for (let i = 0; i < n; i++) {
    let vx, vy;
    if (heart) {
      const t = (i / n) * 6.283;
      vx = 16 * Math.pow(Math.sin(t), 3) * 0.32;
      vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.32;
    } else {
      const a = Math.random() * 6.283, s = Math.random() * 5 + 1.5;
      vx = Math.cos(a) * s; vy = Math.sin(a) * s;
    }
    spawn({ x, y, vx, vy, g: 0.05, drag: 0.965, type: "spark", size: Math.random() * 1.6 + 1.2, color: i % 2 ? col : col2, max: 70 + Math.random() * 40 });
  }
}

export function drawFx() {
  if (!ctx) return;
  const W = viewport.w, H = viewport.h;
  ctx.clearRect(0, 0, W, H);
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.life++; p.vx *= p.drag; p.vy = p.vy * p.drag + p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
    if (p.type === "rocket" && (p.vy >= -0.5 || p.y <= p.tx)) { explode(p.x, p.y, p.col, p.col2); parts.splice(i, 1); continue; }
    if (p.life > p.max || p.y > H + 40) { parts.splice(i, 1); continue; }
    const a = 1 - Math.pow(p.life / p.max, 2);
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    if (p.type === "conf") {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, Math.cos(p.life * 0.15 + p.rot));
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); ctx.restore();
    } else if (p.type === "heart") {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(p.size, p.size); ctx.fill(heartPath); ctx.restore();
    } else {
      ctx.globalCompositeOperation = "lighter";
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, 6.283); ctx.fill();
      if (p.type !== "dot") { ctx.globalAlpha = a * 0.25; ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 3, 0, 6.283); ctx.fill(); }
      ctx.globalCompositeOperation = "source-over";
    }
  }
  ctx.globalAlpha = 1;
}
