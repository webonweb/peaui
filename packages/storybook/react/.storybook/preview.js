import '../../../library/src/styles.scss';
import '../../preview.css';

const preview = {
  decorators: [
    (Story, context) => {
      const configuredBackground = context.parameters.backgrounds?.default;
      const activeBackground = context.globals.backgrounds?.value;
      document.body.classList.toggle(
        'dark-mode',
        configuredBackground === 'dark' || activeBackground === 'dark',
      );

      return Story();
    },
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { expanded: true, sort: 'requiredFirst' },
    layout: 'fullscreen',
  },
};

export default preview;
