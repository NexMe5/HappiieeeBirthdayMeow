import { useEffect, useRef, useState } from "react";
import { useOnMeasure } from "../../hooks/useEngine";

const Y = 4;
const SAG = 46;
const SPACING = 52;
const COLORS = ["#ffd98a", "#ffb3c6", "#fff0d0"];

/** The sagging wire with twinkling bulbs, strung through each polaroid's peg. Rebuilt on resize. */
export default function FairyLights({ trackRef, cardRefs }) {
  const pathRef = useRef(null);
  const [layout, setLayout] = useState({ width: 0, d: "" });
  const [bulbs, setBulbs] = useState([]);

  const build = () => {
    const track = trackRef.current;
    if (!track) return;
    const width = track.scrollWidth + 400;
    const pegs = cardRefs.current.filter(Boolean).map((c) => c.offsetLeft + c.offsetWidth / 2);
    const xs = [-200, ...pegs, track.scrollWidth + 200];
    let d = `M${xs[0]} ${Y}`;
    for (let i = 1; i < xs.length; i++) d += ` Q${(xs[i - 1] + xs[i]) / 2} ${Y + SAG} ${xs[i]} ${Y}`;
    setLayout({ width, d });
  };
  useEffect(build, []);
  useOnMeasure(build);

  // place bulbs along the wire once it has rendered
  useEffect(() => {
    const path = pathRef.current;
    if (!path || !layout.d) return;
    const L = path.getTotalLength(), list = [];
    for (let l = 20; l < L; l += SPACING) {
      const pt = path.getPointAtLength(l);
      list.push({ x: pt.x, y: pt.y + 5, color: COLORS[Math.round(l / SPACING) % 3], delay: (-Math.random() * 3).toFixed(2) });
    }
    setBulbs(list);
  }, [layout]);

  return (
    <svg className="lights" aria-hidden="true" width={layout.width} viewBox={`-200 0 ${layout.width || 1} 80`}
      style={{ left: "-200px", width: `${layout.width}px` }}>
      <defs>
        <radialGradient id="bulbGlow"><stop offset="0" stopColor="#ffd98a" stopOpacity=".7" /><stop offset="1" stopColor="#ffd98a" stopOpacity="0" /></radialGradient>
      </defs>
      <path className="wire" ref={pathRef} d={layout.d} />
      {bulbs.map((b, i) => (
        <g className="bulb" key={i} style={{ animationDelay: `${b.delay}s` }}>
          <circle cx={b.x} cy={b.y} r="12" fill="url(#bulbGlow)" />
          <circle cx={b.x} cy={b.y} r="3.2" fill={b.color} />
        </g>
      ))}
    </svg>
  );
}
