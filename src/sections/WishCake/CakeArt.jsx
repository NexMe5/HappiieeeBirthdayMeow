import { HEART } from "../../lib/heart";

/** The two-tier cake drawing. Flames are exposed through flameRefs so the scene can light them. */
export default function CakeArt({ svgRef, flameRefs, onClick }) {
  const flame = (i, cx, top, delay) => (
    <g className="flame" ref={(el) => (flameRefs.current[i] = el)}>
      <circle cx={cx} cy={top + 16} r="22" fill="url(#flameGlow)" />
      <g className="flame-inner" style={delay ? { animationDelay: delay } : undefined}>
        <path d={`M${cx} ${top} C ${cx + 6} ${top + 10} ${cx + 8} ${top + 16} ${cx + 5} ${top + 22} C ${cx + 3} ${top + 27} ${cx - 3} ${top + 27} ${cx - 5} ${top + 22} C ${cx - 8} ${top + 16} ${cx - 5} ${top + 9} ${cx} ${top} Z`} fill="url(#flameG)" />
      </g>
    </g>
  );

  return (
    <svg className="cake-svg" ref={svgRef} viewBox="0 0 320 300" role="img" aria-label="A birthday cake with three candles" onClick={onClick}>
      <defs>
        <radialGradient id="flameG" cx=".5" cy=".7" r=".7"><stop offset="0" stopColor="#fff8e0" /><stop offset=".45" stopColor="#ffd27a" /><stop offset="1" stopColor="#ff7a3c" /></radialGradient>
        <radialGradient id="flameGlow"><stop offset="0" stopColor="#ffcf7a" stopOpacity=".55" /><stop offset="1" stopColor="#ffcf7a" stopOpacity="0" /></radialGradient>
        <linearGradient id="tier1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f7c3cf" /><stop offset="1" stopColor="#e99bb0" /></linearGradient>
        <linearGradient id="tier2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ee93ab" /><stop offset="1" stopColor="#d56d8d" /></linearGradient>
        <pattern id="stripes" width="9" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <rect width="9" height="10" fill="#fff6ee" /><rect width="9" height="4" fill="#ec7c98" />
        </pattern>
        <path id="cakeHeart" d={HEART} />
      </defs>
      <ellipse cx="160" cy="272" rx="148" ry="18" fill="rgba(0,0,0,.35)" />
      <ellipse cx="160" cy="266" rx="138" ry="16" fill="#efe2d4" />
      <ellipse cx="160" cy="263" rx="138" ry="13" fill="#fbf3ea" />
      <rect x="46" y="168" width="228" height="96" rx="14" fill="url(#tier1)" />
      <path d="M46 182 Q46 168 60 168 L260 168 Q274 168 274 182 L274 192 Q266 204 258 192 Q250 210 240 194 Q230 200 222 190 Q212 214 202 194 Q192 202 184 192 Q174 210 164 194 Q154 202 146 190 Q136 212 126 194 Q116 202 108 192 Q98 208 88 192 Q78 200 70 190 Q60 210 52 194 Q48 190 46 188 Z" fill="#fff4ea" />
      <g fill="#fff" opacity=".9">
        {[64, 84, 104, 124, 144, 164, 184, 204, 224, 244, 260].map((x, i) => (
          <circle key={x} cx={x} cy={[252, 254, 255, 256, 256, 256, 256, 255, 254, 253, 251][i]} r="4" />
        ))}
      </g>
      <rect x="84" y="104" width="152" height="70" rx="12" fill="url(#tier2)" />
      <path d="M84 116 Q84 104 96 104 L224 104 Q236 104 236 116 L236 124 Q228 136 220 124 Q212 140 202 126 Q194 132 186 122 Q176 142 166 126 Q158 132 150 122 Q140 140 130 126 Q122 132 114 122 Q104 138 96 124 Q90 128 84 122 Z" fill="#fff4ea" />
      <g fill="#c2335b">
        <use href="#cakeHeart" transform="translate(120 152) scale(.55)" />
        <use href="#cakeHeart" transform="translate(160 156) scale(.6)" />
        <use href="#cakeHeart" transform="translate(200 152) scale(.55)" />
      </g>
      <rect x="116" y="58" width="10" height="48" rx="3" fill="url(#stripes)" />
      <rect x="155" y="50" width="10" height="56" rx="3" fill="url(#stripes)" />
      <rect x="194" y="58" width="10" height="48" rx="3" fill="url(#stripes)" />
      <g stroke="#3a2230" strokeWidth="1.6" strokeLinecap="round"><path d="M121 58 v-5" /><path d="M160 50 v-5" /><path d="M199 58 v-5" /></g>
      {flame(0, 121, 22)}
      {flame(1, 160, 14, "-.3s")}
      {flame(2, 199, 22, "-.6s")}
      <g className="smoke">
        <path d="M121 50 c -6 -8 6 -14 0 -24 s 6 -14 0 -22" />
        <path d="M160 42 c 6 -8 -6 -14 0 -24 s -6 -14 0 -22" />
        <path d="M199 50 c -6 -8 6 -14 0 -24 s 6 -14 0 -22" />
      </g>
    </svg>
  );
}
