import { useState } from "react";
import "./Gate.css";
import CodeLock from "./CodeLock";
import HoldHeart from "./HoldHeart";

/** Full-screen entrance: secret code first, then press-and-hold the heart. */
export default function Gate({ opened, onOpen }) {
  const [unlocked, setUnlocked] = useState(false);
  return (
    <div className={`gate${opened ? " gone" : ""}`} aria-hidden={opened || undefined}>
      <div className="gate-stack">
        <CodeLock hidden={unlocked} onUnlock={() => setUnlocked(true)} />
        <HoldHeart shown={unlocked} enabled={unlocked && !opened} onComplete={onOpen} />
      </div>
    </div>
  );
}
