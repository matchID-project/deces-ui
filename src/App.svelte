<svelte:window on:keydown={handleKeydown}/>
<MatchIDHeader/>
<main>
	{#if $route && $route.path && routes[$route.path] && routes[$route.path].component}
		<svelte:component this={routes[$route.path].component} {...routes[$route.path].props}/>
	{/if}
</main>

<script>
	import { onMount } from 'svelte';
	import MatchIDHeader from './components/views/MatchIDHeader.svelte';
	import { version, route, searchInput, searchCanvas, current, resultsPerPage,
		updateURL, advancedSearch, fuzzySearch, displayMode, themeDnum, wasSearched
	} from './components/tools/stores.js';
	import { URLSearchSubmit } from './components/tools/search.js';
	import { routes } from './components/tools/routes.js';
	import { register } from 'register-service-worker';

	onMount(async () => {
		if ($version && !$version.api) {
			try {
				const r = await fetch('__BACKEND_PROXY_PATH__/version');
				$version.api = await r.json();
			} catch(e) {
			}
		}
		if ('serviceWorker' in navigator) {
			register('/sw.js', {
				registrationOptions: { scope: './' },
				ready (registration) {
					console.log('Service worker is active.');
				},
				registered (registration) {
					console.log('Service worker has been registered.')
				},
				cached (registration) {
					console.log('Content has been cached for offline use.')
				},
				updatefound (registration) {
					console.log('New content is downloading.')
				},
				updated (registration) {
					console.log('New content is available; please refresh.');
					registration.unregister();
					window.location.reload(true);
				},
				offline () {
					console.log('No internet connection found. App is running in offline mode.')
				},
				error (error) {
					console.error('Error during service worker registration:', error)
				}
			});
		}
	});

	$: if ($route.path === '/search') (URLSearchSubmit(new URLSearchParams(location.search)));

	$: if ($wasSearched && ($route.path === '/search')) {
			document.title = `matchID - ${$wasSearched}`
		} else {
	        document.title = `matchID - ${routes[$route.path].title}`;
		};

	$: element = document.getElementById('infoNotWorking');
	$: element.parentNode  && element.parentNode.removeChild(element);

	const handleKeydown = async (event) => {
		if (event.ctrlKey && event.altKey && event.key === 'd') {
			await themeDnum.update(v => v === 0 ? 1 : 0);
			console.log(`switch theme to ${$themeDnum ? 'DNUM' : 'public site'}`);
		}
	}

</script>


