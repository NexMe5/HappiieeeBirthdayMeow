import { useEffect, useRef, useState } from "react";
import { config } from "../../config";
import { burstHearts } from "../../engine/fx";

const CODE = String(config.code);
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", null, "0", "del"];

/** Passcode screen. Calls onUnlock() once the right code is entered. */
export default function CodeLock({ hidden, onUnlock }) {
  const [entry, setEntry] = useState("");
  const [status, setStatus] = useState("idle"); // idle | ok | bad
  const [wrong, setWrong] = useState(0);
  const [pressed, setPressed] = useState(null);
  const slotsRef = useRef(null);
  const statusRef = useRef(status);
  statusRef.current = status;

  const press = (k) => {
    if (statusRef.current !== "idle") return;
    setPressed(k);
    setTimeout(() => setPressed((p) => (p === k ? null : p)), 140);
    setEntry((e) => (k === "del" ? e.slice(0, -1) : e.length >= CODE.length ? e : e + k));
  };

  // physical keyboard
  useEffect(() => {
    if (hidden) return;
    const onKey = (e) => {
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === "Backspace") press("del");
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [hidden]);

  // check once all digits are in
  useEffect(() => {
    if (status !== "idle" || entry.length !== CODE.length) return;
    const t = setTimeout(() => {
      if (entry === CODE) {
        setStatus("ok");
        const r = slotsRef.current.getBoundingClientRect();
        burstHearts(r.left + r.width / 2, r.top + r.height / 2, 14);
      } else {
        setStatus("bad");
        setWrong((w) => w + 1);
        navigator.vibrate?.(120);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [entry, status]);

  // after the result animation
  useEffect(() => {
    if (status === "ok") { const t = setTimeout(onUnlock, 700); return () => clearTimeout(t); }
    if (status === "bad") { const t = setTimeout(() => { setStatus("idle"); setEntry(""); }, 600); return () => clearTimeout(t); }
  }, [status]);

  const msg =
    status === "ok" ? "there you are"
    : wrong > 0 ? (wrong >= 3 && config.codeHint ? `hint: ${config.codeHint}` : "not quite, try again")
    : "only you would know it";

  return (
    <div className={`lock${hidden ? " off" : ""}`} role="group" aria-label="Enter the secret code">
      <p className="eyebrow">locked, just for you</p>
      <p className="gate-title">Enter our secret code</p>
      <div ref={slotsRef} className={`slots${status === "ok" ? " ok" : ""}${status === "bad" ? " bad" : ""}`} aria-hidden="true">
        {[...CODE].map((_, i) => <span key={i} className={i < entry.length ? "on" : ""} />)}
      </div>
      <p className={`lock-msg${wrong > 0 && status !== "ok" ? " bad" : ""}`} aria-live="polite">{msg}</p>
      <div className="keypad">
        {KEYS.map((k, i) =>
          k === null ? (
            <span key={i} className="key spacer" aria-hidden="true" />
          ) : (
            <button
              key={k}
              type="button"
              className={`key${k === "del" ? " ghost" : ""}${pressed === k ? " press" : ""}`}
              aria-label={k === "del" ? "Delete last digit" : undefined}
              tabIndex={hidden ? -1 : 0}
              onClick={() => press(k)}
            >
              {k === "del" ? "Delete" : k}
            </button>
          )
        )}
      </div>
    </div>
  );
}
