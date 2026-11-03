import { useRef } from "react";
import "./Hero.css";
import { nick } from "../../config";
import { useTicker } from "../../hooks/useEngine";
import { viewport } from "../../engine/scrollEngine";
import { clamp } from "../../lib/math";

/** Opening chapter: moon, the headline rising into place, gentle parallax as she starts scrolling. */
export default function Hero() {
  const inner = useRef(null);
  const moon = useRef(null);

  useTicker((now, dt, y) => {
    if (y > viewport.h * 1.2) return;
    inner.current.style.transform = `translateY(${(y * 0.35).toFixed(1)}px)`;
    inner.current.style.opacity = clamp(1 - y / (viewport.h * 0.7));
    moon.current.style.transform = `translateY(${(y * 0.18).toFixed(1)}px)`;
  });

  return (
    <section className="hero" data-ch="hero">
      <svg className="moon" ref={moon} viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <radialGradient id="moonGlow"><stop offset="0" stopColor="#f6c978" stopOpacity=".35" /><stop offset="1" stopColor="#f6c978" stopOpacity="0" /></radialGradient>
          <linearGradient id="moonFill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff3dc" /><stop offset="1" stopColor="#f3c98a" /></linearGradient>
          <mask id="crescent"><rect width="200" height="200" fill="#fff" /><circle cx="124" cy="82" r="50" fill="#000" /></mask>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#moonGlow)" />
        <circle cx="100" cy="100" r="54" fill="url(#moonFill)" mask="url(#crescent)" />
      </svg>

      <div className="hero-in" ref={inner}>
        <p className="eyebrow">a little something, for you</p>
        <h1>
          <span className="line"><span>Today the sky</span></span>
          <span className="line"><span>is a little <em>brighter.</em></span></span>
        </h1>
        <p className="hero-sub">
          Somewhere under it, <span className="name-ink">{nick(0)}</span> was born. Scroll slowly. Every bit of this is yours.
        </p>
      </div>
      <div className="scroll-cue" aria-hidden="true">scroll slowly<i /></div>
    </section>
  );
}
