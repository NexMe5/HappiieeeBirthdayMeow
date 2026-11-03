import { useMemo, useRef } from "react";
import "./WordsReveal.css";
import { config } from "../../config";
import { useScene } from "../../hooks/useEngine";
import { clamp, seg } from "../../lib/math";

/** Split the intro into words; *starred* words become gold italics. */
function parseWords(text) {
  let inEm = false;
  return text.split(/\s+/).map((tok) => {
    let s = tok, end = false;
    if (s.startsWith("*")) { inEm = true; s = s.slice(1); }
    if (/\*[.,!?…]*$/.test(s)) { s = s.replace(/\*([.,!?…]*)$/, "$1"); end = true; }
    const word = { text: s, em: inEm };
    if (end) inEm = false;
    return word;
  });
}

/** Pinned paragraph whose words light up one by one as she scrolls. */
export default function WordsReveal() {
  const words = useMemo(() => parseWords(config.intro), []);
  const refs = useRef([]);

  const { sceneRef, stageRef } = useScene((p) => {
    const n = words.length, q = seg(p, 0.06, 0.82) * (n + 3);
    refs.current.forEach((w, i) => {
      if (!w) return;
      const k = clamp(q - i, 0, 3) / 3;
      w.style.opacity = (0.13 + 0.87 * k).toFixed(3);
      w.style.filter = k < 1 ? `blur(${((1 - k) * 2.5).toFixed(2)}px)` : "none";
    });
  });

  return (
    <section className="scene words" data-ch="words" ref={sceneRef} style={{ "--len": "260vh" }}>
      <div className="stage" ref={stageRef}>
        <p className="reveal-text">
          {words.map((w, i) => (
            <span key={i}>
              <span className={`w${w.em ? " em" : ""}`} ref={(el) => (refs.current[i] = el)}>{w.text}</span>
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
