import svelte from 'rollup-plugin-svelte';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import iconifySvg from 'rollup-plugin-iconify-svg';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
        iconifySvg({
			targets: [{ src: 'src/components/views', dest: 'src/components/tools/icons.js' }]
		}),
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file — better for performance
			css: css => {
				css.write('bundle.css');
			}
		}),
		replace({
			// you're right, you shouldn't be injecting this
			// into a client script :)
			__AB_THRESHOLD__: process.env.AB_THRESHOLD,
			__API_MAX_BODY__: process.env.API_MAX_BODY,
			__ES_PROXY_PATH__: process.env.ES_PROXY_PATH,
			__ES_MAX_RESULTS__: process.env.ES_MAX_RESULTS,
			__BACKEND_PROXY_PATH__: process.env.BACKEND_PROXY_PATH,
			__DATAGOUV_PROXY_PATH__ : process.env.DATAGOUV_PROXY_PATH,
			__DATAGOUV_CATALOG_URL__: process.env.DATAGOUV_CATALOG_URL,
			__DATAGOUV_RESOURCES_URL__: process.env.DATAGOUV_RESOURCES_URL,
			__MITM_URL__: process.env.MITM_URL,
			__APP__: process.env.APP,
			__APP_VERSION__: process.env.APP_VERSION,
			__THEME_DNUM__: process.env.THEME_DNUM
		  }),
		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false,
		exclude:["public/build/icons.js"]
	}
};

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}
