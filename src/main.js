import App from './App.svelte';
import * as serviceWorker from './components/tools/serviceWorker';

const app = new App({
	target: document.body
});

export default app;

serviceWorker.unregister();
