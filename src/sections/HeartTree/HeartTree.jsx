import { useMemo, useRef } from "react";
import "./HeartTree.css";
import { config, nick } from "../../config";
import { useScene } from "../../hooks/useEngine";
import { HEART, reducedMotion } from "../../lib/heart";
import { clamp, easeBack, easeInOut, easeOut, seg } from "../../lib/math";
import { BRANCHES, makeLeaves } from "./treeData";

const SVG_NS = "http://www.w3.org/2000/svg";

/** A golden tree draws itself, then blooms into a heart of tiny hearts; petals keep drifting down. */
export default function HeartTree() {
  const leaves = useMemo(makeLeaves, []);
  const branchRefs = useRef([]);
  const leafRefs = useRef([]);
  const leafState = useRef(leaves.map(() => -1));
  const copyRefs = useRef([]);
  const fallGroup = useRef(null);
  const falling = useRef([]);

  const { sceneRef, stageRef } = useScene((p) => {
    const draw = seg(p, 0.04, 0.46);
    BRANCHES.forEach(([, , a, b], i) => {
      branchRefs.current[i].style.strokeDashoffset = (1 - easeInOut(seg(draw, a, b))).toFixed(4);
    });

    const bloom = seg(p, 0.38, 0.84);
    leaves.forEach((l, i) => {
      const k = clamp((bloom - l.at) / 0.1);
      if (Math.abs(k - leafState.current[i]) < 0.002) return;
      leafState.current[i] = k;
      const sc = easeBack(k) * l.s;
      leafRefs.current[i].setAttribute("transform", `translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${(l.r * (1 - k * 0.4)).toFixed(1)}) scale(${sc.toFixed(3)})`);
    });

    [seg(p, 0.02, 0.12), seg(p, 0.52, 0.66), seg(p, 0.7, 0.8)].forEach((k, i) => {
      const el = copyRefs.current[i];
      if (!el) return;
      el.style.opacity = easeOut(k);
      el.style.transform = `translateY(${(1 - easeOut(k)) * 30}px)`;
      el.style.filter = k < 1 ? `blur(${(1 - k) * 8}px)` : "none";
    });

    // falling petals once the bloom is complete
    const list = falling.current;
    if (bloom > 0.95 && !reducedMotion && list.length < 9 && Math.random() < 0.03) {
      const src = leaves[Math.floor(Math.random() * leaves.length)];
      const el = document.createElementNS(SVG_NS, "use");
      el.setAttribute("href", "#lf");
      el.setAttribute("fill", src.col);
      fallGroup.current.appendChild(el);
      list.push({ el, x: src.x, y: src.y, vy: 0.6 + Math.random() * 0.6, ph: Math.random() * 6, s: src.s * 0.9, r: src.r, life: 0 });
    }
    for (let i = list.length - 1; i >= 0; i--) {
      const f = list[i];
      f.life++; f.y += f.vy; f.x += Math.sin(f.life * 0.03 + f.ph) * 0.8; f.r += Math.sin(f.life * 0.02 + f.ph) * 1.2;
      const op = f.y > 640 ? Math.max(0, 1 - (f.y - 640) / 80) : 1;
      f.el.setAttribute("transform", `translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) rotate(${f.r.toFixed(1)}) scale(${f.s.toFixed(2)})`);
      f.el.setAttribute("opacity", op.toFixed(2));
      if (op <= 0) { f.el.remove(); list.splice(i, 1); }
    }
  });

  return (
    <section className="scene tree" data-ch="tree" ref={sceneRef} style={{ "--len": "380vh" }}>
      <div className="stage" ref={stageRef}>
        <div className="tree-copy">
          <p className="eyebrow" ref={(el) => (copyRefs.current[0] = el)}>it's officially your day</p>
          <h2 ref={(el) => (copyRefs.current[1] = el)}>
            Happy Birthday,<br /><span className="name-ink">{nick(1)}</span>
          </h2>
          {config.age != null && (
            <p className="age-line" ref={(el) => (copyRefs.current[2] = el)}>
              and just like that, you're <b>{config.age}</b> &#10022;
            </p>
          )}
        </div>

        <svg className="tree-svg" viewBox="0 40 600 690" aria-hidden="true">
          <defs>
            <linearGradient id="bark" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
              <stop offset="0" stopColor="#ffd99a" /><stop offset=".6" stopColor="#e3a46a" /><stop offset="1" stopColor="#a8664a" />
            </linearGradient>
            <path id="lf" d={HEART} />
          </defs>
          <g className="branches">
            {BRANCHES.map(([d, w], i) => (
              <path key={i} d={d} strokeWidth={w} pathLength="1" ref={(el) => (branchRefs.current[i] = el)} />
            ))}
          </g>
          <g>
            {leaves.map((l, i) => (
              <use key={i} href="#lf" fill={l.col} opacity={l.opacity} transform={`translate(${l.x} ${l.y}) scale(0)`}
                ref={(el) => (leafRefs.current[i] = el)} />
            ))}
          </g>
          <g ref={fallGroup} />
        </svg>
      </div>
    </section>
  );
}
