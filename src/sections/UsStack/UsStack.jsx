import { useMemo, useRef } from "react";
import "./UsStack.css";
import { config } from "../../config";
import { useScene } from "../../hooks/useEngine";
import { viewport } from "../../engine/scrollEngine";
import { burstHearts } from "../../engine/fx";
import { placeholderPhoto } from "../MemoryLane/placeholderPhoto";
import { easeOut, lerp, seg, seeded } from "../../lib/math";

const pad = (n) => String(n).padStart(2, "0");

/**
 * Collage of the two of them. Each scroll step tosses one more polaroid onto a growing pile,
 * flying in from alternating sides. At the end, a button opens "the cutest corner" page.
 */
export default function UsStack({ onExplore }) {
  const photos = useMemo(() => {
    const rnd = seeded(23);
    return config.us.map((m, i) => ({
      ...m,
      url: m.src || placeholderPhoto(i + 2, 2),
      isPlaceholder: !m.src,
      rest: { x: (rnd() - 0.5) * 36, y: (rnd() - 0.5) * 22, r: (rnd() - 0.5) * 14 },
      from: i % 2 ? 1 : -1,
    }));
  }, []);
  const n = photos.length;
  const cardRefs = useRef([]);
  const landed = useRef(photos.map(() => false));
  const headRef = useRef(null);
  const endRef = useRef(null);
  const counterRef = useRef(null);
  const lastCount = useRef(-1);

  const { sceneRef, stageRef } = useScene((p) => {
    const W = viewport.w, H = stageRef.current.clientHeight;
    const q = seg(p, 0.04, 0.9) * n;
    headRef.current.style.opacity = easeOut(seg(p, 0, 0.04));

    photos.forEach((ph, i) => {
      const el = cardRefs.current[i];
      const t = q - i;
      const k = easeOut(seg(t, 0, 0.7));
      if (t <= 0) { el.style.opacity = 0; landed.current[i] = false; return; }
      // flies in from the side and above, spinning, then settles onto the pile
      const x = lerp(ph.from * W * 0.75, ph.rest.x, k);
      const y = lerp(-H * 0.55, ph.rest.y, k) - Math.sin(k * Math.PI) * 40;
      const r = lerp(ph.from * 38, ph.rest.r, k);
      const s = lerp(1.25, 1, k);
      // cards further down the pile dim slightly
      const depth = Math.max(0, Math.floor(q) - i - (t >= 1 ? 1 : 0));
      el.style.opacity = Math.min(1, t * 6);
      el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${r.toFixed(2)}deg) scale(${s.toFixed(3)})`;
      el.style.filter = depth > 0 ? `brightness(${Math.max(0.55, 1 - depth * 0.12).toFixed(2)})` : "none";

      if (k >= 0.98 && !landed.current[i]) {
        landed.current[i] = true;
        const rect = el.getBoundingClientRect();
        burstHearts(rect.left + rect.width / 2, rect.top + rect.height * 0.15, 6);
      }
    });

    const count = Math.min(n, Math.max(0, Math.ceil(q - 0.3)));
    if (count !== lastCount.current) { lastCount.current = count; counterRef.current.textContent = pad(Math.max(1, count)); }
    const ek = easeOut(seg(p, 0.88, 0.97));
    endRef.current.style.opacity = ek;
    endRef.current.style.transform = `translate(-50%, ${(1 - ek) * 16}px)`;
    endRef.current.style.pointerEvents = ek > 0.5 ? "auto" : "none";
  });

  return (
    <section className="scene us" data-ch="us" ref={sceneRef} style={{ "--len": `${n * 80 + 100}vh` }}>
      <div className="stage" ref={stageRef}>
        <div className="us-head" ref={headRef}>
          <p className="eyebrow">{config.usEyebrow}</p>
          <h2>{config.usTitle}</h2>
          <p className="counter"><b ref={counterRef}>01</b> / {pad(n)}</p>
        </div>
        <div className="us-pile">
          {photos.map((ph, i) => (
            <figure className="us-card" key={i} ref={(el) => (cardRefs.current[i] = el)} style={{ zIndex: i + 1 }}>
              <div className="photo">
                <img src={ph.url} alt={ph.caption} draggable="false" decoding="async" style={ph.focus ? { objectPosition: ph.focus } : undefined} />
                {ph.isPlaceholder && <span className="ph-tag">your photo here</span>}
              </div>
              <figcaption>{ph.caption}</figcaption>
            </figure>
          ))}
        </div>
        <div className="us-end" ref={endRef}>
          <p>{config.usNote}</p>
          <button className="btn corner-cta" type="button" onClick={(e) => { e.stopPropagation(); onExplore?.(); }}>
            {config.usCta} <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    </section>
  );
}
