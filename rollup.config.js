import svelte from 'rollup-plugin-svelte';
import replace from '@rollup/plugin-replace';
import json from "@rollup/plugin-json";
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import iconifySvg from 'rollup-plugin-iconify-svg';
import { generateSW } from 'rollup-plugin-workbox';

const production = !process.env.ROLLUP_WATCH;

const options = {
	onwarn: function (warning) {
        if (warning.code === 'THIS_IS_UNDEFINED') {
			return;
		}
		console.error(warning.message);
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
			__API_EMAIL__: process.env.API_EMAIL,
			__API_MAX_BODY__: process.env.API_MAX_BODY,
			__ES_PROXY_PATH__: process.env.ES_PROXY_PATH,
			__ES_MAX_RESULTS__: process.env.ES_MAX_RESULTS,
			__BACKEND_TOKEN_USER__: process.env.BACKEND_TOKEN_USER,
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
    json(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload({ watch: "public", delay: 1000 }),
		// If we're building for production (npm run build
		// instead of npm run dev), minify
		generateSW({
			swDest: 'public/sw.js',
			cleanupOutdatedCaches: true,
			globDirectory: 'public/',
			navigateFallback: '/index.html',
			globIgnores: [ '{Geo,LinkCheck,Line,Bar}-*.js'],
			globPatterns: [
				'index.html',
				'build/module/main.js',
				'manifest.json',
				'build/module/{main,Link,Default}-*.js',
				'favicon*{png,svg}',
				'{male,female}.svg',
				'fonts/Marianne-{Bold,Regular}.woff2',
				'css/{global,dsfr.min}.css',
				'build/module/bundle.css'
			],
			navigateFallbackDenylist: [
				new RegExp(`${process.env.BACKEND_PROXY_PATH}.*`),
				new RegExp(`${process.env.DATAGOUV_PROXY_PATH}.*`)
			]
		}),
		production && terser()
	],
	watch: {
		clearScreen: false,
		exclude:['src/components/tools/icons.js']
	}
};

const targets = [
	// ES module version, for modern browsers
	{
		input: 'src/main.js',
		output: {
			sourcemap: true,
			format: 'es',
			name: 'app',
			dir: 'public/build/module'
		},
		...options
	},
	// No module version for legacy browsers like Firefox 52.9 esr
	{
		input: 'src/main.js',
		output: {
			sourcemap: true,
			format: 'iife',
			inlineDynamicImports: true,
			name: 'app',
			dir: 'public/build/nomodule'
		},
		...options
	}
];

export default production ? [targets[0], targets[1]] : [targets[0]];

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
