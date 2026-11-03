import { useEffect, useRef } from "react";
import { config } from "../../config";
import { useScene } from "../../hooks/useEngine";
import { viewport } from "../../engine/scrollEngine";
import { clamp, easeIn, easeOut, lerp, seg } from "../../lib/math";

/**
 * The videos, one at a time: each grows from a tilted little card into a big cinema frame,
 * plays muted while it's on screen, then lifts away for the next. "Play with sound" opens it full screen.
 */
export default function Cinema({ videos, onOpen }) {
  const c = config.corner;
  const n = videos.length;
  const frameRefs = useRef([]);
  const videoRefs = useRef([]);
  const headRef = useRef(null);
  const playing = useRef(videos.map(() => false));
  const inView = useRef(false);

  const setPlaying = (i, on) => {
    const v = videoRefs.current[i];
    if (!v || playing.current[i] === on) return;
    playing.current[i] = on;
    if (on) v.play().catch(() => { playing.current[i] = false; });
    else v.pause();
  };

  const { sceneRef, stageRef } = useScene((p) => {
    const W = viewport.w, H = stageRef.current.clientHeight, mobile = W < 700;
    const q = seg(p, 0.03, 0.97) * n;
    const cur = Math.min(n - 1, Math.floor(q));
    headRef.current.style.opacity = easeOut(seg(p, 0, 0.06)).toFixed(3);

    videos.forEach((v, i) => {
      const el = frameRefs.current[i];
      const t = q - i;
      const inK = easeOut(seg(t, -0.08, 0.36));
      const outK = i === n - 1 ? 0 : easeIn(seg(t, 0.82, 1));
      const maxW = W * (mobile ? 0.88 : 0.74), maxH = H * (mobile ? 0.62 : 0.64);
      let w = maxW, h = w / v.ratio;
      if (h > maxH) { h = maxH; w = h * v.ratio; }
      el.style.width = `${w.toFixed(0)}px`;
      el.style.height = `${h.toFixed(0)}px`;
      const op = clamp(inK * 1.5) * (1 - outK);
      const y = lerp(H * 0.42, H * 0.04, inK) - outK * H * 0.7;
      const s = lerp(0.48, 1, inK) * lerp(1, 0.86, outK);
      const r = lerp(i % 2 ? 5 : -5, 0, inK) + outK * (i % 2 ? -4 : 4);
      el.style.opacity = op.toFixed(3);
      el.style.visibility = op > 0.01 ? "visible" : "hidden";
      el.style.transform = `translate(-50%, -50%) translateY(${y.toFixed(1)}px) rotate(${r.toFixed(2)}deg) scale(${s.toFixed(3)})`;
      el.style.borderRadius = `${lerp(26, 12, inK).toFixed(1)}px`;
      el.style.pointerEvents = op > 0.6 ? "auto" : "none";
      setPlaying(i, inView.current && i === cur && op > 0.4);
    });
  });

  // stop every video once the section scrolls away
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      inView.current = e.isIntersecting;
      if (!e.isIntersecting) videos.forEach((_, i) => setPlaying(i, false));
    });
    io.observe(sceneRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section className="scene cinema" data-ch="cinema" ref={sceneRef} style={{ "--len": `${n * 120 + 60}vh` }}>
      <div className="stage" ref={stageRef}>
        <div className="cinema-head" ref={headRef}>
          <p className="eyebrow">{c.videosEyebrow}</p>
          <h2>{c.videosTitle}</h2>
        </div>
        {videos.map((v, i) => (
          <figure className="cine-frame" key={i} ref={(el) => (frameRefs.current[i] = el)} style={{ visibility: "hidden" }}>
            <video ref={(el) => (videoRefs.current[i] = el)} src={v.src} poster={v.poster} muted loop playsInline preload="metadata" />
            <figcaption>
              <span className="cine-caption">{v.caption}</span>
              <button type="button" className="cine-sound" onClick={(e) => { e.stopPropagation(); setPlaying(i, false); onOpen(i); }}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg> play with sound
              </button>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
