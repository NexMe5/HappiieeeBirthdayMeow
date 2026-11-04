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

  // After she blows out the candles: "Listen to Nandini's wish" plays this audio once (the Happy Birthday
  // music box stops for good). Her words show as subtitles; at `revealAt` seconds (right after
  // "I wish you were here") the cake disappears, your photo comes to the front and the fireworks start.
  // When it ends, the button becomes "Listen again".
  wish: {
    button: "Listen to Nandini's wish",
    again: "Listen again",
    audio: "audio/nandini-wish.m4a",
    photo: "photos/Our/usforever.webp",
    title: "Nandini's wish",
    line: "you wished I was there… so here I am",
    revealAt: 4.9,
    // seconds in the audio
    subtitles: [
      { at: 0.0, end: 1.9, text: "Kuch nahi yaar…" },
      { at: 2.0, end: 3.6, text: "Just having a boring day" },
      { at: 4.0, end: 5.4, text: "I wish you were here" },
      { at: 5.5, end: 6.9, text: "Aacha??" },
      { at: 7.5, end: 9.4, text: "To aa jao building ke niche" },
      { at: 9.5, end: 11.6, text: "Mai wait kar raha hun" },
    ],
  },

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

  // After the letter: one favourite photo of you two, then the button that opens "the cutest corner".
  // focus (optional) moves the polaroid crop, e.g. "50% 30%".
  usEyebrow: "and this one is my favourite",
  usTitle: "Us, so far",
  usPhoto: { src: "photos/Our/us3.webp", caption: "fairy lights, but you outshine them", focus: "50% 45%" },
  usNote: "some moments were too cute to fit on one page…",
  usCta: "Explore the cutest corner of Mau & Boka",

  // "The cutest corner of Mau & Boka": its own scroll story.
  //   1. walk through your photos (they fly past you)   2. the videos, cinema-style   3. every photo forms a heart
  corner: {
    eyebrow: "a little place, just for us",
    // the song from her wish starts playing when this page opens (seconds into the wish audio, right after the talking)
    songFrom: 16.5,
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
    // ratio: width / height of the video. They play muted with the song behind them.
    videos: [
      { src: "photos/Our/us-walk.mp4", poster: "photos/Our/us-walk-poster.webp", ratio: 720 / 1280, caption: "our main character walk" },
      { src: "photos/Our/eyes-for-u.mp4", poster: "photos/Our/eyes-for-u-poster.webp", ratio: 848 / 478, caption: "my eyes always look for you" },    ],
    heartLine: "every page, still being written",
    outro: "more pages coming, every single year",
  },

  // The letter is read aloud: once it opens, this audio plays and each line writes itself word by word
  // while it's being said. `at` / `end` are seconds in the audio; `br` starts a new paragraph after the line.
  letter: {
    audio: "audio/love-letter.m4a",
    hint: "turn your sound on",
    lines: [
      { at: 0.5, end: 3.0, text: "To begin with, I love you," },
      { at: 4.0, end: 5.3, text: "with a depth and passion" },
      { at: 5.5, end: 7.8, text: "that I have felt for no one else in this life." },
      { at: 8.5, end: 12.6, text: "And if it astonishes you, it astonishes me as well.", br: true },
      { at: 13.5, end: 14.3, text: "You are beautiful," },
      { at: 14.5, end: 15.3, text: "giving," },
      { at: 15.5, end: 19.2, text: "gentle, idiotically and deliciously feminine," },
      { at: 20.3, end: 21.0, text: "sexy," },
      { at: 21.5, end: 24.6, text: "wonderfully intelligent and wonderfully silly as well.", br: true },
      { at: 26.0, end: 28.6, text: "I want nothing else in this life than to be with you," },
      { at: 29.5, end: 31.2, text: "to listen and watch you," },
      { at: 32.0, end: 34.2, text: "your beautiful voice, your beauty," },
      { at: 35.0, end: 37.2, text: "to argue with you, to laugh with you," },
      { at: 38.0, end: 40.2, text: "to show you things and share things with you," },
      { at: 40.5, end: 42.6, text: "to explore your magnificent mind." },
    ],
  },
};

export const nicknames = config.nicknames?.length ? config.nicknames : [config.name];
export const nick = (i) => nicknames[i % nicknames.length];
