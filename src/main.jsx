import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import App from "./App";

/* Every visit starts at the lock: no remembered scroll, no #links, no back/forward-cache restore. */
document.documentElement.classList.add("locked");
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
if (location.hash) history.replaceState(null, "", location.pathname + location.search);
window.scrollTo(0, 0);
window.addEventListener("pageshow", (e) => { if (e.persisted) location.reload(); });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
