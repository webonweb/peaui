import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming/create";

import logo from "../public/peaui-logo.png";

const theme = create({
  base: "light",
  brandTitle: "PEAUI — Web Components",
  brandImage: logo,
  brandTarget: "_self",
  colorPrimary: "#3f8205",
  colorSecondary: "#3f8205",
  barSelectedColor: "#3f8205",
  barHoverColor: "#3f8205",
});

addons.setConfig({ theme });
