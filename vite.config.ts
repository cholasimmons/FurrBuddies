import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { isoImport } from 'vite-plugin-iso-import';

/** @type {import('vite').UserConfig} */
export default defineConfig({
	optimizeDeps: { include: ['lodash.get', 'lodash.isequal', 'lodash.clonedeep'] },
	plugins: [isoImport(), sveltekit()],
	ssr: {
		noExternal:
			process.env.NODE_ENV === 'production'
			? ['@carbon/charts', 'carbon-components']
			: [],
	},
});
