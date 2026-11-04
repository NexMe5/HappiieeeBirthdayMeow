import { useMemo, useRef, useState } from "react";
import "./Letter.css";
import { config, nick } from "../../config";
import { useScene, useTicker } from "../../hooks/useEngine";
import { viewport } from "../../engine/scrollEngine";
import { music } from "../../engine/music";
import { easeIn, easeInOut, easeOut, lerp, seg } from "../../lib/math";

/**
 * Scroll-driven envelope: the seal pops, the flap opens, the letter slides out and grows to fill the
 * screen. Then it is read aloud: the voice plays and each line writes itself word by word as it's said.
 * If the phone blocks the sound, the words still appear on the same timing and a button offers the voice.
 */
export default function Letter() {
  const L = config.letter;
  // paragraphs -> lines -> words, each word with the second it should appear
  const { paragraphs, wordTimes, lastEnd } = useMemo(() => {
    const paragraphs = [[]], wordTimes = [];
    L.lines.forEach((line) => {
      const words = line.text.split(" ");
      const span = (line.end - line.at) * 0.92;
      const items = words.map((w, k) => {
        wordTimes.push(line.at + (k / words.length) * span);
        return { w, i: wordTimes.length - 1 };
      });
      paragraphs[paragraphs.length - 1].push(items);
      if (line.br) paragraphs.push([]);
    });
    return { paragraphs: paragraphs.filter((p) => p.length), wordTimes, lastEnd: Math.max(...L.lines.map((l) => l.end)) };
  }, []);
  const wordRefs = useRef([]);
  // mode: idle -> pending (asking the phone to play) -> audio | clock (sound blocked) ; done when finished
  const voice = useRef({ mode: "idle", t0: 0, count: 0, done: false });
  const [ui, setUi] = useState("idle"); // idle | playing | blocked | done
  const r = {
    head: useRef(null), back: useRef(null), front: useRef(null), flap: useRef(null),
    seal: useRef(null), paper: useRef(null), sign: useRef(null),
  };

  const reveal = (reset) => {
    if (reset) { wordRefs.current.forEach((el) => el?.classList.remove("on")); r.sign.current.classList.remove("on"); }
    voice.current = { mode: "pending", t0: performance.now(), count: reset ? 0 : voice.current.count, done: false };
    music.playVoice().then((ok) => {
      voice.current.mode = ok ? "audio" : "clock";
      voice.current.t0 = performance.now();
      setUi(ok ? "playing" : "blocked");
    });
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

    if (p > 0.8 && voice.current.mode === "idle") reveal(false);
  });

  // write each word the moment it's said
  useTicker((now) => {
    const v = voice.current, words = wordRefs.current;
    if (v.mode === "idle" || v.mode === "pending" || v.done) return;
    let t;
    if (v.mode === "audio") t = music.voicePlaying() ? music.voiceTime() : Infinity; // finished or paused: show the rest
    else t = (now - v.t0) / 1000;
    while (v.count < words.length && wordTimes[v.count] <= t) words[v.count++]?.classList.add("on");
    if (v.count >= words.length && t >= lastEnd) {
      v.done = true;
      r.sign.current.classList.add("on");
      setUi("done");
    }
  });

  const onVoiceBtn = (e) => {
    e.stopPropagation();
    if (ui === "blocked") reveal(true);      // sound was blocked: start over with the voice
    else if (ui === "done") { music.playVoice(); setUi("again"); }
  };
  const btnLabel = { blocked: "tap to hear it", done: "hear it again" }[ui];

  return (
    <section className="scene letter" data-ch="letter" ref={sceneRef} style={{ "--len": "340vh" }}>
      <div className="stage" ref={stageRef}>
        <div className="letter-head" ref={r.head}>
          <h2>One last thing, <span className="name-ink">{nick(2)}</span>&hellip;</h2>
          <p>{config.from} wrote you a letter.</p>
          {L.hint && (
            <p className="sound-hint">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" /></svg>
              {L.hint}
            </p>
          )}
        </div>
        <div className="env env-back" ref={r.back} />
        <div className="env env-flap" ref={r.flap} />
        <article className="paper" ref={r.paper} aria-label="Letter">
          {(ui === "playing" || ui === "again") && (
            <span className="voice-pill" aria-hidden="true"><span className="wish-eq"><i /><i /><i /><i /></span></span>
          )}
          {btnLabel && (
            <button type="button" className="voice-pill voice-btn" onClick={onVoiceBtn}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg> {btnLabel}
            </button>
          )}
          <p className="dear">Dear {nick(3)},</p>
          <div className="letter-body">
            {paragraphs.map((lines, pi) => (
              <p key={pi}>
                {lines.map((items, li) => (
                  <span key={li}>
                    {items.map(({ w, i }, k) => (
                      <span key={k}>
                        <span className="wd" ref={(el) => (wordRefs.current[i] = el)}>{w}</span>
                        {k < items.length - 1 ? " " : ""}
                      </span>
                    ))}
                    {li < lines.length - 1 ? " " : ""}
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
