import {
  createSystem,
  defaultBaseConfig,
  defineConfig,
} from "@chakra-ui/react";

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#E6FFFA" },
          100: { value: "#B2F5EA" },
          500: { value: "#319795" },
          600: { value: "#2C7A7B" },
          // ...
          950: { value: "#1A202C" },
        },
      },
    },
  },
});

export const system = createSystem(defaultBaseConfig, customConfig);
