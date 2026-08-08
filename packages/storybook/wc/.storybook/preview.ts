import type { Preview } from "@storybook/web-components-vite";

import "../../../library/src/styles.scss";
import "../../preview.css";

const preview: Preview = {
  decorators: [
    (story, context) => {
      const configuredBackground = context.parameters.backgrounds?.default;
      const activeBackground = context.globals.backgrounds?.value;
      document.body.classList.toggle(
        "dark-mode",
        configuredBackground === "dark" || activeBackground === "dark",
      );

      return story();
    },
  ],
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
