import { useEffect, useRef, useState } from "react";
import "./Finale.css";
import { config, nicknames } from "../../config";
import { useTicker } from "../../hooks/useEngine";
import { viewport } from "../../engine/scrollEngine";
import { confetti, firework, fxState } from "../../engine/fx";
import { reducedMotion } from "../../lib/heart";

const WORDS = ["Happy", "Birthday"];

/** Big "Happy Birthday", her pet names taking turns, and fireworks while she's here. */
export default function Finale() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  const [nickIndex, setNickIndex] = useState(0);
  const [swapping, setSwapping] = useState(false);
  const lastFw = useRef(0);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        fxState.finaleOn = e.isIntersecting && e.intersectionRatio > 0.35;
        if (fxState.finaleOn) setShown(true);
      },
      { threshold: [0, 0.35, 0.6] }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  // first arrival: confetti from both corners, then start cycling the pet names
  useEffect(() => {
    if (!shown) return;
    const t1 = setTimeout(() => { confetti(viewport.w * 0.2, viewport.h, 120, 0.7); confetti(viewport.w * 0.8, viewport.h, 120, 0.7); }, 500);
    if (nicknames.length < 2) return () => clearTimeout(t1);
    let t3;
    const t2 = setTimeout(function cycle() {
      setSwapping(true);
      setTimeout(() => { setNickIndex((i) => (i + 1) % nicknames.length); setSwapping(false); }, 450);
      t3 = setTimeout(cycle, 2400);
    }, 2600 + 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [shown]);

  useTicker((now) => {
    if (!fxState.finaleOn || reducedMotion || now - lastFw.current < 900) return;
    lastFw.current = now;
    firework(viewport.w * (0.2 + Math.random() * 0.6), viewport.h * (0.12 + Math.random() * 0.3));
  });

  return (
    <section className={`finale${shown ? " in" : ""}`} data-ch="finale" ref={ref}>
      <h2 className="finale-title" aria-label="Happy Birthday">
        {WORDS.map((w, wi) => (
          <span key={w} style={{ display: "block" }} aria-hidden="true">
            {[...w].map((c, i) => (
              <span key={i} className="ch" style={{ transitionDelay: `${(wi * 5 + i) * 45}ms` }}>{c}</span>
            ))}
          </span>
        ))}
      </h2>
      <p className="finale-name">
        <span className={`nick-cycle name-ink${swapping ? " swap" : ""}`}>{nicknames[nickIndex]}</span>
      </p>
      <p className="finale-note">Made with love, just for you, by <b>{config.from}</b></p>
      <button className="btn" type="button" onClick={(e) => { e.stopPropagation(); window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }); }}>
        Watch it again
      </button>
      <p className="tap-hint">tap anywhere for fireworks</p>
    </section>
  );
}
