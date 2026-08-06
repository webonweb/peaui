import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming/create";

import logo from "../../shell/public/peaui-ui-logo.png";

const theme = create({
  base: "light",
  brandTitle: "PEAUI UI — komponenty",
  brandImage: logo,
  brandTarget: "_self",
  colorPrimary: "#3f8205",
  colorSecondary: "#3f8205",
  appBg: "#f5f7fa",
  appContentBg: "#ffffff",
  appPreviewBg: "#f5f7fa",
  appBorderColor: "#dce3ec",
  appBorderRadius: 10,
  barBg: "#ffffff",
  barSelectedColor: "#3f8205",
  barHoverColor: "#3f8205",
  inputBg: "#ffffff",
  inputBorder: "#cbd5e1",
  inputBorderRadius: 8,
  textColor: "#172033",
  fontBase:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontCode: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
});

addons.setConfig({
  theme,
  navSize: 320,
  panelPosition: "right",
  rightPanelWidth: 420,
  sidebar: {
    showRoots: true,
  },
});
