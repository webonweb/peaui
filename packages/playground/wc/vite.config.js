import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('../../library/src', import.meta.url)),
        },
        conditions: ['wc', 'browser', 'module', 'development'],
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: "@use \"@/assets/mixins.scss\" as *;",
            },
        },
    },
});
