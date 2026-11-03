/** One heart shape used everywhere: leaves, rail marker, particles, the gate. Centred near 0,0, about 20 units wide. */
export const HEART =
  "M0 6 C -1 4.5 -10 -1 -10 -6.5 C -10 -10 -7.5 -12 -5 -12 C -2.8 -12 -1 -10.6 0 -8.6 C 1 -10.6 2.8 -12 5 -12 C 7.5 -12 10 -10 10 -6.5 C 10 -1 1 4.5 0 6 Z";

export const PALETTE = ["#ec7c98", "#f7cdd6", "#f6c978", "#ff9a7a", "#c2335b", "#ffc2a8", "#ffffff"];

export const reducedMotion =
  typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
export const finePointer = typeof matchMedia !== "undefined" && matchMedia("(pointer: fine)").matches;
