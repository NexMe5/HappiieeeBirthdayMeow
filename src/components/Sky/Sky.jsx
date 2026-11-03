import { useEffect, useRef } from "react";
import { useOnMeasure, useTicker } from "../../hooks/useEngine";
import { viewport } from "../../engine/scrollEngine";
import { attachFx, drawFx } from "../../engine/fx";
import { reducedMotion } from "../../lib/heart";

const DPR = Math.min(window.devicePixelRatio || 1, 2);

function fitCanvas(c) {
  c.width = viewport.w * DPR;
  c.height = viewport.h * DPR;
  c.getContext("2d").setTransform(DPR, 0, 0, DPR, 0, 0);
}

/** The night sky: colour atmosphere, twinkling parallax stars with the odd shooting star, film grain. */
export function Sky() {
  const canvasRef = useRef(null);
  const stars = useRef([]);
  const shooting = useRef(null);

  const setup = () => {
    const c = canvasRef.current;
    if (!c) return;
    fitCanvas(c);
    const { w: W, h: H } = viewport;
    const n = Math.round(Math.min(220, Math.max(60, (W * H) / 6500)));
    stars.current = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H * 1.6, r: Math.random() * 1.3 + 0.2,
      d: Math.random() * 0.6 + 0.1, tw: Math.random() * Math.PI * 2, sp: Math.random() * 1.5 + 0.5, warm: Math.random() < 0.25,
    }));
  };
  useEffect(setup, []);
  useOnMeasure(setup);

  useTicker((now, dt, sy) => {
    const c = canvasRef.current;
    if (!c) return;
    const g = c.getContext("2d"), { w: W, h: H } = viewport;
    g.clearRect(0, 0, W, H);
    for (const s of stars.current) {
      let y = (s.y - sy * s.d * 0.12) % (H * 1.6);
      if (y < 0) y += H * 1.6;
      if (y > H) continue;
      g.globalAlpha = reducedMotion ? 0.7 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(now * 0.001 * s.sp + s.tw));
      g.fillStyle = s.warm ? "#ffe2b0" : "#fff";
      g.beginPath(); g.arc(s.x, y, s.r, 0, 6.283); g.fill();
    }
    if (!reducedMotion) {
      if (!shooting.current && Math.random() < 0.0025) shooting.current = { x: Math.random() * W * 0.7 + W * 0.2, y: Math.random() * H * 0.35, l: 0 };
      const st = shooting.current;
      if (st) {
        st.l += 1;
        const k = st.l / 60, x = st.x - k * 260, y = st.y + k * 120;
        const grad = g.createLinearGradient(x, y, x + 90, y - 42);
        grad.addColorStop(0, "rgba(255,240,210,.9)"); grad.addColorStop(1, "rgba(255,240,210,0)");
        g.globalAlpha = 1 - k; g.strokeStyle = grad; g.lineWidth = 1.4;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + 90, y - 42); g.stroke();
        if (st.l > 60) shooting.current = null;
      }
    }
    g.globalAlpha = 1;
  });

  return (
    <>
      <div className="atmos" aria-hidden="true" />
      <canvas id="stars" ref={canvasRef} aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </>
  );
}

/** Top-most particle canvas (hearts, confetti, fireworks). */
export function FxCanvas() {
  const ref = useRef(null);
  useEffect(() => { fitCanvas(ref.current); attachFx(ref.current); }, []);
  useOnMeasure(() => ref.current && fitCanvas(ref.current));
  useTicker(drawFx);
  return <canvas id="fx" ref={ref} aria-hidden="true" />;
}
