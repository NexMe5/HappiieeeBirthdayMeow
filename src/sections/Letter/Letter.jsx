import { useMemo, useRef } from "react";
import "./Letter.css";
import { config, nick } from "../../config";
import { useScene, useTicker } from "../../hooks/useEngine";
import { viewport } from "../../engine/scrollEngine";
import { easeIn, easeInOut, easeOut, lerp, seg } from "../../lib/math";
import { reducedMotion } from "../../lib/heart";

const CHARS_PER_SEC = reducedMotion ? 400 : 48;

/**
 * Scroll-driven envelope: the seal pops, the flap opens, the letter slides out and grows to fill the
 * screen, then writes itself. Tapping the letter finishes the writing instantly.
 */
export default function Letter() {
  // split paragraphs into words of characters so the text can appear letter by letter without reflow
  const paragraphs = useMemo(
    () => config.letter.map((par) => par.split(" ").map((w) => [...w])),
    []
  );
  const charRefs = useRef([]);
  const typing = useRef({ started: false, t0: 0, count: 0, done: false });
  const r = {
    head: useRef(null), back: useRef(null), front: useRef(null), flap: useRef(null),
    seal: useRef(null), paper: useRef(null), sign: useRef(null),
  };

  const { sceneRef, stageRef } = useScene((p) => {
    const W = viewport.w, sh = stageRef.current.clientHeight, paper = r.paper.current;
    const ew = Math.min(380, W * 0.78), eh = ew * 0.64;
    const pw = paper.offsetWidth, ph = paper.offsetHeight;
    const s0 = (ew * 0.84) / pw;
    const envY0 = sh * 0.12;
    const envY = envY0 + easeIn(seg(p, 0.5, 0.7)) * sh * 0.8;
    const envA = 1 - seg(p, 0.56, 0.7);
    const envTop = envY - eh / 2, envBottom = envY + eh / 2;
    const sealK = easeOut(seg(p, 0.05, 0.13));
    const flapA = 180 * easeInOut(seg(p, 0.11, 0.28));
    const rise = easeInOut(seg(p, 0.27, 0.5)) * ph * s0 * 0.74;
    const cy0 = envY0 - eh / 2 + eh * 0.06 + (ph * s0) / 2 - rise;
    const grow = easeInOut(seg(p, 0.58, 0.82));
    const sc = lerp(s0, Math.min(1, (sh * 0.86) / ph), grow);
    const cy = lerp(cy0, sh * 0.015, grow);

    const place = (el, w, h, top) => {
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      return `translate(${-w / 2}px, ${top}px)`;
    };
    [r.back.current, r.front.current].forEach((el) => { el.style.transform = place(el, ew, eh, envTop); el.style.opacity = envA; });
    const flap = r.flap.current;
    flap.style.transform = `${place(flap, ew, eh * 0.58, envTop)} perspective(900px) rotateX(${flapA}deg)`;
    flap.style.opacity = envA;
    flap.classList.toggle("open", flapA > 90);
    r.seal.current.style.transform = `translate(-50%, -50%) translateY(${envTop + eh * 0.56}px) scale(${1 + sealK * 0.5}) rotate(${sealK * 25}deg)`;
    r.seal.current.style.opacity = (1 - sealK) * envA;

    // hide the part of the letter that is still below the envelope's bottom edge
    const clipPx = envA > 0.02 ? Math.max(0, (cy + (ph * sc) / 2 - envBottom) / sc) : 0;
    paper.style.clipPath = clipPx > 0 ? `inset(0 0 ${clipPx.toFixed(1)}px 0)` : "none";
    paper.style.transform = `translate(-50%, -50%) translateY(${cy.toFixed(1)}px) scale(${sc.toFixed(4)}) rotate(${(-1.2 * grow).toFixed(2)}deg)`;
    paper.classList.toggle("lifted", grow > 0.3);
    paper.style.zIndex = grow > 0.05 ? 7 : 2;
    r.head.current.style.opacity = 1 - easeOut(seg(p, 0.56, 0.68));

    if (p > 0.8 && !typing.current.started) typing.current = { started: true, t0: performance.now(), count: 0, done: false };
  });

  useTicker((now) => {
    const t = typing.current, chars = charRefs.current;
    if (!t.started || t.done) return;
    const target = Math.min(chars.length, Math.floor(((now - t.t0) / 1000) * CHARS_PER_SEC));
    while (t.count < target) chars[t.count++]?.classList.add("on");
    if (t.count >= chars.length) { t.done = true; r.sign.current.classList.add("on"); }
  });

  const finishNow = () => { if (typing.current.started) typing.current.t0 = -1e9; };

  let ci = 0;
  return (
    <section className="scene letter" data-ch="letter" ref={sceneRef} style={{ "--len": "340vh" }}>
      <div className="stage" ref={stageRef}>
        <div className="letter-head" ref={r.head}>
          <h2>One last thing, <span className="name-ink">{nick(2)}</span>&hellip;</h2>
          <p>{config.from} wrote you a letter.</p>
        </div>
        <div className="env env-back" ref={r.back} />
        <div className="env env-flap" ref={r.flap} />
        <article className="paper" ref={r.paper} aria-label="Letter" onClick={finishNow}>
          <p className="dear">Dear {nick(3)},</p>
          <div className="letter-body">
            {paragraphs.map((words, pi) => (
              <p key={pi}>
                {words.map((chars, wi) => (
                  <span key={wi}>
                    <span className="wd">
                      {chars.map((ch, k) => {
                        const idx = ci++;
                        return <span key={k} className="c" ref={(el) => (charRefs.current[idx] = el)}>{ch}</span>;
                      })}
                    </span>
                    {wi < words.length - 1 ? " " : ""}
                  </span>
                ))}
              </p>
            ))}
          </div>
          <p className="sign" ref={r.sign}><span>With all my love,</span><span>&mdash; {config.from}</span></p>
        </article>
        <div className="env env-front" ref={r.front} />
        <div className="env seal" ref={r.seal}><span>{(config.from || "?").trim()[0].toUpperCase()}</span></div>
      </div>
    </section>
  );
}
