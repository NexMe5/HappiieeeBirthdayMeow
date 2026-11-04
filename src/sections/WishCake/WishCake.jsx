import { useEffect, useRef, useState } from "react";
import "./WishCake.css";
import CakeArt from "./CakeArt";
import { config } from "../../config";
import { useScene, useTicker } from "../../hooks/useEngine";
import { viewport } from "../../engine/scrollEngine";
import { burstHearts, confetti, firework } from "../../engine/fx";
import { music } from "../../engine/music";
import { easeBack, easeOut, seg, clamp } from "../../lib/math";
import { reducedMotion } from "../../lib/heart";

/**
 * The cake rises and its candles light as she scrolls; she blows them out; then
 * "Listen to Nandini's wish" plays her wish once (the music box stops for good). Her words appear as
 * subtitles; right after "I wish you were here" the cake disappears, your photo comes to the front and
 * fireworks + heart crackers go off on both sides by themselves. When it ends: "Listen again".
 */
export default function WishCake() {
  const w = config.wish;
  const lastSubEnd = Math.max(0, ...w.subtitles.map((s) => s.end));
  const [blown, setBlown] = useState(false);
  const [listening, setListening] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [ended, setEnded] = useState(false);
  const blownRef = useRef(false);
  const listeningRef = useRef(false);
  const revealedRef = useRef(false);
  const endedRef = useRef(false);
  const inView = useRef(false);
  const svgRef = useRef(null);
  const flameRefs = useRef([]);
  const titleRef = useRef(null);
  const eyebrowRef = useRef(null);
  const btnRef = useRef(null);
  const wishBtnRef = useRef(null);
  const lineRef = useRef(null);
  const lineText = useRef("");
  const progress = useRef(0);
  const nextFw = useRef(0);
  const nextHearts = useRef(0);

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

  // fireworks only while this chapter is on screen
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { inView.current = e.isIntersecting && e.intersectionRatio > 0.3; }, { threshold: [0, 0.3, 0.6] });
    io.observe(stageRef.current);
    return () => io.disconnect();
  }, []);

  const setLine = (text, kind) => {
    if (lineText.current === text) return;
    lineText.current = text;
    lineRef.current.textContent = text;
    lineRef.current.dataset.kind = kind;
  };

  useTicker((now) => {
    if (!listeningRef.current) return;
    const t = music.wishTime();

    // her words as subtitles, then your line
    const sub = w.subtitles.find((s) => t >= s.at && t < s.end);
    if (sub) setLine(`“${sub.text}”`, "sub");
    else if (revealedRef.current && t >= lastSubEnd - 0.2) setLine(w.line, "line");
    else if (!revealedRef.current) setLine("", "sub");

    // right after "I wish you were here": cake out, your photo in, fireworks on
    if (t >= w.revealAt && !revealedRef.current) {
      revealedRef.current = true;
      setRevealed(true);
      nextFw.current = 0;
      const r = svgRef.current.getBoundingClientRect();
      burstHearts(r.left + r.width / 2, r.top + r.height / 2, 30);
    }
    if (music.wishEnded() && !endedRef.current) { endedRef.current = true; setEnded(true); }

    // fireworks and heart crackers on both sides, no clicks needed
    if (!revealedRef.current || endedRef.current || !inView.current) return;
    const W = viewport.w, H = viewport.h;
    const side = () => (Math.random() < 0.5 ? 0.06 + Math.random() * 0.22 : 0.72 + Math.random() * 0.22);
    if (now > nextFw.current) {
      nextFw.current = now + (reducedMotion ? 2200 : 650 + Math.random() * 500);
      firework(W * side(), H * (0.12 + Math.random() * 0.32));
    }
    if (now > nextHearts.current && !reducedMotion) {
      nextHearts.current = now + 420 + Math.random() * 380;
      burstHearts(W * side(), H * (0.45 + Math.random() * 0.4), 9);
    }
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
    setLine("Wish sealed. Now it has to come true.", "line");
    const r = svgRef.current.getBoundingClientRect();
    setTimeout(() => {
      confetti(r.left + r.width / 2, r.top + r.height * 0.3, 160, 1.2);
      burstHearts(r.left + r.width / 2, r.top + r.height * 0.2, 14);
    }, 450);
  };

  const listen = (e) => {
    e.stopPropagation();
    if (listeningRef.current && !endedRef.current) return; // already playing
    listeningRef.current = true;
    endedRef.current = false;
    setListening(true);
    setEnded(false);
    setLine("", "sub");
    music.playWish(); // the Happy Birthday music box stops for good
    const r = wishBtnRef.current.getBoundingClientRect();
    burstHearts(r.left + r.width / 2, r.top, 16);
  };

  const playing = listening && !ended;
  const title = revealed ? w.title : blown ? "Wish made…" : "Make a wish…";
  const stageClass = ["stage", blown && "blown", listening && "listening", revealed && "revealed"].filter(Boolean).join(" ");

  return (
    <section className="scene cake" data-ch="cake" ref={sceneRef} style={{ "--len": "240vh" }}>
      <div className={stageClass} ref={stageRef}>
        <div className="wish-backdrop" aria-hidden="true">
          <img src={w.photo} alt="" />
        </div>
        <p className="eyebrow" ref={eyebrowRef}>first things first</p>
        <h2 className="cake-title" ref={titleRef}>{title}</h2>
        <div className="cake-cell">
          <div className="cake-wrap">
            <CakeArt svgRef={svgRef} flameRefs={flameRefs} onClick={(e) => progress.current > 0.55 && blow(e)} />
          </div>
          <figure className="wish-front" aria-hidden={!revealed}>
            <img src={w.photo} alt="Us, forever" draggable="false" />
          </figure>
        </div>
        <div className="cake-actions">
          <p className="after-wish" ref={lineRef} aria-live="polite" />
          <button className="btn" id="blow" type="button" ref={btnRef} onClick={blow}>Blow out the candles</button>
          <button ref={wishBtnRef} className={`btn wish-btn${playing ? " playing" : ""}`} type="button" onClick={listen}>
            {playing ? (
              <><span className="wish-eq" aria-hidden="true"><i /><i /><i /><i /></span> her wish is playing</>
            ) : (
              <><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg> {ended ? w.again : w.button}</>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
