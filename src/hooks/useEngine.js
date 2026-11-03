import { useEffect, useLayoutEffect, useRef } from "react";
import { addScene, addTicker, onMeasure } from "../engine/scrollEngine";

/*
  Registration uses layout effects on purpose: when a page unmounts, its scenes and tickers are
  removed synchronously in the same commit, so no animation frame can run against detached refs.
*/

/**
 * Registers a pinned scroll scene.
 * Attach sceneRef to the tall <section> and stageRef to its sticky stage.
 * render(progress, scene, now) runs every frame while the scene is near the viewport.
 */
export function useScene(render) {
  const sceneRef = useRef(null);
  const stageRef = useRef(null);
  const renderRef = useRef(render);
  renderRef.current = render;

  useLayoutEffect(
    () =>
      addScene({
        el: sceneRef.current,
        stage: stageRef.current,
        render: (p, s, now) => { if (sceneRef.current) renderRef.current(p, s, now); },
      }),
    []
  );
  return { sceneRef, stageRef };
}

/** Runs fn(now, dt, scrollY) every animation frame. */
export function useTicker(fn) {
  const ref = useRef(fn);
  ref.current = fn;
  useLayoutEffect(() => addTicker((now, dt, y) => ref.current(now, dt, y)), []);
}

/** Runs fn after every layout measure (load, resize, fonts ready). */
export function useOnMeasure(fn) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => onMeasure(() => ref.current()), []);
}
