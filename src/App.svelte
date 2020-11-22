<svelte:window on:keydown={handleKeydown}/>
<MatchIDHeader/>
{#if $route && $route.path && routes[$route.path] && routes[$route.path].component}
	<svelte:component this={routes[$route.path].component} {...routes[$route.path].props}/>
{/if}

<script>
	import { onMount } from 'svelte';
	import MatchIDHeader from './components/views/MatchIDHeader.svelte';
	import { version, route, searchInput, searchCanvas, current, resultsPerPage,
		updateURL, advancedSearch, fuzzySearch, displayMode, themeDnum
	} from './components/tools/stores.js';
	import { URLSearchSubmit } from './components/tools/search.js';
	import { routes } from './components/tools/routes.js';

	onMount(async () => {
		if ($version && !$version.api) {
			try {
				const r = await fetch('__BACKEND_PROXY_PATH__/version');
				$version.api = await r.json();
			} catch(e) {
			}
		}
	});

	$: if ($route.path === '/search') (URLSearchSubmit(new URLSearchParams(location.search)));
	$: element = document.getElementById('infoNotWorking');
	$: element.parentNode  && element.parentNode.removeChild(element);

	const handleKeydown = async (event) => {
		if (event.ctrlKey && event.altKey && event.key === 'd') {
			await themeDnum.update(v => v === 0 ? 1 : 0);
			console.log(`switch theme to ${$themeDnum ? 'DNUM' : 'public site'}`);
		}
	}

</script>


