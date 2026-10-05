import path from "node:path";
import { createRequire } from "node:module";

import type { StorybookConfig } from "@storybook/vue3-vite";
import vue from "@vitejs/plugin-vue";
import { mergeConfig } from "vite";
import svgLoader from "vite-svg-loader";

const libraryRoot = path.resolve(__dirname, "../../../library");
const librarySrc = path.resolve(libraryRoot, "src");
const require = createRequire(import.meta.url);
const vueViteFrameworkPath = path.dirname(require.resolve("@storybook/vue3-vite/package.json"));

const config: StorybookConfig = {
  framework: {
    name: vueViteFrameworkPath as "@storybook/vue3-vite",
    options: {},
  },
  stories: ["../../../library/src/components/**/*.vue.stories.@(js|ts|mdx)"],
  addons: ["@storybook/addon-essentials"],
  staticDirs: ["../public"],
  viteFinal: async (config) =>
    mergeConfig(config, {
      plugins: [vue(), svgLoader()],
      resolve: {
        alias: {
          "@": librarySrc,
          "@components": path.resolve(librarySrc, "components"),
          "@assets": path.resolve(librarySrc, "assets"),
        },
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
