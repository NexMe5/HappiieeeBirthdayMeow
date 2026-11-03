/* =========================================================
   EVERYTHING ABOUT HER LIVES HERE. Edit this file only.
   ========================================================= */
export const config = {
  name: "Mau",          // shown on the opening screen and the browser tab
  emoji: "🐱",          // shown next to her name on the opening screen
  from: "Boka",         // your name: signs the letter, wax-seal initial, finale note
  age: 21,              // age she's turning (null hides that line)
  music: true,          // soft music-box "Happy Birthday" once she opens it
  code: "5115",         // secret code she must enter first
  codeHint: "",         // optional hint shown after 3 wrong tries, e.g. "our special date"

  // Pet names used inside the site, in this order:
  // [hero line, tree heading, letter heading, "Dear ___," in the letter]. The finale cycles through all of them.
  nicknames: ["Chocopie", "Raasmalai", "Nandini", "Paglu BB"],

  // Words wrapped in *stars* glow gold.
  intro:
    "Before you, days were just days. Then you walked in with that laugh, and suddenly the most *ordinary* moments started to feel like something *worth remembering.*",

  reasons: [
    "The way you listen, like nothing else in the world is happening.",
    "You make bad days feel lighter without even trying.",
    "Your laugh. Especially the one you try to hide.",
    "You turn completely normal days into ones I remember.",
    "You always know what to say, and when to say nothing.",
    "You're you. Honestly, that's the whole list.",
  ],

  // Her funny photos (already cropped to polaroid shape and compressed to .webp).
  // Originals are safe in  photos-original/Cute/  (outside public/, so they don't bloat the site).
  // To add more: put a file in public/photos/Cute/ and add a line below. An empty src shows a placeholder.
  // focus (optional) moves the crop, e.g. "50% 20%".
  memoriesEyebrow: "evidence, collected with love",
  memoriesTitle: "The many moods of Nandini",
  memories: [
    { src: "photos/Cute/cute1.webp", caption: "the smile that started all of this" },
    { src: "photos/Cute/cute7.webp", caption: "too cool for this video call 😎" },
    { src: "photos/Cute/cute8.webp", caption: "do not disturb: noodles in progress" },
    { src: "photos/Cute/cute6.webp", caption: "when I say \"just 5 more minutes\"" },
    { src: "photos/Cute/cute11.webp", caption: "sleeping beauty (sound effects included)" },
    { src: "photos/Cute/cute13.webp", caption: "posing for a magazine that doesn't exist" },
    { src: "photos/Cute/cute3.webp", caption: "me and my second favourite cuddle buddy" },
    { src: "photos/Cute/cute10.webp", caption: "woke up and chose violence" },
    { src: "photos/Cute/cute12.webp", caption: "burrito mode: activated" },
    { src: "photos/Cute/cute4.webp", caption: "not lazy, just on energy-saving mode" },
    { src: "photos/Cute/cute9.webp", caption: "the \"say that again, I dare you\" face" },
    { src: "photos/Cute/cute14.webp", caption: "peekaboo, but make it a blanket" },
    { src: "photos/Cute/cute5.webp", caption: "listening to my \"one small story\" for 40 minutes" },
    { src: "photos/Cute/cute18.webp", caption: "snacks first, photos later" },
    { src: "photos/Cute/cute2.webp", caption: "pretending she isn't blushing" },
    { src: "photos/Cute/cute15.webp", caption: "knows exactly how cute she is" },
    { src: "photos/Cute/cute17.webp", caption: "main character, final scene" },
    { src: "photos/Cute/cute16.webp", caption: "the laugh I'd do anything to hear" },
  ],
  memoriesEnd: "and I love every single version of you",

  // The collage after the letter: a few of your best photos landing on a pile, ending in a button
  // that opens "the cutest corner" page. Files live in public/photos/Our/ (originals in photos-original/Our/).
  // focus (optional) moves the polaroid crop, e.g. "50% 30%".
  usEyebrow: "and these are my favourite",
  usTitle: "Us, so far",
  us: [
    { src: "photos/Our/us3.webp", caption: "fairy lights, but you outshine them", focus: "50% 45%" },
    { src: "photos/Our/us8.webp", caption: "lifting my whole world", focus: "50% 60%" },
    { src: "photos/Our/us11.webp", caption: "my favourite head rest", focus: "50% 35%" },
    { src: "photos/Our/us4.webp", caption: "she's taller (only in this photo)", focus: "50% 30%" },
    { src: "photos/Our/us19.webp", caption: "my favourite view", focus: "50% 40%" },
  ],
  usNote: "some moments were too cute to fit on one page…",
  usCta: "Explore the cutest corner of Mau & Boka",

  // "The cutest corner of Mau & Boka": its own scroll story.
  //   1. walk through your photos (they fly past you)   2. the videos, cinema-style   3. every photo forms a heart
  corner: {
    eyebrow: "a little place, just for us",
    title: "The cutest corner of",
    names: "Mau & Boka",
    intro: "scroll slowly, you're walking through us",
    photos: [
      { src: "photos/Our/us1.webp", caption: "the wall was cute, we were cuter" },
      { src: "photos/Our/us3.webp", caption: "fairy lights, but you outshine them" },
      { src: "photos/Our/us2.webp", caption: "her favourite place: leaning on me" },
      { src: "photos/Our/us6.webp", caption: "mirror selfie, flower edition" },
      { src: "photos/Our/us8.webp", caption: "lifting my whole world" },
      { src: "photos/Our/us10.webp", caption: "the way she looks at me" },
      { src: "photos/Our/us12.webp", caption: "zero chill, full love" },
      { src: "photos/Our/us7.webp", caption: "came to shop clothes, left with photos" },
      { src: "photos/Our/us13.webp", caption: "dandiya night, she won" },
      { src: "photos/Our/us4.webp", caption: "she's taller (only in this photo)" },
      { src: "photos/Our/us14.webp", caption: "accidentally matching (on purpose)" },
      { src: "photos/Our/us16.webp", caption: "late-night selfies hit different" },
      { src: "photos/Our/us18.webp", caption: "reporting for cuteness duty" },
      { src: "photos/Our/us5.webp", caption: "pink day, double the photos" },
      { src: "photos/Our/us11.webp", caption: "my favourite head rest" },
      { src: "photos/Our/usforever.webp", caption: "us, forever" },
      { src: "photos/Our/us19.webp", caption: "my favourite view" },
    ],
    videosEyebrow: "moving pictures",
    videosTitle: "Press play on us",
    // ratio: width / height of the video
    videos: [
      { src: "photos/Our/us-walk.mp4", poster: "photos/Our/us-walk-poster.webp", ratio: 720 / 1280, caption: "our main character walk" },
      { src: "photos/Our/eyes-for-u.mp4", poster: "photos/Our/eyes-for-u-poster.webp", ratio: 848 / 478, caption: "my eyes always look for you" },
    ],
    heartLine: "every page, still being written",
    outro: "more pages coming, every single year",
  },

  letter: [
    "Happy birthday, my favourite person.",
    "I still don't fully understand how someone like you walked into my life, but I'm grateful for it every single day. You make everything softer, louder, funnier and better.",
    "I hope this year gives you peace, good health, and a hundred little reasons to smile. And I promise to be one of them.",
  ],
};

export const nicknames = config.nicknames?.length ? config.nicknames : [config.name];
export const nick = (i) => nicknames[i % nicknames.length];
