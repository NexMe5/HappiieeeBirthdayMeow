import { useEffect, useRef, useState } from "react";
import "./Chrome.css";
import { useTicker } from "../../hooks/useEngine";
import { viewport } from "../../engine/scrollEngine";
import { music } from "../../engine/music";
import { HEART, finePointer } from "../../lib/heart";
import { clamp } from "../../lib/math";

/** Thin progress line on the right edge with a small heart riding it. */
export function ProgressRail() {
  const fill = useRef(null);
  const heart = useRef(null);
  useTicker((now, dt, y) => {
    const max = Math.max(1, document.documentElement.scrollHeight - viewport.h);
    const p = clamp(y / max);
    fill.current.style.transform = `scaleY(${p.toFixed(4)})`;
    heart.current.style.top = `${(p * 100).toFixed(2)}%`;
  });
  return (
    <div className="rail" aria-hidden="true">
      <i ref={fill} />
      <svg ref={heart} viewBox="-11 -13 22 20"><path d={HEART} /></svg>
    </div>
  );
}

/** Play / pause for the music box. */
export function SoundToggle() {
  const [on, setOn] = useState(music.isOn());
  useEffect(() => music.subscribe(setOn), []);
  return (
    <button
      className={`sound${on ? " on" : ""}`}
      type="button"
      aria-pressed={on}
      aria-label={on ? "Pause music" : "Play music"}
      onClick={(e) => { e.stopPropagation(); music.toggle(); }}
    >
      <span className="bars"><span /><span /><span /></span>
    </button>
  );
}

/** Soft gold ring that trails the mouse (desktop only) and grows over buttons and photos. */
export function Cursor() {
  const ref = useRef(null);
  const target = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (!finePointer) return;
    const move = (e) => { target.current = { x: e.clientX, y: e.clientY }; };
    const over = (e) => ref.current?.classList.toggle("big", !!e.target.closest("button, .polaroid"));
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    return () => { window.removeEventListener("pointermove", move); document.removeEventListener("pointerover", over); };
  }, []);

  useTicker(() => {
    if (!finePointer || !ref.current) return;
    pos.current.x += (target.current.x - pos.current.x) * 0.2;
    pos.current.y += (target.current.y - pos.current.y) * 0.2;
    ref.current.style.transform = `translate(${pos.current.x.toFixed(1)}px, ${pos.current.y.toFixed(1)}px)`;
  });

  return <div className="cursor" ref={ref} aria-hidden="true" />;
}
