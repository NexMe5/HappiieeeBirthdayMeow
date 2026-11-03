import { forwardRef } from "react";

export const BALLOON_COLORS = [
  ["#ffd3de", "#ec7c98", "#a8264f"],
  ["#ffe6b8", "#f6c978", "#b97a2c"],
  ["#ead9ff", "#b49bf0", "#6a4cc0"],
  ["#c9f3ee", "#6fd0c4", "#2a8a82"],
  ["#ffd6c4", "#ff9a7a", "#c4503a"],
  ["#ffe0ea", "#f39ab4", "#b03a64"],
];

/** A glossy balloon on a string. colors = [highlight, body, shadow]. */
const Balloon = forwardRef(function Balloon({ id, colors }, ref) {
  const [hi, body, dark] = colors;
  return (
    <div className="balloon" ref={ref}>
      <svg viewBox="0 0 120 230" width="100%">
        <defs>
          <radialGradient id={id} cx=".36" cy=".3" r=".8">
            <stop offset="0" stopColor={hi} /><stop offset=".55" stopColor={body} /><stop offset="1" stopColor={dark} />
          </radialGradient>
        </defs>
        <path d="M60 230 C 54 214, 68 200, 58 186 S 62 160, 60 146" fill="none" stroke="rgba(248,240,229,.55)" strokeWidth="1.3" />
        <path d="M54 148 L60 139 L66 148 Z" fill={dark} />
        <path d="M60 6 C 92 6 112 34 112 66 C 112 104 84 132 64 140 L 60 141 L 56 140 C 36 132 8 104 8 66 C 8 34 28 6 60 6 Z" fill={`url(#${id})`} />
        <ellipse cx="40" cy="40" rx="9" ry="17" fill="#fff" opacity=".38" transform="rotate(-24 40 40)" />
      </svg>
    </div>
  );
});

export default Balloon;
