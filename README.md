# Happy Birthday Mau 🐱

A scroll-driven birthday story in React + Vite: code lock → hold-the-heart → hero → glowing words →
heart tree → make-a-wish cake → balloon reasons → polaroid memory lane → letter → fireworks.

## Run it

Needs Node.js 18 or newer.

```bash
npm install
npm run dev        # http://localhost:5173  (also prints a Network URL to open on your phone)
npm run build      # production build in dist/
npm run preview    # check the production build locally
```

## Make it hers

Everything editable is in **`src/config.js`**: her name, emoji, pet names, age, secret code, reasons,
letter, captions and photos.

### Photos and videos

| Where it shows | Folder | Config |
|---|---|---|
| "The many moods of Nandini" (her funny photos, after the reasons) | `public/photos/Cute/` | `memories` |
| "Us, so far" collage (after the letter, ends with the "Explore…" button) | `public/photos/Our/` | `us` |
| "The cutest corner of Mau & Boka" (its own scroll story: photos + videos) | `public/photos/Our/` | `corner.photos`, `corner.videos` |

1. Put files in the right folder (photos: jpg / png / webp under ~500 KB; videos: mp4, ideally under ~8 MB).
2. In `src/config.js`, set `src: "photos/Cute/your-file.webp"` and a `caption`.
   Videos: compress to mp4 (H.264) and add a `poster` image and `ratio` (width / height).
3. Faces getting cropped? Add `focus: "50% 20%"` (horizontal% vertical%) to move the crop.

Add or remove entries freely; each section gets longer or shorter by itself.
Original, uncompressed photos are kept in `photos-original/` (outside `public/`, so they aren't deployed).

### The corner page
The "Explore the cutest corner of Mau & Boka" button switches to a second scroll story inside the same app
(URL shows `#corner`; the phone's back button returns to the collage; refreshing starts again at the lock):

1. **The walk**: the title sits in front of you; scrolling flies you through it and past every photo in `corner.photos`.
2. **Cinema**: each video in `corner.videos` grows from a tilted card into a big frame and plays muted;
   "play with sound" opens it full screen and pauses the music box. Set `ratio` to the video's width / height.
3. **The heart**: every photo flies in from the sky and forms one big heart around "Mau & Boka".

Tap any photo to open it full screen (swipe or arrow keys to move).

## Deploy (free)

- **Vercel**: push to GitHub → "Import Project" on vercel.com → Framework: Vite. Or run `npx vercel` in this folder.
- **Netlify**: `npm run build`, then drag the `dist` folder onto app.netlify.com/drop.

The secret code only lives in the page's JavaScript, so it's a cute lock, not real security.
Don't put anything truly private in here.

## Structure

```
src/
  config.js                 everything about her (edit this)
  App.jsx                   gate + story chapters + page switch to the corner
  engine/
    scrollEngine.js         one rAF loop: sticky scenes, smoothed progress, tickers
    fx.js                   particle canvas: hearts, confetti, shards, fireworks
    music.js                WebAudio music box (no audio files)
  hooks/useEngine.js        useScene / useTicker / useOnMeasure
  components/
    Gate/                   CodeLock + HoldHeart
    Sky/                    atmosphere, stars, grain, fx canvas
    Chrome/                 progress rail, sound toggle, cursor
  sections/                 one folder per chapter (Hero, WordsReveal, HeartTree, WishCake,
                            Reasons, MemoryLane, Letter, UsStack, Finale), each with its own CSS
  pages/Corner/             "cutest corner" page: Tunnel, Cinema, HeartMosaic, Lightbox
  styles/global.css         tokens, base styles, sticky scene primitive
```

How a chapter animates: each one is a tall `<section class="scene">` with a sticky 100svh
`.stage`. `useScene(render)` gives it a scroll progress from 0 to 1, and `render` writes transforms
straight to DOM refs, so React never re-renders while she scrolls.
