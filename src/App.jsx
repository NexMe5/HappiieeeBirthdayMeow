import { memo, useCallback, useEffect, useRef, useState } from "react";
import { config } from "./config";
import { measure, startEngine } from "./engine/scrollEngine";
import { burstHearts, confetti, firework, fxState } from "./engine/fx";
import { music } from "./engine/music";
import { HEART } from "./lib/heart";

import { Sky, FxCanvas } from "./components/Sky/Sky";
import { Cursor, ProgressRail, SoundToggle } from "./components/Chrome/Chrome";
import Gate from "./components/Gate/Gate";

import Hero from "./sections/Hero/Hero";
import WordsReveal from "./sections/WordsReveal/WordsReveal";
import HeartTree from "./sections/HeartTree/HeartTree";
import WishCake from "./sections/WishCake/WishCake";
import Reasons from "./sections/Reasons/Reasons";
import MemoryLane from "./sections/MemoryLane/MemoryLane";
import Letter from "./sections/Letter/Letter";
import UsStack from "./sections/UsStack/UsStack";
import Finale from "./sections/Finale/Finale";
import Corner from "./pages/Corner/Corner";

/** The story, chapter by chapter. Memoised so opening the gate never re-renders the scenes. */
const Story = memo(function Story({ onExplore }) {
  return (
    <>
      <Hero />
      <WordsReveal />
      <HeartTree />
      <WishCake />
      <Reasons />
      <MemoryLane />
      <Letter />
      <UsStack onExplore={onExplore} />
      <Finale />
    </>
  );
});

const nextFrame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export default function App() {
  const [opened, setOpened] = useState(false);
  const [view, setView] = useState("story"); // "story" | "corner"
  const [curtain, setCurtain] = useState(false);
  const switching = useRef(false);

  useEffect(() => {
    startEngine();
    document.title = `Happy Birthday ${config.name} ${config.emoji || ""}`.trim();
  }, []);

  // unlock the page once she's through the gate
  useEffect(() => {
    document.body.classList.toggle("is-open", opened);
    document.documentElement.classList.toggle("locked", !opened);
    if (opened) setTimeout(measure, 50);
  }, [opened]);

  // the sky changes colour with each chapter (re-observed whenever the page changes)
  useEffect(() => {
    document.body.dataset.ch = view === "corner" ? "corner" : "hero";
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) document.body.dataset.ch = e.target.dataset.ch; }),
      { rootMargin: "-45% 0px -45% 0px" }
    );
    document.querySelectorAll("main [data-ch]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [view]);

  // taps leave little hearts everywhere, and fireworks at the finale
  useEffect(() => {
    if (!opened) return;
    const onTap = (e) => {
      if (e.target.closest("button, a, .paper, .lightbox")) return;
      if (fxState.finaleOn) firework(e.clientX, e.clientY);
      else burstHearts(e.clientX, e.clientY, 7);
    };
    document.addEventListener("pointerdown", onTap);
    return () => document.removeEventListener("pointerdown", onTap);
  }, [opened]);

  /** Fade to the night curtain, swap pages, land at the right scroll position, fade back in. */
  const goTo = useCallback(async (next, { push = true } = {}) => {
    if (switching.current) return;
    switching.current = true;
    setCurtain(true);
    await wait(560);
    fxState.finaleOn = false;
    setView(next);
    if (push && next === "corner") history.pushState({ view: "corner" }, "", "#corner");
    await nextFrame();
    if (next === "corner") {
      window.scrollTo(0, 0);
    } else {
      // come back to the end of the collage, right where she left
      measure();
      const us = document.querySelector('main [data-ch="us"]');
      if (us) window.scrollTo(0, us.getBoundingClientRect().top + window.scrollY + us.offsetHeight - window.innerHeight);
    }
    measure();
    await wait(120);
    setCurtain(false);
    if (next === "corner") burstHearts(window.innerWidth / 2, window.innerHeight * 0.35, 18);
    switching.current = false;
  }, []);

  // opening the corner starts the song from her wish (inside the tap, so phones allow the sound)
  const openCorner = useCallback(() => {
    music.playWish({ from: config.corner.songFrom ?? 0 });
    goTo("corner");
  }, [goTo]);
  const backToStory = useCallback(() => {
    if (history.state?.view === "corner") history.back(); // popstate below does the switch
    else goTo("story", { push: false });
  }, [goTo]);

  // browser / phone back button
  useEffect(() => {
    const onPop = () => goTo(history.state?.view === "corner" ? "corner" : "story", { push: false });
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [goTo]);

  const handleOpen = (rect) => {
    const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
    burstHearts(x, y, 26);
    confetti(x, y, 60, 1.6);
    if (config.music) music.start();
    setOpened(true);
  };

  return (
    <>
      <Sky />
      <FxCanvas />
      <Cursor />
      <Gate opened={opened} onOpen={handleOpen} />
      <ProgressRail />
      <SoundToggle />
      <main inert={!opened}>
        {view === "story" ? <Story onExplore={openCorner} /> : <Corner onBack={backToStory} />}
      </main>
      <div className={`page-curtain${curtain ? " on" : ""}`} aria-hidden="true">
        <svg viewBox="-11 -13 22 20"><path d={HEART} /></svg>
      </div>
    </>
  );
}
