import type { Preview } from '@storybook/vue3';

import '../../preview.css';

const preview: Preview = {
  decorators: [
    (story, context) => {
      const configuredBackground = context.parameters.backgrounds?.default;
      const activeBackground = context.globals.backgrounds?.value;
      document.body.classList.toggle(
        'dark-mode',
        configuredBackground === 'dark' || activeBackground === 'dark',
      );
      const scheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      document.documentElement.style.colorScheme = scheme;
      document.body.style.colorScheme = scheme;

      return story();
    },
  ],
  parameters: {
    layout: 'fullscreen',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    options: {
      storySort: {
        order: [
          '1. Basic',
          '2. Data Display',
          '3. Data Entry',
          '4. Feedback',
          '5. Form',
          '6. Layout',
          '7. Navigation',
          '8. Overlayer',
          'Internal',
        ],
      },
    },
  },
};

export default preview;
