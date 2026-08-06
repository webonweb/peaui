import 'vue-advanced-cropper/dist/style.css';
import '../../../library/src/styles.scss';
import '../../preview.css';

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { expanded: true, sort: 'requiredFirst' },
    layout: 'fullscreen',
  },
};

export default preview;
