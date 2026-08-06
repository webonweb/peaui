import type { Preview } from "@storybook/web-components-vite";

import "../../../library/src/styles.scss";
import "../../preview.css";

const preview: Preview = {
  parameters: {
    layout: "padded",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
