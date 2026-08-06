import type { StorybookConfig } from "@storybook/vue3-webpack5";
import path from 'node:path';

const svgPattern = /\.svg$/i;
const svgComponentQuery = /component/;

function excludeSvgFromRules(rules: any[] = []) {
  for (const rule of rules) {
    if (Array.isArray(rule?.oneOf)) {
      excludeSvgFromRules(rule.oneOf);
    }

    if (!(rule?.test instanceof RegExp) || !rule.test.test('.svg')) {
      continue;
    }

    if (!rule.exclude) {
      rule.exclude = [svgPattern];
      continue;
    }

    if (Array.isArray(rule.exclude)) {
      rule.exclude = [...rule.exclude, svgPattern];
      continue;
    }

    rule.exclude = [rule.exclude, svgPattern];
  }
}

const config: StorybookConfig = {
  framework: "@storybook/vue3-webpack5",
  stories: ["../../../library/src/components/**/*.vue.stories.@(js|ts|mdx)"],
  addons: ["@storybook/addon-essentials"],
  staticDirs: ["../public"],

  webpackFinal: async (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, '../../../library/src'),
      '@components': path.resolve(__dirname, '../../../library/src//components'),
      '@assets': path.resolve(__dirname, '../../../library/src//assets'),
    }

    config.module ??= { rules: [] };
    config.module.rules ??= [];

    excludeSvgFromRules(config.module.rules);

    config.module.rules.push({
      test: svgPattern,
      resourceQuery: svgComponentQuery,
      use: [
        'vue-loader',
        'vue-svg-loader',
      ],
    });

    config.module.rules.push({
      test: svgPattern,
      resourceQuery: {
        not: [svgComponentQuery],
      },
      type: 'asset/resource',
    });

    config.module.rules.push({
      test: /\.s[ac]ss$/i,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: { sourceMap: true },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            additionalData: `@use "@assets/mixins.scss" as *;`,
          },
        },
      ],
    });

    return config
  },
};

export default config;
