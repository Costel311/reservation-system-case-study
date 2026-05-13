import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),

		csp: {
			directives: {
				'default-src': ['self'],
				'connect-src': ['self', 'http://localhost:3000', 'ws://localhost:5173'],
				'script-src': ['self'],
				'style-src': ['self', 'unsafe-inline'],
				'img-src': ['self', 'data:']
			}
		}
	}
};

export default config;