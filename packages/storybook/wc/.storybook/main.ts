import path from "node:path";

import vue from "@vitejs/plugin-vue";
import type { StorybookConfig } from "@storybook/web-components-vite";
import { mergeConfig } from "vite";
import svgLoader from "vite-svg-loader";

import { peauiVueCustomElementPlugin } from "../../../library/vue-custom-element-plugin";

const libraryRoot = path.resolve(__dirname, "../../../library");
const librarySrc = path.resolve(__dirname, "../../../library/src");

const config: StorybookConfig = {
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  stories: [
    "../stories/**/*.stories.@(js|ts|mdx)",
    "../../../library/src/components/**/*.wc.stories.@(js|ts|mdx)",
  ],
  addons: ["@storybook/addon-essentials"],
  staticDirs: ["../public"],
  viteFinal: async (config) =>
    mergeConfig(config, {
      plugins: [peauiVueCustomElementPlugin(), vue(), svgLoader()],
      optimizeDeps: {
        // `index.ce.vue` is supplied by the pre-enforced virtual-source plugin.
        // Vite's discovery scanner reads virtual Vue ids from disk before `load`,
        // so discovery must stay disabled while explicit Storybook dependencies
        // can still be prebundled.
        noDiscovery: true,
        include: ["property-expr", "tiny-case", "toposort"],
      },
      resolve: {
        alias: {
          "@": librarySrc,
          "@components": path.resolve(librarySrc, "components"),
          "@assets": path.resolve(librarySrc, "assets"),
          "@helpers": path.resolve(librarySrc, "helpers"),
          "@constants": path.resolve(librarySrc, "constants.ts"),
        },
        conditions: ["wc", "browser", "module", "development"],
      },
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `@use "@assets/mixins.scss" as *;`,
          },
        },
      },
      server: {
        fs: {
          allow: [libraryRoot, path.resolve(__dirname, "..")],
        },
      },
    }),
};

export default config;
