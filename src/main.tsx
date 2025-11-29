import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { raise } from "./utils/core.ts";

createRoot(
  document.getElementById("root") ?? raise(new Error("No root element found!"))
).render(
  <StrictMode>
    <App />
  </StrictMode>
);
