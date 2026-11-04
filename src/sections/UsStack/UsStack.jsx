import { useRef } from "react";
import "./UsStack.css";
import { config } from "../../config";
import { useScene } from "../../hooks/useEngine";
import { viewport } from "../../engine/scrollEngine";
import { burstHearts } from "../../engine/fx";
import { placeholderPhoto } from "../MemoryLane/placeholderPhoto";
import { easeOut, lerp, seg } from "../../lib/math";

/**
 * "Us, so far": one favourite photo of the two of them tossed onto the screen as she scrolls,
 * then a line and the button that opens "the cutest corner" page.
 */
export default function UsStack({ onExplore }) {
  const ph = config.usPhoto;
  const url = useRef(ph.src || placeholderPhoto(3, 2)).current;
  const headRef = useRef(null);
  const cardRef = useRef(null);
  const endRef = useRef(null);
  const landed = useRef(false);

  const { sceneRef, stageRef } = useScene((p) => {
    const H = viewport.h;
    const hk = easeOut(seg(p, 0, 0.08));
    headRef.current.style.opacity = hk.toFixed(3);
    headRef.current.style.transform = `translateY(${((1 - hk) * 20).toFixed(1)}px)`;

    // flies in from below-right, spinning, and settles slightly tilted
    const k = easeOut(seg(p, 0.06, 0.46));
    const card = cardRef.current;
    card.style.opacity = Math.min(1, k * 2.5).toFixed(3);
    card.style.transform = `translate(${lerp(viewport.w * 0.35, 0, k).toFixed(1)}px, ${lerp(H * 0.7, 0, k).toFixed(1)}px) rotate(${lerp(24, -3, k).toFixed(2)}deg) scale(${lerp(1.2, 1, k).toFixed(3)})`;
    if (k > 0.98 && !landed.current) {
      landed.current = true;
      const r = card.getBoundingClientRect();
      burstHearts(r.left + r.width / 2, r.top + r.height * 0.1, 18);
    }
    if (k < 0.5) landed.current = false;

    const ek = easeOut(seg(p, 0.5, 0.66));
    endRef.current.style.opacity = ek.toFixed(3);
    endRef.current.style.transform = `translateY(${((1 - ek) * 16).toFixed(1)}px)`;
    endRef.current.style.pointerEvents = ek > 0.5 ? "auto" : "none";
  });

  return (
    <section className="scene us" data-ch="us" ref={sceneRef} style={{ "--len": "220vh" }}>
      <div className="stage" ref={stageRef}>
        <div className="us-head" ref={headRef}>
          <p className="eyebrow">{config.usEyebrow}</p>
          <h2>{config.usTitle}</h2>
        </div>
        <figure className="us-card" ref={cardRef}>
          <div className="photo">
            <img src={url} alt={ph.caption} draggable="false" decoding="async" style={ph.focus ? { objectPosition: ph.focus } : undefined} />
            {!ph.src && <span className="ph-tag">your photo here</span>}
          </div>
          <figcaption>{ph.caption}</figcaption>
        </figure>
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
