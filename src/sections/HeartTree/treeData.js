import { clamp, seeded } from "../../lib/math";
import { PALETTE } from "../../lib/heart";

/** [path, stroke width, draw start, draw end] — draw window is a fraction of the tree's growth phase */
export const BRANCHES = [
  ["M300 730 C 297 650, 306 570, 300 470", 17, 0, 0.32],
  ["M300 486 C 278 430, 232 386, 190 304", 9, 0.22, 0.5],
  ["M300 486 C 322 430, 368 386, 410 304", 9, 0.22, 0.5],
  ["M300 476 C 300 410, 295 340, 300 250", 8, 0.25, 0.52],
  ["M190 304 C 176 262, 170 222, 176 168", 5, 0.42, 0.66],
  ["M190 304 C 160 292, 128 270, 108 232", 4, 0.42, 0.66],
  ["M410 304 C 424 262, 430 222, 424 168", 5, 0.42, 0.66],
  ["M410 304 C 440 292, 472 270, 492 232", 4, 0.42, 0.66],
  ["M300 340 C 280 306, 256 284, 240 232", 4, 0.45, 0.68],
  ["M300 340 C 320 306, 344 284, 360 232", 4, 0.45, 0.68],
  ["M240 232 C 237 200, 244 176, 250 146", 2.6, 0.6, 0.8],
  ["M360 232 C 363 200, 356 176, 350 146", 2.6, 0.6, 0.8],
  ["M232 366 C 202 362, 176 352, 150 330", 3, 0.5, 0.72],
  ["M368 366 C 398 362, 424 352, 450 330", 3, 0.5, 0.72],
  ["M300 250 C 296 220, 304 200, 300 176", 2.6, 0.62, 0.82],
  ["M108 232 C 98 212, 100 196, 106 180", 2.2, 0.66, 0.86],
  ["M492 232 C 502 212, 500 196, 494 180", 2.2, 0.66, 0.86],
];

/** ~230 heart leaves packed inside a big heart-shaped canopy. Seeded, so the tree is the same every time. */
export function makeLeaves() {
  const cx = 300, cy = 214, k = 13.4, poly = [];
  for (let i = 0; i < 120; i++) {
    const t = (i / 120) * Math.PI * 2;
    poly.push([cx + k * 16 * Math.pow(Math.sin(t), 3), cy - k * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]);
  }
  const inside = (x, y) => {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  const rnd = seeded(7), pts = [];
  for (let tries = 0; pts.length < 230 && tries < 9000; tries++) {
    const x = 80 + rnd() * 440, y = 40 + rnd() * 420;
    if (!inside(x, y) || pts.some((p) => (p[0] - x) ** 2 + (p[1] - y) ** 2 < 200)) continue;
    pts.push([x, y]);
  }
  const weights = [0, 0, 0, 1, 1, 2, 2, 3, 4, 5];
  return pts.map(([x, y]) => {
    const col = PALETTE[weights[Math.floor(rnd() * weights.length)]];
    const opacity = (0.78 + rnd() * 0.22).toFixed(2);
    const dist = Math.hypot(x - 300, (y - 300) * 1.2) / 300;
    return { x, y, col, opacity, s: 0.7 + rnd() * 0.75, r: (rnd() - 0.5) * 60, at: clamp(dist * 0.75 + rnd() * 0.25, 0, 0.92) };
  });
}
