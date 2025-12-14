import App from "@/App.tsx";
import { Provider } from "@/components/ui/provider.tsx";
import { Toaster } from "@/components/ui/toaster.tsx";
import { raise } from "@/utils/core.ts";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const rootEl =
  document.getElementById("root") ?? raise(new Error("No root element found!"));

createRoot(rootEl).render(
  <StrictMode>
    <Provider>
      <App />
      <Toaster />
    </Provider>
  </StrictMode>
);
