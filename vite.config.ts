import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { isoImport } from 'vite-plugin-iso-import';

export default defineConfig({
	optimizeDeps: { include: ['lodash.get', 'lodash.isequal', 'lodash.clonedeep'] },
	plugins: [isoImport(), sveltekit()]
});
