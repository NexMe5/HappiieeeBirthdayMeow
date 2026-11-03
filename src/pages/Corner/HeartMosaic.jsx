import { useMemo, useRef } from "react";
import { config } from "../../config";
import { useScene } from "../../hooks/useEngine";
import { viewport } from "../../engine/scrollEngine";
import { reducedMotion } from "../../lib/heart";
import { clamp, easeInOut, easeOut, lerp, seg, seeded } from "../../lib/math";

/** Points evenly spaced along the heart outline (unit scale: about 32 wide), starting at the top dip. */
function heartOutline(n) {
  const fine = [];
  for (let i = 0; i <= 600; i++) {
    const t = (i / 600) * Math.PI * 2;
    fine.push([16 * Math.pow(Math.sin(t), 3), -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]);
  }
  const acc = [0];
  for (let i = 1; i < fine.length; i++) acc.push(acc[i - 1] + Math.hypot(fine[i][0] - fine[i - 1][0], fine[i][1] - fine[i - 1][1]));
  const total = acc[acc.length - 1], out = [];
  for (let k = 0, j = 0; k < n; k++) {
    const target = (k / n) * total;
    while (acc[j + 1] < target) j++;
    out.push(fine[j]);
  }
  return out;
}

/** Every photo starts scattered across the sky, then they fly into place and form one big heart. */
export default function HeartMosaic({ photos, onOpen, onBack }) {
  const c = config.corner;
  const n = photos.length;
  const outline = useMemo(() => heartOutline(n), [n]);
  const scatter = useMemo(() => {
    const rnd = seeded(57);
    return photos.map(() => ({ x: (rnd() - 0.5) * 1.15, y: (rnd() - 0.5) * 1.1, r: (rnd() - 0.5) * 70 }));
  }, []);
  const tileRefs = useRef([]);
  const centerRef = useRef(null);
  const footRef = useRef(null);

  const { sceneRef, stageRef } = useScene((p, s, now) => {
    const W = viewport.w, H = stageRef.current.clientHeight;
    const size = clamp(Math.min(W * 0.13, H * 0.105), 46, 92);
    const k = Math.min(W * 0.4, H * 0.36) / 16; // heart half-width is 16k
    const cy = -H * 0.05;
    const beat = reducedMotion ? 0 : seg(p, 0.66, 0.76) * Math.max(0, Math.sin((now / 1000) * Math.PI * 2.2)) * 0.035;

    photos.forEach((_, i) => {
      const el = tileRefs.current[i], sc = scatter[i];
      const hx = outline[i][0] * k;
      const hy = outline[i][1] * k - 2.5 * k + cy;
      const appear = easeOut(seg(p, 0, 0.12));
      const fly = easeInOut(seg(p, 0.1 + (i / n) * 0.24, 0.4 + (i / n) * 0.24));
      const x = lerp(sc.x * W, hx * (1 + beat), fly);
      const y = lerp(sc.y * H, cy + (hy - cy) * (1 + beat), fly);
      const r = lerp(sc.r, 0, fly);
      const scale = lerp(1.35, 1, fly);
      el.style.width = el.style.height = `${size.toFixed(0)}px`;
      el.style.opacity = appear.toFixed(3);
      el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${r.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    });

    const ck = easeOut(seg(p, 0.6, 0.74));
    centerRef.current.style.opacity = ck.toFixed(3);
    // sit a little above the middle, where the heart is widest
    centerRef.current.style.transform = `translate(-50%, -50%) translateY(${(cy - 3 * k + (1 - ck) * 20).toFixed(1)}px) scale(${(0.9 + ck * 0.1).toFixed(3)})`;
    const fk = easeOut(seg(p, 0.8, 0.92));
    footRef.current.style.opacity = fk.toFixed(3);
    footRef.current.style.transform = `translate(-50%, ${((1 - fk) * 16).toFixed(1)}px)`;
    footRef.current.style.pointerEvents = fk > 0.5 ? "auto" : "none";
  });

  return (
    <section className="scene mosaic" data-ch="corner" ref={sceneRef} style={{ "--len": "280vh" }}>
      <div className="stage" ref={stageRef}>
        {photos.map((ph, i) => (
          <button key={i} type="button" className="mosaic-tile" ref={(el) => (tileRefs.current[i] = el)} onClick={() => onOpen(i)}
            aria-label={`Open photo: ${ph.caption}`}>
            <img src={ph.url} alt="" draggable="false" decoding="async" />
          </button>
        ))}
        <div className="mosaic-center" ref={centerRef}>
          <p className="name-ink">{c.names}</p>
          <span>{c.heartLine}</span>
        </div>
        <div className="mosaic-foot" ref={footRef}>
          <p>{c.outro}</p>
          <button type="button" className="btn" onClick={onBack}>Back to the story</button>
        </div>
      </div>
    </section>
  );
}
