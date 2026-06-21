import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    "html, body": {
      margin: 0,
      padding: 0,
    },
    "*": {
      fontFamily: "'Noto-Sans', sans-serif",
    },
  },
  preflight: {
    scope: ".chakra-reset",
  },
  theme: {
    semanticTokens: {
      colors: {
        primary: {
          solid: { value: "{colors.lightgreen.500}" },
          contrast: { value: "{colors.lightgreen.100}" },
          fg: { value: "{colors.lightgreen.700}" },
          muted: { value: "{colors.lightgreen.100}" },
          subtle: { value: "{colors.lightgreen.200}" },
          emphasized: { value: "{colors.lightgreen.300}" },
          focusRing: { value: "{colors.lightgreen.500}" },
          value: {
            base: "{colors.lightgreen.100}",
            _dark: "{colors.lightgreen.600}",
          },
        },
        bg: {
          DEFAULT: {
            value: {
              base: "{colors.gray.100}",
              _dark: "{colors.gray.600}",
            },
          },
          secondary: {
            value: {
              base: "{colors.gray.100}",
              _dark: "{colors.gray.600}",
            },
          },
        },
        danger: {
          value: { base: "{colors.red}", _dark: "{colors.darkred}" },
        },
        success: {
          value: { base: "{colors.green}", _dark: "{colors.darkgreen}" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
