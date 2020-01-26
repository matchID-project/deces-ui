import App from './App.svelte';
import * as serviceWorker from './components/tools/serviceWorker';

const app = new App({
	target: document.body,
	props: {
		query: ''
	}
});

export default app;

serviceWorker.unregister();
