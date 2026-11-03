import { useEffect, useRef } from "react";
import { music } from "../../engine/music";

/**
 * Full-screen viewer. Arrow keys / swipe to move, Esc or the backdrop to close.
 * Videos play with sound here; the music box pauses meanwhile and resumes afterwards.
 */
export default function Lightbox({ items, index, onClose, onMove }) {
  const item = items[index];
  const closeRef = useRef(null);
  const startX = useRef(null);
  const musicWasOn = useRef(false);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onMove(1);
      else if (e.key === "ArrowLeft") onMove(-1);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("lightbox-open");
    return () => { document.removeEventListener("keydown", onKey); document.documentElement.classList.remove("lightbox-open"); };
  }, []);

  // pause the music box while a video with sound is open
  useEffect(() => {
    const playingVideo = item.type === "video" && item.src;
    if (playingVideo && music.isOn()) { musicWasOn.current = true; music.stop(); }
    if (!playingVideo && musicWasOn.current) { musicWasOn.current = false; music.start(); }
  }, [index]);
  useEffect(() => () => { if (musicWasOn.current) music.start(); }, []);

  const onPointerDown = (e) => { startX.current = e.clientX; };
  const onPointerUp = (e) => {
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 50) onMove(dx < 0 ? 1 : -1);
  };

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.caption} onClick={onClose}
      onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
      <figure className="lightbox-frame" onClick={(e) => e.stopPropagation()} key={index}>
        {item.type === "video" && item.src ? (
          <video src={item.src} poster={item.poster || undefined} controls autoPlay playsInline />
        ) : (
          <img src={item.url} alt={item.caption} draggable="false" />
        )}
        <figcaption>{item.caption}</figcaption>
      </figure>
      <p className="lightbox-count" aria-hidden="true">{index + 1} / {items.length}</p>
      <button ref={closeRef} type="button" className="lb-btn lb-close" aria-label="Close" onClick={onClose}>&times;</button>
      {items.length > 1 && (
        <>
          <button type="button" className="lb-btn lb-prev" aria-label="Previous" onClick={(e) => { e.stopPropagation(); onMove(-1); }}>&#8249;</button>
          <button type="button" className="lb-btn lb-next" aria-label="Next" onClick={(e) => { e.stopPropagation(); onMove(1); }}>&#8250;</button>
        </>
      )}
    </div>
  );
}
