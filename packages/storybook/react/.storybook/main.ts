import type { StorybookConfig } from "@storybook/react-webpack5";
import path from "node:path";

const config: StorybookConfig = {
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },

  stories: [
    "../../../library/src/components/**/*.react.stories.@(js|ts|mdx|tsx)",
  ],

  addons: ["@storybook/addon-essentials"],

  staticDirs: ["../public"],

  webpackFinal: async (config) => {
    const librarySrc = path.resolve(__dirname, "../../../library/src");

    // 1) Upewnij się, że webpack rozpoznaje TS/TSX
    config.resolve = config.resolve || {};
    config.resolve.extensions = config.resolve.extensions || [".js", ".json"];
    config.resolve.extensions.push(".ts", ".tsx");
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": librarySrc,
    };

    // 2) Dodaj regułę transpile dla plików TS/TSX z monorepo (library/src)
    config.module = config.module || { rules: [] };
    config.module.rules = config.module.rules || [];

    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      include: [librarySrc],
      use: [
        {
          loader: require.resolve("babel-loader"),
          options: {
            presets: [
              [require.resolve("@babel/preset-env"), { targets: "defaults" }],
              [
                require.resolve("@babel/preset-react"),
                { runtime: "automatic" },
              ],
              require.resolve("@babel/preset-typescript"),
            ],
          },
        },
      ],
    });

    config.module.rules.push({
      test: /\.s[ac]ss$/i,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: { sourceMap: true },
        },
        {
          loader: "sass-loader",
          options: {
            sourceMap: true,
            additionalData: `@use "@/assets/mixins.scss" as *;`,
          },
        },
      ],
    });

    return config;
  },
};

export default config;
