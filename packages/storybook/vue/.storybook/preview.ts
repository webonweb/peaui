import type { Preview } from '@storybook/vue3';

import '../../preview.css';

const preview: Preview = {
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
