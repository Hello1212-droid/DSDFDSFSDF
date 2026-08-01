import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "katex/dist/katex.min.css";

const el = document.getElementById("root")!;
createRoot(el).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
