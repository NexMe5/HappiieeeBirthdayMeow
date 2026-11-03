import { useMemo, useState } from "react";
import "./Corner.css";
import Tunnel from "./Tunnel";
import Cinema from "./Cinema";
import HeartMosaic from "./HeartMosaic";
import Lightbox from "./Lightbox";
import { config } from "../../config";
import { placeholderPhoto } from "../../sections/MemoryLane/placeholderPhoto";

/**
 * "The cutest corner of Mau & Boka": its own little scroll story.
 * Walk through the photos → watch the videos → every photo forms a heart.
 */
export default function Corner({ onBack }) {
  const c = config.corner;
  const photos = useMemo(
    () => c.photos.map((ph, i) => ({ type: "photo", ...ph, url: ph.src || placeholderPhoto(i + 4, 2) })),
    []
  );
  const videos = useMemo(
    () => c.videos.map((v) => ({ type: "video", ratio: 16 / 9, ...v, url: v.poster })),
    []
  );
  const [open, setOpen] = useState(null); // { list, index }
  const move = (d) => setOpen((o) => ({ ...o, index: (o.index + d + o.list.length) % o.list.length }));

  return (
    <div className="corner">
      <nav className="corner-nav">
        <button type="button" className="back-link" onClick={onBack}><span aria-hidden="true">&larr;</span> back to the story</button>
      </nav>

      <Tunnel photos={photos} onOpen={(index) => setOpen({ list: photos, index })} />
      {videos.length > 0 && <Cinema videos={videos} onOpen={(index) => setOpen({ list: videos, index })} />}
      <HeartMosaic photos={photos} onOpen={(index) => setOpen({ list: photos, index })} onBack={onBack} />

      {open && <Lightbox items={open.list} index={open.index} onClose={() => setOpen(null)} onMove={move} />}
    </div>
  );
}
