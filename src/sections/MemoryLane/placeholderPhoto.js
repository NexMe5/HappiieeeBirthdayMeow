import { seeded } from "../../lib/math";

const PALETTES = [
  ["#2b1640", "#f08a6b", "#ffd08a"], ["#13294b", "#5fb3c7", "#e4f2ff"], ["#3b1030", "#e8708f", "#ffd3de"],
  ["#2a1a10", "#f6c978", "#fff0c8"], ["#1a1238", "#9b7be8", "#f0e3ff"], ["#3a1a2e", "#ffb38a", "#fff2d6"],
];

/** A dreamy bokeh "photo" with one or two silhouettes, used until real photos are added. */
export function placeholderPhoto(i, people = 1) {
  const c = document.createElement("canvas");
  c.width = 400; c.height = 500;
  const x = c.getContext("2d"), pal = PALETTES[i % PALETTES.length], r = seeded(i + 11);
  const g = x.createLinearGradient(0, 0, 0, 500);
  g.addColorStop(0, pal[0]); g.addColorStop(1, pal[1]);
  x.fillStyle = g; x.fillRect(0, 0, 400, 500);
  x.globalCompositeOperation = "lighter";
  for (let k = 0; k < 34; k++) {
    const bx = r() * 400, by = r() * 380, br = 10 + r() * 46, rg = x.createRadialGradient(bx, by, 0, bx, by, br);
    rg.addColorStop(0, pal[2] + "aa"); rg.addColorStop(0.7, pal[2] + "33"); rg.addColorStop(1, pal[2] + "00");
    x.fillStyle = rg; x.beginPath(); x.arc(bx, by, br, 0, 6.283); x.fill();
  }
  x.globalCompositeOperation = "source-over";
  const v = x.createRadialGradient(200, 250, 120, 200, 250, 340);
  v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,.45)");
  x.fillStyle = v; x.fillRect(0, 0, 400, 500);
  x.fillStyle = "rgba(10,5,15,.5)";
  x.save(); x.translate(200, 520);
  if (people === 2) {
    [-46, 46].forEach((ox) => {
      x.beginPath(); x.ellipse(ox, -40, 52, 120, 0, 0, 6.283); x.fill();
      x.beginPath(); x.arc(ox, -186, 30, 0, 6.283); x.fill();
    });
  } else {
    x.beginPath(); x.ellipse(0, -40, 70, 130, 0, 0, 6.283); x.fill();
    x.beginPath(); x.arc(0, -200, 40, 0, 6.283); x.fill();
  }
  x.restore();
  return c.toDataURL("image/jpeg", 0.85);
}
