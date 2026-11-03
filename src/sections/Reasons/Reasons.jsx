import { useRef } from "react";
import "./Reasons.css";
import Balloon, { BALLOON_COLORS } from "./Balloon";
import { config } from "../../config";
import { useScene } from "../../hooks/useEngine";
import { viewport } from "../../engine/scrollEngine";
import { shards } from "../../engine/fx";
import { music } from "../../engine/music";
import { easeIn, easeOut, lerp, seg } from "../../lib/math";

const pad = (n) => String(n).padStart(2, "0");

/** Each scroll step: a balloon floats up, pops, and a reason appears where it burst. */
export default function Reasons() {
  const reasons = config.reasons;
  const n = reasons.length;
  const balloonRefs = useRef([]);
  const reasonRefs = useRef([]);
  const popped = useRef(reasons.map(() => false));
  const headRef = useRef(null);
  const counterRef = useRef(null);
  const numRef = useRef(null);
  const current = useRef(-1);

  const { sceneRef, stageRef } = useScene((p) => {
    const H = viewport.h;
    const q = seg(p, 0.04, 0.98) * n;
    const cur = Math.min(n - 1, Math.floor(q));
    const hk = easeOut(seg(p, 0, 0.05));
    headRef.current.style.opacity = hk;

    reasons.forEach((_, i) => {
      const t = q - i, b = balloonRefs.current[i], el = reasonRefs.current[i];
      const rise = easeOut(seg(t, -0.16, 0.36));
      const popK = seg(t, 0.36, 0.44);
      const bx = Math.sin((t + i) * 2.2) * 26 + (i % 2 ? 18 : -18) * (1 - rise);
      const by = lerp(H * 0.66, H * 0.02, rise);
      if (t > -0.18 && t < 0.5) {
        b.style.opacity = popK > 0 ? 1 - popK : Math.min(1, Math.max(0, (t + 0.18) * 8));
        b.style.transform = `translate(-50%, -38%) translate(${bx.toFixed(1)}px, ${by.toFixed(1)}px) rotate(${(Math.sin(t * 6 + i) * 6).toFixed(1)}deg) scale(${1 + popK * 0.3})`;
      } else b.style.opacity = 0;

      if (t >= 0.4 && !popped.current[i]) {
        popped.current[i] = true;
        const r = stageRef.current.getBoundingClientRect();
        shards(r.left + r.width / 2 + bx, H * 0.5 + by - 10, BALLOON_COLORS[i % BALLOON_COLORS.length][1]);
        music.pop();
      }
      if (t < 0.3 && popped.current[i]) popped.current[i] = false;

      const inK = easeOut(seg(t, 0.4, 0.56));
      const outK = i === n - 1 ? 0 : easeIn(seg(t, 0.86, 1));
      const op = inK * (1 - outK);
      el.style.opacity = op.toFixed(3);
      el.style.filter = op > 0.99 ? "none" : `blur(${((1 - inK) * 14 + outK * 10).toFixed(1)}px)`;
      el.style.transform = `translate(-50%, -50%) translateY(${((1 - inK) * 40 - outK * 40).toFixed(1)}px) scale(${(0.94 + inK * 0.06).toFixed(3)})`;
    });

    if (cur !== current.current) {
      current.current = cur;
      counterRef.current.textContent = pad(cur + 1);
      numRef.current.textContent = cur + 1;
    }
    const t = q - cur;
    const nk = seg(t, 0.4, 0.6) * (cur === n - 1 ? 1 : 1 - seg(t, 0.86, 1));
    numRef.current.style.opacity = (nk * hk).toFixed(3);
  });

  return (
    <section className="scene reasons" data-ch="reasons" ref={sceneRef} style={{ "--len": `${n * 95 + 80}vh` }}>
      <div className="stage" ref={stageRef}>
        <div className="reasons-head" ref={headRef}>
          <p className="eyebrow">every balloon is carrying something</p>
          <h2>Reasons I love you</h2>
          <p className="counter"><b ref={counterRef}>01</b> / {pad(n)}</p>
        </div>
        <p className="reason-num" ref={numRef} aria-hidden="true">1</p>
        <div aria-hidden="true">
          {reasons.map((_, i) => (
            <Balloon key={i} id={`balloon-${i}`} colors={BALLOON_COLORS[i % BALLOON_COLORS.length]} ref={(el) => (balloonRefs.current[i] = el)} />
          ))}
        </div>
        <div>
          {reasons.map((text, i) => (
            <p key={i} className="reason" ref={(el) => (reasonRefs.current[i] = el)}>{text}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
