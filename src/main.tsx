import App from "@/App.tsx";
import { raise } from "niall-utils";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import Fonts from "./ui/components/Fonts.js";
import { Provider } from "./ui/components/provider.js";
import { Toaster } from "./ui/components/toaster.js";

const rootEl =
  document.getElementById("root") ?? raise(new Error("No root element found!"));

createRoot(rootEl).render(
  <StrictMode>
    <Fonts />
    <Provider>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
