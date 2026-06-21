import { Global } from "@emotion/react";
import type { ReactElement } from "react";

export default function Fonts(): ReactElement {
  return (
    <Global
      styles={`
        @font-face {
          font-family: "Noto-Sans";
          font-style: normal;
          font-display: swap;
          src: url(/NotoSans.woff2) format("woff2");
        }
      `}
    />
  );
}
