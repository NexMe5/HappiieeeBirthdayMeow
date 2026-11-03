import { useMemo, useRef } from "react";
import "./MemoryLane.css";
import Polaroid from "./Polaroid";
import FairyLights from "./FairyLights";
import { placeholderPhoto } from "./placeholderPhoto";
import { config } from "../../config";
import { useScene } from "../../hooks/useEngine";
import { viewport } from "../../engine/scrollEngine";
import { clamp, easeInOut, lerp, seg } from "../../lib/math";

/** Her funny-photo gallery: a pinned horizontal walk past polaroids on fairy lights that swing with scroll speed. */
export default function MemoryLane() {
  const memories = useMemo(
    () => config.memories.map((m, i) => ({ ...m, url: m.src || placeholderPhoto(i), isPlaceholder: !m.src })),
    []
  );
  const trackRef = useRef(null);
  const headRef = useRef(null);
  const endRef = useRef(null);
  const cardRefs = useRef([]);
  const swing = useRef(memories.map((_, i) => ({ base: (i % 2 ? 1 : -1) * (1.5 + ((i * 7) % 3)), ang: 0, vel: 0 })));
  const lastX = useRef(null);

  const { sceneRef, stageRef } = useScene((p) => {
    const W = viewport.w;
    const first = cardRefs.current[0], end = endRef.current;
    const startX = W / 2 - (first.offsetLeft + first.offsetWidth / 2);
    const endX = W / 2 - (end.offsetLeft + end.offsetWidth / 2);
    const x = lerp(startX, endX, easeInOut(seg(p, 0.06, 0.94)));
    trackRef.current.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
    headRef.current.style.opacity = 1 - seg(p, 0.9, 1) * 0.4;

    const v = lastX.current == null ? 0 : x - lastX.current;
    lastX.current = x;
    const target = clamp(v * 0.35, -14, 14);
    swing.current.forEach((s, i) => {
      s.vel += (target * (1 + (i % 3) * 0.15) - s.ang) * 0.06;
      s.vel *= 0.88;
      s.ang += s.vel;
      cardRefs.current[i].style.transform = `rotate(${(s.base + s.ang).toFixed(2)}deg)`;
    });
  });

  return (
    <section className="scene memories" data-ch="memories" ref={sceneRef} style={{ "--len": `${Math.round(memories.length * (memories.length > 8 ? 48 : 70) + 120)}vh` }}>
      <div className="stage" ref={stageRef}>
        <div className="mem-head" ref={headRef}>
          <p className="eyebrow">{config.memoriesEyebrow}</p>
          <h2>{config.memoriesTitle}</h2>
        </div>
        <div className="track" ref={trackRef}>
          <FairyLights trackRef={trackRef} cardRefs={cardRefs} />
          {memories.map((m, i) => (
            <Polaroid key={i} src={m.url} caption={m.caption} focus={m.focus} isPlaceholder={m.isPlaceholder} ref={(el) => (cardRefs.current[i] = el)} />
          ))}
          <div className="end-card" ref={endRef}><p>{config.memoriesEnd}</p></div>
        </div>
      </div>
    </section>
  );
}
