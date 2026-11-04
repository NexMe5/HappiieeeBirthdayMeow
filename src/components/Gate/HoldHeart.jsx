import { useEffect, useRef, useState } from "react";
import { config } from "../../config";
import { HEART } from "../../lib/heart";
import { clamp } from "../../lib/math";
import { useTicker } from "../../hooks/useEngine";
import { music } from "../../engine/music";

const HOLD_MS = 1400;

/** "Press & hold the heart" screen. Calls onComplete(rect) when the ring fills. */
export default function HoldHeart({ shown, enabled, onComplete }) {
  const btnRef = useRef(null);
  const ringRef = useRef(null);
  const holding = useRef(false);
  const start = useRef(0);
  const progress = useRef(0);
  const done = useRef(false);
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => { if (shown) btnRef.current?.focus({ preventScroll: true }); }, [shown]);

  const begin = (e) => {
    e?.preventDefault();
    if (!enabled || done.current) return;
    music.unlock(); // inside her tap, so every sound later can start on its own (iPhone needs this)
    holding.current = true;
    start.current = performance.now() - progress.current * HOLD_MS;
    setIsHolding(true);
  };
  const end = () => { holding.current = false; setIsHolding(false); };

  useTicker((now, dt) => {
    if (!enabled || done.current) return;
    progress.current = holding.current ? clamp((now - start.current) / HOLD_MS) : Math.max(0, progress.current - dt / 500);
    ringRef.current.style.strokeDashoffset = 1 - progress.current;
    if (progress.current >= 1) {
      done.current = true;
      end();
      onComplete(btnRef.current.getBoundingClientRect());
    }
  });

  return (
    <div className={`gate-inner${shown ? "" : " off"}`}>
      <p className="eyebrow">psst&hellip; this one is for you</p>
      <p className="gate-title">
        Happy birthday, {config.name}{" "}
        {config.emoji && <span className="gate-emoji" aria-hidden="true">{config.emoji}</span>}
      </p>
      <button
        ref={btnRef}
        className={`hold${isHolding ? " holding" : ""}`}
        type="button"
        tabIndex={shown ? 0 : -1}
        aria-label="Press and hold the heart to open your surprise"
        onPointerDown={begin}
        onPointerUp={end}
        onPointerLeave={end}
        onPointerCancel={end}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat) begin(e); }}
        onKeyUp={(e) => { if (e.key === " " || e.key === "Enter") end(); }}
      >
        <svg viewBox="0 0 168 168" aria-hidden="true">
          <circle className="ring-bg" cx="84" cy="84" r="78" fill="none" strokeWidth="1.5" />
          <circle ref={ringRef} className="ring" cx="84" cy="84" r="78" fill="none" strokeWidth="2.5" pathLength="1"
            strokeDasharray="1" strokeDashoffset="1" transform="rotate(-90 84 84)" />
          <defs>
            <radialGradient id="gateHeart" cx=".35" cy=".3" r=".9">
              <stop offset="0" stopColor="#ffd4de" /><stop offset=".45" stopColor="#ec7c98" /><stop offset="1" stopColor="#a8264f" />
            </radialGradient>
          </defs>
          <g className="heart-g">
            <path transform="translate(84 96) scale(3.6)" fill="url(#gateHeart)" style={{ filter: "drop-shadow(0 0 14px rgba(236,124,152,.65))" }} d={HEART} />
            <ellipse cx="70" cy="62" rx="7" ry="4" fill="rgba(255,255,255,.55)" transform="rotate(-30 70 62)" />
          </g>
        </svg>
      </button>
      <p className="gate-hint">press &amp; hold the heart</p>
    </div>
  );
}
