import { createApp } from 'vue';

import 'vue-advanced-cropper/dist/style.css';
import '../../library/src/styles.scss';
import './styles/main.css';
import App from './App.vue';
import { initializeLocale } from './i18n';
import { router } from './router';

initializeLocale();
createApp(App).use(router).mount('#app');
