import type { StorybookConfig } from "@storybook/react-webpack5";

const base = process.env.STORYBOOK_BASE || 'http://localhost'

const config: StorybookConfig = {
  framework: "@storybook/react-webpack5",
  stories: ["../docs/**/*.mdx"],
  staticDirs: ["../public"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-docs", "@storybook/addon-a11y"],
  refs: {
    react: {
      title: "React komponenty",
      url: process.env.STORYBOOK_BASE ? `https://github.com/webonweb/peaui${base}react` : `${base}:6006`
    },
    vue: {
      title: "Vue komponenty",
      url: process.env.STORYBOOK_BASE ? `https://github.com/webonweb/peaui${base}vue` : `${base}:6007`
    },
    wc: {
      title: "Web komponenty",
      url: process.env.STORYBOOK_BASE ? `https://github.com/webonweb/peaui${base}wc` : `${base}:6008`
    }
  },
  // webpackFinal: async (config) => {
  //   config.output = {
  //     ...config.output,
  //     publicPath: './',
  //   }
  //   return config
  // }
};

export default config;