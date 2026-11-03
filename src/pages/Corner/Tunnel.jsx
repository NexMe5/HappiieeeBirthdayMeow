import { useMemo, useRef } from "react";
import { config } from "../../config";
import { useScene } from "../../hooks/useEngine";
import { viewport } from "../../engine/scrollEngine";
import { HEART } from "../../lib/heart";
import { clamp, seg, seeded } from "../../lib/math";

const GAP = 1000; // distance between photos along the walk, in px of depth
const pad = (n) => String(n).padStart(2, "0");

/**
 * The walk through "us". The title sits in front of you; scrolling moves the camera forward
 * through it and on past every photo, which drift in from the dark, pass beside you and fade.
 */
export default function Tunnel({ photos, onOpen }) {
  const c = config.corner;
  const n = photos.length;
  const layout = useMemo(() => {
    const rnd = seeded(31);
    return photos.map((_, i) => ({ side: i % 2 ? 1 : -1, y: (rnd() - 0.5) * 0.16, r: (rnd() - 0.5) * 9, jx: rnd() * 0.05 }));
  }, []);
  const titleRef = useRef(null);
  const hintRef = useRef(null);
  const countRef = useRef(null);
  const cardRefs = useRef([]);
  const lastCount = useRef(-1);

  const { sceneRef, stageRef } = useScene((p) => {
    const W = viewport.w, H = stageRef.current.clientHeight, mobile = W < 700;
    const cam = seg(p, 0, 0.97) * n * GAP; // at the end, the last photo is right in front of you

    const t = titleRef.current;
    t.style.transform = `translate(-50%, -50%) translateZ(${cam.toFixed(1)}px)`;
    t.style.opacity = (1 - seg(cam, 120, 560)).toFixed(3);
    t.style.visibility = cam > 600 ? "hidden" : "visible";
    hintRef.current.style.opacity = (1 - seg(cam, 0, 200)).toFixed(3);

    photos.forEach((_, i) => {
      const el = cardRefs.current[i], L = layout[i];
      const z = cam - (i + 1) * GAP;
      if (z < -4 * GAP || z > 700) { el.style.visibility = "hidden"; return; }
      // photos only appear once the title has moved out of the way
      const op = seg(z, -3.6 * GAP, -2.2 * GAP) * (1 - seg(z, 220, 620)) * seg(cam, 260, 700);
      const x = L.side * W * (mobile ? 0.15 : 0.2 + L.jx);
      el.style.visibility = op > 0.01 ? "visible" : "hidden";
      el.style.opacity = op.toFixed(3);
      el.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${(L.y * H).toFixed(1)}px, ${z.toFixed(1)}px) rotate(${L.r.toFixed(2)}deg)`;
      el.style.pointerEvents = op > 0.6 ? "auto" : "none";
    });

    const count = clamp(Math.round(cam / GAP), 0, n);
    if (count !== lastCount.current) {
      lastCount.current = count;
      countRef.current.textContent = count ? `${pad(count)} / ${pad(n)}` : "";
    }
  });

  return (
    <section className="scene tunnel" data-ch="corner" ref={sceneRef} style={{ "--len": `${n * 42 + 100}vh` }}>
      <div className="stage" ref={stageRef}>
        <div className="tunnel-space">
          <header className="tunnel-title" ref={titleRef} style={{ zIndex: n + 2 }}>
            <p className="eyebrow">{c.eyebrow}</p>
            <h1>
              <span className="corner-title">{c.title}</span>
              <span className="corner-names name-ink">{c.names}</span>
            </h1>
            <svg className="corner-heart" viewBox="-11 -13 22 20" aria-hidden="true"><path d={HEART} /></svg>
          </header>
          {photos.map((ph, i) => (
            <button
              key={i}
              type="button"
              className="tunnel-card"
              style={{ zIndex: n - i, visibility: "hidden" }}
              ref={(el) => (cardRefs.current[i] = el)}
              onClick={() => onOpen(i)}
              aria-label={`Open photo: ${ph.caption}`}
            >
              <img src={ph.url} alt={ph.caption} draggable="false" decoding="async" />
              <span className="tunnel-caption">{ph.caption}</span>
            </button>
          ))}
        </div>
        <p className="tunnel-hint" ref={hintRef}>{c.intro}<i aria-hidden="true" /></p>
        <p className="tunnel-count" ref={countRef} aria-hidden="true" />
      </div>
    </section>
  );
}
