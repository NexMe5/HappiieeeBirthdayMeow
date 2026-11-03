import { useEffect, useRef, useState } from "react";

/**
 * One scrapbook item: a taped photo or a looping muted video with a handwritten caption.
 * Rises into place the first time it scrolls into view; videos only play while visible.
 */
export default function MediaCard({ item, index, onOpen }) {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setSeen(true);
        const v = videoRef.current;
        if (!v || !item.src) return;
        if (e.intersectionRatio > 0.5) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: [0, 0.15, 0.5, 0.8] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [item.src]);

  const tilt = ((index * 37) % 7) - 3; // -3..3 degrees, stable per card
  const isVideo = item.type === "video";

  return (
    <figure
      ref={ref}
      className={`scrap${seen ? " in" : ""}${isVideo ? " is-video" : ""}`}
      style={{ "--tilt": `${tilt * 0.6}deg`, "--delay": `${(index % 3) * 90}ms` }}
    >
      <span className="tape" aria-hidden="true" />
      <button type="button" className="scrap-media" onClick={() => onOpen(index)} aria-label={`Open ${isVideo ? "video" : "photo"}: ${item.caption}`}>
        {isVideo && item.src ? (
          <video ref={videoRef} src={item.src} poster={item.poster || undefined} muted loop playsInline preload="metadata" />
        ) : (
          <img src={item.url} alt={item.caption} draggable="false" decoding="async" loading="lazy" />
        )}
        {isVideo && <span className="play-badge" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>{item.src ? "tap for sound" : "your video here"}</span>}
        {!isVideo && item.isPlaceholder && <span className="ph-tag">your photo here</span>}
      </button>
      <figcaption>{item.caption}</figcaption>
    </figure>
  );
}
