import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$lib: './src/lib'
		}
	},
	vitePlugin: {
		inspector: true
	}
};

export default config;