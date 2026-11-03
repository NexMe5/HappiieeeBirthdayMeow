import { forwardRef } from "react";

/** A pegged polaroid. isPlaceholder shows a small "your photo here" tag. */
const Polaroid = forwardRef(function Polaroid({ src, caption, focus, isPlaceholder }, ref) {
  return (
    <figure className="polaroid" ref={ref}>
      <span className="peg" />
      <div className="photo">
        <img src={src} alt={caption} draggable="false" decoding="async" style={focus ? { objectPosition: focus } : undefined} />
        {isPlaceholder && <span className="ph-tag">your photo here</span>}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
});

export default Polaroid;
