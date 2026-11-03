import { useRef, useState } from "react";
import "./WishCake.css";
import CakeArt from "./CakeArt";
import { useScene } from "../../hooks/useEngine";
import { burstHearts, confetti } from "../../engine/fx";
import { easeBack, easeOut, seg, clamp } from "../../lib/math";

/** The cake rises, candles light one by one as she scrolls, then she blows them out. */
export default function WishCake() {
  const [blown, setBlown] = useState(false);
  const blownRef = useRef(false);
  const svgRef = useRef(null);
  const flameRefs = useRef([]);
  const titleRef = useRef(null);
  const eyebrowRef = useRef(null);
  const btnRef = useRef(null);
  const progress = useRef(0);

  const { sceneRef, stageRef } = useScene((p) => {
    progress.current = p;
    const k = easeOut(seg(p, 0, 0.3));
    svgRef.current.style.transform = `translateY(${(1 - k) * 60}px) scale(${0.9 + k * 0.1})`;
    svgRef.current.style.opacity = k;
    const tk = easeOut(seg(p, 0.08, 0.3));
    titleRef.current.style.opacity = tk;
    titleRef.current.style.transform = `translateY(${(1 - tk) * 24}px)`;
    eyebrowRef.current.style.opacity = easeOut(seg(p, 0.02, 0.2));
    if (blownRef.current) return;
    flameRefs.current.forEach((f, i) => {
      const fk = easeBack(seg(p, 0.28 + i * 0.09, 0.38 + i * 0.09));
      f.style.transform = `scale(${Math.max(0, fk)})`;
      f.style.opacity = clamp(fk * 1.5);
    });
    const bk = seg(p, 0.55, 0.65);
    btnRef.current.style.opacity = bk;
    btnRef.current.style.pointerEvents = bk > 0.5 ? "auto" : "none";
    btnRef.current.style.transform = `translateY(${(1 - bk) * 12}px)`;
  });

  const blow = (e) => {
    e?.stopPropagation();
    if (blownRef.current) return;
    blownRef.current = true;
    setBlown(true);
    flameRefs.current.forEach((f) => {
      f.style.transition = "transform .5s cubic-bezier(.5,0,.75,0), opacity .5s";
      f.style.transform = "scale(0)";
      f.style.opacity = 0;
    });
    const r = svgRef.current.getBoundingClientRect();
    setTimeout(() => {
      confetti(r.left + r.width / 2, r.top + r.height * 0.3, 160, 1.2);
      burstHearts(r.left + r.width / 2, r.top + r.height * 0.2, 14);
    }, 450);
  };

  return (
    <section className="scene cake" data-ch="cake" ref={sceneRef} style={{ "--len": "220vh" }}>
      <div className={`stage${blown ? " blown" : ""}`} ref={stageRef}>
        <p className="eyebrow" ref={eyebrowRef}>first things first</p>
        <h2 className="cake-title" ref={titleRef}>{blown ? "Wish made…" : "Make a wish…"}</h2>
        <CakeArt svgRef={svgRef} flameRefs={flameRefs} onClick={(e) => progress.current > 0.55 && blow(e)} />
        <div className="cake-actions">
          <button className="btn" id="blow" type="button" ref={btnRef} onClick={blow}>Blow out the candles</button>
          <p className="after-wish">Wish sealed. Now it has to come true.</p>
        </div>
      </div>
    </section>
  );
}
